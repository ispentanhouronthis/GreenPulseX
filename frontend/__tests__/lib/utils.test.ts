import { 
  formatDate, 
  formatNumber, 
  formatCurrency, 
  formatPercentage,
  getInitials,
  truncateText,
  isValidEmail,
  isValidPhone,
  getBatteryStatus,
  getSoilMoistureStatus,
  getSoilPHStatus,
  getTemperatureStatus
} from '@/lib/utils'

describe('Utility Functions', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2024-01-15')
      expect(formatDate(date)).toBe('January 15, 2024')
    })
  })

  describe('formatNumber', () => {
    it('formats number with default decimals', () => {
      expect(formatNumber(1234.567)).toBe('1,235')
    })

    it('formats number with specified decimals', () => {
      expect(formatNumber(1234.567, 2)).toBe('1,234.57')
    })
  })

  describe('formatCurrency', () => {
    it('formats currency correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56')
    })
  })

  describe('formatPercentage', () => {
    it('formats percentage correctly', () => {
      expect(formatPercentage(85.5)).toBe('85.5%')
    })
  })

  describe('getInitials', () => {
    it('gets initials from full name', () => {
      expect(getInitials('John Doe')).toBe('JD')
    })

    it('handles single name', () => {
      expect(getInitials('John')).toBe('J')
    })

    it('handles multiple names', () => {
      expect(getInitials('John Michael Doe Smith')).toBe('JM')
    })
  })

  describe('truncateText', () => {
    it('truncates long text', () => {
      const longText = 'This is a very long text that should be truncated'
      expect(truncateText(longText, 20)).toBe('This is a very long ...')
    })

    it('returns original text if shorter than limit', () => {
      const shortText = 'Short text'
      expect(truncateText(shortText, 20)).toBe('Short text')
    })
  })

  describe('isValidEmail', () => {
    it('validates correct email', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
    })

    it('rejects invalid email', () => {
      expect(isValidEmail('invalid-email')).toBe(false)
    })
  })

  describe('isValidPhone', () => {
    it('validates correct phone', () => {
      expect(isValidPhone('+1234567890')).toBe(true)
    })

    it('rejects invalid phone', () => {
      expect(isValidPhone('123')).toBe(false)
    })
  })

  describe('getBatteryStatus', () => {
    it('returns high status for good battery', () => {
      const status = getBatteryStatus(3.8)
      expect(status.status).toBe('high')
      expect(status.color).toBe('text-green-500')
    })

    it('returns medium status for medium battery', () => {
      const status = getBatteryStatus(3.4)
      expect(status.status).toBe('medium')
      expect(status.color).toBe('text-yellow-500')
    })

    it('returns low status for low battery', () => {
      const status = getBatteryStatus(2.9)
      expect(status.status).toBe('low')
      expect(status.color).toBe('text-red-500')
    })
  })

  describe('getSoilMoistureStatus', () => {
    it('returns optimal status for good moisture', () => {
      const status = getSoilMoistureStatus(50)
      expect(status.status).toBe('optimal')
      expect(status.color).toBe('text-green-500')
    })

    it('returns dry status for low moisture', () => {
      const status = getSoilMoistureStatus(15)
      expect(status.status).toBe('dry')
      expect(status.color).toBe('text-orange-500')
    })
  })

  describe('getSoilPHStatus', () => {
    it('returns optimal status for good pH', () => {
      const status = getSoilPHStatus(6.8)
      expect(status.status).toBe('optimal')
      expect(status.color).toBe('text-green-500')
    })

    it('returns acidic status for low pH', () => {
      const status = getSoilPHStatus(5.5)
      expect(status.status).toBe('acidic')
      expect(status.color).toBe('text-red-500')
    })
  })

  describe('getTemperatureStatus', () => {
    it('returns optimal status for good temperature', () => {
      const status = getTemperatureStatus(28)
      expect(status.status).toBe('optimal')
      expect(status.color).toBe('text-green-500')
    })

    it('returns hot status for high temperature', () => {
      const status = getTemperatureStatus(38)
      expect(status.status).toBe('hot')
      expect(status.color).toBe('text-red-500')
    })
  })
})
