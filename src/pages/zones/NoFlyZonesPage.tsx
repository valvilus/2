import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Popup, useMapEvents, useMap } from 'react-leaflet';
import { AlertTriangle, PlusCircle, Search, Filter, MapPin, Clock, Shield, X, Save, Trash2, Edit2, Target, Calendar, Info } from 'lucide-react';
import { NoFlyZone } from '../../types';
import Nominatim from 'nominatim-geocoder';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import 'leaflet/dist/leaflet.css';

// Initialize geocoder
const geocoder = new Nominatim();

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

interface MapControlProps {
  center: [number, number];
  zoom: number;
}

const MapControl: React.FC<MapControlProps> = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
};

interface DrawingMapProps {
  onLocationSelect: (lat: number, lng: number) => void;
  selectedLocation: { lat: number; lng: number } | null;
  radius: number;
}

const DrawingMap: React.FC<DrawingMapProps> = ({ onLocationSelect, selectedLocation, radius }) => {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return selectedLocation ? (
    <Circle
      center={[selectedLocation.lat, selectedLocation.lng]}
      radius={radius}
      pathOptions={{
        color: '#ff4444',
        fillColor: '#ff4444',
        fillOpacity: 0.2,
      }}
    />
  ) : null;
};

interface NoFlyZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  zone: NoFlyZone | null;
  onSave: (zone: Partial<NoFlyZone>) => void;
}

const NoFlyZoneModal: React.FC<NoFlyZoneModalProps> = ({
  isOpen,
  onClose,
  zone,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: zone?.name || '',
    description: zone?.description || '',
    type: zone?.type || 'permanent',
    maxAltitude: zone?.maxAltitude || 500,
    radius: zone?.radius || 1000,
    address: '',
    location: zone?.polygon[0] || null,
    startDate: zone?.startDate ? format(zone.startDate, 'yyyy-MM-dd') : '',
    endDate: zone?.endDate ? format(zone.endDate, 'yyyy-MM-dd') : '',
  });

  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    zone?.polygon[0] ? { lat: zone.polygon[0].latitude, lng: zone.polygon[0].longitude } : null
  );

  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([51.1694, 71.4491]);
  const [mapZoom, setMapZoom] = useState(12);

  const searchAddress = async (query: string) => {
    if (query.length < 3) {
      setAddressSuggestions([]);
      return;
    }

    try {
      const results = await geocoder.search({ q: query + ' Астана Казахстан' });
      setAddressSuggestions(results.slice(0, 5));
    } catch (error) {
      console.error('Error searching address:', error);
    }
  };

  const handleAddressSelect = async (address: any) => {
    setFormData(prev => ({
      ...prev,
      address: address.display_name,
      location: {
        latitude: parseFloat(address.lat),
        longitude: parseFloat(address.lon),
      },
    }));
    setSelectedLocation({
      lat: parseFloat(address.lat),
      lng: parseFloat(address.lon),
    });
    setMapCenter([parseFloat(address.lat), parseFloat(address.lon)]);
    setMapZoom(16);
    setAddressSuggestions([]);
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setFormData(prev => ({
      ...prev,
      location: { latitude: lat, longitude: lng },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.location) {
      alert('Пожалуйста, выберите местоположение на карте');
      return;
    }
    
    const zoneData = {
      ...formData,
      polygon: [formData.location],
      status: 'active',
      startDate: formData.type === 'temporary' && formData.startDate ? new Date(formData.startDate) : undefined,
      endDate: formData.type === 'temporary' && formData.endDate ? new Date(formData.endDate) : undefined,
    };
    
    onSave(zoneData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
        
        <div className="relative w-full max-w-4xl rounded-lg bg-white dark:bg-gray-800 shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {zone ? 'Редактирование запретной зоны' : 'Добавление запретной зоны'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="label">Название зоны</label>
                  <input
                    type="text"
                    id="name"
                    className="input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Например: Аэропорт"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="label">Описание</label>
                  <textarea
                    id="description"
                    className="input h-24"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Опишите причину ограничения полетов"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="type" className="label">Тип зоны</label>
                    <select
                      id="type"
                      className="input"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as 'permanent' | 'temporary' })}
                      required
                    >
                      <option value="permanent">Постоянная</option>
                      <option value="temporary">Временная</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="maxAltitude" className="label">Макс. высота (м)</label>
                    <input
                      type="number"
                      id="maxAltitude"
                      className="input"
                      value={formData.maxAltitude}
                      onChange={(e) => setFormData({ ...formData, maxAltitude: parseInt(e.target.value) })}
                      min="0"
                      required
                    />
                  </div>
                </div>

                {formData.type === 'temporary' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="startDate" className="label">Дата начала</label>
                      <input
                        type="date"
                        id="startDate"
                        className="input"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="endDate" className="label">Дата окончания</label>
                      <input
                        type="date"
                        id="endDate"
                        className="input"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="radius" className="label">Радиус зоны (м)</label>
                  <input
                    type="range"
                    id="radius"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    min="100"
                    max="10000"
                    step="100"
                    value={formData.radius}
                    onChange={(e) => setFormData({ ...formData, radius: parseInt(e.target.value) })}
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-500">{formData.radius} м</span>
                    <input
                      type="number"
                      className="input w-24 text-right"
                      value={formData.radius}
                      onChange={(e) => setFormData({ ...formData, radius: parseInt(e.target.value) })}
                      min="100"
                      max="10000"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="label">Адрес</label>
                  <div className="relative">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        id="address"
                        className="input flex-grow"
                        value={formData.address}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({ ...formData, address: value });
                          searchAddress(value);
                        }}
                        placeholder="Введите адрес для поиска"
                      />
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => searchAddress(formData.address)}
                      >
                        <Target className="w-5 h-5" />
                      </button>
                    </div>
                    {addressSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                        {addressSuggestions.map((address, index) => (
                          <button
                            key={index}
                            type="button"
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
                            onClick={() => handleAddressSelect(address)}
                          >
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {address.display_name}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="h-[500px] glass-card overflow-hidden">
                <MapContainer
                  center={mapCenter}
                  zoom={mapZoom}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <MapControl center={mapCenter} zoom={mapZoom} />
                  <DrawingMap
                    onLocationSelect={handleLocationSelect}
                    selectedLocation={selectedLocation}
                    radius={formData.radius}
                  />
                </MapContainer>
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-gray-800/90 p-3 rounded-lg backdrop-blur-sm">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <Target className="w-4 h-4 inline mr-2" />
                    Кликните на карте, чтобы выбрать центр запретной зоны
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="btn btn-primary flex items-center"
              >
                <Save className="w-5 h-5 mr-2" />
                {zone ? 'Сохранить изменения' : 'Создать зону'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const NoFlyZonesPage: React.FC = () => {
  const [zones, setZones] = useState<NoFlyZone[]>(mockZones);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<NoFlyZone | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredZones = zones.filter(zone => {
    const matchesSearch = 
      zone.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      zone.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter ? zone.type === typeFilter : true;
    
    return matchesSearch && matchesType;
  });

  const formatDate = (date: Date) => {
    return format(date, 'd MMMM yyyy', { locale: ru });
  };

  const handleAddZone = () => {
    setSelectedZone(null);
    setIsModalOpen(true);
  };

  const handleEditZone = (zone: NoFlyZone) => {
    setSelectedZone(zone);
    setIsModalOpen(true);
  };

  const handleDeleteZone = (zoneId: string) => {
    if (confirm('Вы уверены, что хотите удалить эту зону?')) {
      setZones(zones.filter(zone => zone.id !== zoneId));
    }
  };

  const handleSaveZone = (zoneData: Partial<NoFlyZone>) => {
    if (selectedZone) {
      setZones(zones.map(zone =>
        zone.id === selectedZone.id ? { ...zone, ...zoneData, updatedAt: new Date() } : zone
      ));
    } else {
      const newZone: NoFlyZone = {
        id: Math.random().toString(36).substr(2, 9),
        ...zoneData,
        status: 'active',
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as NoFlyZone;
      setZones([...zones, newZone]);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Запретные зоны</h1>
        <button
          onClick={handleAddZone}
          className="btn btn-primary flex items-center"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Добавить зону
        </button>
      </div>

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
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      zone.type === 'permanent' 
                        ? 'bg-error/20 text-error' 
                        : 'bg-warning/20 text-warning'
                    }`}>
                      <Shield className="w-3 h-3 mr-1" />
                      {zone.type === 'permanent' ? 'Постоянная' : 'Временная'}
                    </span>
                    {zone.type === 'temporary' && zone.startDate && zone.endDate && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(zone.startDate)}
                      </span>
                    )}
                  </div>
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

                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditZone(zone);
                    }}
                    className="text-primary hover:text-primary-dark"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteZone(zone.id);
                    }}
                    className="text-error hover:text-error/90"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
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

      <NoFlyZoneModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        zone={selectedZone}
        onSave={handleSaveZone}
      />
    </div>
  );
};

export default NoFlyZonesPage;