import React, { createContext, useContext, useState, useEffect } from 'react';

// Типы темы
export type ThemeMode = 'light' | 'dark' | 'auto';

// Интерфейс контекста темы
interface ThemeContextType {
  theme: ThemeMode;
  isDarkMode: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

// Создание контекста
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Провайдер темы
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Инициализация темы из localStorage или по умолчанию 'light'
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem('utm_theme') as ThemeMode;
    return savedTheme || 'light';
  });
  
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Эффект для установки класса темы на документе
  useEffect(() => {
    // Сохранение выбранной темы в localStorage
    localStorage.setItem('utm_theme', theme);

    const updateThemeClass = () => {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const shouldBeDark = 
        theme === 'dark' || 
        (theme === 'auto' && isSystemDark);
      
      setIsDarkMode(shouldBeDark);
      
      if (shouldBeDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    updateThemeClass();

    // Слушатель для изменения системной темы
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'auto') {
        updateThemeClass();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Функция для установки темы
  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  // Функция для переключения темы
  const toggleTheme = () => {
    setThemeState(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'auto';
      return 'light';
    });
  };

  const value = {
    theme,
    isDarkMode,
    setTheme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Хук для использования контекста темы
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme должен использоваться внутри ThemeProvider');
  }
  return context;
};