'use client'

import { TrendingUp, TrendingDown, Minus, Target } from 'lucide-react'

const predictions = [
  {
    farm: 'Green Valley Rice Farm',
    predictedYield: 4200,
    confidence: 78,
    change: 12,
    changeType: 'positive' as const,
    modelVersion: 'v0.1.0',
    lastUpdated: '2 hours ago',
  },
  {
    farm: 'Sunrise Wheat Fields',
    predictedYield: 3800,
    confidence: 82,
    change: -3,
    changeType: 'negative' as const,
    modelVersion: 'v0.1.0',
    lastUpdated: '1 hour ago',
  },
  {
    farm: 'Golden Corn Acres',
    predictedYield: 5500,
    confidence: 75,
    change: 0,
    changeType: 'neutral' as const,
    modelVersion: 'v0.1.0',
    lastUpdated: '4 hours ago',
  },
]

export function PredictionsPanel() {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-dark-text">Yield Predictions</h2>
        <Target className="h-5 w-5 text-deep-green" />
      </div>
      
      <div className="space-y-4">
        {predictions.map((prediction, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-deep-green transition-colors">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-800">{prediction.farm}</h3>
              <div className="flex items-center space-x-1">
                {prediction.changeType === 'positive' && (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                )}
                {prediction.changeType === 'negative' && (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                {prediction.changeType === 'neutral' && (
                  <Minus className="h-4 w-4 text-gray-500" />
                )}
                <span className={`text-sm font-medium ${
                  prediction.changeType === 'positive' ? 'text-green-600' :
                  prediction.changeType === 'negative' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {prediction.change > 0 ? '+' : ''}{prediction.change}%
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-dark-text">
                  {prediction.predictedYield.toLocaleString()} kg/ha
                </span>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Confidence</div>
                  <div className="text-lg font-semibold text-deep-green">
                    {prediction.confidence}%
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Model: {prediction.modelVersion}</span>
                <span>{prediction.lastUpdated}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">
              Confidence Score
            </h4>
            <p className="text-xs text-blue-700">
              Indicates how similar current conditions are to the model's training data.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
