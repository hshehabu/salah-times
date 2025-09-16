const { t } = require('../translations');
const config = require('../config');

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Check if a place name contains masjid-related keywords
 * @param {string} name - Place name to check
 * @returns {boolean} True if it's likely a masjid
 */
function isMasjid(name) {
  if (!name) return false;
  
  const masjidKeywords = [
    // English
    'mosque', 'masjid', 'islamic center', 'islamic centre',
    'jamia', 'jama', 'jami', 'islamic society', 'islamic association',
    
    // Arabic
    'مسجد', 'جامع', 'جامعة', 'مصلى', 'مساجد',
    
    // Amharic
    'መስጂድ', 'መስጊድ', 'መስጊድ', 'መስጂድ',
    
    // Other common variations
    'masjid', 'masjid', 'masjid', 'masjid'
  ];
  
  const lowerName = name.toLowerCase();
  return masjidKeywords.some(keyword => lowerName.includes(keyword.toLowerCase()));
}

/**
 * Search for nearby places using Google Places API
 * @param {number} latitude - User's latitude
 * @param {number} longitude - User's longitude
 * @param {number} radiusMeters - Search radius in meters
 * @returns {Array} Array of nearby masjids
 */
async function searchNearbyPlaces(latitude, longitude, radiusMeters = 3000) {
  try {
    if (!config.googlePlaces.apiKey) {
      throw new Error('Google Places API key not configured');
    }

    // Search for places of worship first
    const placesOfWorshipUrl = `${config.googlePlaces.baseUrl}/nearbysearch/json?` +
      `location=${latitude},${longitude}&` +
      `radius=${radiusMeters}&` +
      `type=place_of_worship&` +
      `key=${config.googlePlaces.apiKey}`;

    const response = await fetch(placesOfWorshipUrl);
    
    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Places API error: ${data.status}`);
    }

    if (!data.results || data.results.length === 0) {
      return [];
    }

    // Filter results to only include masjids
    const masjids = data.results.filter(place => {
      const name = place.name || '';
      const types = place.types || [];
      
      // Check if it's a mosque/masjid by name or type
      return isMasjid(name) || 
             types.includes('mosque') || 
             types.includes('place_of_worship');
    });

    // Get detailed information for each masjid
    const detailedMasjids = await Promise.all(
      masjids.map(async (place) => {
        try {
          // Get place details
          const detailsUrl = `${config.googlePlaces.baseUrl}/details/json?` +
            `place_id=${place.place_id}&` +
            `fields=name,formatted_address,formatted_phone_number,geometry&` +
            `key=${config.googlePlaces.apiKey}`;

          const detailsResponse = await fetch(detailsUrl);
          const detailsData = await detailsResponse.json();

          if (detailsData.status === 'OK' && detailsData.result) {
            const result = detailsData.result;
            const placeLat = result.geometry?.location?.lat;
            const placeLng = result.geometry?.location?.lng;
            
            return {
              name: result.name || place.name,
              address: result.formatted_address || 'Address not available',
              latitude: placeLat,
              longitude: placeLng,
              phone: result.formatted_phone_number || 'Phone not available',
              distance: calculateDistance(latitude, longitude, placeLat, placeLng),
              placeId: place.place_id,
              rating: place.rating || null,
              priceLevel: place.price_level || null
            };
          }
        } catch (error) {
          console.error(`Error getting details for place ${place.place_id}:`, error);
        }

        // Fallback to basic place info
        return {
          name: place.name,
          address: place.vicinity || 'Address not available',
          latitude: place.geometry?.location?.lat,
          longitude: place.geometry?.location?.lng,
          phone: 'Phone not available',
          distance: calculateDistance(
            latitude, 
            longitude, 
            place.geometry?.location?.lat, 
            place.geometry?.location?.lng
          ),
          placeId: place.place_id,
          rating: place.rating || null,
          priceLevel: place.price_level || null
        };
      })
    );

    // Sort by distance and return
    return detailedMasjids
      .filter(masjid => masjid.distance <= (radiusMeters / 1000)) // Convert to km
      .sort((a, b) => a.distance - b.distance);

  } catch (error) {
    console.error('Error searching nearby places:', error);
    throw error;
  }
}

/**
 * Format masjid information for display
 * @param {Object} masjid - Masjid object
 * @param {string} language - Language code
 * @returns {string} Formatted masjid info
 */
function formatMasjidInfo(masjid, language = 'en') {
  const distance = masjid.distance < 1 
    ? `${Math.round(masjid.distance * 1000)}m`
    : `${masjid.distance.toFixed(1)}km`;

  let info = `🕌 *${masjid.name}*\n` +
             `📍 ${masjid.address}\n` +
             `📏 ${distance} away\n`;

  // Add phone if available
  if (masjid.phone && masjid.phone !== 'Phone not available') {
    info += `📞 ${masjid.phone}\n`;
  }

  // Add rating if available
  if (masjid.rating) {
    const stars = '⭐'.repeat(Math.round(masjid.rating));
    info += `${stars} ${masjid.rating.toFixed(1)}/5.0\n`;
  }

  return info;
}

/**
 * Format nearby masjids list for display
 * @param {Array} masjids - Array of nearby masjids
 * @param {string} language - Language code
 * @returns {string} Formatted message
 */
function formatNearbyMasjids(masjids, language = 'en') {
  if (masjids.length === 0) {
    return t('noMasjidsFound', language);
  }

  let message = t('nearbyMasjidsFound', language).replace('{count}', masjids.length);
  message += '\n\n';

  masjids.forEach((masjid, index) => {
    message += `${index + 1}. ${formatMasjidInfo(masjid, language)}\n`;
  });

  return message;
}

/**
 * Main function to find and format nearby masjids
 * @param {number} latitude - User's latitude
 * @param {number} longitude - User's longitude
 * @param {string} language - Language code
 * @returns {Object} Result object with success status and message
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

    // Check if Google Places API is configured
    if (!config.googlePlaces.apiKey) {
      return {
        success: false,
        message: t('apiNotConfigured', language) || 'Google Places API is not configured. Please contact support.'
      };
    }

    // Search for nearby masjids using Google Places API
    const nearbyMasjids = await searchNearbyPlaces(latitude, longitude, config.googlePlaces.searchRadius);
    
    // Format the results
    const message = formatNearbyMasjids(nearbyMasjids, language);
    
    return {
      success: true,
      message: message,
      masjids: nearbyMasjids
    };

  } catch (error) {
    console.error('Error finding nearby masjids:', error);
    
    // Handle specific API errors
    if (error.message.includes('API key not configured')) {
      return {
        success: false,
        message: t('apiNotConfigured', language) || 'Google Places API is not configured. Please contact support.'
      };
    }
    
    if (error.message.includes('Google Places API error')) {
      return {
        success: false,
        message: t('apiError', language) || 'Error accessing Google Places API. Please try again later.'
      };
    }
    
    return {
      success: false,
      message: t('masjidsSearchError', language)
    };
  }
}

module.exports = {
  findNearbyMasjids,
  calculateDistance,
  isMasjid,
  formatMasjidInfo
};
