export interface User {
  id: string;
  email: string;
  name: string;
  role: 'manager' | 'client';
  company?: string;
  created_at?: string;
  phone?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
}

// UPDATED: Tasks interface that matches backend
export interface Tasks {
  id: string;
  project_id: string;    
  name: string;          //  CHANGED: 'title' → 'name' (matches backend)
  assigned_to: string;   //  CHANGED: 'assignee' → 'assigned_to' (matches backend)
  status: 'todo' | 'in_progress' | 'completed'; // Added specific status types
  description?: string;
  due_date?: string;
  created_at?: string;
  updated_at?: string;
  priority?: 'low' | 'medium' | 'high';
  client_notes?: string; //  Added for client updates
  
  // KEPT for frontend display (calculated, not from backend)
  progress?: number;     
  assignee_name?: string; // For display purposes only
}

export interface Payment {
  id: string;
  description: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending';
}

export interface ProjectUpdate {
  id: string;
  date: string;
  title: string;
  description: string;
}

export interface Project {
  image: string;
  id: string;
  title: string; 
  trello_board_id?: string;
  current_spent?: number;
  client: string;
  progress: number;
  budget: number;
  spent: number;
  deadline: string;
  status: 'active' | 'completed' | 'on-hold';
  manager: string;
  managerEmail: string;
  description?: string;
  
  daysLeft?: number;
  recentUpdates?: ProjectUpdate[];
  remaining?: number;
  startDate?: string;
  teamMembers?: string[];
  tasks?: Tasks[]; // UPDATED: Using correct Tasks interface
  completion_percentage?: number;
  end_date?: string;
  created_at?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  userRole: 'manager' | 'client' | null;
}

export type RootStackParamList = {
  // Auth Screens
  Welcome: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  Register: undefined;
  RoleSelection: undefined;

  // Manager Screens
  ManagerDashboard: undefined;
  CreateProjectScreen: { selectedClient?: User };
  ProjectListScreen: undefined;
  ProjectDetailScreen: { project: Project };
  SelectClientScreen: undefined;

  // Future screens
  TrelloConnectorScreen: undefined;

  TasksScreen: { project: Project };
  BudgetScreen: { project: Project };
  TrelloScreen: { project: Project };
  
  ClientStack: undefined;
  Profile: undefined;
  Notifications: undefined;
};

// Client Navigator Param List
export type ClientStackParamList = {
  ClientDashboard: undefined;
  ClientProjectDetail: { project: Project };
  PaymentTrackingScreen: { project: Project };
  FeedbackSupportScreen: { project: Project };
  Profile: undefined;
  Notifications: undefined;
  FeedbackSupport: undefined;
};

// Manager Navigator Param List
export type ManagerStackParamList = {
  ManagerDashboard: undefined;
  CreateProjectScreen: { selectedClient?: User };
  ProjectListScreen: undefined;
  ProjectDetailScreen: { project: Project };
  Profile: undefined;
  Notifications: undefined;
};