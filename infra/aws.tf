data "aws_caller_identity" "current" {}

# ─── S3: Knowledge Base Documents ────────────────────────────────────────────

resource "aws_s3_bucket" "kb_documents" {
  bucket        = "${local.prefix}-kb-documents"
  force_destroy = true
  tags          = local.common_tags
}

resource "aws_s3_bucket_versioning" "kb_documents" {
  bucket = aws_s3_bucket.kb_documents.id
  versioning_configuration { status = "Enabled" }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "kb_documents" {
  bucket = aws_s3_bucket.kb_documents.id
  rule {
    apply_server_side_encryption_by_default { sse_algorithm = "AES256" }
  }
}

resource "aws_s3_bucket_public_access_block" "kb_documents" {
  bucket                  = aws_s3_bucket.kb_documents.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ─── S3 Objects: Knowledge Base Content ──────────────────────────────────────

resource "aws_s3_object" "kb_business_account" {
  bucket       = aws_s3_bucket.kb_documents.id
  key          = "tng-products/business-account.md"
  content_type = "text/markdown"
  content      = <<-EOT
    # TNG Business Account
    Helps merchants separate business income from personal funds.
    Features: dedicated business wallet, merchant QR, sales dashboard, campaign tools.
    Eligibility: any TNG user with business activity. No SSM required to start.
    Benefit: cleaner cashflow records, easier financing readiness preparation.
  EOT
}

resource "aws_s3_object" "kb_merchant_qr" {
  bucket       = aws_s3_bucket.kb_documents.id
  key          = "tng-products/merchant-qr.md"
  content_type = "text/markdown"
  content      = <<-EOT
    # TNG Merchant QR
    Allows businesses to accept customer payments digitally via QR scan.
    Setup: generate QR from Business Account. Print poster, share on WhatsApp, or display at stall.
    Benefit: faster payments, auto-recorded transactions, reduced cash handling errors.
    Best for: pasar malam traders, home sellers, freelancers, social sellers.
  EOT
}

resource "aws_s3_object" "kb_merchant_dashboard" {
  bucket       = aws_s3_bucket.kb_documents.id
  key          = "tng-products/merchant-dashboard.md"
  content_type = "text/markdown"
  content      = <<-EOT
    # TNG Merchant Dashboard
    Provides weekly and monthly sales summaries for active merchants.
    Shows: top transaction times, repeat customer patterns, revenue trends.
    Use it to: identify peak hours, prepare stock, plan promotions.
  EOT
}

resource "aws_s3_object" "kb_campaign_tools" {
  bucket       = aws_s3_bucket.kb_documents.id
  key          = "tng-products/campaign-tools.md"
  content_type = "text/markdown"
  content      = <<-EOT
    # TNG Campaign Tools
    Enables merchants to run vouchers, cashback, and bundle promotions.
    Types: breakfast bundles, loyalty cashback, first-purchase vouchers.
    Best for: home food sellers, social sellers, small shops.
    Note: campaign performance varies. No guaranteed revenue outcome.
  EOT
}

resource "aws_s3_object" "kb_bizcash" {
  bucket       = aws_s3_bucket.kb_documents.id
  key          = "tng-products/bizcash-readiness.md"
  content_type = "text/markdown"
  content      = <<-EOT
    # BizCash Readiness
    BizCash is a working capital option for eligible active TNG merchants.
    Readiness indicators: 3+ months transaction history, consistent income, active Business Account.
    Important: readiness profile is NOT a credit score. Actual approval is subject to separate assessment.
    Never promise loan approval or guaranteed funding.
  EOT
}

resource "aws_s3_object" "kb_home_food_playbook" {
  bucket       = aws_s3_bucket.kb_documents.id
  key          = "incubator/home-food-seller-playbook.md"
  content_type = "text/markdown"
  content      = <<-EOT
    # Home-Based Food Seller Playbook
    Classification: Home-Based Food Seller

    Recommended pathway:
    1. Open TNG Business Account
    2. Generate Merchant QR
    3. Use QR for all business payments
    4. Review weekly sales dashboard
    5. Try breakfast or bundle campaign templates
    6. Build 3 months of clean transaction history

    Micro-incubator opportunities:
    - Breakfast promo template
    - First 10 QR payments activation challenge
    - WhatsApp order QR payment link

    Avoid:
    - Calling readiness a credit score
    - Promising loan approval
    - Guaranteeing revenue growth
  EOT
}

resource "aws_s3_object" "kb_freelancer_playbook" {
  bucket       = aws_s3_bucket.kb_documents.id
  key          = "incubator/freelancer-playbook.md"
  content_type = "text/markdown"
  content      = <<-EOT
    # Freelancer Playbook
    Classification: Freelancer

    Recommended pathway:
    1. Open TNG Business Account
    2. Use account exclusively for client payment receipts
    3. Track monthly income per client via dashboard
    4. Build consistent monthly income history
    5. Explore BizCash readiness after 3 months

    Micro-incubator opportunities:
    - Invoice/payment tracking
    - Client payment QR link

    Note: SSM not required to start. Recommended later for financing readiness.
  EOT
}

resource "aws_s3_object" "kb_social_seller_playbook" {
  bucket       = aws_s3_bucket.kb_documents.id
  key          = "incubator/social-seller-playbook.md"
  content_type = "text/markdown"
  content      = <<-EOT
    # Social Seller Playbook
    Classification: Social Seller (Instagram, TikTok, WhatsApp)

    Recommended pathway:
    1. Open TNG Business Account
    2. Generate Merchant QR for WhatsApp payment link
    3. Share QR in bio or order confirmation messages
    4. Use campaign voucher tools for follower promotions
    5. Track weekly order volume

    Micro-incubator opportunities:
    - QR payment link for WhatsApp orders
    - First-purchase voucher campaign
    - Follower loyalty cashback
  EOT
}

resource "aws_s3_object" "kb_pasar_malam_playbook" {
  bucket       = aws_s3_bucket.kb_documents.id
  key          = "incubator/pasar-malam-trader-playbook.md"
  content_type = "text/markdown"
  content      = <<-EOT
    # Pasar Malam Trader Playbook
    Classification: Pasar Malam Trader / Informal Merchant

    Recommended pathway:
    1. Open TNG Business Account
    2. Generate Merchant QR — print poster for stall display
    3. Track daily sales from dashboard
    4. Build consistent transaction history
    5. Prepare for BizCash readiness after 3 months

    Micro-incubator opportunities:
    - Offline QR poster + daily sales summary
    - First 10 QR payments activation challenge
  EOT
}

resource "aws_s3_object" "kb_compliance" {
  bucket       = aws_s3_bucket.kb_documents.id
  key          = "compliance/safe-financial-language.md"
  content_type = "text/markdown"
  content      = <<-EOT
    # Safe Financial Language Guidelines

    AVOID → USE INSTEAD:
    - "AI decides who gets financial products" → "AI identifies potential fit and recommends pathway with user consent"
    - "AI gives a credit score" → "AI creates a financing readiness profile"
    - "AI approves loans" → "AI helps users prepare for financing and supports existing approval processes"
    - "You can earn 30% more" → "Similar merchant tools may help you manage and grow your business better"
    - "You qualify for BizCash" → "You may be ready to explore BizCash preparation"

    Always:
    - Include disclaimer: "This is not financial advice."
    - Require user consent before any onboarding action
    - Use "readiness profile", never "credit score"
    - Allow clear opt-out at every stage
  EOT
}

# ─── IAM: Bedrock Knowledge Base Role ────────────────────────────────────────

data "aws_iam_policy_document" "bedrock_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["bedrock.amazonaws.com"]
    }
    condition {
      test     = "StringEquals"
      variable = "aws:SourceAccount"
      values   = [data.aws_caller_identity.current.account_id]
    }
  }
}

resource "aws_iam_role" "bedrock_kb" {
  name               = "${local.prefix}-bedrock-kb-role"
  assume_role_policy = data.aws_iam_policy_document.bedrock_assume_role.json
  tags               = local.common_tags
}

data "aws_iam_policy_document" "bedrock_kb" {
  statement {
    sid     = "S3Read"
    actions = ["s3:GetObject", "s3:ListBucket"]
    resources = [
      aws_s3_bucket.kb_documents.arn,
      "${aws_s3_bucket.kb_documents.arn}/*",
    ]
  }

  statement {
    sid       = "OpenSearchAccess"
    actions   = ["aoss:APIAccessAll"]
    resources = [aws_opensearchserverless_collection.vector_store.arn]
  }

  statement {
    sid     = "EmbeddingModelAccess"
    actions = ["bedrock:InvokeModel"]
    resources = [var.bedrock_embedding_model_arn]
  }
}

resource "aws_iam_role_policy" "bedrock_kb" {
  name   = "${local.prefix}-bedrock-kb-policy"
  role   = aws_iam_role.bedrock_kb.id
  policy = data.aws_iam_policy_document.bedrock_kb.json
}

# ─── IAM: Lambda AI Gateway Role ─────────────────────────────────────────────

data "aws_iam_policy_document" "lambda_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "lambda_ai_gateway" {
  name               = "${local.prefix}-lambda-ai-gateway"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
  tags               = local.common_tags
}

data "aws_iam_policy_document" "lambda_ai_gateway" {
  statement {
    sid = "BedrockInference"
    actions = [
      "bedrock:InvokeModel",
      "bedrock:InvokeModelWithResponseStream",
    ]
    resources = ["arn:aws:bedrock:${var.aws_region}::foundation-model/*"]
  }

  statement {
    sid       = "BedrockKBRetrieve"
    actions   = ["bedrock:Retrieve", "bedrock:RetrieveAndGenerate"]
    resources = [aws_bedrockagent_knowledge_base.igrow.arn]
  }

  statement {
    sid       = "OpenSearchAccess"
    actions   = ["aoss:APIAccessAll"]
    resources = [aws_opensearchserverless_collection.vector_store.arn]
  }

  statement {
    sid = "CloudWatchLogs"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    resources = ["arn:aws:logs:*:*:*"]
  }
}

resource "aws_iam_role_policy" "lambda_ai_gateway" {
  name   = "${local.prefix}-lambda-ai-gateway-policy"
  role   = aws_iam_role.lambda_ai_gateway.id
  policy = data.aws_iam_policy_document.lambda_ai_gateway.json
}

# ─── OpenSearch Serverless: Vector Store ─────────────────────────────────────

resource "aws_opensearchserverless_security_policy" "encryption" {
  name = "${local.prefix}-enc"
  type = "encryption"
  policy = jsonencode({
    Rules = [{
      Resource     = ["collection/${local.prefix}-vector-store"]
      ResourceType = "collection"
    }]
    AWSOwnedKey = true
  })
}

resource "aws_opensearchserverless_security_policy" "network" {
  name = "${local.prefix}-net"
  type = "network"
  policy = jsonencode([{
    Rules = [
      {
        Resource     = ["collection/${local.prefix}-vector-store"]
        ResourceType = "collection"
      },
      {
        Resource     = ["collection/${local.prefix}-vector-store"]
        ResourceType = "dashboard"
      },
    ]
    AllowFromPublic = true
  }])
}

resource "aws_opensearchserverless_access_policy" "vector_store" {
  name = "${local.prefix}-access"
  type = "data"
  policy = jsonencode([{
    Rules = [
      {
        Resource     = ["collection/${local.prefix}-vector-store"]
        ResourceType = "collection"
        Permission = [
          "aoss:CreateCollectionItems",
          "aoss:DeleteCollectionItems",
          "aoss:UpdateCollectionItems",
          "aoss:DescribeCollectionItems",
        ]
      },
      {
        Resource     = ["index/${local.prefix}-vector-store/*"]
        ResourceType = "index"
        Permission = [
          "aoss:CreateIndex",
          "aoss:DeleteIndex",
          "aoss:UpdateIndex",
          "aoss:DescribeIndex",
          "aoss:ReadDocument",
          "aoss:WriteDocument",
        ]
      },
    ]
    Principal = [
      aws_iam_role.bedrock_kb.arn,
      aws_iam_role.lambda_ai_gateway.arn,
      "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root",
    ]
  }])
}

resource "aws_opensearchserverless_collection" "vector_store" {
  name = "${local.prefix}-vector-store"
  type = "VECTORSEARCH"
  tags = local.common_tags

  depends_on = [
    aws_opensearchserverless_security_policy.encryption,
    aws_opensearchserverless_security_policy.network,
  ]
}

# ─── Bedrock Knowledge Base ───────────────────────────────────────────────────

resource "aws_bedrockagent_knowledge_base" "igrow" {
  name     = "${local.prefix}-knowledge-base"
  role_arn = aws_iam_role.bedrock_kb.arn
  tags     = local.common_tags

  knowledge_base_configuration {
    type = "VECTOR"
    vector_knowledge_base_configuration {
      embedding_model_arn = var.bedrock_embedding_model_arn
    }
  }

  storage_configuration {
    type = "OPENSEARCH_SERVERLESS"
    opensearch_serverless_configuration {
      collection_arn    = aws_opensearchserverless_collection.vector_store.arn
      vector_index_name = "${local.prefix}-kb-index"
      field_mapping {
        vector_field   = "vector"
        text_field     = "text"
        metadata_field = "metadata"
      }
    }
  }

  depends_on = [aws_iam_role_policy.bedrock_kb]
}

resource "aws_bedrockagent_data_source" "s3_docs" {
  name              = "${local.prefix}-s3-docs"
  knowledge_base_id = aws_bedrockagent_knowledge_base.igrow.id

  data_source_configuration {
    type = "S3"
    s3_configuration {
      bucket_arn = aws_s3_bucket.kb_documents.arn
    }
  }

  vector_ingestion_configuration {
    chunking_configuration {
      chunking_strategy = "FIXED_SIZE"
      fixed_size_chunking_configuration {
        max_tokens         = 512
        overlap_percentage = 20
      }
    }
  }
}

# ─── Lambda: AI Gateway ───────────────────────────────────────────────────────

data "archive_file" "lambda_ai_gateway" {
  type        = "zip"
  source_dir  = "${path.module}/lambda"
  output_path = "${path.module}/.lambda_ai_gateway.zip"
}

resource "aws_lambda_function" "ai_gateway" {
  function_name    = "${local.prefix}-ai-gateway"
  role             = aws_iam_role.lambda_ai_gateway.arn
  handler          = "handler.handler"
  runtime          = "python3.12"
  filename         = data.archive_file.lambda_ai_gateway.output_path
  source_code_hash = data.archive_file.lambda_ai_gateway.output_base64sha256
  timeout          = 60
  memory_size      = 512
  tags             = local.common_tags

  environment {
    variables = {
      KNOWLEDGE_BASE_ID = aws_bedrockagent_knowledge_base.igrow.id
      MODEL_ID          = var.bedrock_llm_model_id
    }
  }

  depends_on = [aws_iam_role_policy.lambda_ai_gateway]
}

resource "aws_cloudwatch_log_group" "lambda_ai_gateway" {
  name              = "/aws/lambda/${aws_lambda_function.ai_gateway.function_name}"
  retention_in_days = 14
  tags              = local.common_tags
}

# ─── API Gateway: HTTP API for AI Gateway ─────────────────────────────────────

resource "aws_apigatewayv2_api" "ai_gateway" {
  name          = "${local.prefix}-ai-gateway"
  protocol_type = "HTTP"
  tags          = local.common_tags

  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["POST", "OPTIONS"]
    allow_headers = ["Content-Type", "Authorization", "X-Requested-With"]
    max_age       = 300
  }
}

resource "aws_apigatewayv2_stage" "ai_gateway" {
  api_id      = aws_apigatewayv2_api.ai_gateway.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_apigatewayv2_integration" "lambda_ai_gateway" {
  api_id                 = aws_apigatewayv2_api.ai_gateway.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.ai_gateway.invoke_arn
  payload_format_version = "2.0"
}

locals {
  ai_routes = [
    "POST /api/ai/classify-business",
    "POST /api/ai/recommend-pathway",
    "POST /api/ai/generate-checklist",
    "POST /api/ai/generate-insight",
    "POST /api/ai/explain-readiness",
  ]
}

resource "aws_apigatewayv2_route" "ai_gateway" {
  for_each  = toset(local.ai_routes)
  api_id    = aws_apigatewayv2_api.ai_gateway.id
  route_key = each.value
  target    = "integrations/${aws_apigatewayv2_integration.lambda_ai_gateway.id}"
}

resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ai_gateway.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.ai_gateway.execution_arn}/*/*"
}
