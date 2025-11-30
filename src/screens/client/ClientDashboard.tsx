// frontend/src/screens/client/ClientDashboard.tsx
// ✅ FIXED: Removed Payments button, widened action buttons, increased status chip size, removed refresh button

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert, Dimensions } from 'react-native';
import { Card, Title, Text, Button, ProgressBar, Chip, IconButton, ActivityIndicator, FAB } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { dashboardService, projectService, userService } from '../../services/backendService';
import type { Project } from '../../types';
import AppHeader from '../../components/AppHeader';

const { width } = Dimensions.get('window');

interface DashboardData {
  stats: {
    total_projects: number;
    active_projects: number;
    completed_projects: number;
    total_investment: number;
  };
  upcomingDeadlines: Project[];
}

const ClientDashboard = () => {
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string>('');
  const [userExists, setUserExists] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user?.id) {
      console.log('❌ No user ID available');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      console.log('🔄 Loading dashboard data for user:', user.id);
      
      try {
        const userCheck = await userService.checkUserExists(user.id.toString());
        console.log('✅ User check result:', userCheck);
        
        if (!userCheck.exists) {
          setError('User not found in database. Please contact support.');
          setUserExists(false);
          return;
        }
        
        setUserExists(true);
        
        console.log('📊 Calling dashboard endpoint...');
        const clientDashboardData = await dashboardService.getClientDashboardAsync(user.id.toString());
        console.log('✅ Dashboard data received');
        setDashboardData(clientDashboardData);
        
        console.log('📋 Calling projects endpoint...');
        const clientProjectsData = await projectService.getClientProjectsAsync(user.id.toString());
        console.log('✅ Projects data received, count:', clientProjectsData.length);
        setProjects(clientProjectsData);
        
        console.log('✅ Dashboard loaded successfully!');
        
      } catch (apiError: any) {
        console.error('❌ API Error Details:', {
          message: apiError.message,
          url: apiError.config?.url,
          status: apiError.response?.status,
          data: apiError.response?.data
        });
        
        if (apiError.response?.status === 404) {
          setError('Endpoint not found. Please check backend routes.');
        } else if (apiError.response?.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError('Failed to load data from server.');
        }
        
        setDashboardData({
          stats: {
            total_projects: 0,
            active_projects: 0,
            completed_projects: 0,
            total_investment: 0
          },
          upcomingDeadlines: []
        });
        setProjects([]);
      }

    } catch (err: any) {
      console.error('💥 Unexpected error:', err);
      setError('An unexpected error occurred');
      setDashboardData({
        stats: {
          total_projects: 0,
          active_projects: 0,
          completed_projects: 0,
          total_investment: 0
        },
        upcomingDeadlines: []
      });
      setProjects([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const getProjectId = (project: Project): string => {
    return project.id?.toString() || 'unknown-id';
  };

  const getProjectTitle = (project: Project): string => {
    return project.title || 'Untitled Project';
  };

  const handleProjectPress = (project: Project) => {
    if (projects.length === 0) {
      Alert.alert('No Projects', 'You don\'t have any projects yet.');
      return;
    }

    try {
      const normalizedProject = {
        id: getProjectId(project),
        title: getProjectTitle(project),
        description: project.description || 'No description available',
        status: project.status || 'active',
        progress: project.progress || project.completion_percentage || 0,
        completion_percentage: project.progress || project.completion_percentage || 0,
        budget: project.budget || 0,
        current_spent: project.current_spent || 0,
        deadline: project.deadline || 'No deadline set',
        manager: project.manager || 'Not assigned',
        client_id: project.client_id || user?.id,
        created_at: project.created_at || new Date().toISOString(),
      };

      console.log('🔄 Navigating to ClientProjectDetails with project:', normalizedProject);

      navigation.navigate('ClientProjectDetails', { 
        project: normalizedProject 
      });
    } catch (navError) {
      console.error('❌ Navigation error:', navError);
      Alert.alert(
        'Navigation Error',
        'Unable to open project details. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleViewFeedback = (project: Project) => {
    if (projects.length === 0) {
      Alert.alert('No Projects', 'You need to have a project to contact support.');
      return;
    }

    try {
      const normalizedProject = {
        id: getProjectId(project),
        title: getProjectTitle(project),
        description: project.description || 'No description available',
        status: project.status || 'active',
        progress: project.progress || project.completion_percentage || 0,
        budget: project.budget || 0,
        current_spent: project.current_spent || 0,
        deadline: project.deadline || 'No deadline set',
        manager: project.manager || 'Not assigned',
      };

      navigation.navigate('FeedbackSupportScreen', { project: normalizedProject });
    } catch (navError) {
      console.error('❌ Navigation error:', navError);
      Alert.alert('Navigation Error', 'Unable to open support. Please try again.');
    }
  };

  const StatCard = ({ title, value, subtitle, color, icon }: any) => (
    <Card style={styles.statCard} elevation={3}>
      <Card.Content style={styles.statContent}>
        <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
          <IconButton
            icon={icon}
            size={20}
            iconColor={color}
            style={styles.statIconButton}
          />
        </View>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={styles.statSubtitle}>{subtitle}</Text>
      </Card.Content>
    </Card>
  );

  // ✅ FIXED: Get progress bar color and value based on status
  const getProgressBarColor = (status: string) => {
    if (status === 'completed') return '#6366F1'; // Full purple for completed
    if (status === 'active') return '#6366F1'; // Purple for active (in progress)
    return '#E2E8F0'; // Gray for pending/just assigned
  };

  const getProgressValue = (status: string, progress: number) => {
    if (status === 'completed') return 1; // Full for completed
    if (status === 'active') return 0.5; // Halfway for active (in progress)
    return 0; // Empty for pending/just assigned
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading your projects...</Text>
      </View>
    );
  }

  if (!userExists && error) {
    return (
      <View style={styles.centered}>
        <AppHeader title="My Projects" />
        <View style={styles.errorContainer}>
          <IconButton
            icon="database-off"
            size={64}
            iconColor="#EF4444"
          />
          <Text style={styles.errorTitle}>Database Connection Issue</Text>
          <Text style={styles.errorText}>{error}</Text>
          <Button 
            mode="contained" 
            onPress={loadDashboardData}
            style={styles.retryButton}
            icon="refresh"
          >
            Retry
          </Button>
          <Button 
            mode="outlined" 
            onPress={() => Alert.alert('Contact support at: support@cinga.com')}
            style={styles.supportButton}
            icon="headset"
          >
            Contact Support
          </Button>
        </View>
      </View>
    );
  }

  const stats = dashboardData?.stats || {
    total_projects: 0,
    active_projects: 0,
    completed_projects: 0,
    total_investment: 0
  };

  const formatInvestment = (amount: number) => {
    if (!amount || isNaN(amount)) return 'R0';
    return `R${amount.toLocaleString('en-ZA')}`;
  };

  return (
    <>
      <AppHeader title="My Projects" />
      
      <View style={styles.container}>
        <ScrollView 
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.userName}>{user?.name || 'Client'}</Text>
              <Text style={styles.userRole}>Client Dashboard</Text>
              {error && (
                <Chip 
                  mode="outlined" 
                  style={styles.errorChip}
                  icon="alert-circle"
                >
                  {error}
                </Chip>
              )}
            </View>
            <IconButton
              icon="bell-outline"
              size={24}
              iconColor="#6366F1"
              onPress={() => console.log('Notifications')}
              style={styles.notificationIcon}
            />
          </View>

          <View style={styles.statsGrid}>
            <StatCard 
              title="Your Projects" 
              value={stats.total_projects || 0} 
              subtitle="All projects"
              color="#6366F1"
              icon="folder-multiple"
            />
            <StatCard 
              title="Active" 
              value={stats.active_projects || 0} 
              subtitle="In progress" 
              color="#10B981"
              icon="progress-clock"
            />
            <StatCard 
              title="Completed" 
              value={stats.completed_projects || 0} 
              subtitle="This year" 
              color="#F59E0B"
              icon="check-circle"
            />
          </View>

          <Card style={styles.completionCard} elevation={3}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Title style={styles.sectionTitle}>Investment Summary</Title>
                <IconButton
                  icon="cash"
                  size={20}
                  iconColor="#6366F1"
                />
              </View>
              <View style={styles.completionContent}>
                <Text style={styles.completionPercentage}>
                  {formatInvestment(stats.total_investment)}
                </Text>
                <Text style={styles.completionSubtitle}>
                  Total Project Investment
                </Text>
              </View>
              <View style={styles.statsRow}>
                <Chip 
                  mode="outlined" 
                  style={styles.budgetChip}
                  icon="chart-bar"
                >
                  {stats.total_projects || 0} Projects
                </Chip>
                <Chip 
                  mode="outlined" 
                  style={styles.overdueChip}
                  icon="clock-alert"
                >
                  Active: {stats.active_projects || 0}
                </Chip>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.projectsCard} elevation={3}>
            <Card.Content>
              {/* ✅ FIXED: Removed Refresh button */}
              <View style={styles.sectionHeader}>
                <Title style={styles.sectionTitle}>
                  Your Projects {projects.length > 0 && `(${projects.length})`}
                </Title>
              </View>

              {projects.length === 0 ? (
                <View style={styles.emptyState}>
                  <IconButton
                    icon="folder-off"
                    size={48}
                    iconColor="#94A3B8"
                  />
                  <Text variant="bodyLarge" style={styles.emptyText}>
                    No projects assigned to you yet
                  </Text>
                  <Text variant="bodySmall" style={styles.emptySubtext}>
                    Your manager will assign projects to you soon
                  </Text>
                  <Button 
                    mode="outlined" 
                    onPress={loadDashboardData}
                    style={styles.refreshButton}
                    icon="refresh"
                  >
                    Check Again
                  </Button>
                </View>
              ) : (
                projects.map((project) => {
                  const projectTitle = getProjectTitle(project);
                  const projectId = getProjectId(project);
                  const projectProgress = project.progress || project.completion_percentage || 0;
                  const projectBudget = project.budget || 0;
                  const projectStatus = project.status || 'active';
                  const projectDeadline = project.deadline || 'No deadline';
                  const projectManager = project.manager || 'Not assigned';

                  // ✅ FIXED: Use new progress calculation
                  const progressValue = getProgressValue(projectStatus, projectProgress);
                  const progressColor = getProgressBarColor(projectStatus);

                  return (
                    <Card 
                      key={projectId} 
                      style={styles.projectItem} 
                      elevation={4}
                      onPress={() => handleProjectPress(project)}
                    >
                      <Card.Content>
                        <View style={styles.projectHeader}>
                          <View style={styles.projectInfo}>
                            <Title style={styles.projectTitle}>{projectTitle}</Title>
                            <Text style={styles.managerName}>Manager: {projectManager}</Text>
                          </View>
                          {/* ✅ FIXED: Increased chip size and text size */}
                          <Chip
                            mode="outlined"
                            style={[
                              styles.statusChip,
                              projectStatus === 'active' ? styles.statusActive : 
                              projectStatus === 'completed' ? styles.statusCompleted : styles.statusPending
                            ]}
                            textStyle={styles.statusChipText}
                          >
                            {projectStatus.toUpperCase()}
                          </Chip>
                        </View>

                        <View style={styles.progressSection}>
                          <View style={styles.progressHeader}>
                            <Text style={styles.progressLabel}>Progress</Text>
                            <Text style={styles.progressPercentage}>{projectProgress}%</Text>
                          </View>
                          {/* ✅ FIXED: Progress bar with correct colors and values */}
                          <ProgressBar 
                            progress={progressValue} 
                            style={styles.progressBar}
                            color={progressColor}
                          />
                        </View>

                        <View style={styles.projectMeta}>
                          <View style={styles.metaItem}>
                            <IconButton
                              icon="cash"
                              size={16}
                              iconColor="#64748B"
                              style={styles.metaIcon}
                            />
                            <Text style={styles.metaText}>
                              R{projectBudget.toLocaleString('en-ZA')}
                            </Text>
                          </View>
                          <View style={styles.metaItem}>
                            <IconButton
                              icon="calendar"
                              size={16}
                              iconColor="#64748B"
                              style={styles.metaIcon}
                            />
                            <Text style={styles.metaText}>
                              {projectDeadline}
                            </Text>
                          </View>
                        </View>

                        {/* ✅ FIXED: Removed Payments button, widened remaining buttons */}
                        <View style={styles.actionsGrid}>
                          <Button 
                            mode="outlined" 
                            icon="chart-box"
                            style={styles.actionButton}
                            contentStyle={styles.actionButtonContent}
                            onPress={() => handleProjectPress(project)}
                          >
                            Details
                          </Button>
                          <Button 
                            mode="outlined" 
                            icon="message-text"
                            style={styles.actionButton}
                            contentStyle={styles.actionButtonContent}
                            onPress={() => handleViewFeedback(project)}
                          >
                            Support
                          </Button>
                        </View>
                      </Card.Content>
                    </Card>
                  );
                })
              )}
            </Card.Content>
          </Card>

          {dashboardData?.upcomingDeadlines && dashboardData.upcomingDeadlines.length > 0 && (
            <Card style={styles.actionsCard} elevation={3}>
              <Card.Content>
                <View style={styles.sectionHeader}>
                  <Title style={styles.sectionTitle}>Upcoming Deadlines</Title>
                  <IconButton
                    icon="calendar-alert"
                    size={20}
                    iconColor="#6366F1"
                  />
                </View>
                {dashboardData.upcomingDeadlines.map((project: Project) => {
                  const projectTitle = getProjectTitle(project);
                  const projectId = getProjectId(project);
                  const projectDeadline = project.deadline || 'No deadline';
                  
                  return (
                    <View key={projectId} style={styles.deadlineItem}>
                      <View style={styles.deadlineInfo}>
                        <Text style={styles.deadlineProject}>{projectTitle}</Text>
                        <Text style={styles.deadlineDate}>Due: {projectDeadline}</Text>
                      </View>
                      {/* ✅ FIXED: Enhanced urgent chip visibility */}
                      <Chip 
                        mode="outlined" 
                        style={styles.deadlineChip}
                        textStyle={styles.deadlineChipText}
                      >
                        Urgent
                      </Chip>
                    </View>
                  );
                })}
              </Card.Content>
            </Card>
          )}
        </ScrollView>

        <FAB
          icon="headset"
          style={styles.fab}
          onPress={() => {
            if (projects.length > 0) {
              handleViewFeedback(projects[0]);
            } else {
              Alert.alert('No Projects', 'You need to have a project to contact support.');
            }
          }}
          label="Support"
          color="#FFFFFF"
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#64748B' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorTitle: { fontSize: 20, fontWeight: 'bold', color: '#1E293B', marginBottom: 8 },
  errorText: { fontSize: 16, color: '#64748B', textAlign: 'center', marginBottom: 20 },
  retryButton: { marginBottom: 12, borderRadius: 8 },
  supportButton: { borderRadius: 8 },
  errorChip: { marginTop: 8, backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 20, paddingBottom: 16, backgroundColor: '#FFFFFF' },
  headerContent: { flex: 1 },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#1E293B', marginBottom: 2 },
  userRole: { fontSize: 14, color: '#6366F1', fontWeight: '600' },
  notificationIcon: { margin: 0, marginLeft: 8 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, padding: 16, paddingTop: 8 },
  statCard: { flex: 1, minWidth: (width - 64) / 3, borderRadius: 16, backgroundColor: '#FFFFFF' },
  statContent: { paddingVertical: 16, paddingHorizontal: 12, alignItems: 'center' },
  statIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  statIconButton: { margin: 0 },
  statValue: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  statTitle: { fontSize: 14, fontWeight: '600', color: '#1E293B', marginBottom: 2, textAlign: 'center' },
  statSubtitle: { fontSize: 12, color: '#64748B', textAlign: 'center' },
  completionCard: { borderRadius: 16, backgroundColor: '#FFFFFF', margin: 16, marginTop: 0, marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  completionContent: { alignItems: 'center', marginBottom: 16 },
  completionPercentage: { fontSize: 32, fontWeight: 'bold', color: '#6366F1', marginBottom: 8 },
  completionSubtitle: { fontSize: 14, color: '#64748B', textAlign: 'center' },
  statsRow: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  budgetChip: { backgroundColor: '#E0E7FF' },
  overdueChip: { backgroundColor: '#FEE2E2' },
  projectsCard: { borderRadius: 16, backgroundColor: '#FFFFFF', margin: 16, marginTop: 0, marginBottom: 16 },
  projectItem: { marginBottom: 16, borderRadius: 16, backgroundColor: '#FFFFFF' },
  projectHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  projectInfo: { flex: 1 },
  projectTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 4 },
  managerName: { fontSize: 14, color: '#64748B' },
  // ✅ FIXED: Increased status chip size and added text styling
  statusChip: { 
    height: 32,
    minWidth: 90,
    justifyContent: 'center',
  },
  statusChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statusActive: { backgroundColor: '#E0E7FF', borderColor: '#6366F1' },
  statusCompleted: { backgroundColor: '#D1FAE5', borderColor: '#10B981' },
  statusPending: { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' },
  progressSection: { marginBottom: 12 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  progressPercentage: { fontSize: 14, fontWeight: 'bold', color: '#1E293B' },
  progressBar: { height: 6, borderRadius: 3, backgroundColor: '#F1F5F9' },
  projectMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  metaIcon: { margin: 0, marginRight: 4 },
  metaText: { fontSize: 12, color: '#64748B' },
  // ✅ FIXED: Widened action buttons since Payments was removed
  actionsGrid: { 
    flexDirection: 'row', 
    gap: 12,
  },
  actionButton: { 
    flex: 1, 
    borderRadius: 8, 
    borderColor: '#E2E8F0' 
  },
  actionButtonContent: { 
    paddingVertical: 6,
  },
  emptyState: { alignItems: 'center', padding: 32 },
  emptyText: { marginBottom: 8, color: '#64748B', textAlign: 'center', fontSize: 16 },
  emptySubtext: { color: '#94A3B8', textAlign: 'center', marginBottom: 16 },
  refreshButton: { borderRadius: 8 },
  actionsCard: { borderRadius: 16, backgroundColor: '#FFFFFF', margin: 16, marginTop: 0, marginBottom: 16 },
  deadlineItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  deadlineInfo: { flex: 1 },
  deadlineProject: { fontSize: 14, fontWeight: '600', color: '#1E293B', marginBottom: 2 },
  deadlineDate: { fontSize: 12, color: '#EF4444', fontWeight: 'bold' },
  // ✅ FIXED: Enhanced urgent chip for better visibility
  deadlineChip: { 
    height: 28, 
    backgroundColor: '#FEE2E2',
    borderColor: '#DC2626',
    borderWidth: 1.5,
  },
  deadlineChipText: { 
    fontSize: 11, 
    color: '#DC2626',
    fontWeight: 'bold',
  },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor: '#6366F1' },
});

export default ClientDashboard;