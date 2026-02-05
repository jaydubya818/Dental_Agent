---
name: cloud-infrastructure-architect
description: Comprehensive cloud infrastructure and deployment skill for AWS, containerization, serverless, monitoring, security, and scalable architecture design. Specializes in production-ready infrastructure for fintech applications.
author: SellerFin Team
license: MIT
---

# Cloud Infrastructure Architect

Design and implement scalable, secure, and cost-effective cloud infrastructure solutions. This skill covers AWS services, containerization, serverless architectures, monitoring, security, and DevOps best practices for production applications.

## Core Infrastructure Domains

### 1. AWS Cloud Services
- EC2 and Auto Scaling Groups
- Application Load Balancer (ALB)
- RDS and database optimization
- S3 storage and CloudFront CDN
- Lambda and serverless functions
- VPC networking and security groups
- Route 53 DNS management
- IAM roles and policies

### 2. Containerization & Orchestration
- Docker containerization
- Amazon ECS and Fargate
- Kubernetes deployment
- Container image optimization
- Service mesh architecture
- Blue-green deployments
- Auto-scaling strategies

### 3. Serverless Architecture
- Lambda function design
- API Gateway integration
- DynamoDB and RDS Proxy
- Step Functions workflows
- EventBridge event-driven architecture
- SQS and SNS messaging
- CloudWatch monitoring

### 4. Security & Compliance
- Network security best practices
- Encryption at rest and in transit
- WAF and DDoS protection
- Certificate management
- Secrets management
- Audit logging and compliance
- PCI DSS requirements for fintech

## Production Infrastructure Stack

### High-Level Architecture
```
Internet Gateway
    │
Application Load Balancer (Multi-AZ)
    │
┌─────────────────────────────────────┐
│          Web Tier (ECS)             │
│  ┌──────────┐    ┌──────────┐      │
│  │   AZ-1   │    │   AZ-2   │      │
│  │ Web Apps │    │ Web Apps │      │
│  └──────────┘    └──────────┘      │
└─────────────────────────────────────┘
    │
┌─────────────────────────────────────┐
│        Application Tier             │
│  ┌──────────┐    ┌──────────┐      │
│  │   AZ-1   │    │   AZ-2   │      │
│  │ API Apps │    │ API Apps │      │
│  └──────────┘    └──────────┘      │
└─────────────────────────────────────┘
    │
┌─────────────────────────────────────┐
│         Database Tier               │
│  ┌──────────┐    ┌──────────┐      │
│  │ Primary  │    │ Standby  │      │
│  │ RDS-PG   │────│ RDS-PG   │      │
│  │   AZ-1   │    │   AZ-2   │      │
│  └──────────┘    └──────────┘      │
└─────────────────────────────────────┘
```

### VPC Network Configuration
```hcl
# infrastructure/vpc.tf
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "sellerfi-${var.environment}"
    Environment = var.environment
  }
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "sellerfi-${var.environment}-igw"
  }
}

# Public Subnets
resource "aws_subnet" "public" {
  count = length(var.availability_zones)

  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.${count.index + 1}.0/24"
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "sellerfi-${var.environment}-public-${count.index + 1}"
    Type = "Public"
  }
}

# Private Subnets
resource "aws_subnet" "private" {
  count = length(var.availability_zones)

  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 10}.0/24"
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name = "sellerfi-${var.environment}-private-${count.index + 1}"
    Type = "Private"
  }
}

# Database Subnets
resource "aws_subnet" "database" {
  count = length(var.availability_zones)

  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 20}.0/24"
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name = "sellerfi-${var.environment}-db-${count.index + 1}"
    Type = "Database"
  }
}

# NAT Gateway
resource "aws_eip" "nat" {
  count  = length(var.availability_zones)
  domain = "vpc"

  depends_on = [aws_internet_gateway.main]

  tags = {
    Name = "sellerfi-${var.environment}-nat-eip-${count.index + 1}"
  }
}

resource "aws_nat_gateway" "main" {
  count = length(var.availability_zones)

  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id

  depends_on = [aws_internet_gateway.main]

  tags = {
    Name = "sellerfi-${var.environment}-nat-${count.index + 1}"
  }
}
```

### ECS Container Service
```hcl
# infrastructure/ecs.tf
resource "aws_ecs_cluster" "main" {
  name = "sellerfi-${var.environment}"

  configuration {
    execute_command_configuration {
      logging = "OVERRIDE"

      log_configuration {
        cloud_watch_encryption_enabled = true
        cloud_watch_log_group_name     = aws_cloudwatch_log_group.ecs.name
      }
    }
  }

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Environment = var.environment
  }
}

# ECS Task Definition
resource "aws_ecs_task_definition" "web" {
  family                   = "sellerfi-web-${var.environment}"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  task_role_arn           = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name  = "web"
      image = "${aws_ecr_repository.web.repository_url}:latest"

      portMappings = [
        {
          containerPort = 3000
          protocol      = "tcp"
        }
      ]

      environment = [
        {
          name  = "NODE_ENV"
          value = var.environment == "prod" ? "production" : "staging"
        },
        {
          name  = "PORT"
          value = "3000"
        }
      ]

      secrets = [
        {
          name      = "DATABASE_URL"
          valueFrom = aws_ssm_parameter.database_url.arn
        },
        {
          name      = "NEXTAUTH_SECRET"
          valueFrom = aws_ssm_parameter.nextauth_secret.arn
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.ecs.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "web"
        }
      }

      healthCheck = {
        command     = ["CMD-SHELL", "curl -f http://localhost:3000/health || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 60
      }
    }
  ])

  tags = {
    Environment = var.environment
  }
}

# ECS Service
resource "aws_ecs_service" "web" {
  name            = "sellerfi-web"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.web.arn
  desired_count   = var.environment == "prod" ? 3 : 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = aws_subnet.private[*].id
    security_groups = [aws_security_group.ecs.id]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.web.arn
    container_name   = "web"
    container_port   = 3000
  }

  deployment_configuration {
    maximum_percent         = 200
    minimum_healthy_percent = 100

    deployment_circuit_breaker {
      enable   = true
      rollback = true
    }
  }

  depends_on = [
    aws_lb_listener.web
  ]

  tags = {
    Environment = var.environment
  }
}
```

### RDS Database Configuration
```hcl
# infrastructure/rds.tf
resource "aws_db_subnet_group" "main" {
  name       = "sellerfi-${var.environment}-db-subnet-group"
  subnet_ids = aws_subnet.database[*].id

  tags = {
    Name        = "sellerfi-${var.environment}-db-subnet-group"
    Environment = var.environment
  }
}

resource "aws_db_parameter_group" "postgres" {
  family = "postgres15"
  name   = "sellerfi-${var.environment}-postgres"

  parameter {
    name  = "shared_preload_libraries"
    value = "pg_stat_statements"
  }

  parameter {
    name  = "log_statement"
    value = "all"
  }

  parameter {
    name  = "log_min_duration_statement"
    value = "1000" # Log queries taking longer than 1 second
  }

  tags = {
    Environment = var.environment
  }
}

resource "aws_db_instance" "postgres" {
  identifier = "sellerfi-${var.environment}"

  engine         = "postgres"
  engine_version = "15.4"
  instance_class = var.db_instance_class

  allocated_storage     = var.db_allocated_storage
  max_allocated_storage = var.db_max_allocated_storage
  storage_encrypted     = true
  storage_type         = "gp3"

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  parameter_group_name   = aws_db_parameter_group.postgres.name

  # Backup and Maintenance
  backup_retention_period = var.environment == "prod" ? 30 : 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"

  # Performance Insights
  performance_insights_enabled = true
  performance_insights_retention_period = var.environment == "prod" ? 731 : 7

  # Monitoring
  monitoring_interval = 60
  monitoring_role_arn = aws_iam_role.rds_enhanced_monitoring.arn

  enabled_cloudwatch_logs_exports = ["postgresql"]

  # Multi-AZ for production
  multi_az = var.environment == "prod"

  # Snapshot settings
  skip_final_snapshot       = var.environment != "prod"
  final_snapshot_identifier = var.environment == "prod" ? "sellerfi-${var.environment}-final-snapshot-${formatdate("YYYY-MM-DD-hhmm", timestamp())}" : null

  deletion_protection = var.environment == "prod"

  tags = {
    Environment = var.environment
  }
}

# Read Replica for production
resource "aws_db_instance" "postgres_replica" {
  count = var.environment == "prod" ? 1 : 0

  identifier = "sellerfi-${var.environment}-replica"

  replicate_source_db = aws_db_instance.postgres.identifier
  instance_class      = var.db_replica_instance_class

  performance_insights_enabled = true
  monitoring_interval = 60
  monitoring_role_arn = aws_iam_role.rds_enhanced_monitoring.arn

  auto_minor_version_upgrade = false

  tags = {
    Environment = var.environment
    Purpose     = "read-replica"
  }
}
```

### Application Load Balancer
```hcl
# infrastructure/alb.tf
resource "aws_lb" "main" {
  name               = "sellerfi-${var.environment}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets           = aws_subnet.public[*].id

  enable_deletion_protection = var.environment == "prod"

  # Access logs
  access_logs {
    bucket  = aws_s3_bucket.alb_logs.bucket
    prefix  = "alb"
    enabled = true
  }

  tags = {
    Environment = var.environment
  }
}

resource "aws_lb_target_group" "web" {
  name        = "sellerfi-${var.environment}-web"
  port        = 3000
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_vpc.main.id

  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 30
    matcher             = "200"
    path                = "/health"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = 5
    unhealthy_threshold = 3
  }

  stickiness {
    enabled = false
    type    = "lb_cookie"
  }

  tags = {
    Environment = var.environment
  }
}

resource "aws_lb_listener" "web" {
  load_balancer_arn = aws_lb.main.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = aws_acm_certificate_validation.main.certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.web.arn
  }
}

# HTTP to HTTPS redirect
resource "aws_lb_listener" "redirect" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}
```

## Serverless Functions

### Lambda Function Configuration
```typescript
// lambda/business-analytics/handler.ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'
import { RDS } from 'aws-sdk'

const dynamodb = new DynamoDB.DocumentClient()

interface AnalyticsEvent {
  userId: string
  action: string
  metadata: Record<string, any>
  timestamp: number
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || '{}') as AnalyticsEvent

    // Validate required fields
    if (!body.userId || !body.action) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      }
    }

    // Store analytics event
    await dynamodb.put({
      TableName: process.env.ANALYTICS_TABLE!,
      Item: {
        userId: body.userId,
        timestamp: body.timestamp || Date.now(),
        action: body.action,
        metadata: body.metadata || {},
        ttl: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days TTL
      }
    }).promise()

    // Trigger real-time processing if needed
    if (body.action === 'listing_view' || body.action === 'deal_inquiry') {
      // Process in real-time
      await processRealTimeEvent(body)
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    }
  } catch (error) {
    console.error('Analytics processing error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    }
  }
}

async function processRealTimeEvent(event: AnalyticsEvent) {
  // Update user activity counters
  // Trigger personalization updates
  // Send notifications if necessary
}
```

### Lambda Terraform Configuration
```hcl
# infrastructure/lambda.tf
resource "aws_lambda_function" "business_analytics" {
  filename         = "business-analytics.zip"
  function_name    = "sellerfi-${var.environment}-business-analytics"
  role            = aws_iam_role.lambda_execution_role.arn
  handler         = "handler.handler"
  runtime         = "nodejs18.x"
  timeout         = 30
  memory_size     = 256

  environment {
    variables = {
      ANALYTICS_TABLE = aws_dynamodb_table.analytics.name
      ENVIRONMENT     = var.environment
    }
  }

  vpc_config {
    subnet_ids         = aws_subnet.private[*].id
    security_group_ids = [aws_security_group.lambda.id]
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_logs,
    aws_cloudwatch_log_group.lambda_analytics
  ]

  tags = {
    Environment = var.environment
  }
}

# DynamoDB for Analytics
resource "aws_dynamodb_table" "analytics" {
  name           = "sellerfi-${var.environment}-analytics"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "userId"
  range_key      = "timestamp"

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "N"
  }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }

  tags = {
    Environment = var.environment
  }
}
```

## Monitoring & Observability

### CloudWatch Monitoring
```hcl
# infrastructure/monitoring.tf
resource "aws_cloudwatch_log_group" "ecs" {
  name              = "/ecs/sellerfi-${var.environment}"
  retention_in_days = var.environment == "prod" ? 30 : 7

  tags = {
    Environment = var.environment
  }
}

# Custom Metrics
resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "SellerFi-${title(var.environment)}"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/ApplicationELB", "RequestCount", "LoadBalancer", aws_lb.main.arn_suffix],
            [".", "TargetResponseTime", ".", "."],
            [".", "HTTPCode_Target_2XX_Count", ".", "."],
            [".", "HTTPCode_Target_4XX_Count", ".", "."],
            [".", "HTTPCode_Target_5XX_Count", ".", "."]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "Application Load Balancer Metrics"
          period  = 300
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 6
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/ECS", "CPUUtilization", "ServiceName", aws_ecs_service.web.name, "ClusterName", aws_ecs_cluster.main.name],
            [".", "MemoryUtilization", ".", ".", ".", "."],
            [".", "RunningTaskCount", ".", ".", ".", "."]
          ]
          view   = "timeSeries"
          region = var.aws_region
          title  = "ECS Service Metrics"
          period = 300
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 12
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/RDS", "CPUUtilization", "DBInstanceIdentifier", aws_db_instance.postgres.id],
            [".", "DatabaseConnections", ".", "."],
            [".", "ReadLatency", ".", "."],
            [".", "WriteLatency", ".", "."]
          ]
          view   = "timeSeries"
          region = var.aws_region
          title  = "RDS Database Metrics"
          period = 300
        }
      }
    ]
  })
}

# Alarms
resource "aws_cloudwatch_metric_alarm" "high_cpu" {
  alarm_name          = "sellerfi-${var.environment}-high-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors ECS CPU utilization"

  dimensions = {
    ServiceName = aws_ecs_service.web.name
    ClusterName = aws_ecs_cluster.main.name
  }

  alarm_actions = [aws_sns_topic.alerts.arn]

  tags = {
    Environment = var.environment
  }
}

resource "aws_cloudwatch_metric_alarm" "database_connections" {
  alarm_name          = "sellerfi-${var.environment}-db-connections"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "DatabaseConnections"
  namespace           = "AWS/RDS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors RDS database connections"

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.postgres.id
  }

  alarm_actions = [aws_sns_topic.alerts.arn]

  tags = {
    Environment = var.environment
  }
}
```

### Security Configuration
```hcl
# infrastructure/security.tf
# WAF
resource "aws_wafv2_web_acl" "main" {
  name  = "sellerfi-${var.environment}-waf"
  scope = "REGIONAL"

  default_action {
    allow {}
  }

  # Rate limiting rule
  rule {
    name     = "RateLimitRule"
    priority = 1

    override_action {
      none {}
    }

    statement {
      rate_based_statement {
        limit              = 2000
        aggregate_key_type = "IP"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "RateLimitRule"
      sampled_requests_enabled   = true
    }

    action {
      block {}
    }
  }

  # AWS Managed Rules
  rule {
    name     = "AWS-AWSManagedRulesCommonRuleSet"
    priority = 2

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "CommonRuleSetMetric"
      sampled_requests_enabled   = true
    }
  }

  tags = {
    Environment = var.environment
  }
}

# Associate WAF with ALB
resource "aws_wafv2_web_acl_association" "main" {
  resource_arn = aws_lb.main.arn
  web_acl_arn  = aws_wafv2_web_acl.main.arn
}

# Security Groups
resource "aws_security_group" "alb" {
  name_prefix = "sellerfi-${var.environment}-alb-"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "sellerfi-${var.environment}-alb-sg"
    Environment = var.environment
  }
}

resource "aws_security_group" "ecs" {
  name_prefix = "sellerfi-${var.environment}-ecs-"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "sellerfi-${var.environment}-ecs-sg"
    Environment = var.environment
  }
}

resource "aws_security_group" "rds" {
  name_prefix = "sellerfi-${var.environment}-rds-"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs.id]
  }

  tags = {
    Name        = "sellerfi-${var.environment}-rds-sg"
    Environment = var.environment
  }
}
```

## Cost Optimization

### Auto Scaling Configuration
```hcl
# infrastructure/autoscaling.tf
resource "aws_appautoscaling_target" "ecs_target" {
  max_capacity       = var.environment == "prod" ? 10 : 3
  min_capacity       = var.environment == "prod" ? 2 : 1
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.web.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "ecs_policy_cpu" {
  name               = "sellerfi-${var.environment}-cpu-scaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.ecs_target.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs_target.scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs_target.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value = 70.0
    scale_in_cooldown  = 300
    scale_out_cooldown = 300
  }
}

resource "aws_appautoscaling_policy" "ecs_policy_memory" {
  name               = "sellerfi-${var.environment}-memory-scaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.ecs_target.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs_target.scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs_target.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageMemoryUtilization"
    }
    target_value = 80.0
    scale_in_cooldown  = 300
    scale_out_cooldown = 300
  }
}
```

### Cost Monitoring
```hcl
# infrastructure/cost-monitoring.tf
resource "aws_budgets_budget" "monthly_cost" {
  name       = "sellerfi-${var.environment}-monthly-budget"
  budget_type = "COST"
  limit_amount = var.environment == "prod" ? "1000" : "200"
  limit_unit   = "USD"
  time_unit    = "MONTHLY"

  cost_filters = {
    Tag = [
      "Environment:${var.environment}"
    ]
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                 = 80
    threshold_type            = "PERCENTAGE"
    notification_type         = "ACTUAL"
    subscriber_email_addresses = [var.billing_email]
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                 = 100
    threshold_type            = "PERCENTAGE"
    notification_type          = "FORECASTED"
    subscriber_email_addresses = [var.billing_email]
  }
}
```

This Cloud Infrastructure Architect skill provides comprehensive patterns for building secure, scalable, and cost-effective cloud infrastructure specifically designed for fintech applications like SellerFi.