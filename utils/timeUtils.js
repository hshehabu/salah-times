function convertTo12Hour(timeInput, timezone = null) {
  if (!timeInput || typeof timeInput !== 'string') return timeInput;
  
  try {
    if (timeInput.includes('T') || timeInput.includes('Z')) {
      const date = new Date(timeInput);
      if (!isNaN(date.getTime())) {
        const options = { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true,
          timeZone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        return date.toLocaleTimeString('en-US', options);
      }
    }
    
    const [hours, minutes] = timeInput.split(':');
    const hour = parseInt(hours, 10);
    const minute = minutes || '00';
    
    if (hour === 0) {
      return `12:${minute} AM`;
    } else if (hour < 12) {
      return `${hour}:${minute} AM`;
    } else if (hour === 12) {
      return `12:${minute} PM`;
    } else {
      return `${hour - 12}:${minute} PM`;
    }
  } catch (error) {
    console.log('Time conversion error:', error);
    return timeInput;
  }
}

module.exports = {
  convertTo12Hour,
};
