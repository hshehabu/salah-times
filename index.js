const { Telegraf, session, Markup } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.use(session({
  defaultSession: () => ({
    savedCity: null,
    waitingForCity: false
  })
}));

const API_BASE_URL = 'https://muslimsalat.com';

async function fetchPrayerTimes(city) {
  try {
    const url = `${API_BASE_URL}/${encodeURIComponent(city)}.json`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    data.originalCity = city;
    
    return data;
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    throw error;
  }
}

function formatPrayerTimes(data) {
  if (!data || !data.items || !data.items[0]) {
    return '❌ Unable to retrieve prayer times. Please check the city name and try again.';
  }

  const today = data.items[0];
  
  let location = data.title || data.city || data.location || data.address || 
                 today.city || today.location || today.address;
  
  if (!location && data.results && data.results.location) {
    location = data.results.location;
  }
  
  if (location && location !== 'Unknown Location') {
    location = location.replace(/\s+/g, ' ').trim();
    location = location.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  }
  
  if (!location) {
    location = data.originalCity ? 
      data.originalCity.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ') : 'Your Location';
  }
  
  const date = today.date_for || today.date || 'Today';

  return `🕌 *Prayer Times for ${location}*\n📅 ${date}\n\n` +
         `🌅 *Fajr:* ${today.fajr}\n\n` +
         `☀️ *Dhuhr:* ${today.dhuhr}\n\n` +
         `🌤️ *Asr:* ${today.asr}\n\n` +
         `🌅 *Maghrib:* ${today.maghrib}\n\n` +
         `🌙 *Isha:* ${today.isha}`;
}

async function handleError(ctx, error) {
  console.error('Bot error:', error);
  
  let errorMessage = '❌ Sorry, something went wrong. ';
  
  if (error.message.includes('404')) {
    errorMessage += 'City not found. Please check the spelling and try again.';
  } else if (error.message.includes('network') || error.message.includes('fetch')) {
    errorMessage += 'Network error. Please try again later.';
  } else {
    errorMessage += 'Please try again or contact support.';
  }
  
  await ctx.reply(errorMessage);
}

bot.start((ctx) => {
  const savedCity = ctx.session.savedCity;
  
  const welcomeMessage = `🕌 *Welcome*\n\n` +
    `Get prayer times for any city.\n\n` +
    `*Quick Start:*\n` +
    `• Use buttons below\n` +
    `• Or send city name directly\n` +
    `• Save city for quick access\n\n` +
    `*Status:* ${savedCity ? `City: *${savedCity}*` : 'No city saved'}`;

  const keyboard = savedCity 
    ? Markup.keyboard([
        [`🕌 Get Times for ${savedCity}`],
        ['🏙️ My City', '📍 Change City'],
        ['❓ Help']
      ]).resize()
    : Markup.keyboard([
        ['📍 Set My City'],
        ['❓ Help']
      ]).resize();
  
  ctx.replyWithMarkdown(welcomeMessage, keyboard);
});


bot.on('text', async (ctx) => {
  const text = ctx.message.text.trim();
  const savedCity = ctx.session.savedCity;
  const waitingForCity = ctx.session.waitingForCity;
  
  if (text.startsWith('/')) {
    return;
  }
  
  if (waitingForCity) {
    if (text.length < 2) {
      return ctx.reply('Please send a valid city name.');
    }
    
    try {
      await ctx.sendChatAction('typing');
      
      const prayerData = await fetchPrayerTimes(text);
      
      if (!prayerData || !prayerData.items || !prayerData.items[0]) {
        ctx.session.waitingForCity = false;
        return ctx.reply('❌ Unable to find prayer times for this city. Please check the spelling and try again.');
      }
      
      ctx.session.savedCity = text;
      ctx.session.waitingForCity = false;
      
      const confirmMessage = `✅ *City saved!*\n\n` +
        `Your default city is now: *${text}*`;
      
      const keyboard = Markup.keyboard([
        [`🕌 Get Times for ${text}`],
        ['🏙️ My City', '📍 Change City'],
        ['❓ Help']
      ]).resize();
      
      await ctx.replyWithMarkdown(confirmMessage, keyboard);
      
      const formattedMessage = formatPrayerTimes(prayerData);
      await ctx.replyWithMarkdown(`Current prayer times:\n\n${formattedMessage}`);
      
    } catch (error) {
      ctx.session.waitingForCity = false;
      await handleError(ctx, error);
    }
    return;
  }
  
  if (text.startsWith('🕌 Get Times for ')) {
    const city = text.replace('🕌 Get Times for ', '');
    try {
      await ctx.sendChatAction('typing');
      const prayerData = await fetchPrayerTimes(city);
      const formattedMessage = formatPrayerTimes(prayerData);
      await ctx.replyWithMarkdown(formattedMessage);
      return;
    } catch (error) {
      await handleError(ctx, error);
      return;
    }
  }
  
  if (text === '🏙️ My City') {
    if (!savedCity) {
      const message = `🏙️ *No city saved*\n\n` +
        `Use button below to save your city.`;
      
      const keyboard = Markup.keyboard([
        ['📍 Set My City'],
        ['❓ Help']
      ]).resize();
      
      return ctx.replyWithMarkdown(message, keyboard);
    }
    
    const message = `🏙️ *Your saved city*\n\n` +
      `Current city: *${savedCity}*\n\n` +
      `• Tap "🕌 Get Times" for prayer times\n` +
      `• Tap "📍 Change City" to update`;
    
    const keyboard = Markup.keyboard([
      [`🕌 Get Times for ${savedCity}`],
      ['📍 Change City'],
      ['❓ Help']
    ]).resize();
    
    return ctx.replyWithMarkdown(message, keyboard);
  }
  
  if (text === '📍 Set My City' || text === '📍 Change City') {
    ctx.session.waitingForCity = true;
    
    const message = `📍 *Set City*\n\n` +
      `Send me your city name to save it.\n\n` +
      `*Examples:* Addis Ababa, New York, Cairo, Istanbul, Mecca`;
    
    return ctx.replyWithMarkdown(message);
  }
  
  if (text === '❓ Help') {
    const cityStatus = savedCity ? `Your saved city: *${savedCity}*` : 'No city saved';
    
    const helpMessage = `🕌 *Help*\n\n` +
      `*How to use:*\n` +
      `• Use buttons below for easy access\n` +
      `• Or send city name directly in chat\n` +
      `• Save your city for quick access\n\n` +
      `*Status:* ${cityStatus}`;
    
    return ctx.replyWithMarkdown(helpMessage);
  }
  
  const quickPhrases = ['times', 'prayer times', 'salah', 'namaz', 'now', 'today'];
  if (quickPhrases.includes(text.toLowerCase()) && savedCity) {
    try {
      await ctx.sendChatAction('typing');
      const prayerData = await fetchPrayerTimes(savedCity);
      const formattedMessage = formatPrayerTimes(prayerData);
      await ctx.replyWithMarkdown(formattedMessage);
      return;
    } catch (error) {
      await handleError(ctx, error);
      return;
    }
  }
  
  if (text.length < 2) {
    const helpText = savedCity 
      ? `Send city name or type "times" for ${savedCity}.`
      : 'Send city name to get prayer times. Use /help for info.';
    return ctx.reply(helpText);
  }
  
  if (text.includes(' ') && text.split(' ').length > 3) {
    const helpText = savedCity
      ? `Send just city name. Example: "Addis Ababa" or "times" for ${savedCity}.`
      : 'Send just city name. Example: "Addis Ababa".';
    return ctx.reply(helpText);
  }
  
  try {
    await ctx.sendChatAction('typing');
    
    const prayerData = await fetchPrayerTimes(text);
    const formattedMessage = formatPrayerTimes(prayerData);
    
    await ctx.replyWithMarkdown(formattedMessage);
  } catch (error) {
    await handleError(ctx, error);
  }
});



bot.catch((err, ctx) => {
  console.error('Unhandled bot error:', err);
  ctx.reply('❌ An unexpected error occurred. Please try again later.');
});

async function setupBotCommands() {
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

async function startBot() {
  try {
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      console.error('❌ TELEGRAM_BOT_TOKEN is not provided in environment variables');
      console.log('Please create a .env file with your bot token:');
      console.log('TELEGRAM_BOT_TOKEN=your_bot_token_here');
      process.exit(1);
    }
    
    console.log('🚀 Starting Salah Times Bot...');
    
    await setupBotCommands();
    
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

startBot();
