# Formatify — React + Tailwind CSS

All five pages are React components in ONE Vite app with ONE package.json.

## Run

Install Node.js 22 or newer. Extract this folder and open its terminal:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Home, Pricing, FAQ, Contact and Login / Sign Up all run together.

```sh
npm run build
npm run preview
```

## Source

- src/App.jsx: shared navigation, footer, theme and React Router routes.
- src/pages: Home.jsx, Pricing.jsx, FAQ.jsx, Contact.jsx, Account.jsx.
- src/components/Converter.jsx: React state for drag/drop, local conversion and downloads.
- src/components/Icon.jsx: Lucide React icons.
- src/styles.css: Tailwind v4 entry, theme tokens and utility compositions.
- src/tokens.css: brand design tokens and local fonts.
- src/design.css and src/pages.css: custom page styles preserving the approved design alongside Tailwind.
- public/assets: all local images, icons and fonts.
- vite.config.js: Vite with Tailwind CSS plugin.

Routes: /, /pricing, /faq, /contact, /account. On production hosting, configure an index.html fallback for direct route refreshes. Vite handles this locally.

## Working

All React pages and navigation, themes, responsive menu, FAQ accordions, contact email draft, login/sign-up tabs, and PNG/JPG/WebP/SVG conversion and downloads. No separate HTML website or separate login project.

## Backend integration still needed

Authentication, payments, lifetime quota enforcement, HEIC conversion, PDF merging, video compression, batch conversion, and server file deletion are not connected. Preview notices explain this.

In App.jsx, pass real async onLogin and onSignUp functions to Account to enable its form. Each callback receives { email, password } and must throw on failure. Implement sessions, verification and password reset through your authentication service. Never store passwords in browser storage or expose secret API keys.

Free is 10 uploads per account over its lifetime, never resetting. Pro is LKR 350/month. WhatsApp is 0787168496. Enforce quotas using authenticated backend records and atomic counters. The local preview does not enforce the quota.

## Validation

Production build verified. Asset credits are in ASSETS.md. A package-lock.json is included. node_modules, credentials and deployment identity are excluded.
