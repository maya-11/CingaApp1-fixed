import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Card, Title, Text, Button, ProgressBar, IconButton, useTheme } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Project } from '../types'; // IMPORT Project from types
import AppHeader from '../components/AppHeader';

// REMOVE THE LOCAL PROJECT TYPE - use the imported one instead
// type Project = {
//   id: string;
//   name: string;
//   client: string;
//   progress: number;
//   budget: number;
//   spent: number;
//   deadline: string;
//   status: 'active' | 'completed';
//   overdueTasks: number;
//   description?: string;
// };

// NAVIGATION PROP TYPE
type ManagerDashboardNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ManagerDashboard'
>;

interface Props {
  navigation: ManagerDashboardNavigationProp;
}

const { width } = Dimensions.get('window');

const ManagerDashboard: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();

  // Mock data - will replace with API calls
  const stats = {
    activeProjects: 8,
    completedProjects: 12,
    totalBudget: 450000,
    teamMembers: 6,
  };

  // UPDATE projects to include the missing properties
  const projects: Project[] = [
    {
      id: '1',
      name: 'Website Redesign',
      client: 'ABC Corporation',
      progress: 0.65,
      budget: 50000,
      spent: 32500,
      deadline: '2024-12-31',
      status: 'active',
      manager: 'Sarah Johnson', // ADD THIS
      managerEmail: 'sarah@company.com', // ADD THIS
      description: 'Complete redesign of corporate website with modern UI/UX'
    },
    {
      id: '2',
      name: 'Mobile App Development',
      client: 'XYZ Ltd',
      progress: 0.90,
      budget: 75000,
      spent: 68000,
      deadline: '2024-10-15',
      status: 'active',
      manager: 'Sarah Johnson', // ADD THIS
      managerEmail: 'sarah@company.com', // ADD THIS
      description: 'Cross-platform mobile application development'
    },
    {
      id: '3',
      name: 'E-commerce Platform',
      client: 'Retail Pro',
      progress: 0.30,
      budget: 120000,
      spent: 36000,
      deadline: '2025-03-20',
      status: 'active',
      manager: 'Sarah Johnson', // ADD THIS
      managerEmail: 'sarah@company.com', // ADD THIS
      description: 'Full e-commerce solution with payment integration'
    }
  ];

  // Fixed navigation handler - passes full project object
  const handleViewProjectDetails = (project: Project) => {
    navigation.navigate('ProjectDetailScreen', { project: project });
  };

  const StatCard = ({ title, value, subtitle, color }: any) => (
    <Card style={styles.statCard} elevation={2}>
      <Card.Content style={styles.statContent}>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={styles.statSubtitle}>{subtitle}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <>
      <AppHeader 
        navigation={navigation} 
        title="Manager Dashboard" 
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.userName}>Sarah Johnson</Text>
          </View>
          <IconButton
            icon="bell-outline"
            size={24}
            iconColor="#6366F1"
            onPress={() => console.log('Notifications')}
          />
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard 
            title="Active Projects" 
            value={stats.activeProjects} 
            subtitle="In progress"
            color="#6366F1"
          />
          <StatCard 
            title="Completed" 
            value={stats.completedProjects} 
            subtitle="This year" 
            color="#10B981"
          />
          <StatCard 
            title="Total Budget" 
            value={`R${(stats.totalBudget / 1000).toFixed(0)}K`} 
            subtitle="All projects" 
            color="#F59E0B"
          />
          <StatCard 
            title="Team Members" 
            value={stats.teamMembers} 
            subtitle="Active" 
            color="#8B5CF6"
          />
        </View>

        {/* Recent Projects */}
        <Card style={styles.projectsCard} elevation={2}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Title style={styles.sectionTitle}>Active Projects</Title>
              <Button 
                mode="text" 
                compact
                textColor="#6366F1"
                onPress={() => navigation.navigate('ProjectListScreen')}
              >
                View All
              </Button>
            </View>

            {projects.map((project, index) => (
              <Card 
                key={project.id} 
                style={[styles.projectItem, index !== projects.length - 1 && styles.projectItemBorder]} 
                mode="elevated" 
                elevation={1}
              >
                <Card.Content>
                  <View style={styles.projectHeader}>
                    <View style={styles.projectInfo}>
                      <Text style={styles.projectName}>{project.name}</Text>
                      <Text style={styles.clientName}>{project.client}</Text>
                    </View>
                    <View style={styles.projectStatus}>
                      <View style={[styles.statusBadge, project.status === 'active' ? styles.statusActive : styles.statusCompleted]}>
                        <Text style={styles.statusText}>{project.status.toUpperCase()}</Text>
                      </View>
                      {/* REMOVE overdueTasks since it's not in the main Project type */}
                      {/* {project.overdueTasks > 0 && (
                        <View style={styles.alertBadge}>
                          <Text style={styles.alertText}>{project.overdueTasks}</Text>
                        </View>
                      )} */}
                    </View>
                  </View>

                  {/* Progress Section */}
                  <View style={styles.progressSection}>
                    <View style={styles.progressHeader}>
                      <Text style={styles.progressLabel}>Progress</Text>
                      <Text style={styles.progressPercentage}>{(project.progress * 100).toFixed(0)}%</Text>
                    </View>
                    <ProgressBar 
                      progress={project.progress} 
                      style={styles.progressBar}
                      color={project.progress > 0.7 ? '#10B981' : project.progress > 0.4 ? '#6366F1' : '#F59E0B'}
                    />
                  </View>

                  {/* Budget Stats */}
                  <View style={styles.budgetStats}>
                    <View style={styles.budgetItem}>
                      <Text style={styles.budgetLabel}>Budget</Text>
                      <Text style={styles.budgetValue}>R{project.budget.toLocaleString()}</Text>
                    </View>
                    <View style={styles.budgetItem}>
                      <Text style={styles.budgetLabel}>Spent</Text>
                      <Text style={styles.budgetValue}>R{project.spent.toLocaleString()}</Text>
                    </View>
                    <View style={styles.budgetItem}>
                      <Text style={styles.budgetLabel}>Remaining</Text>
                      <Text style={[styles.budgetValue, styles.remainingValue]}>
                        R{(project.budget - project.spent).toLocaleString()}
                      </Text>
                    </View>
                  </View>

                  {/* Deadline */}
                  <View style={styles.deadlineSection}>
                    <Text style={styles.deadlineLabel}>Deadline: {project.deadline}</Text>
                  </View>

                  {/* FIXED NAVIGATION - Pass full project object instead of just projectId */}
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
            ))}
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.actionsCard} elevation={2}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Quick Actions</Title>
            <View style={styles.actionsGrid}>
              <Button 
                mode="outlined" 
                icon="plus"
                style={styles.actionButton}
                contentStyle={styles.actionButtonContent}
                onPress={() => console.log('Add project')}
              >
                New Project
              </Button>
              <Button 
                mode="outlined" 
                icon="chart-box"
                style={styles.actionButton}
                contentStyle={styles.actionButtonContent}
                onPress={() => navigation.navigate('ProjectListScreen')}
              >
                All Projects
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </>
  );
};

// ... keep all your existing styles ...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 64) / 2,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  statContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  projectsCard: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  projectItem: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  projectItemBorder: {
    marginBottom: 16,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  clientName: {
    fontSize: 14,
    color: '#64748B',
    fontStyle: 'italic',
  },
  projectStatus: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: '#E0E7FF',
  },
  statusCompleted: {
    backgroundColor: '#D1FAE5',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  alertBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  alertText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  progressSection: {
    marginBottom: 16,
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
  budgetStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  budgetItem: {
    alignItems: 'center',
  },
  budgetLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  budgetValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  remainingValue: {
    color: '#10B981',
  },
  deadlineSection: {
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  deadlineLabel: {
    fontSize: 13,
    color: '#64748B',
    fontStyle: 'italic',
  },
  viewDetailsContent: {
    flexDirection: 'row-reverse',
  },
  viewDetailsLabel: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '600',
  },
  actionsCard: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    borderColor: '#E2E8F0',
  },
  actionButtonContent: {
    paddingVertical: 8,
  },
});

export default ManagerDashboard;