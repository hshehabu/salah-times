const { t } = require('../translations');

/**
 * Get the next Ramadan start date
 * Note: This is a simplified calculation. In reality, Ramadan dates are determined by lunar observation
 * and can vary by location. This uses approximate dates based on astronomical calculations.
 * @returns {Date} Next Ramadan start date
 */
function getNextRamadanDate() {
  const currentYear = new Date().getFullYear();
  const currentDate = new Date();
  
  // Approximate Ramadan dates for upcoming years
  // These dates are based on astronomical calculations and may vary by 1-2 days
  const ramadanDates = {
    2025: new Date(2025, 1, 28), // February 28, 2025
    2026: new Date(2026, 1, 18), // February 18, 2026
    2027: new Date(2027, 1, 8),  // February 8, 2027
    2028: new Date(2028, 0, 28), // January 28, 2028
    2029: new Date(2029, 0, 16), // January 16, 2029
    2030: new Date(2030, 0, 6)   // January 6, 2030
  };
  
  // Find the next Ramadan date
  for (let year = currentYear; year <= currentYear + 5; year++) {
    if (ramadanDates[year] && ramadanDates[year] > currentDate) {
      return ramadanDates[year];
    }
  }
  
  // Fallback to next year if no date found
  return new Date(currentYear + 1, 1, 15);
}

/**
 * Calculate days until next Ramadan
 * @returns {Object} Countdown information
 */
function calculateRamadanCountdown() {
  const nextRamadan = getNextRamadanDate();
  const today = new Date();
  
  // Reset time to start of day for accurate day calculation
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const ramadanStart = new Date(nextRamadan.getFullYear(), nextRamadan.getMonth(), nextRamadan.getDate());
  
  const timeDiff = ramadanStart.getTime() - todayStart.getTime();
  const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  
  return {
    daysRemaining,
    nextRamadanDate: nextRamadan,
    isRamadanToday: daysRemaining === 0,
    isRamadanStarted: daysRemaining < 0
  };
}

/**
 * Generate visual dots representation for countdown
 * @param {number} daysRemaining - Number of days remaining
 * @returns {string} String of dots representing the countdown
 */
function generateCountdownDots(daysRemaining) {
  // Limit dots to a reasonable number for display (max 100)
  const maxDots = Math.min(daysRemaining, 100);
  return '.'.repeat(maxDots);
}

/**
 * Format Ramadan countdown for display
 * @param {string} language - Language code
 * @returns {string} Formatted countdown message
 */
function formatRamadanCountdown(language = 'en') {
  try {
    const countdown = calculateRamadanCountdown();
    const { daysRemaining, nextRamadanDate, isRamadanToday, isRamadanStarted } = countdown;
    
    if (isRamadanStarted) {
      return t('ramadanStarted', language);
    }
    
    if (isRamadanToday) {
      return t('ramadanToday', language);
    }
    
    const dots = generateCountdownDots(daysRemaining);
    const ramadanDateStr = nextRamadanDate.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
    
    return t('ramadanCountdown', language)
      .replace('{dots}', dots)
      .replace('{days}', daysRemaining)
      .replace('{date}', ramadanDateStr);
      
  } catch (error) {
    console.error('Error formatting Ramadan countdown:', error);
    return t('ramadanCountdownError', language);
  }
}

module.exports = {
  calculateRamadanCountdown,
  formatRamadanCountdown,
  getNextRamadanDate
};
