import { Todo, User, UserProfile } from "./types";

// Mock Users
export const mockUsers: User[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    password: "password123",
    role: "admin",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    password: "password123",
    role: "user",
  },
  {
    id: "3",
    email: "guest@example.com",
    password: "password123",
    role: "user",
  },
];

// Mock Todos
export const mockTodos: Record<string, Todo[]> = {
  "1": [
    {
      id: "101",
      title: "Frontend tier",
      description:
        "Build the frontend application using React and Tailwind CSS",
      priority: "high",
      date: "2025-06-01",
      active: true,
      category: "Development",
      userId: "1",
    },
    {
      id: "102",
      title: "Backend tier",
      description: "Build backend functionalities using Node.js and Express",
      priority: "high",
      date: "2025-06-02",
      active: true,
      category: "Development",
      userId: "1",
    },
    {
      id: "103",
      title: "Observability tier",
      description:
        "Integrate traces, logs, and metrics into the application using tools like OpenTelemetry, Prometheus, and Grafana",
      priority: "medium",
      date: "2025-06-10",
      active: false,
      category: "DevOps",
      userId: "1",
    },
  ],
  "2": [
    {
      id: "201",
      title: "Infrastructure tier",
      description:
        "Use Terraform to set up AWS resources including EC2, S3, and RDS instances",
      priority: "medium",
      date: "2025-06-05",
      active: true,
      category: "DevOps",
      userId: "2",
    },
    {
      id: "202",
      title: "Pipeline tier",
      description:
        "Set up Jenkins to automate build, test, and deployment pipeline",
      priority: "high",
      date: "2025-06-08",
      active: true,
      category: "DevOps",
      userId: "2",
    },
  ],
  "3": [
    {
      id: "301",
      title: "Cloud Architecture Review",
      description:
        "Review cloud design for scalability and security compliance",
      priority: "medium",
      date: "2025-06-12",
      active: true,
      category: "Architecture",
      userId: "3",
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
  CURRENT_USER: "taskmaster_current_user",
  USERS: "taskmaster_users",
  TODOS: "taskmaster_todos",
};
