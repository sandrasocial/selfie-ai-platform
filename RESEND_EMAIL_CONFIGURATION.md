# SSELFIE Email Configuration Guide

## Overview
This guide sets up Resend as your email provider through Supabase for all authentication emails. The result? Professional, luxury-feeling emails that match your brand perfectly.

## Step 1: Configure Supabase SMTP Settings

### Access Settings:
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **Authentication** → **Settings** → **SMTP Settings**

### Configuration:
```
✅ Enable Custom SMTP: ON

Host: smtp.resend.com
Port: 587
Username: resend
Password: re_YroJMjeK_EQ36btNdRmepz7e5Q1MZ3ULn
Sender email: hello@sselfie.ai
Sender name: SSELFIE
```

## Step 2: Update Email Templates

### Access Templates:
1. Go to **Authentication** → **Email Templates**

### Confirmation Email (Sign Up):
- **Subject**: `Welcome to SSELFIE - Confirm your email`
- **Body**: Copy content from `/email-templates/auth-confirmation.html`

### Password Recovery:
- **Subject**: `Reset your SSELFIE password`
- **Body**: Copy content from `/email-templates/password-reset.html`

### Email Change:
- **Subject**: `Confirm your new email address`
- Use similar styling to other templates

## Step 3: Test Configuration

### Test Signup Flow:
1. Create test account on your site
2. Check email delivery time (should be instant)
3. Verify email design matches brand
4. Test confirmation link works

### Test Password Reset:
1. Use "Forgot Password" feature
2. Check email delivery and design
3. Verify reset link works properly

## Step 4: Monitor Performance

### Resend Dashboard:
- Check delivery rates (should be 98%+)
- Monitor bounce rates
- Review open rates

### Expected Results:
- ✅ Instant email delivery
- ✅ Professional brand appearance
- ✅ High deliverability rates
- ✅ Better user experience

## Troubleshooting

### If emails aren't sending:
1. Verify SMTP settings are correct
2. Check Resend API key is active
3. Ensure sender email is verified in Resend
4. Check Supabase logs for errors

### If emails look wrong:
1. Verify HTML is properly formatted
2. Test across different email clients
3. Check mobile rendering

## Benefits of This Setup

✨ **Professional Appearance**: Emails look like they came from a luxury brand
✨ **Reliable Delivery**: Resend ensures emails reach inboxes
✨ **Brand Consistency**: Matches your website's design perfectly
✨ **Better Metrics**: Track opens, clicks, and deliverability
✨ **Mobile Optimized**: Looks gorgeous on all devices

---

*"Every touchpoint should feel expensive, including your emails." - SSELFIE Design Philosophy*
