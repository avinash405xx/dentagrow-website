// Public, non-secret configuration only.
//
// The ONLY value the landing site needs at runtime is the Google Apps Script
// Web App URL that receives leads. It is a write-only ingest endpoint: it
// appends a row to a Google Sheet and the Apps Script emails the $1 payment
// link to the team. It grants no read access and holds no credentials.
//
// Payment is manual by design. After the lead is captured, the team emails the
// $1 payment link, verifies the payment, then activates the clinic. Therefore
// NO payment link, API key, secret or credential is ever bundled into the
// frontend bundle.
export const GOOGLE_SHEETS_WEB_APP_URL =
  import.meta.env.VITE_GOOGLE_SHEETS_WEB_APP_URL || '';

// ── Offer constants (single source of truth for pricing copy) ──
// 14-Day DentaGrow Trial — $1.
export const TRIAL_DAYS = 14;
export const TRIAL_PRICE = 1;
