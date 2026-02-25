import { heroui } from '@heroui/theme'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,html}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        panel:
          'linear-gradient(0deg, #000, transparent), linear-gradient(90deg, #fff, hsla(0,0%,100%,0))',
        bar: 'linear-gradient(90deg,red,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,red)',
      },
    },
  },
  plugins: [heroui()],
}
