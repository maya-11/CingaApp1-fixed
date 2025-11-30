import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Alert, RefreshControl } from 'react-native';
import { Card, Title, Text, Button, ProgressBar, Chip, IconButton, Snackbar, ActivityIndicator } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList, Project } from '../types';
import AppHeader from '../components/AppHeader';
import { projectService } from '../services/backendService';

const { width } = Dimensions.get('window');

type ProjectDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProjectDetailScreen'>;
type ProjectDetailScreenRouteProp = RouteProp<RootStackParamList, 'ProjectDetailScreen'>;

interface Props {
  navigation: ProjectDetailScreenNavigationProp;
  route: ProjectDetailScreenRouteProp;
}

const ProjectDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [project, setProject] = useState<Project>(route.params.project);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Enhanced fetch with debug logging
  const fetchProjectData = async (showLoader: boolean = true): Promise<void> => {
    try {
      if (showLoader) {
        setRefreshing(true);
      }
      
      console.log('🔄 Frontend: Fetching project ID:', project.id);
      const projectData = await projectService.getProjectById(project.id);
      
      // Ensure is_archived is properly set as boolean
      const updatedProject = {
        ...projectData,
        is_archived: Boolean(projectData.is_archived)
      };
      
      console.log('🔍 Frontend: Received project data:', {
        id: updatedProject.id,
        title: updatedProject.title,
        is_archived: updatedProject.is_archived
      });
      
      setProject(updatedProject);
    } catch (error) {
      console.error('❌ Failed to fetch project:', error);
      showSnackbar('Failed to refresh project data');
    } finally {
      setRefreshing(false);
    }
  };

  // Better screen focus handling
  useFocusEffect(
    useCallback(() => {
      console.log('🎯 ProjectDetailScreen focused - refreshing data');
      fetchProjectData(false);
    }, [project.id])
  );

  // Enhanced refresh control
  const onRefresh = (): void => {
    setRefreshing(true);
    fetchProjectData(false);
  };

  const progressPercentage: number = typeof project.progress === 'number' ? project.progress : 0;
  const daysLeft: number = Math.ceil((new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const showSnackbar = (message: string): void => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  // 🆕 UPDATED: Navigate to Edit Project Screen
  const handleUpdateProject = (): void => {
    navigation.navigate('EditProjectScreen', { project });
  };

  // Archive functionality
  const handleArchiveProject = async (): Promise<void> => {
    Alert.alert(
      'Archive Project',
      'Are you sure you want to archive this project? It will be hidden from main lists but can be restored later.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Archive', 
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              console.log('🔄 Frontend: Archiving project:', project.id);
              await projectService.archiveProject(project.id);
              
              console.log('✅ Frontend: Archive successful, updating local state');
              // Update local state immediately
              setProject(prev => {
                const updated = { ...prev, is_archived: true };
                console.log('🔍 Frontend: Local state updated to:', updated.is_archived);
                return updated;
              });
              
              showSnackbar('Project archived successfully!');
              
              // Navigate back to dashboard where archived projects are filtered out
              setTimeout(() => {
                navigation.navigate('ManagerDashboard');
              }, 1500);
              
            } catch (error: any) {
              console.error('Archive error:', error);
              showSnackbar('Failed to archive project: ' + error.message);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  // Unarchive functionality  
  const handleUnarchiveProject = async (): Promise<void> => {
    try {
      setLoading(true);
      console.log('🔄 Frontend: Unarchiving project:', project.id);
      await projectService.unarchiveProject(project.id);
        
      console.log('✅ Frontend: Unarchive successful, updating local state');
      // Update local state immediately
      setProject(prev => {
        const updated = { ...prev, is_archived: false };
        console.log('🔍 Frontend: Local state updated to:', updated.is_archived);
        return updated;
      });
      
      showSnackbar('Project unarchived successfully!');
      
    } catch (error: any) {
      console.error('Unarchive error:', error);
      showSnackbar('Failed to unarchive project: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Navigation to separate screens
  const handleOpenTasks = (): void => {
    navigation.navigate('TasksScreen', { project });
  };

  const handleOpenBudget = (): void => {
    navigation.navigate('BudgetScreen', { project });
  };

  return (
    <>
      <AppHeader title="Project Details" />
      
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#6366F1']}
            tintColor="#6366F1"
          />
        }
      >
        {/* Header Section */}
        <View style={[
          styles.headerGradient, 
          project.is_archived && styles.archivedHeader
        ]}>
          <Card.Content>
            <View style={styles.headerTopRow}>
              <Text style={styles.projectName}>{project.title}</Text>
              {project.is_archived && (
                <Chip mode="flat" style={styles.archivedChip} textStyle={styles.archivedChipText}>
                  📁 ARCHIVED
                </Chip>
              )}
            </View>
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

        {/* Archive/Unarchive Action Buttons */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Project Actions</Title>
            <View style={styles.actionButtons}>
              {project.is_archived ? (
                <Button 
                  mode="contained" 
                  onPress={handleUnarchiveProject}
                  loading={loading}
                  disabled={loading}
                  style={styles.unarchiveButton}
                  icon="archive-arrow-up"
                  contentStyle={styles.actionButtonContent}
                >
                  {loading ? 'Unarchiving...' : 'Unarchive Project'}
                </Button>
              ) : (
                <Button 
                  mode="outlined" 
                  onPress={handleArchiveProject}
                  loading={loading}
                  disabled={loading}
                  style={styles.archiveButton}
                  icon="archive"
                  contentStyle={styles.actionButtonContent}
                >
                  {loading ? 'Archiving...' : 'Archive Project'}
                </Button>
              )}
            </View>
            {project.is_archived && (
              <Text style={styles.archiveNote}>
                📁 This project is archived and hidden from main lists. Clients cannot see archived projects.
              </Text>
            )}
          </Card.Content>
        </Card>

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

        {/* Quick Actions - Disabled when archived */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Quick Actions</Title>
            <View style={styles.quickActionsGrid}>
              <Button 
                mode="contained" 
                onPress={handleOpenTasks}
                style={[
                  styles.quickActionButton,
                  project.is_archived && styles.disabledButton
                ]}
                icon="format-list-checks"
                contentStyle={styles.quickActionContent}
                disabled={project.is_archived}
              >
                Tasks
              </Button>
              <Button 
                mode="contained" 
                onPress={handleOpenBudget}
                style={[
                  styles.quickActionButton,
                  project.is_archived && styles.disabledButton
                ]}
                icon="cash"
                contentStyle={styles.quickActionContent}
                disabled={project.is_archived}
              >
                Budget
              </Button>
            </View>
            {project.is_archived && (
              <Text style={styles.disabledNote}>
                ⚠️ Quick actions are disabled for archived projects
              </Text>
            )}
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
                style={[
                  styles.editButton,
                  project.is_archived && styles.disabledButton
                ]}
                onPress={handleUpdateProject}
                icon="pencil"
                labelStyle={styles.buttonLabel}
                disabled={project.is_archived}
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
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Archive Status</Text>
                <Chip 
                  mode="flat"
                  style={[
                    styles.statusChip,
                    project.is_archived ? styles.archivedStatus : styles.activeArchiveStatus
                  ]}
                >
                  {project.is_archived ? '📁 ARCHIVED' : '✅ ACTIVE'}
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
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </>
  );
};

// ✅ FIXED: Removed Trello button, cleaned shadows, improved borders and fonts
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerGradient: {
    margin: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#6c97cc',
    borderWidth: 1,
    borderColor: '#4B7BBD',
    // Removed elevation and shadows
  },
  archivedHeader: {
    backgroundColor: '#94A3B8',
    borderColor: '#7C8A9C',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  projectName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
    marginRight: 12,
    letterSpacing: 0.3,
  },
  archivedChip: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    height: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  archivedChipText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 12,
    letterSpacing: 0.2,
  },
  clientName: {
    fontSize: 16,
    color: '#e2e8f0',
    marginBottom: 16,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  progressBarContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
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
    letterSpacing: 0.2,
  },
  projectStatus: {
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
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
  // Archive Action Styles
  actionButtons: {
    marginBottom: 8,
  },
  archiveButton: {
    borderColor: '#EF4444',
    borderWidth: 1.5,
    borderRadius: 8,
  },
  unarchiveButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
  },
  actionButtonContent: {
    paddingVertical: 6,
  },
  archiveNote: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 0.2,
  },
  disabledNote: {
    fontSize: 12,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  disabledButton: {
    backgroundColor: '#94A3B8',
    opacity: 0.6,
  },
  infoContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 20,
    gap: 10,
  },
  gradientInfoCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    // Removed elevation and shadows
  },
  primaryGradient: {
    backgroundColor: '#6c97cc',
    borderColor: '#4B7BBD',
  },
  successGradient: {
    backgroundColor: '#10b981',
    borderColor: '#0D9C6F',
  },
  warningGradient: {
    backgroundColor: '#f59e0b',
    borderColor: '#D38A09',
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
    letterSpacing: 0.2,
  },
  gradientInfoValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  card: {
    margin: 16,
    marginBottom: 0,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    // Removed elevation
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
    letterSpacing: 0.3,
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
    letterSpacing: 0.2,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#6c97cc',
    borderWidth: 1,
    borderColor: '#4B7BBD',
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
    letterSpacing: 0.2,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    letterSpacing: 0.2,
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
    letterSpacing: 0.2,
  },
  detailValue: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  statusChip: {
    height: 28,
    borderWidth: 1,
  },
  statusActive: {
    backgroundColor: '#E0E7FF',
    borderColor: '#6366F1',
  },
  statusCompleted: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  archivedStatus: {
    backgroundColor: '#FECACA',
    borderColor: '#EF4444',
  },
  activeArchiveStatus: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  editButton: {
    backgroundColor: '#6c97cc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4B7BBD',
  },
  buttonLabel: {
    fontWeight: '600',
    fontSize: 13,
    letterSpacing: 0.2,
  },
  snackbar: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    marginBottom: 20,
  },
});

export default ProjectDetailScreen;