module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    // nativewind/babel causes async PostCSS error on Node 26 +Tailwind 3.3 - disabled for web export
    // native styles still work via StyleSheet + global.css; re-enable with `npm i tailwindcss@3.4.1` fixes
    plugins: [["expo-router/babel"]],
  };
};
