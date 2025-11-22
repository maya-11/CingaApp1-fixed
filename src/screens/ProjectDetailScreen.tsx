import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Alert } from 'react-native';
import { Card, Title, Text, Button, ProgressBar, Chip, IconButton, Snackbar } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Project } from '../types';
import AppHeader from '../components/AppHeader';

const { width } = Dimensions.get('window');

type ProjectDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProjectDetailScreen'>;
type ProjectDetailScreenRouteProp = RouteProp<RootStackParamList, 'ProjectDetailScreen'>;

interface Props {
  navigation: ProjectDetailScreenNavigationProp;
  route: ProjectDetailScreenRouteProp;
}

const ProjectDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const project = route.params.project;
  const progressPercentage = typeof project.progress === 'number' ? project.progress : 0;
  const daysLeft = Math.ceil((new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleUpdateProject = () => {
    Alert.alert('Update Project', 'Project editing functionality coming soon!');
  };

  // Navigation to separate screens
  const handleOpenTasks = () => {
    navigation.navigate('TasksScreen', { project });
  };

  const handleOpenBudget = () => {
    navigation.navigate('BudgetScreen', { project });
  };

  const handleOpenTrello = () => {
    navigation.navigate('TrelloScreen', { project });
  };

  return (
    <>
      <AppHeader title="Project Details" />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerGradient}>
          <Card.Content>
            <Text style={styles.projectName}>{project.title}</Text>
            <Text style={styles.clientName}>Client: {project.client || 'No client assigned'}</Text>
            
            <View style={styles.progressBarContainer}>
              <ProgressBar
                progress={progressPercentage / 100}
                color={
                  progressPercentage > 70
                    ? '#10B981'
                    : progressPercentage > 40
                    ? '#6366F1'
                    : '#F59E0B'
                }
                style={styles.progressBar}
              />
            </View>

            <View style={styles.projectMeta}>
              <Text style={styles.projectDates}>
                {project.startDate || 'Not set'} → {project.deadline || 'Not set'} • {daysLeft > 0 ? daysLeft : 0} days remaining
              </Text>
              <Chip
                mode="flat"
                style={[
                  styles.projectStatus,
                  project.status === 'active' ? styles.activeStatus : 
                  project.status === 'completed' ? styles.completedStatus : styles.pendingStatus
                ]}
              >
                {project.status?.toUpperCase() || 'ACTIVE'}
              </Chip>
            </View>
          </Card.Content>
        </View>

        {/* Quick Stats */}
        <View style={styles.infoContainer}>
          <View style={[styles.gradientInfoCard, styles.primaryGradient]}>
            <Card.Content style={styles.gradientCardContent}>
              <Text style={styles.gradientInfoLabel}>Progress</Text>
              <Text style={styles.gradientInfoValue}>{progressPercentage}%</Text>
            </Card.Content>
          </View>

          <View style={[styles.gradientInfoCard, styles.warningGradient]}>
            <Card.Content style={styles.gradientCardContent}>
              <Text style={styles.gradientInfoLabel}>Days Left</Text>
              <Text style={styles.gradientInfoValue}>{daysLeft > 0 ? daysLeft : 0}</Text>
            </Card.Content>
          </View>

          <View style={[styles.gradientInfoCard, styles.successGradient]}>
            <Card.Content style={styles.gradientCardContent}>
              <Text style={styles.gradientInfoLabel}>Budget</Text>
              <Text style={styles.gradientInfoValue}>R{project.budget?.toLocaleString() || '0'}</Text>
            </Card.Content>
          </View>
        </View>

        {/* Quick Actions */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Quick Actions</Title>
            <View style={styles.quickActionsGrid}>
              <Button 
                mode="contained" 
                onPress={handleOpenTasks}
                style={styles.quickActionButton}
                icon="format-list-checks"
                contentStyle={styles.quickActionContent}
              >
                Tasks
              </Button>
              <Button 
                mode="contained" 
                onPress={handleOpenBudget}
                style={styles.quickActionButton}
                icon="cash"
                contentStyle={styles.quickActionContent}
              >
                Budget
              </Button>
              <Button 
                mode="contained" 
                onPress={handleOpenTrello}
                style={styles.quickActionButton}
                icon="trello"
                contentStyle={styles.quickActionContent}
              >
                Trello
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Project Summary */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Project Summary</Title>
            <Text style={styles.descriptionText}>
              {project.description || 'No description provided.'}
            </Text>
          </Card.Content>
        </Card>

        {/* Project Progress */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Project Progress</Title>
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Overall Completion</Text>
                <Text style={styles.progressPercentage}>{progressPercentage}%</Text>
              </View>
              <ProgressBar
                progress={progressPercentage / 100}
                style={styles.progressBar}
                color={progressPercentage > 70 ? '#10B981' : progressPercentage > 40 ? '#6366F1' : '#F59E0B'}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Project Details */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Title style={styles.sectionTitle}>Project Details</Title>
              <Button 
                mode="contained" 
                style={styles.editButton}
                onPress={handleUpdateProject}
                icon="pencil"
                labelStyle={styles.buttonLabel}
              >
                Edit
              </Button>
            </View>
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Start Date</Text>
                <Text style={styles.detailValue}>{project.startDate || 'Not set'}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Deadline</Text>
                <Text style={styles.detailValue}>{project.deadline || 'Not set'}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Client</Text>
                <Text style={styles.detailValue}>{project.client || 'No client assigned'}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Status</Text>
                <Chip 
                  mode="flat"
                  style={[
                    styles.statusChip,
                    project.status === 'active' ? styles.statusActive : 
                    project.status === 'completed' ? styles.statusCompleted : styles.statusPending
                  ]}
                >
                  {project.status?.toUpperCase() || 'ACTIVE'}
                </Chip>
              </View>
            </View>
          </Card.Content>
        </Card>

        <View style={{ height: 20 }} />
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </>
  );
};

// Clean, simplified styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerGradient: {
    margin: 16,
    marginBottom: 12,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#6c97cc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    backgroundColor: '#6c97cc',
  },
  projectName: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
    color: '#ffffff',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  clientName: {
    fontSize: 16,
    color: '#e2e8f0',
    marginBottom: 16,
    fontWeight: '500',
  },
  progressBarContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    padding: 4,
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  projectMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectDates: {
    fontSize: 14,
    color: '#e2e8f0',
    flex: 1,
    fontWeight: '500',
  },
  projectStatus: {
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  activeStatus: {
    backgroundColor: 'rgba(99, 102, 241, 0.3)',
  },
  completedStatus: {
    backgroundColor: 'rgba(16, 185, 129, 0.3)',
  },
  pendingStatus: {
    backgroundColor: 'rgba(245, 158, 11, 0.3)',
  },
  infoContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 20,
    gap: 10,
  },
  gradientInfoCard: {
    flex: 1,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  primaryGradient: {
    backgroundColor: '#6c97cc',
  },
  successGradient: {
    backgroundColor: '#10b981',
  },
  warningGradient: {
    backgroundColor: '#f59e0b',
  },
  gradientCardContent: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  gradientInfoLabel: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 6,
  },
  gradientInfoValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  card: {
    margin: 16,
    marginBottom: 0,
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#475569',
    fontWeight: '500',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#6c97cc',
  },
  quickActionContent: {
    paddingVertical: 8,
  },
  progressSection: {
    marginBottom: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  detailsGrid: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
  },
  statusChip: {
    height: 28,
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
  editButton: {
    backgroundColor: '#6c97cc',
    borderRadius: 8,
  },
  buttonLabel: {
    fontWeight: '600',
    fontSize: 13,
  },
  snackbar: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    marginBottom: 20,
  },
});

export default ProjectDetailScreen;