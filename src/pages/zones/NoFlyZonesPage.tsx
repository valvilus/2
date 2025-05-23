import React, { useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import { AlertTriangle, PlusCircle, Search, Filter, MapPin, Clock, Shield } from 'lucide-react';
import { NoFlyZone } from '../../types';
import 'leaflet/dist/leaflet.css';

// Мок-данные для демонстрации
const mockZones = [
  {
    id: '1',
    name: 'Аэропорт Астаны',
    description: 'Зона ограничения полетов вокруг международного аэропорта',
    type: 'permanent',
    minAltitude: 0,
    maxAltitude: 1000,
    polygon: [
      { latitude: 51.0222, longitude: 71.4669 }
    ],
    radius: 5000,
    status: 'active',
    createdBy: 'admin',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: '2',
    name: 'Акорда',
    description: 'Запретная зона для полетов над правительственными зданиями',
    type: 'permanent',
    minAltitude: 0,
    maxAltitude: 500,
    polygon: [
      { latitude: 51.1282, longitude: 71.4309 }
    ],
    radius: 1000,
    status: 'active',
    createdBy: 'admin',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: '3',
    name: 'Массовое мероприятие',
    description: 'Временное ограничение полетов на время проведения мероприятия',
    type: 'temporary',
    startDate: new Date('2025-06-01'),
    endDate: new Date('2025-06-02'),
    minAltitude: 0,
    maxAltitude: 300,
    polygon: [
      { latitude: 51.1694, longitude: 71.4491 }
    ],
    radius: 800,
    status: 'active',
    createdBy: 'admin',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
];

const NoFlyZonesPage: React.FC = () => {
  const [zones, setZones] = useState(mockZones);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<NoFlyZone | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Фильтрация зон
  const filteredZones = zones.filter(zone => {
    const matchesSearch = 
      zone.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      zone.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter ? zone.type === typeFilter : true;
    
    return matchesSearch && matchesType;
  });

  // Форматирование даты
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Запретные зоны</h1>
        <button className="btn btn-primary flex items-center">
          <PlusCircle className="w-5 h-5 mr-2" />
          Добавить зону
        </button>
      </div>

      {/* Панель фильтров и поиска */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="input pl-10"
            placeholder="Поиск по названию или описанию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex-shrink-0">
          <select
            className="input appearance-none pr-8"
            value={typeFilter || ''}
            onChange={(e) => setTypeFilter(e.target.value || null)}
          >
            <option value="">Все типы</option>
            <option value="permanent">Постоянные</option>
            <option value="temporary">Временные</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Список зон */}
        <div className="glass-card p-4 lg:col-span-1 max-h-[calc(100vh-13rem)] overflow-y-auto">
          <div className="space-y-4">
            {filteredZones.map(zone => (
              <div
                key={zone.id}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedZone?.id === zone.id
                    ? 'bg-primary/10 border border-primary/50'
                    : 'glass hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                }`}
                onClick={() => setSelectedZone(zone)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {zone.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {zone.description}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    zone.type === 'permanent' 
                      ? 'bg-error/20 text-error' 
                      : 'bg-warning/20 text-warning'
                  }`}>
                    {zone.type === 'permanent' ? 'Постоянная' : 'Временная'}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>Радиус: {zone.radius}м</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Shield className="w-4 h-4 mr-1" />
                    <span>{zone.maxAltitude}м</span>
                  </div>
                </div>

                {zone.type === 'temporary' && zone.startDate && zone.endDate && (
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>
                        {formatDate(zone.startDate)} - {formatDate(zone.endDate)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filteredZones.length === 0 && (
              <div className="text-center py-10">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Зоны не найдены
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Карта */}
        <div className="glass-card overflow-hidden lg:col-span-2" style={{ height: "calc(100vh - 13rem)" }}>
          <MapContainer 
            center={[51.1694, 71.4491]} 
            zoom={12} 
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            
            {filteredZones.map(zone => (
              <Circle
                key={zone.id}
                center={[zone.polygon[0].latitude, zone.polygon[0].longitude]}
                radius={zone.radius}
                pathOptions={{ 
                  color: zone.type === 'permanent' ? '#ff4444' : '#ff8800',
                  fillColor: zone.type === 'permanent' ? '#ff4444' : '#ff8800',
                  fillOpacity: selectedZone?.id === zone.id ? 0.4 : 0.2
                }}
                eventHandlers={{
                  click: () => setSelectedZone(zone)
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold">{zone.name}</h3>
                    <p className="text-sm">{zone.description}</p>
                    <p className="text-sm mt-2">
                      Максимальная высота: {zone.maxAltitude}м
                    </p>
                    {zone.type === 'temporary' && zone.startDate && zone.endDate && (
                      <p className="text-sm mt-2">
                        Период: {formatDate(zone.startDate)} - {formatDate(zone.endDate)}
                      </p>
                    )}
                  </div>
                </Popup>
              </Circle>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default NoFlyZonesPage;