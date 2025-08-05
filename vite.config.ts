import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import importMetaUrlPlugin from "@codingame/esbuild-import-meta-url-plugin";
import vsixPlugin from "@codingame/monaco-vscode-rollup-vsix-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vsixPlugin(), react()],

  optimizeDeps: {
    esbuildOptions: {
      plugins: [importMetaUrlPlugin],
    },
    include: ["vscode-textmate", "vscode-oniguruma"],
    exclude: [
      "@codingame/monaco-vscode-json-language-features-default-extension",
      "monaco-editor",
    ],
  },

  worker: {
    format: "es",
  },
});
