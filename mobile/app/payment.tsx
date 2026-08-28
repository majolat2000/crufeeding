import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import QRCode from "react-native-qrcode-svg";

/**
 * PaymentScreen.tsx — QR Code Modal/View
 * - Full navy background #1A153B
 * - Header: "Present this QR code to complete your payment of ₦5 to Burger & Bread"
 * - Centered white container with dynamic QR (react-native-qrcode-svg)
 * - White pill button "Done" + live countdown 09:59 → 00:00
 *
 * Props via expo-router params: merchant, amount. QR payload = signed JSON {studentId, matric, merchant, amount, ts, nonce}
 */
export function PaymentScreen() {
  const router = useRouter();
  const { merchant = "Burger & Bread", amount = "5" } = useLocalSearchParams<{ merchant: string; amount: string }>();

  const [seconds, setSeconds] = useState(599); // 09:59
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  // Dynamic QR value — in prod sign with JWT/backend; here encode payment intent
  const qrValue = JSON.stringify({
    studentId: "STU-LCU-17109",
    matric: "LCU/UG/20/17109",
    merchant,
    amount: Number(amount),
    ts: Date.now(),
    levySplit: { gross: Number(amount), levy: Number(amount) * 0.1, payout: Number(amount) * 0.9 },
  });

  return (
    <SafeAreaView className="flex-1 bg-[#1A153B]">
      <View className="flex-1 bg-[#1A153B] px-6 pt-4 pb-6">
        {/* Close handle */}
        <View className="items-center mb-4">
          <View className="w-10 h-1 rounded-full bg-white/30" />
        </View>

        {/* Instructional header */}
        <View className="items-center px-2">
          <Text className="text-white/70 text-xs font-bold tracking-widest uppercase text-center">QR Payment</Text>
          <Text className="text-white text-[18px] font-bold text-center mt-3 leading-6">
            Present this QR code to complete your payment of <Text className="text-white font-extrabold">₦{amount}</Text> to{" "}
            <Text className="font-extrabold">{merchant}</Text>
          </Text>
          <Text className="text-indigo-200 text-xs mt-2 text-center">Vendor will scan • 10% levy auto-split</Text>
        </View>

        {/* Centered white QR container */}
        <View className="flex-1 items-center justify-center py-6">
          <View className="bg-white rounded-3xl p-6 items-center shadow-2xl" style={{ elevation: 12 }}>
            <View className="bg-white p-2 rounded-2xl">
              {/* react-native-qrcode-svg — renders crisp QR */}
              <QRCode value={qrValue} size={200} color="#1A153B" backgroundColor="#FFFFFF" />
            </View>
            <Text className="text-[#1A153B] font-extrabold text-sm mt-4">{merchant}</Text>
            <Text className="text-gray-500 text-xs mt-1">Amount: ₦{amount} • Levy 10% included</Text>
            <View className="mt-3 bg-[#F4F5F7] rounded-full px-3 py-1.5">
              <Text className="text-[#1A153B] text-xs font-bold tracking-widest">LCU/UG/20/17109</Text>
            </View>
          </View>

          {/* Countdown */}
          <View className="mt-6 bg-white/10 border border-white/20 rounded-full px-5 py-2 flex-row items-center gap-2">
            <View className="w-2 h-2 rounded-full bg-emerald-400" />
            <Text className="text-white font-mono font-bold text-sm tracking-widest">
              {mm}:{ss}
            </Text>
            <Text className="text-white/60 text-xs ml-1">expires</Text>
          </View>
          {seconds === 0 && <Text className="text-amber-300 text-xs mt-2">QR expired — generate a new one</Text>}
        </View>

        {/* White pill Done button */}
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.9}
          className="bg-white rounded-full py-4 items-center shadow-lg"
        >
          <Text className="text-[#1A153B] font-extrabold text-base">Done</Text>
        </TouchableOpacity>

        <Text className="text-white/40 text-[11px] text-center mt-3">Keep screen bright for scanner • Don’t screenshot QR</Text>
      </View>
    </SafeAreaView>
  );
}

export default PaymentScreen;
