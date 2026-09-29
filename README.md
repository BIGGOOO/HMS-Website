# Seha One product website

A standalone one-page product marketing site for a CARE-based HMS offering.

## Run locally

```powershell
cd D:\PersonalProject\HMS\product-website
npm install
npm run dev
```

Open the address shown by Vite (normally `http://127.0.0.1:5173`).

## Production build

```powershell
npm run build
npm run preview
```

## Lead form behavior

The contact form in `#contact` is functional out of the box: with no backend
configured it opens the visitor's email client with the request prefilled
(see `CONTACT_EMAIL` in `app.js`). To submit leads straight to a CRM, email
service, or backend instead, set `FORM_ENDPOINT` in `app.js` to an endpoint
that accepts a JSON POST of `{ email, organisation, interest }`; the form will
switch to submitting there automatically, with error handling that falls back
to a "please email us" message if the request fails.

## Brand assets

The supplied Seha One identity files are in `assests/`. The header and footer
use `logo_noBG.png`; the browser favicon uses `favicon.png`; and the dashboard
mockup uses `favicon_noBG.png`.

## Before publishing

These remain manual steps requiring assets or approvals this repo can't supply:

- Replace the illustrative dashboard/screen mockups in `index.html` (the
  `.dashboard-window` and `.screen-gallery` markup) with approved, anonymised
  CARE screenshots — current mockups are hand-built CSS/HTML, not real
  screenshots, chosen specifically to avoid any patient-data risk.
- Set `FORM_ENDPOINT` in `app.js` to your CRM/email/backend of choice (see
  above) once one is approved.
- Obtain legal review before making jurisdiction-specific regulatory or
  certification claims (see the disclaimers in the security and regulatory
  sections of `index.html`).
