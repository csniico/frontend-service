import { Todo } from "./types";

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
