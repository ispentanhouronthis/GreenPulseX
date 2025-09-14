import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function formatNumber(num: number, decimals: number = 0) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)
}

export function formatCurrency(amount: number, currency: string = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatPercentage(value: number, decimals: number = 1) {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100)
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function generateId() {
  return Math.random().toString(36).substr(2, 9)
}

export function isValidEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhone(phone: string) {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
}

export function getBatteryStatus(battery: number) {
  if (battery >= 3.7) return { status: 'high', color: 'text-green-500' }
  if (battery >= 3.3) return { status: 'medium', color: 'text-yellow-500' }
  return { status: 'low', color: 'text-red-500' }
}

export function getSoilMoistureStatus(moisture: number) {
  if (moisture < 20) return { status: 'very dry', color: 'text-red-500' }
  if (moisture < 40) return { status: 'dry', color: 'text-orange-500' }
  if (moisture < 60) return { status: 'optimal', color: 'text-green-500' }
  if (moisture < 80) return { status: 'moist', color: 'text-blue-500' }
  return { status: 'wet', color: 'text-purple-500' }
}

export function getSoilPHStatus(ph: number) {
  if (ph < 6.0) return { status: 'acidic', color: 'text-red-500' }
  if (ph < 6.5) return { status: 'slightly acidic', color: 'text-orange-500' }
  if (ph <= 7.5) return { status: 'optimal', color: 'text-green-500' }
  if (ph <= 8.0) return { status: 'slightly alkaline', color: 'text-yellow-500' }
  return { status: 'alkaline', color: 'text-red-500' }
}

export function getTemperatureStatus(temp: number) {
  if (temp < 10) return { status: 'cold', color: 'text-blue-500' }
  if (temp < 20) return { status: 'cool', color: 'text-cyan-500' }
  if (temp <= 30) return { status: 'optimal', color: 'text-green-500' }
  if (temp <= 35) return { status: 'warm', color: 'text-orange-500' }
  return { status: 'hot', color: 'text-red-500' }
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c
  return distance
}

export function downloadCSV(data: any[], filename: string) {
  const csv = convertToCSV(data)
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

function convertToCSV(data: any[]) {
  if (data.length === 0) return ''
  
  const headers = Object.keys(data[0])
  const csvHeaders = headers.join(',')
  
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header]
      return typeof value === 'string' && value.includes(',') 
        ? `"${value}"` 
        : value
    }).join(',')
  })
  
  return [csvHeaders, ...csvRows].join('\n')
}

export function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text)
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    return Promise.resolve()
  }
}
