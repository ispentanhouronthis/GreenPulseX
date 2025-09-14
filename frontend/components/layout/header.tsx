'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, Sun, Moon, Globe } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useAuthStore } from '@/lib/stores/auth-store'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-deep-green to-leaf-green rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">GPX</span>
              </div>
              <span className="text-xl font-bold text-gradient">GreenPulseX</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-deep-green transition-colors">
              Home
            </Link>
            <Link href="/how-it-works" className="text-gray-700 hover:text-deep-green transition-colors">
              How it Works
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-deep-green transition-colors">
              About
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-deep-green transition-colors">
                  Dashboard
                </Link>
                <Link href="/farms" className="text-gray-700 hover:text-deep-green transition-colors">
                  Farms
                </Link>
                <Link href="/devices" className="text-gray-700 hover:text-deep-green transition-colors">
                  Devices
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin" className="text-gray-700 hover:text-deep-green transition-colors">
                    Admin
                  </Link>
                )}
              </>
            ) : null}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Language selector */}
            <button
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Select language"
            >
              <Globe className="h-5 w-5" />
            </button>

            {/* Auth buttons */}
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-600 hover:text-deep-green transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-deep-green transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="btn-primary"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-700 hover:text-deep-green hover:bg-gray-50 rounded-md transition-colors"
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link
                href="/how-it-works"
                className="block px-3 py-2 text-gray-700 hover:text-deep-green hover:bg-gray-50 rounded-md transition-colors"
                onClick={toggleMenu}
              >
                How it Works
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-gray-700 hover:text-deep-green hover:bg-gray-50 rounded-md transition-colors"
                onClick={toggleMenu}
              >
                About
              </Link>
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 text-gray-700 hover:text-deep-green hover:bg-gray-50 rounded-md transition-colors"
                    onClick={toggleMenu}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/farms"
                    className="block px-3 py-2 text-gray-700 hover:text-deep-green hover:bg-gray-50 rounded-md transition-colors"
                    onClick={toggleMenu}
                  >
                    Farms
                  </Link>
                  <Link
                    href="/devices"
                    className="block px-3 py-2 text-gray-700 hover:text-deep-green hover:bg-gray-50 rounded-md transition-colors"
                    onClick={toggleMenu}
                  >
                    Devices
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="block px-3 py-2 text-gray-700 hover:text-deep-green hover:bg-gray-50 rounded-md transition-colors"
                      onClick={toggleMenu}
                    >
                      Admin
                    </Link>
                  )}
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="px-3 py-2 text-sm text-gray-600">
                      Welcome, {user.name}
                    </div>
                    <button
                      onClick={() => {
                        handleLogout()
                        toggleMenu()
                      }}
                      className="block w-full text-left px-3 py-2 text-gray-700 hover:text-deep-green hover:bg-gray-50 rounded-md transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-gray-200 pt-2 mt-2 space-y-1">
                  <Link
                    href="/login"
                    className="block px-3 py-2 text-gray-700 hover:text-deep-green hover:bg-gray-50 rounded-md transition-colors"
                    onClick={toggleMenu}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 bg-deep-green text-white hover:bg-leaf-green rounded-md transition-colors"
                    onClick={toggleMenu}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
