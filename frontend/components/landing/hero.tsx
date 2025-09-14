'use client'

import Link from 'next/link'
import { ArrowRight, Play, Shield, Zap, Users } from 'lucide-react'
import { motion } from 'framer-motion'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-soft-sand via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl lg:text-6xl font-bold text-dark-text leading-tight"
              >
                Predict. Optimize.{' '}
                <span className="text-gradient">Harvest better.</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl text-gray-600 leading-relaxed max-w-2xl"
              >
                GreenPulseX uses soil sensors + AI to boost yields and reduce waste — 
                practical insights for small farms.
              </motion.p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-deep-green hover:bg-leaf-green text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Connect Your First Sensor
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              
              <button className="inline-flex items-center justify-center px-8 py-4 border-2 border-deep-green text-deep-green hover:bg-deep-green hover:text-white font-semibold rounded-lg transition-all duration-300">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex items-center space-x-8 pt-8"
            >
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-deep-green" />
                <span className="text-sm text-gray-600">Secure & Private</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-deep-green" />
                <span className="text-sm text-gray-600">Real-time Data</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-deep-green" />
                <span className="text-sm text-gray-600">10,000+ Farmers</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* Dashboard Preview */}
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-500">GreenPulseX Dashboard</span>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  {/* Yield Prediction Card */}
                  <div className="bg-gradient-to-r from-deep-green to-leaf-green rounded-lg p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90">Predicted Yield</p>
                        <p className="text-2xl font-bold">4,200 kg/ha</p>
                        <p className="text-sm opacity-90">+12% vs last season</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm opacity-90">Confidence</p>
                        <p className="text-lg font-semibold">78%</p>
                      </div>
                    </div>
                  </div>

                  {/* Sensor Status */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Soil Moisture</p>
                      <p className="text-lg font-semibold text-deep-green">45%</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Soil pH</p>
                      <p className="text-lg font-semibold text-deep-green">6.8</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Temperature</p>
                      <p className="text-lg font-semibold text-deep-green">28°C</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Humidity</p>
                      <p className="text-lg font-semibold text-deep-green">72%</p>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-blue-900">💡 Recommendation</p>
                    <p className="text-xs text-blue-700">Irrigate 20mm on Oct 5th for optimal growth</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg border border-gray-200"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-deep-green to-leaf-green rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">AI</span>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute -bottom-4 -left-4 bg-white rounded-full p-3 shadow-lg border border-gray-200"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-aqua-accent to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">📊</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-deep-green opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-leaf-green opacity-5 rounded-full translate-x-1/2 translate-y-1/2"></div>
      </div>
    </section>
  )
}
