// ----------------- User & Project Types -----------------
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'manager' | 'client';
  company?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
}

export interface Task {
  id: string;
  title: string;
  assignee: string;
  status: 'todo' | 'in-progress' | 'completed';
  progress: number;
  dueDate: string;
}

export interface Payment {
  id: string;
  description: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  client: string;
  progress: number; // 0 to 1
  budget: number;
  spent: number;
  remaining: number;
  startDate: string;
  deadline: string; // ISO date string
  daysLeft?: number; // optional, calculated dynamically
  status: 'active' | 'completed' | 'on-hold';
  manager: string;
  managerEmail: string;
  teamMembers: TeamMember[];
  tasks: Task[];
  payments: Payment[];
  trelloConnected: boolean;
  lastSync?: string;
  recentUpdates?: { id: string; date: string; title: string; description: string }[];
  additionalData?: any; // extra display data
}

// ----------------- Auth State -----------------
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  userRole: 'manager' | 'client' | null; // added
}

// ----------------- Navigation Types -----------------
export type RootStackParamList = {
  // Auth Screens
  Login: undefined;
  Register: undefined;
  RoleSelection: undefined;

  // Manager Screens
  ManagerDashboard: undefined;
  ProjectListScreen: undefined;
  ProjectDetailScreen: { project: Project };

  // Client Nested Stack
  ClientStack: undefined;

  // Shared Screens
  Profile: undefined;
  Notifications: undefined;

  // Future screens (optional)
  TrelloConnectorScreen: undefined;
};

// Client Navigator Param List
export type ClientStackParamList = {
  ClientDashboard: undefined;
  ClientProjectDetail: { project: Project };
  PaymentTracking: { project: Project };
  FeedbackSupport: { project: Project };
  Profile: undefined;
  Notifications: undefined;
};

// Manager Navigator Param List
export type ManagerStackParamList = {
  ManagerDashboard: undefined;
  ProjectListScreen: undefined;
  ProjectDetailScreen: { project: Project };
  Profile: undefined;
  Notifications: undefined;
};