import React, { useState } from 'react';
import { Search, Filter, PlusCircle, User, Mail, Phone, MapPin, MoreVertical, Shield } from 'lucide-react';
import { Pilot } from '../../types';

// Мок-данные для демонстрации
const mockPilots: Pilot[] = [
  {
    id: '1',
    fullName: 'Иван Петров',
    email: 'ivan@example.com',
    phone: '+7 (777) 123-4567',
    licenseNumber: 'DRL-12345',
    licenseExpiry: new Date('2025-01-15'),
    experience: 3,
    status: 'active',
    droneIds: ['1', '2'],
    avatar: 'https://i.pravatar.cc/150?img=3',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: '2',
    fullName: 'Мария Сидорова',
    email: 'maria@example.com',
    phone: '+7 (777) 234-5678',
    licenseNumber: 'DRL-23456',
    licenseExpiry: new Date('2025-03-20'),
    experience: 2,
    status: 'active',
    droneIds: ['3'],
    avatar: 'https://i.pravatar.cc/150?img=4',
    createdAt: new Date('2023-02-15'),
    updatedAt: new Date('2023-02-15'),
  },
  {
    id: '3',
    fullName: 'Алексей Волков',
    email: 'alexey@example.com',
    phone: '+7 (777) 345-6789',
    licenseNumber: 'DRL-34567',
    licenseExpiry: new Date('2024-12-10'),
    experience: 5,
    status: 'inactive',
    droneIds: ['4', '5'],
    avatar: 'https://i.pravatar.cc/150?img=5',
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2023-03-10'),
  },
];

const PilotsPage: React.FC = () => {
  const [pilots, setPilots] = useState<Pilot[]>(mockPilots);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedPilot, setSelectedPilot] = useState<Pilot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Фильтрация пилотов
  const filteredPilots = pilots.filter(pilot => {
    const matchesSearch = 
      pilot.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      pilot.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pilot.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter ? pilot.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Пилоты</h1>
        <button className="btn btn-primary flex items-center">
          <PlusCircle className="w-5 h-5 mr-2" />
          Добавить пилота
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
            placeholder="Поиск по имени, email или номеру лицензии..."
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
            <option value="suspended">Заблокированные</option>
          </select>
        </div>
      </div>

      {/* Список пилотов */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPilots.map(pilot => (
          <div key={pilot.id} className="glass-card p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={pilot.avatar}
                    alt={pilot.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {pilot.fullName}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    pilot.status === 'active' ? 'bg-success/20 text-success' :
                    pilot.status === 'inactive' ? 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
                    'bg-error/20 text-error'
                  }`}>
                    {pilot.status === 'active' ? 'Активный' :
                     pilot.status === 'inactive' ? 'Неактивный' :
                     'Заблокирован'}
                  </span>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center text-sm">
                <Shield className="w-4 h-4 text-primary mr-2" />
                <span className="text-gray-600 dark:text-gray-400">
                  Лицензия: {pilot.licenseNumber}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <Mail className="w-4 h-4 text-primary mr-2" />
                <span className="text-gray-600 dark:text-gray-400">{pilot.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="w-4 h-4 text-primary mr-2" />
                <span className="text-gray-600 dark:text-gray-400">{pilot.phone}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Опыт</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {pilot.experience} {pilot.experience === 1 ? 'год' : 
                     pilot.experience < 5 ? 'года' : 'лет'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Дронов</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {pilot.droneIds.length}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Лицензия до</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDate(pilot.licenseExpiry)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPilots.length === 0 && (
        <div className="glass-card p-10 text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Пилоты не найдены
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Измените параметры поиска или добавьте нового пилота.
          </p>
          <button className="btn btn-primary mt-4 inline-flex items-center">
            <PlusCircle className="w-5 h-5 mr-2" />
            Добавить пилота
          </button>
        </div>
      )}
    </div>
  );
};

export default PilotsPage;