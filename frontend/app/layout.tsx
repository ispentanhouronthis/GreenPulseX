import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GreenPulseX - AI-driven yield predictions for farmers',
  description: 'GreenPulseX helps you optimize irrigation, fertilizer, and pest control with real-time soil data and machine learning predictions.',
  keywords: ['agriculture', 'farming', 'AI', 'yield prediction', 'soil sensors', 'precision farming'],
  authors: [{ name: 'GreenPulseX Team' }],
  creator: 'GreenPulseX',
  publisher: 'GreenPulseX',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'GreenPulseX - AI-driven yield predictions for farmers',
    description: 'Optimize irrigation, fertilizer, and pest control with real-time soil data and AI predictions.',
    url: '/',
    siteName: 'GreenPulseX',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GreenPulseX - AI-driven yield predictions',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GreenPulseX - AI-driven yield predictions for farmers',
    description: 'Optimize irrigation, fertilizer, and pest control with real-time soil data and AI predictions.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0B6B3A" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#2EA56A',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
