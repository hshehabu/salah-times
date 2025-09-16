const { getAllUsersWithReminders } = require('../database/supabase');
const { fetchPrayerTimes, formatPrayerTimes } = require('./prayerTimesService');
const { t } = require('../translations');

class ReminderService {
  constructor(bot) {
    this.bot = bot;
    this.isRunning = false;
    this.intervalId = null;
  }

  start() {
    if (this.isRunning) {
      console.log('Reminder service is already running');
      return;
    }

    console.log('Starting reminder service...');
    this.isRunning = true;
    
    this.intervalId = setInterval(() => {
      this.checkAndSendReminders();
    }, 30 * 60 * 1000);

    this.checkAndSendReminders();
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('Reminder service stopped');
  }

  async checkAndSendReminders() {
    try {
      const users = await getAllUsersWithReminders();
      
      if (users.length === 0) {
        return;
      }

      const now = new Date();
      const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
      
      let shouldSendReminders = false;
      
      for (const user of users) {
        try {
          const prayerTimes = await fetchPrayerTimes(user.saved_city);
          if (prayerTimes && prayerTimes.data && prayerTimes.data.timings) {
            const fajrTime = prayerTimes.data.timings.Fajr;
            if (fajrTime === currentTime) {
              shouldSendReminders = true;
              break;
            }
          }
        } catch (error) {
          console.error(`Error checking Fajr time for user ${user.user_id}:`, error);
        }
      }

      if (!shouldSendReminders) {
        return;
      }

      console.log(`🌅 Fajr time detected (${currentTime}) - Sending reminders to all users...`);
      
      await Promise.all(users.map(user => this.sendReminderToUser(user)));
      
      console.log(`✅ Completed sending reminders to ${users.length} users`);
      
    } catch (error) {
      console.error('❌ Error in reminder service:', error);
    }
  }

  async sendReminderToUser(user) {
    try {
      const { user_id, saved_city, language } = user;
      
      const prayerTimes = await fetchPrayerTimes(saved_city);
      
      if (!prayerTimes || !prayerTimes.data || !prayerTimes.data.timings) {
        console.error(`❌ Failed to get prayer times for user ${user_id} in city ${saved_city}`);
        return;
      }

      const message = formatPrayerTimes(prayerTimes, language);
      
      const reminderMessage = `⏰ *${t('dailyReminder', language)}*\n\n${message}`;
      
      await this.bot.telegram.sendMessage(user_id, reminderMessage, { parse_mode: 'Markdown' });
      
      console.log(`✅ Sent reminder to user ${user_id} (${saved_city})`);
      
    } catch (error) {
      console.error(`❌ Error sending reminder to user ${user.user_id}:`, error);
    }
  }

  async triggerReminders() {
    console.log('🔔 Manually triggering reminders...');
    await this.checkAndSendReminders();
  }
}

module.exports = ReminderService;
