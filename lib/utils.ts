import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatEventDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatPrice(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function convertToAmPm(time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  const amPm = hours < 12 ? 'AM' : 'PM'
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12
  return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${amPm}`
}
