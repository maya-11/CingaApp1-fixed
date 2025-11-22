import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert, Dimensions } from 'react-native';
import { Card, Title, Text, Button, ProgressBar, Chip, IconButton, ActivityIndicator, FAB } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { dashboardService, projectService, Project } from '../../services/backendService';
import AppHeader from '../../components/AppHeader';

const { width } = Dimensions.get('window');

const ClientDashboard = () => {
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError('');
      console.log('🔄 Loading real client dashboard data...');
      
      try {
        // Load client dashboard
        const clientDashboard = await dashboardService.getClientDashboard(user.id);
        setDashboardData(clientDashboard);
        
        // Load client projects
        const clientProjects = await projectService.getClientProjects(user.id);
        setProjects(clientProjects);
        
        console.log('✅ Client dashboard loaded:', {
          stats: clientDashboard.stats,
          projects: clientProjects.length
        });
      } catch (apiError: any) {
        console.error('❌ Failed to load client dashboard:', apiError.message);
        // Set fallback data structure
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
        setError('Failed to load data from server. Please check your connection.');
      }

    } catch (err: any) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
      // Ensure we have basic data structure even on error
      setDashboardData({
        stats: {
          total_projects: 0,
          active_projects: 0,
          completed_projects: 0,
          total_investment: 0
        },
        upcomingDeadlines: []
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  // Helper function to safely get project ID
  const getProjectId = (project: Project): string => {
    return project.id || (project as any)._id || 'unknown-id';
  };

  // Helper function to safely get project title
  const getProjectTitle = (project: Project): string => {
    return project.title || (project as any).name || 'Untitled Project';
  };

  const handleProjectPress = (project: Project) => {
    if (projects.length === 0) {
      Alert.alert('No Projects', 'You don\'t have any projects yet.');
      return;
    }
    navigation.navigate('ClientProjectDetailScreen', { 
      project: {
        ...project,
        // Ensure all required fields are present
        id: getProjectId(project),
        title: getProjectTitle(project),
        description: project.description || 'No description available',
        status: project.status || 'active',
        progress: project.progress || project.completion_percentage || 0,
        budget: project.budget || 0,
        current_spent: project.current_spent || 0,
        deadline: project.deadline || 'No deadline set',
        manager: project.manager || 'Not assigned'
      }
    });
  };

  const handleViewPayments = (project: Project) => {
    if (projects.length === 0) {
      Alert.alert('No Projects', 'You don\'t have any projects yet.');
      return;
    }
    navigation.navigate('PaymentTrackingScreen', { project });
  };

  const handleViewFeedback = (project: Project) => {
    if (projects.length === 0) {
      Alert.alert('No Projects', 'You don\'t have any projects yet.');
      return;
    }
    navigation.navigate('FeedbackSupportScreen', { project });
  };

  // Enhanced Stat Card Component
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

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading your projects...</Text>
      </View>
    );
  }

  // Safely access stats with fallbacks
  const stats = dashboardData?.stats || {
    total_projects: 0,
    active_projects: 0,
    completed_projects: 0,
    total_investment: 0
  };

  // Format investment amount safely
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
          {/* Enhanced Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.userName}>{user?.name || 'Client'}</Text>
              <Text style={styles.userRole}>Client Dashboard</Text>
            </View>
            <IconButton
              icon="bell-outline"
              size={24}
              iconColor="#6366F1"
              onPress={() => console.log('Notifications')}
              style={styles.notificationIcon}
            />
          </View>

          {/* Enhanced Stats Grid */}
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

          {/* Fixed Investment Summary */}
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

          {/* Your Projects - Enhanced Design */}
          <Card style={styles.projectsCard} elevation={3}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Title style={styles.sectionTitle}>
                  Your Projects {projects.length > 0 && `(${projects.length})`}
                </Title>
              </View>

              {projects.length === 0 ? (
                <View style={styles.emptyState}>
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
                    Refresh
                  </Button>
                </View>
              ) : (
                projects.map((project) => {
                  // Safely access project properties
                  const projectTitle = getProjectTitle(project);
                  const projectId = getProjectId(project);
                  const projectProgress = project.progress || project.completion_percentage || 0;
                  const projectBudget = project.budget || 0;
                  const projectStatus = project.status || 'active';
                  const projectDeadline = project.deadline || 'No deadline';
                  const projectManager = project.manager || 'Not assigned';

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
                          <Chip
                            mode="outlined"
                            style={[
                              styles.statusChip,
                              projectStatus === 'active' ? styles.statusActive : 
                              projectStatus === 'completed' ? styles.statusCompleted : styles.statusPending
                            ]}
                          >
                            {projectStatus.toUpperCase()}
                          </Chip>
                        </View>

                        {/* Progress Section */}
                        <View style={styles.progressSection}>
                          <View style={styles.progressHeader}>
                            <Text style={styles.progressLabel}>Progress</Text>
                            <Text style={styles.progressPercentage}>{projectProgress}%</Text>
                          </View>
                          <ProgressBar 
                            progress={projectProgress / 100} 
                            style={styles.progressBar}
                            color={projectProgress > 70 ? '#10B981' : projectProgress > 40 ? '#6366F1' : '#F59E0B'}
                          />
                        </View>

                        {/* Project Meta */}
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

                        {/* Quick Actions */}
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
                            icon="cash"
                            style={styles.actionButton}
                            contentStyle={styles.actionButtonContent}
                            onPress={() => handleViewPayments(project)}
                          >
                            Payments
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

          {/* Upcoming Deadlines - Enhanced */}
          {dashboardData?.upcomingDeadlines?.length > 0 && (
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

        {/* Contact Support FAB */}
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

// ... (keep your existing styles the same)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  headerContent: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '600',
  },
  notificationIcon: {
    margin: 0,
    marginLeft: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: 16,
    paddingTop: 8,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 64) / 3,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  statContent: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIconButton: {
    margin: 0,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
    textAlign: 'center',
  },
  statSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  completionCard: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 0,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  completionContent: {
    alignItems: 'center',
    marginBottom: 16,
  },
  completionPercentage: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6366F1',
    marginBottom: 8,
  },
  completionSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  budgetChip: {
    backgroundColor: '#E0E7FF',
  },
  overdueChip: {
    backgroundColor: '#FEE2E2',
  },
  projectsCard: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 0,
    marginBottom: 16,
  },
  projectItem: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  projectInfo: {
    flex: 1,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  managerName: {
    fontSize: 14,
    color: '#64748B',
  },
  statusChip: {
    height: 24,
  },
  statusActive: {
    backgroundColor: '#E0E7FF',
  },
  statusCompleted: {
    backgroundColor: '#D1FAE5',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  progressSection: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F1F5F9',
  },
  projectMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  metaIcon: {
    margin: 0,
    marginRight: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#64748B',
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
    borderColor: '#E2E8F0',
  },
  actionButtonContent: {
    paddingVertical: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    marginBottom: 8,
    color: '#64748B',
    textAlign: 'center',
    fontSize: 16,
  },
  emptySubtext: {
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 16,
  },
  refreshButton: {
    borderRadius: 8,
  },
  actionsCard: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 0,
    marginBottom: 16,
  },
  deadlineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  deadlineInfo: {
    flex: 1,
  },
  deadlineProject: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  deadlineDate: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: 'bold',
  },
  deadlineChip: {
    height: 24,
    backgroundColor: '#FEE2E2',
  },
  deadlineChipText: {
    fontSize: 10,
    color: '#DC2626',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6366F1',
  },
});

export default ClientDashboard;