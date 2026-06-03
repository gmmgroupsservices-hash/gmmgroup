// Vercel serverless entry point.
// `npm run build` (esbuild) compiles server.ts → dist/server.cjs before this runs.
const app = require("../dist/server.cjs");
module.exports = app.default ?? app;
