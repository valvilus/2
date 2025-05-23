import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Popup, useMap, useMapEvents, Marker, Polyline } from 'react-leaflet';
import { AlertTriangle, PlusCircle, Search, Filter, MapPin, Clock, Shield, Layers, CloudRain, Navigation, Plane, Battery, X, Wifi, Compass, Thermometer } from 'lucide-react';
import { NoFlyZone, Drone } from '../../types';
import { useNotifications } from '../../context/NotificationsContext';
import WeatherWidget from '../../components/weather/WeatherWidget';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Mock data
const mockDrones: Drone[] = [
  {
    id: '1',
    name: 'DJI Mavic Air 2',
    serialNumber: 'DJI-001',
    model: 'Mavic Air 2',
    status: 'active',
    batteryLevel: 85,
    location: {
      latitude: 51.1694,
      longitude: 71.4491,
      altitude: 100
    }
  },
  {
    id: '2',
    name: 'DJI Mavic 3',
    serialNumber: 'DJI-002',
    model: 'Mavic 3',
    status: 'active',
    batteryLevel: 92,
    location: {
      latitude: 51.1724,
      longitude: 71.4461,
      altitude: 120
    }
  }
];

const mockNoFlyZones: NoFlyZone[] = [
  {
    id: '1',
    name: 'Аэропорт',
    type: 'permanent',
    center: {
      latitude: 51.1694,
      longitude: 71.4491
    },
    radius: 5000,
    color: '#ef4444'
  },
  {
    id: '2',
    name: 'Стадион',
    type: 'temporary',
    center: {
      latitude: 51.1724,
      longitude: 71.4461
    },
    radius: 2000,
    color: '#f97316'
  }
];

const mockFlightHistory: [number, number][] = [
  [51.1694, 71.4491],
  [51.1724, 71.4461],
  [51.1754, 71.4431]
];

// Create custom drone icon with pulsing effect
const createDroneIcon = (status: string, batteryLevel: number) => {
  const color = batteryLevel > 20 ? '#22c55e' : '#ef4444';
  
  const svg = `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 8L8 4L4 8L8 12L12 8ZM12 8L16 4L20 8L16 12L12 8ZM12 16L8 12L4 16L8 20L12 16ZM12 16L16 12L20 16L16 20L12 16Z" stroke="${color}" stroke-width="2"/>
    </svg>
  `;

  const pulsingIcon = L.divIcon({
    html: `
      <div class="drone-icon" style="
        width: 32px;
        height: 32px;
        animation: pulse 1.5s ease-in-out infinite;
        background-image: url('data:image/svg+xml;base64,${btoa(svg)}');
        background-size: contain;
      ">
      </div>
    `,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

  return pulsingIcon;
};

// Map coordinates component
const MapCoordinates: React.FC = () => {
  const [coords, setCoords] = useState({ lat: 0, lng: 0 });
  
  useMapEvents({
    mousemove: (e) => {
      setCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
    }
  });

  return (
    <div className="absolute bottom-2 left-2 bg-white dark:bg-gray-800 px-2 py-1 rounded-md text-sm z-[1000]">
      {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
    </div>
  );
};

// Map legend component
const MapLegend: React.FC<{ isVisible: boolean; onClose: () => void }> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute right-2 bottom-2 bg-white dark:bg-gray-800 p-3 rounded-md shadow-lg z-[1000]">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium">Легенда</h4>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-2">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-success/20 border-2 border-success rounded-full mr-2" />
          <span className="text-sm">Активный дрон</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-error/20 border-2 border-error rounded-full mr-2" />
          <span className="text-sm">Низкий заряд</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500/20 border-2 border-red-500 mr-2" />
          <span className="text-sm">Запретная зона</span>
        </div>
      </div>
    </div>
  );
};

// Layer controls component
const LayerControls: React.FC<{
  mapLayers: {
    noFlyZones: boolean;
    weather: boolean;
    flightPaths: boolean;
  };
  toggleMapLayer: (layer: string) => void;
}> = ({ mapLayers, toggleMapLayer }) => {
  return (
    <div className="absolute top-2 right-2 space-y-2 z-[1000]">
      <button
        onClick={() => toggleMapLayer('noFlyZones')}
        className={`w-full flex items-center px-4 py-2 rounded-lg transition-all ${
          mapLayers.noFlyZones
            ? 'bg-primary text-white shadow-lg shadow-primary/50'
            : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300'
        }`}
      >
        <AlertTriangle className="w-4 h-4 mr-2" />
        <span className="text-sm">Запретные зоны</span>
      </button>
      
      <button
        onClick={() => toggleMapLayer('weather')}
        className={`w-full flex items-center px-4 py-2 rounded-lg transition-all ${
          mapLayers.weather
            ? 'bg-primary text-white shadow-lg shadow-primary/50'
            : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300'
        }`}
      >
        <CloudRain className="w-4 h-4 mr-2" />
        <span className="text-sm">Погода</span>
      </button>
      
      <button
        onClick={() => toggleMapLayer('flightPaths')}
        className={`w-full flex items-center px-4 py-2 rounded-lg transition-all ${
          mapLayers.flightPaths
            ? 'bg-primary text-white shadow-lg shadow-primary/50'
            : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300'
        }`}
      >
        <Navigation className="w-4 h-4 mr-2" />
        <span className="text-sm">Траектория</span>
      </button>
    </div>
  );
};

const MonitoringPage: React.FC = () => {
  const [activeDrones, setActiveDrones] = useState<Drone[]>(mockDrones);
  const [selectedDrone, setSelectedDrone] = useState<Drone | null>(null);
  const [mapLayers, setMapLayers] = useState({
    noFlyZones: true,
    weather: true,
    flightPaths: true
  });
  const [isLegendVisible, setIsLegendVisible] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDrones(prev => 
        prev.map(drone => {
          if (drone.location) {
            const newLocation = {
              latitude: drone.location.latitude + (Math.random() - 0.5) * 0.001,
              longitude: drone.location.longitude + (Math.random() - 0.5) * 0.001,
              altitude: drone.location.altitude + (Math.random() - 0.5) * 5,
            };
            
            const newBatteryLevel = Math.max(0, (drone.batteryLevel || 100) - 0.1);
            
            if (Math.random() < 0.05) {
              const warnings = [
                'Высокая скорость ветра',
                'Низкий уровень заряда батареи',
                'Приближение к запретной зоне',
                'Потеря сигнала GPS',
              ];
              
              addNotification({
                type: 'warning',
                title: `Предупреждение: ${drone.name}`,
                message: warnings[Math.floor(Math.random() * warnings.length)],
              });
            }
            
            return {
              ...drone,
              location: newLocation,
              batteryLevel: newBatteryLevel,
            };
          }
          return drone;
        })
      );
    }, 3000);
    
    return () => clearInterval(interval);
  }, [addNotification]);

  const handleDroneSelect = (drone: Drone) => {
    setSelectedDrone(drone);
  };

  const toggleMapLayer = (layer: keyof typeof mapLayers) => {
    setMapLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Мониторинг полетов</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsLegendVisible(!isLegendVisible)}
            className="btn btn-outline flex items-center text-sm py-1 px-3"
          >
            <Layers className="w-4 h-4 mr-1" />
            Легенда
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-4 lg:col-span-1 max-h-[calc(100vh-13rem)] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Активные дроны</h2>
          
          {activeDrones.length > 0 ? (
            <div className="space-y-3">
              {activeDrones.map(drone => (
                <div
                  key={drone.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedDrone?.id === drone.id
                      ? 'bg-primary/10 border border-primary/50'
                      : 'bg-white/50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }`}
                  onClick={() => handleDroneSelect(drone)}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Plane className="h-5 w-5 text-primary" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{drone.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">SN: {drone.serialNumber}</p>
                    </div>
                    <div className="ml-auto">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success/20 text-success">
                        Активен
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Battery className="w-3 h-3 mr-1" />
                      <span>{drone.batteryLevel}%</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Navigation className="w-3 h-3 mr-1" />
                      <span>{drone.location?.altitude}м</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">Нет активных дронов</p>
            </div>
          )}
        </div>

        <div className="glass-card overflow-hidden lg:col-span-2" style={{ height: "calc(100vh - 13rem)" }}>
          <MapContainer 
            center={[51.1694, 71.4491]} 
            zoom={12} 
            style={{ height: "100%", width: "100%" }}
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            
            <LayerControls mapLayers={mapLayers} toggleMapLayer={toggleMapLayer} />
            <MapCoordinates />
            <MapLegend isVisible={isLegendVisible} onClose={() => setIsLegendVisible(false)} />
            
            {mapLayers.noFlyZones && mockNoFlyZones.map(zone => (
              <Circle
                key={zone.id}
                center={[zone.center.latitude, zone.center.longitude]}
                radius={zone.radius}
                pathOptions={{ 
                  color: zone.color,
                  fillColor: zone.color,
                  fillOpacity: 0.2
                }}
              >
                <Popup>
                  <div>
                    <h3 className="font-bold">{zone.name}</h3>
                    <p>Запретная зона</p>
                    <p>Тип: {zone.type === 'permanent' ? 'Постоянная' : 'Временная'}</p>
                    <p>Радиус: {zone.radius} м</p>
                  </div>
                </Popup>
              </Circle>
            ))}
            
            {activeDrones.map(drone => (
              drone.location && (
                <Marker
                  key={drone.id}
                  position={[drone.location.latitude, drone.location.longitude]}
                  icon={createDroneIcon(drone.status, drone.batteryLevel || 0)}
                  eventHandlers={{
                    click: () => handleDroneSelect(drone)
                  }}
                >
                  <Popup>
                    <div>
                      <h3 className="font-bold">{drone.name}</h3>
                      <p>Модель: {drone.model}</p>
                      <p>Высота: {Math.round(drone.location.altitude)} м</p>
                      <p>Батарея: {drone.batteryLevel}%</p>
                    </div>
                  </Popup>
                </Marker>
              )
            ))}
            
            {mapLayers.flightPaths && (
              <Polyline
                positions={mockFlightHistory}
                pathOptions={{ color: 'blue', weight: 3, opacity: 0.7 }}
              />
            )}
          </MapContainer>
        </div>
      </div>

      {/* Нижняя панель с информацией */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Погодный виджет */}
        <div className="glass-card p-4">
          <WeatherWidget latitude={51.1694} longitude={71.4491} />
        </div>

        {/* Информация о выбранном дроне */}
        <div className="glass-card p-4">
          {selectedDrone ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Информация о дроне</h3>
                <span className="px-2 py-1 text-xs rounded-full bg-success/20 text-success">
                  В полете
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Plane className="w-5 h-5 text-primary mr-2" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Модель</p>
                      <p className="font-medium">{selectedDrone.model}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-primary mr-2" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Серийный номер</p>
                      <p className="font-medium">{selectedDrone.serialNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Compass className="w-5 h-5 text-primary mr-2" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Координаты</p>
                      <p className="font-medium">
                        {selectedDrone.location?.latitude.toFixed(6)}, {selectedDrone.location?.longitude.toFixed(6)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <Battery className="w-5 h-5 text-primary mr-2" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">Заряд батареи</span>
                      </div>
                      <span className="font-medium">{selectedDrone.batteryLevel}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          selectedDrone.batteryLevel > 70 ? 'bg-success' :
                          selectedDrone.batteryLevel > 30 ? 'bg-warning' : 'bg-error'
                        }`}
                        style={{ width: `${selectedDrone.batteryLevel}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <Wifi className="w-5 h-5 text-primary mr-2" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">Сигнал</span>
                      </div>
                      <span className="font-medium">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-success"
                        style={{ width: '92%' }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center">
                      <Thermometer className="w-5 h-5 text-primary mr-2" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Высота</p>
                        <p className="font-medium">{selectedDrone.location?.altitude} м</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <Plane className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">
                Выберите дрон для просмотра информации
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonitoringPage;