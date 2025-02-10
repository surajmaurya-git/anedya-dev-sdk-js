import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    anedya: "src/anedya.ts",
    models: "src/models.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
});
