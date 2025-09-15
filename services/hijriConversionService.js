const config = require('../config');
const { t } = require('../translations');

async function convertGregorianToHijri(gregorianDate) {
  try {
    const day = String(gregorianDate.getDate()).padStart(2, '0');
    const month = String(gregorianDate.getMonth() + 1).padStart(2, '0');
    const year = gregorianDate.getFullYear();
    const dateStr = `${day}-${month}-${year}`;
    
    const url = `${config.api.baseUrl}/gToH/${dateStr}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || !data.data) {
      throw new Error('Invalid API response');
    }
    
    const { hijri, gregorian } = data.data;
    
    return {
      gregorian: {
        date: gregorian.date,
        readable: gregorian.readable,
        day: gregorian.day,
        month: gregorian.month,
        year: gregorian.year,
        weekday: gregorian.weekday
      },
      hijri: {
        date: hijri.date,
        readable: hijri.readable,
        day: hijri.day,
        month: hijri.month,
        year: hijri.year,
        weekday: hijri.weekday
      }
    };
    
  } catch (error) {
    console.error('Error converting date to hijri:', error);
    throw error;
  }
}

function formatDateConversion(conversionData, language = 'en') {
  if (!conversionData) {
    return t('conversionError', language);
  }
  
  const { gregorian, hijri } = conversionData;
  
  const gregorianFormatted = `${gregorian.weekday?.en || ''}, ${gregorian.month?.en || ''} ${gregorian.day}, ${gregorian.year}`;
  
  const hijriFormatted = `${hijri.day} ${hijri.month?.en || ''} ${hijri.year} AH`;
  
  return t('dateConverted', language)
    .replace('{gregorian}', gregorianFormatted)
    .replace('{hijri}', hijriFormatted);
}

module.exports = {
  convertGregorianToHijri,
  formatDateConversion,
};
