import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Shield, Award, Clock, Calendar, MapPin, Mail, Phone, Edit2, Camera, Save } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Иван Петров',
    email: 'ivan@example.com',
    phone: '+7 (777) 123-4567',
    licenseNumber: 'DRL-12345',
    address: 'г. Астана, ул. Примерная, 123',
  });

  const certifications = [
    {
      name: 'Лицензия коммерческого пилота БПЛА',
      issueDate: '2023-01-15',
      expiryDate: '2025-01-15',
      status: 'active',
    },
    {
      name: 'Сертификат ночных полетов',
      issueDate: '2023-03-20',
      expiryDate: '2025-03-20',
      status: 'active',
    },
    {
      name: 'Допуск к полетам в сложных метеоусловиях',
      issueDate: '2023-06-10',
      expiryDate: '2025-06-10',
      status: 'active',
    },
  ];

  const statistics = [
    { label: 'Всего полетов', value: '156', icon: Clock },
    { label: 'Часов налета', value: '243', icon: Calendar },
    { label: 'Успешных полетов', value: '98%', icon: Award },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    // Здесь будет логика сохранения данных
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Профиль пилота</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="btn btn-outline flex items-center"
        >
          {isEditing ? (
            <>
              <Save className="w-5 h-5 mr-2" />
              Сохранить
            </>
          ) : (
            <>
              <Edit2 className="w-5 h-5 mr-2" />
              Редактировать
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Основная информация */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden">
                  <img
                    src={user?.avatar || 'https://i.pravatar.cc/150?img=3'}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-1 rounded-full bg-primary text-white">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {formData.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Лицензия: {formData.licenseNumber}
                </p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/20 text-success mt-2">
                  Активный пилот
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">ФИО</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    className="input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="label">Телефон</label>
                  <input
                    type="tel"
                    className="input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="label">Номер лицензии</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="label">Адрес</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Статистика */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Статистика полетов</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {statistics.map((stat, index) => (
                <div key={index} className="glass p-4 rounded-lg text-center">
                  <stat.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Сертификаты */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Сертификаты и допуски</h3>
            <div className="space-y-4">
              {certifications.map((cert, index) => (
                <div key={index} className="glass p-4 rounded-lg">
                  <div className="flex items-start">
                    <Shield className="w-5 h-5 text-primary mt-1" />
                    <div className="ml-3">
                      <p className="font-medium text-gray-900 dark:text-white">{cert.name}</p>
                      <div className="mt-1 text-sm">
                        <p className="text-gray-500 dark:text-gray-400">
                          Выдан: {new Date(cert.issueDate).toLocaleDateString('ru-RU')}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                          Действует до: {new Date(cert.expiryDate).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/20 text-success mt-2">
                        Активный
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;