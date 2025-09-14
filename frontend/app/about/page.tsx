import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Stats } from '@/components/landing/stats'
import { Testimonials } from '@/components/landing/testimonials'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-soft-sand to-white">
      <Header />
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-dark-text mb-6">
              About <span className="text-gradient">GreenPulseX</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're on a mission to democratize precision agriculture and help small 
              and marginal farmers increase their yields through AI-powered insights.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl font-bold text-dark-text mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                GreenPulseX was founded with a simple yet powerful vision: to make 
                advanced agricultural technology accessible to every farmer, regardless 
                of farm size or location. We believe that AI and IoT can transform 
                farming practices and help feed the world sustainably.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our platform combines real-time soil monitoring, weather data, and 
                machine learning to provide actionable insights that help farmers 
                optimize their resources and maximize their yields.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-dark-text mb-4">Impact Goals</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">1</span>
                  </div>
                  <span className="text-gray-700">Increase average farm yields by 15%</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <span className="text-gray-700">Reduce water usage by 20%</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">3</span>
                  </div>
                  <span className="text-gray-700">Minimize fertilizer waste by 25%</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">4</span>
                  </div>
                  <span className="text-gray-700">Serve 100,000 farmers by 2025</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-20">
            <h2 className="text-3xl font-bold text-dark-text mb-8 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-deep-green to-leaf-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🌱</span>
                </div>
                <h3 className="text-xl font-semibold text-dark-text mb-2">Sustainability</h3>
                <p className="text-gray-600">
                  We promote sustainable farming practices that protect the environment 
                  for future generations.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-deep-green to-leaf-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🤝</span>
                </div>
                <h3 className="text-xl font-semibold text-dark-text mb-2">Accessibility</h3>
                <p className="text-gray-600">
                  We make advanced technology accessible to farmers of all sizes and 
                  economic backgrounds.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-deep-green to-leaf-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">💡</span>
                </div>
                <h3 className="text-xl font-semibold text-dark-text mb-2">Innovation</h3>
                <p className="text-gray-600">
                  We continuously innovate to provide the most accurate and useful 
                  insights for farmers.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Stats />
        <Testimonials />
      </main>
      <Footer />
    </div>
  )
}
