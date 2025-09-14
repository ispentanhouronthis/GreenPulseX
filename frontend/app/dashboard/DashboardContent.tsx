'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { DashboardOverview } from '@/components/dashboard/overview'
import { FarmMap } from '@/components/dashboard/farm-map'
import { SensorCharts } from '@/components/dashboard/sensor-charts'
import { PredictionsPanel } from '@/components/dashboard/predictions-panel'
import { RecommendationsPanel } from '@/components/dashboard/recommendations-panel'

export default function DashboardContent() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-soft-sand to-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-deep-green border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-sand to-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-text mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening on your farms today.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Overview & Charts */}
          <div className="lg:col-span-2 space-y-8">
            <DashboardOverview />
            <SensorCharts />
            <FarmMap />
          </div>

          {/* Right Column - Predictions & Recommendations */}
          <div className="space-y-8">
            <PredictionsPanel />
            <RecommendationsPanel />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}