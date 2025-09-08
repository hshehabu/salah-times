const { Telegraf, session, Markup } = require('telegraf');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Fallback to session storage if Supabase is not available
bot.use(session({
  defaultSession: () => ({
    savedCity: null,
    waitingForCity: false,
    language: 'en' // 'en' for English, 'am' for Amharic
  })
}));

const API_BASE_URL = 'http://api.aladhan.com/v1';

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
    setCity: '📍 *ከተማ አዘጋጅ*\n\nለማስቀመጥ የከተማዎን ስም ይላኩልኝ።\n\n*ምሳሌዎች:* Addis Ababa, New York, Cairo, Istanbul, Mecca',
    sendCityName: 'የከተማ ስም ይላኩ ወይም "ጊዜዎች" ይተይቡ ለ',
    sendJustCityName: 'የከተማ ስም ብቻ ይላኩ። ምሳሌ: "Addis Ababa" ወይም "ጊዜዎች" ለ',
    sendCityForTimes: 'ለሶላት ጊዜዎች የከተማ ስም ይላኩ። ለመረጃ /help ይጠቀሙ።',
    sendJustCity: 'የከተማ ስም ብቻ ይላኩ። ምሳሌ: "Addis Ababa"።',
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

// Convert time to 12-hour AM/PM format (handles both 24-hour strings and ISO timestamps)
function convertTo12Hour(timeInput) {
  if (!timeInput || typeof timeInput !== 'string') return timeInput;
  
  try {
    // If it's an ISO timestamp (contains 'T' or 'Z'), parse it as a date
    if (timeInput.includes('T') || timeInput.includes('Z')) {
      const date = new Date(timeInput);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        });
      }
    }
    
    // Fallback: handle 24-hour format strings (HH:MM)
    const [hours, minutes] = timeInput.split(':');
    const hour = parseInt(hours, 10);
    const minute = minutes || '00';
    
    if (hour === 0) {
      return `12:${minute} AM`;
    } else if (hour < 12) {
      return `${hour}:${minute} AM`;
    } else if (hour === 12) {
      return `12:${minute} PM`;
    } else {
      return `${hour - 12}:${minute} PM`;
    }
  } catch (error) {
    console.log('Time conversion error:', error);
    return timeInput; // Return original if conversion fails
  }
}

// Database helper functions
async function getUserData(userId) {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      console.log('Supabase not configured, using session fallback');
      return null;
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error getting user data from Supabase:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error getting user data from Supabase:', error);
    return null;
  }
}

async function saveUserData(userId, data) {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      console.log('Supabase not configured, using session fallback');
      return false;
    }
    
    const { error } = await supabase
      .from('users')
      .upsert({
        user_id: userId,
        saved_city: data.saved_city,
        language: data.language,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });
    
    if (error) {
      console.error('Error saving user data to Supabase:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error saving user data to Supabase:', error);
    return false;
  }
}

async function getUserCity(userId) {
  const userData = await getUserData(userId);
  return userData ? userData.saved_city : null;
}

async function saveUserCity(userId, city) {
  const userData = await getUserData(userId) || { saved_city: null, language: 'en' };
  userData.saved_city = city;
  return await saveUserData(userId, userData);
}

async function getUserLanguage(userId) {
  const userData = await getUserData(userId);
  return userData ? userData.language : 'en';
}

async function saveUserLanguage(userId, language) {
  const userData = await getUserData(userId) || { saved_city: null, language: 'en' };
  userData.language = language;
  return await saveUserData(userId, userData);
}

async function fetchPrayerTimes(city) {
  try {
    // Use timingsByAddress endpoint with iso8601 parameter for better time formatting
    const url = `${API_BASE_URL}/timingsByAddress?address=${encodeURIComponent(city)}&method=3&iso8601=true`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Add original city for fallback location display
    data.originalCity = city;
    
    return data;
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    throw error;
  }
}

function formatPrayerTimes(data, language = 'en') {
  // Handle AlAdhan.com API response format
  if (!data || !data.data || !data.data.timings) {
    return `❌ ${t('unableToFind', language)}`;
  }

  const timings = data.data.timings;
  
  // Extract location information
  let location = data.originalCity || 'Your Location';
  
  // Try to get location from meta data if available
  if (data.data.meta && data.data.meta.timezone) {
    // Use timezone as location hint if available
    const timezone = data.data.meta.timezone;
    if (timezone.includes('/')) {
      const parts = timezone.split('/');
      if (parts.length > 1) {
        location = parts[1].replace(/_/g, ' ');
      }
    }
  }
  
  // Format location name
  if (location && location !== 'Your Location') {
    location = location.replace(/\s+/g, ' ').trim();
    location = location.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  }
  
  const date = 'Today';

  return `🕌 *${t('prayerTimesFor', language)} ${location}*\n\n📅 ${date}\n\n` +
         `🌅 *${t('fajr', language)}:* ${convertTo12Hour(timings.Fajr)}\n\n` +
         `☀️ *${t('dhuhr', language)}:* ${convertTo12Hour(timings.Dhuhr)}\n\n` +
         `🌤️ *${t('asr', language)}:* ${convertTo12Hour(timings.Asr)}\n\n` +
         `🌅 *${t('maghrib', language)}:* ${convertTo12Hour(timings.Maghrib)}\n\n` +
         `🌙 *${t('isha', language)}:* ${convertTo12Hour(timings.Isha)}`;
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

bot.start(async (ctx) => {
  const userId = ctx.from.id;
  
  // Try to get data from database first, fallback to session
  let savedCity = await getUserCity(userId);
  let language = await getUserLanguage(userId);
  
  // Fallback to session if database is not available
  if (savedCity === null) {
    savedCity = ctx.session.savedCity;
  }
  if (language === 'en' && !ctx.session.language) {
    language = ctx.session.language || 'en';
  }
  
  const welcomeMessage = `${t('welcome', language)} ${savedCity ? `${t('yourSavedCity', language)}: *${savedCity}*` : t('noCitySaved', language)}`;

  const keyboard = savedCity 
    ? Markup.keyboard([
        [`${t('btnGetTimes', language)} ${savedCity}`],
        [t('btnMyCity', language), t('btnChangeCity', language)],
        [t('btnHelp', language), t('btnLanguage', language)]
      ]).resize()
    : Markup.keyboard([
        [t('btnSetCity', language)],
        [t('btnHelp', language), t('btnLanguage', language)]
      ]).resize();
  
  ctx.replyWithMarkdown(welcomeMessage, keyboard);
});

bot.help(async (ctx) => {
  const userId = ctx.from.id;
  
  // Try to get data from database first, fallback to session
  let savedCity = await getUserCity(userId);
  let language = await getUserLanguage(userId);
  
  // Fallback to session if database is not available
  if (savedCity === null) {
    savedCity = ctx.session.savedCity;
  }
  if (language === 'en' && !ctx.session.language) {
    language = ctx.session.language || 'en';
  }
  
  const cityStatus = savedCity ? `${t('yourSavedCity', language)}: *${savedCity}*` : t('noCitySaved', language);
  const helpMessage = `${t('help', language)} ${cityStatus}`;
  
  ctx.replyWithMarkdown(helpMessage);
});


bot.on('text', async (ctx) => {
  const text = ctx.message.text.trim();
  const userId = ctx.from.id;
  
  if (text.startsWith('/')) {
    return;
  }
  
  // Try to get data from database first, fallback to session
  let savedCity = await getUserCity(userId);
  let language = await getUserLanguage(userId);
  let waitingForCity = ctx.session.waitingForCity;
  
  // Fallback to session if database is not available
  if (savedCity === null) {
    savedCity = ctx.session.savedCity;
  }
  if (language === 'en' && !ctx.session.language) {
    language = ctx.session.language || 'en';
  }
  
  // Handle language switching
  if (text === '🌐 Language' || text === '🌐 ቋንቋ') {
    const newLang = language === 'en' ? 'am' : 'en';
    
    // Save to database
    await saveUserLanguage(userId, newLang);
    
    // Also update session as fallback
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
      return ctx.reply(t('sendValidCity', language));
    }
    
    try {
      await ctx.sendChatAction('typing');
      
      const prayerData = await fetchPrayerTimes(text);
      
      if (!prayerData || !prayerData.data || !prayerData.data.timings) {
        ctx.session.waitingForCity = false;
        return ctx.reply(t('unableToFind', language));
      }
      
      // Save to database
      await saveUserCity(userId, text);
      
      // Also update session as fallback
      ctx.session.savedCity = text;
      ctx.session.waitingForCity = false;
      
      const confirmMessage = `✅ *${t('citySaved', language)}*\n\n${t('yourDefaultCity', language)}: *${text}*`;
      
      const keyboard = Markup.keyboard([
        [`${t('btnGetTimes', language)} ${text}`],
        [t('btnMyCity', language), t('btnChangeCity', language)],
        [t('btnHelp', language), t('btnLanguage', language)]
      ]).resize();
      
      await ctx.replyWithMarkdown(confirmMessage, keyboard);
      
      const formattedMessage = formatPrayerTimes(prayerData, language);
      await ctx.replyWithMarkdown(`${t('currentPrayerTimes', language)}:\n\n${formattedMessage}`);
      
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
      const formattedMessage = formatPrayerTimes(prayerData, language);
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
      const message = `🏙️ *${t('noCitySpecified', language)}*\n\n${t('useBelowToSave', language)}`;
      
      const keyboard = Markup.keyboard([
        [t('btnSetCity', language)],
        [t('btnHelp', language), t('btnLanguage', language)]
      ]).resize();
      
      return ctx.replyWithMarkdown(message, keyboard);
    }
    
    const message = `🏙️ *${t('yourSavedCity', language)}*\n\n${t('currentCity', language)}: *${savedCity}*\n\n${t('tapGetTimes', language)}\n${t('tapChangeCity', language)}`;
    
    const keyboard = Markup.keyboard([
      [`${t('btnGetTimes', language)} ${savedCity}`],
      [t('btnChangeCity', language)],
      [t('btnHelp', language), t('btnLanguage', language)]
    ]).resize();
    
    return ctx.replyWithMarkdown(message, keyboard);
  }
  
  // Handle Set/Change City buttons (both languages)
  if (text === '📍 Set My City' || text === '📍 Change City' || 
      text === '📍 ከተማዬን አዘጋጅ' || text === '📍 ከተማ ቀይር') {
    ctx.session.waitingForCity = true;
    
    const message = t('setCity', language);
    
    return ctx.replyWithMarkdown(message);
  }
  
  // Handle Help button (both languages)
  if (text === '❓ Help' || text === '❓ እገዛ') {
    const cityStatus = savedCity ? `${t('yourSavedCity', language)}: *${savedCity}*` : t('noCitySaved', language);
    
    const helpMessage = `${t('help', language)} ${cityStatus}`;
    
    return ctx.replyWithMarkdown(helpMessage);
  }
  
  // Handle quick phrases (both languages)
  const quickPhrases = ['times', 'prayer times', 'salah', 'namaz', 'now', 'today', 
                       'ጊዜዎች', 'የሶላት ጊዜዎች', 'ሶላት', 'አሁን', 'ዛሬ'];
  if (quickPhrases.includes(text.toLowerCase()) && savedCity) {
    try {
      await ctx.sendChatAction('typing');
      const prayerData = await fetchPrayerTimes(savedCity);
      const formattedMessage = formatPrayerTimes(prayerData, language);
      await ctx.replyWithMarkdown(formattedMessage);
      return;
    } catch (error) {
      await handleError(ctx, error);
      return;
    }
  }
  
  if (text.length < 2) {
    const helpText = savedCity 
      ? `${t('sendCityName', language)} ${savedCity}.`
      : t('sendCityForTimes', language);
    return ctx.reply(helpText);
  }
  
  if (text.includes(' ') && text.split(' ').length > 3) {
    const helpText = savedCity
      ? `${t('sendJustCityName', language)} ${savedCity}.`
      : t('sendJustCity', language);
    return ctx.reply(helpText);
  }
  
  try {
    await ctx.sendChatAction('typing');
    
    const prayerData = await fetchPrayerTimes(text);
    
    if (!prayerData || !prayerData.data || !prayerData.data.timings) {
      return ctx.reply(t('unableToFind', language));
    }
    
    const formattedMessage = formatPrayerTimes(prayerData, language);
    
    await ctx.replyWithMarkdown(formattedMessage);
  } catch (error) {
    await ctx.reply(t('unableToFind', language));
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
