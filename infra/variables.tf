variable "project_name" {
  description = "Project name prefix for all resources"
  type        = string
  default     = "igrow"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "prod"
}

# ─── AWS ─────────────────────────────────────────────────────────────────────

variable "aws_region" {
  description = "AWS region (ap-southeast-1 = Singapore, closest to MY)"
  type        = string
  default     = "ap-southeast-1"
}

variable "bedrock_llm_model_id" {
  description = "Bedrock LLM model ID for AI gateway inference"
  type        = string
  default     = "anthropic.claude-3-haiku-20240307-v1:0"
}

variable "bedrock_embedding_model_arn" {
  description = "Bedrock embedding model ARN for knowledge base"
  type        = string
  default     = "arn:aws:bedrock:ap-southeast-1::foundation-model/amazon.titan-embed-text-v2:0"
}

# ─── Alibaba Cloud ───────────────────────────────────────────────────────────

variable "alicloud_region" {
  description = "Alibaba Cloud region (ap-southeast-3 = Kuala Lumpur)"
  type        = string
  default     = "ap-southeast-3"
}

variable "alicloud_access_key" {
  description = "Alibaba Cloud RAM access key"
  type        = string
  sensitive   = true
}

variable "alicloud_secret_key" {
  description = "Alibaba Cloud RAM secret key"
  type        = string
  sensitive   = true
}

variable "ecs_instance_type" {
  description = "ECS instance type for backend server"
  type        = string
  default     = "ecs.c6.large"
}

variable "ecs_image_id" {
  description = "ECS image ID — Ubuntu 22.04 LTS"
  type        = string
  default     = "ubuntu_22_04_x64_20G_alibase_20240116.vhd"
}

# ─── Database ────────────────────────────────────────────────────────────────

variable "db_name" {
  description = "RDS PostgreSQL database name"
  type        = string
  default     = "igrow"
}

variable "db_username" {
  description = "RDS master username"
  type        = string
  default     = "igrow_admin"
}

variable "db_password" {
  description = "RDS master password (min 8 chars, mix of letters and numbers)"
  type        = string
  sensitive   = true
}
