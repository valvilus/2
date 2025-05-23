import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { Plane } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import NotificationsContainer from '../components/ui/NotificationsContainer'

const AuthLayout: React.FC = () => {
	const { isAuthenticated, isLoading } = useAuth()

	// Если пользователь уже авторизован, перенаправляем на дашборд
	if (isAuthenticated && !isLoading) {
		return <Navigate to="/dashboard" replace />
	}

	return (
		<div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<div className="flex items-center justify-center">
					<Plane className="h-12 w-12 text-primary" />
				</div>
				<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
					FlyNetics
				</h2>
				<p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
					Система управления воздушным движением беспилотников
				</p>
			</div>

			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="glass py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
					<Outlet />
				</div>
			</div>

			{/* Контейнер уведомлений */}
			<NotificationsContainer />
		</div>
	)
}

export default AuthLayout
