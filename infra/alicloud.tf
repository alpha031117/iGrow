data "alicloud_zones" "available" {
  available_instance_type = var.ecs_instance_type
  available_disk_category = "cloud_efficiency"
}

# ─── VPC ─────────────────────────────────────────────────────────────────────

resource "alicloud_vpc" "main" {
  vpc_name   = "${local.prefix}-vpc"
  cidr_block = "10.0.0.0/16"
  tags       = local.common_tags
}

resource "alicloud_vswitch" "main" {
  vswitch_name = "${local.prefix}-vsw-main"
  vpc_id       = alicloud_vpc.main.id
  cidr_block   = "10.0.1.0/24"
  zone_id      = data.alicloud_zones.available.zones[0].id
  tags         = local.common_tags
}

# ─── Security Group ───────────────────────────────────────────────────────────

resource "alicloud_security_group" "backend" {
  name        = "${local.prefix}-sg-backend"
  description = "iGrow backend — allows HTTP, HTTPS, FastAPI, SSH"
  vpc_id      = alicloud_vpc.main.id
  tags        = local.common_tags
}

resource "alicloud_security_group_rule" "http_in" {
  type              = "ingress"
  ip_protocol       = "tcp"
  port_range        = "80/80"
  security_group_id = alicloud_security_group.backend.id
  cidr_ip           = "0.0.0.0/0"
}

resource "alicloud_security_group_rule" "https_in" {
  type              = "ingress"
  ip_protocol       = "tcp"
  port_range        = "443/443"
  security_group_id = alicloud_security_group.backend.id
  cidr_ip           = "0.0.0.0/0"
}

resource "alicloud_security_group_rule" "fastapi_in" {
  type              = "ingress"
  ip_protocol       = "tcp"
  port_range        = "8000/8000"
  security_group_id = alicloud_security_group.backend.id
  cidr_ip           = "0.0.0.0/0"
}

resource "alicloud_security_group_rule" "ssh_in" {
  type              = "ingress"
  ip_protocol       = "tcp"
  port_range        = "22/22"
  security_group_id = alicloud_security_group.backend.id
  cidr_ip           = "0.0.0.0/0"
}

resource "alicloud_security_group_rule" "all_out" {
  type              = "egress"
  ip_protocol       = "all"
  port_range        = "-1/-1"
  security_group_id = alicloud_security_group.backend.id
  cidr_ip           = "0.0.0.0/0"
}

# ─── ECS: Backend Server ──────────────────────────────────────────────────────

resource "alicloud_instance" "backend" {
  instance_name        = "${local.prefix}-backend"
  image_id             = var.ecs_image_id
  instance_type        = var.ecs_instance_type
  security_groups      = [alicloud_security_group.backend.id]
  vswitch_id           = alicloud_vswitch.main.id
  system_disk_category = "cloud_efficiency"
  system_disk_size     = 40
  internet_max_bandwidth_out = 10
  tags                 = local.common_tags

  # Bootstraps FastAPI backend on first boot
  user_data = base64encode(templatefile("${path.module}/templates/user_data.sh.tpl", {
    aws_ai_gateway_url = aws_apigatewayv2_api.ai_gateway.api_endpoint
    db_host            = alicloud_db_instance.main.connection_string
    db_name            = var.db_name
    db_user            = var.db_username
    db_password        = var.db_password
  }))
}

resource "alicloud_eip_address" "backend" {
  address_name         = "${local.prefix}-eip"
  internet_charge_type = "PayByTraffic"
  bandwidth            = "10"
  tags                 = local.common_tags
}

resource "alicloud_eip_association" "backend" {
  allocation_id = alicloud_eip_address.backend.id
  instance_id   = alicloud_instance.backend.id
}

# ─── RDS: PostgreSQL Operational Database ────────────────────────────────────

resource "alicloud_db_instance" "main" {
  engine                      = "PostgreSQL"
  engine_version              = "14.0"
  instance_type               = "pg.n2.small.1"
  instance_storage            = "20"
  instance_charge_type        = "Postpaid"
  vswitch_id                  = alicloud_vswitch.main.id
  security_ips                = [alicloud_vpc.main.cidr_block]
  db_instance_description     = "${local.prefix}-postgres"
  tags                        = local.common_tags
}

resource "alicloud_db_database" "igrow" {
  instance_id   = alicloud_db_instance.main.id
  name          = var.db_name
  character_set = "UTF8"
}

resource "alicloud_db_account" "admin" {
  db_instance_id   = alicloud_db_instance.main.id
  account_name     = var.db_username
  account_password = var.db_password
  account_type     = "Super"
}

resource "alicloud_db_account_privilege" "admin" {
  instance_id  = alicloud_db_instance.main.id
  account_name = alicloud_db_account.admin.account_name
  privilege    = "DBOwner"
  db_names     = [alicloud_db_database.igrow.name]
}

# ─── OSS: Object Storage ──────────────────────────────────────────────────────

resource "alicloud_oss_bucket" "mock_data" {
  bucket = "${local.prefix}-mock-data"
  acl    = "private"
  tags   = local.common_tags

  server_side_encryption_rule {
    sse_algorithm = "AES256"
  }
}

resource "alicloud_oss_bucket" "audit_logs" {
  bucket = "${local.prefix}-audit-logs"
  acl    = "private"
  tags   = local.common_tags

  lifecycle_rule {
    id      = "expire-old-logs"
    enabled = true
    expiration {
      days = 90
    }
  }
}

# ─── SLS: Log Service ─────────────────────────────────────────────────────────

resource "alicloud_log_project" "main" {
  project_name = "${local.prefix}-logs"
  description  = "iGrow application, audit, and AI gateway logs"
  tags         = local.common_tags
}

resource "alicloud_log_store" "app" {
  project_name          = alicloud_log_project.main.project_name
  logstore_name         = "app-logs"
  retention_period      = 30
  shard_count           = 1
  auto_split            = true
  max_split_shard_count = 4
}

resource "alicloud_log_store" "audit" {
  project_name          = alicloud_log_project.main.project_name
  logstore_name         = "audit-logs"
  retention_period      = 90
  shard_count           = 1
  auto_split            = true
  max_split_shard_count = 4
}

resource "alicloud_log_store" "ai_gateway" {
  project_name          = alicloud_log_project.main.project_name
  logstore_name         = "ai-gateway-logs"
  retention_period      = 30
  shard_count           = 1
  auto_split            = true
  max_split_shard_count = 4
}
