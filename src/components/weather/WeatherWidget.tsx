import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getWeather } from '../../services/weatherService';
import { Cloud, CloudRain, Wind, Droplets, Eye, ArrowUp } from 'lucide-react';

interface WeatherWidgetProps {
  latitude: number;
  longitude: number;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ latitude, longitude }) => {
  const { data: weather, isLoading, error } = useQuery({
    queryKey: ['weather', latitude, longitude],
    queryFn: () => getWeather(latitude, longitude),
    refetchInterval: 300000, // Обновление каждые 5 минут
  });

  if (isLoading) {
    return (
      <div className="glass-card p-4 animate-pulse">
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="glass-card p-4">
        <p className="text-error">Ошибка загрузки погоды</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Погодные условия</h3>
        <img 
          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          alt={weather.description}
          className="w-12 h-12"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <Cloud className="w-5 h-5 text-primary mr-2" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Температура</p>
            <p className="font-medium">{weather.temperature}°C</p>
          </div>
        </div>

        <div className="flex items-center">
          <Wind className="w-5 h-5 text-primary mr-2" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Ветер</p>
            <div className="flex items-center">
              <p className="font-medium">{weather.windSpeed} м/с</p>
              <ArrowUp 
                className="w-4 h-4 ml-1" 
                style={{ transform: `rotate(${weather.windDirection}deg)` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <Droplets className="w-5 h-5 text-primary mr-2" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Влажность</p>
            <p className="font-medium">{weather.humidity}%</p>
          </div>
        </div>

        <div className="flex items-center">
          <Eye className="w-5 h-5 text-primary mr-2" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Видимость</p>
            <p className="font-medium">{(weather.visibility / 1000).toFixed(1)} км</p>
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 capitalize">
        {weather.description}
      </p>
    </div>
  );
};

export default WeatherWidget;