const { Markup } = require('telegraf');

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

function createLanguageKeyboard() {
  const buttons = Object.values(availableLanguages).map(lang => 
    Markup.button.callback(
      `${lang.flag} ${lang.nativeName}`,
      `lang_${lang.code}`
    )
  );

  const keyboard = [];
  for (let i = 0; i < buttons.length; i += 2) {
    keyboard.push(buttons.slice(i, i + 2));
  }

  return Markup.inlineKeyboard(keyboard);
}

function getLanguageInfo(code) {
  return availableLanguages[code] || availableLanguages.en;
}

function getAvailableLanguages() {
  return availableLanguages;
}

function isValidLanguage(code) {
  return code in availableLanguages;
}

module.exports = {
  createLanguageKeyboard,
  getLanguageInfo,
  getAvailableLanguages,
  isValidLanguage,
};
