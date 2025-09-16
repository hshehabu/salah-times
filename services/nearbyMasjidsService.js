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
 * Create single masjid search link
 * @param {number} latitude - User's latitude
 * @param {number} longitude - User's longitude
 * @param {string} language - Language code
 * @returns {Object} Single masjid search link with label and URL
 */
function createMasjidSearchLink(latitude, longitude, language = 'en') {
  const url = generateGoogleMapsUrl(latitude, longitude);
  
  return {
    label: t('viewNearbyMasjids', language) || '🕌 View Nearby Masjids',
    url: url
  };
}

/**
 * Main function to find nearby masjids using Google Maps links
 * @param {number} latitude - User's latitude
 * @param {number} longitude - User's longitude
 * @param {string} language - Language code
 * @returns {Object} Result object with success status, message, and masjid search link
 */
async function findNearbyMasjids(latitude, longitude, language = 'en') {
  try {
    if (!latitude || !longitude || 
        latitude < -90 || latitude > 90 || 
        longitude < -180 || longitude > 180) {
      return {
        success: false,
        message: t('invalidLocation', language)
      };
    }

    const masjidLink = createMasjidSearchLink(latitude, longitude, language);
    
    const message = t('nearbyMasjidsFound', language) + '\n\n' +
                   t('clickToViewMasjids', language);

    return {
      success: true,
      message: message,
      masjidLink: masjidLink
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
  createMasjidSearchLink
};