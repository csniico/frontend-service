import { Todo, LoginCredentials, RegisterData, UserProfile } from "./types";

// env backend api
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in your .env file.");
}

export async function fetchTodos() {
  const response = await fetch(`${API_BASE_URL}/api/todos`);
  if (!response.ok) throw new Error("Failed to fetch todos");
  return response.json();
}

const formatDateForMySQL = (isoDate: string) => {
  return isoDate.split("T")[0]; // Convert "2025-03-20T00:00:00.000Z" to "2025-03-20"
};

export async function createTodo(todo: Omit<Todo, "id">) {
  const formattedTodo = {
    ...todo,
    date: formatDateForMySQL(todo.date),
  };

  const response = await fetch(`${API_BASE_URL}/api/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formattedTodo),
  });
  if (!response.ok) {
    throw new Error(`Failed to create todo`);
  }
  await response.json();
  return { ...todo, id: Date.now().toString() };
}

export async function updateTodo(id: string, todo: Partial<Todo>) {
  const formattedTodo = {
    ...todo,
    ...(todo.date && { date: formatDateForMySQL(todo.date) }),
  };

  const response = await fetch(`${API_BASE_URL}/api/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formattedTodo),
  });
  if (!response.ok) {
    throw new Error(`Failed to update todo`);
  }
  await response.json();
  return { id, ...todo };
}

export async function deleteTodo(id: string) {
  const response = await fetch(`${API_BASE_URL}/api/todos/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete todo");
}

export async function searchTodos(query: string) {
  const response = await fetch(
    `${API_BASE_URL}/api/todos/search?q=${encodeURIComponent(query)}`
  );
  if (!response.ok) throw new Error("Failed to search todos");
  return response.json();
}

// Authentication API functions
export async function loginUser(credentials: LoginCredentials) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to login");
  }
  
  return response.json();
}

export async function registerUser(userData: RegisterData) {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to register");
  }
  
  return response.json();
}

export async function logoutUser() {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
  });
  
  if (!response.ok) {
    throw new Error("Failed to logout");
  }
  
  return true;
}

export async function getCurrentUser() {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      return null; // Not authenticated
    }
    throw new Error("Failed to get current user");
  }
  
  return response.json();
}

export async function updateUserProfile(userId: string, profileData: Partial<UserProfile>) {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profileData),
  });
  
  if (!response.ok) {
    throw new Error("Failed to update profile");
  }
  
  return response.json();
}

export async function deleteUserAccount(userId: string) {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
    method: "DELETE",
  });
  
  if (!response.ok) {
    throw new Error("Failed to delete account");
  }
  
  return true;
}
