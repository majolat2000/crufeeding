import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

/**
 * Root layout — expo-router Stack with modal for PaymentScreen (QR).
 * Navy status bar to match #1A153B brand.
 */
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#1A153B" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#F4F5F7" },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Payment is presented as full-screen modal over tabs */}
        <Stack.Screen
          name="payment"
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
            headerShown: false,
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
