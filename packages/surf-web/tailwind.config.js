import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,html}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {},
  plugins: [nextui()],
};
