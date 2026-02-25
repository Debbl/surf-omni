import { defineConfig } from '@debbl/eslint-config'

export default defineConfig({
  typescript: true,
  react: true,
  tailwindcss: {
    settings: {
      entryPoint: './src/styles/tailwind.css',
    },
  },
})
