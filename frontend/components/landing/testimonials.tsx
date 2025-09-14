'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Rajesh Kumar',
    role: 'Rice Farmer',
    location: 'Punjab, India',
    image: '/testimonials/rajesh.jpg',
    rating: 5,
    text: 'GreenPulseX helped me increase my rice yield by 18% in just one season. The soil sensors gave me insights I never had before, and the AI recommendations were spot on.',
    results: '18% yield increase'
  },
  {
    name: 'Maria Santos',
    role: 'Corn Farmer',
    location: 'São Paulo, Brazil',
    image: '/testimonials/maria.jpg',
    rating: 5,
    text: 'The real-time monitoring saved my crop during a drought. I got alerts to irrigate at the perfect time, and my corn yield was better than ever.',
    results: 'Saved crop during drought'
  },
  {
    name: 'Ahmed Hassan',
    role: 'Wheat Farmer',
    location: 'Cairo, Egypt',
    image: '/testimonials/ahmed.jpg',
    rating: 5,
    text: 'I was skeptical about AI in farming, but GreenPulseX proved me wrong. The predictions were accurate, and I saved 25% on fertilizer costs.',
    results: '25% cost savings'
  }
]

export function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-dark-text mb-4">
            What farmers are{' '}
            <span className="text-gradient">saying</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real stories from real farmers who have transformed their operations with GreenPulseX.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
                {/* Quote Icon */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-deep-green to-leaf-green rounded-full flex items-center justify-center">
                  <Quote className="h-4 w-4 text-white" />
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.text}"
                </blockquote>

                {/* Results Badge */}
                <div className="inline-block bg-gradient-to-r from-deep-green to-leaf-green text-white px-3 py-1 rounded-full text-sm font-medium mb-6">
                  {testimonial.results}
                </div>

                {/* Author Info */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-dark-text">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonial.location}
                    </div>
                  </div>
                </div>
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
              Join thousands of successful farmers
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Start your journey towards better yields and sustainable farming practices today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">
                Start Free Trial
              </button>
              <button className="btn-secondary">
                Read More Stories
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
