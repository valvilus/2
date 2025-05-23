import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plane, Users, FileText, MapPin, AlertCircle, BarChart3, PlusCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { FlightApplication, Drone, Pilot } from '../../types';
import FlightActivityChart from '../../components/analytics/FlightActivityChart';
import DroneUsageChart from '../../components/analytics/DroneUsageChart';

const mockFlights: FlightApplication[] = [
  {
    id: '1',
    title: 'Картографирование территории',
    description: 'Картографирование сельскохозяйственных угодий',
    pilotId: '1',
    droneId: '1',
    status: 'pending',
    flightType: 'commercial',
    startTime: new Date(2025, 5, 15, 9, 0),
    endTime: new Date(2025, 5, 15, 11, 0),
    points: [],
    createdAt: new Date(2025, 5, 10),
    updatedAt: new Date(2025, 5, 10),
  },
  {
    id: '2',
    title: 'Доставка медикаментов',
    description: 'Срочная доставка медикаментов в отдаленный район',
    pilotId: '2',
    droneId: '2',
    status: 'approved',
    flightType: 'emergency',
    startTime: new Date(2025, 5, 14, 10, 0),
    endTime: new Date(2025, 5, 14, 11, 30),
    points: [],
    createdAt: new Date(2025, 5, 9),
    updatedAt: new Date(2025, 5, 11),
  },
  {
    id: '3',
    title: 'Видеосъемка мероприятия',
    description: 'Видеосъемка городского праздника',
    pilotId: '1',
    droneId: '3',
    status: 'rejected',
    flightType: 'commercial',
    startTime: new Date(2025, 5, 20, 12, 0),
    endTime: new Date(2025, 5, 20, 15, 0),
    points: [],
    rejectionReason: 'Полет в запретной зоне',
    createdAt: new Date(2025, 5, 8),
    updatedAt: new Date(2025, 5, 12),
  },
];

const mockActiveDrones: Drone[] = [
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
    createdAt: new Date(2024, 2, 20),
    updatedAt: new Date(2024, 2, 20),
  },
];

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalDrones: 14,
    activeDrones: 2,
    totalPilots: 8,
    pendingFlights: 5,
    approvedFlights: 12,
    rejectedFlights: 3,
  });
  const [activeChart, setActiveChart] = useState<'activity' | 'usage'>('activity');
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');

  const StatCard = ({ icon, title, value, color }: { icon: React.ReactNode; title: string; value: number; color: string }) => (
    <div className="glass-card p-6 flex items-center">
      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );

  const FlightCard = ({ flight }: { flight: FlightApplication }) => {
    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    };

    const getStatusBadge = (status: string) => {
      switch (status) {
        case 'pending':
          return <span className="px-2 py-1 text-xs rounded-full bg-warning/20 text-warning">На рассмотрении</span>;
        case 'approved':
          return <span className="px-2 py-1 text-xs rounded-full bg-success/20 text-success">Одобрена</span>;
        case 'rejected':
          return <span className="px-2 py-1 text-xs rounded-full bg-error/20 text-error">Отклонена</span>;
        default:
          return <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-800">Неизвестно</span>;
      }
    };

    return (
      <div className="glass-card p-4 hover:shadow-xl transition-shadow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-gray-900 dark:text-white">{flight.title}</h3>
          {getStatusBadge(flight.status)}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{flight.description}</p>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Начало: {formatDate(flight.startTime)}</span>
          <span>Тип: {flight.flightType === 'commercial' ? 'Коммерческий' : flight.flightType === 'emergency' ? 'Экстренный' : 'Другой'}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Панель управления</h1>
        <Link to="/flights/create" className="btn btn-primary flex items-center">
          <PlusCircle className="w-5 h-5 mr-2" />
          Новая заявка
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={<Plane className="w-6 h-6 text-white" />}
          title="Всего дронов"
          value={stats.totalDrones}
          color="bg-primary"
        />
        <StatCard
          icon={<Users className="w-6 h-6 text-white" />}
          title="Всего пилотов"
          value={stats.totalPilots}
          color="bg-secondary"
        />
        <StatCard
          icon={<FileText className="w-6 h-6 text-white" />}
          title="Ожидающие заявки"
          value={stats.pendingFlights}
          color="bg-warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Активные дроны</h2>
            <Link to="/monitoring" className="text-primary hover:text-primary-dark flex items-center text-sm">
              Показать все
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {mockActiveDrones.map(drone => (
              <div key={drone.id} className="flex items-center p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-success mr-2"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{drone.name}</p>
                  <div className="flex text-xs text-gray-500 dark:text-gray-400">
                    <span className="mr-3">SN: {drone.serialNumber}</span>
                    <span>Батарея: {drone.batteryLevel}%</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">В полете</span>
                </div>
              </div>
            ))}
            
            {mockActiveDrones.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-6">
                Нет активных дронов
              </p>
            )}
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Последние заявки</h2>
            <Link to="/flights" className="text-primary hover:text-primary-dark flex items-center text-sm">
              Показать все
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {mockFlights.map(flight => (
              <FlightCard key={flight.id} flight={flight} />
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Аналитика</h2>
          <div className="flex space-x-2">
            <button 
              className={`btn ${timeRange === 'day' ? 'btn-primary' : 'btn-outline'} text-sm py-1 px-3`}
              onClick={() => setTimeRange('day')}
            >
              День
            </button>
            <button 
              className={`btn ${timeRange === 'week' ? 'btn-primary' : 'btn-outline'} text-sm py-1 px-3`}
              onClick={() => setTimeRange('week')}
            >
              Неделя
            </button>
            <button 
              className={`btn ${timeRange === 'month' ? 'btn-primary' : 'btn-outline'} text-sm py-1 px-3`}
              onClick={() => setTimeRange('month')}
            >
              Месяц
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex space-x-4 mb-4">
            <button
              className={`btn ${activeChart === 'activity' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveChart('activity')}
            >
              Активность полетов
            </button>
            <button
              className={`btn ${activeChart === 'usage' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveChart('usage')}
            >
              Использование дронов
            </button>
          </div>

          {activeChart === 'activity' ? (
            <FlightActivityChart />
          ) : (
            <DroneUsageChart />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;