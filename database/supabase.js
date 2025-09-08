const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

// Initialize Supabase client
const supabase = createClient(
  config.database.supabaseUrl,
  config.database.supabaseAnonKey
);

async function getUserData(userId) {
  try {
    if (!config.database.supabaseUrl || !config.database.supabaseAnonKey) {
      console.log('Supabase not configured, using session fallback');
      return null;
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error getting user data from Supabase:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error getting user data from Supabase:', error);
    return null;
  }
}

async function saveUserData(userId, data) {
  try {
    if (!config.database.supabaseUrl || !config.database.supabaseAnonKey) {
      console.log('Supabase not configured, using session fallback');
      return false;
    }
    
    const { error } = await supabase
      .from('users')
      .upsert({
        user_id: userId,
        saved_city: data.saved_city,
        language: data.language,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });
    
    if (error) {
      console.error('Error saving user data to Supabase:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error saving user data to Supabase:', error);
    return false;
  }
}

async function getUserCity(userId) {
  const userData = await getUserData(userId);
  return userData ? userData.saved_city : null;
}

async function saveUserCity(userId, city) {
  const userData = await getUserData(userId) || { saved_city: null, language: 'en' };
  userData.saved_city = city;
  return await saveUserData(userId, userData);
}

async function getUserLanguage(userId) {
  const userData = await getUserData(userId);
  return userData ? userData.language : 'en';
}

async function saveUserLanguage(userId, language) {
  const userData = await getUserData(userId) || { saved_city: null, language: 'en' };
  userData.language = language;
  return await saveUserData(userId, userData);
}

module.exports = {
  getUserData,
  saveUserData,
  getUserCity,
  saveUserCity,
  getUserLanguage,
  saveUserLanguage,
};
