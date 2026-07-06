# DeedTracker

A gamified spiritual-growth companion helping Muslims stay consistent in worship and self-improvement. Next.js (App Router) + Supabase.

## Canonical infrastructure

To avoid confusion with similarly-named projects, **these are the only ones this app uses**:

| Service | Canonical | Do NOT use |
|---|---|---|
| GitHub repo | `Masterzeidane/deedtracker-stitch` | — |
| Production branch | `main` | — |
| Supabase project | `dhwxxcvolwdzkzggjzup` ("deedtracker-stitch") — `https://dhwxxcvolwdzkzggjzup.supabase.co` | `mmcwvkebudvzfeomkwjo` ("deed-tracker") |
| Vercel project | `deedtracker-stitch` | `deedtracker-new`, `deed-tracker` |
| Production URL | https://deedtracker-stitch.vercel.app | — |

> The unused Supabase/Vercel projects above are safe to delete from their dashboards once you've confirmed nothing else depends on them — do it manually; this repo never references them.

## Local setup

```bash
npm install --legacy-peer-deps
cp .env.example .env.local   # then fill in the keys from the Supabase dashboard
npm run dev
```

Required env vars (see `.env.example`): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`, and (server-only, never commit) `SUPABASE_SERVICE_ROLE_KEY`.

## Database

Schema and business logic live in `supabase/migrations/` (`001`–`009`), applied to the canonical Supabase project. Seed data is in `supabase/seed.sql`.

## Documentation

- `docs/PRODUCT_VISION_AND_ROADMAP.md` — product vision, Islamic mechanics, roadmap, north star
- `docs/QA_PRODUCTION_CHECKLIST.md` — manual QA checklist
- `docs/DB_DEPLOYMENT_REPORT.md` — database deployment record
- `docs/SECURITY_VERIFICATION_REPORT.md` — security hardening & verification
