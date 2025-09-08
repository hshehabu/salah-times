const { Markup } = require('telegraf');

// Available languages configuration
const availableLanguages = {
  en: {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
    nativeName: 'English'
  },
  am: {
    code: 'am',
    name: 'Amharic',
    flag: '🇪🇹',
    nativeName: 'አማርኛ'
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    flag: '🇸🇦',
    nativeName: 'العربية'
  }
};

// Create language selection inline keyboard
function createLanguageKeyboard() {
  const buttons = Object.values(availableLanguages).map(lang => 
    Markup.button.callback(
      `${lang.flag} ${lang.nativeName}`,
      `lang_${lang.code}`
    )
  );

  // Arrange buttons in rows of 2
  const keyboard = [];
  for (let i = 0; i < buttons.length; i += 2) {
    keyboard.push(buttons.slice(i, i + 2));
  }

  return Markup.inlineKeyboard(keyboard);
}

// Get language info by code
function getLanguageInfo(code) {
  return availableLanguages[code] || availableLanguages.en;
}

// Get all available languages
function getAvailableLanguages() {
  return availableLanguages;
}

// Check if language code is valid
function isValidLanguage(code) {
  return code in availableLanguages;
}

module.exports = {
  createLanguageKeyboard,
  getLanguageInfo,
  getAvailableLanguages,
  isValidLanguage,
};
