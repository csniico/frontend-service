import axios from 'axios';
import { LoginCredentials, RegisterData, UserProfile } from './types';

// Base URL for the API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth Service
export const authService = {
  // Register a new user
  signup: async (userData: RegisterData): Promise<UserProfile> => {
    try {
      const response = await api.post('/signup', userData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  // Login a user
  signin: async (credentials: LoginCredentials): Promise<UserProfile> => {
    try {
      const response = await api.post('/signin', credentials);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Invalid email or password');
    }
  },
};

// Task Service
export const taskService = {
  // Get all tasks for the current user
  getTasks: async (): Promise<any[]> => {
    try {
      const response = await api.get('/tasks');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch tasks');
    }
  },

  // Create a new task
  createTask: async (taskData: any): Promise<any> => {
    try {
      const response = await api.post('/tasks', taskData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create task');
    }
  },

  // Update an existing task
  updateTask: async (taskId: string, taskData: any): Promise<any> => {
    try {
      const response = await api.put(`/tasks/${taskId}`, taskData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update task');
    }
  },

  // Delete a task
  deleteTask: async (taskId: string): Promise<void> => {
    try {
      await api.delete(`/tasks/${taskId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete task');
    }
  },
};
