/** @type {import('tailwindcss').Config} */
module.exports = {
  // content: ["./src/**/*.{html,ts}"],
  presets: [require("@spartan-ng/ui-core/hlm-tailwind-preset")],
  content: ["./src/**/*.{html,ts}", "./libs/ui/**/*.{html,ts}"],
  theme: {
    extend: {
      backgroundImage: {
        landscape: "url('/images/landscape-bg.jpg')",
      },
    },
  },
  plugins: [],
};
