export interface Todo {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  date: string;
  active: boolean;
  category: string;
}

export type TodoFormData = Omit<Todo, 'id'>;