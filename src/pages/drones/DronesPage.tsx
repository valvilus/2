import React, { useState } from 'react';
import { PlusCircle, Filter, Search, MoreVertical, Plane, Edit, Trash2, Zap } from 'lucide-react';
import { Drone } from '../../types';

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
    status: 'active',
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
    status: 'active',
    createdAt: new Date(2024, 2, 20),
    updatedAt: new Date(2024, 2, 20),
  },
  {
    id: '3',
    name: 'DJI Mini 3 Pro',
    model: 'Mini 3 Pro',
    serialNumber: 'MINI3P76513',
    weight: 249,
    maxSpeed: 57,
    maxFlightTime: 34,
    maxAltitude: 4000,
    batteryLevel: 92,
    status: 'inactive',
    createdAt: new Date(2024, 3, 5),
    updatedAt: new Date(2024, 3, 5),
  },
  {
    id: '4',
    name: 'Autel EVO II',
    model: 'EVO II',
    serialNumber: 'EVO2892374',
    weight: 1127,
    maxSpeed: 72,
    maxFlightTime: 40,
    maxAltitude: 7000,
    batteryLevel: 30,
    status: 'maintenance',
    createdAt: new Date(2023, 11, 10),
    updatedAt: new Date(2023, 11, 10),
  },
  {
    id: '5',
    name: 'Skydio 2+',
    model: 'Skydio 2+',
    serialNumber: 'SKY2P45213',
    weight: 800,
    maxSpeed: 58,
    maxFlightTime: 27,
    maxAltitude: 4500,
    batteryLevel: 82,
    status: 'active',
    createdAt: new Date(2024, 4, 12),
    updatedAt: new Date(2024, 4, 12),
  },
];

const DronesPage: React.FC = () => {
  const [drones, setDrones] = useState<Drone[]>(mockDrones);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDrone, setCurrentDrone] = useState<Drone | null>(null);

  // Фильтрация дронов
  const filteredDrones = drones.filter(drone => {
    const matchesSearch = 
      drone.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      drone.model.toLowerCase().includes(searchQuery.toLowerCase()) || 
      drone.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter ? drone.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  // Функция для отображения статуса дрона
  const renderStatus = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs rounded-full bg-success/20 text-success">Активный</span>;
      case 'inactive':
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300">Неактивный</span>;
      case 'maintenance':
        return <span className="px-2 py-1 text-xs rounded-full bg-warning/20 text-warning">Техобслуживание</span>;
      case 'in-flight':
        return <span className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary">В полете</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-800">Неизвестно</span>;
    }
  };

  // Функция для редактирования дрона
  const handleEdit = (drone: Drone) => {
    setCurrentDrone(drone);
    setIsModalOpen(true);
  };

  // Функция для удаления дрона
  const handleDelete = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот дрон?')) {
      setDrones(drones.filter(drone => drone.id !== id));
    }
  };

  // Функция для добавления нового дрона
  const handleAddDrone = () => {
    setCurrentDrone(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Управление дронами</h1>
        <button
          onClick={handleAddDrone}
          className="btn btn-primary flex items-center"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Добавить дрон
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
            placeholder="Поиск по названию, модели или серийному номеру..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex-shrink-0">
          <select
            className="input appearance-none pr-8"
            value={statusFilter || ''}
            onChange={(e) => setStatusFilter(e.target.value || null)}
          >
            <option value="">Все статусы</option>
            <option value="active">Активные</option>
            <option value="inactive">Неактивные</option>
            <option value="maintenance">На техобслуживании</option>
            <option value="in-flight">В полете</option>
          </select>
        </div>
      </div>

      {/* Таблица дронов */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Название
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Модель
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Серийный номер
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Статус
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Батарея
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Макс. время полета
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-transparent divide-y divide-gray-200 dark:divide-gray-700">
              {filteredDrones.map((drone) => (
                <tr key={drone.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Plane className="h-5 w-5 text-primary" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{drone.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{drone.model}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{drone.serialNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStatus(drone.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          (drone.batteryLevel || 0) > 70 
                            ? 'bg-success' 
                            : (drone.batteryLevel || 0) > 30 
                              ? 'bg-warning' 
                              : 'bg-error'
                        }`}
                        style={{ width: `${drone.batteryLevel || 0}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {drone.batteryLevel || 0}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{drone.maxFlightTime} мин</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(drone)}
                        className="text-primary hover:text-primary-dark"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(drone.id)}
                        className="text-error hover:text-error/90"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredDrones.length === 0 && (
          <div className="text-center py-10">
            <Plane className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Дроны не найдены</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Добавьте новый дрон или измените параметры поиска.
            </p>
          </div>
        )}
      </div>

      {/* Модальное окно для добавления/редактирования дрона */}
      {isModalOpen && (
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
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      {currentDrone ? 'Редактировать дрон' : 'Добавить новый дрон'}
                    </h3>
                    <div className="mt-4 space-y-4">
                      {/* Здесь форма для добавления/редактирования дрона */}
                      <div>
                        <label htmlFor="name" className="label">Название</label>
                        <input
                          type="text"
                          id="name"
                          className="input"
                          defaultValue={currentDrone?.name}
                          placeholder="DJI Mavic 3"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="model" className="label">Модель</label>
                          <input
                            type="text"
                            id="model"
                            className="input"
                            defaultValue={currentDrone?.model}
                            placeholder="Mavic 3"
                          />
                        </div>
                        <div>
                          <label htmlFor="serialNumber" className="label">Серийный номер</label>
                          <input
                            type="text"
                            id="serialNumber"
                            className="input"
                            defaultValue={currentDrone?.serialNumber}
                            placeholder="MAV3872341"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="weight" className="label">Вес (г)</label>
                          <input
                            type="number"
                            id="weight"
                            className="input"
                            defaultValue={currentDrone?.weight}
                            placeholder="895"
                          />
                        </div>
                        <div>
                          <label htmlFor="maxSpeed" className="label">Макс. скорость (км/ч)</label>
                          <input
                            type="number"
                            id="maxSpeed"
                            className="input"
                            defaultValue={currentDrone?.maxSpeed}
                            placeholder="68"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="maxFlightTime" className="label">Макс. время полета (мин)</label>
                          <input
                            type="number"
                            id="maxFlightTime"
                            className="input"
                            defaultValue={currentDrone?.maxFlightTime}
                            placeholder="46"
                          />
                        </div>
                        <div>
                          <label htmlFor="maxAltitude" className="label">Макс. высота (м)</label>
                          <input
                            type="number"
                            id="maxAltitude"
                            className="input"
                            defaultValue={currentDrone?.maxAltitude}
                            placeholder="6000"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="status" className="label">Статус</label>
                        <select
                          id="status"
                          className="input"
                          defaultValue={currentDrone?.status}
                        >
                          <option value="active">Активный</option>
                          <option value="inactive">Неактивный</option>
                          <option value="maintenance">На техобслуживании</option>
                          <option value="in-flight">В полете</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="btn btn-primary w-full sm:w-auto sm:ml-3"
                >
                  {currentDrone ? 'Сохранить изменения' : 'Добавить дрон'}
                </button>
                <button
                  type="button"
                  className="btn btn-outline w-full sm:w-auto mt-3 sm:mt-0"
                  onClick={() => setIsModalOpen(false)}
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DronesPage;