require('dotenv').config();

const config = {
  // Bot Configuration
  bot: {
    token: process.env.TELEGRAM_BOT_TOKEN,
  },

  // Database Configuration
  database: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  },

  // API Configuration
  api: {
    baseUrl: 'http://api.aladhan.com/v1',
    method: 3, // Muslim World League
    iso8601: true,
  },

  // Session Configuration
  session: {
    defaultSession: () => ({
      savedCity: null,
      waitingForCity: false,
      language: 'en',
      waitingForDate: false,
      calendar: null,
      waitingForQuranPages: false,
      waitingForQuranDays: false,
      waitingForQuranSessionIndex: false,
      quranStartPage: null,
      quranEndPage: null,
    }),
  },

  // Environment
  isProduction: process.env.NODE_ENV === 'production',
};

// Export individual config values for easier access
module.exports = {
  ...config,
  FEEDBACK_RECIPIENT: process.env.FEEDBACK_RECIPIENT, // Telegram user ID or username to receive feedback
};
