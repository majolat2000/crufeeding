#!/bin/bash
# Lightweight deploy hook trigger
# Usage: RENDER_DEPLOY_HOOK="https://api.render.com/deploy/..." bash scripts/deploy.sh
set -e

HOOK="${RENDER_DEPLOY_HOOK:-}"

if [ -z "$HOOK" ]; then
  echo "Error: RENDER_DEPLOY_HOOK environment variable is not set."
  echo "Usage: export RENDER_DEPLOY_HOOK=\"https://api.render.com/deploy/...\" && bash scripts/deploy.sh"
  exit 1
fi

echo "Triggering Render deploy..."
curl -X POST "$HOOK"
echo "Deploy triggered."
