# Production deployment guide for AI Code Reviewer

## Deployment Options

### 1. Docker Compose (Recommended for Small-Medium Scale)

```bash
# Clone repository
git clone <repo-url>
cd ai-code-reviewer

# Create .env with production values
cat > .env << EOF
GROQ_API_KEY=your-production-key
GITHUB_TOKEN=your-token
SECRET_KEY=$(python -c 'import secrets; print(secrets.token_urlsafe(32))')
DATABASE_URL=postgresql://user:password@postgres:5432/code_reviewer
CORS_ORIGINS=["https://yourdomain.com"]
EOF

# Deploy
docker-compose up -d

# Check logs
docker-compose logs -f
```

### 2. AWS EC2 Deployment

```bash
# 1. Launch EC2 Instance
# - Ubuntu 22.04 LTS
# - t3.medium or larger
# - Open ports: 80, 443, 8000

# 2. SSH and setup
ssh -i your-key.pem ubuntu@ip-address

# 3. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 4. Setup application
git clone <repo-url>
cd ai-code-reviewer

# 5. Configure environment
sudo nano .env

# 6. Deploy with Docker Compose
sudo docker-compose up -d

# 7. Setup Nginx reverse proxy
sudo apt install nginx
sudo nano /etc/nginx/sites-available/default
```

### 3. Heroku Deployment

```bash
# 1. Install Heroku CLI
curl https://cli.heroku.com/install.sh | sh

# 2. Login
heroku login

# 3. Create apps
heroku create your-app-backend
heroku create your-app-frontend

# 4. Set environment variables
heroku config:set GROQ_API_KEY=your-key -a your-app-backend

# 5. Deploy
git push heroku main
```

### 4. Railway.app Deployment

```bash
# 1. Connect GitHub account at railway.app
# 2. New project → GitHub repo
# 3. Configure environment variables
# 4. Auto-deploys on push
```

## Production Checklist

### Security
- [ ] Change SECRET_KEY
- [ ] Use strong database password
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up firewall rules
- [ ] Enable rate limiting
- [ ] Use environment variables for secrets
- [ ] Regular security updates

### Performance
- [ ] Enable caching headers
- [ ] Use CDN for frontend
- [ ] Database indexing
- [ ] Connection pooling
- [ ] Monitoring and alerts
- [ ] Load testing completed
- [ ] Response time < 200ms

### Infrastructure
- [ ] Database backups scheduled
- [ ] Monitoring enabled
- [ ] Logging centralized
- [ ] Auto-scaling configured
- [ ] Failover setup
- [ ] DNS configured
- [ ] Email notifications setup

### Maintenance
- [ ] Update dependencies monthly
- [ ] Monitor error rates
- [ ] Review logs regularly
- [ ] Performance metrics tracking
- [ ] User feedback collection
- [ ] Disaster recovery plan

## Monitoring & Logging

### Application Health
```bash
# Check if services running
docker ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Check metrics
docker stats
```

### Logging Services
- **ELK Stack** - Elasticsearch, Logstash, Kibana
- **Datadog** - Cloud monitoring
- **New Relic** - Application monitoring
- **Sentry** - Error tracking

### Performance Metrics
- Response time
- Error rates
- Database queries
- API latency
- User engagement

## Backup Strategy

```bash
# Database backup (daily)
docker exec postgres pg_dump -U reviewer code_reviewer > backup.sql

# Automated backup script
# Add to crontab: 0 2 * * * /backup-script.sh

# Cloud backup
# - S3 for file backups
# - RDS for database backups
# - Regular restore testing
```

## Scaling Configuration

### Horizontal Scaling
```yaml
# docker-compose.yml with scaling
services:
  backend:
    deploy:
      replicas: 3
    ports:
      - "8000-8002:8000"
```

### Load Balancing
- Nginx load balancing
- HAProxy
- AWS Load Balancer
- Kubernetes Services

### Database Optimization
- Read replicas
- Connection pooling
- Query optimization
- Indexing strategy

## Rollback Procedure

```bash
# Tag releases
git tag -a v1.0.0 -m "Version 1.0.0"

# Rollback in Docker
docker-compose down
git checkout v1.0.0
docker-compose up -d
```

## SSL/HTTPS Setup

### Let's Encrypt with Docker
```bash
# Add to docker-compose.yml
certbot:
  image: certbot/certbot
  volumes:
    - ./certbot/conf:/etc/letsencrypt
    - ./certbot/www:/var/www/certbot
  command: certonly --webroot -w /var/www/certbot --email your@email.com -d yourdomain.com --agree-tos
```

## Cost Optimization

- [ ] Use spot instances
- [ ] Right-size resources
- [ ] Implement caching
- [ ] Compress assets
- [ ] CDN usage
- [ ] Reserved instances

## Incident Response

1. **Detect**: Monitoring triggers alert
2. **Notify**: Team receives notification
3. **Investigate**: Check logs and metrics
4. **Mitigate**: Apply temporary fix
5. **Resolve**: Apply permanent fix
6. **Review**: Post-mortem analysis

## Post-Deployment Checklist

- [ ] All services running
- [ ] Database migrated
- [ ] Tests passed
- [ ] Monitoring active
- [ ] Backups created
- [ ] SSL working
- [ ] Email notifications functioning
- [ ] Analytics tracking
- [ ] Performance baseline established

---

Need help? Check logs with: `docker-compose logs -f`
