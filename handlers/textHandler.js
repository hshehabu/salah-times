const { getUserCity, getUserLanguage } = require('../database/supabase');
const { t } = require('../translations');
const {
  handleStart,
  handleLanguageSelection,
  handleCityInput,
  handleGetTimes,
  handleSetCity,
  handleQuickPhrases,
  handlePrayerTimesMenu,
  handleOtherToolsMenu,
  handleToHijri,
  handleAgeCalculator,
  handleBirthDateInput,
  handleIslamicMonths,
  handleRamadanCountdown,
  handleNearbyMasjids,
  handleLocationInput,
  handleFeedback,
  handleFeedbackInput,
  handleReminder,
  handleToggleReminder,
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
  let waitingForFeedback = ctx.session.waitingForFeedback;
  let waitingForLocation = ctx.session.waitingForLocation;
  
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
  
  if (waitingForFeedback) {
    return await handleFeedbackInput(ctx, text, language);
  }
  
  if (waitingForLocation) {
    // If user sends text instead of location, show error
    return ctx.reply(t('pleaseShareLocation', language) || 'Please share your location to find nearby masjids.');
  }
  
  if (text.startsWith('🕌 Get Times for ') || text.startsWith('🕌 ጊዜዎች አግኝ ለ ') || text.startsWith('🕌 احصل على الأوقات لـ ')) {
    const city = text.replace('🕌 Get Times for ', '').replace('🕌 ጊዜዎች አግኝ ለ ', '').replace('🕌 احصل على الأوقات لـ ', '');
    return await handleGetTimes(ctx, city, language);
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
  
  if (text === '🔁 To Hijri' || text === '🔁 ወደ ሂጅሪ' || text === '🔁 إلى الهجري') {
    return await handleToHijri(ctx, language);
  }
  
  if (text === '⏳ Age in Hijri' || text === '⏳ ዕድሜ በሂጅሪ' || text === '⏳ العمر بالهجري') {
    return await handleAgeCalculator(ctx, language);
  }
  
  if (text === '📅 Islamic Months' || text === '📅 የኢስላም ወራት' || text === '📅 الأشهر الهجرية') {
    return await handleIslamicMonths(ctx, language);
  }
  
  if (text === '🌙 Ramadan Countdown' || text === '🌙 ረመዳን ቆጠራ' || text === '🌙 العد التنازلي لرمضان') {
    return await handleRamadanCountdown(ctx, language);
  }
  
  if (text === '🕌 Nearby Masjids' || text === '🕌 ቅርብ መስጂዶች' || text === '🕌 المساجد القريبة') {
    return await handleNearbyMasjids(ctx, language);
  }
  
  if (text === '💬 Feedback' || text === '💬 አስተያየት' || text === '💬 تعليقات') {
    return await handleFeedback(ctx, language);
  }
  
  if (text === '⏰ Reminder' || text === '⏰ ማስታወሻ' || text === '⏰ تذكير') {
    return await handleReminder(ctx, language);
  }
  
  if (text === '✅ Enable Reminder' || text === '✅ ማስታወሻ አንቃ' || text === '✅ تفعيل التذكير' ||
      text === '❌ Disable Reminder' || text === '❌ ማስታወሻ አሰርዝ' || text === '❌ إلغاء التذكير') {
    return await handleToggleReminder(ctx, language);
  }
  
  if (text === '⬅️ Back to Main' || text === '⬅️ ወደ ዋናው ተመለስ' || text === '⬅️ العودة للرئيسية') {
    // Clear all waiting states
    ctx.session.waitingForCity = false;
    ctx.session.waitingForBirthDate = false;
    ctx.session.waitingForFeedback = false;
    ctx.session.currentMenu = null;
    return await handleStart(ctx);
  }
  
  if (text === '⬅️ Back to Prayer Times' || text === '⬅️ ወደ ሶላት ጊዜዎች ተመለስ' || text === '⬅️ العودة لأوقات الصلاة') {
    // Clear all waiting states
    ctx.session.waitingForCity = false;
    ctx.session.waitingForBirthDate = false;
    ctx.session.waitingForFeedback = false;
    ctx.session.currentMenu = null;
    return await handlePrayerTimesMenu(ctx, language);
  }
  
  if (text === '⬅️ Back to Tools' || text === '⬅️ ወደ መሳሪያዎች ተመለስ' || text === '⬅️ العودة للأدوات') {
    // Clear all waiting states
    ctx.session.waitingForCity = false;
    ctx.session.waitingForBirthDate = false;
    ctx.session.waitingForFeedback = false;
    ctx.session.currentMenu = null;
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

async function handleLocationMessage(ctx) {
  const userId = ctx.from.id;
  let language = await getUserLanguage(userId);
  
  if (language === 'en' && !ctx.session.language) {
    language = ctx.session.language || 'en';
  }
  
  // Check if user is waiting for location
  if (ctx.session.waitingForLocation) {
    const location = ctx.message.location;
    return await handleLocationInput(ctx, location, language);
  }
  
  // If not waiting for location, show general message
  return ctx.reply(t('locationReceived', language) || 'Location received. Use the Nearby Masjids feature to find masjids near you.');
}

module.exports = {
  handleTextMessage,
  handleLocationMessage,
};
