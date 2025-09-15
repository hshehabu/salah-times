const { Markup } = require('telegraf');
const { t } = require('../translations');
const { getUserCity, getUserLanguage, saveUserCity, saveUserLanguage, getUserReminder, saveUserReminder } = require('../database/supabase');
const { fetchPrayerTimes, formatPrayerTimes, handleError } = require('../services/prayerTimesService');
const { createLanguageKeyboard, getLanguageInfo } = require('../utils/languageUtils');
const { convertGregorianToHijri, formatDateConversion } = require('../services/hijriConversionService');
const { calculateAge, formatAgeCalculation } = require('../services/ageCalculatorService');
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

  const keyboard = Markup.keyboard([
    [t('btnPrayerTimes', language), t('btnOtherTools', language)],
    [t('btnHelp', language), t('btnLanguage', language)],
    [t('btnFeedback', language)]
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
  
  const keyboard = Markup.keyboard([
    [t('btnPrayerTimes', newLanguageCode), t('btnOtherTools', newLanguageCode)],
    [t('btnHelp', newLanguageCode), t('btnLanguage', newLanguageCode)],
    [t('btnFeedback', newLanguageCode)]
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
      [t('btnPrayerTimes', language), t('btnOtherTools', language)],
      [t('btnHelp', language), t('btnLanguage', language)],
      [t('btnFeedback', language)]
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
      [t('btnBackToMain', language)]
    ]).resize();
    
    return ctx.replyWithMarkdown(message, keyboard);
  }
  
  const message = `🏙️ *${t('yourSavedCity', language)}*\n\n${t('currentCity', language)}: *${savedCity}*\n\n${t('tapGetTimes', language)}\n${t('tapChangeCity', language)}`;
  
  const keyboard = Markup.keyboard([
    [`${t('btnGetTimes', language)} ${savedCity}`],
    [t('btnChangeCity', language)],
    [t('btnBackToMain', language)]
  ]).resize();
  
  return ctx.replyWithMarkdown(message, keyboard);
}

async function handleSetCity(ctx, language) {
  ctx.session.waitingForCity = true;
  const message = t('setCity', language);
  
  const keyboard = Markup.keyboard([
    [t('btnBackToMain', language)]
  ]).resize();
  
  return ctx.replyWithMarkdown(message, keyboard);
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

async function handlePrayerTimesMenu(ctx, language) {
  const userId = ctx.from.id;
  const savedCity = await getUserCity(userId) || ctx.session.savedCity;
  
  const message = t('prayerTimesMenu', language);
  
  const keyboard = savedCity 
    ? Markup.keyboard([
        [`${t('btnGetTimes', language)} ${savedCity}`, [t('btnReminder', language)]],
        [t('btnMyCity', language), t('btnChangeCity', language)],
        [t('btnBackToMain', language)]
      ]).resize()
    : Markup.keyboard([
        [t('btnSetCity', language)],
        [t('btnBackToMain', language)]
      ]).resize();
  
  return ctx.replyWithMarkdown(message, keyboard);
}

async function handleOtherToolsMenu(ctx, language) {
  const message = t('otherToolsMenu', language);
  
  const keyboard = Markup.keyboard([
    [t('btnToHijri', language), t('btnAgeCalculator', language)],
    [t('btnIslamicMonths', language)],
    [t('btnBackToMain', language)]
  ]).resize();
  
  return ctx.replyWithMarkdown(message, keyboard);
}

async function handleToHijri(ctx, language) {
  if (!globalCalendar) {
    return ctx.reply('❌ Calendar service is not available. Please try again later.');
  }
  
  ctx.session.waitingForDate = true;
  
  return globalCalendar.startNavCalendar(ctx.message);
}

async function handleDateSelection(ctx, selectedDate, language) {
  try {
    await ctx.sendChatAction('typing');
    
    const conversionData = await convertGregorianToHijri(selectedDate);
    const formattedMessage = formatDateConversion(conversionData, language);
    
    ctx.session.waitingForDate = false;
    
    return ctx.replyWithMarkdown(formattedMessage);
  } catch (error) {
    ctx.session.waitingForDate = false;
    await handleError(ctx, error);
  }
}

async function handleAgeCalculator(ctx, language) {
  ctx.session.waitingForBirthDate = true;
  
  const message = t('ageCalculatorPrompt', language);
  
  const keyboard = Markup.keyboard([
    [t('btnBackToTools', language)]
  ]).resize();
  
  return ctx.replyWithMarkdown(message, keyboard);
}

async function handleBirthDateInput(ctx, birthDateString, language) {
  try {
    await ctx.sendChatAction('typing');
    
    const ageData = await calculateAge(birthDateString, language);
    const formattedMessage = formatAgeCalculation(ageData, language);
    
    ctx.session.waitingForBirthDate = false;
    
    const keyboard = Markup.keyboard([
      [t('btnAgeCalculator', language)],
      [t('btnBackToTools', language)]
    ]).resize();
    
    return ctx.replyWithMarkdown(formattedMessage, keyboard);
  } catch (error) {
    ctx.session.waitingForBirthDate = false;
    await handleError(ctx, error);
  }
}

async function handleIslamicMonths(ctx, language) {
  try {
    await ctx.sendChatAction('typing');
    
    const islamicMonthsData = require('../data/islamicMonths.json');
    const months = islamicMonthsData.data;
    
    let monthsList = '';
    for (let i = 1; i <= 12; i++) {
      const month = months[i.toString()];
      if (month) {
        monthsList += `${month.number}. ${month.en} (${month.ar})\n\n`;
      }
    }
    
    const message = `${t('islamicMonthsTitle', language)}${t('islamicMonthsList', language)}\n\n${monthsList}`;
    
    const keyboard = Markup.keyboard([
      [t('btnBackToTools', language)]
    ]).resize();
    
    return ctx.replyWithMarkdown(message, keyboard);
  } catch (error) {
    await handleError(ctx, error);
  }
}

async function handleFeedback(ctx, language) {
  ctx.session.waitingForFeedback = true;
  
  const message = t('feedbackPrompt', language);
  
  const keyboard = Markup.keyboard([
    [t('btnBackToMain', language)]
  ]).resize();
  
  return ctx.replyWithMarkdown(message, keyboard);
}

async function handleFeedbackInput(ctx, feedbackText, language) {
  try {
    const { FEEDBACK_RECIPIENT } = require('../config');
    
    if (!FEEDBACK_RECIPIENT) {
      console.error('FEEDBACK_RECIPIENT not configured');
      return ctx.reply(t('feedbackError', language));
    }
    
    const feedbackMessage = `📝 *Anonymous Feedback*\n\n` +
      `*Language:* ${language}\n` +
      `*Date:* ${new Date().toLocaleString()}\n\n` +
      `*Feedback:*\n${feedbackText}`;
    
    await ctx.telegram.sendMessage(FEEDBACK_RECIPIENT, feedbackMessage, { parse_mode: 'Markdown' });
    
    ctx.session.waitingForFeedback = false;
    
    const successMessage = t('feedbackSent', language);
    
    const keyboard = Markup.keyboard([
      [t('btnPrayerTimes', language), t('btnOtherTools', language)],
      [t('btnHelp', language), t('btnLanguage', language)],
      [t('btnFeedback', language)]
    ]).resize();
    
    return ctx.replyWithMarkdown(successMessage, keyboard);
    
  } catch (error) {
    ctx.session.waitingForFeedback = false;
    console.error('Error sending feedback:', error);
    
    const errorMessage = t('feedbackError', language);
    
    const keyboard = Markup.keyboard([
      [t('btnPrayerTimes', language), t('btnOtherTools', language)],
      [t('btnHelp', language), t('btnLanguage', language)],
      [t('btnFeedback', language)]
    ]).resize();
    
    return ctx.replyWithMarkdown(errorMessage, keyboard);
  }
}

async function handleReminder(ctx, language) {
  try {
    const userId = ctx.from.id;
    const savedCity = await getUserCity(userId) || ctx.session.savedCity;
    const reminderEnabled = await getUserReminder(userId);
    
    if (!savedCity) {
      const message = t('reminderNoCity', language);
      const keyboard = Markup.keyboard([
        [t('btnSetCity', language)],
        [t('btnBackToMain', language)]
      ]).resize();
      
      return ctx.replyWithMarkdown(message, keyboard);
    }
    
    const statusText = reminderEnabled ? t('reminderEnabled', language) : t('reminderDisabled', language);
    const message = `${t('reminderMenu', language)} ${statusText}`;
    
    const keyboard = Markup.keyboard([
      [reminderEnabled ? t('btnDisableReminder', language) : t('btnEnableReminder', language)],
      [t('btnBackToMain', language)]
    ]).resize();
    
    return ctx.replyWithMarkdown(message, keyboard);
    
  } catch (error) {
    console.error('Error handling reminder:', error);
    return ctx.reply(t('reminderError', language));
  }
}

async function handleToggleReminder(ctx, language) {
  try {
    const userId = ctx.from.id;
    const currentReminderStatus = await getUserReminder(userId);
    const newStatus = !currentReminderStatus;
    
    const success = await saveUserReminder(userId, newStatus);
    
    if (!success) {
      return ctx.reply(t('reminderError', language));
    }
    
    const message = newStatus ? t('reminderEnabled', language) : t('reminderDisabled', language);
    
    const keyboard = Markup.keyboard([
      [newStatus ? t('btnDisableReminder', language) : t('btnEnableReminder', language)],
      [t('btnBackToMain', language)]
    ]).resize();
    
    return ctx.replyWithMarkdown(message, keyboard);
    
  } catch (error) {
    console.error('Error toggling reminder:', error);
    return ctx.reply(t('reminderError', language));
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
  handlePrayerTimesMenu,
  handleOtherToolsMenu,
  handleToHijri,
  handleDateSelection,
  handleAgeCalculator,
  handleBirthDateInput,
  handleIslamicMonths,
  handleFeedback,
  handleFeedbackInput,
  handleReminder,
  handleToggleReminder,
  setGlobalCalendar,
  getGlobalCalendar,
};
