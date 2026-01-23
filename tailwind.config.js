module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,ts}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: "#7F4797",
          dark: "#19191C",
          secondary: "#252429",
          surface: "#565657",
          muted: "#9F9F9F",
          text: "#F4F4F4",
        },
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
