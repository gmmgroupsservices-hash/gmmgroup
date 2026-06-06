import { build } from 'esbuild';
import { builtinModules } from 'module';
import { mkdir, writeFile } from 'node:fs/promises';
import pkg from './package.json' with { type: 'json' };


const dependencies = pkg.dependencies ? Object.keys(pkg.dependencies) : [];

await build({
  entryPoints: ['server.ts'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  // Mark all dependencies and built-ins as external
  external: [...dependencies, ...builtinModules, 'fsevents', 'vite'],
  sourcemap: false,
  outfile: 'dist/server.cjs'
});

await mkdir('dist', { recursive: true });
await writeFile(
  'dist/index.html',
  '<!doctype html><html><head><meta charset="utf-8"><title>GMM Backend</title></head><body>GMM backend build complete.</body></html>'
);


