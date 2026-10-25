# Deploying to the VPS

`deploy.sh user@host` rsyncs the built site (`web/dist`) to `/var/www/lhrnet`, rsyncs
`proxy/` to the VPS, builds it there, swaps the binary into `/opt/lhrnet/` and restarts
the `lhrnet-proxy` service. Caddy serves the site on `lhr.billyedmoore.com` and
forwards `/data` to the proxy on `127.0.0.1:8080`. The GitHub Action in
`.github/workflows/deploy.yml` builds the site and runs the script on every push to `main`.

## One-time VPS setup (Fedora, as root)

```bash
dnf install caddy gcc make openssl-devel rsync
useradd -m deploy
install -d -o deploy -g deploy /opt/lhrnet /var/www/lhrnet
cp deploy/lhrnet-proxy.service /etc/systemd/system/
cp deploy/Caddyfile /etc/caddy/Caddyfile
systemctl daemon-reload && systemctl enable lhrnet-proxy && systemctl enable --now caddy

# deploy may restart this one service and nothing else
echo 'deploy ALL=(root) NOPASSWD: /usr/bin/systemctl restart lhrnet-proxy' > /etc/sudoers.d/lhrnet-deploy
chmod 440 /etc/sudoers.d/lhrnet-deploy

# OpenSky credentials stay on the VPS (optional, for higher rate limits)
install -m 600 /dev/null /etc/lhrnet-proxy.env
echo 'OPENSKY_CLIENT_ID=...'     >> /etc/lhrnet-proxy.env
echo 'OPENSKY_CLIENT_SECRET=...' >> /etc/lhrnet-proxy.env
```

Point the `lhr.billyedmoore.com` DNS record at the VPS; Caddy then gets its own
Let's Encrypt certificate. If the record is proxied by Cloudflare, set SSL/TLS to
Full (strict).

## Keys

On your own machine, make a key used for nothing else:

```bash
ssh-keygen -t ed25519 -N "" -C "lhrnet-deploy" -f lhrnet_deploy
```

- Append `lhrnet_deploy.pub` to `/home/deploy/.ssh/authorized_keys` on the VPS,
  prefixed with `restrict ` (disables port/agent/X11 forwarding and ptys).
- In GitHub: Settings -> Environments -> `production`, add
  - secret `SSH_PRIVATE_KEY`: contents of `lhrnet_deploy`
  - secret `SSH_KNOWN_HOSTS`: output of `ssh-keyscan -t ed25519 <host>`, run once
    from a network you trust and checked against the host key fingerprint in your
    VPS provider's console
  - variable `DEPLOY_TARGET`: `deploy@<host>`
- Delete the local `lhrnet_deploy` files afterwards.
