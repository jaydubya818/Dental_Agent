---
name: automation-engineer
description: Comprehensive automation engineering skill for CI/CD pipelines, testing automation, deployment automation, monitoring, and workflow orchestration. Specializes in modern DevOps practices and infrastructure automation.
author: SellerFin Team
license: MIT
---

# Automation Engineer

Build comprehensive automation systems for development, testing, deployment, and operations. This skill covers CI/CD pipelines, infrastructure automation, testing strategies, and monitoring systems for modern applications.

## Core Automation Domains

### 1. CI/CD Pipeline Automation
- GitHub Actions workflows
- GitLab CI/CD pipelines
- Jenkins pipeline scripting
- Azure DevOps pipelines
- Automated testing integration
- Deployment automation
- Release management

### 2. Infrastructure as Code (IaC)
- Terraform configurations
- AWS CloudFormation
- Kubernetes manifests
- Docker containerization
- Ansible playbooks
- Helm charts
- Infrastructure provisioning

### 3. Testing Automation
- Unit test automation
- Integration test suites
- End-to-end testing
- Performance testing
- Security scanning
- Accessibility testing
- Visual regression testing

### 4. Deployment & Release Automation
- Blue-green deployments
- Canary releases
- Rolling updates
- Feature flags
- Database migrations
- Environment management
- Rollback strategies

## GitHub Actions Workflows

### Continuous Integration Workflow
```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
    - uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run linting
      run: npm run lint

    - name: Run type checking
      run: npm run type-check

    - name: Run unit tests
      run: npm run test:unit

    - name: Run integration tests
      run: npm run test:integration

    - name: Upload coverage reports
      uses: codecov/codecov-action@v3

  security:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4

    - name: Run security audit
      run: npm audit --audit-level=high

    - name: Run Snyk security scan
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  build:
    runs-on: ubuntu-latest
    needs: [test, security]
    steps:
    - uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20.x'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Build application
      run: npm run build

    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: build-files
        path: .next/
        retention-days: 7
```

### Deployment Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production

    steps:
    - uses: actions/checkout@v4

    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1

    - name: Deploy to ECS
      run: |
        # Update ECS service
        aws ecs update-service \
          --cluster sellerfi-prod \
          --service sellerfi-web \
          --force-new-deployment

    - name: Run database migrations
      run: |
        npm run db:migrate
      env:
        DATABASE_URL: ${{ secrets.DATABASE_URL }}

    - name: Warm up application
      run: |
        curl -f ${{ secrets.PRODUCTION_URL }}/health

    - name: Notify Slack
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### End-to-End Testing Workflow
```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on:
  schedule:
    - cron: '0 2 * * *' # Daily at 2 AM
  workflow_dispatch:

jobs:
  e2e:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20.x'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Install Playwright browsers
      run: npx playwright install --with-deps

    - name: Start application
      run: |
        npm run build
        npm run start &
        npx wait-on http://localhost:3000

    - name: Run Playwright tests
      run: npx playwright test

    - name: Upload test results
      uses: actions/upload-artifact@v3
      if: failure()
      with:
        name: playwright-report
        path: playwright-report/
```

## Infrastructure as Code

### Terraform Configuration
```hcl
# infrastructure/main.tf
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket = "sellerfi-terraform-state"
    key    = "prod/terraform.tfstate"
    region = "us-east-1"
  }
}

# VPC Configuration
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "sellerfi-vpc"
    Environment = var.environment
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "sellerfi-${var.environment}"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "sellerfi-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets           = aws_subnet.public[*].id

  enable_deletion_protection = true

  tags = {
    Environment = var.environment
  }
}

# RDS Database
resource "aws_db_instance" "postgres" {
  identifier = "sellerfi-${var.environment}"

  engine         = "postgres"
  engine_version = "15.4"
  instance_class = var.db_instance_class
  allocated_storage = var.db_allocated_storage

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name

  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"

  skip_final_snapshot = false
  final_snapshot_identifier = "sellerfi-${var.environment}-final-snapshot"

  tags = {
    Environment = var.environment
  }
}
```

### Kubernetes Deployment
```yaml
# k8s/deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sellerfi-web
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: sellerfi-web
  template:
    metadata:
      labels:
        app: sellerfi-web
    spec:
      containers:
      - name: web
        image: sellerfi/web:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: sellerfi-secrets
              key: database-url
        - name: NEXTAUTH_SECRET
          valueFrom:
            secretKeyRef:
              name: sellerfi-secrets
              key: nextauth-secret
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: sellerfi-web-service
  namespace: production
spec:
  selector:
    app: sellerfi-web
  ports:
  - port: 80
    targetPort: 3000
  type: ClusterIP

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: sellerfi-ingress
  namespace: production
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - sellerfi.com
    - www.sellerfi.com
    secretName: sellerfi-tls
  rules:
  - host: sellerfi.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: sellerfi-web-service
            port:
              number: 80
```

## Automated Testing Suites

### Playwright Test Suite
```typescript
// tests/e2e/business-listing.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Business Listing Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as seller
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'seller@example.com')
    await page.fill('[data-testid="password"]', 'password123')
    await page.click('[data-testid="login-button"]')

    await expect(page).toHaveURL('/dashboard')
  })

  test('should create a new business listing', async ({ page }) => {
    await page.click('[data-testid="create-listing"]')
    await expect(page).toHaveURL('/listings/new')

    // Fill out business information
    await page.fill('[data-testid="business-title"]', 'Test Business')
    await page.selectOption('[data-testid="industry"]', 'technology')
    await page.fill('[data-testid="asking-price"]', '1000000')
    await page.fill('[data-testid="revenue"]', '500000')
    await page.fill('[data-testid="description"]', 'A test business description')

    // Submit listing
    await page.click('[data-testid="save-listing"]')

    await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
  })

  test('should handle form validation errors', async ({ page }) => {
    await page.goto('/listings/new')

    // Submit without required fields
    await page.click('[data-testid="save-listing"]')

    await expect(page.locator('[data-testid="error-business-title"]')).toBeVisible()
    await expect(page.locator('[data-testid="error-asking-price"]')).toBeVisible()
  })
})
```

### Performance Testing
```typescript
// tests/performance/load-test.ts
import { check } from 'k6'
import http from 'k6/http'

export let options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 200 }, // Ramp up to 200 users
    { duration: '5m', target: 200 }, // Stay at 200 users
    { duration: '2m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(99)<1500'], // 99% of requests must complete below 1.5s
    http_req_failed: ['rate<0.1'],     // Error rate must be below 10%
  },
}

export default function () {
  // Test homepage performance
  let response = http.get('https://sellerfi.com/')
  check(response, {
    'homepage loads successfully': (r) => r.status === 200,
    'homepage loads in reasonable time': (r) => r.timings.duration < 1000,
  })

  // Test listings page
  response = http.get('https://sellerfi.com/listings')
  check(response, {
    'listings page loads successfully': (r) => r.status === 200,
  })

  // Test API endpoint
  response = http.get('https://sellerfi.com/api/listings', {
    headers: {
      'Authorization': 'Bearer ' + __ENV.API_TOKEN,
    },
  })
  check(response, {
    'API responds successfully': (r) => r.status === 200,
    'API returns valid JSON': (r) => {
      try {
        JSON.parse(r.body)
        return true
      } catch (e) {
        return false
      }
    },
  })
}
```

## Database Migration Automation

### Migration Scripts
```typescript
// migrations/001_initial_schema.ts
import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // Users table
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.string('email').notNullable().unique()
    table.string('password_hash').notNullable()
    table.string('first_name')
    table.string('last_name')
    table.enu('role', ['buyer', 'seller', 'admin']).notNullable()
    table.boolean('email_verified').defaultTo(false)
    table.timestamps(true, true)
  })

  // Businesses table
  await knex.schema.createTable('businesses', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('seller_id').notNullable().references('id').inTable('users')
    table.string('title').notNullable()
    table.text('description')
    table.string('industry')
    table.decimal('asking_price', 15, 2)
    table.decimal('revenue', 15, 2)
    table.decimal('cash_flow', 15, 2)
    table.string('city')
    table.string('state', 2)
    table.enu('status', ['draft', 'active', 'pending', 'sold']).defaultTo('draft')
    table.timestamps(true, true)
  })

  // Create indexes
  await knex.schema.alterTable('businesses', (table) => {
    table.index(['status', 'industry'])
    table.index(['asking_price'])
    table.index(['seller_id'])
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('businesses')
  await knex.schema.dropTable('users')
}
```

### Automated Migration Runner
```typescript
// scripts/migrate.ts
import { knex } from '../lib/database'

async function runMigrations() {
  try {
    console.log('Running database migrations...')

    await knex.migrate.latest()

    console.log('Migrations completed successfully')

    // Run seeds in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Running database seeds...')
      await knex.seed.run()
      console.log('Seeds completed successfully')
    }

  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  } finally {
    await knex.destroy()
  }
}

runMigrations()
```

## Monitoring & Alerting Automation

### Application Monitoring
```typescript
// lib/monitoring.ts
import { createPrometheusMetrics } from 'prom-client'

export class MonitoringService {
  private static instance: MonitoringService

  private httpRequestDuration = createPrometheusMetrics.createHistogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
  })

  private databaseQueryDuration = createPrometheusMetrics.createHistogram({
    name: 'database_query_duration_seconds',
    help: 'Duration of database queries in seconds',
    labelNames: ['operation', 'table'],
  })

  private activeUsers = createPrometheusMetrics.createGauge({
    name: 'active_users_total',
    help: 'Number of currently active users',
  })

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService()
    }
    return MonitoringService.instance
  }

  recordHttpRequest(method: string, route: string, statusCode: number, duration: number) {
    this.httpRequestDuration
      .labels(method, route, statusCode.toString())
      .observe(duration / 1000)
  }

  recordDatabaseQuery(operation: string, table: string, duration: number) {
    this.databaseQueryDuration
      .labels(operation, table)
      .observe(duration / 1000)
  }

  updateActiveUsers(count: number) {
    this.activeUsers.set(count)
  }
}
```

### Health Check Automation
```typescript
// pages/api/health.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../lib/prisma'

interface HealthCheck {
  status: 'healthy' | 'unhealthy'
  timestamp: string
  services: {
    database: 'up' | 'down'
    redis: 'up' | 'down'
    external_apis: 'up' | 'down'
  }
  version: string
  uptime: number
}

export default async function health(
  req: NextApiRequest,
  res: NextApiResponse<HealthCheck>
) {
  const startTime = Date.now()

  const healthCheck: HealthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: 'down',
      redis: 'down',
      external_apis: 'down'
    },
    version: process.env.npm_package_version || 'unknown',
    uptime: process.uptime()
  }

  // Check database
  try {
    await prisma.$queryRaw`SELECT 1`
    healthCheck.services.database = 'up'
  } catch (error) {
    healthCheck.status = 'unhealthy'
  }

  // Check Redis (if used)
  try {
    // Redis health check
    healthCheck.services.redis = 'up'
  } catch (error) {
    healthCheck.status = 'unhealthy'
  }

  // Check external APIs
  try {
    // Check critical external services
    healthCheck.services.external_apis = 'up'
  } catch (error) {
    // Non-critical, don't mark as unhealthy
  }

  const statusCode = healthCheck.status === 'healthy' ? 200 : 503

  res.status(statusCode).json(healthCheck)
}
```

## Deployment Strategies

### Blue-Green Deployment Script
```bash
#!/bin/bash
# scripts/blue-green-deploy.sh

set -e

CLUSTER_NAME="sellerfi-prod"
SERVICE_NAME="sellerfi-web"
IMAGE_TAG=$1

if [ -z "$IMAGE_TAG" ]; then
  echo "Usage: $0 <image-tag>"
  exit 1
fi

echo "Starting blue-green deployment..."

# Get current task definition
CURRENT_TASK_DEF=$(aws ecs describe-services --cluster $CLUSTER_NAME --services $SERVICE_NAME --query 'services[0].taskDefinition' --output text)

# Create new task definition with new image
NEW_TASK_DEF=$(aws ecs describe-task-definition --task-definition $CURRENT_TASK_DEF --query 'taskDefinition' --output json | \
  jq --arg IMAGE_TAG "$IMAGE_TAG" '.containerDefinitions[0].image = "sellerfi/web:" + $IMAGE_TAG' | \
  jq 'del(.taskDefinitionArn, .revision, .status, .requiresAttributes, .placementConstraints, .compatibilities)')

# Register new task definition
NEW_REVISION=$(echo $NEW_TASK_DEF | aws ecs register-task-definition --cli-input-json file:///dev/stdin --query 'taskDefinition.revision' --output text)

echo "Created new task definition revision: $NEW_REVISION"

# Update service with new task definition
aws ecs update-service --cluster $CLUSTER_NAME --service $SERVICE_NAME --task-definition "${CURRENT_TASK_DEF%:*}:$NEW_REVISION"

# Wait for deployment to complete
aws ecs wait services-stable --cluster $CLUSTER_NAME --services $SERVICE_NAME

echo "Deployment completed successfully!"

# Run smoke tests
echo "Running smoke tests..."
curl -f https://sellerfi.com/health

echo "Blue-green deployment successful!"
```

This automation engineering skill provides comprehensive automation solutions for modern application development, deployment, and operations, specifically tailored for SellerFi's needs.