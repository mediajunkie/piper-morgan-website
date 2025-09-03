# ConvertKit Direct Form Setup Guide

This guide shows how to configure ConvertKit direct form submission for the $0 stack deployment.

## Why Direct Forms?

- ✅ **Works with static export** (GitHub Pages compatible)
- ✅ **No API keys needed** in production 
- ✅ **ConvertKit free plan compatible**
- ✅ **GDPR compliant** with built-in double opt-in
- ✅ **Source tracking preserved** via custom fields

## Setup Steps

### 1. Create ConvertKit Form

1. Log into ConvertKit (free account)
2. Go to **Forms** → **Create Form**
3. Choose **Landing Page** or **Inline Form**
4. Design your form (or use minimal design - our component handles the UI)
5. **Important**: Add custom fields for source tracking:
   - `signup_source`
   - `page_context` 
   - `gdpr_consent`
   - `consent_timestamp`
   - `referrer`

### 2. Get Form ID

1. In your ConvertKit form settings
2. Look for the form URL: `https://app.convertkit.com/forms/XXXXXXX/subscriptions`
3. Copy the number (`XXXXXXX`) - this is your Form ID

### 3. Configure Environment

Add to your `.env.local`:
```bash
NEXT_PUBLIC_CONVERTKIT_FORM_ID=your_form_id_here
```

**Note**: The `NEXT_PUBLIC_` prefix makes this available in the browser (safe for static export).

### 4. Test the Integration

1. Start dev server: `npm run dev`
2. Try subscribing on any page
3. Check ConvertKit dashboard for new subscriber
4. Verify source tracking in subscriber custom fields

## Source Tracking Features

Even with direct forms, we preserve:

- **Page source tracking**: `signup_source` (e.g., "get-involved", "blog-post")
- **Context tracking**: `page_context` (e.g., "primary-engagement-cta")
- **GDPR compliance**: Consent timestamp and acknowledgment
- **Referrer data**: Where visitors came from
- **Analytics events**: Google Analytics integration

## ConvertKit Free Plan Limits

- **1,000 subscribers**: Free forever
- **Unlimited emails**: No sending limits
- **Basic automation**: Welcome emails, sequences
- **Custom fields**: For source tracking
- **Double opt-in**: GDPR compliance built-in

## Upgrade Path

When you hit 1,000 subscribers:
- **ConvertKit Creator**: $29/month (advanced automation)
- **Mailchimp Standard**: $13/month (good alternative)
- **Consider server deployment**: For API route functionality

## Technical Details

### How Direct Submission Works

```javascript
// Form data is sent directly to ConvertKit
const response = await fetch(`https://app.convertkit.com/forms/${FORM_ID}/subscriptions`, {
  method: 'POST',
  body: formData,
  mode: 'no-cors' // Required for CORS
});
```

### Custom Fields Mapping

| Component Prop | ConvertKit Field | Purpose |
|----------------|------------------|---------|
| `source` | `signup_source` | Page identifier |
| `metadata.page_context` | `page_context` | Specific context |
| `gdprConsent` | `gdpr_consent` | GDPR compliance |
| `consent_timestamp` | `consent_timestamp` | Legal timestamp |
| `document.referrer` | `referrer` | Traffic source |

### No-CORS Limitation

Direct submissions use `mode: 'no-cors'`, which means:
- ✅ Form submission works
- ❌ Can't read response status
- ✅ ConvertKit handles all error states
- ✅ Double opt-in email sent automatically

## Troubleshooting

### Form Not Working?
1. Check Form ID in ConvertKit dashboard
2. Verify `NEXT_PUBLIC_CONVERTKIT_FORM_ID` in environment
3. Check browser network tab for CORS errors

### Missing Source Data?
1. Ensure custom fields are added to ConvertKit form
2. Check subscriber details in ConvertKit dashboard
3. Custom fields appear after first successful submission

### GDPR Compliance
- ✅ Double opt-in enforced by ConvertKit
- ✅ Consent timestamp recorded
- ✅ Privacy policy link required
- ✅ Unsubscribe links automatic

## Future Enhancements

When scale justifies costs:
- **Webhooks**: Real-time notifications (requires server)
- **Advanced automation**: Complex email sequences
- **Analytics integration**: Enhanced tracking
- **A/B testing**: Form optimization

This setup keeps you on the $0 stack while preserving professional newsletter functionality!