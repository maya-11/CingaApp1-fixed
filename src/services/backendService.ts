import axios from 'axios';
import { User, Project, Tasks, Payment } from '../types';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Update this to your backend URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    // const token = await getAuthToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ----------------- AUTH SERVICE -----------------
export const authService = {
  async login(email: string, password: string): Promise<any> {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async register(userData: any): Promise<any> {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async forgotPassword(email: string): Promise<any> {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token: string, newPassword: string): Promise<any> {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response.data;
  },

  async logout(): Promise<void> {
    // Clear local storage or tokens here
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
};

// ----------------- USER SERVICE -----------------
export const userService = {
  async getUsers(): Promise<User[]> {
    const response = await api.get('/users');
    return response.data;
  },

  async getUserById(userId: string): Promise<User> {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },

  async getClients(): Promise<User[]> {
    const response = await api.get('/users/clients');
    return response.data;
  },

  async getManagers(): Promise<User[]> {
    const response = await api.get('/users/managers');
    return response.data;
  },
};

// ----------------- PROJECT SERVICE -----------------
export const projectService = {
  async getProjects(): Promise<Project[]> {
    const response = await api.get('/projects');
    return response.data;
  },

  async getManagerProjects(managerId: string): Promise<Project[]> {
    const response = await api.get(`/projects/manager/${managerId}`);
    return response.data;
  },

  async getClientProjects(clientId: string): Promise<Project[]> {
    const response = await api.get(`/projects/client/${clientId}`);
    return response.data;
  },

  async getProjectById(projectId: string): Promise<Project> {
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
  },

  async createProject(projectData: any): Promise<Project> {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  async updateProject(projectId: string, updates: any): Promise<Project> {
    const response = await api.put(`/projects/${projectId}`, updates);
    return response.data;
  },

  async updateProjectProgress(projectId: string, completion_percentage: number, client_notes?: string): Promise<any> {
    const response = await api.patch(`/projects/${projectId}/progress`, {
      completion_percentage,
      client_notes
    });
    return response.data;
  },

  async updateProjectCompletion(projectId: string, completion_percentage: number): Promise<any> {
    const response = await api.patch(`/projects/${projectId}/completion`, {
      completion_percentage
    });
    return response.data;
  },

  async deleteProject(projectId: string): Promise<void> {
    await api.delete(`/projects/${projectId}`);
  },

  async getManagerStats(managerId: string): Promise<any> {
    const response = await api.get(`/projects/manager/${managerId}/stats`);
    return response.data;
  },
};

// ----------------- TASK SERVICE -----------------
export const taskService = {
  async getProjectTasks(projectId: string): Promise<Tasks[]> {
    const response = await api.get(`/tasks/project/${projectId}`);
    return response.data;
  },

  async getTaskById(taskId: string): Promise<Tasks> {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  },

  async createTask(taskData: any): Promise<Tasks> {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  async updateTaskStatus(taskId: string, status: string): Promise<Tasks> {
    const response = await api.patch(`/tasks/${taskId}/status`, { status });
    return response.data;
  },

  async clientUpdateTask(taskId: string, status: string, client_notes: string): Promise<Tasks> {
    const response = await api.patch(`/tasks/${taskId}/client-update`, { 
      status, 
      client_notes 
    });
    return response.data;
  },

  async updateTask(taskId: string, updates: any): Promise<Tasks> {
    const response = await api.put(`/tasks/${taskId}`, updates);
    return response.data;
  },

  async deleteTask(taskId: string): Promise<void> {
    await api.delete(`/tasks/${taskId}`);
  },

  async getOverdueTasks(managerId: string): Promise<Tasks[]> {
    const response = await api.get(`/tasks/manager/${managerId}/overdue`);
    return response.data;
  },
};

// ----------------- NOTIFICATION SERVICE -----------------
export const notificationService = {
  async getNotifications(userId: string): Promise<any[]> {
    const response = await api.get(`/notifications/user/${userId}`);
    return response.data;
  },

  async markAsRead(notificationId: string): Promise<any> {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return response.data;
  },

  async createNotification(notificationData: any): Promise<any> {
    const response = await api.post('/notifications', notificationData);
    return response.data;
  },
};

// ----------------- PAYMENT SERVICE -----------------
export const paymentService = {
  async getProjectPayments(projectId: string): Promise<Payment[]> {
    const response = await api.get(`/payments/project/${projectId}`);
    return response.data;
  },

  async createPayment(paymentData: any): Promise<Payment> {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },

  async updatePaymentStatus(paymentId: string, status: string): Promise<Payment> {
    const response = await api.patch(`/payments/${paymentId}/status`, { status });
    return response.data;
  },
};

// ----------------- DASHBOARD SERVICE -----------------
export const dashboardService = {
  async getManagerDashboard(managerId: string): Promise<any> {
    const response = await api.get(`/dashboard/manager/${managerId}`);
    return response.data;
  },

  async getClientDashboard(clientId: string): Promise<any> {
    const response = await api.get(`/dashboard/client/${clientId}`);
    return response.data;
  },
};

// ----------------- BUDGET SERVICE -----------------
export const budgetService = {
  async getProjectBudget(projectId: string): Promise<any> {
    const response = await api.get(`/budget/project/${projectId}`);
    return response.data;
  },

  async updateProjectSpending(projectId: string, amount: number, type: 'expense' | 'income'): Promise<any> {
    const response = await api.patch(`/budget/project/${projectId}/spending`, {
      amount,
      type
    });
    return response.data;
  },
};

export default api;