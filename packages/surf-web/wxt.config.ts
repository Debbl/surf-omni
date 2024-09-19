import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: "surf-omni",
    description: "surf-omni",
    permissions: ["proxy", "storage", "tabs", "downloads", "webRequest"],
    host_permissions: ["<all_urls>"],
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
