import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  const hmrDisabled = process.env.DISABLE_HMR === 'true';
  const hmrPort = Number(process.env.HMR_PORT) || 24679;
  const backendPort = Number(process.env.BACKEND_PORT) || 3000;

  return {
    root: __dirname,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: `http://localhost:${backendPort}`,
          changeOrigin: true,
        },
      },
      hmr: hmrDisabled ? false : { port: hmrPort },
      watch: hmrDisabled ? null : {},
    },
  } as any;
});
