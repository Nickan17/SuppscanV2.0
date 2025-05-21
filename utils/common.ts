/**
 * Safely parses JSON and returns the result or a default value if parsing fails
 */
export const safeJsonParse = <T>(json: string, defaultValue: T): T => {
  try {
    return JSON.parse(json) as T;
  } catch (e) {
    console.warn('Failed to parse JSON:', e);
    return defaultValue;
  }
};

/**
 * Formats a date to a user-friendly string
 */
export const formatDate = (dateString: string | Date): string => {
  const date =
    typeof dateString === 'string' ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Truncates text to a specified length and adds an ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength).trim()}...`;
};

/**
 * Generates a unique ID
 */
export const generateId = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

/**
 * Debounce a function call
 */
export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  wait: number,
): ((...args: Parameters<F>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<F>): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
