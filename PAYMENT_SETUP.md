# DentaGrow Payment Setup

## Skydo

The website is architected around a Skydo InstaLink for the **$199 refundable consultation deposit**.

Skydo currently does not provide website checkout embedding, so the secure payment button intentionally opens the Skydo-hosted payment page in a new tab. The website never asks for or stores bank credentials.

### One required production value
Create a **new Skydo InstaLink for USD 199** and put its URL in `.env.local`:

```env
VITE_SKYDO_PAYMENT_URL=https://dashboard.skydo.com/pay/YOUR_NEW_199_LINK
```

Do not point this at the older $99 link. The UI already displays $199; the Skydo payment link must independently be configured for $199.

## Funnel

1. Visitor lands on DentaGrow.
2. Primary CTAs lead to the reservation/payment section.
3. Visitor sees $399 crossed out and $199 refundable consultation deposit.
4. Visitor clicks **Continue to Secure Payment** and completes payment on Skydo.
5. DentaGrow verifies the payment in Skydo before releasing the consultation-booking instructions.
6. The consultation time is then booked through the private booking instructions sent after verification.

The browser does **not** mark a payment as successful merely because the user clicked the payment button. This avoids false payment confirmation.

## Security notes

- No Skydo credentials or bank credentials are placed in the frontend.
- No payment secrets are stored in Vite client-side environment variables.
- Payment is completed on Skydo's hosted page.
- Google Sheets receives only the lead form fields; it does not receive payment credentials.
- For a future automated payment-verification workflow, use a trusted Skydo server-side mechanism if/when available; never trust a client-side success flag.

## Refund wording

The site uses careful wording: **refundable consultation deposit according to the consultation/refund policy**. It does not promise instant or automatic ACH refunds.

## Booking

The public website intentionally does **not** expose the Calendly booking URL. This prevents an unpaid visitor from bypassing the $199 consultation-deposit step. The existing Calendly URL can be used by the DentaGrow team only after Skydo payment verification.
