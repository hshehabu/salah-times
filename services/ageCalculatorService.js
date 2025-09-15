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

  // Adjust for negative days
  if (days < 0) {
    months--;
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    days += lastMonth.getDate();
  }

  // Adjust for negative months
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
    // Convert birth date to Hijri
    const birthHijri = await convertGregorianToHijri(birthDate);
    
    // Convert current date to Hijri
    const currentHijri = await convertGregorianToHijri(currentDate);
    
    // Calculate Hijri age
    let hijriYears = currentHijri.hijri.year - birthHijri.hijri.year;
    let hijriMonths = currentHijri.hijri.month.number - birthHijri.hijri.month.number;
    let hijriDays = currentHijri.hijri.day - birthHijri.hijri.day;

    // Adjust for negative days
    if (hijriDays < 0) {
      hijriMonths--;
      // Get days in previous month (approximate)
      hijriDays += 29; // Most Hijri months have 29-30 days
    }

    // Adjust for negative months
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
  const month = parseInt(parts[1], 10) - 1; // JavaScript months are 0-indexed
  const year = parseInt(parts[2], 10);

  // Validate date components
  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    throw new Error('Invalid date components');
  }

  if (day < 1 || day > 31 || month < 0 || month > 11 || year < 1900 || year > new Date().getFullYear()) {
    throw new Error('Date out of valid range');
  }

  const date = new Date(year, month, day);
  
  // Check if date is valid
  if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
    throw new Error('Invalid date');
  }

  // Check if date is not in the future
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
 * Calculate days until next birthday
 * @param {Date} birthDate - Birth date
 * @param {Date} currentDate - Current date (defaults to today)
 * @returns {number} Days until next birthday
 */
function getDaysUntilBirthday(birthDate, currentDate = new Date()) {
  const currentYear = currentDate.getFullYear();
  let nextBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
  
  // If birthday has passed this year, set it for next year
  if (nextBirthday <= currentDate) {
    nextBirthday = new Date(currentYear + 1, birthDate.getMonth(), birthDate.getDate());
  }
  
  return Math.ceil((nextBirthday - currentDate) / (1000 * 60 * 60 * 24));
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
    
    // Calculate Gregorian age
    const gregorianAge = calculateGregorianAge(birthDate, currentDate);
    
    // Calculate Hijri age
    const hijriAge = await calculateHijriAge(birthDate, currentDate);
    
    // Get additional information
    const dayOfWeek = getDayOfWeek(birthDate);
    const daysUntilBirthday = getDaysUntilBirthday(birthDate, currentDate);
    
    return {
      success: true,
      birthDate: {
        gregorian: birthDate,
        hijri: hijriAge.birthHijri,
        dayOfWeek
      },
      currentDate: {
        gregorian: currentDate,
        hijri: hijriAge.currentHijri
      },
      gregorianAge,
      hijriAge: {
        years: hijriAge.years,
        months: hijriAge.months,
        days: hijriAge.days
      },
      daysUntilBirthday
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

  const { birthDate, currentDate, gregorianAge, hijriAge, daysUntilBirthday } = ageData;
  
  // Format birth date
  const birthGregorian = birthDate.gregorian.toLocaleDateString('en-GB');
  const birthHijri = `${birthDate.hijri.day} ${birthDate.hijri.month.en} ${birthDate.hijri.year} AH`;
  
  // Format current date
  const currentGregorian = currentDate.gregorian.toLocaleDateString('en-GB');
  const currentHijri = `${currentDate.hijri.day} ${currentDate.hijri.month.en} ${currentDate.hijri.year} AH`;
  
  // Format ages
  const gregorianAgeText = `${gregorianAge.years} ${t('years', language)}, ${gregorianAge.months} ${t('months', language)}, ${gregorianAge.days} ${t('days', language)}`;
  const hijriAgeText = `${hijriAge.years} ${t('years', language)}, ${hijriAge.months} ${t('months', language)}, ${hijriAge.days} ${t('days', language)}`;
  
  // Birthday message
  const birthdayMessage = daysUntilBirthday === 0 
    ? t('birthdayToday', language)
    : t('daysUntilBirthday', language).replace('{days}', daysUntilBirthday);

  return t('ageCalculationResult', language)
    .replace('{birthGregorian}', birthGregorian)
    .replace('{birthHijri}', birthHijri)
    .replace('{birthDayOfWeek}', birthDate.dayOfWeek)
    .replace('{currentGregorian}', currentGregorian)
    .replace('{currentHijri}', currentHijri)
    .replace('{gregorianAge}', gregorianAgeText)
    .replace('{hijriAge}', hijriAgeText)
    .replace('{birthdayMessage}', birthdayMessage);
}

module.exports = {
  calculateAge,
  formatAgeCalculation,
  parseDateString,
  calculateGregorianAge,
  calculateHijriAge
};
