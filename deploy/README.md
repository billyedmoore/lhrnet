# Deploying to the VPS

The site and the [proxy](../proxy/README.md) run on one Fedora VPS. Caddy serves the built
site from `/var/www/lhrnet` on `lhr.billyedmoore.com` (with its own Let's Encrypt certificate)
and forwards `/data` to the proxy, which runs as the `lhrnet-proxy` systemd service.

`deploy.sh user@host` builds the site, copies it to the server, copies the proxy source,
builds it on the server and restarts the service. The GitHub Action in
`.github/workflows/deploy.yml` runs it on every push to `main`.

## Secrets

+ In GitHub, in the environment `lhrnet (Production)` (it must match the `environment:` line
  in the workflow): secrets `SSH_PRIVATE_KEY` and `SSH_KNOWN_HOSTS`, and the variable
  `DEPLOY_TARGET` (`deploy@<host>`).
+ On the VPS, in `/etc/lhrnet-proxy.env`: the Open Sky credentials. Deploys don't touch it.
  Create it as root, then restart the service:

  ```bash
  install -m 600 /dev/null /etc/lhrnet-proxy.env
  echo 'OPENSKY_CLIENT_ID=...'     >> /etc/lhrnet-proxy.env
  echo 'OPENSKY_CLIENT_SECRET=...' >> /etc/lhrnet-proxy.env
  systemctl restart lhrnet-proxy
  ```

## Server setup

Already done, kept here in case the server needs rebuilding. As root:

```bash
dnf install caddy gcc make openssl-devel rsync
useradd -m deploy
install -d -o deploy -g deploy /opt/lhrnet /var/www/lhrnet
cp deploy/lhrnet-proxy.service /etc/systemd/system/
cp deploy/Caddyfile /etc/caddy/Caddyfile
systemctl daemon-reload && systemctl enable lhrnet-proxy && systemctl enable --now caddy
echo 'deploy ALL=(root) NOPASSWD: /usr/bin/systemctl restart lhrnet-proxy' > /etc/sudoers.d/lhrnet-deploy
chmod 440 /etc/sudoers.d/lhrnet-deploy
```

The service file and Caddyfile in this directory are copies of what is installed on the
server, `deploy.sh` doesn't apply them, so copy changes across by hand.

The DNS record for `lhr.billyedmoore.com` is an `A` record pointing at the VPS.

## Deploy key

The action logs in as the `deploy` user with a key used for nothing else. To replace it,
generate one with `ssh-keygen -t ed25519 -N "" -f lhrnet_deploy`, put the `.pub` in
`/home/deploy/.ssh/authorized_keys` prefixed with `restrict `, put the private key in the
`SSH_PRIVATE_KEY` secret, and delete the local files. Get `SSH_KNOWN_HOSTS` with
`ssh-keyscan -t ed25519 <host>` and check it against the fingerprint in your provider's console.
