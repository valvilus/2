import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationsContext';
import { Loader } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const { addNotification } = useNotifications();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      addNotification({
        type: 'error',
        message: 'Пожалуйста, заполните все поля',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      addNotification({
        type: 'success',
        message: 'Вы успешно вошли в систему',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Произошла ошибка при входе',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <h3 className="text-xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        Вход в систему
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="example@mail.com"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="password" className="label">
            Пароль
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            placeholder="••••••••"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Запомнить меня
            </label>
          </div>

          <div className="text-sm">
            <a href="#" className="font-medium text-primary hover:text-primary-dark">
              Забыли пароль?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="btn btn-primary w-full flex justify-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader className="w-5 h-5 animate-spin mr-2" />
            ) : null}
            Войти
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              Или
            </span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/register"
            className="font-medium text-primary hover:text-primary-dark"
          >
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;