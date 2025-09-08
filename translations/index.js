const translations = {
  en: {
    welcome: '🕌 *Welcome*\n\nGet prayer times for any city.\n\n*Quick Start:*\n• Use buttons below\n• Or send city name directly\n• Save city for quick access\n\n*Status:*',
    noCitySaved: 'No city saved',
    citySaved: 'City saved!',
    yourDefaultCity: 'Your default city is now:',
    currentPrayerTimes: 'Current prayer times:',
    help: '🕌 *Help*\n\n*How to use:*\n• Use buttons below for easy access\n• Or send city name directly in chat\n• Save your city for quick access\n\n*Status:*',
    yourSavedCity: 'Your saved city:',
    noCitySpecified: 'No city saved',
    useBelowToSave: 'Use button below to save your city.',
    currentCity: 'Current city:',
    tapGetTimes: '• Tap "🕌 Get Times" for prayer times',
    tapChangeCity: '• Tap "📍 Change City" to update',
    setCity: '📍 *Set City*\n\nSend me your city name to save it.\n\n*Examples:* Addis Ababa, New York, Cairo, Istanbul, Mecca',
    sendCityName: 'Send city name or type "times" for',
    sendJustCityName: 'Send just city name. Example: "Addis Ababa" or "times" for',
    sendCityForTimes: 'Send city name to get prayer times. Use /help for info.',
    sendJustCity: 'Send just city name. Example: "Addis Ababa".',
    unableToFind: '❌ Unable to find prayer times for this city. Please check the spelling and try again.',
    sendValidCity: 'Please send a valid city name.',
    prayerTimesFor: 'Prayer Times for',
    
    fajr: 'Fajr',
    dhuhr: 'Dhuhr', 
    asr: 'Asr',
    maghrib: 'Maghrib',
    isha: 'Isha',
    
    btnGetTimes: '🕌 Get Times for',
    btnMyCity: '🏙️ My City',
    btnSetCity: '📍 Set My City',
    btnChangeCity: '📍 Change City',
    btnHelp: '❓ Help',
    btnLanguage: '🌐 Language'
  },
  am: {
    welcome: '🕌 *እንኳን ደህና መጣህ*\n\nለማንኛውም ከተማ የሶላት ጊዜዎችን ያግኙ።\n\n*ፈጣን መጀመሪያ:*\n• ከታች ያሉትን አዝራሮች ይጠቀሙ\n• ወይም የከተማ ስም በቀጥታ ይላኩ\n• ለፈጣን መዳረሻ ከተማን ያስቀምጡ\n\n*ሁኔታ:*',
    noCitySaved: 'ምንም ከተማ አልተቀመጠም',
    citySaved: 'ከተማ ተቀምጧል!',
    yourDefaultCity: 'የእርስዎ ነባሪ ከተማ አሁን:',
    currentPrayerTimes: 'የአሁን የሶላት ጊዜዎች:',
    help: '🕌 *እገዛ*\n\n*እንዴት መጠቀም:*\n• ለቀላል መዳረሻ ከታች ያሉትን አዝራሮች ይጠቀሙ\n• ወይም የከተማ ስም በቀጥታ ይላኩ\n• ለፈጣን መዳረሻ ከተማዎን ያስቀምጡ\n\n*ሁኔታ:*',
    yourSavedCity: 'የእርስዎ የተቀመጠ ከተማ:',
    noCitySpecified: 'ምንም ከተማ አልተቀመጠም',
    useBelowToSave: 'ከተማዎን ለማስቀመጥ ከታች ያለውን አዝራር ይጠቀሙ።',
    currentCity: 'የአሁኑ ከተማ:',
    tapGetTimes: '• ለሶላት ጊዜዎች "🕌 ጊዜዎችን አግኝ" ን መታ ያድርጉ',
    tapChangeCity: '• ለመቀየር "📍 ከተማ ቀይር" ን መታ ያድርጉ',
    setCity: '📍 *ከተማ አዘጋጅ*\n\nለማስቀመጥ የከተማዎን ስም ይላኩልኝ።\n\n*ምሳሌዎች:* Addis Ababa, New York, Cairo, Istanbul, Mecca',
    sendCityName: 'የከተማ ስም ይላኩ ወይም "ጊዜዎች" ይተይቡ ለ',
    sendJustCityName: 'የከተማ ስም ብቻ ይላኩ። ምሳሌ: "Addis Ababa" ወይም "ጊዜዎች" ለ',
    sendCityForTimes: 'ለሶላት ጊዜዎች የከተማ ስም ይላኩ። ለመረጃ /help ይጠቀሙ።',
    sendJustCity: 'የከተማ ስም ብቻ ይላኩ። ምሳሌ: "Addis Ababa"።',
    unableToFind: '❌ ለዚህ ከተማ የሶላት ጊዜዎችን ማግኘት አልተቻለም። እባክዎ ፊደል አጻጻፍ ያረጋግጡ እና እንደገና ይሞክሩ።',
    sendValidCity: 'እባክዎ ትክክለኛ የከተማ ስም ይላኩ።',
    prayerTimesFor: 'የሶላት ጊዜዎች ለ',
    
    fajr: 'ፈጅር',
    dhuhr: 'ዙሁር',
    asr: 'አስር',
    maghrib: 'መግሪብ',
    isha: 'ኢሻዕ',
    
    btnGetTimes: '🕌 ጊዜዎች አግኝ ለ',
    btnMyCity: '🏙️ የኔ ከተማ',
    btnSetCity: '📍 ከተማዬን አዘጋጅ',
    btnChangeCity: '📍 ከተማ ቀይር',
    btnHelp: '❓ እገዛ',
    btnLanguage: '🌐 ቋንቋ'
  }
};

function t(key, language = 'en') {
  return translations[language][key] || translations.en[key] || key;
}

module.exports = {
  translations,
  t,
};
