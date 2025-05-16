import { Todo, User, UserProfile } from './types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'password123',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    password: 'password123',
  },
  {
    id: '3',
    email: 'guest@example.com',
    password: 'password123',
  },
];

// Mock Todos
export const mockTodos: Record<string, Todo[]> = {
  '1': [
    {
      id: '101',
      title: 'Complete project proposal',
      description: 'Finish the project proposal for the client meeting',
      priority: 'high',
      date: '2025-05-20',
      active: false,
      category: 'Work',
      userId: '1',
    },
    {
      id: '102',
      title: 'Grocery shopping',
      description: 'Buy milk, eggs, bread, and vegetables',
      priority: 'medium',
      date: '2025-05-17',
      active: true,
      category: 'Personal',
      userId: '1',
    },
    {
      id: '103',
      title: 'Gym workout',
      description: 'Complete 30 minutes of cardio and strength training',
      priority: 'low',
      date: '2025-05-18',
      active: true,
      category: 'Health',
      userId: '1',
    },
  ],
  '2': [
    {
      id: '201',
      title: 'Team meeting',
      description: 'Weekly team sync to discuss project progress',
      priority: 'medium',
      date: '2025-05-19',
      active: true,
      category: 'Work',
      userId: '2',
    },
    {
      id: '202',
      title: 'Pay bills',
      description: 'Pay electricity, water, and internet bills',
      priority: 'high',
      date: '2025-05-25',
      active: true,
      category: 'Finance',
      userId: '2',
    },
  ],
  '3': [
    {
      id: '301',
      title: 'Learn React',
      description: 'Complete React tutorial on official documentation',
      priority: 'medium',
      date: '2025-05-30',
      active: true,
      category: 'Learning',
      userId: '3',
    },
  ],
};

// Helper functions to get user data without password
export const getUserProfile = (user: User): UserProfile => {
  const { password, ...userProfile } = user;
  return userProfile;
};

// Local storage keys
export const STORAGE_KEYS = {
  CURRENT_USER: 'taskmaster_current_user',
  USERS: 'taskmaster_users',
  TODOS: 'taskmaster_todos',
};
