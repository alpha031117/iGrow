# ─── AWS Outputs ─────────────────────────────────────────────────────────────

output "aws_ai_gateway_url" {
  description = "AWS API Gateway base URL — set this as AWS_AI_GATEWAY_URL in Alibaba backend"
  value       = aws_apigatewayv2_api.ai_gateway.api_endpoint
}

output "aws_knowledge_base_id" {
  description = "Bedrock Knowledge Base ID — used by Lambda AI Gateway"
  value       = aws_bedrockagent_knowledge_base.igrow.id
}

output "aws_s3_kb_bucket" {
  description = "S3 bucket for knowledge base documents"
  value       = aws_s3_bucket.kb_documents.bucket
}

output "aws_opensearch_endpoint" {
  description = "OpenSearch Serverless collection endpoint"
  value       = aws_opensearchserverless_collection.vector_store.collection_endpoint
}

output "aws_lambda_function_name" {
  description = "Lambda AI Gateway function name"
  value       = aws_lambda_function.ai_gateway.function_name
}

# ─── Alibaba Cloud Outputs ───────────────────────────────────────────────────

output "alicloud_backend_public_ip" {
  description = "ECS backend public IP — set A record here for your domain"
  value       = alicloud_eip_address.backend.ip_address
}

output "alicloud_backend_api_url" {
  description = "iGrow backend API base URL"
  value       = "http://${alicloud_eip_address.backend.ip_address}"
}

output "alicloud_rds_connection_string" {
  description = "RDS PostgreSQL connection string (internal VPC)"
  value       = "postgresql://${var.db_username}@${alicloud_db_instance.main.connection_string}/${var.db_name}"
  sensitive   = true
}

output "alicloud_oss_mock_data_bucket" {
  description = "OSS bucket for mock transaction data"
  value       = alicloud_oss_bucket.mock_data.bucket
}

output "alicloud_log_project" {
  description = "Alibaba Cloud Log Service project name"
  value       = alicloud_log_project.main.project_name
}

# ─── Cross-Cloud Summary ─────────────────────────────────────────────────────

output "cross_cloud_summary" {
  description = "Key endpoints for dual-cloud wiring"
  value = {
    alibaba_backend  = "http://${alicloud_eip_address.backend.ip_address}"
    aws_ai_gateway   = aws_apigatewayv2_api.ai_gateway.api_endpoint
    aws_kb_id        = aws_bedrockagent_knowledge_base.igrow.id
    aws_kb_bucket    = aws_s3_bucket.kb_documents.bucket
  }
}
