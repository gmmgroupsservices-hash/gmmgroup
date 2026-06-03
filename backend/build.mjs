import { build } from 'esbuild';
import { builtinModules } from 'module';
import pkg from './package.json' assert { type: 'json' };

const dependencies = pkg.dependencies ? Object.keys(pkg.dependencies) : [];

await build({
  entryPoints: ['server.ts'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  // Mark all dependencies and built-ins as external
  external: [...dependencies, ...builtinModules, 'fsevents', 'vite'],
  sourcemap: false,
  outfile: 'api/bundle.cjs'
});


