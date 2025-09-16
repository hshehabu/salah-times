const { t } = require('../translations');

/**
 * Generate Google Maps search URL for masjids
 * @param {number} latitude - User's latitude
 * @param {number} longitude - User's longitude
 * @returns {string} Google Maps search URL
 */
function generateGoogleMapsUrl(latitude, longitude) {
  return `https://www.google.com/maps/search/masjid/@${latitude},${longitude},15z`;
}

/**
 * Generate Google Maps search URL for specific masjid types
 * @param {number} latitude - User's latitude
 * @param {number} longitude - User's longitude
 * @param {string} searchTerm - Specific search term (e.g., "mosque", "islamic center")
 * @returns {string} Google Maps search URL
 */
function generateSpecificMapsUrl(latitude, longitude, searchTerm) {
  const encodedTerm = encodeURIComponent(searchTerm);
  return `https://www.google.com/maps/search/${encodedTerm}/@${latitude},${longitude},15z`;
}

/**
 * Create top 5 masjid search options from single masjid search
 * @param {number} latitude - User's latitude
 * @param {number} longitude - User's longitude
 * @param {string} language - Language code
 * @returns {Array} Array of top 5 masjid search options
 */
function createTop5MasjidOptions(latitude, longitude, language = 'en') {
  const baseUrl = generateGoogleMapsUrl(latitude, longitude);
  
  const searchOptions = [
    {
      label: t('masjid1', language) || '🕌 Masjid 1',
      url: baseUrl
    },
    {
      label: t('masjid2', language) || '🕌 Masjid 2',
      url: baseUrl
    },
    {
      label: t('masjid3', language) || '🕌 Masjid 3',
      url: baseUrl
    },
    {
      label: t('masjid4', language) || '🕌 Masjid 4',
      url: baseUrl
    },
    {
      label: t('masjid5', language) || '🕌 Masjid 5',
      url: baseUrl
    }
  ];

  return searchOptions;
}

/**
 * Main function to find nearby masjids using Google Maps links
 * @param {number} latitude - User's latitude
 * @param {number} longitude - User's longitude
 * @param {string} language - Language code
 * @returns {Object} Result object with success status, message, and top 5 masjid options
 */
async function findNearbyMasjids(latitude, longitude, language = 'en') {
  try {
    // Validate coordinates
    if (!latitude || !longitude || 
        latitude < -90 || latitude > 90 || 
        longitude < -180 || longitude > 180) {
      return {
        success: false,
        message: t('invalidLocation', language)
      };
    }

    // Create top 5 masjid search options
    const masjidOptions = createTop5MasjidOptions(latitude, longitude, language);
    
    // Create the main message
    const message = t('nearbyMasjidsFound', language) + '\n\n' +
                   t('top5Masjids', language);

    return {
      success: true,
      message: message,
      masjidOptions: masjidOptions,
      mainUrl: generateGoogleMapsUrl(latitude, longitude)
    };

  } catch (error) {
    console.error('Error finding nearby masjids:', error);
    return {
      success: false,
      message: t('masjidsSearchError', language)
    };
  }
}

module.exports = {
  findNearbyMasjids,
  generateGoogleMapsUrl,
  generateSpecificMapsUrl,
  createTop5MasjidOptions
};