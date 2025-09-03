const { Telegraf, session, Markup } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.use(session({
  defaultSession: () => ({
    savedCity: null,
    waitingForCity: false,
    language: 'en' // 'en' for English, 'am' for Amharic
  })
}));

const API_BASE_URL = 'https://muslimsalat.com';

// Translation object
const translations = {
  en: {
    welcome: '🕌 *Welcome*\n\nGet prayer times for any city.\n\n*Quick Start:*\n• Use buttons below\n• Or send city name directly\n• Save city for quick access\n\n*Status:*',
    noCitySaved: 'No city saved',
    citySaved: 'City saved!',
    yourDefaultCity: 'Your default city is now:',
    currentPrayerTimes: 'Current prayer times:',
    help: '🕌 *Help*\n\n*How to use:*\n• Use buttons below for easy access\n• Or send city name directly in chat\n• Save your city for quick access\n\n*Status:*',
    yourSavedCity: 'Your saved city:',
    noCitySpecified: 'No city saved',
    useBelowToSave: 'Use button below to save your city.',
    currentCity: 'Current city:',
    tapGetTimes: '• Tap "🕌 Get Times" for prayer times',
    tapChangeCity: '• Tap "📍 Change City" to update',
    setCity: '📍 *Set City*\n\nSend me your city name to save it.\n\n*Examples:* Addis Ababa, New York, Cairo, Istanbul, Mecca',
    sendCityName: 'Send city name or type "times" for',
    sendJustCityName: 'Send just city name. Example: "Addis Ababa" or "times" for',
    sendCityForTimes: 'Send city name to get prayer times. Use /help for info.',
    sendJustCity: 'Send just city name. Example: "Addis Ababa".',
    unableToFind: '❌ Unable to find prayer times for this city. Please check the spelling and try again.',
    sendValidCity: 'Please send a valid city name.',
    prayerTimesFor: 'Prayer Times for',
    
    fajr: 'Fajr',
    dhuhr: 'Dhuhr', 
    asr: 'Asr',
    maghrib: 'Maghrib',
    isha: 'Isha',
    
    btnGetTimes: '🕌 Get Times for',
    btnMyCity: '🏙️ My City',
    btnSetCity: '📍 Set My City',
    btnChangeCity: '📍 Change City',
    btnHelp: '❓ Help',
    btnLanguage: '🌐 Language'
  },
  am: {
    welcome: '🕌 *እንኳን ደህና መጣህ*\n\nለማንኛውም ከተማ የሶላት ጊዜዎችን ያግኙ።\n\n*ፈጣን መጀመሪያ:*\n• ከታች ያሉትን አዝራሮች ይጠቀሙ\n• ወይም የከተማ ስም በቀጥታ ይላኩ\n• ለፈጣን መዳረሻ ከተማን ያስቀምጡ\n\n*ሁኔታ:*',
    noCitySaved: 'ምንም ከተማ አልተቀመጠም',
    citySaved: 'ከተማ ተቀምጧል!',
    yourDefaultCity: 'የእርስዎ ነባሪ ከተማ አሁን:',
    currentPrayerTimes: 'የአሁን የሶላት ጊዜዎች:',
    help: '🕌 *እገዛ*\n\n*እንዴት መጠቀም:*\n• ለቀላል መዳረሻ ከታች ያሉትን አዝራሮች ይጠቀሙ\n• ወይም የከተማ ስም በቀጥታ ይላኩ\n• ለፈጣን መዳረሻ ከተማዎን ያስቀምጡ\n\n*ሁኔታ:*',
    yourSavedCity: 'የእርስዎ የተቀመጠ ከተማ:',
    noCitySpecified: 'ምንም ከተማ አልተቀመጠም',
    useBelowToSave: 'ከተማዎን ለማስቀመጥ ከታች ያለውን አዝራር ይጠቀሙ።',
    currentCity: 'የአሁኑ ከተማ:',
    tapGetTimes: '• ለሶላት ጊዜዎች "🕌 ጊዜዎችን አግኝ" ን መታ ያድርጉ',
    tapChangeCity: '• ለመቀየር "📍 ከተማ ቀይር" ን መታ ያድርጉ',
    setCity: '📍 *ከተማ አዘጋጅ*\n\nለማስቀመጥ የከተማዎን ስም ይላኩልኝ።\n\n*ምሳሌዎች:* አዲስ አበባ፣ ኒው ዮርክ፣ ካይሮ፣ ኢስታንቡል፣ መካ',
    sendCityName: 'የከተማ ስም ይላኩ ወይም "ጊዜዎች" ይተይቡ ለ',
    sendJustCityName: 'የከተማ ስም ብቻ ይላኩ። ምሳሌ: "አዲስ አበባ" ወይም "ጊዜዎች" ለ',
    sendCityForTimes: 'ለሶላት ጊዜዎች የከተማ ስም ይላኩ። ለመረጃ /help ይጠቀሙ።',
    sendJustCity: 'የከተማ ስም ብቻ ይላኩ። ምሳሌ: "አዲስ አበባ"።',
    unableToFind: '❌ ለዚህ ከተማ የሶላት ጊዜዎችን ማግኘት አልተቻለም። እባክዎ ፊደል አጻጻፍ ያረጋግጡ እና እንደገና ይሞክሩ።',
    sendValidCity: 'እባክዎ ትክክለኛ የከተማ ስም ይላኩ።',
    prayerTimesFor: 'የሶላት ጊዜዎች ለ',
    
    fajr: 'ፈጅር',
    dhuhr: 'ዙህር',
    asr: 'አስር',
    maghrib: 'መግሪብ',
    isha: 'ኢሻዕ',
    
    btnGetTimes: '🕌 ጊዜዎች አግኝ ለ',
    btnMyCity: '🏙️ የኔ ከተማ',
    btnSetCity: '📍 ከተማዬን አዘጋጅ',
    btnChangeCity: '📍 ከተማ ቀይር',
    btnHelp: '❓ እገዛ',
    btnLanguage: '🌐 ቋንቋ'
  }
};

function t(key, language = 'en') {
  return translations[language][key] || translations.en[key] || key;
}

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

function formatPrayerTimes(data, language = 'en') {
  if (!data || !data.items || !data.items[0]) {
    return `❌ ${t('unableToFind', language)}`;
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

  return `🕌 *${t('prayerTimesFor', language)} ${location}*\n\n📅 ${date}\n\n` +
         `🌅 *${t('fajr', language)}:* ${today.fajr}\n\n` +
         `☀️ *${t('dhuhr', language)}:* ${today.dhuhr}\n\n` +
         `🌤️ *${t('asr', language)}:* ${today.asr}\n\n` +
         `🌅 *${t('maghrib', language)}:* ${today.maghrib}\n\n` +
         `🌙 *${t('isha', language)}:* ${today.isha}`;
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
  const lang = ctx.session.language;
  
  const welcomeMessage = `${t('welcome', lang)} ${savedCity ? `${t('yourSavedCity', lang)}: *${savedCity}*` : t('noCitySaved', lang)}`;

  const keyboard = savedCity 
    ? Markup.keyboard([
        [`${t('btnGetTimes', lang)} ${savedCity}`],
        [t('btnMyCity', lang), t('btnChangeCity', lang)],
        [t('btnHelp', lang), t('btnLanguage', lang)]
      ]).resize()
    : Markup.keyboard([
        [t('btnSetCity', lang)],
        [t('btnHelp', lang), t('btnLanguage', lang)]
      ]).resize();
  
  ctx.replyWithMarkdown(welcomeMessage, keyboard);
});


bot.on('text', async (ctx) => {
  const text = ctx.message.text.trim();
  const savedCity = ctx.session.savedCity;
  const waitingForCity = ctx.session.waitingForCity;
  const lang = ctx.session.language;
  
  if (text.startsWith('/')) {
    return;
  }
  
  // Handle language switching
  if (text === '🌐 Language' || text === '🌐 ቋንቋ') {
    const newLang = lang === 'en' ? 'am' : 'en';
    ctx.session.language = newLang;
    
    const message = newLang === 'am' 
      ? '🌐 ቋንቋ ወደ አማርኛ ተቀይሯል!'
      : '🌐 Language changed to English!';
    
    // Update keyboard with new language
    const keyboard = savedCity 
      ? Markup.keyboard([
          [`${t('btnGetTimes', newLang)} ${savedCity}`],
          [t('btnMyCity', newLang), t('btnChangeCity', newLang)],
          [t('btnHelp', newLang), t('btnLanguage', newLang)]
        ]).resize()
      : Markup.keyboard([
          [t('btnSetCity', newLang)],
          [t('btnHelp', newLang), t('btnLanguage', newLang)]
        ]).resize();
    
    return ctx.replyWithMarkdown(message, keyboard);
  }
  
  if (waitingForCity) {
    if (text.length < 2) {
      return ctx.reply(t('sendValidCity', lang));
    }
    
    try {
      await ctx.sendChatAction('typing');
      
      const prayerData = await fetchPrayerTimes(text);
      
      if (!prayerData || !prayerData.items || !prayerData.items[0]) {
        ctx.session.waitingForCity = false;
        return ctx.reply(t('unableToFind', lang));
      }
      
      ctx.session.savedCity = text;
      ctx.session.waitingForCity = false;
      
      const confirmMessage = `✅ *${t('citySaved', lang)}*\n\n${t('yourDefaultCity', lang)}: *${text}*`;
      
      const keyboard = Markup.keyboard([
        [`${t('btnGetTimes', lang)} ${text}`],
        [t('btnMyCity', lang), t('btnChangeCity', lang)],
        [t('btnHelp', lang), t('btnLanguage', lang)]
      ]).resize();
      
      await ctx.replyWithMarkdown(confirmMessage, keyboard);
      
      const formattedMessage = formatPrayerTimes(prayerData, lang);
      await ctx.replyWithMarkdown(`${t('currentPrayerTimes', lang)}:\n\n${formattedMessage}`);
      
    } catch (error) {
      ctx.session.waitingForCity = false;
      await handleError(ctx, error);
    }
    return;
  }
  
  // Handle Get Times button (supports both languages)
  if (text.startsWith('🕌 Get Times for ') || text.startsWith('🕌 ጊዜዎች አግኝ ለ ')) {
    const city = text.replace('🕌 Get Times for ', '').replace('🕌 ጊዜዎች አግኝ ለ ', '');
    try {
      await ctx.sendChatAction('typing');
      const prayerData = await fetchPrayerTimes(city);
      const formattedMessage = formatPrayerTimes(prayerData, lang);
      await ctx.replyWithMarkdown(formattedMessage);
      return;
    } catch (error) {
      await handleError(ctx, error);
      return;
    }
  }
  
  // Handle My City button (both languages)
  if (text === '🏙️ My City' || text === '🏙️ የኔ ከተማ') {
    if (!savedCity) {
      const message = `🏙️ *${t('noCitySpecified', lang)}*\n\n${t('useBelowToSave', lang)}`;
      
      const keyboard = Markup.keyboard([
        [t('btnSetCity', lang)],
        [t('btnHelp', lang), t('btnLanguage', lang)]
      ]).resize();
      
      return ctx.replyWithMarkdown(message, keyboard);
    }
    
    const message = `🏙️ *${t('yourSavedCity', lang)}*\n\n${t('currentCity', lang)}: *${savedCity}*\n\n${t('tapGetTimes', lang)}\n${t('tapChangeCity', lang)}`;
    
    const keyboard = Markup.keyboard([
      [`${t('btnGetTimes', lang)} ${savedCity}`],
      [t('btnChangeCity', lang)],
      [t('btnHelp', lang), t('btnLanguage', lang)]
    ]).resize();
    
    return ctx.replyWithMarkdown(message, keyboard);
  }
  
  // Handle Set/Change City buttons (both languages)
  if (text === '📍 Set My City' || text === '📍 Change City' || 
      text === '📍 ከተማዬን አዘጋጅ' || text === '📍 ከተማ ቀይር') {
    ctx.session.waitingForCity = true;
    
    const message = t('setCity', lang);
    
    return ctx.replyWithMarkdown(message);
  }
  
  // Handle Help button (both languages)
  if (text === '❓ Help' || text === '❓ እገዛ') {
    const cityStatus = savedCity ? `${t('yourSavedCity', lang)}: *${savedCity}*` : t('noCitySaved', lang);
    
    const helpMessage = `${t('help', lang)} ${cityStatus}`;
    
    return ctx.replyWithMarkdown(helpMessage);
  }
  
  // Handle quick phrases (both languages)
  const quickPhrases = ['times', 'prayer times', 'salah', 'namaz', 'now', 'today', 
                       'ጊዜዎች', 'የሶላት ጊዜዎች', 'ሶላት', 'አሁን', 'ዛሬ'];
  if (quickPhrases.includes(text.toLowerCase()) && savedCity) {
    try {
      await ctx.sendChatAction('typing');
      const prayerData = await fetchPrayerTimes(savedCity);
      const formattedMessage = formatPrayerTimes(prayerData, lang);
      await ctx.replyWithMarkdown(formattedMessage);
      return;
    } catch (error) {
      await handleError(ctx, error);
      return;
    }
  }
  
  if (text.length < 2) {
    const helpText = savedCity 
      ? `${t('sendCityName', lang)} ${savedCity}.`
      : t('sendCityForTimes', lang);
    return ctx.reply(helpText);
  }
  
  if (text.includes(' ') && text.split(' ').length > 3) {
    const helpText = savedCity
      ? `${t('sendJustCityName', lang)} ${savedCity}.`
      : t('sendJustCity', lang);
    return ctx.reply(helpText);
  }
  
  try {
    await ctx.sendChatAction('typing');
    
    const prayerData = await fetchPrayerTimes(text);
    
    if (!prayerData || !prayerData.items || !prayerData.items[0]) {
      return ctx.reply(t('unableToFind', lang));
    }
    
    const formattedMessage = formatPrayerTimes(prayerData, lang);
    
    await ctx.replyWithMarkdown(formattedMessage);
  } catch (error) {
    await ctx.reply(t('unableToFind', lang));
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

if (process.env.NODE_ENV !== 'production') {
  startBot();
}
