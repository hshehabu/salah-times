const { getUserCity, getUserLanguage } = require('../database/supabase');
const { t } = require('../translations');
const {
  handleStart,
  handleLanguageSelection,
  handleCityInput,
  handleGetTimes,
  handleMyCity,
  handleSetCity,
  handleQuickPhrases,
  handlePrayerTimesMenu,
  handleOtherToolsMenu,
  handleToolsMenu,
  handleToHijri,
  handleAgeCalculator,
  handleBirthDateInput,
  handleIslamicMonths,
} = require('./commandHandlers');

async function handleTextMessage(ctx) {
  const text = ctx.message.text.trim();
  const userId = ctx.from.id;
  
  if (text.startsWith('/')) {
    return;
  }
  
  let savedCity = await getUserCity(userId);
  let language = await getUserLanguage(userId);
  let waitingForCity = ctx.session.waitingForCity;
  let waitingForBirthDate = ctx.session.waitingForBirthDate;
  
  if (savedCity === null) {
    savedCity = ctx.session.savedCity;
  }
  if (language === 'en' && !ctx.session.language) {
    language = ctx.session.language || 'en';
  }
  
  if (text === '🌐 Language' || text === '🌐 ቋንቋ' || text === '🌐 اللغة') {
    return await handleLanguageSelection(ctx, language);
  }
  
  if (waitingForCity) {
    return await handleCityInput(ctx, text, language);
  }
  
  if (waitingForBirthDate) {
    return await handleBirthDateInput(ctx, text, language);
  }
  
  if (text.startsWith('🕌 Get Times for ') || text.startsWith('🕌 ጊዜዎች አግኝ ለ ') || text.startsWith('🕌 احصل على الأوقات لـ ')) {
    const city = text.replace('🕌 Get Times for ', '').replace('🕌 ጊዜዎች አግኝ ለ ', '').replace('🕌 احصل على الأوقات لـ ', '');
    return await handleGetTimes(ctx, city, language);
  }
  
  if (text === '🏙️ My City' || text === '🏙️ የኔ ከተማ' || text === '🏙️ مدينتي') {
    return await handleMyCity(ctx, savedCity, language);
  }
  
  if (text === '📍 Set My City' || text === '📍 Change City' || 
      text === '📍 ከተማዬን አዘጋጅ' || text === '📍 ከተማ ቀይር' ||
      text === '📍 حدد مدينتي' || text === '📍 تغيير المدينة') {
    return await handleSetCity(ctx, language);
  }
  
  if (text === '❓ Help' || text === '❓ እገዛ' || text === '❓ مساعدة') {
    const cityStatus = savedCity ? `${t('yourSavedCity', language)}: *${savedCity}*` : t('noCitySaved', language);
    const helpMessage = `${t('help', language)} ${cityStatus}`;
    return ctx.replyWithMarkdown(helpMessage);
  }
  
  if (text === '🕌 Prayer Times' || text === '🕌 የሶላት ጊዜዎች' || text === '🕌 أوقات الصلاة') {
    return await handlePrayerTimesMenu(ctx, language);
  }
  
  if (text === '🔧 Other Tools' || text === '🔧 ሌሎች መሳሪያዎች' || text === '🔧 أدوات أخرى') {
    return await handleOtherToolsMenu(ctx, language);
  }
  
  if (text === '🔧 Tools' || text === '🔧 መሳሪያዎች' || text === '🔧 أدوات') {
    return await handleToolsMenu(ctx, language);
  }
  
  if (text === '🔁 To Hijri' || text === '🔁 ወደ ሂጅሪ' || text === '🔁 إلى الهجري') {
    return await handleToHijri(ctx, language);
  }
  
  if (text === '⏳ Age Calculator' || text === '⏳ ዕድሜ ካልኩሌተር' || text === '⏳ حاسبة العمر') {
    return await handleAgeCalculator(ctx, language);
  }
  
  if (text === '📅 Islamic Months' || text === '📅 የኢስላም ወራት' || text === '📅 الأشهر الهجرية') {
    return await handleIslamicMonths(ctx, language);
  }
  
  if (text === '⬅️ Back to Main' || text === '⬅️ ወደ ዋናው ተመለስ' || text === '⬅️ العودة للرئيسية') {
    return await handleStart(ctx);
  }
  
  if (text === '⬅️ Back to Tools' || text === '⬅️ ወደ መሳሪያዎች ተመለስ' || text === '⬅️ العودة للأدوات') {
    return await handleOtherToolsMenu(ctx, language);
  }
  
  const quickPhrases = ['times', 'prayer times', 'salah', 'namaz', 'now', 'today', 
                       'ጊዜዎች', 'የሶላት ጊዜዎች', 'ሶላት', 'አሁን', 'ዛሬ',
                       'أوقات', 'أوقات الصلاة', 'صلاة', 'الآن', 'اليوم'];
  if (quickPhrases.includes(text.toLowerCase())) {
    return await handleQuickPhrases(ctx, savedCity, language);
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
  
  return await handleGetTimes(ctx, text, language);
}

module.exports = {
  handleTextMessage,
};
