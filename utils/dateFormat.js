// Helper functions to get the day suffix (e.g., "st", "nd", "rd", "th")
function getOrdinal(n) {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

function getDaySuffix(day) {
  if (day >= 11 && day <= 13) {
    return 'th';
  }
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

export function getShortMonth(dayDate) {
  const parts = dayDate.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Months are 0-based in JavaScript
    const day = parseInt(parts[2], 10);

    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      const date = new Date(year, month, day);
      const formattedMonth = date.toLocaleString('default', {month: 'short'});
      return `${formattedMonth}`;
    }
  }
  return 'Invalid Date';
}

export function getDayAndMonth(dayDate) {
  const parts = dayDate.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Months are 0-based in JavaScript
    const day = parseInt(parts[2], 10);

    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      const date = new Date(year, month, day);
      const formattedDay = getOrdinal(day);
      const formattedMonth = date.toLocaleString('default', {month: 'short'});
      return `${formattedDay} ${formattedMonth}`;
    }
  }
  return 'Invalid Date';
}

export function getLongDate(dayDate) {
  const parts = dayDate.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Months are 0-based in JavaScript
    const day = parseInt(parts[2], 10);

    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      const date = new Date(year, month, day);
      const formattedDay = getOrdinal(day);
      const formattedMonth = date.toLocaleString('default', {month: 'long'});
      const formattedYear = year.toString();
      return `${formattedDay} ${formattedMonth} ${formattedYear}`;
    }
  }
  return 'Invalid Date';
}

export function getShortDate(dayDate) {
  const parts = dayDate.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Months are 0-based in JavaScript
    const day = parseInt(parts[2], 10);

    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      const date = new Date(year, month, day);
      const formattedDay = day.toString().padStart(2, '0');
      const formattedMonth = date.toLocaleString('default', {month: 'short'}); // Abbreviated month
      const formattedYear = year.toString();
      return `${formattedDay} ${formattedMonth} ${formattedYear}`;
    }
  }
  return 'Invalid Date';
}

export function getNumericDate(dayDate) {
  const parts = dayDate.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10); // Month in input is already 1-based
    const day = parseInt(parts[2], 10);

    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      // Format each part to always have two digits
      const formattedDay = day.toString().padStart(2, '0');
      const formattedMonth = month.toString().padStart(2, '0');
      const formattedYear = year.toString();
      return `${formattedDay}-${formattedMonth}-${formattedYear}`;
    }
  }
  return 'Invalid Date';
}

export function getNumericDay(dayDate) {
  const parts = dayDate.split('-');
  if (parts.length === 3) {
    const day = parseInt(parts[2], 10);

    if (!isNaN(day)) {
      // Format each part to always have two digits
      const formattedDay = day.toString().padStart(2, '0');
      return `${formattedDay}`;
    }
  }
  return 'Invalid Date';
}

export function getFullTextDate(dayDate) {
  const parts = dayDate.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Months are 0-based in JavaScript
    const day = parseInt(parts[2], 10);

    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      const date = new Date(year, month, day);
      const formattedDayName = date.toLocaleString('default', {
        weekday: 'long',
      }); // Full day name
      const formattedMonth = date.toLocaleString('default', {month: 'long'}); // Full month name
      const formattedDay = getOrdinal(day); // Get ordinal day (e.g., 10th)
      const formattedYear = year.toString();
      return `${formattedDayName}, ${formattedMonth} ${formattedDay} ${formattedYear}`;
    }
  }
  return 'Invalid Date';
}

export function formatMonthToMonthName(month) {
  const [year, monthNumber] = month.split('-');
  const date = new Date(year, monthNumber - 1, 1); // Month number is 0-based
  return date.toLocaleString('default', {month: 'long'});
}

export function getOrdinalDateAndTime(dateTime) {
  const date = new Date(dateTime);
  const options = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

  const day = date.getDate();
  const month = date.toLocaleString('default', {month: 'short'});
  const year = date.getFullYear();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const ampm = hour >= 12 ? 'pm' : 'am';

  const formattedTime = `${hour % 12 || 12}:${String(minute).padStart(
    2,
    '0',
  )}${ampm}`;

  return `${day}${getDaySuffix(day)} ${month} ${year} | ${formattedTime}`;
}

export function getTimeInAmPm(timeString) {
  const [hours, minutes] = timeString.split(':');

  const hour = parseInt(hours, 10); // Convert to an integer
  const minute = parseInt(minutes, 10); // Convert to an integer
  const ampm = hour >= 12 ? 'pm' : 'am';

  const formattedTime = `${hour % 12 || 12}:${String(minute).padStart(
    2,
    '0',
  )}${ampm}`;

  return formattedTime;
}

export function calculateAge(dob) {
  const currentDate = new Date();
  const birthDate = new Date(dob);

  let age = currentDate.getFullYear() - birthDate.getFullYear();

  // Adjust age if the birthday hasn't occurred yet this year
  if (
    currentDate.getMonth() < birthDate.getMonth() ||
    (currentDate.getMonth() === birthDate.getMonth() &&
      currentDate.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

export function getToday() {
  const today = new Date().toISOString().split('T')[0];
  return today;
}
