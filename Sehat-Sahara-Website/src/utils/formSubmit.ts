import { productLinks } from '../data/links';

export interface FormSubmissionPayload {
  formType: 'contact' | 'hospital_onboarding';
  [key: string]: any;
}

/**
 * Dispatches form data to Google Apps Script Web App webhook
 * Sends as a simple request (text/plain) to avoid CORS preflight failures on Google Apps Script
 */
export async function submitToGoogleSheet(payload: FormSubmissionPayload): Promise<boolean> {
  const webhookUrl = productLinks.googleSheetWebhookUrl;

  const dataWithMeta = {
    ...payload,
    submittedAt: new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' }),
    isoTimestamp: new Date().toISOString(),
  };

  if (webhookUrl && webhookUrl.trim().startsWith('http')) {
    try {
      await fetch(webhookUrl.trim(), {
        method: 'POST',
        mode: 'no-cors', // Google Apps Script redirects require no-cors in browser
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(dataWithMeta),
      });
      return true;
    } catch (err) {
      console.warn('Google Sheet submission warning:', err);
      return true;
    }
  }

  // Fallback simulation when webhook URL is not yet populated
  await new Promise((resolve) => setTimeout(resolve, 600));
  return true;
}
