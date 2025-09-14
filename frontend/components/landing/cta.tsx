'use client'

import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Smartphone, Globe } from 'lucide-react'

export function CTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-deep-green to-leaf-green">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              Ready to transform your farming?
            </h2>
            <p className="text-xl text-green-100 mb-8 leading-relaxed">
              Join the agricultural revolution. Get started with GreenPulseX today and 
              see the difference AI-powered insights can make to your farm.
            </p>

            {/* Benefits List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="flex items-center justify-center space-x-3 text-green-100">
                <CheckCircle className="h-6 w-6" />
                <span>Free 30-day trial</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-green-100">
                <Smartphone className="h-6 w-6" />
                <span>Mobile app included</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-green-100">
                <Globe className="h-6 w-6" />
                <span>Works worldwide</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-deep-green font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-deep-green font-semibold rounded-lg transition-all duration-300"
              >
                Schedule Demo
              </motion.button>
            </div>

            {/* Trust Indicators */}
            <div className="text-center">
              <p className="text-green-200 text-sm mb-4">
                Trusted by farmers in 25+ countries
              </p>
              <div className="flex items-center justify-center space-x-8 opacity-60">
                <div className="text-white font-semibold">🇮🇳 India</div>
                <div className="text-white font-semibold">🇧🇷 Brazil</div>
                <div className="text-white font-semibold">🇪🇬 Egypt</div>
                <div className="text-white font-semibold">🇺🇸 USA</div>
                <div className="text-white font-semibold">🇦🇺 Australia</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-white opacity-5 rounded-full translate-x-1/2 translate-y-1/2"></div>
      </div>
    </section>
  )
}
