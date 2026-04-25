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

echo "──────────────────────────────────────────"
echo " iGrow Bedrock health check"
echo " Region : $REGION"
echo " Model  : global.$MODEL (cross-region inference profile)"
echo " Key    : ${AWS_ACCESS_KEY_ID:0:8}…"
if [[ -n "${AWS_SESSION_TOKEN:-}" ]]; then
  echo " Session: ${AWS_SESSION_TOKEN:0:12}… (STS temp creds)"
fi
echo "──────────────────────────────────────────"

# Use Python for SigV4 signing — works on any Python 3.6+ without extra deps
python3 - <<PYEOF
import os, sys, json, hashlib, hmac, datetime
try:
    from urllib.request import urlopen, Request
    from urllib.error import HTTPError
    from urllib.parse import quote
except ImportError:
    print("❌  Python 3 required")
    sys.exit(1)

key_id     = os.environ["AWS_ACCESS_KEY_ID"]
secret     = os.environ["AWS_SECRET_ACCESS_KEY"]
token      = os.environ.get("AWS_SESSION_TOKEN", "")
region     = os.environ.get("AWS_REGION", "ap-southeast-1")
model      = "global.anthropic.claude-haiku-4-5-20251001-v1:0"
host       = f"bedrock-runtime.{region}.amazonaws.com"
# Use plain colon in URL — `:` is valid in URI path segments
# Encode only in canonical_uri below (SigV4 requires it there)
endpoint   = f"https://{host}/model/{model}/converse"
service    = "bedrock"
body       = json.dumps({"messages":[{"role":"user","content":[{"text":"ping"}]}],"inferenceConfig":{"maxTokens":10}}).encode()

def sign(key, msg):
    return hmac.new(key, msg.encode("utf-8"), hashlib.sha256).digest()

def get_sig_key(secret_key, date_stamp, region_name, service_name):
    k = sign(("AWS4" + secret_key).encode("utf-8"), date_stamp)
    k = sign(k, region_name)
    k = sign(k, service_name)
    return sign(k, "aws4_request")

now        = datetime.datetime.utcnow()
amz_date   = now.strftime("%Y%m%dT%H%M%SZ")
date_stamp = now.strftime("%Y%m%d")

payload_hash = hashlib.sha256(body).hexdigest()
canonical_uri = f"/model/{quote(model, safe='')}/converse"
canonical_qs  = ""
headers_dict  = {
    "content-type": "application/json",
    "host": host,
    "x-amz-date": amz_date,
    "x-amz-content-sha256": payload_hash,
}
if token:
    headers_dict["x-amz-security-token"] = token

signed_headers = ";".join(sorted(headers_dict))
canonical_headers = "".join(f"{k}:{v}\n" for k, v in sorted(headers_dict.items()))
canonical_request = "\n".join(["POST", canonical_uri, canonical_qs, canonical_headers, signed_headers, payload_hash])

cred_scope     = f"{date_stamp}/{region}/{service}/aws4_request"
string_to_sign = "\n".join(["AWS4-HMAC-SHA256", amz_date, cred_scope, hashlib.sha256(canonical_request.encode()).hexdigest()])
sig_key        = get_sig_key(secret, date_stamp, region, service)
signature      = hmac.new(sig_key, string_to_sign.encode("utf-8"), hashlib.sha256).hexdigest()
auth_header    = (f"AWS4-HMAC-SHA256 Credential={key_id}/{cred_scope}, "
                  f"SignedHeaders={signed_headers}, Signature={signature}")

req_headers = {k: v for k, v in headers_dict.items() if k != "host"}
req_headers["Authorization"] = auth_header

req = Request(endpoint, data=body, headers=req_headers, method="POST")
try:
    with urlopen(req, timeout=15) as resp:
        data = json.loads(resp.read())
        reply = data["output"]["message"]["content"][0]["text"]
        print(f"✅  Bedrock OK (HTTP 200) — model replied: {reply!r}")
        sys.exit(0)
except HTTPError as e:
    body_text = e.read().decode("utf-8", errors="replace")
    try:
        msg = json.loads(body_text).get("message", body_text)
    except Exception:
        msg = body_text[:200]
    if e.code == 403:
        print(f"❌  Auth failed (HTTP 403) — credentials are expired or invalid")
        print(f"   {msg}")
        print()
        print("   → Refresh your AWS STS credentials in frontend/.env.local (local)")
        print("     or update AWS_* env vars in your systemd/PM2 config (prod)")
        sys.exit(1)
    else:
        print(f"❌  HTTP {e.code}: {msg}")
        sys.exit(1)
except Exception as ex:
    print(f"❌  Request failed: {ex}")
    sys.exit(1)
PYEOF
