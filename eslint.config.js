import { config } from "@debbl/eslint-config";

export default config({
  ignores: {
    files: ["packages/"],
  },
  typescript: true,
});
