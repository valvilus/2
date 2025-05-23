import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from 'react-leaflet';
import { Plane, Calendar, Clock, Info, MapPin, Plus, X, Save } from 'lucide-react';
import { useNotifications } from '../../context/NotificationsContext';
import 'leaflet/dist/leaflet.css';
import { FlightPoint } from '../../types';

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

// Компонент для добавления точек на карту
const AddWaypoints = ({ waypoints, setWaypoints }: { 
  waypoints: FlightPoint[]; 
  setWaypoints: React.Dispatch<React.SetStateAction<FlightPoint[]>>;
}) => {
  // Обработчик событий карты
  useMapEvents({
    click: (e) => {
      const newPoint: FlightPoint = {
        id: Date.now().toString(),
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
        altitude: 100, // Значение по умолчанию
        pointType: waypoints.length === 0 ? 'takeoff' : waypoints.length === 1 ? 'waypoint' : 'landing',
      };
      
      setWaypoints((prev) => [...prev, newPoint]);
    },
  });
  
  return null;
};

const CreateFlightPage: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  
  // Состояние формы
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [droneId, setDroneId] = useState('');
  const [flightType, setFlightType] = useState('commercial');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [waypoints, setWaypoints] = useState<FlightPoint[]>([]);
  
  // Обработка отправки формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !droneId || !flightType || !startDate || !startTime || !endDate || !endTime) {
      addNotification({
        type: 'error',
        message: 'Пожалуйста, заполните все обязательные поля',
      });
      return;
    }
    
    if (waypoints.length < 2) {
      addNotification({
        type: 'error',
        message: 'Необходимо указать как минимум точку взлета и посадки',
      });
      return;
    }
    
    // Здесь будет логика отправки заявки на сервер
    addNotification({
      type: 'success',
      message: 'Заявка на полет успешно создана',
    });
    
    // Перенаправление на страницу заявок
    navigate('/flights');
  };
  
  // Удаление точки маршрута
  const removeWaypoint = (id: string) => {
    setWaypoints(waypoints.filter(point => point.id !== id));
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Создание заявки на полет</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Левая колонка - основная информация */}
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold mb-4">Основная информация</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="label">Название полета*</label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input"
                    placeholder="Например: Мониторинг сельхозугодий"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="label">Описание*</label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input h-24"
                    placeholder="Опишите цель и детали полета"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="droneId" className="label">Выберите дрон*</label>
                  <select
                    id="droneId"
                    value={droneId}
                    onChange={(e) => setDroneId(e.target.value)}
                    className="input"
                    required
                  >
                    <option value="">Выберите дрон</option>
                    <option value="1">DJI Mavic 3</option>
                    <option value="2">DJI Air 2S</option>
                    <option value="3">DJI Mini 3 Pro</option>
                    <option value="4">Autel EVO II</option>
                    <option value="5">Skydio 2+</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="flightType" className="label">Тип полета*</label>
                  <select
                    id="flightType"
                    value={flightType}
                    onChange={(e) => setFlightType(e.target.value)}
                    className="input"
                    required
                  >
                    <option value="commercial">Коммерческий</option>
                    <option value="recreational">Развлекательный</option>
                    <option value="research">Исследовательский</option>
                    <option value="emergency">Экстренный</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold mb-4">Время полета</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startDate" className="label">Дата начала*</label>
                    <input
                      type="date"
                      id="startDate"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="startTime" className="label">Время начала*</label>
                    <input
                      type="time"
                      id="startTime"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="input"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="endDate" className="label">Дата окончания*</label>
                    <input
                      type="date"
                      id="endDate"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="endTime" className="label">Время окончания*</label>
                    <input
                      type="time"
                      id="endTime"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="input"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold mb-4">Точки маршрута</h2>
              
              {waypoints.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {waypoints.map((point, index) => (
                    <div key={point.id} className="flex items-center bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        {index === 0 ? (
                          <span className="text-primary font-bold">A</span>
                        ) : index === waypoints.length - 1 ? (
                          <span className="text-primary font-bold">B</span>
                        ) : (
                          <span className="text-primary">{index}</span>
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {point.pointType === 'takeoff' ? 'Точка взлета' : 
                           point.pointType === 'landing' ? 'Точка посадки' : 
                           'Промежуточная точка'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {point.latitude.toFixed(6)}, {point.longitude.toFixed(6)}, {point.altitude}м
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeWaypoint(point.id)}
                        className="flex-shrink-0 text-gray-400 hover:text-error transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Info className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Отметьте точки маршрута на карте справа
                  </p>
                </div>
              )}
              
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <Info className="w-4 h-4 mr-1" />
                Первая точка будет считаться точкой взлета, последняя - точкой посадки
              </div>
            </div>
          </div>
          
          {/* Правая колонка - карта */}
          <div className="glass-card overflow-hidden" style={{ height: "calc(100vh - 14rem)" }}>
            <MapContainer 
              center={[51.1694, 71.4491]} 
              zoom={12} 
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              
              {/* Запретные зоны */}
              {mockNoFlyZones.map(zone => (
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
              
              {/* Маркеры точек маршрута */}
              {waypoints.map((point, index) => (
                <Marker
                  key={point.id}
                  position={[point.latitude, point.longitude]}
                >
                  <Popup>
                    <div>
                      <h3 className="font-bold">
                        {point.pointType === 'takeoff' ? 'Точка взлета' : 
                         point.pointType === 'landing' ? 'Точка посадки' : 
                         'Точка маршрута ' + index}
                      </h3>
                      <p>Координаты: {point.latitude.toFixed(6)}, {point.longitude.toFixed(6)}</p>
                      <p>Высота: {point.altitude} м</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
              
              {/* Компонент для добавления точек на карту */}
              <AddWaypoints waypoints={waypoints} setWaypoints={setWaypoints} />
            </MapContainer>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate('/flights')}
          >
            Отмена
          </button>
          <button
            type="submit"
            className="btn btn-primary flex items-center"
          >
            <Save className="w-5 h-5 mr-2" />
            Создать заявку
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateFlightPage;