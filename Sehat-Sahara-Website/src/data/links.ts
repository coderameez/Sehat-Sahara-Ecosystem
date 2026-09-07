/**
 * Centralized Application and Product URLs
 * Replace placeholder '#' strings with live production deployments when ready.
 */
export const productLinks = {
  patientApp: 'https://sehat-sahara-mobile.vercel.app/',
  doctorApp: 'https://sehat-sahara-mobile.vercel.app/',
  hospitalDashboard: 'https://sehat-sahara-dashboard.vercel.app/',
  hospitalLogin: 'https://sehat-sahara-dashboard.vercel.app/',
  adminDashboard: 'https://sehat-sahara-admin.vercel.app/',
  downloadApp: 'https://sehat-sahara-mobile.vercel.app/',
  demoRequest: '#contact',
  partnerOnboarding: '#partner-form',
  // Google Apps Script Web App Webhook URL for Google Sheet form submissions:
  googleSheetWebhookUrl: 'https://script.google.com/macros/s/AKfycbwThL2F3e_S5-E9bjS--be6lhl-P-jAU4YGWRor2IEpXIa3wL-nylobIGue3RYQMoAsaQ/exec',
};

export interface NavItem {
  name: string;
  href: string;
}

export const navigationItems: NavItem[] = [
  { name: 'Home', href: '#home' },
  { name: 'Services', href: '#services' },
  { name: 'Apps', href: '#apps' },
  { name: 'AI', href: '#ai' },
  { name: 'Hospitals', href: '#hospitals' },
  { name: 'Scope', href: '#scope' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
];
