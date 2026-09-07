#!/bin/bash
# Lightweight deploy hook trigger — run: bash scripts/deploy.sh
set -e
HOOK="https://api.render.com/deploy/srv-daf7jaon74is738nb1d0?key=rlOXPD7NHas"
echo "Triggering Render deploy..."
curl -X POST "$HOOK"
echo "Deploy triggered. Check https://dashboard.render.com/web/srv-daf7jaon74is738nb1d0/logs"
