import { defineConfig } from 'vite';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { minify } from 'terser';

const srcFiles = [
  'channel_index.js',
  'utils.js',
  'ranking.js',
  'badges.js',
  'tickets.js',
  'engagement.js',
  'nacho-live.js',
  'nacho.js',
  'nacho-engage.js',
  'nacho-closet.js',
  'quests.js',
  'forum.js',
  'marketplace.js',
  'messaging.js',
  'features.js',
  'mobile-ux.js',
  'bitcoin-dashboard.js',
  'app.js',
  'ux-patches.js',
];

const rootDir = process.cwd();

export default defineConfig({
  plugins: [
    {
      name: 'concat-and-minify',
      apply: 'build',
      async buildStart() {
        console.log('📦 Concatenating', srcFiles.length, 'source files...');

        // Step 1: Concatenate all source files in order
        const concatenated = srcFiles
          .map(f => readFileSync(resolve(rootDir, f), 'utf-8'))
          .join('\n');

        // Save unminified bundle.src.js for reference
        writeFileSync(resolve(rootDir, 'bundle.src.js'), concatenated);
        console.log('✅ bundle.src.js:', concatenated.length, 'bytes');

        // Step 2: Minify with terser (same settings as build.sh)
        console.log('🗜️ Minifying with terser...');
        try {
          const result = await minify(concatenated, {
            compress: { passes: 2 },
            mangle: true,
          });
          writeFileSync(resolve(rootDir, 'bundle.js'), result.code);
          console.log('✅ bundle.js:', result.code.length, 'bytes');
        } catch (err) {
          console.warn('⚠️ Minification failed, using unminified bundle');
          console.warn(err.message);
          writeFileSync(resolve(rootDir, 'bundle.js'), concatenated);
        }

        // Exit cleanly — we've done all the work ourselves
        process.exit(0);
      },
    },
  ],
  // Dummy build config (never reached due to buildStart exit)
  build: {
    outDir: 'dist',
    emptyOutDir: false,
  },
});
