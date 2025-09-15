const { Markup } = require('telegraf');
const { t } = require('../translations');
const { getUserCity, getUserLanguage, saveUserCity, saveUserLanguage } = require('../database/supabase');
const { fetchPrayerTimes, formatPrayerTimes, handleError } = require('../services/prayerTimesService');
const { createLanguageKeyboard, getLanguageInfo } = require('../utils/languageUtils');
const { convertGregorianToHijri, formatDateConversion } = require('../services/hijriConversionService');
const Calendar = require('telegram-inline-calendar');

// Global calendar instance - will be initialized in bot setup
let globalCalendar = null;

function setGlobalCalendar(calendar) {
  globalCalendar = calendar;
}

function getGlobalCalendar() {
  return globalCalendar;
}

async function handleStart(ctx) {
  const userId = ctx.from.id;
  
  let savedCity = await getUserCity(userId);
  let language = await getUserLanguage(userId);
  
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
        [t('btnHelp', language), t('btnLanguage', language), t('btnTools', language)]
      ]).resize()
    : Markup.keyboard([
        [t('btnSetCity', language)],
        [t('btnHelp', language), t('btnLanguage', language), t('btnTools', language)]
      ]).resize();
  
  ctx.replyWithMarkdown(welcomeMessage, keyboard);
}

async function handleHelp(ctx) {
  const userId = ctx.from.id;
  
  let savedCity = await getUserCity(userId);
  let language = await getUserLanguage(userId);
  
  if (savedCity === null) {
    savedCity = ctx.session.savedCity;
  }
  if (language === 'en' && !ctx.session.language) {
    language = ctx.session.language || 'en';
  }
  
  const cityStatus = savedCity ? `${t('yourSavedCity', language)}: *${savedCity}*` : t('noCitySaved', language);
  const helpMessage = `${t('help', language)} ${cityStatus}`;
  
  ctx.replyWithMarkdown(helpMessage);
}

async function handleLanguageSelection(ctx, language) {
  const currentLang = getLanguageInfo(language);
  const message = `🌐 *${t('btnLanguage', language)}*\n\n${t('selectLanguage', language) || 'Select your preferred language:'}\n\n${t('currentLanguage', language) || 'Current language'}: ${currentLang.flag} ${currentLang.nativeName}`;
  
  const keyboard = createLanguageKeyboard();
  
  return ctx.replyWithMarkdown(message, keyboard);
}

async function handleLanguageChange(ctx, newLanguageCode, currentLanguage) {
  const userId = ctx.from.id;
  const newLangInfo = getLanguageInfo(newLanguageCode);
  
  await saveUserLanguage(userId, newLanguageCode);
  ctx.session.language = newLanguageCode;
  
  const message = `✅ ${t('languageChanged', newLanguageCode) || 'Language changed to'}: ${newLangInfo.flag} ${newLangInfo.nativeName}`;
  
  const savedCity = await getUserCity(userId) || ctx.session.savedCity;
  
  const keyboard = savedCity 
    ? Markup.keyboard([
        [`${t('btnGetTimes', newLanguageCode)} ${savedCity}`],
        [t('btnMyCity', newLanguageCode), t('btnChangeCity', newLanguageCode)],
        [t('btnHelp', newLanguageCode), t('btnLanguage', newLanguageCode), t('btnTools', newLanguageCode)]
      ]).resize()
    : Markup.keyboard([
        [t('btnSetCity', newLanguageCode)],
        [t('btnHelp', newLanguageCode), t('btnLanguage', newLanguageCode), t('btnTools', newLanguageCode)]
      ]).resize();
  
  return ctx.replyWithMarkdown(message, keyboard);
}

async function handleCityInput(ctx, text, language) {
  const userId = ctx.from.id;
  
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
    
    await saveUserCity(userId, text);
    ctx.session.savedCity = text;
    ctx.session.waitingForCity = false;
    
    const confirmMessage = `✅ *${t('citySaved', language)}*\n\n${t('yourDefaultCity', language)}: *${text}*`;
    
    const keyboard = Markup.keyboard([
      [`${t('btnGetTimes', language)} ${text}`],
      [t('btnMyCity', language), t('btnChangeCity', language)],
      [t('btnHelp', language), t('btnLanguage', language), t('btnTools', language)]
    ]).resize();
    
    await ctx.replyWithMarkdown(confirmMessage, keyboard);
    
    const formattedMessage = formatPrayerTimes(prayerData, language);
    await ctx.replyWithMarkdown(`${t('currentPrayerTimes', language)}:\n\n${formattedMessage}`);
    
  } catch (error) {
    ctx.session.waitingForCity = false;
    await handleError(ctx, error);
  }
}

async function handleGetTimes(ctx, city, language) {
  try {
    await ctx.sendChatAction('typing');
    const prayerData = await fetchPrayerTimes(city);
    const formattedMessage = formatPrayerTimes(prayerData, language);
    await ctx.replyWithMarkdown(formattedMessage);
  } catch (error) {
    await handleError(ctx, error);
  }
}

async function handleMyCity(ctx, savedCity, language) {
  if (!savedCity) {
    const message = `🏙️ *${t('noCitySpecified', language)}*\n\n${t('useBelowToSave', language)}`;
    
    const keyboard = Markup.keyboard([
      [t('btnSetCity', language)],
      [t('btnHelp', language), t('btnLanguage', language), t('btnTools', language)]
    ]).resize();
    
    return ctx.replyWithMarkdown(message, keyboard);
  }
  
  const message = `🏙️ *${t('yourSavedCity', language)}*\n\n${t('currentCity', language)}: *${savedCity}*\n\n${t('tapGetTimes', language)}\n${t('tapChangeCity', language)}`;
  
  const keyboard = Markup.keyboard([
    [`${t('btnGetTimes', language)} ${savedCity}`],
    [t('btnChangeCity', language)],
    [t('btnHelp', language), t('btnLanguage', language), t('btnTools', language)]
  ]).resize();
  
  return ctx.replyWithMarkdown(message, keyboard);
}

async function handleSetCity(ctx, language) {
  ctx.session.waitingForCity = true;
  const message = t('setCity', language);
  return ctx.replyWithMarkdown(message);
}

async function handleQuickPhrases(ctx, savedCity, language) {
  if (!savedCity) return;
  
  try {
    await ctx.sendChatAction('typing');
    const prayerData = await fetchPrayerTimes(savedCity);
    const formattedMessage = formatPrayerTimes(prayerData, language);
    await ctx.replyWithMarkdown(formattedMessage);
  } catch (error) {
    await handleError(ctx, error);
  }
}

async function handleToolsMenu(ctx, language) {
  const message = t('toolsMenu', language);
  
  const keyboard = Markup.keyboard([
    [t('btnToHijri', language)],
    [t('btnBackToMain', language)]
  ]).resize();
  
  return ctx.replyWithMarkdown(message, keyboard);
}

async function handleToHijri(ctx, language) {
  if (!globalCalendar) {
    return ctx.reply('❌ Calendar service is not available. Please try again later.');
  }
  
  // Set session state for date selection
  ctx.session.waitingForDate = true;
  
  return globalCalendar.startNavCalendar(ctx.message);
}

async function handleDateSelection(ctx, selectedDate, language) {
  try {
    await ctx.sendChatAction('typing');
    
    const conversionData = await convertGregorianToHijri(selectedDate);
    const formattedMessage = formatDateConversion(conversionData, language);
    
    // Clear session state
    ctx.session.waitingForDate = false;
    
    return ctx.replyWithMarkdown(formattedMessage);
  } catch (error) {
    ctx.session.waitingForDate = false;
    await handleError(ctx, error);
  }
}

module.exports = {
  handleStart,
  handleHelp,
  handleLanguageSelection,
  handleLanguageChange,
  handleCityInput,
  handleGetTimes,
  handleMyCity,
  handleSetCity,
  handleQuickPhrases,
  handleToolsMenu,
  handleToHijri,
  handleDateSelection,
  setGlobalCalendar,
  getGlobalCalendar,
};
