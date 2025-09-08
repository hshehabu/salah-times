const config = require('./config');
const { createBot, startBot } = require('./bot/setup');

const bot = createBot();

module.exports = async (req, res) => {
  try {
    if (req.method === 'POST') {
      await bot.handleUpdate(req.body);
      res.status(200).json({ ok: true });
    } else {
      res.status(200).json({ message: 'Salah Times Bot is running!' });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

if (!config.isProduction) {
  startBot(bot);
}