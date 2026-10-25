/*
 * Tiny caching proxy for the Open Sky states API, so the browser avoids its
 * CORS restrictions and visitors share one upstream request.
 *
 *   GET /data  ->  https://opensky-network.org/api/states/all?<BOUNDS>
 *
 * The bounding box is fixed (Heathrow +- latOffset/longOffset from config.json,
 * keep them in sync), so this can't be used as a general Open Sky proxy.
 *
 * Plain HTTP on 127.0.0.1:$PORT (default 8080); put Caddy/nginx in front for TLS.
 * If OPENSKY_CLIENT_ID and OPENSKY_CLIENT_SECRET are set, upstream requests are
 * authenticated with an OAuth2 client-credentials token (higher rate limits).
 * Single-threaded on purpose. Only libc and the system OpenSSL (for the HTTPS
 * upstream) are used.
 */
#define _GNU_SOURCE
#include <netdb.h>
#include <openssl/ssl.h>
#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <arpa/inet.h>
#include <sys/socket.h>
#include <time.h>
#include <unistd.h>

#define HOST "opensky-network.org"
#define AUTH_HOST "auth.opensky-network.org"
#define AUTH_PATH "/auth/realms/opensky-network/protocol/openid-connect/token"
#define BACKOFF_SECONDS 60
#define BOUNDS "lamin=51.1575&lamax=51.7975&lomin=-1.741389&lomax=0.818611"
#define MAX_BODY (4 * 1024 * 1024)

static SSL_CTX *ctx;
static char *cached_body;
static size_t cached_len;
static time_t cached_at, backoff_until, token_expires;
static char token[2048];
static int cache_seconds = 25; /* overridden by $CACHE_SECONDS */

static void log_request(int status, const char *cache) {
  char when[32];
  time_t now = time(NULL);
  strftime(when, sizeof when, "%Y-%m-%dT%H:%M:%SZ", gmtime(&now));
  fprintf(stderr, "%s %d %s %s\n", when, status, cache, *token ? "auth" : "anon");
}

static void reply(int fd, int status, const char *extra, const char *body, size_t len) {
  const char *origin = getenv("ALLOW_ORIGIN") ? getenv("ALLOW_ORIGIN") : "*";
  char head[256];
  int n = snprintf(head, sizeof head,
                   "HTTP/1.1 %d X\r\nContent-Type: application/json\r\nContent-Length: %zu\r\n"
                   "Access-Control-Allow-Origin: %s\r\nConnection: close\r\n%s\r\n",
                   status, len, origin, extra);
  send(fd, head, n, MSG_NOSIGNAL);
  send(fd, body, len, MSG_NOSIGNAL);
}

static void reply_error(int fd, int status, const char *message) {
  char body[64];
  log_request(status, "-");
  reply(fd, status, "", body, snprintf(body, sizeof body, "{\"error\":\"%s\"}", message));
}

static void reply_cached(int fd, const char *state) {
  char extra[64];
  log_request(200, state);
  snprintf(extra, sizeof extra, "Cache-Control: public, max-age=%d\r\nX-Cache: %s\r\n",
           cache_seconds, state);
  reply(fd, 200, extra, cached_body, cached_len);
}

static void set_timeouts(int fd) {
  struct timeval tv = { .tv_sec = 10 };
  setsockopt(fd, SOL_SOCKET, SO_RCVTIMEO, &tv, sizeof tv);
  setsockopt(fd, SOL_SOCKET, SO_SNDTIMEO, &tv, sizeof tv);
}

/* One HTTPS request. Returns the status, with *body pointing into buf, or -1 on failure. */
static int https_request(const char *host, const char *req, char *buf, size_t cap, char **body) {
  struct addrinfo hints = { .ai_socktype = SOCK_STREAM }, *res, *ai;
  if (getaddrinfo(host, "443", &hints, &res) != 0) return -1;
  int fd = -1, status = -1;
  for (ai = res; ai; ai = ai->ai_next) {
    fd = socket(ai->ai_family, ai->ai_socktype, ai->ai_protocol);
    if (fd < 0) continue;
    set_timeouts(fd);
    if (connect(fd, ai->ai_addr, ai->ai_addrlen) == 0) break;
    close(fd);
    fd = -1;
  }
  freeaddrinfo(res);
  if (fd < 0) return -1;

  SSL *ssl = SSL_new(ctx);
  if (!ssl) goto out;
  SSL_set_fd(ssl, fd);
  SSL_set_tlsext_host_name(ssl, host);
  SSL_set1_host(ssl, host);
  if (SSL_connect(ssl) != 1 || SSL_write(ssl, req, strlen(req)) <= 0) goto out;

  /* HTTP/1.0 + identity encoding means no chunking: the body runs to EOF. */
  size_t used = 0;
  int r;
  while (used < cap && (r = SSL_read(ssl, buf + used, cap - used)) > 0) used += r;
  buf[used] = '\0';
  if (strncmp(buf, "HTTP/1.", 7) == 0 && (*body = strstr(buf, "\r\n\r\n"))) {
    *body += 4;
    status = atoi(buf + 9);
  }

out:
  if (ssl) SSL_free(ssl);
  close(fd);
  return status;
}

/* Fetches an OAuth2 token from OPENSKY_CLIENT_ID / OPENSKY_CLIENT_SECRET, if set. */
static int refresh_token(void) {
  const char *id = getenv("OPENSKY_CLIENT_ID"), *secret = getenv("OPENSKY_CLIENT_SECRET");
  if (!id || !secret) return 0; /* anonymous */
  char form[512], req[1024], buf[8192], *body, *p;
  int n = snprintf(form, sizeof form, "grant_type=client_credentials&client_id=%s&client_secret=%s", id, secret);
  snprintf(req, sizeof req,
           "POST " AUTH_PATH " HTTP/1.0\r\nHost: " AUTH_HOST "\r\n"
           "Content-Type: application/x-www-form-urlencoded\r\nContent-Length: %d\r\n\r\n%s", n, form);
  if (https_request(AUTH_HOST, req, buf, sizeof buf - 1, &body) != 200 ||
      !(p = strstr(body, "\"access_token\":\"")) ) {
    fprintf(stderr, "Open Sky token request failed\n");
    return -1;
  }
  p += strlen("\"access_token\":\"");
  snprintf(token, sizeof token, "%.*s", (int)strcspn(p, "\""), p);
  p = strstr(body, "\"expires_in\":");
  token_expires = time(NULL) + (p ? atoi(p + 13) : 300) - 30;
  return 0;
}

/* Returns the upstream status (body stored in the cache slot on 200), or -1 on failure. */
static int fetch_upstream(void) {
  if (time(NULL) >= token_expires && refresh_token() != 0) return -1;
  char auth[2200] = "", req[2400], *body;
  if (*token) snprintf(auth, sizeof auth, "Authorization: Bearer %s\r\n", token);
  snprintf(req, sizeof req, "GET /api/states/all?" BOUNDS " HTTP/1.0\r\nHost: " HOST "\r\n"
           "%sAccept-Encoding: identity\r\n\r\n", auth);

  char *buf = malloc(MAX_BODY + 1);
  int status = buf ? https_request(HOST, req, buf, MAX_BODY, &body) : -1;
  if (status == 200) {
    free(cached_body);
    cached_len = strlen(buf) - (body - buf);
    cached_body = memcpy(malloc(cached_len), body, cached_len);
    cached_at = time(NULL);
  } else if (status == 429) {
    backoff_until = time(NULL) + BACKOFF_SECONDS;
  } else if (status == 401) {
    token_expires = 0; /* force a refresh next time */
  }
  free(buf);
  return status;
}

static void handle(int fd) {
  set_timeouts(fd);
  char req[4096], path[256];
  ssize_t n = recv(fd, req, sizeof req - 1, 0);
  if (n <= 0) return;
  req[n] = '\0';

  if (sscanf(req, "GET %255s", path) != 1 || strcmp(path, "/data") != 0)
    return reply_error(fd, 404, "not found");

  int have = cached_body != NULL;
  if (have && time(NULL) - cached_at < cache_seconds) return reply_cached(fd, "HIT");

  int status = time(NULL) < backoff_until ? 429 : fetch_upstream();
  if (status == 200) return reply_cached(fd, "MISS");
  fprintf(stderr, "Open Sky request failed: %d\n", status);
  if (have) return reply_cached(fd, "STALE");
  reply_error(fd, status == 429 ? 429 : 502, status == 429 ? "rate limited" : "upstream failure");
}

int main(void) {
  signal(SIGPIPE, SIG_IGN);
  if (getenv("CACHE_SECONDS") && atoi(getenv("CACHE_SECONDS")) > 0) cache_seconds = atoi(getenv("CACHE_SECONDS"));
  ctx = SSL_CTX_new(TLS_client_method());
  SSL_CTX_set_default_verify_paths(ctx);
  SSL_CTX_set_verify(ctx, SSL_VERIFY_PEER, NULL);

  struct sockaddr_in addr = { .sin_family = AF_INET, .sin_addr.s_addr = htonl(INADDR_LOOPBACK),
                              .sin_port = htons(getenv("PORT") ? atoi(getenv("PORT")) : 8080) };
  int server = socket(AF_INET, SOCK_STREAM, 0), one = 1;
  setsockopt(server, SOL_SOCKET, SO_REUSEADDR, &one, sizeof one);
  if (bind(server, (struct sockaddr *)&addr, sizeof addr) != 0 || listen(server, 16) != 0) {
    perror("listen");
    return 1;
  }
  for (;;) {
    int fd = accept(server, NULL, NULL);
    if (fd < 0) continue;
    handle(fd);
    close(fd);
  }
}
