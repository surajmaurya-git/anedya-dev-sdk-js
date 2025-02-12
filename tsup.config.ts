import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],  // Single entry point
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
});
