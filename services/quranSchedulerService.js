const { t } = require('../translations');

/**
 * Quran Recitation Scheduler Service
 * Allows users to schedule Quran recitation by selecting a range of pages and frequency
 */

const DAYS_OF_WEEK = {
  en: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  am: ['ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ', 'እሑድ'],
  ar: ['الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد']
};

/**
 * Calculate schedule for Quran recitation
 * @param {number} startPage - Starting page number (1-604)
 * @param {number} endPage - Ending page number (1-604)
 * @param {number} daysPerWeek - Number of days per week (1-7)
 * @param {string} language - Language code
 * @returns {Object} Schedule calculation result
 */
function calculateSchedule(startPage, endPage, daysPerWeek, language = 'en') {
  // Validate inputs
  if (startPage < 1 || startPage > 604) {
    return {
      success: false,
      message: t('quranInvalidStartPage', language)
    };
  }

  if (endPage < 1 || endPage > 604) {
    return {
      success: false,
      message: t('quranInvalidEndPage', language)
    };
  }

  if (startPage > endPage) {
    return {
      success: false,
      message: t('quranStartGreaterThanEnd', language)
    };
  }

  if (daysPerWeek < 1 || daysPerWeek > 7) {
    return {
      success: false,
      message: t('quranInvalidDaysPerWeek', language)
    };
  }

  const totalPages = endPage - startPage + 1;
  const pagesPerSession = Math.ceil(totalPages / daysPerWeek);
  const remainder = totalPages % daysPerWeek;

  // Generate schedule
  const schedule = [];
  let currentPage = startPage;

  for (let i = 0; i < daysPerWeek; i++) {
    const sessionPages = i < remainder ? pagesPerSession : pagesPerSession - 1;
    const sessionEndPage = Math.min(currentPage + sessionPages - 1, endPage);
    
    schedule.push({
      dayIndex: i,
      dayName: DAYS_OF_WEEK[language]?.[i] || DAYS_OF_WEEK.en[i],
      startPage: currentPage,
      endPage: sessionEndPage,
      pages: sessionEndPage - currentPage + 1
    });

    currentPage = sessionEndPage + 1;
    if (currentPage > endPage) break;
  }

  return {
    success: true,
    totalPages,
    pagesPerSession,
    daysPerWeek,
    schedule,
    startPage,
    endPage,
    remainder: remainder > 0
  };
}

/**
 * Format schedule message for display
 * @param {Object} scheduleData - Schedule calculation result
 * @param {string} language - Language code
 * @returns {string} Formatted schedule message
 */
function formatScheduleMessage(scheduleData, language = 'en') {
  if (!scheduleData.success) {
    return scheduleData.message;
  }

  let message = `${t('quranScheduleTitle', language)}\n\n`;
  message += `${t('quranScheduleInfo', language)
    .replace('{startPage}', scheduleData.startPage)
    .replace('{endPage}', scheduleData.endPage)
    .replace('{totalPages}', scheduleData.totalPages)
    .replace('{daysPerWeek}', scheduleData.daysPerWeek)
    .replace('{pagesPerSession}', scheduleData.pagesPerSession)}\n\n`;

  message += `📋 *${t('quranScheduleDetails', language)}:*\n\n`;

  scheduleData.schedule.forEach((session, index) => {
    message += `${index + 1}. ${session.dayName}: `;
    message += `${t('quranPagesRange', language)
      .replace('{start}', session.startPage)
      .replace('{end}', session.endPage)
      .replace('{pages}', session.pages)}\n`;
  });

  if (scheduleData.remainder) {
    message += `\n${t('quranScheduleNote', language)}\n`;
  }

  return message;
}

/**
 * Validate page range input
 * @param {string} input - User input (e.g., "1-10" or "1 10")
 * @returns {Object} Validation result with startPage and endPage
 */
function validatePageRange(input) {
  // Try format "1-10" or "1 10" or "1,10"
  const patterns = [
    /^(\d+)\s*[-,\s]\s*(\d+)$/,  // "1-10", "1 10", "1,10"
    /^(\d+)$/  // Single page
  ];

  for (const pattern of patterns) {
    const match = input.trim().match(pattern);
    if (match) {
      const startPage = parseInt(match[1], 10);
      const endPage = match[2] ? parseInt(match[2], 10) : startPage;
      
      if (startPage >= 1 && startPage <= 604 && endPage >= 1 && endPage <= 604 && startPage <= endPage) {
        return {
          valid: true,
          startPage,
          endPage
        };
      }
    }
  }

  return {
    valid: false,
    message: 'Invalid format. Please use: "1-10" or "1 10"'
  };
}

/**
 * Validate days per week input
 * @param {string} input - User input
 * @returns {Object} Validation result
 */
function validateDaysPerWeek(input) {
  const days = parseInt(input.trim(), 10);
  
  if (isNaN(days) || days < 1 || days > 7) {
    return {
      valid: false,
      message: 'Please enter a number between 1 and 7'
    };
  }

  return {
    valid: true,
    days
  };
}

module.exports = {
  calculateSchedule,
  formatScheduleMessage,
  validatePageRange,
  validateDaysPerWeek,
  DAYS_OF_WEEK
};

