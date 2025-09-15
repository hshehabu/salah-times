const { convertGregorianToHijri } = require('./hijriConversionService');
const { t } = require('../translations');

/**
 * Calculate age in Gregorian calendar
 * @param {Date} birthDate - Birth date
 * @param {Date} currentDate - Current date (defaults to today)
 * @returns {Object} Age object with years, months, days
 */
function calculateGregorianAge(birthDate, currentDate = new Date()) {
  let years = currentDate.getFullYear() - birthDate.getFullYear();
  let months = currentDate.getMonth() - birthDate.getMonth();
  let days = currentDate.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    days += lastMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return {
    years,
    months,
    days,
    totalDays: Math.floor((currentDate - birthDate) / (1000 * 60 * 60 * 24))
  };
}

/**
 * Calculate age in Hijri calendar
 * @param {Date} birthDate - Birth date in Gregorian
 * @param {Date} currentDate - Current date in Gregorian (defaults to today)
 * @returns {Object} Hijri age object
 */
async function calculateHijriAge(birthDate, currentDate = new Date()) {
  try {
    const birthHijri = await convertGregorianToHijri(birthDate);
    
    const currentHijri = await convertGregorianToHijri(currentDate);
    
    let hijriYears = currentHijri.hijri.year - birthHijri.hijri.year;
    let hijriMonths = currentHijri.hijri.month.number - birthHijri.hijri.month.number;
    let hijriDays = currentHijri.hijri.day - birthHijri.hijri.day;

    if (hijriDays < 0) {
      hijriMonths--;
      hijriDays += 29;
    }

    if (hijriMonths < 0) {
      hijriYears--;
      hijriMonths += 12;
    }

    return {
      years: hijriYears,
      months: hijriMonths,
      days: hijriDays,
      birthHijri: birthHijri.hijri,
      currentHijri: currentHijri.hijri
    };
  } catch (error) {
    console.error('Error calculating Hijri age:', error);
    throw error;
  }
}

/**
 * Parse date string in dd/mm/yyyy format
 * @param {string} dateString - Date string in dd/mm/yyyy format
 * @returns {Date} Parsed date object
 */
function parseDateString(dateString) {
  const parts = dateString.split('/');
  if (parts.length !== 3) {
    throw new Error('Invalid date format. Please use dd/mm/yyyy');
  }

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    throw new Error('Invalid date components');
  }

  if (day < 1 || day > 31 || month < 0 || month > 11 || year < 1900 || year > new Date().getFullYear()) {
    throw new Error('Date out of valid range');
  }

  const date = new Date(year, month, day);
  
  if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
    throw new Error('Invalid date');
  }

  if (date > new Date()) {
    throw new Error('Birth date cannot be in the future');
  }

  return date;
}

/**
 * Get day of week name
 * @param {Date} date - Date object
 * @returns {string} Day of week name
 */
function getDayOfWeek(date) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}


/**
 * Main age calculation function
 * @param {string} birthDateString - Birth date in dd/mm/yyyy format
 * @param {string} language - Language code
 * @returns {Object} Complete age calculation result
 */
async function calculateAge(birthDateString, language = 'en') {
  try {
    const birthDate = parseDateString(birthDateString);
    const currentDate = new Date();
    
    const gregorianAge = calculateGregorianAge(birthDate, currentDate);
    
    const hijriAge = await calculateHijriAge(birthDate, currentDate);
    
    const dayOfWeek = getDayOfWeek(birthDate);
    
    return {
      success: true,
      birthDate: {
        gregorian: birthDate,
        hijri: hijriAge.birthHijri,
        dayOfWeek
      },
      gregorianAge,
      hijriAge: {
        years: hijriAge.years,
        months: hijriAge.months,
        days: hijriAge.days
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Format age calculation result for display
 * @param {Object} ageData - Age calculation result
 * @param {string} language - Language code
 * @returns {string} Formatted message
 */
function formatAgeCalculation(ageData, language = 'en') {
  if (!ageData.success) {
    return t('ageCalculationError', language).replace('{error}', ageData.error);
  }

  const { birthDate, gregorianAge, hijriAge } = ageData;
  
  const birthGregorian = birthDate.gregorian.toLocaleDateString('en-GB');
  const birthHijri = `${birthDate.hijri.day} ${birthDate.hijri.month.en} ${birthDate.hijri.year} AH`;
  
  const gregorianAgeText = `${gregorianAge.years} ${t('years', language)}, ${gregorianAge.months} ${t('months', language)}, ${gregorianAge.days} ${t('days', language)}`;
  const hijriAgeText = `${hijriAge.years} ${t('years', language)}, ${hijriAge.months} ${t('months', language)}, ${hijriAge.days} ${t('days', language)}`;

  return t('ageCalculationResult', language)
    .replace('{birthGregorian}', birthGregorian)
    .replace('{birthHijri}', birthHijri)
    .replace('{birthDayOfWeek}', birthDate.dayOfWeek)
    .replace('{gregorianAge}', gregorianAgeText)
    .replace('{hijriAge}', hijriAgeText);
}

module.exports = {
  calculateAge,
  formatAgeCalculation,
  parseDateString,
  calculateGregorianAge,
  calculateHijriAge
};
