# Open Sky proxy

A small caching proxy for the Open Sky states API, written in C. It lets the browser fetch
aircraft positions from the site's own origin and means all visitors share one upstream request.
It depends only on libc and the system OpenSSL, and speaks plain HTTP on `127.0.0.1`, so run
it behind Caddy or nginx.

`GET /data` returns the Open Sky states for a fixed bounding box around Heathrow. The box is
the `BOUNDS` define in `opensky_proxy.c`, worked out from `config.json`, so update it if the
`HeathrowLat`, `HeathrowLong`, `latOffset` or `longOffset` values change. Responses are cached
for 10 seconds, and if Open Sky fails or rate limits (429) the last good response is served.

## Build and run

You need `gcc`, `make` and the OpenSSL development headers.

```bash
make
./opensky_proxy
curl -i localhost:8080/data
```

## Configuration

Environment variables:

+ `PORT`: port to listen on (default `8080`).
+ `ALLOW_ORIGIN`: value of `Access-Control-Allow-Origin` (default `*`).
+ `OPENSKY_CLIENT_ID` and `OPENSKY_CLIENT_SECRET`: Open Sky API client credentials. If both are
  set the proxy authenticates, otherwise it makes anonymous requests. On a server they go in
  `/etc/lhrnet-proxy.env`, see the [deploy README](../deploy/README.md).
