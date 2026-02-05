#!/bin/bash

# SellerFin Staging Deployment Script
set -euo pipefail

echo "🚀 Starting SellerFin staging deployment..."

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please create one based on .env.example"
    exit 1
fi

# Source environment variables
source .env

# Validate required environment variables
if [ -z "${DATABASE_URL:-}" ]; then
    echo "❌ DATABASE_URL is required"
    exit 1
fi

if [ -z "${AUTH_SECRET:-}" ]; then
    echo "❌ AUTH_SECRET is required"
    exit 1
fi

if [ -z "${NEXTAUTH_URL:-}" ]; then
    echo "❌ NEXTAUTH_URL is required"
    exit 1
fi

echo "✅ Environment validation passed"

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.staging.yml down || true

# Pull latest images
echo "📥 Pulling latest images..."
docker-compose -f docker-compose.staging.yml pull postgres nginx

# Build the application image
echo "🔨 Building application image..."
docker-compose -f docker-compose.staging.yml build app

# Start database first
echo "🗄️ Starting database..."
docker-compose -f docker-compose.staging.yml up -d postgres

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run database migrations
echo "📊 Running database migrations..."
docker-compose -f docker-compose.staging.yml run --rm app npx prisma migrate deploy

# Start all services
echo "🚀 Starting all services..."
docker-compose -f docker-compose.staging.yml up -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 15

# Health check
echo "🏥 Running health check..."
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed"
    echo "📋 Service logs:"
    docker-compose -f docker-compose.staging.yml logs app
    exit 1
fi

echo "🎉 Staging deployment completed successfully!"
echo "🌐 Application is running at: http://localhost:3000"
echo ""
echo "📊 Service Status:"
docker-compose -f docker-compose.staging.yml ps