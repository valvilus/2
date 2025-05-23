import React from 'react'
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate
} from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AuthProvider } from './context/AuthContext'
import { NotificationsProvider } from './context/NotificationsContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/auth/ProtectedRoute'

// Layouts
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'

// Pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import DronesPage from './pages/drones/DronesPage'
import PilotsPage from './pages/pilots/PilotsPage'
import FlightApplicationsPage from './pages/flights/FlightApplicationsPage'
import CreateFlightPage from './pages/flights/CreateFlightPage'
import MonitoringPage from './pages/monitoring/MonitoringPage'
import ProfilePage from './pages/profile/ProfilePage'
import NoFlyZonesPage from './pages/zones/NoFlyZonesPage'

// Создаем экземпляр QueryClient
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 3,
			retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
			staleTime: 5 * 60 * 1000, // 5 минут
			cacheTime: 10 * 60 * 1000, // 10 минут
			refetchOnWindowFocus: false // Отключаем автоматическое обновление при фокусе окна
		}
	}
})

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				<AuthProvider>
					<NotificationsProvider>
						<Router>
							<Routes>
								{/* Публичные маршруты */}
								<Route element={<AuthLayout />}>
									<Route path="/login" element={<LoginPage />} />
									<Route path="/register" element={<RegisterPage />} />
								</Route>

								{/* Защищенные маршруты */}
								<Route
									element={
										<ProtectedRoute>
											<MainLayout />
										</ProtectedRoute>
									}
								>
									<Route path="/dashboard" element={<DashboardPage />} />
									<Route path="/drones" element={<DronesPage />} />
									<Route path="/pilots" element={<PilotsPage />} />
									<Route path="/flights" element={<FlightApplicationsPage />} />
									<Route
										path="/flights/create"
										element={<CreateFlightPage />}
									/>
									<Route path="/monitoring" element={<MonitoringPage />} />
									<Route path="/profile" element={<ProfilePage />} />
									<Route path="/no-fly-zones" element={<NoFlyZonesPage />} />
								</Route>

								{/* Перенаправление для корневого пути */}
								<Route path="*" element={<Navigate to="/login" replace />} />
							</Routes>
						</Router>
					</NotificationsProvider>
				</AuthProvider>
			</ThemeProvider>

			{/* Инструменты разработчика для React Query (только в dev режиме) */}
			{process.env.NODE_ENV === 'development' && (
				<ReactQueryDevtools initialIsOpen={false} />
			)}
		</QueryClientProvider>
	)
}

export default App
