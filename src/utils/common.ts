import { DateRange } from '@/types';

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const calculateDateRange = (days: number): DateRange => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  return { startDate, endDate };
};

export const isValidNumber = (value: any): boolean => {
  return !isNaN(value) && value !== null && value !== undefined;
};

export const calculateBMI = (weight: number, height: number): number | null => {
  if (!isValidNumber(weight) || !isValidNumber(height) || height <= 0) {
    return null;
  }
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> => {
  let lastError: Error | null = null;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        await sleep(delayMs * Math.pow(2, i));
      }
    }
  }
  
  throw lastError;
};

export const groupByDate = <T extends { measured_at: string }>(
  items: T[],
  dateFormatter: (date: string) => string = formatDate
): Record<string, T[]> => {
  return items.reduce((acc, item) => {
    const date = dateFormatter(item.measured_at);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as Record<string, T[]>);
};

export const calculateAverage = (numbers: number[]): number | null => {
  const validNumbers = numbers.filter(isValidNumber);
  if (validNumbers.length === 0) return null;
  return Number((validNumbers.reduce((a, b) => a + b, 0) / validNumbers.length).toFixed(1));
};
