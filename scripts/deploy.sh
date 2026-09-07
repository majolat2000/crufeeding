#!/bin/bash
# Lightweight deploy hook trigger — run: bash scripts/deploy.sh
set -e
HOOK="https://api.render.com/deploy/srv-daf8o2id0e5s73bavkag?key=4SfOxm8YWZM"
echo "Triggering Render deploy..."
curl -X POST "$HOOK"
echo "Deploy triggered. Check https://dashboard.render.com/web/srv-daf8o2id0e5s73bavkag/logs"
