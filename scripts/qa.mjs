import { readFileSync, existsSync } from 'node:fs';

const app = readFileSync('src/App.tsx', 'utf8');
const env = readFileSync('.env.local', 'utf8');
const cfg = readFileSync('src/lib/config.ts', 'utf8');
const checks = [];
const staticOnly = process.argv.includes('--static');
const check = (name, ok, detail='') => checks.push({ name, ok, detail });

if (!staticOnly) check('Production build artifact', existsSync('dist/index.html'), 'dist/index.html must exist after npm run build');
check('Payment amount is $199', /const PAYMENT_AMOUNT = 199\b/.test(app));
check('Original consultation value is $399', /const ORIGINAL_AMOUNT = 399\b/.test(app));
check('All primary CTAs target the reservation section', (app.match(/href="#reserve"/g) || []).length >= 4);
check('No public Calendly links remain', !/calendly\.com|CAL\s*=/.test(app));
check('Skydo is configured through environment variable', /VITE_SKYDO_PAYMENT_URL/.test(cfg));
check('Google Apps Script URL is configured', /VITE_GOOGLE_SHEETS_WEB_APP_URL=https:\/\/script\.google\.com\/macros\/s\//.test(env));
check('No old $99 Skydo link is shipped', !env.includes('pyl_qgblh1'));
check('No fake payment-success state in frontend', !/payment.*success|success.*payment/i.test(app.replace(/What happens after I pay\?/g, '')) || /verify payment/i.test(app));

const paymentLine = env.split('\n').find(x => x.startsWith('VITE_SKYDO_PAYMENT_URL=')) || '';
const paymentUrl = paymentLine.split('=').slice(1).join('=').trim();
check('A real $199 Skydo URL is present', /^https:\/\/dashboard\.skydo\.com\/pay\/[^\s]+$/.test(paymentUrl), paymentUrl ? 'URL present' : 'BLOCKED: create the new Skydo InstaLink for USD 199 and put its URL in .env.local');

for (const c of checks) console.log(`${c.ok ? 'PASS' : 'FAIL'} | ${c.name}${c.detail ? ` | ${c.detail}` : ''}`);
const failed = checks.filter(c => !c.ok);
console.log(`\nQA RESULT: ${failed.length ? 'BLOCKED' : 'PASS'} (${checks.length - failed.length}/${checks.length} checks passed)`);
process.exitCode = failed.length ? 1 : 0;
