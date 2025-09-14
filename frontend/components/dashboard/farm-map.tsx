'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const farmData = [
  {
    id: 1,
    name: 'Green Valley Rice Farm',
    position: [12.9716, 77.5946] as [number, number],
    crop: 'Rice',
    area: '5.2 ha',
    devices: 3,
    status: 'active',
    lastReading: '2 hours ago',
  },
  {
    id: 2,
    name: 'Sunrise Wheat Fields',
    position: [28.6139, 77.2090] as [number, number],
    crop: 'Wheat',
    area: '3.8 ha',
    devices: 2,
    status: 'active',
    lastReading: '1 hour ago',
  },
  {
    id: 3,
    name: 'Golden Corn Acres',
    position: [19.0760, 72.8777] as [number, number],
    crop: 'Corn',
    area: '7.5 ha',
    devices: 4,
    status: 'maintenance',
    lastReading: '4 hours ago',
  },
]

export function FarmMap() {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-dark-text mb-6">Farm Locations</h2>
      
      <div className="h-96 rounded-lg overflow-hidden">
        <MapContainer
          center={[20.5937, 78.9629]} // Center of India
          zoom={5}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {farmData.map((farm) => (
            <Marker key={farm.id} position={farm.position}>
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-gray-800 mb-2">{farm.name}</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Crop:</span> {farm.crop}</p>
                    <p><span className="font-medium">Area:</span> {farm.area}</p>
                    <p><span className="font-medium">Devices:</span> {farm.devices}</p>
                    <p><span className="font-medium">Status:</span> 
                      <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                        farm.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {farm.status}
                      </span>
                    </p>
                    <p><span className="font-medium">Last Reading:</span> {farm.lastReading}</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      {/* Farm Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {farmData.map((farm) => (
          <div key={farm.id} className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-2">{farm.name}</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>{farm.crop} • {farm.area}</p>
              <p>{farm.devices} devices • {farm.lastReading}</p>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  farm.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                }`}></div>
                <span className="capitalize">{farm.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
