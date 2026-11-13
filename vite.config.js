import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

/**
 * The recovered application uses the shipped, content-hashed browser modules
 * in `assets/` as its baseline. This plugin keeps the host configuration and
 * classic enhancement scripts alongside Vite's generated entry bundle.
 */
function preserveStaticRuntime() {
  const runtimeFiles = [
    '_headers',
    '_redirects',
    'oms-core.js',
    'map-movement-persistence.js',
    'editor-core-v4.js',
    'drawing-panel-ui.js',
    'button-audit.js'
  ];

  return {
    name: 'preserve-static-runtime',
    closeBundle() {
      const outputDir = resolve(process.cwd(), 'dist');
      for (const file of runtimeFiles) {
        const source = resolve(process.cwd(), file);
        if (existsSync(source)) copyFileSync(source, resolve(outputDir, file));
      }
    }
  };
}

export default defineConfig({
  plugins: [preserveStaticRuntime()],
  build: {
    target: 'es2022',
    sourcemap: true
  }
});
