import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, RefreshControl, Modal } from 'react-native';
import { Card, Title, Text, Button, ProgressBar, IconButton, useTheme, ActivityIndicator, Snackbar, Chip } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Project, User, DashboardStats } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { managerService,} from '../services/managerService';
import AppHeader from '../components/AppHeader';
import { userService } from '../services/backendService';

type ExtendedStackParamList = RootStackParamList & {
  CreateProjectScreen: { selectedClient?: User };
  ProjectListScreen: undefined;
  ProjectDetailScreen: { project: Project };
};

type ManagerDashboardNavigationProp = StackNavigationProp<
  ExtendedStackParamList,
  'ManagerDashboard'
>;

interface Props {
  navigation: ManagerDashboardNavigationProp;
}

const { width } = Dimensions.get('window');

const ManagerDashboard: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  const [error, setError] = useState<string>('');
  const [showBackendWarning, setShowBackendWarning] = useState(false);
  const [clientsModalVisible, setClientsModalVisible] = useState(false);

  useEffect(() => {
    if (user) {
      loadDashboardData();
      loadClients();
    }
  }, [user]);

  // Refresh when screen comes into focus
useEffect(() => {
  const unsubscribe = navigation.addListener('focus', () => {
    console.log('🔄 ManagerDashboard focused - refreshing data');
    loadDashboardData();
    loadClients();
  });
  return unsubscribe;
}, [navigation]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!user) {
        console.log('ManagerDashboard: No user found');
        return;
      }

      console.log('ManagerDashboard: Loading dashboard data for Firebase UID:', user.id);
      
      try {
        // ✅ Use the new manager service with Firebase UID
        const dashboardResponse = await managerService.getManagerDashboard(user.id);
        console.log('✅ ManagerDashboard: Dashboard data loaded successfully');
        
        setDashboardData(dashboardResponse);
        setRecentProjects(dashboardResponse.recentProjects || []);
        setShowBackendWarning(false);
        
      } catch (apiError: any) {
        console.error('❌ ManagerDashboard: Backend API failed:', apiError.message);
        setShowBackendWarning(true);
        setDashboardData(null);
        setRecentProjects([]);
        
        if (apiError.code === 'ERR_NETWORK') {
          setError('Network error: Cannot connect to backend server.');
        } else if (apiError.response?.status === 404) {
          setError('Manager account not found in database. Please contact support.');
        } else {
          setError('Failed to load dashboard data. Please check your connection.');
        }
      }

    } catch (err: any) {
      console.error('ManagerDashboard: Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadClients = async () => {
    try {
      console.log('🔄 Loading clients...');
      const clientsData = await userService.getClients();
      setClients(clientsData);
      console.log(`✅ Loaded ${clientsData.length} clients from database`);
    } catch (error: any) {
      console.error('❌ Failed to load clients:', error);
      setClients([]);
    }
  };

  const onRefresh = () => {
    console.log('ManagerDashboard: Refreshing data...');
    setRefreshing(true);
    loadDashboardData();
    loadClients();
  };

  // ✅ FIXED: Progress bar logic based on project status
  const getProgressBarColor = (status: string) => {
    if (status === 'completed') return '#6366F1'; // Full purple for completed
    if (status === 'active') return '#6366F1'; // Purple for active
    return '#6366F1'; // Purple for all statuses
  };

  const getProgressValue = (status: string) => {
    if (status === 'completed') return 1; // Full for completed (100%)
    if (status === 'active') return 0.5; // Halfway for active (50%)
    return 0.25; // Quarter for other statuses (25%)
  };

  const getFakeProgressPercentage = (status: string) => {
    if (status === 'completed') return 100; // 100% for completed
    if (status === 'active') return 50; // 50% for active
    return 25; // 25% for other statuses
  };

  const handleViewProjectDetails = (project: Project) => {
    console.log('ManagerDashboard: Viewing project details:', project.id);
    navigation.navigate('ProjectDetailScreen', { project });
  };

  const handleCreateProject = () => {
    console.log('ManagerDashboard: Navigating to Create Project');
    navigation.navigate('CreateProjectScreen' as never);
  };

  const handleViewAllClients = () => {
    console.log('ManagerDashboard: Showing all clients');
    setClientsModalVisible(true);
  };

  const handleAssignToClient = (client: User) => {
    console.log('ManagerDashboard: Assigning project to client:', client.name);
    setClientsModalVisible(false);
    navigation.navigate('CreateProjectScreen', { selectedClient: client });
  };

  const ClientsModal = () => (
    <Modal
      visible={clientsModalVisible}
      onDismiss={() => setClientsModalVisible(false)}
      style={styles.modalStyle}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Available Clients</Text>
          <IconButton
            icon="close"
            size={20}
            onPress={() => setClientsModalVisible(false)}
          />
        </View>
        
        <ScrollView style={styles.modalContent}>
          {clients.length === 0 ? (
            <View style={styles.emptyModal}>
              <Text style={styles.emptyModalText}>No clients available</Text>
              <Text style={styles.emptyModalSubtext}>
                Clients need to register accounts before you can assign projects.
              </Text>
            </View>
          ) : (
            clients.map((client) => (
              <Card 
                key={client.id}
                style={styles.clientCard}
                onPress={() => handleAssignToClient(client)}
              >
                <Card.Content style={styles.clientCardContent}>
                  <Text style={styles.clientName}>{client.name}</Text>
                  <Text style={styles.clientEmail}>{client.email}</Text>
                  <Text style={styles.clientRole}>Client</Text>
                </Card.Content>
              </Card>
            ))
          )}
        </ScrollView>
        
        <View style={styles.modalFooter}>
          <Button 
            mode="outlined" 
            onPress={() => setClientsModalVisible(false)}
            style={styles.modalCloseButton}
          >
            Close
          </Button>
        </View>
      </View>
    </Modal>
  );

  const StatCard = ({ title, value, subtitle, color }: any) => (
    <Card style={styles.statCard} elevation={2}>
      <Card.Content style={styles.statContent}>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={styles.statSubtitle}>{subtitle}</Text>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

  return (
    <>
      <AppHeader title="Manager Dashboard" />
      
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {showBackendWarning && (
          <Card style={styles.warningCard} elevation={2}>
            <Card.Content style={styles.warningContent}>
              <IconButton
                icon="cloud-off-outline"
                size={20}
                iconColor="#EF4444"
              />
              <View style={styles.warningText}>
                <Text style={styles.warningTitle}>Connection Issue</Text>
                <Text style={styles.warningSubtitle}>
                  {error || 'Cannot connect to backend server'}
                </Text>
              </View>
              <Button 
                mode="contained" 
                compact
                onPress={onRefresh}
                style={styles.retryButton}
              >
                Retry
              </Button>
            </Card.Content>
          </Card>
        )}

        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.name || 'Manager'}</Text>
            <Text style={styles.userRole}>Project Manager</Text>
          </View>
        </View>

        <Card style={styles.quickActionsCard} elevation={2}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Quick Actions</Title>
            <View style={styles.quickActionsGrid}>
              <Button 
                mode="contained" 
                icon="plus"
                style={styles.primaryActionButton}
                contentStyle={styles.actionButtonContent}
                onPress={handleCreateProject}
              >
                Create Project
              </Button>
              
              <Button 
                mode="outlined" 
                icon="account-multiple"
                style={styles.secondaryActionButton}
                contentStyle={styles.actionButtonContent}
                onPress={handleViewAllClients}
              >
                View Clients
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Show empty state if no data */}
        {!dashboardData && !showBackendWarning && (
          <Card style={styles.emptyState} elevation={2}>
            <Card.Content style={styles.emptyState}>
              <Text style={styles.emptyText}>Welcome to Cinga!</Text>
              <Text style={styles.emptyText}>
                Get started by creating your first project and assigning it to clients.
              </Text>
              <Button 
                mode="contained" 
                onPress={handleCreateProject}
                style={styles.createFirstButton}
              >
                Create Your First Project
              </Button>
            </Card.Content>
          </Card>
        )}

        {/* Only show stats if we have data */}
        {dashboardData && (
          <>
            <View style={styles.statsGrid}>
              <StatCard 
                title="Total Projects" 
                value={dashboardData.stats?.total_projects || 0} 
                subtitle="All projects"
                color="#6366F1"
              />
              <StatCard 
                title="Active" 
                value={dashboardData.stats?.active_projects || 0} 
                subtitle="In progress" 
                color="#10B981"
              />
              <StatCard 
                title="Completed" 
                value={dashboardData.stats?.completed_projects || 0} 
                subtitle="This year" 
                color="#F59E0B"
              />
              <StatCard 
                title="Overdue Tasks" 
                value={dashboardData.overdueTasks || 0} 
                subtitle="Require attention" 
                color="#EF4444"
              />
            </View>

            <Card style={styles.completionCard} elevation={2}>
              <Card.Content>
                <View style={styles.sectionHeader}>
                  <Title style={styles.sectionTitle}>Overall Progress</Title>
                  <Text style={styles.budgetText}>
                    Total Budget: R{dashboardData.stats?.total_budget?.toLocaleString() || '0'}
                  </Text>
                </View>
                <View style={styles.completionContent}>
                  <Text style={styles.completionPercentage}>
                    {dashboardData.stats?.avg_completion || 0}%
                  </Text>
                  <Text style={styles.completionSubtitle}>
                    Average completion across {dashboardData.stats?.total_projects || 0} projects
                  </Text>
                </View>
                <ProgressBar 
                  progress={(dashboardData.stats?.avg_completion || 0) / 100} 
                  style={styles.completionBar}
                  color="#6366F1"
                />
              </Card.Content>
            </Card>
          </>
        )}

        <Card style={styles.projectsCard} elevation={2}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Title style={styles.sectionTitle}>Recent Projects</Title>
              <Button 
                mode="text" 
                compact
                textColor="#6366F1"
                onPress={() => navigation.navigate('ProjectListScreen')}
              >
                View All
              </Button>
            </View>

            {recentProjects.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  {showBackendWarning 
                    ? 'Cannot load projects - check backend connection' 
                    : 'No projects created yet'
                  }
                </Text>
                <Button 
                  mode="contained" 
                  onPress={handleCreateProject}
                  style={styles.createFirstButton}
                >
                  Create Your First Project
                </Button>
              </View>
            ) : (
              recentProjects.map((project, index) => {
                // ✅ FIXED: Use fake progress based on status
                const projectStatus = project.status || 'active';
                const fakeProgress = getFakeProgressPercentage(projectStatus);
                const progressValue = getProgressValue(projectStatus);
                const progressColor = getProgressBarColor(projectStatus);

                return (
                  <Card 
                    key={project.id} 
                    style={[styles.projectItem, index !== recentProjects.length - 1 && styles.projectItemBorder]} 
                    mode="elevated" 
                    elevation={1}
                  >
                    <Card.Content>
                      <View style={styles.projectHeader}>
                        <View style={styles.projectInfo}>
                          <Text style={styles.projectName}>{project.title}</Text>
                          <Text style={styles.clientName}>
                            Client: {project.client_name || project.client || 'No client assigned'}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.progressSection}>
                        <View style={styles.progressHeader}>
                          <Text style={styles.progressLabel}>Progress</Text>
                          <Text style={styles.progressPercentage}>{fakeProgress}%</Text>
                        </View>
                        {/* ✅ FIXED: Progress bar with fake values based on status */}
                        <ProgressBar 
                          progress={progressValue} 
                          style={styles.progressBar}
                          color={progressColor}
                        />
                      </View>

                      <Button 
                        mode="text" 
                        icon="chevron-right"
                        contentStyle={styles.viewDetailsContent}
                        labelStyle={styles.viewDetailsLabel}
                        onPress={() => handleViewProjectDetails(project)}
                      >
                        View Details
                      </Button>
                    </Card.Content>
                  </Card>
                );
              })
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      <ClientsModal />

      <Snackbar
        visible={!!error}
        onDismiss={() => setError('')}
        duration={3000}
        style={styles.snackbar}
      >
        {error}
      </Snackbar>
    </>
  );
};

// ... (keep all the same styles)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#64748B' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 20, paddingBottom: 16, backgroundColor: '#FFFFFF' },
  greeting: { fontSize: 16, color: '#64748B', marginBottom: 4 },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#1E293B', marginBottom: 2 },
  userRole: { fontSize: 14, color: '#6366F1', fontWeight: '600' },
  warningCard: { margin: 16, marginBottom: 8, borderRadius: 12, backgroundColor: '#FEF2F2', borderColor: '#EF4444' },
  warningContent: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  warningText: { flex: 1, marginLeft: 8, marginRight: 12 },
  warningTitle: { fontSize: 14, fontWeight: 'bold', color: '#DC2626', marginBottom: 2 },
  warningSubtitle: { fontSize: 12, color: '#DC2626' },
  retryButton: { backgroundColor: '#EF4444', borderRadius: 8 },
  quickActionsCard: { borderRadius: 16, backgroundColor: '#FFFFFF', margin: 16, marginTop: 0, marginBottom: 16 },
  quickActionsGrid: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  primaryActionButton: { flex: 1, borderRadius: 12, backgroundColor: '#6366F1' },
  secondaryActionButton: { flex: 1, borderRadius: 12, borderColor: '#6366F1' },
  actionButtonContent: { paddingVertical: 8 },
  clientsSummary: { marginTop: 8 },
  clientsLabel: { fontSize: 14, fontWeight: '600', color: '#64748B', marginBottom: 8 },
  clientsChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  clientChip: { backgroundColor: '#F8FAFC' },
  moreChip: { backgroundColor: '#E2E8F0' },
  noClientsChip: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, padding: 16, paddingTop: 8 },
  statCard: { flex: 1, minWidth: (width - 64) / 2, borderRadius: 16, backgroundColor: '#FFFFFF' },
  statContent: { paddingVertical: 16, paddingHorizontal: 12, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  statTitle: { fontSize: 14, fontWeight: '600', color: '#1E293B', marginBottom: 2, textAlign: 'center' },
  statSubtitle: { fontSize: 12, color: '#64748B', textAlign: 'center' },
  completionCard: { borderRadius: 16, backgroundColor: '#FFFFFF', margin: 16, marginTop: 0, marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  budgetText: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  completionContent: { alignItems: 'center', marginBottom: 16 },
  completionPercentage: { fontSize: 32, fontWeight: 'bold', color: '#6366F1', marginBottom: 8 },
  completionSubtitle: { fontSize: 14, color: '#64748B', textAlign: 'center' },
  completionBar: { height: 8, borderRadius: 4, backgroundColor: '#F1F5F9' },
  projectsCard: { borderRadius: 16, backgroundColor: '#FFFFFF', margin: 16, marginTop: 0, marginBottom: 16 },
  emptyState: { alignItems: 'center', paddingVertical: 20 },
  emptyText: { fontSize: 16, color: '#64748B', marginBottom: 16, textAlign: 'center' },
  createFirstButton: { marginTop: 12 },
  projectItem: { marginBottom: 16, borderRadius: 16, backgroundColor: '#FFFFFF' },
  projectItemBorder: { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  projectHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  projectInfo: { flex: 1 },
  projectName: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 4 },
  clientName: { fontSize: 14, color: '#64748B' },
  projectStatus: { marginLeft: 12 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusActive: { backgroundColor: '#E0E7FF' },
  statusCompleted: { backgroundColor: '#D1FAE5' },
  statusText: { fontSize: 10, fontWeight: 'bold', color: '#374151' },
  progressSection: { marginBottom: 12 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  progressPercentage: { fontSize: 14, fontWeight: 'bold', color: '#1E293B' },
  progressBar: { height: 6, borderRadius: 3, backgroundColor: '#F1F5F9' },
  projectDetails: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, paddingHorizontal: 4 },
  detailItem: { alignItems: 'center' },
  detailLabel: { fontSize: 12, color: '#64748B', marginBottom: 4 },
  detailValue: { fontSize: 14, fontWeight: 'bold', color: '#1E293B' },
  viewDetailsContent: { flexDirection: 'row-reverse' },
  viewDetailsLabel: { color: '#6366F1', fontWeight: '600' },
  modalStyle: { margin: 20 },
  modalContainer: { backgroundColor: 'white', borderRadius: 16, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  modalContent: { maxHeight: 400, padding: 8 },
  emptyModal: { padding: 40, alignItems: 'center' },
  emptyModalText: { fontSize: 16, color: '#64748B', textAlign: 'center', marginBottom: 8 },
  emptyModalSubtext: { fontSize: 14, color: '#94A3B8', textAlign: 'center' },
  clientCard: { margin: 8, marginHorizontal: 8, borderRadius: 8, backgroundColor: '#FFFFFF', elevation: 2 },
  clientCardContent: { padding: 16 },
  client: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 4 },
  clientEmail: { fontSize: 14, color: '#64748B', marginBottom: 4 },
  clientRole: { fontSize: 12, color: '#6366F1', fontWeight: '600' },
  modalFooter: { padding: 16, borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  modalCloseButton: { borderRadius: 8 },
  snackbar: { backgroundColor: '#EF4444' },
});

export default ManagerDashboard;