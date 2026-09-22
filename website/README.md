# MonDex website

The current MonDex marketing website at https://mondextcg.com, published using GitHub Pages.
Next.js static export, React, Three.js and GSAP. English is the default, with a German language switch.

## Develop and publish

Use Node 22 or later. Run `npm ci`, then `npm run dev`.
Before publishing: `npm run lint`, `npm run build:pages`, `npm run verify:pages`.
Pushes to `main` build this directory and deploy `website/out/` using the repository’s root `.github/workflows/pages.yml`.
The existing custom domain is preserved. Previous `/de/` links redirect to the matching page in German.

## Waitlist

The form submits directly to `https://mondex-api.onrender.com/api/v1/waitlist`.
It sends an email address, optional first name and phone platform, selected website language,
a campaign tag (otherwise `website-launch`) and the existing honeypot field.
No account or API secret is required. The backend must allow the production domain through CORS.
Pending, confirmation, invalid input, rate-limit, timeout and connection errors are handled in both languages.
Do not submit real test addresses without the owner's authorization.

The legal and privacy pages retain the marked operator and retention placeholders from the source
material until the owner supplies those facts.
