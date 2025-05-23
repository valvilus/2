import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Notification as NotificationType } from '../../context/NotificationsContext';

interface NotificationProps {
  notification: NotificationType;
  onClose: (id: string) => void;
}

const Notification: React.FC<NotificationProps> = ({
  notification,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Анимация появления
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose(notification.id);
    }, 300);
  };

  // Определение иконки и цветов в зависимости от типа уведомления
  const getTypeProps = () => {
    switch (notification.type) {
      case 'success':
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          bgColor: 'bg-success/10',
          borderColor: 'border-success',
          textColor: 'text-success',
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          bgColor: 'bg-error/10',
          borderColor: 'border-error',
          textColor: 'text-error',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-5 h-5" />,
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning',
          textColor: 'text-warning',
        };
      case 'info':
      default:
        return {
          icon: <Info className="w-5 h-5" />,
          bgColor: 'bg-primary/10',
          borderColor: 'border-primary',
          textColor: 'text-primary',
        };
    }
  };

  const { icon, bgColor, borderColor, textColor } = getTypeProps();

  return (
    <div
      className={`flex items-start p-4 mb-3 rounded-lg shadow-md border-l-4 ${borderColor} ${bgColor} glass transition-all duration-300 transform ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
      }`}
      role="alert"
    >
      <div className={`flex-shrink-0 ${textColor}`}>{icon}</div>
      <div className="ml-3 flex-grow">
        {notification.title && (
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            {notification.title}
          </h3>
        )}
        <div className="text-sm text-gray-700 dark:text-gray-300">
          {notification.message}
        </div>
      </div>
      <button
        onClick={handleClose}
        className="ml-auto flex-shrink-0 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Notification;