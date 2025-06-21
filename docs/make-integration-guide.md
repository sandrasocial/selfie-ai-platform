# Make.com Integration Guide for SELFIE AI Platform

## Overview

This guide covers the integration of Make.com (formerly Integromat) with the SELFIE AI platform, enabling automated workflows for lead capture, email sequences, and business process automation.

## Environment Variables Required

Add these environment variables to your `.env.local` file:

```bash
# Make.com API Configuration
MAKE_API_TOKEN=your_make_api_token_here
MAKE_ORGANIZATION_ID=4272101
MAKE_TEAM_ID=2082222
MAKE_REGION=eu2

# Optional: Connection IDs for specific services
MAKE_SUPABASE_CONNECTION_ID=your_supabase_connection_id
MAKE_SLACK_CONNECTION_ID=your_slack_connection_id
```

## Getting Your Make.com API Token

1. Log into your Make.com account
2. Go to **Settings** → **API Tokens**
3. Click **Create a new token**
4. Give it a name (e.g., "SELFIE AI Platform")
5. Copy the generated token
6. Add it to your environment variables

## Testing the Connection

Visit `/api/test-make` to verify your Make.com connection is working:

```bash
curl http://localhost:3000/api/test-make
```

Expected response:
```json
{
  "success": true,
  "count": 5
}
```

## Available Functions

### Core Scenario Management

- `listMakeScenarios()` - List all scenarios in the organization
- `createMakeScenario(name, description, options)` - Create a new scenario
- `getScenarioDetails(scenarioId)` - Get detailed scenario information
- `toggleScenario(scenarioId, active)` - Activate/deactivate scenarios
- `runScenario(scenarioId, data)` - Manually trigger a scenario
- `deleteScenario(scenarioId)` - Delete a scenario (use with caution)

### Module Management

- `addWebhookModule(scenarioId, webhookName)` - Add webhook trigger
- `addEmailModule(scenarioId, config)` - Add email module (Resend)
- `addDelayModule(scenarioId, delay)` - Add delay between steps
- `addSupabaseModule(scenarioId, action, table, data)` - Add database operations
- `addSlackModule(scenarioId, channel, message)` - Add Slack notifications
- `connectModules(scenarioId, sourceId, targetId)` - Connect modules together

### Pre-built Templates

The integration includes three pre-built automation templates:

#### 1. Free Guide Email Sequence
```typescript
await createAutomationFromTemplate('free-guide')
```
- Triggers on new lead capture
- Sends immediate welcome email
- Follows up with tips after 2 days
- Final upsell email after 5 days

#### 2. New Purchase Automation
```typescript
await createAutomationFromTemplate('new-purchase')
```
- Handles Stripe webhook events
- Updates user subscription status
- Sends welcome email
- Notifies Slack channel

#### 3. VIP Application Handler
```typescript
await createAutomationFromTemplate('vip-application')
```
- Processes VIP applications
- Sends confirmation email
- Notifies VIP team on Slack
- Saves application to database

## Usage Examples

### Creating a Simple Email Automation

```typescript
import { 
  createMakeScenario, 
  addWebhookModule, 
  addEmailModule, 
  connectModules,
  toggleScenario 
} from '@/lib/make-integration'

// Create scenario
const scenario = await createMakeScenario(
  'Welcome Email Automation',
  'Sends welcome email to new subscribers'
)

// Add webhook trigger
const webhook = await addWebhookModule(scenario.id, 'New Subscriber')

// Add email module
const email = await addEmailModule(scenario.id, {
  to: '{{email}}',
  subject: 'Welcome to SELFIE AI™!',
  html: '<h1>Welcome!</h1><p>Thanks for joining us.</p>',
  from: 'Sandra <sandra@selfie-ai.com>'
})

// Connect modules
await connectModules(scenario.id, webhook.id, email.id)

// Activate scenario
await toggleScenario(scenario.id, true)
```

### Using Pre-built Templates

```typescript
import { createAutomationFromTemplate } from '@/lib/make-integration'

// Create complete automation from template
const automation = await createAutomationFromTemplate('free-guide')

console.log('Created scenario:', automation.scenario.name)
console.log('Modules created:', automation.modules.length)
console.log('Connections made:', automation.connections.length)
```

## Error Handling

The integration includes comprehensive error handling:

```typescript
import { MakeAPIError } from '@/lib/make-integration'

try {
  const scenarios = await listMakeScenarios()
} catch (error) {
  if (error instanceof MakeAPIError) {
    console.error('Make.com API Error:', error.message)
    console.error('Status Code:', error.statusCode)
    console.error('Response:', error.response)
  } else {
    console.error('Unexpected error:', error)
  }
}
```

## Monitoring and Debugging

### Check Scenario Status
```typescript
import { getScenarioDetails, getScenarioExecutions } from '@/lib/make-integration'

// Get scenario details
const details = await getScenarioDetails('scenario_id')

// Get recent executions
const executions = await getScenarioExecutions('scenario_id', 10)
```

### Test Connection
```typescript
import { testMakeConnection } from '@/lib/make-integration'

const result = await testMakeConnection()
if (result.success) {
  console.log(`Connected! Found ${result.count} scenarios`)
} else {
  console.error('Connection failed:', result.error)
}
```

## Best Practices

1. **Environment Variables**: Always use environment variables for sensitive data
2. **Error Handling**: Wrap all Make.com operations in try-catch blocks
3. **Template Usage**: Use pre-built templates when possible for consistency
4. **Testing**: Test scenarios in Make.com dashboard before activating
5. **Monitoring**: Regularly check scenario execution logs
6. **Backup**: Export scenario configurations for backup

## Troubleshooting

### Common Issues

1. **"Access denied" error**
   - Check that `MAKE_API_TOKEN` is set correctly
   - Verify the token has proper permissions
   - Ensure the token hasn't expired

2. **"Not Found" errors**
   - Verify `MAKE_ORGANIZATION_ID` and `MAKE_TEAM_ID` are correct
   - Check that the scenario/module IDs exist

3. **Connection timeouts**
   - Check network connectivity
   - Verify Make.com service status
   - Consider increasing timeout values

### Debug Mode

Enable debug logging by setting:
```bash
DEBUG_MAKE_INTEGRATION=true
```

This will log all API requests and responses to help troubleshoot issues.

## Integration with AVA

The Make.com integration is designed to work seamlessly with AVA (Automation Virtual Assistant):

```typescript
// AVA can create automations programmatically
const automation = await ava.createAutomation({
  type: 'email-sequence',
  template: 'free-guide',
  customizations: {
    emailSubject: 'Custom Welcome Subject',
    delayDays: 3
  }
})
```

## Security Considerations

1. **API Token Security**: Never commit API tokens to version control
2. **Webhook Security**: Use webhook signatures for verification
3. **Data Privacy**: Ensure compliance with data protection regulations
4. **Access Control**: Limit API token permissions to necessary scopes

## Support

For issues with the Make.com integration:

1. Check the Make.com dashboard for scenario errors
2. Review the API documentation at https://www.make.com/en/help/api
3. Test the connection using `/api/test-make`
4. Check environment variables are set correctly
5. Review execution logs in Make.com dashboard

## Changelog

- **v1.0.0**: Initial integration with core functions and templates
- **v1.1.0**: Added error handling and debugging features
- **v1.2.0**: Added pre-built automation templates
- **v1.3.0**: Enhanced monitoring and execution tracking 