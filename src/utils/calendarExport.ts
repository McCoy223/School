import { SchoolEvent } from '../types';

/**
 * Generates an iCalendar (.ics) format string for a school event
 * and triggers a browser download.
 */
export function exportEventToICS(event: SchoolEvent) {
  // Parse date and time into YYYYMMDDTHHMMSSZ format
  // Example event.date: "2026-10-24"
  const dateClean = event.date.replace(/-/g, '');
  
  // Format times (default to 09:00 - 10:00 if format parsing varies)
  let startTime = '090000';
  let endTime = '110000';

  if (event.time.includes('-')) {
    const parts = event.time.split('-').map(p => p.trim());
    if (parts[0]) {
      const match = parts[0].match(/(\d{1,2}):(\d{2})/);
      if (match) {
        startTime = `${match[1].padStart(2, '0')}${match[2]}00`;
      }
    }
    if (parts[1]) {
      const match = parts[1].match(/(\d{1,2}):(\d{2})/);
      if (match) {
        endTime = `${match[1].padStart(2, '0')}${match[2]}00`;
      }
    }
  }

  const dtStart = `${dateClean}T${startTime}`;
  const dtEnd = `${dateClean}T${endTime}`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//St. Andrews Academy//School Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.id}-${Date.now()}@standrewsacademy.org`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeICS(event.title)}`,
    `DESCRIPTION:${escapeICS(event.description + ' (Organizer: ' + event.organizer + ')')}`,
    `LOCATION:${escapeICS(event.location + ', ' + event.building)}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${event.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeICS(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}
