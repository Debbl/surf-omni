import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
import dts from "rollup-plugin-dts";

export default defineConfig([
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.js",
      format: "esm",
    },
    plugins: [typescript(), nodeResolve(), commonjs()],
  },
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.d.ts",
      format: "es",
    },
    plugins: [dts()],
  },
]);
