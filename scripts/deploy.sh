#!/usr/bin/env bash
set -euo pipefail

app_directory="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$app_directory"

test -f .env

npm ci

set -a
source .env
set +a

npm run migrate up
npm prune --omit=dev

sudo cp nginx.conf /etc/nginx/sites-available/forum-api
sudo nginx -t
sudo systemctl restart forum-api
sudo systemctl reload nginx

for _ in {1..10}; do
  response="$(curl --silent --show-error https://forum-api-denihidayat.duckdns.org/ || true)"

  if [[ "$response" == '{"status":"fail","message":"Route not found"}' ]]; then
    exit 0
  fi

  sleep 2
done

exit 1
