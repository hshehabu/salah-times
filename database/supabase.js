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
        reminder_enabled: data.reminder_enabled || false,
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

async function getUserReminder(userId) {
  const userData = await getUserData(userId);
  return userData ? userData.reminder_enabled : false;
}

async function saveUserReminder(userId, enabled) {
  const userData = await getUserData(userId) || { saved_city: null, language: 'en', reminder_enabled: false };
  userData.reminder_enabled = enabled;
  return await saveUserData(userId, userData);
}

async function getAllUsersWithReminders() {
  try {
    if (!config.database.supabaseUrl || !config.database.supabaseAnonKey) {
      console.log('Supabase not configured');
      return [];
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('user_id, saved_city, language')
      .eq('reminder_enabled', true)
      .not('saved_city', 'is', null);
    
    if (error) {
      console.error('Error getting users with reminders:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error getting users with reminders:', error);
    return [];
  }
}

// Quran Scheduler Functions
async function getUserQuranSchedule(userId) {
  try {
    const userData = await getUserData(userId);
    if (!userData) return null;
    
    return userData.quran_schedule ? JSON.parse(userData.quran_schedule) : null;
  } catch (error) {
    console.error('Error getting Quran schedule:', error);
    return null;
  }
}

async function saveUserQuranSchedule(userId, scheduleData) {
  try {
    if (!config.database.supabaseUrl || !config.database.supabaseAnonKey) {
      console.log('Supabase not configured, using session fallback');
      return false;
    }
    
    const userData = await getUserData(userId) || { saved_city: null, language: 'en', reminder_enabled: false };
    
    const { error } = await supabase
      .from('users')
      .upsert({
        user_id: userId,
        saved_city: userData.saved_city,
        language: userData.language || 'en',
        reminder_enabled: userData.reminder_enabled || false,
        quran_schedule: JSON.stringify(scheduleData),
        quran_reminder_enabled: scheduleData.reminderEnabled || false,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });
    
    if (error) {
      console.error('Error saving Quran schedule to Supabase:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error saving Quran schedule to Supabase:', error);
    return false;
  }
}

async function getUserQuranReminder(userId) {
  try {
    const userData = await getUserData(userId);
    return userData ? (userData.quran_reminder_enabled || false) : false;
  } catch (error) {
    console.error('Error getting Quran reminder:', error);
    return false;
  }
}

async function saveUserQuranReminder(userId, enabled) {
  try {
    if (!config.database.supabaseUrl || !config.database.supabaseAnonKey) {
      console.log('Supabase not configured, using session fallback');
      return false;
    }
    
    const userData = await getUserData(userId) || { saved_city: null, language: 'en' };
    
    const { error } = await supabase
      .from('users')
      .upsert({
        user_id: userId,
        saved_city: userData.saved_city,
        language: userData.language,
        reminder_enabled: userData.reminder_enabled || false,
        quran_reminder_enabled: enabled,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });
    
    if (error) {
      console.error('Error saving Quran reminder to Supabase:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error saving Quran reminder to Supabase:', error);
    return false;
  }
}

async function updateQuranScheduleProgress(userId, sessionIndex, completed) {
  try {
    const schedule = await getUserQuranSchedule(userId);
    if (!schedule || !schedule.schedule) return false;
    
    if (!schedule.progress) {
      schedule.progress = {};
    }
    
    schedule.progress[sessionIndex] = completed;
    schedule.progress[sessionIndex + '_date'] = completed ? new Date().toISOString() : null;
    
    return await saveUserQuranSchedule(userId, schedule);
  } catch (error) {
    console.error('Error updating Quran schedule progress:', error);
    return false;
  }
}

async function pauseQuranSchedule(userId) {
  try {
    const schedule = await getUserQuranSchedule(userId);
    if (!schedule) return false;
    
    schedule.paused = true;
    schedule.paused_at = new Date().toISOString();
    
    return await saveUserQuranSchedule(userId, schedule);
  } catch (error) {
    console.error('Error pausing Quran schedule:', error);
    return false;
  }
}

async function resumeQuranSchedule(userId) {
  try {
    const schedule = await getUserQuranSchedule(userId);
    if (!schedule) return false;
    
    schedule.paused = false;
    schedule.resumed_at = new Date().toISOString();
    
    return await saveUserQuranSchedule(userId, schedule);
  } catch (error) {
    console.error('Error resuming Quran schedule:', error);
    return false;
  }
}

async function getAllUsersWithQuranReminders() {
  try {
    if (!config.database.supabaseUrl || !config.database.supabaseAnonKey) {
      console.log('Supabase not configured');
      return [];
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('user_id, language, quran_schedule')
      .eq('quran_reminder_enabled', true)
      .not('quran_schedule', 'is', null);
    
    if (error) {
      console.error('Error getting users with Quran reminders:', error);
      return [];
    }
    
    return (data || []).map(user => ({
      user_id: user.user_id,
      language: user.language,
      schedule: user.quran_schedule ? JSON.parse(user.quran_schedule) : null
    }));
  } catch (error) {
    console.error('Error getting users with Quran reminders:', error);
    return [];
  }
}

module.exports = {
  getUserData,
  saveUserData,
  getUserCity,
  saveUserCity,
  getUserLanguage,
  saveUserLanguage,
  getUserReminder,
  saveUserReminder,
  getAllUsersWithReminders,
  getUserQuranSchedule,
  saveUserQuranSchedule,
  getUserQuranReminder,
  saveUserQuranReminder,
  updateQuranScheduleProgress,
  pauseQuranSchedule,
  resumeQuranSchedule,
  getAllUsersWithQuranReminders,
};
