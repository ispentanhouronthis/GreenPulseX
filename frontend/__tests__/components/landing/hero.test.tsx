import { render, screen } from '@testing-library/react'
import { Hero } from '@/components/landing/hero'

describe('Hero Component', () => {
  it('renders the main heading', () => {
    render(<Hero />)
    
    expect(screen.getByText('Predict. Optimize.')).toBeInTheDocument()
    expect(screen.getByText('Harvest better.')).toBeInTheDocument()
  })

  it('renders the subtitle', () => {
    render(<Hero />)
    
    expect(screen.getByText(/GreenPulseX uses soil sensors \+ AI to boost yields/)).toBeInTheDocument()
  })

  it('renders the CTA button', () => {
    render(<Hero />)
    
    expect(screen.getByText('Connect Your First Sensor')).toBeInTheDocument()
  })

  it('renders the demo button', () => {
    render(<Hero />)
    
    expect(screen.getByText('Watch Demo')).toBeInTheDocument()
  })

  it('renders trust indicators', () => {
    render(<Hero />)
    
    expect(screen.getByText('Secure & Private')).toBeInTheDocument()
    expect(screen.getByText('Real-time Data')).toBeInTheDocument()
    expect(screen.getByText('10,000+ Farmers')).toBeInTheDocument()
  })
})
