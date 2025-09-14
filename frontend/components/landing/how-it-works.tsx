'use client'

import { motion } from 'framer-motion'
import { Wifi, Brain, Target } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Wifi,
    title: 'Deploy Sensors',
    description: 'Install IoT soil sensors across your farm to collect real-time data on moisture, pH, nutrients, and temperature.',
    details: [
      'Easy 15-minute setup',
      'Battery lasts 2+ years',
      'Works in all weather conditions',
      'LoRa connectivity for remote areas'
    ]
  },
  {
    number: '02',
    icon: Brain,
    title: 'AI Analysis',
    description: 'Our machine learning models analyze your data along with weather patterns to generate accurate yield predictions.',
    details: [
      '85% prediction accuracy',
      'Real-time data processing',
      'Weather integration',
      'Historical trend analysis'
    ]
  },
  {
    number: '03',
    icon: Target,
    title: 'Actionable Insights',
    description: 'Receive personalized recommendations for irrigation, fertilization, and pest control to maximize your yield.',
    details: [
      'Precise timing recommendations',
      'Resource optimization',
      'Cost-benefit analysis',
      'Mobile app notifications'
    ]
  }
]

export function HowItWorks() {
  return (
    <section className="py-20 bg-gradient-to-br from-soft-sand to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-dark-text mb-4">
            How GreenPulseX{' '}
            <span className="text-gradient">works</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get started in three simple steps and see results within the first growing season.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`flex flex-col lg:flex-row items-center gap-12 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Content */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-deep-green to-leaf-green rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">{step.number}</span>
                  </div>
                  <div className="w-12 h-12 bg-white rounded-lg shadow-lg flex items-center justify-center">
                    <step.icon className="h-6 w-6 text-deep-green" />
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-dark-text mb-4">
                    {step.title}
                  </h3>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    {step.description}
                  </p>

                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-deep-green rounded-full"></div>
                        <span className="text-gray-600">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Visual */}
              <div className="flex-1">
                <div className="relative">
                  <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                    {/* Placeholder for step visualization */}
                    <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-deep-green to-leaf-green rounded-full flex items-center justify-center mx-auto mb-4">
                          <step.icon className="h-8 w-8 text-white" />
                        </div>
                        <p className="text-gray-500 font-medium">{step.title}</p>
                      </div>
                    </div>
                  </div>

                  {/* Decorative elements */}
                  {index === 0 && (
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-pulse"></div>
                  )}
                  {index === 1 && (
                    <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-400 rounded-full animate-pulse"></div>
                  )}
                  {index === 2 && (
                    <div className="absolute -top-4 -left-4 w-10 h-10 bg-green-400 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-dark-text mb-4">
              Ready to get started?
            </h3>
            <p className="text-gray-600 mb-6">
              Connect your first sensor and receive your first recommendation within 24 hours.
            </p>
            <button className="btn-primary">
              Connect Your First Sensor
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
