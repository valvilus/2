import React from 'react';
import { Loader } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="text-center">
        <Loader className="w-12 h-12 text-primary animate-spin mx-auto" />
        <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
          Загрузка...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;