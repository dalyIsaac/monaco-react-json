import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";
import importMetaUrlPlugin from "@codingame/esbuild-import-meta-url-plugin";
import vsixPlugin from "@codingame/monaco-vscode-rollup-vsix-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vsixPlugin(),
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/@codingame/monaco-vscode-json-default-extension/resources",
          dest: "resources",
        },
      ],
    }),
  ],

  optimizeDeps: {
    esbuildOptions: {
      plugins: [importMetaUrlPlugin],
    },
  },

  worker: {
    format: "es",
  },
});
