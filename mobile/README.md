# Crawford Feeding — Mobile (Expo + NativeWind)

Expo + `expo-router` + NativeWind (Tailwind) with navy `#1A153B` + white card UI.

## Folder Architecture
```
mobile/
├── app/
│   ├── _layout.tsx              # Stack + modal for /payment
│   ├── payment.tsx              # QR modal (full navy, react-native-qrcode-svg, countdown)
│   └── (tabs)/
│       ├── _layout.tsx          # 3-tab bar: Home, Transactions, Profile
│       ├── index.tsx            # HomeScreen
│       ├── transactions.tsx
│       └── profile.tsx
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx       # gradient balance ₦75 + 2-col restaurant grid
│   │   ├── PaymentScreen.tsx    # QR modal reusable
│   │   ├── TransactionsScreen.tsx # indigo amounts, timestamps
│   │   └── ProfileScreen.tsx    # LCU/UG/20/17109 + read-only inputs
│   ├── components/
│   │   ├── Card.tsx
│   │   └── BalanceCard.tsx
│   ├── constants/restaurants.ts
│   ├── theme/colors.ts          # navy #1A153B
│   ├── api/client.ts            # axios → EXPO_PUBLIC_API_URL
│   └── hooks/useWallet.ts
├── global.css                   # tailwind entry
├── tailwind.config.js           # content: app + src, navy extended
├── metro.config.js              # withNativeWind
├── nativewind-env.d.ts
└── package.json
```

## Dependencies
```json
{
  "expo": "~52.0.0",
  "expo-router": "^4.0.0",
  "expo-linear-gradient": "~14.0.0",
  "react-native-qrcode-svg": "^6.3.0",
  "react-native-svg": "15.8.0",
  "nativewind": "^2.0.11",
  "tailwindcss": "3.3.5"
}
```

## Run
```bash
npm install
npm run dev  # expo start
```

## Production Snippets
See `src/screens/HomeScreen.tsx` (FlatList 2-col, LinearGradient ₦75.00) and `src/screens/PaymentScreen.tsx` (full navy, QRCode, 09:59 timer, white pill Done).

NativeWind classes: `bg-[#1A153B]`, `bg-white rounded-xl`, `text-[#4338CA]` for indigo amounts.
