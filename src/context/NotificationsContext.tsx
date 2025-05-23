import React, { createContext, useContext, useState, useEffect } from 'react';

// Типы уведомлений
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

// Интерфейс уведомления
export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  autoClose?: boolean;
  duration?: number;
  createdAt: Date;
}

// Интерфейс контекста уведомлений
interface NotificationsContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

// Создание контекста
const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

// Провайдер уведомлений
export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Эффект для автоматического закрытия уведомлений
  useEffect(() => {
    const timers = notifications
      .filter(notification => notification.autoClose !== false)
      .map(notification => {
        const duration = notification.duration || 5000; // По умолчанию 5 секунд
        return setTimeout(() => {
          removeNotification(notification.id);
        }, duration);
      });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [notifications]);

  // Добавление уведомления
  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      autoClose: notification.autoClose !== false,
      createdAt: new Date(),
    };

    setNotifications(prev => [...prev, newNotification]);
  };

  // Удаление уведомления
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Очистка всех уведомлений
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

// Хук для использования контекста уведомлений
export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications должен использоваться внутри NotificationsProvider');
  }
  return context;
};