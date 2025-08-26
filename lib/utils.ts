import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function stripHtml(html: string): string {
  if (!html) return '';
  // Remove HTML tags and decode HTML entities
  return html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
    .replace(/&amp;/g, '&') // Replace encoded ampersands
    .replace(/&lt;/g, '<') // Replace encoded less than
    .replace(/&gt;/g, '>') // Replace encoded greater than
    .replace(/&quot;/g, '"') // Replace encoded quotes
    .replace(/&#39;/g, "'") // Replace encoded apostrophes
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim(); // Remove leading/trailing whitespace
}

export function ensureESTDisplay(timeString: string): string {
  if (!timeString) return '';
  
  // If the time string already has a timezone indicator, return as-is
  if (timeString.includes('EST') || timeString.includes('EDT')) {
    return timeString;
  }
  
  // Add EST indicator to make it clear this is Eastern time
  return timeString + ' EST';
}

export function applyESTOffset(timeString: string): string {
  if (!timeString) return '';
  
  // Parse the time string (e.g., "2:00 PM" -> 14:00)
  const match = timeString.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return timeString; // Return original if can't parse
  
  let hours = parseInt(match[1]);
  const minutes = match[2];
  const period = match[3].toUpperCase();
  
  // Convert to 24-hour format
  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }
  
  // Apply 4-hour offset (CST to EST conversion)
  hours -= 4;
  
  // Handle negative hours (wrap to previous day)
  if (hours < 0) {
    hours += 24;
  }
  
  // Convert back to 12-hour format
  let displayHours = hours;
  let newPeriod = 'AM';
  
  if (hours === 0) {
    displayHours = 12;
  } else if (hours > 12) {
    displayHours = hours - 12;
    newPeriod = 'PM';
  } else if (hours === 12) {
    newPeriod = 'PM';
  }
  
  // Format the time string
  const paddedHours = displayHours.toString();
  return `${paddedHours}:${minutes} ${newPeriod} EST`;
}
