const config = require('./config');
const { createBot, startBot } = require('./bot/setup');
const fs = require('fs');
const path = require('path');

const bot = createBot();

// Serve static files
function serveStaticFile(filePath, contentType) {
  try {
    const fullPath = path.join(__dirname, 'public', filePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    return { content, contentType };
  } catch (error) {
    return null;
  }
}

module.exports = async (req, res) => {
  try {
    // Handle bot webhook
    if (req.method === 'POST') {
      await bot.handleUpdate(req.body);
      res.status(200).json({ ok: true });
      return;
    }

    // Handle GET requests - serve website
    if (req.method === 'GET') {
      const url = req.url || '/';
      
      // Serve CSS file
      if (url === '/styles.css') {
        const cssFile = serveStaticFile('styles.css', 'text/css');
        if (cssFile) {
          res.setHeader('Content-Type', cssFile.contentType);
          res.status(200).send(cssFile.content);
          return;
        }
      }
      
      // Serve main HTML page
      if (url === '/' || url === '/index.html') {
        const htmlFile = serveStaticFile('index.html', 'text/html');
        if (htmlFile) {
          res.setHeader('Content-Type', htmlFile.contentType);
          res.status(200).send(htmlFile.content);
          return;
        }
      }
      
      // Handle other static files
      if (url.startsWith('/public/')) {
        const filePath = url.replace('/public/', '');
        const file = serveStaticFile(filePath, 'text/plain');
        if (file) {
          res.setHeader('Content-Type', file.contentType);
          res.status(200).send(file.content);
          return;
        }
      }
      
      // Default response for root
      const htmlFile = serveStaticFile('index.html', 'text/html');
      if (htmlFile) {
        res.setHeader('Content-Type', htmlFile.contentType);
        res.status(200).send(htmlFile.content);
        return;
      }
    }

    // Fallback response
    res.status(200).json({ 
      message: 'Salah Times Bot is running!',
      website: 'Visit the root URL to see our beautiful website!'
    });
    
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

if (!config.isProduction) {
  startBot(bot);
}