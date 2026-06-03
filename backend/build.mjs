import { build } from 'esbuild';

await build({
  entryPoints: ['server.ts'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  external: ['vite', 'fsevents'],
  sourcemap: false,
  outfile: 'api/bundle.cjs'
});

