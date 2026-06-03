const app = require('./bundle.cjs');
module.exports = app.default ?? app;
