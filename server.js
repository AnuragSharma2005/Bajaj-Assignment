const app = require('./api/index.js');
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 BFHL API Server → http://localhost:${PORT}`);
  console.log(`   POST /bfhl`);
  console.log(`   GET /health`);
});
