# SELFIE AI™ - Current Platform Map

## 📱 Frontend Pages & Routes

### Public Routes
- `/` - Home page with hero and marketing content
- `/pricing` - Pricing plans and subscription tiers
- `/login` - Authentication entry point
- `/contact` - Contact information and support
- `/support` - Help and support resources
- `/privacy` - Privacy policy
- `/terms` - Terms of service
- `/freebie/selfie-guide` - Lead magnet landing page
- `/freebie/selfieguide/thankyou` - PDF download thank you page

### Protected Routes (Authentication Required)
- `/dashboard` - Main user dashboard with feature overview
- `/studio` - Creative workspace hub
- `/studio/editor` - Visual editor for content creation
- `/studio/feed-designer` - Instagram feed layout designer
- `/studio/photo-vault` - Photo storage and organization
- `/studio/boost` - Daily motivation and tips
- `/studio/notes` - Brand notes and strategy documentation
- `/studio/tagger` - Automated hashtag and tagging tool
- `/sandra-ai` - AI chat interface and coaching
- `/planner` - Weekly content planning tool
- `/drops` - Monthly content drops and resources
- `/courses` - Educational content library
- `/templates` - Design templates and presets
- `/content-vault` - Saved content and drafts
- `/my-workbooks` - Personal workbooks and exercises
- `/my-account` - User profile and subscription management
- `/calendar` - Content calendar and scheduling

### Product & Checkout Routes
- `/products/selfie-starter-kit` - Starter Kit product page
- `/products/branded-by-selfie` - Branded package product page
- `/products/presets` - Preset bundles
- `/products/vip` - VIP tier product page
- `/checkout/:productId` - Dynamic checkout pages
- `/thank-you/:productId` - Product-specific thank you pages
- `/offer-upsell` - Upsell offer page
- `/offer-downsell` - Downsell offer page

### Course Routes
- `/courses/starter-kit` - Starter Kit course content
- `/courses/branded` - Branded by Selfie course
- `/courses/vip` - VIP course materials
- `/course/viral-selfie-blueprint` - Viral blueprint course
- `/module/1` through `/module/5` - Individual course modules

### Admin & Development Routes
- `/admin-dashboard` - Admin control panel
- `/admin-login` - Admin authentication
- `/temp-admin` - Temporary admin access
- `/dev-login` - Developer authentication
- `/debug-session` - Session debugging tools
- `/test-login` - Testing authentication flows

## 🔧 API Endpoints & Backend

### Authentication APIs
- `/api/me` - Current user session data
- `/api/auth/supabase-session` - Create backend session from Supabase
- `/api/temp-admin-access` - Temporary admin session creation

### Content & AI APIs
- `/api/content-generator/sessions` - AI content generation
- `/api/pose-coach/sessions` - AI photography coaching
- `/api/template-customizer/templates` - Template customization
- `/api/content-vault` - Content storage and retrieval
- `/api/monthly-drops` - Monthly content releases
- `/api/visual-studio/sessions` - Visual editing sessions
- `/api/strategy-coach/sessions` - Brand strategy coaching
- `/api/weekly-planner` - Content planning tools
- `/api/vip/applications` - VIP tier applications

### Download & File APIs
- `/api/download-guide` - PDF guide downloads
- `/selfie-guide.pdf` - Fallback PDF file (public folder)

## 🤖 AI Agents & Automated Tools

### Sandra AI Chat
- **Location**: `SandraAIChat` component
- **Features**: Brand-aware conversations, strategic advice, industry guidance
- **Status**: Personalized when user has complete brand profile
- **Tones**: Real Talk Coach, Soft Sister, Strategic Mentor
- **Use Cases**: Content planning, bio optimization, brand checklist

### Content Generator
- **Location**: `EnhancedContentGenerator` component
- **Features**: Instagram captions, content strategies, hashtag collections
- **Personalization**: Uses brand voice and industry context
- **Output**: Social media posts aligned with brand identity

### AI Pose Coach
- **Location**: `ProfileAwarePoseCoach` component
- **Features**: Photography guidance, brand-aligned poses
- **Context**: Considers visual aesthetic and brand positioning
- **Guidance**: Professional photography tips and confidence building

### Workbook Generator
- **Features**: Custom learning materials with brand context
- **Integration**: Industry examples and brand-specific content
- **Status**: Requires complete brand profile for personalization

### Auto Tagger
- **Location**: `/studio/tagger` route
- **Features**: Automated hashtag generation and content tagging
- **Context**: Brand-aware hashtag suggestions

## 🔌 Third-Party Service Integrations

### Supabase (Database & Auth)
- **URL**: `https://zlslzllzejdhyfczcumv.supabase.co`
- **Features**: User authentication, data storage, real-time updates
- **Auth Flow**: Magic link authentication with callback handling
- **Session Management**: Hybrid frontend/backend session system

### Make.com Automation
- **Webhook URL**: `https://hook.eu2.make.com/cuswnmn5rvse3u7mtc4b60pdus3ku7oe`
- **Template ID**: `24197B16-1667-4C4B-A446-A37D12260E85`
- **Flow**: Form submission → PDF generation → Email delivery → Database save
- **Modules**: Webhook trigger, PDFMonkey generation, Supabase save, Resend email

### PDFMonkey (PDF Generation)
- **Integration**: Via Make.com automation
- **Features**: Personalized guide generation
- **Polling**: Status checking with 30-second timeout
- **Fallback**: Direct API integration if Make.com fails

### Resend (Email Delivery)
- **Integration**: Via Make.com automation
- **Features**: Automated email delivery with PDF attachments
- **From Address**: `Sandra <hello@selfieai.co>`
- **Templates**: HTML email templates for guide delivery

### Stripe (Payments)
- **Components**: `@stripe/react-stripe-js`, `@stripe/stripe-js`
- **Features**: Subscription management, payment processing
- **Integration**: Checkout flows and subscription tiers

## 📊 Data Models (Supabase Tables)

### Core Tables
- **`user_profiles`** - Brand profile data including mission, audience, values
- **`users`** - User accounts with subscription plans and access levels
- **`content_vault`** - Saved content with type, title, body, and tags
- **`leads`** - Lead capture for freebie downloads with PDF URLs
- **`uploads`** - File storage metadata and URLs
- **`feed_layout`** - Instagram feed design configurations
- **`monthly_drops`** - Content drop releases and access control
- **`ai_visual_strategies`** - AI-generated visual strategy recommendations

### Profile Fields
- `brand_mission`, `ideal_audience`, `brand_values`
- `key_phrases`, `hashtags`, `visual_aesthetic`
- `content_focus[]`, `tone_voice`, `industry`
- `experience_level`, `main_goals`, `transformation_story`
- `brand_voice`, `aesthetic_tone`, `offer`, `visibility_goals`
- `is_complete` - Boolean for profile completion status

## ⚠️ Missing Error Handling & Fallbacks

### Critical Gaps
1. **PDF Generation Timeout**: Fixed with fallback to `/selfie-guide.pdf`
2. **Make.com Webhook Failures**: Fallback to direct PDFMonkey integration needed
3. **Supabase Connection Issues**: No retry mechanism for failed requests
4. **Session Expiry**: Limited handling of expired authentication tokens
5. **AI Service Downtime**: No fallback for Sandra AI chat failures

### Required Improvements
- **Network Error Recovery**: Implement retry logic for API failures
- **Offline Functionality**: Basic offline mode for content viewing
- **Data Validation**: Stronger validation for form submissions
- **Rate Limiting**: Handle API rate limits gracefully
- **Error Reporting**: Centralized error logging and user notification

### Environment Dependencies
- **Required Secrets**: 
  - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `VITE_MAKE_WEBHOOK_URL`
  - `PDFMONKEY_API_KEY`, `RESEND_API_KEY`
- **Optional Secrets**: `STRIPE_SECRET_KEY` for payments

## 🎯 Current Status Summary
- **Authentication**: Supabase magic link system operational
- **Core Features**: Dashboard, Studio tools, AI chat functional
- **Automation**: Make.com webhook integration complete
- **Payment**: Stripe integration ready for subscription tiers
- **Content**: AI-powered content generation with brand personalization
- **Missing**: Complete error handling and fallback systems

---
*Last Updated: Current deployment state as of platform audit*