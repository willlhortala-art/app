# Beau comme un camion — Espace Pro (prototype)

Single-page mobile-first web app (React 19 + Tailwind v4 + shadcn/ui). **100% mock data, no backend calls** — by explicit user choice. The FastAPI backend is untouched (template `/api/` and `/api/status` only).

## Structure
- `frontend/src/pages/Home.tsx` — entire app in one file (single default-exported component + small hoisted presentational helpers).
- `frontend/src/index.css` — dark industrial theme (bg `#111827`, white cards, amber `#F59E0B` accent), fonts Space Grotesk (headings) + Instrument Sans (body), keyframes `rivet` / `slide-up`.
- Route: `/` → `Home` (App.tsx unchanged).

## Tabs (bottom navigation, `data-testid="nav-tab-{projet|atelier|coffre}"`)
1. **Mon Projet** — configurator: vehicle (food truck / remorque / container), sector (burger / pizza / creperie / snacking), power (mono / triphase), 4 atelier options. Live price range + delay in weeks. `request-study-button` → toast + `study-confirmation` recap block.
2. **Suivi Atelier** — Camion Burger, Client #4092. Global progress 42% (2 done + 1 in progress of 6), vertical timeline of 6 steps, 6-photo gallery.
3. **Coffre-fort & SAV** — 5 downloadable documents (real PDF blobs generated client-side), "Signaler une panne" dialog (equipment chips + description ≥ 5 chars) → toast + ticket card in `tickets-list`.

## Pricing model (mock)
`base(vehicle) * coef(sector) + power surcharge + options`, displayed as −7% / +8% range. Delay = base weeks + sector extra + 2 if triphase + 1 if >2 options.

## No auth, no credentials.
