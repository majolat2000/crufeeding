import React from "react";
import { View, Text, FlatList, SafeAreaView } from "react-native";

type Tx = { id: string; merchant: string; icon: string; timestamp: string; amount: number };

const DATA: Tx[] = [
  { id: "1", merchant: "Burger & Bread", icon: "🍔", timestamp: "28 Aug 2026 • 12:34 PM", amount: 50 },
  { id: "2", merchant: "Tasty Vine Kitchen", icon: "🍲", timestamp: "28 Aug 2026 • 09:12 AM", amount: 10 },
  { id: "3", merchant: "Cresta", icon: "🍕", timestamp: "27 Aug 2026 • 07:45 PM", amount: 50 },
  { id: "4", merchant: "Mama Cass", icon: "🍛", timestamp: "27 Aug 2026 • 01:20 PM", amount: 10 },
  { id: "5", merchant: "Burger & Bread", icon: "🍔", timestamp: "26 Aug 2026 • 06:05 PM", amount: 5 },
];

/**
 * TransactionsScreen — scrollable history, white cards, indigo amounts.
 * Right-aligned bold indigo (₦10, ₦50), restaurant icons, merchant + timestamp.
 */
export function TransactionsScreen() {
  const renderItem = ({ item }: { item: Tx }) => (
    <View className="bg-white rounded-xl mx-5 mb-3 p-4 flex-row items-center border border-gray-100 shadow-sm">
      <View className="w-10 h-10 rounded-full bg-[#F4F5F7] items-center justify-center mr-3">
        <Text className="text-lg">{item.icon}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-[14px] font-bold text-[#1A153B]">{item.merchant}</Text>
        <Text className="text-[11px] text-gray-500 mt-0.5">{item.timestamp}</Text>
      </View>
      <Text className="text-[15px] font-extrabold text-[#4338CA]">₦{item.amount}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F4F5F7]">
      <View className="bg-white px-5 py-4 border-b border-gray-100">
        <Text className="text-lg font-extrabold text-[#1A153B]">Transactions</Text>
        <Text className="text-xs text-gray-500 mt-1">History • All debits, ledger-backed</Text>
      </View>
      <FlatList data={DATA} keyExtractor={(i) => i.id} renderItem={renderItem} contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }} showsVerticalScrollIndicator={false} />
    </SafeAreaView>
  );
}

export default TransactionsScreen;
