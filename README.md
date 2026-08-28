# Crawford Digital Feeding Management Platform

Monorepo for Crawford University feeding wallet — mobile QR payments, web bursary portal, and levy-aware backend. Theme navy `#1A153B` + white cards.

```
/
├── mobile/   # Expo React Native — Home, QR Pay, Transactions, Profile
├── web/      # Next.js 14 Admin Portal — sidebar, dashboard, hostels/levels, admins, logs
├── backend/  # Express + Mongoose — wallet, ledger, RBAC
```

## Quick Start

```bash
# Backend (port 4000)
cd backend && cp .env.example .env && npm install && npm run dev

# Web (port 3001, proxies /api → backend)
cd web && npm install && npm run dev

# Mobile (Expo)
cd mobile && npm install && npm run dev
```

## Architecture
- **Mobile** `/mobile` — Expo Router, bottom tabs, `src/theme/colors.ts` (navy), QR screen previews 10% levy before `POST /payments/qr`.
- **Web** `/web` — App Router + Tailwind, `Sidebar.tsx` navy layout, `page.tsx` analytics (collections/levy/payout/hostel split), `hostels/page.tsx`, `levels/page.tsx`, `admins/page.tsx` (RBAC table), `logs/page.tsx`.
- **Backend** `/backend` — `calculateLevySplit(gross,0.10)` in `utils/levyCalculator.ts`; `Wallet` atomic debit; `Ledger` append-only with `levy/vendorPayout`; `middleware/auth.ts` + `rbac.ts` (`super_admin`/`bursar`).

## Git
```bash
git status
git add mobile web backend README.md .gitignore
git commit -m "feat: scaffold Crawford platform (mobile/web/backend)"
git push
```

See `mobile/README.md`, `web/README.md`, `backend/README.md` for module details.
