import { URL, fileURLToPath } from "node:url";
import { defineConfig } from "wxt";
import react from "@vitejs/plugin-react";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    permissions: ["proxy", "storage"],
  },
  srcDir: "src",
  publicDir: "public",
  alias: {
    "@": fileURLToPath(new URL("./src", import.meta.url)),
  },
  vite: () => ({
    plugins: [react()],
  }),
});
