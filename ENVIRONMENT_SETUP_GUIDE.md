# Environment Setup Guide - SELFIE AI™

## Overview
This guide walks you through setting up all required environment variables for the SELFIE AI™ platform.

## Quick Setup

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in the required values** (see sections below)

3. **Test the connection:**
   ```bash
   npm run dev
   ```

## Required Environment Variables

### 🔑 Supabase (Database & Auth)
**Priority: CRITICAL** - Platform won't work without these

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**How to get these:**
1. Go to [Supabase](https://supabase.com)
2. Create a new project or use existing
3. Go to Settings > API
4. Copy the URL and anon key
5. Copy the service_role key (keep this secret!)

**Test connection:**
Visit `/api/test-supabase` after setup

### 🤖 OpenAI (AI Features)
**Priority: HIGH** - AI features won't work without this

```env
OPENAI_API_KEY=sk-your-openai-key-here
```

**How to get this:**
1. Go to [OpenAI Platform](https://platform.openai.com)
2. Create account and add billing
3. Go to API Keys
4. Create new secret key

**Test:** AI features like Sandra Chat, Caption Generator

### 💳 Stripe (Payments)
**Priority: MEDIUM** - Only needed for paid features

```env
STRIPE_PUBLISHABLE_KEY=pk_test_your-key-here
STRIPE_SECRET_KEY=sk_test_your-key-here
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
```

**How to get these:**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to Developers > API Keys
3. Copy publishable and secret keys
4. Set up webhook endpoint for `/api/webhooks/stripe`

### 📧 Email (Resend)
**Priority: MEDIUM** - For user notifications

```env
RESEND_API_KEY=re_your-resend-key-here
FROM_EMAIL=noreply@yourdomain.com
```

**How to get this:**
1. Go to [Resend](https://resend.com)
2. Create account and verify domain
3. Go to API Keys and create new key

## Optional Environment Variables

### 🎨 Replicate (AI Image Generation)
```env
REPLICATE_API_TOKEN=r8_your-token-here
```

### 🔗 Make.com (Automation)
```env
MAKE_WEBHOOK_URL=https://hook.integromat.com/your-webhook
MAKE_API_KEY=your-make-api-key
```

### 📊 Analytics
```env
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
FACEBOOK_PIXEL_ID=your-pixel-id
```

### 📱 Instagram Integration
```env
INSTAGRAM_CLIENT_ID=your-instagram-app-id
INSTAGRAM_CLIENT_SECRET=your-instagram-app-secret
```

## Configuration Options

### Admin Settings
```env
ADMIN_EMAIL=ssa@ssasocial.com
ADMIN_PASSWORD=your-secure-password
```

### Feature Flags
```env
FEATURE_VIP_ACCESS=true
FEATURE_BETA_TOOLS=false
FEATURE_ANALYTICS=true
```

### Rate Limiting
```env
RATE_LIMIT_PER_MINUTE=60
RATE_LIMIT_PER_HOUR=1000
```

### AI Models
```env
DEFAULT_AI_MODEL=gpt-4-turbo-preview
FALLBACK_AI_MODEL=gpt-3.5-turbo
```

## Security Best Practices

### ✅ DO:
- Use `.env.local` for local development
- Use different keys for production/staging
- Rotate keys regularly
- Use service role key only server-side
- Set up proper CORS policies

### ❌ DON'T:
- Commit real keys to version control
- Share service role keys
- Use production keys in development
- Expose secret keys in client-side code

## Troubleshooting

### Common Issues:

**Database Connection Failed**
- Check Supabase URL format (includes https://)
- Verify anon key is correct
- Check if project is paused

**Auth Not Working**
- Ensure NextAuth secret is set
- Check callback URLs in auth provider
- Verify middleware configuration

**AI Features Not Working**
- Check OpenAI API key format (starts with sk-)
- Verify billing is set up
- Check rate limits

**Payments Not Working**
- Use test keys for development
- Verify webhook endpoint is accessible
- Check webhook secret matches

## Testing Your Setup

### 1. Basic Connection Test
```bash
npm run dev
```
Visit `http://localhost:3000` - should load without errors

### 2. Database Test
Visit `/api/test-supabase` - should return success

### 3. Auth Test
Try signing up with a test email

### 4. AI Test
Use any AI feature (Caption Generator, Sandra Chat)

## Production Deployment

### Vercel (Recommended)
1. Connect your GitHub repo
2. Add environment variables in Vercel dashboard
3. Use production keys for all services
4. Set up custom domain

### Environment Variables for Production:
- Use production Supabase project
- Use live Stripe keys
- Set proper NEXTAUTH_URL
- Enable all features

## Support

If you encounter issues:
1. Check this guide first
2. Review error logs
3. Test individual services
4. Contact support with specific error messages

## Quick Reference

| Service | Required | Purpose |
|---------|----------|---------|
| Supabase | ✅ Critical | Database, Auth, Storage |
| OpenAI | ✅ High | AI Features |
| Stripe | ⚠️ Medium | Payments |
| Resend | ⚠️ Medium | Email |
| Replicate | ⭕ Optional | AI Images |
| Make.com | ⭕ Optional | Automation |
| Analytics | ⭕ Optional | Tracking |
