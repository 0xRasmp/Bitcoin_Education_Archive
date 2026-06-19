import { readFileSync, writeFileSync, cpSync, existsSync, rmSync, mkdirSync, readdirSync } from 'fs';
import { resolve } from 'path';
import { minify } from 'terser';

const srcFiles = [
  'channel_index.js', 'utils.js', 'ranking.js', 'badges.js', 'tickets.js',
  'engagement.js', 'nacho-live.js', 'nacho.js', 'nacho-engage.js', 'nacho-closet.js',
  'quests.js', 'forum.js', 'marketplace.js', 'messaging.js', 'features.js',
  'mobile-ux.js', 'bitcoin-dashboard.js', 'app.js', 'ux-patches.js',
];

const rootDir = process.cwd();

const COPY_EXCLUDE = new Set([
  'node_modules', '.git', '.githooks', 'dist', 'public', 'src',
  '.claude', '.firebase', 'functions', 'scripts', 'tests', 'workers',
  'docs', 'package.json', 'package-lock.json', 'vite.config.js',
  'deploy.sh', 'build.sh', '.gitignore', '.gitattributes', 'bundle.src.js',
  '.vercel',
]);

console.log('📦 Concatenating', srcFiles.length, 'source files...');
const concatenated = srcFiles.map(f => readFileSync(resolve(rootDir, f), 'utf-8')).join('\n');
writeFileSync(resolve(rootDir, 'bundle.src.js'), concatenated);
console.log('✅ bundle.src.js:', concatenated.length, 'bytes');

console.log('🗜️ Minifying with terser...');
let bundleCode;
try {
  const result = await minify(concatenated, { compress: { passes: 2 }, mangle: true });
  bundleCode = result.code;
  console.log('✅ bundle.js:', bundleCode.length, 'bytes');
} catch (err) {
  console.warn('⚠️ Minification failed, using unminified bundle:', err.message);
  bundleCode = concatenated;
}
writeFileSync(resolve(rootDir, 'bundle.js'), bundleCode);

console.log('📁 Copying static site into dist/...');
const distDir = resolve(rootDir, 'dist');
if (existsSync(distDir)) rmSync(distDir, { recursive: true, force: true });
mkdirSync(distDir);
for (const entry of readdirSync(rootDir)) {
  if (COPY_EXCLUDE.has(entry)) continue;
  cpSync(resolve(rootDir, entry), resolve(distDir, entry), { recursive: true });
}
console.log('✅ dist/ is now a full static copy.');