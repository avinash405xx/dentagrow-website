import { readFileSync, existsSync } from 'node:fs';

const app = readFileSync('src/App.tsx', 'utf8');
const env = existsSync('.env.local')
  ? readFileSync('.env.local', 'utf8')
  : '';
const cfg = readFileSync('src/lib/config.ts', 'utf8');

const checks = [];
const staticOnly = process.argv.includes('--static');

const check = (name, ok, detail = '') => {
  checks.push({ name, ok, detail });
};

/* ─────────────────────────────────────────────
   BUILD
───────────────────────────────────────────── */

if (!staticOnly) {
  check(
    'Production build artifact',
    existsSync('dist/index.html'),
    'Run npm run build first'
  );
}

/* ─────────────────────────────────────────────
   OFFER / PRICING
───────────────────────────────────────────── */

check(
  'Payment amount is $199',
  /\$199\b/.test(app),
  'Website must contain the current $199 consultation deposit'
);

check(
  'Original consultation value is $399',
  /\$399\b/.test(app),
  'Website must contain the original $399 value'
);

/* ─────────────────────────────────────────────
   LEAD-FIRST FUNNEL
───────────────────────────────────────────── */

check(
  'Lead form exists',
  /<form[\s\S]*onSubmit=\{handleSubmit\}/.test(app),
  'A form using handleSubmit must exist'
);

check(
  'Lead form has name field',
  /\bname\s*=\s*["']name["']/.test(app) ||
    /form\.name/.test(app) ||
    /name:\s*['"]['"]/.test(app),
  'Name must be captured by the lead form'
);

check(
  'Lead form has email field',
  /\bname\s*=\s*["']email["']/.test(app) ||
    /form\.email/.test(app) ||
    /email:\s*['"]['"]/.test(app),
  'Email must be captured by the lead form'
);

check(
  'Lead form has phone field',
  /\bname\s*=\s*["']phone["']/.test(app) ||
    /form\.phone/.test(app) ||
    /phone:\s*['"]['"]/.test(app),
  'Phone must be captured by the lead form'
);

check(
  'Lead form has clinic field',
  /\bname\s*=\s*["']clinic_name["']/.test(app) ||
    /form\.clinic_name/.test(app) ||
    /clinic_name:\s*['"]['"]/.test(app),
  'Clinic name must be captured by the lead form'
);

check(
  'Lead form has message field',
  /\bname\s*=\s*["']message["']/.test(app) ||
    /form\.message/.test(app) ||
    /message:\s*['"]['"]/.test(app),
  'Message must be captured by the lead form'
);

check(
  'Lead submission has loading state',
  /setSubmitState\(['"]loading['"]\)/.test(app),
  'Form should enter loading state'
);

check(
  'Lead submission has success state',
  /setSubmitState\(['"]done['"]\)/.test(app),
  'Form should enter done state'
);

check(
  'Lead submission has error state',
  /setSubmitState\(['"]error['"]\)/.test(app),
  'Form should handle errors'
);

/* ─────────────────────────────────────────────
   GOOGLE SHEETS LEAD CAPTURE
───────────────────────────────────────────── */

check(
  'Google Apps Script endpoint is used by form',
  /fetch\(\s*GOOGLE_SHEETS_WEB_APP_URL/.test(app),
  'handleSubmit must send the lead to Google Apps Script'
);

check(
  'Lead payload includes name',
  /name:\s*form\.name/.test(app),
  'Lead payload must contain name'
);

check(
  'Lead payload includes email',
  /email:\s*form\.email/.test(app),
  'Lead payload must contain email'
);

check(
  'Lead payload includes phone',
  /phone:\s*form\.phone/.test(app),
  'Lead payload must contain phone'
);

check(
  'Lead payload includes clinic',
  /clinic:\s*form\.clinic_name/.test(app),
  'Lead payload must contain clinic'
);

/* ─────────────────────────────────────────────
   PAYMENT AFTER FORM SUBMISSION
───────────────────────────────────────────── */

check(
  'Payment offer is gated behind successful lead submission',
  /submitState\s*===\s*['"]done['"]/.test(app),
  'Payment should appear only after successful lead capture'
);

check(
  'Payment is not the lead form action',
  !/<form[^>]*action\s*=\s*["'][^"']*(?:dashboard\.skydo\.com\/pay|PAYMENT_URL)/i.test(app),
  'Lead form must capture the lead before payment'
);

/* ─────────────────────────────────────────────
   META PIXEL
───────────────────────────────────────────── */

const META_PIXEL_ID = '1346550847551454';

check(
  'DentaGrow Meta Pixel ID is configured',
  app.includes(META_PIXEL_ID),
  `App must use Meta Pixel ID ${META_PIXEL_ID}`
);

check(
  'Meta Pixel script is loaded',
  /https:\/\/connect\.facebook\.net\/en_US\/fbevents\.js/.test(app),
  'Meta Pixel must load the official Facebook Pixel script'
);

check(
  'Meta PageView event exists',
  /fbq\(\s*['"]track['"]\s*,\s*['"]PageView['"]\s*\)/.test(app),
  'Meta Pixel must track PageView'
);

check(
  'Meta Lead event exists',
  /trackMetaEvent\(\s*['"]Lead['"]\s*\)/.test(app),
  'Meta Lead event must be fired after successful lead capture'
);

check(
  'Meta InitiateCheckout event exists',
  /trackMetaEvent\(\s*['"]InitiateCheckout['"]/.test(app),
  'Meta InitiateCheckout event must exist on the Skydo CTA'
);

check(
  'Meta InitiateCheckout tracks $199 USD',
  /InitiateCheckout[\s\S]{0,250}value:\s*PAYMENT_AMOUNT[\s\S]{0,100}currency:\s*['"]USD['"]/.test(app),
  'InitiateCheckout should send the $199 payment amount in USD'
);

check(
  'Meta Purchase event is not implemented yet',
  !/trackMetaEvent\(\s*['"]Purchase['"]/.test(app),
  'Purchase must wait for verified payment status'
);

/* ─────────────────────────────────────────────
   CTA / OLD FLOW
───────────────────────────────────────────── */

check(
  'Lead CTA exists',
  /See If DentaGrow Fits Your Practice/i.test(app) ||
    /See Whether DentaGrow Fits/i.test(app),
  'Primary CTA should direct visitors toward qualification/lead capture'
);

check(
  'No public Calendly links remain',
  !/calendly\.com/i.test(app),
  'Calendly links should not remain'
);

check(
  'Old $99 Skydo link is removed',
  !env.includes('pyl_qgblh1'),
  'Old Skydo InstaLink must not be present'
);

/* ─────────────────────────────────────────────
   PAYMENT SAFETY
───────────────────────────────────────────── */

check(
  'No automatic frontend payment-success state',
  !/set[A-Za-z]*Payment[A-Za-z]*\(\s*['"](?:success|paid|completed)['"]\s*\)/i.test(app),
  'Frontend must not mark payment as verified by itself'
);

/* ─────────────────────────────────────────────
   CONFIGURATION
───────────────────────────────────────────── */

check(
  'Skydo config exists',
  /VITE_SKYDO_PAYMENT_URL/.test(cfg),
  'src/lib/config.ts must expose VITE_SKYDO_PAYMENT_URL'
);

check(
  'Google Apps Script config exists',
  /VITE_GOOGLE_SHEETS_WEB_APP_URL/.test(cfg),
  'src/lib/config.ts must expose VITE_GOOGLE_SHEETS_WEB_APP_URL'
);

const googleLine =
  env
    .split(/\r?\n/)
    .find((line) =>
      line.trim().startsWith('VITE_GOOGLE_SHEETS_WEB_APP_URL=')
    ) || '';

const googleUrl = googleLine
  .split('=')
  .slice(1)
  .join('=')
  .trim();

check(
  'Google Apps Script URL is configured',
  /^https:\/\/script\.google\.com\/macros\/s\/[^\s]+\/exec$/.test(googleUrl),
  googleUrl ? 'URL present' : 'BLOCKED: Apps Script URL missing'
);

const paymentLine =
  env
    .split(/\r?\n/)
    .find((line) =>
      line.trim().startsWith('VITE_SKYDO_PAYMENT_URL=')
    ) || '';

const paymentUrl = paymentLine
  .split('=')
  .slice(1)
  .join('=')
  .trim();

check(
  'Skydo payment URL is configured',
  /^https:\/\/dashboard\.skydo\.com\/pay\/[^\s]+$/.test(paymentUrl),
  paymentUrl
    ? 'Skydo payment URL present'
    : 'BLOCKED: Skydo payment URL missing'
);

/* ─────────────────────────────────────────────
   PRODUCTION SANITY
───────────────────────────────────────────── */

check(
  'No localhost API endpoint is shipped',
  !/https?:\/\/localhost(?::\d+)?/i.test(app),
  'Production frontend should not depend on localhost'
);

/* ─────────────────────────────────────────────
   RESULT
───────────────────────────────────────────── */

for (const c of checks) {
  console.log(
    `${c.ok ? 'PASS' : 'FAIL'} | ${c.name}${
      c.detail ? ` | ${c.detail}` : ''
    }`
  );
}

const failed = checks.filter((c) => !c.ok);

console.log(
  `\nQA RESULT: ${failed.length ? 'BLOCKED' : 'PASS'} ` +
    `(${checks.length - failed.length}/${checks.length} checks passed)`
);

process.exitCode = failed.length ? 1 : 0;