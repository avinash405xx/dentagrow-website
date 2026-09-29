# DentaGrow Website

DentaGrow by AJ Intelligent Group — dental practice operations automation and growth system.

## Product positioning
- Automate repetitive front-desk and patient-workflow tasks.
- Keep humans in control of clinical and exception-based work.
- Add local patient acquisition when a practice actually needs growth.
- Keep n8n, AI, voice, CRM, messaging and other infrastructure behind one clinic-facing experience.

## Lead form
The website form submits to the existing Google Apps Script Web App using `VITE_GOOGLE_SHEETS_WEB_APP_URL`. The Apps Script records the lead in Google Sheets and the team emails the visitor a secure $1 payment link.

## Offer
14-Day DentaGrow Trial — $1. Primary CTA: "Start DentaGrow for $1". Secondary CTA: "Book a Consultation" (optional, Calendly).

## Analytics
- Meta Pixel `1346550847551454` — PageView only, no Purchase event.
- Microsoft Clarity `yn5c1prhi6`.

See `TRIAL_SETUP.md` for the full funnel, env vars and security notes.

## Run
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Deploy (Wasmer)
`wasmer.toml` runs `staticfile --dir dist --path /`, so the built `dist/` is
served. Set `VITE_GOOGLE_SHEETS_WEB_APP_URL` as a build env var:

```bash
wasmer deploy avinash405xx/dentagrow-landing
```

## Copywriting basis
The supplied copywriting material calls for a clear landing-page flow: headline, subheadline, problem, solution, benefits, features, audience, offer/CTA, FAQ and final push. The site applies that structure to DentaGrow in simple, direct English while removing unsupported testimonials, customer counts, ROI claims, guarantees and compliance claims.

The supplied visual system is intentionally preserved: dark navy/teal/blue palette, glass cards, CTA button treatment, gradients, motion, dashboard mockup and responsive behavior.
