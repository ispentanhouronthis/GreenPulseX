'use client'

import { Droplets, Zap, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

const recommendations = [
  {
    id: 1,
    type: 'irrigation',
    title: 'Irrigation Required',
    description: 'Irrigate 20mm on 2025-10-05 for optimal growth',
    priority: 1,
    farm: 'Green Valley Rice Farm',
    estimatedImpact: 'Increase yield by 8-12%',
    scheduledDate: '2025-10-05',
    icon: Droplets,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    id: 2,
    type: 'fertilizer',
    title: 'Fertilizer Application',
    description: 'Apply 15kg N per hectare next week',
    priority: 2,
    farm: 'Sunrise Wheat Fields',
    estimatedImpact: 'Increase yield by 5-8%',
    scheduledDate: '2025-10-10',
    icon: Zap,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  {
    id: 3,
    type: 'pest_control',
    title: 'Pest Alert',
    description: 'Monitor for aphids in the next 3 days',
    priority: 1,
    farm: 'Golden Corn Acres',
    estimatedImpact: 'Prevent yield loss of 3-5%',
    scheduledDate: '2025-10-08',
    icon: AlertTriangle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
]

const priorityLabels = {
  1: { label: 'High', color: 'text-red-600 bg-red-100' },
  2: { label: 'Medium', color: 'text-yellow-600 bg-yellow-100' },
  3: { label: 'Low', color: 'text-green-600 bg-green-100' },
}

export function RecommendationsPanel() {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-dark-text">Recommendations</h2>
        <CheckCircle className="h-5 w-5 text-deep-green" />
      </div>
      
      <div className="space-y-4">
        {recommendations.map((recommendation) => (
          <div 
            key={recommendation.id} 
            className={`border rounded-lg p-4 hover:shadow-md transition-all duration-200 ${recommendation.borderColor}`}
          >
            <div className="flex items-start space-x-3">
              <div className={`w-10 h-10 ${recommendation.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <recommendation.icon className={`h-5 w-5 ${recommendation.color}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-800">{recommendation.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityLabels[recommendation.priority as keyof typeof priorityLabels].color}`}>
                    {priorityLabels[recommendation.priority as keyof typeof priorityLabels].label}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">
                  {recommendation.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span className="font-medium">Farm:</span>
                    <span>{recommendation.farm}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>Scheduled: {recommendation.scheduledDate}</span>
                  </div>
                  
                  <div className="text-xs text-green-600 font-medium">
                    {recommendation.estimatedImpact}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-green-900 mb-1">
              AI-Powered Insights
            </h4>
            <p className="text-xs text-green-700">
              Recommendations are generated based on real-time sensor data, weather patterns, and historical yield data.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
