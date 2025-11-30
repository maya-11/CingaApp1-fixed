// types.ts
export interface User {
  id: string | number; 
  uid?: string;
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
  title?: string;
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
  client_name?: string;
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
  
  // ARCHIVE FUNCTIONALITY - NEW PROPERTIES
  is_archived?: boolean;
  client_id?: string | number;
  manager_id?: string | number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  userRole: 'manager' | 'client' | null;
}

// ✅ ADDED: DashboardStats interface for ManagerDashboard
export interface DashboardStats {
  stats: {
    total_projects: number;
    active_projects: number;
    completed_projects: number;
    total_budget: number;
    avg_completion: number;
    total_tasks?: number;
    completed_tasks?: number;
  };
  overdueTasks: number;
  recentProjects: Project[];
  totalTasks: number;
  completedTasks: number;
}

export type CreateProjectData = {
  title: string;
  description: string;
  manager_id: string | number;
  client_id: string | number;
  budget: number;
  deadline: string;
  status: string;
  start_date: string;
};

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
  EditProjectScreen: { project: Project };
  ClientProjectDetails: { project: Project }; 
  SelectClientScreen: undefined;

  // Future screens
  TrelloConnectorScreen: undefined;

  TasksScreen: { project: Project };
  BudgetScreen: { project: Project };
  TrelloScreen: { project: Project };
  ClientDashboard: undefined; // ✅ ADD THIS LINE
  
  // ✅ ADDED: FeedbackSupportScreen
  FeedbackSupportScreen: { project: Project };
  
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
  TasksScreen: { project: Project }; // ✅ ADDED: TasksScreen for client
};


export interface DashboardData {
  stats: {
    total_projects: number;
    active_projects: number;
    completed_projects: number;
    total_investment: number;
  };
  upcomingDeadlines: Project[];
}


// Manager Navigator Param List
export type ManagerStackParamList = {
  ManagerDashboard: undefined;
  CreateProjectScreen: { selectedClient?: User };
  ProjectListScreen: undefined;
  ProjectDetailScreen: { project: Project };
  Profile: undefined;
  Notifications: undefined;
  TasksScreen: { project: Project }; 
  BudgetScreen: { project: Project }; 
};