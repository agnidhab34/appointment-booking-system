export type UserRole = 'customer' | 'provider';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Service {
  _id: string;
  providerId: string | { _id: string; name: string; email: string };
  name: string;
  description: string;
  duration: number;
  price: number;
  createdAt?: string;
}

export interface Availability {
  _id: string;
  providerId: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Appointment {
  _id: string;
  customerId: { _id: string; name: string; email: string } | string;
  providerId: { _id: string; name: string; email: string } | string;
  serviceId: { _id: string; name: string; price: number; duration: number } | string;
  slotId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  createdAt?: string;
}
