import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Obfuscate email address to protect from web crawlers
 * Splits email into parts that can be reassembled client-side
 */
export function obfuscateEmail(email: string): { user: string; domain: string } {
  const [user, domain] = email.split('@')
  return { user, domain }
}

/**
 * Decode obfuscated email (client-side only)
 */
export function decodeEmail(user: string, domain: string): string {
  return `${user}@${domain}`
}

/**
 * Generate mailto link from obfuscated email parts
 */
export function getMailtoLink(user: string, domain: string): string {
  return `mailto:${decodeEmail(user, domain)}`
}

