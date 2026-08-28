// Expo + NativeWind v2 (compatible with Node 26, Expo 52)
const { getDefaultConfig } = require("expo/metro-config");
const config = getDefaultConfig(__dirname);
try {
  const { withNativeWind } = require("nativewind/metro");
  module.exports = withNativeWind(config, { input: "./global.css" });
} catch (e) {
  // nativewind/metro not available in v2 - fallback to default (Tailwind via PostCSS)
  console.warn("nativewind/metro not found, using default metro config");
  module.exports = config;
}
