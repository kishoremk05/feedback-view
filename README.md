# FeedbackView

FeedbackView is a customer reputation and feedback workflow app.
It helps businesses collect private feedback, route happy customers to public review platforms, and capture critical feedback internally before it becomes a negative public review.

## Key Features

- Private feedback capture with 1-5 star experience flow
- Positive-review routing to configured platform links
- Business dashboard with trends, recent feedback, and link management
- QR-code generation and copy/share review link utilities
- Authenticated admin panel for users and recent feedback monitoring
- Supabase-backed data and authentication

## Feature Inventory

### Working / Completed

- Public landing page with responsive navigation and CTAs
- Email/password authentication (sign in + sign up)
- Business dashboard with KPIs, analytics chart, feedback table, review link tools, and QR generation
- Public review capture flow at `/review/:businessId`
- Admin page with authenticated access
- Supabase-backed persistence for businesses, feedback, and review links

### Placeholder / Marketing-only (not yet implemented end-to-end)

- AI-powered smart response assistant
- Reputation protection alerting workflows
- Native integrations with Google/Yelp/Facebook/Trustpilot and other external platform APIs
- Advanced role management and deeper analytics expansion called out in roadmap/status text

## Tech Stack

- Frontend: React 18, TypeScript, Vite
- UI: Tailwind CSS, shadcn/ui, Radix UI, Lucide Icons
- Data/Auth: Supabase (`@supabase/supabase-js`)
- Charts: Recharts
- State/Data fetching: TanStack React Query
- Testing: Vitest, Playwright

## Project Structure

```text
src/
	pages/
		Landing.tsx        # Public landing page
		Auth.tsx           # Login/Signup
		Dashboard.tsx      # Main business dashboard
		ReviewPage.tsx     # Public review capture page (/review/:businessId)
		Admin.tsx          # Admin-only area
	integrations/supabase/
		client.ts          # Supabase client using VITE env keys
	hooks/
		useAuth.tsx        # Auth context and auth operations
supabase/
	migrations/          # SQL migrations
```

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_or_publishable_key
VITE_MERCHANT_SESSION_TTL_HOURS=6
VITE_TURNSTILE_SITE_KEY=your_cloudflare_turnstile_site_key
```

These are required by `src/integrations/supabase/client.ts`.
`VITE_MERCHANT_SESSION_TTL_HOURS` is optional and defaults to `6`.

## Turnstile Edge Function Setup

Server-side captcha verification is implemented in the Edge Function at `supabase/functions/verify-turnstile/index.ts`.

1. Set the Turnstile secret in Supabase:

```bash
supabase secrets set TURNSTILE_SECRET_KEY=your_cloudflare_turnstile_secret_key
```

2. Deploy the function:

```bash
supabase functions deploy verify-turnstile
```

3. Ensure your frontend uses the matching site key in `.env`:

```env
VITE_TURNSTILE_SITE_KEY=your_cloudflare_turnstile_site_key
```

## Getting Started

### 1. Prerequisites

- Node.js 18+
- npm 9+

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

- Add `.env` with the variables above
- Ensure your Supabase project has the expected tables/migrations applied

### 4. Run in development

```bash
npm run dev
```

App runs at `http://localhost:8080` by default.

## Available Scripts

- `npm run dev` - start dev server
- `npm run build` - build for production
- `npm run build:dev` - development-mode build
- `npm run preview` - preview production build
- `npm run lint` - run ESLint
- `npm run test` - run Vitest tests once
- `npm run test:watch` - run Vitest in watch mode

## Routes

- `/` - Landing page
- `/auth` - Authentication page
- `/dashboard` - Main dashboard (authenticated)
- `/review/:businessId` - Public feedback/review flow
- `/admin` - Admin panel (admin users only)

## Deployment

### GitHub

```bash
git add .
git commit -m "Prepare FeedbackView for deployment"
git push
```

### Production Build Check

```bash
npm run build
```

If build succeeds, deploy `dist/` using your preferred hosting platform (for example Vercel, Netlify, Cloudflare Pages, or static hosting behind an API/Supabase backend).

## Security Notes

- Never commit `.env` to git
- `.gitignore` is configured to ignore `.env` and `.env.*`
- Keep Supabase service-role keys out of frontend code

## Status

FeedbackView is actively evolving. Core flow is production-ready, with opportunities to expand analytics depth, role management, and platform integrations.
