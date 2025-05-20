export interface Todo {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  date: string;
  active: boolean;
  category: string;
  userId?: string; // Optional userId to associate todos with users
  status?: 'pending' | 'in-progress' | 'completed'; // Task status
}

export type TodoFormData = Omit<Todo, 'id'>;

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string; // Only used for registration, not stored in state
  role: UserRole;
}

export interface UserProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  role: UserRole;
}