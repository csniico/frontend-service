import { LoginCredentials, RegisterData, Todo, TodoFormData, User, UserProfile } from './types';
import { mockTodos, mockUsers, getUserProfile, STORAGE_KEYS } from './mock-data';

// Initialize local storage with mock data if it doesn't exist
const initializeLocalStorage = () => {
  if (typeof window === 'undefined') return;
  
  // Initialize users
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers));
  }
  
  // Initialize todos
  if (!localStorage.getItem(STORAGE_KEYS.TODOS)) {
    localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(mockTodos));
  }
};

// Helper to get users from local storage
const getUsers = (): User[] => {
  if (typeof window === 'undefined') return [];
  initializeLocalStorage();
  const usersJson = localStorage.getItem(STORAGE_KEYS.USERS);
  return usersJson ? JSON.parse(usersJson) : [];
};

// Helper to get todos from local storage
const getTodos = (): Record<string, Todo[]> => {
  if (typeof window === 'undefined') return {};
  initializeLocalStorage();
  const todosJson = localStorage.getItem(STORAGE_KEYS.TODOS);
  return todosJson ? JSON.parse(todosJson) : {};
};

// Helper to save users to local storage
const saveUsers = (users: User[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

// Helper to save todos to local storage
const saveTodos = (todos: Record<string, Todo[]>) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos));
};

// Helper to get current user from local storage
const getCurrentUserFromStorage = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userJson = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return userJson ? JSON.parse(userJson) : null;
};

// Helper to save current user to local storage
const saveCurrentUser = (user: User | null) => {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Authentication API functions
export async function loginUser(credentials: LoginCredentials): Promise<UserProfile> {
  await delay(800); // Simulate network delay
  
  const users = getUsers();
  const user = users.find(u => 
    u.email === credentials.email && u.password === credentials.password
  );
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  saveCurrentUser(user);
  return getUserProfile(user);
}

export async function registerUser(userData: RegisterData): Promise<UserProfile> {
  await delay(1000); // Simulate network delay
  
  const users = getUsers();
  
  // Check if email already exists
  if (users.some(u => u.email === userData.email)) {
    throw new Error('Email already in use');
  }
  
  // Create new user
  const newUser: User = {
    id: Date.now().toString(),
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    password: userData.password,
  };
  
  // Add user to storage
  users.push(newUser);
  saveUsers(users);
  
  // Create empty todo list for new user
  const todos = getTodos();
  todos[newUser.id] = [];
  saveTodos(todos);
  
  // Set as current user
  saveCurrentUser(newUser);
  
  return getUserProfile(newUser);
}

export async function logoutUser(): Promise<boolean> {
  await delay(500); // Simulate network delay
  saveCurrentUser(null);
  return true;
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  await delay(500); // Simulate network delay
  const user = getCurrentUserFromStorage();
  return user ? getUserProfile(user) : null;
}

export async function updateUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
  await delay(800); // Simulate network delay
  
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  // Update user
  users[userIndex] = {
    ...users[userIndex],
    ...profileData,
  };
  
  saveUsers(users);
  
  // Update current user if it's the same
  const currentUser = getCurrentUserFromStorage();
  if (currentUser && currentUser.id === userId) {
    saveCurrentUser(users[userIndex]);
  }
  
  return getUserProfile(users[userIndex]);
}

export async function deleteUserAccount(userId: string): Promise<boolean> {
  await delay(1000); // Simulate network delay
  
  const users = getUsers();
  const updatedUsers = users.filter(u => u.id !== userId);
  
  if (users.length === updatedUsers.length) {
    throw new Error('User not found');
  }
  
  saveUsers(updatedUsers);
  
  // Remove user's todos
  const todos = getTodos();
  delete todos[userId];
  saveTodos(todos);
  
  // Clear current user if it's the same
  const currentUser = getCurrentUserFromStorage();
  if (currentUser && currentUser.id === userId) {
    saveCurrentUser(null);
  }
  
  return true;
}

// Todo API functions
export async function fetchTodos(): Promise<Todo[]> {
  await delay(800); // Simulate network delay
  
  const currentUser = getCurrentUserFromStorage();
  if (!currentUser) {
    throw new Error('Not authenticated');
  }
  
  const todos = getTodos();
  return todos[currentUser.id] || [];
}

export async function createTodo(todo: Omit<Todo, 'id'>): Promise<Todo> {
  await delay(800); // Simulate network delay
  
  const currentUser = getCurrentUserFromStorage();
  if (!currentUser) {
    throw new Error('Not authenticated');
  }
  
  const newTodo: Todo = {
    ...todo,
    id: Date.now().toString(),
    userId: currentUser.id,
  };
  
  const todos = getTodos();
  if (!todos[currentUser.id]) {
    todos[currentUser.id] = [];
  }
  
  todos[currentUser.id].push(newTodo);
  saveTodos(todos);
  
  return newTodo;
}

export async function updateTodo(id: string, todo: Partial<Todo>): Promise<Todo> {
  await delay(800); // Simulate network delay
  
  const currentUser = getCurrentUserFromStorage();
  if (!currentUser) {
    throw new Error('Not authenticated');
  }
  
  const todos = getTodos();
  const userTodos = todos[currentUser.id] || [];
  
  const todoIndex = userTodos.findIndex(t => t.id === id);
  if (todoIndex === -1) {
    throw new Error('Todo not found');
  }
  
  // Update todo
  userTodos[todoIndex] = {
    ...userTodos[todoIndex],
    ...todo,
  };
  
  todos[currentUser.id] = userTodos;
  saveTodos(todos);
  
  return userTodos[todoIndex];
}

export async function deleteTodo(id: string): Promise<void> {
  await delay(800); // Simulate network delay
  
  const currentUser = getCurrentUserFromStorage();
  if (!currentUser) {
    throw new Error('Not authenticated');
  }
  
  const todos = getTodos();
  const userTodos = todos[currentUser.id] || [];
  
  const updatedTodos = userTodos.filter(t => t.id !== id);
  
  if (updatedTodos.length === userTodos.length) {
    throw new Error('Todo not found');
  }
  
  todos[currentUser.id] = updatedTodos;
  saveTodos(todos);
}

export async function searchTodos(query: string): Promise<Todo[]> {
  await delay(800); // Simulate network delay
  
  const currentUser = getCurrentUserFromStorage();
  if (!currentUser) {
    throw new Error('Not authenticated');
  }
  
  const todos = getTodos();
  const userTodos = todos[currentUser.id] || [];
  
  if (!query.trim()) {
    return userTodos;
  }
  
  const lowerQuery = query.toLowerCase();
  return userTodos.filter(todo => 
    todo.title.toLowerCase().includes(lowerQuery) || 
    todo.description.toLowerCase().includes(lowerQuery) ||
    todo.category.toLowerCase().includes(lowerQuery)
  );
}
