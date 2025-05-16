// Debug utilities for troubleshooting

import { STORAGE_KEYS } from './mock-data';

export function debugLocalStorage() {
  if (typeof window === 'undefined') return null;
  
  try {
    const currentUserJson = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    const usersJson = localStorage.getItem(STORAGE_KEYS.USERS);
    const todosJson = localStorage.getItem(STORAGE_KEYS.TODOS);
    
    const currentUser = currentUserJson ? JSON.parse(currentUserJson) : null;
    const users = usersJson ? JSON.parse(usersJson) : [];
    const todos = todosJson ? JSON.parse(todosJson) : {};
    
    console.log('DEBUG: Local Storage Data');
    console.log('Current User:', currentUser);
    console.log('Users:', users);
    console.log('Todos:', todos);
    
    return { currentUser, users, todos };
  } catch (error) {
    console.error('Error parsing local storage data:', error);
    return null;
  }
}

export function resetLocalStorage() {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  localStorage.removeItem(STORAGE_KEYS.USERS);
  localStorage.removeItem(STORAGE_KEYS.TODOS);
  
  console.log('Local storage reset complete');
}
