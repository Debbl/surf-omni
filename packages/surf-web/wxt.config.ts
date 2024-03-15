import { URL, fileURLToPath } from "node:url";
import { defineConfig } from "wxt";
import react from "@vitejs/plugin-react";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: "surf-omni",
    permissions: ["proxy", "storage"],
  },
  srcDir: fileURLToPath(new URL("./src", import.meta.url)),
  publicDir: fileURLToPath(new URL("./public", import.meta.url)),
  alias: {
    "@": fileURLToPath(new URL("./src", import.meta.url)),
  },
  vite: () => ({
    plugins: [react()],
  }),
});
