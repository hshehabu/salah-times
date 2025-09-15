const config = require('../config');
const { convertTo12Hour } = require('../utils/timeUtils');
const { t } = require('../translations');

async function fetchPrayerTimes(city) {
  try {
    const url = `${config.api.baseUrl}/timingsByAddress?address=${encodeURIComponent(city)}&method=${config.api.method}&iso8601=${config.api.iso8601}`;
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
  if (!data || !data.data || !data.data.timings) {
    return `❌ ${t('unableToFind', language)}`;
  }

  const timings = data.data.timings;
  
  let timezone = null;
  if (data.data.meta && data.data.meta.timezone) {
    timezone = data.data.meta.timezone;
  }
  
  let location = data.originalCity || 'Your Location';
  
  if (data.data.meta && data.data.meta.timezone) {
    const timezoneStr = data.data.meta.timezone;
    if (timezoneStr.includes('/')) {
      const parts = timezoneStr.split('/');
      if (parts.length > 1) {
        location = parts[1].replace(/_/g, ' ');
      }
    }
  }
  
  if (location && location !== 'Your Location') {
    location = location.replace(/\s+/g, ' ').trim();
    location = location.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  }
  
  let dateDisplay = 'Today';
  
  if (data.data.date) {
    const { hijri, gregorian } = data.data.date;
    
    if (hijri && gregorian) {
      const gregorianWeekday = gregorian.weekday?.en || '';
      const gregorianMonth = gregorian.month?.en || '';
      const gregorianDay = gregorian.day || '';
      const gregorianYear = gregorian.year || '';
      
      const hijriDay = hijri.day || '';
      const hijriMonth = hijri.month?.en || '';
      const hijriYear = hijri.year || '';
      
      if (gregorianWeekday && gregorianMonth && gregorianDay && gregorianYear && 
          hijriDay && hijriMonth && hijriYear) {
        dateDisplay = `${gregorianWeekday}, ${gregorianMonth} ${gregorianDay}, ${gregorianYear}\n(${hijriDay} ${hijriMonth} ${hijriYear} AH)`;
      } else if (gregorian.readable) {
        dateDisplay = gregorian.readable;
      }
    } else if (gregorian?.readable) {
      dateDisplay = gregorian.readable;
    }
  }

  return `🕌 *${t('prayerTimesFor', language)} ${location}*\n\n📅 ${dateDisplay}\n\n` +
         `🌅 *${t('fajr', language)}:* ${convertTo12Hour(timings.Fajr, timezone)}\n\n` +
         `☀️ *${t('dhuhr', language)}:* ${convertTo12Hour(timings.Dhuhr, timezone)}\n\n` +
         `🌤️ *${t('asr', language)}:* ${convertTo12Hour(timings.Asr, timezone)}\n\n` +
         `🌅 *${t('maghrib', language)}:* ${convertTo12Hour(timings.Maghrib, timezone)}\n\n` +
         `🌙 *${t('isha', language)}:* ${convertTo12Hour(timings.Isha, timezone)}`;
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

module.exports = {
  fetchPrayerTimes,
  formatPrayerTimes,
  handleError,
};
