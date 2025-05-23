import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingScreen from '../ui/LoadingScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, isLoading, user, hasPermission } = useAuth();

  // Показываем загрузку, пока проверяем авторизацию
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Если указана необходимая роль, проверяем права доступа
  if (requiredRole && !hasPermission(requiredRole as any)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Если все проверки пройдены, отображаем дочерние компоненты
  return <>{children}</>;
};

export default ProtectedRoute;