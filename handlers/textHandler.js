const { getUserCity, getUserLanguage } = require('../database/supabase');
const { t } = require('../translations');
const {
  handleLanguageSwitch,
  handleCityInput,
  handleGetTimes,
  handleMyCity,
  handleSetCity,
  handleQuickPhrases,
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
  
  if (savedCity === null) {
    savedCity = ctx.session.savedCity;
  }
  if (language === 'en' && !ctx.session.language) {
    language = ctx.session.language || 'en';
  }
  
  // Handle language switching
  if (text === '🌐 Language' || text === '🌐 ቋንቋ' || text === '🌐 اللغة') {
    return await handleLanguageSwitch(ctx, language);
  }
  
  if (waitingForCity) {
    return await handleCityInput(ctx, text, language);
  }
  
  // Handle Get Times button (supports all languages)
  if (text.startsWith('🕌 Get Times for ') || text.startsWith('🕌 ጊዜዎች አግኝ ለ ') || text.startsWith('🕌 احصل على الأوقات لـ ')) {
    const city = text.replace('🕌 Get Times for ', '').replace('🕌 ጊዜዎች አግኝ ለ ', '').replace('🕌 احصل على الأوقات لـ ', '');
    return await handleGetTimes(ctx, city, language);
  }
  
  // Handle My City button (all languages)
  if (text === '🏙️ My City' || text === '🏙️ የኔ ከተማ' || text === '🏙️ مدينتي') {
    return await handleMyCity(ctx, savedCity, language);
  }
  
  // Handle Set/Change City buttons (all languages)
  if (text === '📍 Set My City' || text === '📍 Change City' || 
      text === '📍 ከተማዬን አዘጋጅ' || text === '📍 ከተማ ቀይር' ||
      text === '📍 حدد مدينتي' || text === '📍 تغيير المدينة') {
    return await handleSetCity(ctx, language);
  }
  
  // Handle Help button (all languages)
  if (text === '❓ Help' || text === '❓ እገዛ' || text === '❓ مساعدة') {
    const cityStatus = savedCity ? `${t('yourSavedCity', language)}: *${savedCity}*` : t('noCitySaved', language);
    const helpMessage = `${t('help', language)} ${cityStatus}`;
    return ctx.replyWithMarkdown(helpMessage);
  }
  
  // Handle quick phrases (all languages)
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
  
  // Handle direct city name input
  return await handleGetTimes(ctx, text, language);
}

module.exports = {
  handleTextMessage,
};
