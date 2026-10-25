#!/usr/bin/env bash
# Builds the site and deploys it and the proxy to the VPS. Usage: deploy/deploy.sh user@host
# One-time VPS setup is in deploy/README.md.
set -euo pipefail

target=${1:?usage: deploy.sh user@host}
cd "$(dirname "$0")/.."

(
  cd web
  [ -d node_modules ] || npm ci
  npm run build
)

rsync -az --delete --chmod=D755,F644 web/dist/ "$target:/var/www/lhrnet/"

# Build the proxy on the VPS so the binary matches its libc/OpenSSL.
rsync -az --delete --exclude opensky_proxy proxy/ "$target:build/"

ssh "$target" 'bash -s' <<'REMOTE'
set -euo pipefail
cd build
make -B
install -m 755 opensky_proxy /opt/lhrnet/opensky_proxy.new
mv /opt/lhrnet/opensky_proxy.new /opt/lhrnet/opensky_proxy
sudo systemctl restart lhrnet-proxy
sleep 1
systemctl is-active --quiet lhrnet-proxy
echo "site and lhrnet-proxy deployed"
REMOTE
