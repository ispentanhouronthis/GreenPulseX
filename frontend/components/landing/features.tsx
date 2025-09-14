'use client'

import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Smartphone, 
  Shield, 
  Zap, 
  Globe, 
  TrendingUp,
  Cloud,
  Users
} from 'lucide-react'

const features = [
  {
    icon: BarChart3,
    title: 'AI-Powered Predictions',
    description: 'Advanced machine learning models analyze soil data to predict crop yields with 85% accuracy.',
    color: 'from-deep-green to-leaf-green'
  },
  {
    icon: Smartphone,
    title: 'Real-time Monitoring',
    description: 'Monitor soil conditions, weather, and crop health from anywhere with our mobile app.',
    color: 'from-blue-500 to-aqua-accent'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your farm data is encrypted and stored securely. We never share your information.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Zap,
    title: 'Instant Alerts',
    description: 'Get notified immediately when action is needed - irrigation, fertilization, or pest control.',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    icon: Globe,
    title: 'Multi-language Support',
    description: 'Available in English, Hindi, Spanish, and more languages for global accessibility.',
    color: 'from-green-500 to-teal-500'
  },
  {
    icon: TrendingUp,
    title: 'Proven Results',
    description: 'Farmers see 10-15% yield increase and 20% reduction in resource waste on average.',
    color: 'from-red-500 to-pink-500'
  },
  {
    icon: Cloud,
    title: 'Weather Integration',
    description: 'Combines soil data with weather forecasts for comprehensive farm management.',
    color: 'from-indigo-500 to-blue-500'
  },
  {
    icon: Users,
    title: 'Expert Support',
    description: 'Access to agronomists and farming experts for personalized advice and guidance.',
    color: 'from-emerald-500 to-green-500'
  }
]

export function Features() {
  return (
    <section className="py-20 bg-white">
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
            Everything you need to{' '}
            <span className="text-gradient">optimize your farm</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From soil sensors to AI predictions, GreenPulseX provides comprehensive 
            tools for modern precision agriculture.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-dark-text mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-soft-sand to-green-50 rounded-2xl p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-dark-text mb-4">
              Ready to transform your farming?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of farmers who are already using GreenPulseX to increase 
              their yields and reduce costs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">
                Start Free Trial
              </button>
              <button className="btn-secondary">
                Schedule Demo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
