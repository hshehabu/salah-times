const { Markup } = require('telegraf');
const { t } = require('../translations');
const { getUserCity, getUserLanguage, saveUserCity, saveUserLanguage } = require('../database/supabase');
const { fetchPrayerTimes, formatPrayerTimes, handleError } = require('../services/prayerTimesService');

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
        [t('btnHelp', language), t('btnLanguage', language)]
      ]).resize()
    : Markup.keyboard([
        [t('btnSetCity', language)],
        [t('btnHelp', language), t('btnLanguage', language)]
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

async function handleLanguageSwitch(ctx, language) {
  const userId = ctx.from.id;
  const newLang = language === 'en' ? 'am' : 'en';
  
  await saveUserLanguage(userId, newLang);
  ctx.session.language = newLang;
  
  const message = newLang === 'am' 
    ? '🌐 ቋንቋ ወደ አማርኛ ተቀይሯል!'
    : '🌐 Language changed to English!';
  
  const savedCity = await getUserCity(userId) || ctx.session.savedCity;
  
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
      [t('btnHelp', language), t('btnLanguage', language)]
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

module.exports = {
  handleStart,
  handleHelp,
  handleLanguageSwitch,
  handleCityInput,
  handleGetTimes,
  handleMyCity,
  handleSetCity,
  handleQuickPhrases,
};
