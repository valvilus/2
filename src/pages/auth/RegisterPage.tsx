import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationsContext';
import { Loader } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();
  const { addNotification } = useNotifications();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      addNotification({
        type: 'error',
        message: 'Пожалуйста, заполните все поля',
      });
      return;
    }
    
    if (password !== confirmPassword) {
      addNotification({
        type: 'error',
        message: 'Пароли не совпадают',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await register(name, email, password);
      addNotification({
        type: 'success',
        message: 'Вы успешно зарегистрировались',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Произошла ошибка при регистрации',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <h3 className="text-xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        Регистрация
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="label">
            ФИО
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            placeholder="Иванов Иван Иванович"
            disabled={isSubmitting}
          />
        </div>

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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            placeholder="••••••••"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="confirm-password" className="label">
            Подтвердите пароль
          </label>
          <input
            id="confirm-password"
            name="confirm-password"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input"
            placeholder="••••••••"
            disabled={isSubmitting}
          />
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
            Зарегистрироваться
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
            to="/login"
            className="font-medium text-primary hover:text-primary-dark"
          >
            Уже есть аккаунт? Войти
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;