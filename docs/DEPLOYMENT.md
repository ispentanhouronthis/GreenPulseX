# GreenPulseX Deployment Guide

## Overview

This guide covers deploying GreenPulseX to various cloud platforms and environments.

## Prerequisites

- Docker and Docker Compose
- Git
- Cloud provider account (AWS, GCP, Azure, or Render)
- Domain name (optional)

## Local Development

### Quick Start

1. **Clone the repository:**
```bash
git clone <repository-url>
cd GreenPulseX
```

2. **Start all services:**
```bash
docker-compose up --build
```

3. **Seed demo data:**
```bash
docker-compose exec backend python scripts/seed_demo_data.py
```

4. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- Database Admin: http://localhost:5050

### Demo Credentials

- **Farmer:** demo@greenpulsex.com / demo123
- **Admin:** admin@greenpulsex.com / demo123

## Production Deployment

### Environment Variables

Create environment files for production:

**Backend (.env):**
```env
DATABASE_URL=postgresql://user:password@host:5432/greenpulsex
REDIS_URL=redis://host:6379
SECRET_KEY=your-secure-secret-key
ENVIRONMENT=production
DEBUG=false
SENTRY_DSN=your-sentry-dsn
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_WS_URL=wss://api.yourdomain.com
```

### Docker Deployment

1. **Build production images:**
```bash
docker build -t greenpulsex-backend ./backend
docker build -t greenpulsex-frontend ./frontend
```

2. **Deploy with docker-compose:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Vercel (Frontend)

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Deploy:**
```bash
cd frontend
vercel --prod
```

3. **Configure environment variables in Vercel dashboard:**
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_WS_URL`

### Render (Backend)

1. **Create a new Web Service on Render**

2. **Connect your GitHub repository**

3. **Configure build settings:**
   - **Build Command:** `cd backend && pip install -r requirements.txt`
   - **Start Command:** `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`

4. **Set environment variables:**
   - `DATABASE_URL`
   - `SECRET_KEY`
   - `ENVIRONMENT=production`

### AWS ECS Deployment

1. **Create ECS cluster:**
```bash
aws ecs create-cluster --cluster-name greenpulsex
```

2. **Create task definition:**
```json
{
  "family": "greenpulsex-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "your-account.dkr.ecr.region.amazonaws.com/greenpulsex-backend:latest",
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "DATABASE_URL",
          "value": "postgresql://user:password@host:5432/greenpulsex"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/greenpulsex",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

3. **Create service:**
```bash
aws ecs create-service \
  --cluster greenpulsex \
  --service-name backend \
  --task-definition greenpulsex-backend:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-12345],securityGroups=[sg-12345],assignPublicIp=ENABLED}"
```

### Database Setup

#### PostgreSQL with TimescaleDB

1. **Create database:**
```sql
CREATE DATABASE greenpulsex;
```

2. **Enable TimescaleDB extension:**
```sql
\c greenpulsex;
CREATE EXTENSION IF NOT EXISTS timescaledb;
```

3. **Run migrations:**
```bash
docker-compose exec backend alembic upgrade head
```

#### AWS RDS

1. **Create RDS instance:**
```bash
aws rds create-db-instance \
  --db-instance-identifier greenpulsex-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15.4 \
  --master-username postgres \
  --master-user-password your-password \
  --allocated-storage 20 \
  --storage-type gp2
```

2. **Install TimescaleDB extension:**
```sql
CREATE EXTENSION IF NOT EXISTS timescaledb;
```

### Redis Setup

#### AWS ElastiCache

1. **Create Redis cluster:**
```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id greenpulsex-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1
```

### Monitoring and Logging

#### Sentry Integration

1. **Create Sentry project**
2. **Add DSN to environment variables**
3. **Configure error tracking in both frontend and backend**

#### Prometheus and Grafana

1. **Deploy monitoring stack:**
```bash
docker-compose -f docker-compose.monitoring.yml up -d
```

2. **Access Grafana:** http://localhost:3001
   - Username: admin
   - Password: admin123

### SSL/TLS Configuration

#### Let's Encrypt with Nginx

1. **Install Certbot:**
```bash
sudo apt-get install certbot python3-certbot-nginx
```

2. **Obtain certificate:**
```bash
sudo certbot --nginx -d yourdomain.com
```

3. **Configure Nginx:**
```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Backup and Recovery

#### Database Backup

1. **Automated backup script:**
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://your-backup-bucket/
```

2. **Schedule with cron:**
```bash
0 2 * * * /path/to/backup-script.sh
```

#### Application Backup

1. **Backup uploaded files:**
```bash
aws s3 sync /app/uploads s3://your-backup-bucket/uploads/
```

### Scaling

#### Horizontal Scaling

1. **Load balancer configuration:**
```yaml
# docker-compose.scale.yml
version: '3.8'
services:
  backend:
    deploy:
      replicas: 3
    environment:
      - REDIS_URL=redis://redis:6379
```

2. **Database connection pooling:**
```python
# backend/app/core/database.py
from sqlalchemy.pool import QueuePool

engine = create_async_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=20,
    max_overflow=30
)
```

#### Vertical Scaling

1. **Increase container resources:**
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 4G
        reservations:
          cpus: '1.0'
          memory: 2G
```

### Security Considerations

1. **Environment variables:** Never commit secrets to version control
2. **Database security:** Use strong passwords and restrict access
3. **API security:** Implement rate limiting and input validation
4. **HTTPS:** Always use SSL/TLS in production
5. **Updates:** Keep dependencies and base images updated

### Troubleshooting

#### Common Issues

1. **Database connection errors:**
   - Check DATABASE_URL format
   - Verify network connectivity
   - Check firewall rules

2. **Memory issues:**
   - Increase container memory limits
   - Optimize database queries
   - Implement caching

3. **Performance issues:**
   - Enable database connection pooling
   - Use Redis for caching
   - Implement CDN for static assets

#### Logs

1. **View application logs:**
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

2. **Database logs:**
```bash
docker-compose logs -f postgres
```

### Maintenance

#### Regular Tasks

1. **Database maintenance:**
   - Vacuum and analyze tables
   - Update statistics
   - Clean up old data

2. **Application updates:**
   - Deploy new versions
   - Run database migrations
   - Update dependencies

3. **Monitoring:**
   - Check system metrics
   - Review error logs
   - Monitor performance

### Support

For deployment support:
- **Email:** devops@greenpulsex.com
- **Documentation:** https://docs.greenpulsex.com
- **Issues:** GitHub Issues
