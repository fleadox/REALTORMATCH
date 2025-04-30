// Local storage utility functions
const STORAGE_PREFIX = 'georgiarealty_';

export function setItem(key: string, value: any): void {
  localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
}

export function getItem<T>(key: string): T | null {
  const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
  return item ? JSON.parse(item) : null;
}

export function removeItem(key: string): void {
  localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
}

export function clear(): void {
  Object.keys(localStorage)
    .filter(key => key.startsWith(STORAGE_PREFIX))
    .forEach(key => localStorage.removeItem(key));
}