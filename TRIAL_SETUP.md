# DentaGrow Trial Setup

## Offer

**14-Day DentaGrow Trial — $1**

- Primary CTA: **Start DentaGrow for $1**
- Secondary CTA: **Book a Consultation** (optional, via Calendly)

There is no consultation deposit, no setup fee and no long-term commitment
required to start.

## Funnel

1. Visitor lands on DentaGrow.
2. Visitor submits the lead form.
3. The form posts to the Google Apps Script Web App, which records the lead in
   Google Sheets and notifies the team.
4. A team member emails the visitor a secure **$1 payment link**.
5. The team manually verifies the payment.
6. The team activates the clinic, and the clinic logs in.
7. The consultation is optional at every step and can be booked on Calendly.

The browser never marks a payment as successful. There is no client-side
"paid" flag, no Purchase event and no automatic activation, so a payment can
never be falsely confirmed by the browser.

## Required environment variable

```env
VITE_GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/<DEPLOY_ID>/exec
```

This is the only value the site needs. Set it as a Wasmer build/app
environment variable for `avinash405xx/dentagrow-landing`.

## Security notes

- No payment credentials, API keys or secrets exist in the frontend.
- No payment provider endpoint is bundled into the JavaScript bundle.
- The payment link is delivered by email, not embedded in the page.
- Google Sheets receives only lead form fields, never payment data.
- Payment verification is manual and server-side, out of the browser's control.

## Analytics

- Meta Pixel: `1346550847551454` (PageView only — no Purchase event).
- Microsoft Clarity: `yn5c1prhi6`.

## Calendly

`https://calendly.com/avinashjayaintelligentgroup/30min`

Optional path, available from the hero, the trial section and the contact form.
