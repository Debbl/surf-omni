import { defineConfig } from '@debbl/eslint-config'

export default defineConfig({
  ignores: {
    files: ['packages/'],
  },
  typescript: true,
})
