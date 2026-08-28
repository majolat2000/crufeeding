# Crawford Feeding — Web Admin Portal (Next.js)

Dark sidebar `#1A153B` layout with analytics, settings, and RBAC tables.

## Pages
- `/` Dashboard — collections, 10% levy, vendor payout, hostel breakdown, recent tx
- `/hostels` — Hostel CRUD + occupancy
- `/levels` — 100L-500L meal plan caps
- `/admins` — Admin table (super_admin / bursar / hostel_admin) via `DataTable`
- `/logs` — Immutable activity logs

## Stack
- Next.js 14 (App Router), Tailwind, Recharts, Zustand, Axios
- Layout: `src/app/layout.tsx` + `src/components/Sidebar.tsx`
- Proxy: `next.config.js` rewrites `/api/*` → `http://localhost:4000`

## Run
```bash
npm install
npm run dev    # http://localhost:3001
npm run build && npm start
```
