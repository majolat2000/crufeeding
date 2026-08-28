import React from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, SafeAreaView } from "react-native";

/**
 * ProfileScreen — crest, matric LCU/UG/20/17109, Sign Out, read-only inputs.
 * Light-grey card inputs matching spec.
 */
const Field = ({ label, value }: { label: string; value: string }) => (
  <View className="mb-3">
    <Text className="text-[11px] font-bold text-gray-500 tracking-widest uppercase mb-1.5">{label}</Text>
    <View className="bg-[#F4F5F7] rounded-xl px-4 py-3.5 border border-gray-100">
      <Text className="text-[14px] font-semibold text-[#1A153B]">{value}</Text>
    </View>
  </View>
);

export function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#F4F5F7]">
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Header — crest + matric */}
        <View className="bg-white px-5 pt-4 pb-5 border-b border-gray-100 items-center">
          <View className="w-16 h-16 rounded-full bg-[#1A153B] items-center justify-center">
            <Text className="text-white font-extrabold">CU</Text>
          </View>
          <Text className="text-[11px] font-bold text-gray-400 tracking-widest uppercase mt-3">Crawford University</Text>
          <Text className="text-lg font-extrabold text-[#1A153B] mt-1">Majesty Olatimilehin</Text>
          <Text className="text-xs text-gray-500 mt-1">LCU/UG/20/17109 • 300 Level • Faith Hall</Text>
          <TouchableOpacity className="mt-4 bg-[#1A153B] rounded-full px-6 py-2.5">
            <Text className="text-white font-bold text-sm">Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View className="px-5 mt-5">
          <Field label="Firstname" value="Majesty" />
          <Field label="Lastname" value="Olatimilehin" />
          <Field label="Middlename" value="Oluwakolade" />
          <Field label="Email" value="majesty.olat@crawford.edu.ng" />
          <Field label="Next Funding Date" value="01 Sept 2026" />
          <Field label="Total Feeding Amount" value="₦75,000" />
          <Field label="Total Amount Funded" value="₦68,500" />

          <View className="bg-white rounded-xl p-4 border border-gray-100 mt-2">
            <Text className="text-xs font-bold text-[#1A153B] uppercase tracking-wide">Feeding Summary</Text>
            <View className="flex-row justify-between mt-3">
              <Text className="text-gray-500 text-xs">Balance</Text>
              <Text className="font-extrabold text-[#1A153B]">₦75.00</Text>
            </View>
            <View className="flex-row justify-between mt-2">
              <Text className="text-gray-500 text-xs">Spent this semester</Text>
              <Text className="font-bold text-gray-700">₦6,500</Text>
            </View>
          </View>

          <Text className="text-[11px] text-gray-400 text-center mt-4">v1.0.0 • #1A153B • Bursary support: bursary@crawford.edu.ng</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default ProfileScreen;
