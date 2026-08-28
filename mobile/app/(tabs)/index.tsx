import React from "react";
import { View, Text, ScrollView, FlatList, TouchableOpacity, SafeAreaView, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { RESTAURANTS } from "../../src/constants/restaurants";

/**
 * HomeScreen.tsx — production-ready
 * - Header: university logo + "Majesty Olat"
 * - Dark navy gradient Feeding Balance card: large bold ₦75.00
 * - 2-col responsive grid of white cards (bg-white rounded-xl) for restaurants
 *
 * NativeWind classes used alongside StyleSheet fallback for gradient container.
 */
export function HomeScreen() {
  const router = useRouter();

  const renderRestaurant = ({ item }: { item: (typeof RESTAURANTS)[0] }) => (
    <TouchableOpacity
      onPress={() => router.push({ pathname: "/payment", params: { merchant: item.name, amount: "5" } })}
      activeOpacity={0.85}
      className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm items-center justify-center"
      style={{ flex: 1, margin: 6, minHeight: 110, elevation: 2, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8 }}
    >
      <View className="w-12 h-12 rounded-full bg-[#F4F5F7] items-center justify-center mb-2">
        <Text className="text-2xl">{item.icon}</Text>
      </View>
      <Text className="text-[13px] font-bold text-[#1A153B] text-center" numberOfLines={2}>
        {item.name}
      </Text>
      <Text className="text-[11px] text-gray-400 mt-1">Tap to pay</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F4F5F7]">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {/* Header — logo + student name */}
        <View className="flex-row items-center justify-between px-5 pt-3 pb-4 bg-white border-b border-gray-100">
          <View className="flex-row items-center gap-3">
            {/* University crest placeholder — replace with <Image source={require('@/assets/crest.png')} /> */}
            <View className="w-9 h-9 rounded-full bg-[#1A153B] items-center justify-center">
              <Text className="text-white font-extrabold text-sm">CU</Text>
            </View>
            <View>
              <Text className="text-xs text-gray-500 font-semibold tracking-widest uppercase">Crawford University</Text>
              <Text className="text-base font-extrabold text-[#1A153B]">Majesty Olat</Text>
            </View>
          </View>
          <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
            <Text className="text-gray-500">◐</Text>
          </View>
        </View>

        {/* Feeding Balance — dark navy gradient */}
        <View className="px-5 mt-4">
          <LinearGradient
            colors={["#1A153B", "#2E2960", "#3B3486"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-2xl p-5"
            style={{ borderRadius: 16, padding: 20 }}
          >
            <Text className="text-indigo-200 text-xs font-bold tracking-[1.5px] uppercase">Feeding Balance</Text>
            <Text className="text-white text-[36px] font-extrabold mt-2 tracking-tight">₦75.00</Text>
            <View className="flex-row items-center justify-between mt-4">
              <Text className="text-indigo-200 text-xs">Matric: LCU/UG/20/17109 • Faith Hall</Text>
              <View className="bg-white/15 px-3 py-1.5 rounded-full">
                <Text className="text-white text-xs font-bold">Active</Text>
              </View>
            </View>
            {/* Decorative circles */}
            <View className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
            <View className="absolute -right-2 top-8 w-16 h-16 rounded-full bg-white/5" />
          </LinearGradient>
        </View>

        {/* Available Restaurants — 2-col grid */}
        <View className="px-3 mt-6">
          <View className="flex-row items-center justify-between px-2 mb-2">
            <Text className="text-sm font-extrabold text-[#1A153B] tracking-wide uppercase">Available Restaurants</Text>
            <Text className="text-xs text-gray-400">6 vendors</Text>
          </View>
          <FlatList
            data={RESTAURANTS}
            keyExtractor={(i) => i.id}
            numColumns={2}
            scrollEnabled={false}
            renderItem={renderRestaurant}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            contentContainerStyle={{ paddingHorizontal: 2 }}
          />
        </View>

        {/* Quick note */}
        <View className="mx-5 mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 flex-row items-center gap-2">
          <Text className="text-amber-600">⚡</Text>
          <Text className="text-xs text-amber-800 flex-1">Tap any restaurant to generate your QR payment. 10% platform levy applied.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Default export for expo-router direct import
export default HomeScreen;
