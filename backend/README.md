# Crawford Feeding — Backend (Express)

Node.js + Express + Mongoose API for wallet, ledger, 10% levy splits, RBAC.

## Core Concepts
- **Wallet** — `wallet.model.ts` one per student, atomic `debit` with balance check
- **Ledger** — append-only `ledger.model.ts` with `gross/levy/vendorPayout` + `balanceAfter`
- **Levy** — `utils/levyCalculator.ts` single source `calculateLevySplit(gross, 0.10)` → `{gross, levy, vendorPayout}`
- **RBAC** — `middleware/auth.ts` (JWT) + `middleware/rbac.ts` (`super_admin`, `bursar`, `hostel_admin`, `student`)
  - `POST /wallet/:id/topup` → bursar/super_admin
  - `POST /admin/invite` → super_admin only

## Routes
- `POST /api/v1/auth/login` → JWT
- `GET /api/v1/wallet/:studentId`
- `POST /api/v1/wallet/:studentId/topup`
- `POST /api/v1/payments/qr` → `{studentId, vendorId, amount}` → levy split + ledger
- `GET /api/v1/payments/ledger?studentId=&hostel=&level=`
- `GET /api/v1/admin` , `POST /api/v1/admin/invite`

## Run
```bash
cp .env.example .env
npm install
npm run dev    # http://localhost:4000
curl http://localhost:4000/health
```

## Env
`PORT, MONGO_URI, JWT_SECRET, PLATFORM_LEVY_RATE=0.10`
