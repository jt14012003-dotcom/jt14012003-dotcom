const timezones = {
  'clock-ny': 'America/New_York',
  'clock-london': 'Europe/London',
  'clock-tokyo': 'Asia/Tokyo',
  'clock-sydney': 'Australia/Sydney',
  'clock-dubai': 'Asia/Dubai',
  'clock-la': 'America/Los_Angeles'
};

let is24Hour = true;
let isAnimated = false;

function formatTime(date, format24 = true) {
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  if (!format24) {
    hours = hours % 12 || 12;
  }
  hours = String(hours).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function updateClocks() {
  Object.entries(timezones).forEach(([elementId, timezone]) => {
    const element = document.getElementById(elementId);
    if (element) {
      const date = new Date();
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: !is24Hour
      });
      element.textContent = formatter.format(date);
    }
  });
}

function toggleFormat() {
  is24Hour = !is24Hour;
  document.getElementById('toggleFormat').textContent = is24Hour ? '24-Hour Format' : '12-Hour Format';
  updateClocks();
}

function toggleAnimation() {
  isAnimated = !isAnimated;
  document.querySelectorAll('.clock-card').forEach(card => {
    if (isAnimated) {
      card.classList.add('animated');
    } else {
      card.classList.remove('animated');
    }
  });
  document.getElementById('toggleAnimated').textContent = isAnimated ? 'Disable Animation' : 'Enable Animation';
}

document.getElementById('toggleFormat').addEventListener('click', toggleFormat);
document.getElementById('toggleAnimated').addEventListener('click', toggleAnimation);

// Set footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Initial update and set interval
updateClocks();
setInterval(updateClocks, 1000);
