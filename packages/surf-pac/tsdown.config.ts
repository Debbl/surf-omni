import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  sourcemap: true,
  dts: { sourcemap: true },
  inlineOnly: false,
})
