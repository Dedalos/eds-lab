/**
 * Builds the React part of the timeline block: src-react/timeline-app.jsx ->
 * blocks/timeline/timeline-app.js (one ES module, React included).
 * `npm run build:react`. The output is committed: EDS has no build step.
 */
import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: false,
  esbuild: { jsx: 'automatic' },
  define: { 'process.env.NODE_ENV': '"production"' },
  build: {
    outDir: 'blocks/timeline',
    emptyOutDir: false,
    modulePreload: false,
    target: 'es2020',
    rollupOptions: {
      input: 'src-react/timeline-app.jsx',
      preserveEntrySignatures: 'exports-only',
      output: {
        format: 'es',
        entryFileNames: 'timeline-app.js',
        inlineDynamicImports: true,
      },
    },
  },
});
