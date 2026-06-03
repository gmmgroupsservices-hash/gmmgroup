// Vercel serverless entry point.
// `npm run build` (esbuild) compiles server.ts → api/bundle.cjs before this runs.
const app = require('./bundle.cjs');
module.exports = app.default ?? app;

