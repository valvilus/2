import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Filter, Search, Clock, CheckCircle, XCircle, Calendar, MapPin, User } from 'lucide-react';
import { FlightApplication } from '../../types';

// Мок-данные для демонстрации
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
  {
    id: '4',
    title: 'Инспекция линий электропередач',
    description: 'Плановая инспекция ЛЭП в северном районе',
    pilotId: '3',
    droneId: '1',
    status: 'completed',
    flightType: 'commercial',
    startTime: new Date(2025, 5, 8, 9, 0),
    endTime: new Date(2025, 5, 8, 12, 0),
    points: [],
    createdAt: new Date(2025, 5, 5),
    updatedAt: new Date(2025, 5, 8),
  },
  {
    id: '5',
    title: 'Мониторинг сельхозугодий',
    description: 'Регулярный мониторинг состояния посевов',
    pilotId: '2',
    droneId: '4',
    status: 'approved',
    flightType: 'research',
    startTime: new Date(2025, 5, 18, 8, 0),
    endTime: new Date(2025, 5, 18, 10, 0),
    points: [],
    createdAt: new Date(2025, 5, 7),
    updatedAt: new Date(2025, 5, 7),
  },
];

const FlightApplicationsPage: React.FC = () => {
  const [flights, setFlights] = useState<FlightApplication[]>(mockFlights);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<FlightApplication | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Фильтрация заявок
  const filteredFlights = flights.filter(flight => {
    const matchesSearch = 
      flight.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      flight.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter ? flight.status === statusFilter : true;
    const matchesType = typeFilter ? flight.flightType === typeFilter : true;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Функция для отображения статуса заявки
  const renderStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <div className="flex items-center text-warning">
            <Clock className="w-4 h-4 mr-1" />
            <span>На рассмотрении</span>
          </div>
        );
      case 'approved':
        return (
          <div className="flex items-center text-success">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span>Одобрена</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center text-error">
            <XCircle className="w-4 h-4 mr-1" />
            <span>Отклонена</span>
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center text-primary">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span>Выполнена</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            <span>Неизвестно</span>
          </div>
        );
    }
  };

  // Функция для отображения типа полета
  const renderFlightType = (type: string) => {
    switch (type) {
      case 'commercial':
        return 'Коммерческий';
      case 'recreational':
        return 'Развлекательный';
      case 'research':
        return 'Исследовательский';
      case 'emergency':
        return 'Экстренный';
      default:
        return 'Неизвестно';
    }
  };

  // Форматирование даты
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Функция для открытия модального окна с деталями заявки
  const openDetailsModal = (flight: FlightApplication) => {
    setSelectedFlight(flight);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Заявки на полеты</h1>
        <Link to="/flights/create" className="btn btn-primary flex items-center">
          <PlusCircle className="w-5 h-5 mr-2" />
          Новая заявка
        </Link>
      </div>

      {/* Панель фильтров и поиска */}
      <div className="flex flex-col md:flex-row gap-4">
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
        <div className="flex gap-2">
          <select
            className="input"
            value={statusFilter || ''}
            onChange={(e) => setStatusFilter(e.target.value || null)}
          >
            <option value="">Все статусы</option>
            <option value="pending">На рассмотрении</option>
            <option value="approved">Одобренные</option>
            <option value="rejected">Отклоненные</option>
            <option value="completed">Выполненные</option>
          </select>
          <select
            className="input"
            value={typeFilter || ''}
            onChange={(e) => setTypeFilter(e.target.value || null)}
          >
            <option value="">Все типы</option>
            <option value="commercial">Коммерческие</option>
            <option value="recreational">Развлекательные</option>
            <option value="research">Исследовательские</option>
            <option value="emergency">Экстренные</option>
          </select>
        </div>
      </div>

      {/* Список заявок */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFlights.map(flight => (
          <div
            key={flight.id}
            className="glass-card p-5 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => openDetailsModal(flight)}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white line-clamp-1">{flight.title}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                flight.status === 'pending' ? 'bg-warning/20 text-warning' :
                flight.status === 'approved' ? 'bg-success/20 text-success' :
                flight.status === 'rejected' ? 'bg-error/20 text-error' :
                flight.status === 'completed' ? 'bg-primary/20 text-primary' :
                'bg-gray-200 text-gray-800'
              }`}>
                {flight.status === 'pending' ? 'На рассмотрении' :
                 flight.status === 'approved' ? 'Одобрено' :
                 flight.status === 'rejected' ? 'Отклонено' :
                 flight.status === 'completed' ? 'Выполнено' :
                 'Неизвестно'}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{flight.description}</p>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{formatDate(flight.startTime)}</span>
              </div>
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <MapPin className="w-4 h-4 mr-2" />
                <span>
                  {flight.flightType === 'commercial' && 'Коммерческий полет'}
                  {flight.flightType === 'recreational' && 'Развлекательный полет'}
                  {flight.flightType === 'research' && 'Исследовательский полет'}
                  {flight.flightType === 'emergency' && 'Экстренный полет'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredFlights.length === 0 && (
        <div className="glass-card p-10 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Заявки не найдены</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Измените параметры поиска или создайте новую заявку.
          </p>
          <Link to="/flights/create" className="btn btn-primary mt-4 inline-flex items-center">
            <PlusCircle className="w-5 h-5 mr-2" />
            Создать заявку
          </Link>
        </div>
      )}

      {/* Модальное окно с деталями заявки */}
      {isDetailsModalOpen && selectedFlight && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom glass rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center justify-between">
                      {selectedFlight.title}
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedFlight.status === 'pending' ? 'bg-warning/20 text-warning' :
                        selectedFlight.status === 'approved' ? 'bg-success/20 text-success' :
                        selectedFlight.status === 'rejected' ? 'bg-error/20 text-error' :
                        selectedFlight.status === 'completed' ? 'bg-primary/20 text-primary' :
                        'bg-gray-200 text-gray-800'
                      }`}>
                        {selectedFlight.status === 'pending' ? 'На рассмотрении' :
                         selectedFlight.status === 'approved' ? 'Одобрено' :
                         selectedFlight.status === 'rejected' ? 'Отклонено' :
                         selectedFlight.status === 'completed' ? 'Выполнено' :
                         'Неизвестно'}
                      </span>
                    </h3>
                    <div className="mt-4 space-y-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedFlight.description}
                      </p>
                      
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
                          <div className="col-span-1">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Тип полета</dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                              {renderFlightType(selectedFlight.flightType)}
                            </dd>
                          </div>
                          <div className="col-span-1">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">ID пилота</dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                              {selectedFlight.pilotId}
                            </dd>
                          </div>
                          <div className="col-span-1">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">ID дрона</dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                              {selectedFlight.droneId}
                            </dd>
                          </div>
                          <div className="col-span-1">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Дата создания</dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                              {formatDate(selectedFlight.createdAt)}
                            </dd>
                          </div>
                          <div className="col-span-2">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Время полета</dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                              {formatDate(selectedFlight.startTime)} - {formatDate(selectedFlight.endTime)}
                            </dd>
                          </div>
                          
                          {selectedFlight.rejectionReason && (
                            <div className="col-span-2">
                              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Причина отклонения</dt>
                              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                {selectedFlight.rejectionReason}
                              </dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {selectedFlight.status === 'pending' && (
                  <>
                    <button
                      type="button"
                      className="btn btn-success w-full sm:w-auto sm:ml-3"
                    >
                      Одобрить
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger w-full sm:w-auto mt-3 sm:mt-0 sm:ml-3"
                    >
                      Отклонить
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className="btn btn-outline w-full sm:w-auto mt-3 sm:mt-0"
                  onClick={() => setIsDetailsModalOpen(false)}
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightApplicationsPage;