# Make.com SELFIE GUIDE Automation Setup

## 🎯 Scenario Overview
Automate the complete Selfie Guide funnel from form submission to email delivery using Make.com.

**Webhook URL:** `https://hook.eu2.make.com/cuswnmn5rvse3u7mtc4b60pdus3ku7oe`

## 📋 Setup Checklist

### 1. Environment Variables in Make.com
Add these to your Make.com environment settings:

```
PDFMONKEY_API_KEY=your_pdfmonkey_api_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
```

### 2. Module Configuration

#### Module 1: Webhook Trigger
- **App:** Webhooks
- **URL:** `https://hook.eu2.make.com/cuswnmn5rvse3u7mtc4b60pdus3ku7oe`
- **Method:** POST
- **Expected Data:** `{name: string, email: string}`

#### Module 2: Generate PDF (PDFMonkey)
- **App:** HTTP
- **URL:** `https://api.pdfmonkey.io/api/v1/documents`
- **Method:** POST
- **Headers:**
  ```
  Authorization: Bearer {{env.PDFMONKEY_API_KEY}}
  Content-Type: application/json
  ```
- **Body:**
  ```json
  {
    "document": {
      "document_template_id": "1D0EE38C-3FAF-4A16-B5C8-6222AA82A629",
      "payload": {
        "name": "{{ifempty(1.name; \"Friend\")}}",
        "email": "{{1.email}}"
      },
      "meta": {
        "_filename": "selfie-guide-{{replace(1.email; \"@\"; \"-at-\")}}.pdf"
      }
    }
  }
  ```

#### Module 3: Repeater (Polling Setup)
- **App:** Repeater
- **Repeats:** 15
- **Interval:** 2 seconds

#### Module 4: Check PDF Status
- **App:** HTTP
- **URL:** `https://api.pdfmonkey.io/api/v1/documents/{{2.data.document.id}}`
- **Method:** GET
- **Headers:**
  ```
  Authorization: Bearer {{env.PDFMONKEY_API_KEY}}
  ```

#### Module 5: Break Condition
- **App:** Flow Control
- **Module:** Break
- **Condition:** `{{if(4.data.document.status = "success"; true; false)}}`

#### Module 6: Save to Supabase
- **App:** HTTP
- **URL:** `{{env.SUPABASE_URL}}/rest/v1/leads`
- **Method:** POST
- **Headers:**
  ```
  apikey: {{env.SUPABASE_ANON_KEY}}
  Authorization: Bearer {{env.SUPABASE_ANON_KEY}}
  Content-Type: application/json
  Prefer: return=representation
  ```
- **Body:**
  ```json
  {
    "name": "{{1.name}}",
    "email": "{{1.email}}",
    "source": "selfie_guide",
    "pdf_url": "{{4.data.document.download_url}}",
    "created_at": "{{now}}"
  }
  ```

#### Module 7: Send Email (Resend)
- **App:** HTTP
- **URL:** `https://api.resend.com/emails`
- **Method:** POST
- **Headers:**
  ```
  Authorization: Bearer {{env.RESEND_API_KEY}}
  Content-Type: application/json
  ```
- **Body:**
  ```json
  {
    "from": "Sandra <hello@selfieai.co>",
    "to": ["{{1.email}}"],
    "subject": "Your Free Selfie Guide 💖",
    "html": "[Email template included in blueprint]"
  }
  ```

## 🔗 Integration with Existing Form

### Option A: Direct Webhook (Recommended)
Modify your form submission to POST directly to the Make.com webhook:

```javascript
const response = await fetch('https://hook.eu2.make.com/cuswnmn5rvse3u7mtc4b60pdus3ku7oe', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: formData.name,
    email: formData.email
  })
});
```

### Option B: Dual Processing
Keep existing logic and add webhook call:

```javascript
try {
  // Existing PDF generation logic
  const result = await submitSelfieGuideLead({ email, name });
  
  // Also trigger Make.com automation
  fetch('https://hook.eu2.make.com/cuswnmn5rvse3u7mtc4b60pdus3ku7oe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email })
  }).catch(console.error); // Silent fallback
  
  // Continue with existing redirect logic
  window.location.href = `/freebie/selfieguide/thankyou?pdf=${result.pdfUrl}`;
} catch (error) {
  // Existing error handling
}
```

## 🧪 Testing

1. **Test Webhook:** Send POST request with sample data
2. **Verify PDF Generation:** Check PDFMonkey dashboard
3. **Confirm Database Save:** Query Supabase leads table
4. **Check Email Delivery:** Verify email in inbox and Resend logs

## 🚨 Error Handling

- **PDF Generation Timeout:** 30 seconds max (15 attempts × 2 seconds)
- **API Failures:** Scenario will log errors and stop execution
- **Email Failures:** Non-blocking, lead will still be saved

## 📊 Monitoring

- Make.com execution logs show each step
- PDFMonkey dashboard tracks PDF generation
- Supabase logs database inserts
- Resend dashboard monitors email delivery

## 🎛️ Advanced Configuration

### Conditional Logic
Add filters based on email domain, name presence, or other criteria.

### Error Notifications
Add webhook or email notification for failed scenarios.

### Analytics Tracking
Include UTM parameters or tracking pixels in emails.

### A/B Testing
Create multiple scenarios for different email templates or timing.