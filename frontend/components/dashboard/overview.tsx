'use client'

import { TrendingUp, Droplets, Thermometer, Leaf } from 'lucide-react'

const stats = [
  {
    title: 'Predicted Yield',
    value: '4,200 kg/ha',
    change: '+12%',
    changeType: 'positive' as const,
    icon: TrendingUp,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    title: 'Soil Moisture',
    value: '45%',
    change: 'Optimal',
    changeType: 'neutral' as const,
    icon: Droplets,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Temperature',
    value: '28°C',
    change: 'Normal',
    changeType: 'neutral' as const,
    icon: Thermometer,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    title: 'Active Devices',
    value: '8',
    change: 'All Online',
    changeType: 'positive' as const,
    icon: Leaf,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
]

export function DashboardOverview() {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-dark-text mb-6">Farm Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div
                className={`text-sm font-medium ${
                  stat.changeType === 'positive'
                    ? 'text-green-600'
                    : stat.changeType === 'neutral'
                    ? 'text-gray-600'
                    : 'text-red-600'
                }`}
              >
                {stat.change}
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-dark-text mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-600 text-sm">
                {stat.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}