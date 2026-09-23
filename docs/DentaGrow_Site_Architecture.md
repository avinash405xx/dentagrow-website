# DentaGrow Website — Architecture Notes

## Core positioning

DentaGrow is presented as a dental-practice operations automation and growth system, not as a collection of AI tools.

### Core problem

Dental practices can have patient demand and still lose staff time to repetitive work around the patient journey:
- missed-call follow-up
- scheduling and rescheduling
- appointment confirmations and reminders
- recall/reactivation
- routine patient communication
- repeated data entry
- workflow/status tracking
- exception routing

### Product principle

Automate repeatable work. Keep humans in control of clinical and exception-based decisions.

## Product flow

Patient demand / existing practice activity
→ capture
→ response and qualification
→ scheduling
→ reminders and follow-up
→ appointment
→ human escalation when required
→ reporting / recall / reactivation

When a practice needs growth:

Meta / Google acquisition
→ local service-area targeting
→ clinic website or DentaGrow landing page
→ lead capture
→ same follow-up and scheduling workflow

Geographic targeting improves local relevance but should never be marketed as a guarantee that every impression will be the nearest possible patient.

## Tool architecture

The clinic should see one DentaGrow experience. Behind the scenes, the exact stack can evolve.

Possible orchestration layer:
- n8n
- AI/LLM services
- Vapi or another approved voice provider
- SMS/email provider
- scheduling/calendar system
- CRM/data store
- reporting/analytics
- Meta/Google advertising when acquisition is enabled

The MVP website currently submits consultation leads to the existing Google Apps Script Web App.

## Trust rules

Do not publish fabricated customer counts, testimonials, ROI, guarantees, HIPAA claims, compliance claims, or performance numbers.

Any future customer proof should be based on real documented results and clearly identified as such.

Clinical work, diagnosis, treatment decisions and other licensed professional judgement remain with appropriate clinic professionals.

## Consultation payment gate

Public consultation CTAs point to the reservation section rather than directly to Calendly. The reservation section displays the $399 reference value, the $199 refundable consultation deposit, Skydo-hosted payment, security messaging, and the post-payment verification process. The public site does not expose the Calendly URL.

Payment state is never inferred from a button click. A trusted Skydo status is checked before the booking instructions are released.
