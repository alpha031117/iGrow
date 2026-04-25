#!/usr/bin/env bash
# Quick check: are AWS credentials valid and can Bedrock be reached?
# Usage: bash scripts/check-bedrock.sh
#        or from project root: make check-bedrock

set -euo pipefail

ENV_FILE="frontend/.env.local"

# Load .env.local if present (local dev). In prod, env vars come from systemd/PM2.
if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source <(grep -E '^AWS_' "$ENV_FILE")
  set +a
fi

if [[ -z "${AWS_ACCESS_KEY_ID:-}" || -z "${AWS_SECRET_ACCESS_KEY:-}" ]]; then
  echo "❌  AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY not set in $ENV_FILE"
  exit 1
fi

REGION="${AWS_REGION:-ap-southeast-1}"
MODEL="anthropic.claude-haiku-4-5-20251001-v1:0"
ENDPOINT="https://bedrock-runtime.${REGION}.amazonaws.com/model/${MODEL}/converse"

echo "──────────────────────────────────────────"
echo " iGrow Bedrock health check"
echo " Region : $REGION"
echo " Model  : $MODEL"
echo " Key    : ${AWS_ACCESS_KEY_ID:0:8}…"
if [[ -n "${AWS_SESSION_TOKEN:-}" ]]; then
  echo " Session: ${AWS_SESSION_TOKEN:0:12}… (STS temp creds)"
fi
echo "──────────────────────────────────────────"

# Build a minimal Converse request body
BODY='{"messages":[{"role":"user","content":[{"text":"ping"}]}],"inferenceConfig":{"maxTokens":10}}'

# Sign + send with curl using AWS SigV4
# Requires: curl with --aws-sigv4 support (curl ≥ 7.75, standard on macOS 13+)
HTTP_STATUS=$(curl -s -o /tmp/bedrock_check_response.json -w "%{http_code}" \
  --request POST "$ENDPOINT" \
  --header "Content-Type: application/json" \
  --header "Accept: application/json" \
  --user "${AWS_ACCESS_KEY_ID}:${AWS_SECRET_ACCESS_KEY}" \
  --aws-sigv4 "aws:amz:${REGION}:bedrock" \
  ${AWS_SESSION_TOKEN:+--header "X-Amz-Security-Token: ${AWS_SESSION_TOKEN}"} \
  --data "$BODY" \
  --max-time 15)

RESPONSE=$(cat /tmp/bedrock_check_response.json)

if [[ "$HTTP_STATUS" == "200" ]]; then
  echo "✅  Bedrock OK (HTTP 200)"
  echo "   Response: $(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['output']['message']['content'][0]['text'])" 2>/dev/null || echo "$RESPONSE")"
elif [[ "$HTTP_STATUS" == "403" ]]; then
  echo "❌  Auth failed (HTTP 403) — credentials are expired or invalid"
  echo "   $(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('message',''))" 2>/dev/null || echo "$RESPONSE")"
  echo ""
  echo "   → Refresh your AWS STS credentials in $ENV_FILE"
  exit 1
elif [[ "$HTTP_STATUS" == "400" ]]; then
  echo "⚠️   Bad request (HTTP 400) — creds OK but request issue"
  echo "   $RESPONSE"
  exit 1
else
  echo "❌  Unexpected HTTP $HTTP_STATUS"
  echo "   $RESPONSE"
  exit 1
fi
