import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Greetings } from '@/constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRandomGreeting() {
  return Greetings[Math.floor(Math.random() * Greetings.length)];
}
