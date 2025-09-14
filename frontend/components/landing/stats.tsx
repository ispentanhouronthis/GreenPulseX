'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Users, Globe, Award } from 'lucide-react'

const stats = [
  {
    icon: TrendingUp,
    value: '15%',
    label: 'Average Yield Increase',
    description: 'Farmers see significant improvements in crop yields'
  },
  {
    icon: Users,
    value: '10,000+',
    label: 'Active Farmers',
    description: 'Growing community of successful farmers worldwide'
  },
  {
    icon: Globe,
    value: '25+',
    label: 'Countries',
    description: 'Serving farmers across multiple continents'
  },
  {
    icon: Award,
    value: '85%',
    label: 'Prediction Accuracy',
    description: 'Industry-leading AI model performance'
  }
]

export function Stats() {
  return (
    <section className="py-20 bg-gradient-to-r from-deep-green to-leaf-green">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Proven Results
          </h2>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Join thousands of farmers who are already seeing measurable improvements 
            in their farming operations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                  viewport={{ once: true }}
                  className="text-4xl lg:text-5xl font-bold text-white mb-2"
                >
                  {stat.value}
                </motion.div>
                
                <h3 className="text-lg font-semibold text-white mb-2">
                  {stat.label}
                </h3>
                
                <p className="text-green-100 text-sm">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Impact Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">20%</div>
              <div className="text-green-100">Reduction in fertilizer waste</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">30%</div>
              <div className="text-green-100">Fewer pest-related losses</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">$2,500</div>
              <div className="text-green-100">Average annual savings per farm</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
