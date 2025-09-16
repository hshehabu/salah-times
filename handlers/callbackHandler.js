const { getUserLanguage } = require('../database/supabase');
const { handleLanguageChange, handleDateSelection, getGlobalCalendar, handlePrayerTimesMenu } = require('./commandHandlers');
const { isValidLanguage } = require('../utils/languageUtils');

async function handleCallbackQuery(ctx) {
  const callbackData = ctx.callbackQuery.data;
  const userId = ctx.from.id;
  
  let language = await getUserLanguage(userId);
  if (!language) {
    language = ctx.session.language || 'en';
  }
  
  if (ctx.session.waitingForDate) {
    const calendar = getGlobalCalendar();
    if (!calendar) {
      await ctx.answerCbQuery('❌ Calendar service is not available', { show_alert: true });
      return;
    }
    
    const result = calendar.clickButtonCalendar(ctx.callbackQuery);
    if (result !== -1) {
      await ctx.answerCbQuery();
      const selectedDate = new Date(result);
      return await handleDateSelection(ctx, selectedDate, language);
    } else {
      await ctx.answerCbQuery();
      return;
    }
  }
  
  if (callbackData.startsWith('lang_')) {
    const newLanguageCode = callbackData.replace('lang_', '');
    
    if (isValidLanguage(newLanguageCode)) {
      await ctx.answerCbQuery();
      await handleLanguageChange(ctx, newLanguageCode, language);
    } else {
      await ctx.answerCbQuery('❌ Invalid language selection', { show_alert: true });
    }
  } else if (callbackData === 'prayer_times_menu') {
    await ctx.answerCbQuery();
    await handlePrayerTimesMenu(ctx, language);
  } else {
    await ctx.answerCbQuery('❌ Unknown action', { show_alert: true });
  }
}

module.exports = {
  handleCallbackQuery,
};
