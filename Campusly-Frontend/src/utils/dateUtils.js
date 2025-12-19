export const parseEventDate = (dateInput, timeInput = null) => {
  try {
    if (!dateInput) {
      return null;
    }

    let eventDate;
    if (dateInput instanceof Date) {
      eventDate = new Date(dateInput);
    } else if (typeof dateInput === 'string') {
      eventDate = new Date(dateInput);
    } else {
      console.warn('Invalid date input type:', typeof dateInput, dateInput);
      return null;
    }

    if (isNaN(eventDate.getTime())) {
      console.warn('Invalid date parsed:', dateInput);
      return null;
    }

    if (timeInput && typeof timeInput === 'string' && timeInput.includes(':')) {
      const [hours, minutes] = timeInput.split(':');
      eventDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    }
    return eventDate;
  } catch (error) {
    console.error('Error parsing event date:', error, { dateInput, timeInput });
    return null;
  }
};

export const getEventStatus = (event) => {
  try {
    const eventDate = parseEventDate(event.Date, event.Time);
    
    if (!eventDate) {
      console.warn('Could not parse date for event:', event.ID, event.Date);
      return 'upcoming'; 
    }

    const now = new Date();
    const diffMs = now - eventDate;
    const diffHours = diffMs / (1000 * 60 * 60);

    // If event is in the future
    if (diffMs < 0) {
      return 'upcoming';
    }

    // If event started within the last 24 hours, consider it 'ongoing'
    if (diffHours >= 0 && diffHours <= 24) {
      return 'ongoing';
    }

    // Otherwise, it's completed
    return 'completed';
  } catch (error) {
    console.error('Error determining event status:', error, event);
    return 'upcoming'; 
  }
};

export const formatEventDate = (dateInput, options = {}) => {
  try {
    const eventDate = parseEventDate(dateInput);
    
    if (!eventDate) {
      return 'Invalid Date';
    }

    const defaultOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    };

    return eventDate.toLocaleDateString(undefined, { ...defaultOptions, ...options });
  } catch (error) {
    console.error('Error formatting event date:', error, dateInput);
    return 'Invalid Date';
  }
};

export const isSameDay = (date1, date2) => {
  try {
    if (!date1 || !date2) return false;
    
    const d1 = date1 instanceof Date ? date1 : new Date(date1);
    const d2 = date2 instanceof Date ? date2 : new Date(date2);
    
    return d1.toDateString() === d2.toDateString();
  } catch (error) {
    console.error('Error comparing dates:', error, { date1, date2 });
    return false;
  }
};
