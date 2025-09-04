# Email Infrastructure Deployment Guide

## Overview

The Piper Morgan website now includes a complete self-hosted email infrastructure that replaces ConvertKit direct integration. This provides superior functionality including real-time feedback, custom email templates, and full control over the subscriber experience.

## Architecture Changes

### Previous Setup (Static Export)
- ❌ `output: 'export'` in Next.js config
- ❌ ConvertKit direct form submission with `no-cors`
- ❌ No real-time feedback or error handling
- ❌ Dependency on third-party service

### New Setup (Server Deployment)
- ✅ Full Next.js server functionality
- ✅ Self-hosted API routes with database
- ✅ Real-time form feedback and validation
- ✅ Custom email templates and branding
- ✅ Complete control over subscriber data

## Infrastructure Requirements

### Database
- **PostgreSQL** (recommended: Vercel Postgres, Railway, or AWS RDS)
- Automatic table creation on first API call
- Subscriber data with status tracking (pending/confirmed/unsubscribed)

### SMTP Email Service
Choose one:
- **AWS SES** (recommended for production)
- **SendGrid** 
- **Gmail SMTP** (development only)
- **Mailgun**
- **Postmark**

### Server Hosting
The site now requires server-side deployment:
- **Vercel** (recommended - seamless Next.js hosting)
- **Railway** (good for PostgreSQL integration)
- **AWS Amplify** (full AWS ecosystem)
- **Netlify** (with database addon)

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Database (Required)
POSTGRES_URL=postgresql://user:pass@host:5432/dbname
POSTGRES_URL_NON_POOLING=postgresql://user:pass@host:5432/dbname

# SMTP (Required) 
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@domain.com
SMTP_PASS=your-app-password
SMTP_FROM_EMAIL=noreply@pipermorgan.ai

# Security (Required)
JWT_SECRET=secure-random-string-min-32-chars

# Site Configuration (Required)
NEXT_PUBLIC_BASE_URL=https://pipermorgan.ai

# Analytics (Existing)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-SVPLRHEEBP
```

## Deployment Steps

### 1. Database Setup

**Option A: Vercel Postgres**
```bash
# Install Vercel CLI and create database
npm i -g vercel
vercel login
vercel link
vercel postgres create
```

**Option B: Railway PostgreSQL**
```bash
# Create Railway project with PostgreSQL addon
railway login
railway init
railway add postgresql
```

### 2. SMTP Configuration

**AWS SES Setup (Recommended):**
1. Create AWS SES identity for your domain
2. Verify domain/email in SES console
3. Generate SMTP credentials
4. Update environment variables

**Gmail Setup (Development):**
1. Enable 2FA on Gmail account
2. Generate App Password: Account → Security → App Passwords
3. Use App Password as SMTP_PASS

### 3. Deploy to Vercel

```bash
# Connect to Vercel and deploy
vercel link
vercel env add POSTGRES_URL
vercel env add SMTP_HOST
vercel env add SMTP_USER
vercel env add SMTP_PASS
vercel env add JWT_SECRET
vercel env add NEXT_PUBLIC_BASE_URL

# Deploy
vercel --prod
```

### 4. Test Email Flow

1. **Visit deployed site** and test newsletter signup
2. **Check logs** for database initialization
3. **Verify email** delivery in SMTP service dashboard
4. **Test verification link** functionality
5. **Test unsubscribe** process

## API Endpoints

### POST /api/newsletter-signup
- Validates email and creates subscriber
- Sends verification email
- Returns success/error status

### GET /api/verify-email?token=xxx
- Confirms email address
- Sends welcome email
- Returns HTML success page

### GET /api/unsubscribe?email=xxx
- Unsubscribes user
- Returns HTML confirmation page

## Database Schema

```sql
CREATE TABLE subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  source VARCHAR(100) NOT NULL,
  signup_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  confirmed_date TIMESTAMP NULL,
  verification_token VARCHAR(255) NULL,
  metadata TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Security Features

### Rate Limiting
- 5 requests per minute per IP address
- Prevents spam and abuse
- Stored in memory (upgrade to Redis for production scale)

### Input Validation
- Email format validation
- SQL injection prevention
- XSS protection with proper sanitization

### Token Security
- JWT verification tokens with 24-hour expiration
- Secure secret key requirement
- Token invalidation after use

## Monitoring & Analytics

### Success Metrics
- Newsletter signup conversion rate
- Email delivery success rate (>95% target)
- Verification completion rate
- Unsubscribe rate

### Error Tracking
- Sentry integration for API errors
- SMTP delivery failure monitoring
- Database connection monitoring

### Analytics Events
- Newsletter signups tracked in GA4
- Source attribution for conversions
- User journey tracking

## Migration from ConvertKit

### Data Migration
If you have existing ConvertKit subscribers, export them and import using:

```javascript
// Admin script to import existing subscribers
import { addSubscriber } from '@/lib/database';
import { sendWelcomeEmail } from '@/lib/email';

const subscribers = []; // Your exported ConvertKit data

for (const sub of subscribers) {
  await addSubscriber(
    sub.email,
    'convertkit_migration',
    null, // No verification token - already confirmed
    { migrated_from: 'convertkit', original_date: sub.created_at }
  );
  
  // Mark as confirmed immediately
  await confirmSubscriber(null, sub.email);
  
  // Optional: Send migration welcome email
  await sendWelcomeEmail(sub.email);
}
```

### DNS/Domain Updates
- Update CNAME records if changing hosting
- Verify SPF/DKIM records for email deliverability
- Test email links work with new domain

## Troubleshooting

### Common Issues

**Database Connection Fails:**
- Check POSTGRES_URL format
- Verify database server is accessible
- Confirm credentials are correct

**Emails Not Sending:**
- Verify SMTP credentials
- Check spam/junk folders
- Confirm SMTP service configuration
- Review email service logs

**Verification Links Broken:**
- Check NEXT_PUBLIC_BASE_URL is correct
- Verify JWT_SECRET is set
- Confirm token expiration hasn't passed

**Rate Limiting Issues:**
- Clear browser cache/cookies
- Wait 1 minute between attempts
- Check server logs for IP blocking

### Debug Commands

```bash
# Check database connection
vercel logs

# Test SMTP connection locally
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransporter({...});
transporter.verify().then(console.log).catch(console.error);
"

# Verify environment variables
vercel env ls
```

## Performance Optimization

### Database Optimization
- Indexes on email and verification_token columns (auto-created)
- Connection pooling via POSTGRES_URL
- Prepared statements for security

### Email Performance  
- Async email sending (non-blocking)
- Template caching for faster rendering
- SMTP connection reuse

### Caching Strategy
- Static page generation where possible
- API response caching for subscriber stats
- CDN caching for assets

## Future Enhancements

### Planned Features
- Admin dashboard for subscriber management
- Email template editor
- A/B testing for signup forms
- Advanced analytics and segmentation
- Automated email sequences
- Webhook integrations

### Scaling Considerations
- Redis for rate limiting at scale
- Queue system for email sending
- Database read replicas
- CDN for static assets
- Load balancing for high traffic

---

**Status**: Production Ready ✅
**Last Updated**: September 4, 2025
**Tested On**: Vercel, Railway, AWS