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
    
    // Check every 30 minutes for users who need reminders
    this.intervalId = setInterval(() => {
      this.checkAndSendReminders();
    }, 30 * 60 * 1000); // 30 minutes

    // Also check immediately on startup
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
      console.log('Checking for users who need prayer time reminders...');
      
      const users = await getAllUsersWithReminders();
      console.log(`Found ${users.length} users with reminders enabled`);

      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      
      // Only send reminders around Fajr time (4-6 AM)
      if (currentHour < 4 || currentHour > 6) {
        console.log(`Current time ${currentHour}:${currentMinute} is not Fajr time, skipping reminders`);
        return;
      }

      for (const user of users) {
        await this.sendReminderToUser(user);
      }
    } catch (error) {
      console.error('Error checking reminders:', error);
    }
  }

  async sendReminderToUser(user) {
    try {
      const { user_id, saved_city, language } = user;
      
      // Get current prayer times for the user's city
      const prayerTimes = await fetchPrayerTimes(saved_city);
      
      if (!prayerTimes || !prayerTimes.success) {
        console.error(`Failed to get prayer times for user ${user_id} in city ${saved_city}`);
        return;
      }

      // Format the prayer times message
      const message = formatPrayerTimes(prayerTimes.data, saved_city, language);
      
      // Add reminder header
      const reminderMessage = `⏰ *${t('dailyReminder', language)}*\n\n${message}`;
      
      // Send the reminder
      await this.bot.telegram.sendMessage(user_id, reminderMessage, { parse_mode: 'Markdown' });
      
      console.log(`Sent prayer time reminder to user ${user_id} for city ${saved_city}`);
      
    } catch (error) {
      console.error(`Error sending reminder to user ${user.user_id}:`, error);
    }
  }

  // Method to manually trigger reminders (useful for testing)
  async triggerReminders() {
    console.log('Manually triggering reminders...');
    await this.checkAndSendReminders();
  }
}

module.exports = ReminderService;
