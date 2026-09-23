# DentaGrow QA Report

## Verified in this build

- $199 consultation deposit is hard-coded in the UI.
- $399 reference value is displayed as the crossed-out amount.
- Primary consultation CTAs point to `#reserve`; they do not open Calendly directly.
- Public Calendly links were removed so an unpaid visitor cannot bypass the consultation-deposit step.
- The post-form state sends the visitor back to the secure $199 reservation step.
- Skydo is the external payment provider; bank/payment credentials are not collected by the website.
- The frontend does not mark payment as successful from a button click.
- The previous $99 Skydo link ID is not shipped.
- Google Apps Script Web App URL remains configured for the lead form.
- TypeScript syntax/type-check of `App.tsx` and `src/lib/config.ts` was run with isolated local type stubs and passed.

## Live verification still required

The production Skydo URL is intentionally blank because the old payment link is for the previous $99 setup. A new **USD 199 Skydo InstaLink** must be created and placed in `.env.local`. The QA script will fail until that real URL exists.

The container could not complete `npm ci` because external package-network access timed out, so a full Vite production build/lint could not be executed in this environment. The source-level checks above passed.

## Production gate

Run:

```bash
npm ci
npm run build
npm run lint
npm run qa
```

The final `qa` command is intentionally strict: it will not pass without a real `https://dashboard.skydo.com/pay/...` URL.
