import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet';
import { useNotifications } from '../../context/NotificationsContext';
import { Plane, Layers, Info, AlertTriangle, Wifi, Battery, Wind, Thermometer, Navigation, CloudRain } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Drone, FlightTelemetry, WeatherData } from '../../types';

// Исправление проблемы с маркерами Leaflet в React
// Создаем кастомные иконки для дронов
const droneIcon = new L.Icon({
  iconUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Мок-данные для демонстрации
const mockDrones: Drone[] = [
  {
    id: '1',
    name: 'DJI Mavic 3',
    model: 'Mavic 3',
    serialNumber: 'MAV3872341',
    weight: 895,
    maxSpeed: 68,
    maxFlightTime: 46,
    maxAltitude: 6000,
    batteryLevel: 78,
    status: 'in-flight',
    location: {
      latitude: 51.1694,
      longitude: 71.4491,
      altitude: 120,
    },
    pilotId: '1',
    createdAt: new Date(2024, 1, 15),
    updatedAt: new Date(2024, 1, 15),
  },
  {
    id: '2',
    name: 'DJI Air 2S',
    model: 'Air 2S',
    serialNumber: 'AIR2S52234',
    weight: 595,
    maxSpeed: 68,
    maxFlightTime: 31,
    maxAltitude: 5000,
    batteryLevel: 45,
    status: 'in-flight',
    location: {
      latitude: 51.1605,
      longitude: 71.4704,
      altitude: 85,
    },
    pilotId: '2',
    createdAt: new Date(2024, 2, 20),
    updatedAt: new Date(2024, 2, 20),
  },
];

// Мок-данные для запретных зон
const mockNoFlyZones = [
  {
    id: '1',
    name: 'Аэропорт Астаны',
    type: 'permanent',
    center: { latitude: 51.0222, longitude: 71.4669 },
    radius: 5000, // метры
    color: '#ff4444',
  },
  {
    id: '2',
    name: 'Акорда',
    type: 'permanent',
    center: { latitude: 51.1282, longitude: 71.4309 },
    radius: 1000, // метры
    color: '#ff8800',
  },
];

// Мок-данные для погоды
const mockWeather: WeatherData = {
  location: {
    latitude: 51.1694,
    longitude: 71.4491,
    name: 'Астана',
  },
  timestamp: new Date(),
  temperature: 18,
  humidity: 65,
  windSpeed: 12,
  windDirection: 225,
  precipitation: 0,
  visibility: 10000,
  pressure: 1013,
  cloudCoverage: 30,
  weatherCondition: 'partly-cloudy',
};

// Мок-данные для истории полета (координаты)
const mockFlightHistory = [
  [51.1694, 71.4491],
  [51.1680, 71.4480],
  [51.1670, 71.4470],
  [51.1660, 71.4460],
  [51.1650, 71.4450],
  [51.1640, 71.4460],
  [51.1630, 71.4470],
  [51.1620, 71.4480],
  [51.1610, 71.4490],
  [51.1605, 71.4704],
];

const MonitoringPage: React.FC = () => {
  const [activeDrones, setActiveDrones] = useState<Drone[]>(mockDrones);
  const [selectedDrone, setSelectedDrone] = useState<Drone | null>(null);
  const [mapLayers, setMapLayers] = useState({
    noFlyZones: true,
    weather: true,
    flightPaths: true,
  });
  const { addNotification } = useNotifications();

  // Имитация получения обновлений телеметрии
  useEffect(() => {
    const interval = setInterval(() => {
      // Имитация движения дрона
      setActiveDrones(prev => 
        prev.map(drone => {
          if (drone.location) {
            const newLocation = {
              latitude: drone.location.latitude + (Math.random() - 0.5) * 0.001,
              longitude: drone.location.longitude + (Math.random() - 0.5) * 0.001,
              altitude: drone.location.altitude + (Math.random() - 0.5) * 5,
            };
            
            // Имитация изменения уровня батареи
            const newBatteryLevel = Math.max(0, (drone.batteryLevel || 100) - 0.1);
            
            // Имитация возникновения предупреждения
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

  // Обработчик выбора дрона для просмотра детальной информации
  const handleDroneSelect = (drone: Drone) => {
    setSelectedDrone(drone);
  };

  // Переключение слоев карты
  const toggleMapLayer = (layer: keyof typeof mapLayers) => {
    setMapLayers(prev => ({
      ...prev,
      [layer]: !prev[layer],
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Мониторинг полетов</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => toggleMapLayer('noFlyZones')}
            className={`btn ${mapLayers.noFlyZones ? 'btn-primary' : 'btn-outline'} flex items-center text-sm py-1 px-3`}
          >
            <AlertTriangle className="w-4 h-4 mr-1" />
            Запретные зоны
          </button>
          <button
            onClick={() => toggleMapLayer('weather')}
            className={`btn ${mapLayers.weather ? 'btn-primary' : 'btn-outline'} flex items-center text-sm py-1 px-3`}
          >
            <CloudRain className="w-4 h-4 mr-1" />
            Погода
          </button>
          <button
            onClick={() => toggleMapLayer('flightPaths')}
            className={`btn ${mapLayers.flightPaths ? 'btn-primary' : 'btn-outline'} flex items-center text-sm py-1 px-3`}
          >
            <Navigation className="w-4 h-4 mr-1" />
            Траектории
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Список активных дронов */}
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

        {/* Карта и детали дрона */}
        <div className="lg:col-span-3 space-y-6">
          {/* Карта */}
          <div className="glass-card overflow-hidden" style={{ height: "500px" }}>
            <MapContainer 
              center={[51.1694, 71.4491]} 
              zoom={13} 
              style={{ height: "100%", width: "100%" }}
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              
              {/* Запретные зоны */}
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
              
              {/* Активные дроны */}
              {activeDrones.map(drone => (
                drone.location && (
                  <Marker
                    key={drone.id}
                    position={[drone.location.latitude, drone.location.longitude]}
                    icon={droneIcon}
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
              
              {/* История полета */}
              {mapLayers.flightPaths && (
                <Polyline
                  positions={mockFlightHistory as [number, number][]}
                  pathOptions={{ color: 'blue', weight: 3, opacity: 0.7 }}
                />
              )}
            </MapContainer>
          </div>

          {/* Информация о выбранном дроне */}
          {selectedDrone ? (
            <div className="glass-card p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedDrone.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Серийный номер: {selectedDrone.serialNumber}</p>
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/20 text-success">
                  В полете
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-card p-3 flex flex-col items-center">
                  <Battery className="w-6 h-6 text-primary mb-1" />
                  <span className="text-sm font-medium">{selectedDrone.batteryLevel}%</span>
                  <span className="text-xs text-gray-500">Батарея</span>
                </div>
                <div className="glass-card p-3 flex flex-col items-center">
                  <Navigation className="w-6 h-6 text-primary mb-1" />
                  <span className="text-sm font-medium">{selectedDrone.location?.altitude} м</span>
                  <span className="text-xs text-gray-500">Высота</span>
                </div>
                <div className="glass-card p-3 flex flex-col items-center">
                  <Wifi className="w-6 h-6 text-primary mb-1" />
                  <span className="text-sm font-medium">97%</span>
                  <span className="text-xs text-gray-500">Сигнал</span>
                </div>
                <div className="glass-card p-3 flex flex-col items-center">
                  <Wind className="w-6 h-6 text-primary mb-1" />
                  <span className="text-sm font-medium">{mockWeather.windSpeed} км/ч</span>
                  <span className="text-xs text-gray-500">Ветер</span>
                </div>
              </div>

              {/* Погодные условия */}
              {mapLayers.weather && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2 text-gray-900 dark:text-white">Погодные условия</h3>
                  <div className="glass-card p-3">
                    <div className="flex items-center">
                      <CloudRain className="w-10 h-10 text-primary" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {mockWeather.temperature}°C, {mockWeather.weatherCondition === 'partly-cloudy' ? 'Переменная облачность' : 'Ясно'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Влажность: {mockWeather.humidity}%, Видимость: {mockWeather.visibility / 1000} км
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card p-6 text-center">
              <Info className="w-12 h-12 text-primary/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Выберите дрон для просмотра детальной информации</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonitoringPage;