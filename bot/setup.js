const { Telegraf, session } = require('telegraf');
const config = require('../config');
const { handleStart, handleHelp } = require('../handlers/commandHandlers');
const { handleTextMessage } = require('../handlers/textHandler');
const { handleCallbackQuery } = require('../handlers/callbackHandler');

function createBot() {
  const bot = new Telegraf(config.bot.token);
  
  // Use session middleware
  bot.use(session(config.session));
  
  // Command handlers
  bot.start(handleStart);
  bot.help(handleHelp);
  
  // Text message handler
  bot.on('text', handleTextMessage);
  
  // Callback query handler (for inline keyboards)
  bot.on('callback_query', handleCallbackQuery);
  
  // Error handler
  bot.catch((err, ctx) => {
    console.error('Unhandled bot error:', err);
    ctx.reply('❌ An unexpected error occurred. Please try again later.');
  });
  
  return bot;
}

async function setupBotCommands(bot) {
  const commands = [
    { command: 'start', description: '🚀 Start now' },
  ];

  try {
    await bot.telegram.setMyCommands(commands);
    console.log('✅ Bot commands menu set successfully!');
  } catch (error) {
    console.error('⚠️ Failed to set bot commands menu:', error);
  }
}

async function startBot(bot) {
  try {
    if (!config.bot.token) {
      console.error('❌ TELEGRAM_BOT_TOKEN is not provided in environment variables');
      console.log('Please create a .env file with your bot token:');
      console.log('TELEGRAM_BOT_TOKEN=your_bot_token_here');
      process.exit(1);
    }
    
    console.log('🚀 Starting Salah Times Bot...');
    
    await setupBotCommands(bot);
    await bot.launch();
    
    console.log('✅ Bot is running successfully!');
    console.log('📋 Command menu is available in Telegram');
    console.log('Press Ctrl+C to stop the bot');
    
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
    
  } catch (error) {
    console.error('❌ Failed to start bot:', error);
    process.exit(1);
  }
}

module.exports = {
  createBot,
  setupBotCommands,
  startBot,
};
