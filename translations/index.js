const translations = {
  en: {
    welcome: '🕌 *Assalamu Alaikum!*\n\nGet prayer times and Islamic tools.\n\n*Features:*\n• Prayer times for any city\n• Date conversion to Hijri\n• Age calculator\n• Islamic months\n\n*Quick start:*\n• Use buttons below\n• Settings save automatically\n\nThe best is yet to come!\n\n*Status:*',
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
    btnLanguage: '🌐 Language',
    btnTools: '🔧 Tools',
    btnPrayerTimes: '🕌 Prayer Times',
    btnOtherTools: '🔧 Other Tools',
    btnToHijri: '🔁 To Hijri',
    btnBackToMain: '⬅️ Back to Main',
    btnBackToTools: '⬅️ Back to Tools',
    btnBackToPrayerTimes: '⬅️ Back to Prayer Times',
    btnFeedback: '💬 Feedback',
    btnReminder: '⏰ Reminder',
    
    selectLanguage: 'Select your preferred language:',
    currentLanguage: 'Current language',
    languageChanged: 'Language changed to',
    
    toolsMenu: '🔧 *Tools*\n\nSelect a tool to use:',
    prayerTimesMenu: '🕌 *Prayer Times*\n\nSelect an option:',
    otherToolsMenu: '🔧 *Other Tools*\n\nSelect a tool to use:',
    selectDateToConvert: '📅 *Date to Hijri Converter*\n\nPlease select a Gregorian date to convert to Hijri:',
    dateConverted: '📅 *Date Conversion*\n\n*Gregorian:* {gregorian}\n*Hijri:* {hijri}',
    conversionError: '❌ Error converting date. Please try again.',
    
    btnIslamicMonths: '📅 Islamic Months',
    islamicMonthsTitle: '📅 *Islamic Calendar Months*\n\n',
    islamicMonthsList: 'Here are the 12 months of the Islamic calendar:',
    
    btnAgeCalculator: '⏳ Age in Hijri',
    ageCalculatorPrompt: '⏳ *Age Calculator*\n\nPlease enter your birth date in the format:\n*dd/mm/yyyy*\n\n*Example:* 15/03/1990',
    ageCalculationError: '❌ Error calculating age: {error}',
    ageCalculationResult: '🧾 *Age Calculation*\n\n' +
    '📅 *Birth Information:*\n' +
    '   • Hijri: {birthHijri}\n' +
    '   • Gregorian: {birthGregorian}\n' +
    '   • Day of Week: {birthDayOfWeek}\n\n' +
    '⏳ *Current Age:*\n' +
    '   • Hijri: {hijriAge}\n' +
    '   • Gregorian: {gregorianAge}',
    years: 'years',
    months: 'months', 
    days: 'days',
    invalidDateFormat: '❌ Invalid date format. Please use dd/mm/yyyy format.\n\n*Example:* 15/03/1990',
    dateInFuture: '❌ Birth date cannot be in the future. Please enter a valid past date.',
    invalidDate: '❌ Invalid date. Please check your input and try again.',
    
    feedbackPrompt: '💬 *Send Anonymous Feedback*\n\nPlease share your feedback, suggestions, or report any issues. Your message will be forwarded to our team anonymously.\n\n*Note:* Your identity will remain completely anonymous.',
    feedbackSent: '✅ *Feedback Sent!*\n\nThank you for your feedback. We appreciate your input and will review it soon.',
    feedbackError: '❌ *Error sending feedback*\n\nSorry, there was an error sending your feedback. Please try again later.',
    feedbackCancel: '❌ *Feedback Cancelled*\n\nYou can send feedback anytime using the Feedback button.',
    
    reminderMenu: '⏰ *Daily Prayer Reminder*\n\nGet daily prayer times sent to you at Fajr time.\n\n*Current status:*',
    reminderEnabled: '✅ *Reminder Enabled*\n\nYou will receive daily prayer times at Fajr time for your saved city.',
    reminderDisabled: '❌ *Reminder Disabled*\n\nDaily prayer reminders are now turned off.',
    reminderError: '❌ *Error*\n\nSorry, there was an error updating your reminder settings.',
    reminderNoCity: '❌ *No City Saved*\n\nPlease save a city first to enable daily reminders.',
    btnEnableReminder: '✅ Enable Reminder',
    btnDisableReminder: '❌ Disable Reminder',
    dailyReminder: 'Daily Prayer Times',
    
    btnNearbyMasjids: '🕌 Nearby Masjids',
    nearbyMasjidsPrompt: '🕌 *Nearby Masjids*\n\nPlease share your location to find nearby masjids.\n\n*How to share location:*\n• Tap the 📎 attachment button\n• Select "Location"\n• Choose "Send My Current Location"',
    nearbyMasjidsUnderDevelopment: '🕌 *Nearby Masjids*\n\n🚧 *This feature is under development*\n\nWe are working on bringing you a comprehensive list of nearby masjids with:\n• Prayer times\n• Contact information\n• Directions\n• Reviews and ratings\n\n*Coming soon!* Stay tuned for updates.',
    nearbyMasjidsFound: '🕌 *Nearby Masjids Found*\n\nClick the button below to view nearby masjids in Google Maps:',
    clickToViewMasjids: '📍 *Click to view nearby masjids*',
    viewNearbyMasjids: '🕌 View Nearby Masjids',
    invalidLocation: '❌ *Invalid Location*\n\nPlease share a valid location to find nearby masjids.',
    masjidsSearchError: '❌ *Search Error*\n\nSorry, there was an error searching for nearby masjids. Please try again later.',
    pleaseShareLocation: '❌ *Please Share Location*\n\nTo find nearby masjids, please share your location using the 📎 attachment button.',
    locationReceived: '📍 *Location Received*\n\nUse the Nearby Masjids feature to find masjids near you.',
    
    btnRamadanCountdown: '🌙 Ramadan Countdown',
    ramadanCountdown: '🌙 *Ramadan Countdown*\n\n{dots}\n\n*{days} days* remaining until Ramadan\n\n*Next Ramadan:* {date}',
    ramadanToday: '🌙 *Ramadan Starts Today!*\n\n🎉 *Ramadan Mubarak!*\n\nMay this blessed month bring you peace, happiness, and spiritual growth.',
    ramadanStarted: '🌙 *Ramadan is Here!*\n\n🎉 *Ramadan Mubarak!*\n\nMay Allah accept your fasting and prayers.',
    ramadanCountdownError: '❌ *Error*\n\nSorry, there was an error calculating the Ramadan countdown. Please try again later.'
  },
  am: {
    welcome: '🕌 *አሰላሙ አለይኩም!*\n\nየሶላት ጊዜዎች እና የኢስላም መሳሪያዎች ያግኙ።\n\n*ባህሪያት:*\n• ለማንኛውም ከተማ የሶላት ጊዜዎች\n• ቀን ወደ ሂጅሪ መቀየር\n• ዕድሜ ካልኩሌተር\n• የኢስላም ወራት\n\n*ፈጣን መጀመሪያ:*\n• ከታች ያሉትን አዝራሮች ይጠቀሙ\n• ቅንብሮች በራስ-ሰር ይቀመጣሉ\n\nምርጥው አሁንም አልመጣም!\n\n*ሁኔታ:*',
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
    btnLanguage: '🌐 ቋንቋ',
    btnTools: '🔧 መሳሪያዎች',
    btnPrayerTimes: '🕌 የሶላት ጊዜዎች',
    btnOtherTools: '🔧 ሌሎች መሳሪያዎች',
    btnToHijri: '🔁 ወደ ሂጅሪ',
    btnBackToMain: '⬅️ ወደ ዋናው ተመለስ',
    btnBackToTools: '⬅️ ወደ መሳሪያዎች ተመለስ',
    btnBackToPrayerTimes: '⬅️ ወደ ሶላት ጊዜዎች ተመለስ',
    btnFeedback: '💬 አስተያየት',
    btnReminder: '⏰ ማስታወሻ',
    
    selectLanguage: 'የሚመርጡትን ቋንቋ ይምረጡ:',
    currentLanguage: 'የአሁኑ ቋንቋ',
    languageChanged: 'ቋንቋ ተቀይሯል ወደ',
    
    toolsMenu: '🔧 *መሳሪያዎች*\n\nለመጠቀም መሳሪያ ይምረጡ:',
    prayerTimesMenu: '🕌 *የሶላት ጊዜዎች*\n\nአማራጭ ይምረጡ:',
    otherToolsMenu: '🔧 *ሌሎች መሳሪያዎች*\n\nለመጠቀም መሳሪያ ይምረጡ:',
    selectDateToConvert: '📅 *ወደ ሂጅሪ ቀን መቀየሪያ*\n\nወደ ሂጅሪ ለመቀየር ግሪጎሪያን ቀን ይምረጡ:',
    dateConverted: '📅 *ቀን መቀየሪያ*\n\n*ግሪጎሪያን:* {gregorian}\n*ሂጅሪ:* {hijri}',
    conversionError: '❌ ቀን በመቀየር ላይ ስህተት። እባክዎ እንደገና ይሞክሩ።',
    
    btnIslamicMonths: '📅 የኢስላም ወራት',
    islamicMonthsTitle: '📅 *የኢስላም የቀን መቁጠሪያ ወራት*\n\n',
    islamicMonthsList: 'እነዚህ የኢስላም የቀን መቁጠሪያ 12 ወራት ናቸው:',
    
    btnAgeCalculator: '⏳ ዕድሜ በሂጅሪ',
    ageCalculatorPrompt: '⏳ *ዕድሜ ካልኩሌተር*\n\nእባክዎ የተወለዱበትን ቀን በዚህ ቅርጸት ያስገቡ:\n*dd/mm/yyyy*\n\n*ምሳሌ:* 15/03/1990',
    ageCalculationError: '❌ ዕድሜ በማስላት ላይ ስህተት: {error}',
    ageCalculationResult: '🧾 *የዕድሜ ስሌት*\n\n' +
    '📅 *የተወለዱበት መረጃ:*\n' +
    '   • ሂጅሪ: {birthHijri}\n' +
    '   • ግሪጎሪያን: {birthGregorian}\n' +
    '   • የሳምንት ቀን: {birthDayOfWeek}\n\n' +
    '⏳ *የአሁኑ ዕድሜ:*\n' +
    '   • ሂጅሪ: {hijriAge}\n' +
    '   • ግሪጎሪያን: {gregorianAge}',

    years: 'ዓመታት',
    months: 'ወራት',
    days: 'ቀናት',
    invalidDateFormat: '❌ ትክክል ያልሆነ የቀን ቅርጸት። እባክዎ dd/mm/yyyy ቅርጸት ይጠቀሙ።\n\n*ምሳሌ:* 15/03/1990',
    dateInFuture: '❌ የተወለዱበት ቀን ወደፊት ሊሆን አይችልም። እባክዎ ትክክለኛ የተለመደ ቀን ያስገቡ።',
    invalidDate: '❌ ትክክል ያልሆነ ቀን። እባክዎ ግቤትዎን ያረጋግጡ እና እንደገና ይሞክሩ።',
    
    feedbackPrompt: '💬 *ስም የማይገለጽ አስተያየት ላክ*\n\nእባክዎ አስተያየትዎን፣ ሀሳቦችዎን ወይም ችግሮችን ያጋሩ። መልዕክትዎ ለቡድናችን ስም የማይገለጽ ሆኖ ይላካል።\n\n*ማስታወሻ:* ማንነትዎ ሙሉ በሙሉ ስም የማይገለጽ ይሆናል።',
    feedbackSent: '✅ *አስተያየት ተላከ!*\n\nአስተያየትዎን ስላጋሩ እናመሰግናለን። በቅርቡ እንገልጸዋለን።',
    feedbackError: '❌ *አስተያየት በማስተላልፍ ላይ ስህተት*\n\nይቅርታ፣ አስተያየትዎን በማስተላልፍ ላይ ስህተት ተከስቷል። እባክዎ ቆይተው እንደገና ይሞክሩ።',
    feedbackCancel: '❌ *አስተያየት ተሰርዟል*\n\nአስተያየት በማስተላልፍ አዝራር በመጠቀም በማንኛውም ጊዜ መላክ ይችላሉ።',
    
    reminderMenu: '⏰ *ዕለታዊ የሶላት ማስታወሻ*\n\nበፋጅር ጊዜ ዕለታዊ የሶላት ጊዜዎች ይላኩልዎ።\n\n*የአሁኑ ሁኔታ:*',
    reminderEnabled: '✅ *ማስታወሻ ተንቃ*\n\nለተቀመጠው ከተማ በፋጅር ጊዜ ዕለታዊ የሶላት ጊዜዎች ይደርሱዎታል።',
    reminderDisabled: '❌ *ማስታወሻ ተሰርዟል*\n\nዕለታዊ የሶላት ማስታወሻዎች አሁን ተሰርዘዋል።',
    reminderError: '❌ *ስህተት*\n\nይቅርታ፣ የማስታወሻ ቅንብሮችዎን በማዘመን ላይ ስህተት ተከስቷል።',
    reminderNoCity: '❌ *ምንም ከተማ አልተቀመጠም*\n\nዕለታዊ ማስታወሻዎችን ለማንቃት እባክዎ በመጀመሪያ ከተማ ያስቀምጡ።',
    btnEnableReminder: '✅ ማስታወሻ አንቃ',
    btnDisableReminder: '❌ ማስታወሻ አሰርዝ',
    dailyReminder: 'ዕለታዊ የሶላት ጊዜዎች',
    
    btnNearbyMasjids: '🕌 ቅርብ መስጂዶች',
    nearbyMasjidsPrompt: '🕌 *ቅርብ መስጂዶች*\n\nቅርብ ያሉ መስጂዶችን ለማግኘት እባክዎ አካባቢዎን ያጋሩ።\n\n*አካባቢ እንዴት እንደሚጋራ:*\n• 📎 አባሪ አዝራርን ይንኩ\n• "አካባቢ" ይምረጡ\n• "የአሁኑን አካባቢዬን ላክ" ይምረጡ',
    nearbyMasjidsUnderDevelopment: '🕌 *ቅርብ መስጂዶች*\n\n🚧 *ይህ ባህሪ በማዳበር ላይ ነው*\n\nለእርስዎ የሚከተሉትን የያዘ የቅርብ መስጂዶች ዝርዝር እያመጣን ነው:\n• የሶላት ጊዜዎች\n• የግንኙነት መረጃ\n• አቅጣጫዎች\n• አስተያየቶች እና ደረጃዎች\n\n*በቅርቡ ይመጣል!* ለማዘመን ይጠብቁ።',
    nearbyMasjidsFound: '🕌 *ቅርብ መስጂዶች ተገኝተዋል*\n\nበGoogle Maps ውስጥ ቅርብ ያሉ መስጂዶችን ለማየት ከዚህ በታች ያለውን አዝራር ይንኩ:',
    clickToViewMasjids: '📍 *ቅርብ ያሉ መስጂዶችን ለማየት ይንኩ*',
    viewNearbyMasjids: '🕌 ቅርብ መስጂዶችን ይመልከቱ',
    invalidLocation: '❌ *ትክክል ያልሆነ አካባቢ*\n\nቅርብ ያሉ መስጂዶችን ለማግኘት እባክዎ ትክክለኛ አካባቢ ያጋሩ።',
    masjidsSearchError: '❌ *የፍለጋ ስህተት*\n\nይቅርታ፣ ቅርብ ያሉ መስጂዶችን በመፈለግ ላይ ስህተት ተከስቷል። እባክዎ ቆይተው እንደገና ይሞክሩ።',
    pleaseShareLocation: '❌ *እባክዎ አካባቢ ያጋሩ*\n\nቅርብ ያሉ መስጂዶችን ለማግኘት፣ እባክዎ አካባቢዎን በ📎 አባሪ አዝራር በመጠቀም ያጋሩ።',
    locationReceived: '📍 *አካባቢ ተቀብሏል*\n\nቅርብ ያሉ መስጂዶችን ለማግኘት የቅርብ መስጂዶች ባህሪን ይጠቀሙ።',
    
    btnRamadanCountdown: '🌙 ረመዳን ቆጠራ',
    ramadanCountdown: '🌙 *ረመዳን ቆጠራ*\n\n{dots}\n\n*{days} ቀናት* ረመዳን እስኪመጣ ይቀራሉ\n\n*ቀጣይ ረመዳን:* {date}',
    ramadanToday: '🌙 *ረመዳን ዛሬ ይጀምራል!*\n\n🎉 *ረመዳን ሙባረክ!*\n\nይህ ቡሩክ ወር ሰላም፣ ደስታ እና መንፈሳዊ እድገት ያመጣል።',
    ramadanStarted: '🌙 *ረመዳን እዚህ አለ!*\n\n🎉 *ረመዳን ሙባረክ!*\n\nአላህ የምጾትን እና የሶላትን ይቀበል።',
    ramadanCountdownError: '❌ *ስህተት*\n\nይቅርታ፣ የረመዳን ቆጠራን በማስላት ላይ ስህተት ተከስቷል። እባክዎ ቆይተው እንደገና ይሞክሩ።'
  },
  ar: {
    welcome: '🕌 *السلام عليكم!*\n\nاحصل على أوقات الصلاة والأدوات الإسلامية.\n\n*الميزات:*\n• أوقات الصلاة لأي مدينة\n• تحويل التواريخ إلى الهجري\n• حاسبة العمر\n• الأشهر الإسلامية\n\n*بداية سريعة:*\n• استخدم الأزرار أدناه\n• الإعدادات تُحفظ تلقائياً\n\nالأفضل لم يأت بعد!\n\n*الحالة:*',
    noCitySaved: 'لم يتم حفظ أي مدينة',
    citySaved: 'تم حفظ المدينة!',
    yourDefaultCity: 'مدينتك الافتراضية الآن:',
    currentPrayerTimes: 'أوقات الصلاة الحالية:',
    help: '🕌 *مساعدة*\n\n*كيفية الاستخدام:*\n• استخدم الأزرار أدناه للوصول السهل\n• أو أرسل اسم المدينة مباشرة في الدردشة\n• احفظ مدينتك للوصول السريع\n\n*الحالة:*',
    yourSavedCity: 'مدينتك المحفوظة:',
    noCitySpecified: 'لم يتم حفظ أي مدينة',
    useBelowToSave: 'استخدم الزر أدناه لحفظ مدينتك.',
    currentCity: 'المدينة الحالية:',
    tapGetTimes: '• اضغط على "🕌 احصل على الأوقات" لأوقات الصلاة',
    tapChangeCity: '• اضغط على "📍 تغيير المدينة" للتحديث',
    setCity: '📍 *تحديد المدينة*\n\nأرسل لي اسم مدينتك لحفظها.\n\n*أمثلة:* القاهرة, الرياض, إسطنبول, مكة, القدس',
    sendCityName: 'أرسل اسم المدينة أو اكتب "times" لـ',
    sendJustCityName: 'أرسل اسم المدينة فقط. مثال: "الرياض" أو "times" لـ',
    sendCityForTimes: 'أرسل اسم المدينة للحصول على أوقات الصلاة. استخدم /help للمعلومات.',
    sendJustCity: 'أرسل اسم المدينة فقط. مثال: "القاهرة".',
    unableToFind: '❌ تعذر العثور على أوقات الصلاة لهذه المدينة. يرجى التحقق من الهجاء والمحاولة مرة أخرى.',
    sendValidCity: 'الرجاء إرسال اسم مدينة صحيح.',
    prayerTimesFor: 'أوقات الصلاة لـ',
    
    fajr: 'الفجر',
    dhuhr: 'الظهر',
    asr: 'العصر',
    maghrib: 'المغرب',
    isha: 'العشاء',
    
    btnGetTimes: '🕌 احصل على الأوقات لـ',
    btnMyCity: '🏙️ مدينتي',
    btnSetCity: '📍 حدد مدينتي',
    btnChangeCity: '📍 تغيير المدينة',
    btnHelp: '❓ مساعدة',
    btnLanguage: '🌐 اللغة',
    btnTools: '🔧 أدوات',
    btnPrayerTimes: '🕌 أوقات الصلاة',
    btnOtherTools: '🔧 أدوات أخرى',
    btnToHijri: '🔁 إلى الهجري',
    btnBackToMain: '⬅️ العودة للرئيسية',
    btnBackToTools: '⬅️ العودة للأدوات',
    btnBackToPrayerTimes: '⬅️ العودة لأوقات الصلاة',
    btnFeedback: '💬 تعليقات',
    btnReminder: '⏰ تذكير',
    
    selectLanguage: 'اختر لغتك المفضلة:',
    currentLanguage: 'اللغة الحالية',
    languageChanged: 'تم تغيير اللغة إلى',
    
    toolsMenu: '🔧 *الأدوات*\n\nاختر أداة للاستخدام:',
    prayerTimesMenu: '🕌 *أوقات الصلاة*\n\nاختر خياراً:',
    otherToolsMenu: '🔧 *أدوات أخرى*\n\nاختر أداة للاستخدام:',
    selectDateToConvert: '📅 *محول التاريخ إلى الهجري*\n\nيرجى اختيار تاريخ ميلادي لتحويله إلى هجري:',
    dateConverted: '📅 *تحويل التاريخ*\n\n*الميلادي:* {gregorian}\n*الهجري:* {hijri}',
    conversionError: '❌ خطأ في تحويل التاريخ. يرجى المحاولة مرة أخرى.',
    
    btnIslamicMonths: '📅 الأشهر الهجرية',
    islamicMonthsTitle: '📅 *أشهر التقويم الهجري*\n\n',
    islamicMonthsList: 'إليك الـ 12 شهراً من التقويم الهجري:',
    
    btnAgeCalculator: '⏳ العمر بالهجري',
    ageCalculatorPrompt: '⏳ *حاسبة العمر*\n\nيرجى إدخال تاريخ ميلادك بالتنسيق:\n*dd/mm/yyyy*\n\n*مثال:* 15/03/1990',
    ageCalculationError: '❌ خطأ في حساب العمر: {error}',
    ageCalculationResult: '🧾 *حساب العمر*\n\n' +
    '📅 *تاريخ الميلاد:*\n' +
    '   • هجري: {birthHijri}\n' +
    '   • ميلادي: {birthGregorian}\n' +
    '   • يوم الأسبوع: {birthDayOfWeek}\n\n' +
    '⏳ *العمر الحالي:*\n' +
    '   • هجري: {hijriAge}\n' +
    '   • ميلادي: {gregorianAge}',

    years: 'سنوات',
    months: 'أشهر',
    days: 'أيام',
    invalidDateFormat: '❌ تنسيق تاريخ غير صحيح. يرجى استخدام تنسيق dd/mm/yyyy.\n\n*مثال:* 15/03/1990',
    dateInFuture: '❌ لا يمكن أن يكون تاريخ الميلاد في المستقبل. يرجى إدخال تاريخ صحيح من الماضي.',
    invalidDate: '❌ تاريخ غير صحيح. يرجى التحقق من إدخالك والمحاولة مرة أخرى.',
    
    feedbackPrompt: '💬 *إرسال تعليقات مجهولة*\n\nيرجى مشاركة تعليقاتك أو اقتراحاتك أو الإبلاغ عن أي مشاكل. سيتم إرسال رسالتك إلى فريقنا بشكل مجهول.\n\n*ملاحظة:* هويتك ستبقى مجهولة تماماً.',
    feedbackSent: '✅ *تم إرسال التعليقات!*\n\nشكراً لك على تعليقاتك. نقدر مدخلاتك وسنراجعها قريباً.',
    feedbackError: '❌ *خطأ في إرسال التعليقات*\n\nعذراً، حدث خطأ في إرسال تعليقاتك. يرجى المحاولة مرة أخرى لاحقاً.',
    feedbackCancel: '❌ *تم إلغاء التعليقات*\n\nيمكنك إرسال تعليقات في أي وقت باستخدام زر التعليقات.',
    
    reminderMenu: '⏰ *تذكير الصلاة اليومي*\n\nاحصل على أوقات الصلاة اليومية في وقت الفجر.\n\n*الحالة الحالية:*',
    reminderEnabled: '✅ *تم تفعيل التذكير*\n\nستتلقى أوقات الصلاة اليومية في وقت الفجر لمدينتك المحفوظة.',
    reminderDisabled: '❌ *تم إلغاء التذكير*\n\nتم إيقاف تذكيرات الصلاة اليومية.',
    reminderError: '❌ *خطأ*\n\nعذراً، حدث خطأ في تحديث إعدادات التذكير.',
    reminderNoCity: '❌ *لم يتم حفظ أي مدينة*\n\nيرجى حفظ مدينة أولاً لتفعيل التذكيرات اليومية.',
    btnEnableReminder: '✅ تفعيل التذكير',
    btnDisableReminder: '❌ إلغاء التذكير',
    dailyReminder: 'أوقات الصلاة اليومية',
    
    btnNearbyMasjids: '🕌 المساجد القريبة',
    nearbyMasjidsPrompt: '🕌 *المساجد القريبة*\n\nيرجى مشاركة موقعك للعثور على المساجد القريبة.\n\n*كيفية مشاركة الموقع:*\n• اضغط على زر المرفقات 📎\n• اختر "الموقع"\n• اختر "إرسال موقعي الحالي"',
    nearbyMasjidsUnderDevelopment: '🕌 *المساجد القريبة*\n\n🚧 *هذه الميزة قيد التطوير*\n\nنعمل على إحضار قائمة شاملة بالمساجد القريبة تتضمن:\n• أوقات الصلاة\n• معلومات الاتصال\n• الاتجاهات\n• المراجعات والتقييمات\n\n*قريباً!* ترقبوا التحديثات.',
    nearbyMasjidsFound: '🕌 *تم العثور على مساجد قريبة*\n\nانقر على الزر أدناه لعرض المساجد القريبة في خرائط جوجل:',
    clickToViewMasjids: '📍 *انقر لعرض المساجد القريبة*',
    viewNearbyMasjids: '🕌 عرض المساجد القريبة',
    invalidLocation: '❌ *موقع غير صحيح*\n\nيرجى مشاركة موقع صحيح للعثور على المساجد القريبة.',
    masjidsSearchError: '❌ *خطأ في البحث*\n\nعذراً، حدث خطأ في البحث عن المساجد القريبة. يرجى المحاولة مرة أخرى لاحقاً.',
    pleaseShareLocation: '❌ *يرجى مشاركة الموقع*\n\nللعثور على المساجد القريبة، يرجى مشاركة موقعك باستخدام زر المرفقات 📎.',
    locationReceived: '📍 *تم استلام الموقع*\n\nاستخدم ميزة المساجد القريبة للعثور على المساجد بالقرب منك.',
    
    btnRamadanCountdown: '🌙 العد التنازلي لرمضان',
    ramadanCountdown: '🌙 *العد التنازلي لرمضان*\n\n{dots}\n\n*{days} أيام* متبقية حتى رمضان\n\n*رمضان القادم:* {date}',
    ramadanToday: '🌙 *رمضان يبدأ اليوم!*\n\n🎉 *رمضان مبارك!*\n\nليجلب لك هذا الشهر المبارك السلام والسعادة والنمو الروحي.',
    ramadanStarted: '🌙 *رمضان هنا!*\n\n🎉 *رمضان مبارك!*\n\nتقبل الله صيامكم وصلاتكم.',
    ramadanCountdownError: '❌ *خطأ*\n\nعذراً، حدث خطأ في حساب العد التنازلي لرمضان. يرجى المحاولة مرة أخرى لاحقاً.'
  }
};

function t(key, language = 'en') {
  return translations[language][key] || translations.en[key] || key;
}

module.exports = {
  translations,
  t,
};
