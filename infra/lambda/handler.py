import json
import os
import boto3

REGION            = os.environ.get("AWS_REGION", "ap-southeast-1")
KNOWLEDGE_BASE_ID = os.environ.get("KNOWLEDGE_BASE_ID", "")
MODEL_ID          = os.environ.get("MODEL_ID", "anthropic.claude-3-haiku-20240307-v1:0")

bedrock_runtime = boto3.client("bedrock-runtime", region_name=REGION)
bedrock_agent   = boto3.client("bedrock-agent-runtime", region_name=REGION)


def handler(event, context):
    path = event.get("rawPath", "/")
    body = json.loads(event.get("body") or "{}")

    routes = {
        "/api/ai/classify-business":  classify_business,
        "/api/ai/recommend-pathway":  recommend_pathway,
        "/api/ai/generate-checklist": generate_checklist,
        "/api/ai/generate-insight":   generate_insight,
        "/api/ai/explain-readiness":  explain_readiness,
    }

    fn = routes.get(path)
    if fn is None:
        return _response(404, {"error": "Not found", "path": path})

    try:
        return fn(body)
    except Exception as e:
        return _response(500, {"error": str(e)})


# ─── Route handlers ──────────────────────────────────────────────────────────

def classify_business(body):
    intake  = body.get("intake_answers", {})
    context = _retrieve("business classification merchant type pathway TNG")
    prompt  = f"""You are iGrow, the AI financial inclusion assistant for TNG.
Classify this micro-SME based on intake answers and knowledge context.

Knowledge context:
{context}

User intake answers:
{json.dumps(intake, indent=2)}

Return ONLY valid JSON matching this schema:
{{
  "business_type": "string (e.g. Home-Based Food Seller, Freelancer, Pasar Malam Trader)",
  "business_stage": "string (Early Active | Growing | Established)",
  "confidence": number (0.0–1.0),
  "recommended_pathway": ["string", ...]
}}

Rules:
- Never promise loan approval
- Never guarantee revenue growth
- Use the classification matrix from the knowledge base"""
    return _response(200, json.loads(_invoke(prompt)))


def recommend_pathway(body):
    business_type = body.get("business_type", "micro-business")
    context       = _retrieve(f"{business_type} TNG products recommendation merchant")
    prompt        = f"""You are iGrow, the AI financial inclusion assistant for TNG.
Recommend TNG products and services for: {business_type}

Knowledge context:
{context}

Return a warm, plain-language recommendation paragraph (2-3 sentences).
End with the disclaimer: "This is not financial advice."
Never promise guaranteed revenue growth."""
    return _response(200, {"recommendation": _invoke(prompt), "business_type": business_type})


def generate_checklist(body):
    business_type = body.get("business_type", "micro-business")
    context       = _retrieve(f"{business_type} onboarding checklist TNG Business Account")
    prompt        = f"""You are iGrow, the AI financial inclusion assistant for TNG.
Generate a personalised onboarding checklist for: {business_type}

Knowledge context:
{context}

Return ONLY valid JSON:
{{
  "business_type": "{business_type}",
  "checklist": [
    {{"task": "string", "status": "Pending | Ready | Optional", "note": "string"}}
  ]
}}"""
    return _response(200, json.loads(_invoke(prompt)))


def generate_insight(body):
    summary = body.get("transaction_summary", {})
    prompt  = f"""You are iGrow, the AI financial inclusion assistant for TNG.
Generate actionable cashflow insights for this merchant's transaction summary.

Transaction summary:
{json.dumps(summary, indent=2)}

Return ONLY valid JSON:
{{
  "insights": ["string", ...],
  "peak_period": "string",
  "trend": "Growing | Stable | Declining | Insufficient data",
  "recommended_action": "string"
}}

Rules:
- Be specific and actionable
- No guaranteed revenue claims
- Mention peak transaction times if available"""
    return _response(200, json.loads(_invoke(prompt)))


def explain_readiness(body):
    data    = body.get("readiness_data", {})
    context = _retrieve("BizCash readiness financing preparation transaction history")
    prompt  = f"""You are iGrow, the AI financial inclusion assistant for TNG.
Explain this financing readiness profile in plain, encouraging language.

Knowledge context:
{context}

Readiness data:
{json.dumps(data, indent=2)}

Return ONLY valid JSON:
{{
  "readiness_level": "Building | Approaching | Ready",
  "readiness_score": number (0–100),
  "plain_explanation": "string (2-3 warm sentences)",
  "next_steps": ["string", ...]
}}

Rules:
- Say "readiness profile", never "credit score"
- Never promise loan approval
- Be encouraging but honest about gaps"""
    return _response(200, json.loads(_invoke(prompt)))


# ─── Helpers ─────────────────────────────────────────────────────────────────

def _invoke(prompt: str) -> str:
    resp = bedrock_runtime.invoke_model(
        modelId=MODEL_ID,
        body=json.dumps({
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 1024,
            "messages": [{"role": "user", "content": prompt}],
        }),
    )
    result = json.loads(resp["body"].read())
    return result["content"][0]["text"]


def _retrieve(query: str) -> str:
    if not KNOWLEDGE_BASE_ID:
        return ""
    resp = bedrock_agent.retrieve(
        knowledgeBaseId=KNOWLEDGE_BASE_ID,
        retrievalQuery={"text": query},
        retrievalConfiguration={"vectorSearchConfiguration": {"numberOfResults": 3}},
    )
    return "\n\n".join(r["content"]["text"] for r in resp.get("retrievalResults", []))


def _response(status: int, body: dict) -> dict:
    return {
        "statusCode": status,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(body),
    }
