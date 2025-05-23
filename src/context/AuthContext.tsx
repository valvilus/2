import React, { createContext, useContext, useState, useEffect } from 'react';

// Типы ролей пользователей
export type UserRole = 'admin' | 'controller' | 'dispatcher' | 'operator' | 'pilot' | 'observer' | 'support';

// Интерфейс пользователя
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Интерфейс контекста авторизации
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (requiredRole: UserRole | UserRole[]) => boolean;
}

// Создание контекста
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Мок-данные для демонстрации
const MOCK_USER: User = {
  id: '1',
  name: 'Иван Петров',
  email: 'ivan@example.com',
  role: 'dispatcher',
  avatar: 'https://i.pravatar.cc/150?img=3'
};

// Провайдер авторизации
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Проверка авторизации при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Имитация запроса к API
        const storedUser = localStorage.getItem('utm_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Ошибка при проверке авторизации:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Функция входа
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Имитация запроса к API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // В реальном приложении здесь будет запрос к серверу
      const user = MOCK_USER;
      
      setUser(user);
      localStorage.setItem('utm_user', JSON.stringify(user));
    } catch (error) {
      console.error('Ошибка при входе:', error);
      throw new Error('Неверный email или пароль');
    } finally {
      setIsLoading(false);
    }
  };

  // Функция регистрации
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Имитация запроса к API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // В реальном приложении здесь будет запрос к серверу
      const user: User = {
        ...MOCK_USER,
        name,
        email,
      };
      
      setUser(user);
      localStorage.setItem('utm_user', JSON.stringify(user));
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      throw new Error('Не удалось зарегистрировать пользователя');
    } finally {
      setIsLoading(false);
    }
  };

  // Функция выхода
  const logout = () => {
    setUser(null);
    localStorage.removeItem('utm_user');
  };

  // Проверка разрешений
  const hasPermission = (requiredRole: UserRole | UserRole[]) => {
    if (!user) return false;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role);
    }
    
    return user.role === requiredRole || user.role === 'admin';
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Хук для использования контекста авторизации
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};