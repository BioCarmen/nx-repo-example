import { build } from "esbuild";
import { exec } from "child_process";

const baseConfig = {
  entryPoints: ["src/index.ts"],
  minify: true,
  sourcemap: true,
  bundle: true,
  platform: "node",
  target: "node20",
  packages: "external",
};

exec("yarn tsc --emitDeclarationOnly", (error, stdout) => {
  if (error) {
    console.error(stdout);
    process.exit(1);
  }
});

build({
  ...baseConfig,
  outdir: "dist/cjs",
  format: "cjs",
  outExtension: {
    ".js": ".cjs",
  },
});

build({
  ...baseConfig,
  outdir: "dist/esm",
  format: "esm",
  outExtension: {
    ".js": ".mjs",
  },
});
