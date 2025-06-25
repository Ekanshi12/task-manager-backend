const app = require("./server");

module.exports = async (req, res) => {
  try {
    // Set CORS headers for Vercel
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    app(req, res);
  } catch (error) {
    console.error('Function error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};