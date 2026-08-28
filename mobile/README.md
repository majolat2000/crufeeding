# Crawford Feeding — Mobile (Expo)

React Native + Expo app with navy `#1A153B` + white card UI.

## Screens
- **Home** — balance hero, quick actions, recent activity
- **QR Payment** — camera placeholder, amount + 10% levy preview, confirm flow
- **Transactions** — filterable ledger list (all/debit/credit)
- **Profile** — student/hostel info, actions, logout

## Stack
- Expo ~52, React Navigation 7, Zustand, Axios, date-fns
- Theme: `src/theme/colors.ts` (navy, card, spacing)
- API: `src/api/client.ts` → `EXPO_PUBLIC_API_URL` (default `http://localhost:4000/api/v1`)

## Run
```bash
npm install
npm run dev        # expo start
npm run android
npm run ios
```

## Structure
```
src/
  components/Card.tsx, BalanceCard.tsx
  screens/HomeScreen.tsx, QRPaymentScreen.tsx, TransactionsScreen.tsx, ProfileScreen.tsx
  navigation/AppNavigator.tsx
  theme/colors.ts
  api/client.ts
  hooks/useWallet.ts
```
