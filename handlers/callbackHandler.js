const { getUserLanguage } = require('../database/supabase');
const { handleLanguageChange } = require('./commandHandlers');
const { isValidLanguage } = require('../utils/languageUtils');

async function handleCallbackQuery(ctx) {
  const callbackData = ctx.callbackQuery.data;
  const userId = ctx.from.id;
  
  // Get current language
  let language = await getUserLanguage(userId);
  if (!language) {
    language = ctx.session.language || 'en';
  }
  
  // Handle language selection callback
  if (callbackData.startsWith('lang_')) {
    const newLanguageCode = callbackData.replace('lang_', '');
    
    if (isValidLanguage(newLanguageCode)) {
      // Answer the callback query
      await ctx.answerCbQuery();
      
      // Change language
      await handleLanguageChange(ctx, newLanguageCode, language);
    } else {
      await ctx.answerCbQuery('❌ Invalid language selection', { show_alert: true });
    }
  } else {
    // Unknown callback
    await ctx.answerCbQuery('❌ Unknown action', { show_alert: true });
  }
}

module.exports = {
  handleCallbackQuery,
};
