// Типы для дронов
export interface Drone {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  weight: number;
  maxSpeed: number;
  maxFlightTime: number;
  maxAltitude: number;
  batteryLevel?: number;
  status: 'active' | 'inactive' | 'maintenance' | 'in-flight';
  location?: {
    latitude: number;
    longitude: number;
    altitude: number;
  };
  pilotId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Типы для пилотов
export interface Pilot {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: Date;
  experience: number;
  status: 'active' | 'inactive' | 'suspended';
  droneIds: string[];
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Типы для заявок на полеты
export interface FlightPoint {
  id: string;
  latitude: number;
  longitude: number;
  altitude: number;
  speed?: number;
  arrivalTime?: Date;
  departureTime?: Date;
  pointType: 'takeoff' | 'waypoint' | 'landing';
}

export interface FlightApplication {
  id: string;
  title: string;
  description: string;
  pilotId: string;
  droneId: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed';
  flightType: 'commercial' | 'recreational' | 'research' | 'emergency';
  startTime: Date;
  endTime: Date;
  points: FlightPoint[];
  rejectionReason?: string;
  approvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Типы для запретных зон
export interface NoFlyZone {
  id: string;
  name: string;
  description: string;
  type: 'permanent' | 'temporary';
  startDate?: Date;
  endDate?: Date;
  minAltitude?: number;
  maxAltitude?: number;
  polygon: Array<{
    latitude: number;
    longitude: number;
  }>;
  status: 'active' | 'inactive';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Типы для мониторинга полетов
export interface FlightTelemetry {
  id: string;
  flightId: string;
  droneId: string;
  timestamp: Date;
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
  heading: number;
  batteryLevel: number;
  signalStrength: number;
  status: 'normal' | 'warning' | 'critical';
  warnings?: string[];
}

// Типы для погодных условий
export interface WeatherData {
  location: {
    latitude: number;
    longitude: number;
    name?: string;
  };
  timestamp: Date;
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  precipitation: number;
  visibility: number;
  pressure: number;
  cloudCoverage: number;
  weatherCondition: 'clear' | 'partly-cloudy' | 'cloudy' | 'rain' | 'snow' | 'storm' | 'fog';
}