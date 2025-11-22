import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  ProgressBar,
  Chip,
  Button,
  Divider,
  List,
  Text,
  Avatar,
  useTheme,
  ActivityIndicator,
  ToggleButton,
  IconButton
} from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { ClientStackParamList, Project } from '../../types';
import { projectService, taskService } from '../../services/backendService';
import { trelloService } from '../../services/trelloService';

type ClientProjectDetailScreenNavigationProp = StackNavigationProp<ClientStackParamList, 'ClientProjectDetail'>;

interface ClientProjectDetailScreenProps {
  navigation: ClientProjectDetailScreenNavigationProp;
  route: any;
}

const ClientProjectDetailScreen: React.FC<ClientProjectDetailScreenProps> = ({
  navigation,
  route
}) => {
  const theme = useTheme();
  const { project } = route.params || {};
  
  const [realProject, setRealProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [trelloConnected, setTrelloConnected] = useState(false);
  const [trelloBoard, setTrelloBoard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (project) {
      loadProjectData();
      checkTrelloStatus();
    }
  }, [project]);

  const loadProjectData = async () => {
    try {
      setLoading(true);
      
      // Load real project data
      const projectData = await projectService.getProject(project.id.toString());
      setRealProject(projectData);
      
      // Load project tasks
      const projectTasks = await taskService.getProjectTasks(project.id.toString());
      setTasks(projectTasks);
      
    } catch (error) {
      console.error('Failed to load project data:', error);
      // Fallback to passed project data with proper formatting
      setRealProject({
        ...project,
        // Ensure all required fields
        id: project.id || (project as any)._id,
        title: project.title || (project as any).name || 'Untitled Project',
        description: project.description || 'No description available',
        status: project.status || 'active',
        progress: project.progress || project.completion_percentage || 0,
        budget: project.budget || 0,
        current_spent: project.current_spent || 0,
        deadline: project.deadline || 'No deadline set',
        manager: project.manager || 'Not assigned'
      });
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const checkTrelloStatus = async () => {
    try {
      // Use the correct method from trelloService
      const token = await trelloService.getStoredToken();
      const isConnected = !!token;
      setTrelloConnected(isConnected);
      
      if (project.trello_board_id) {
        setTrelloBoard({ id: project.trello_board_id });
      }
    } catch (error) {
      console.log('Trello not connected');
      setTrelloConnected(false);
    }
  };

  const getTrelloStatus = async () => {
    try {
      // Simple check without Firebase auth for now
      try {
  const result = await trelloService.checkConnection();
  // Assume the backend returns { connected: true/false }
  const isConnected = result?.connected ?? false;
  setTrelloConnected(isConnected);
} catch (error) {
  console.log('Trello not connected');
  setTrelloConnected(false);
}
    } catch (error) {
      console.error('Trello status error:', error);
      return { connected: false };
    }
  };

  const handleStatusUpdate = async (newStatus: "active" | "completed" | "on-hold") => {
    try {
      setUpdatingStatus(true);
      await projectService.updateProject(project.id.toString(), { status: newStatus });
      
      // Update local state
      setRealProject(prev => prev ? { ...prev, status: newStatus } : null);
      
      Alert.alert('Success', `Project status updated to ${newStatus}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update project status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleConnectTrello = async () => {
    try {
      Alert.alert(
        'Connect Trello',
        'Connect to Trello to view project progress and collaborate with your team.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Connect', 
            onPress: async () => {
              // Use the correct method - saveToken instead of setToken
              const mockToken = 'client_trello_token_' + Date.now();
              await trelloService.saveToken(mockToken);
              setTrelloConnected(true);
              Alert.alert('Success', 'Trello connected! You can now view project progress.');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to Trello');
    }
  };

  const handleViewTrelloBoard = () => {
    if (trelloBoard) {
      Alert.alert(
        'Trello Board',
        `This would open your Trello board in the app.\n\nBoard ID: ${trelloBoard.id}`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert('No Board', 'No Trello board linked to this project yet.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return '#10B981';
      case 'active': return '#6366F1';
      case 'on-hold': return '#F59E0B';
      case 'planning': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'IN PROGRESS';
      case 'completed': return 'COMPLETED';
      case 'on-hold': return 'ON HOLD';
      case 'planning': return 'PLANNING';
      default: return status?.toUpperCase() || 'ACTIVE';
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading project details...</Text>
      </View>
    );
  }

  const currentProject = realProject || project;
  
  // Safely access project properties with fallbacks
  const projectTitle = currentProject?.title || (currentProject as any)?.name || 'Untitled Project';
  const projectDescription = currentProject?.description || 'No description available';
  const projectStatus = currentProject?.status || 'active';
  const progressPercentage = currentProject?.progress || currentProject?.completion_percentage || 0;
  const budget = currentProject?.budget || 0;
  const spent = currentProject?.current_spent || 0;
  const remaining = budget - spent;

  // Format currency safely
  const formatCurrency = (amount: number) => {
    if (!amount || isNaN(amount)) return 'R0';
    return `R${amount.toLocaleString('en-ZA')}`;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Project Header */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Title style={styles.projectTitle}>{projectTitle}</Title>
            <Chip
              mode="outlined"
              style={[styles.statusChip, { backgroundColor: getStatusColor(projectStatus) + '20' }]}
              textStyle={{ color: getStatusColor(projectStatus) }}
            >
              {getStatusText(projectStatus)}
            </Chip>
          </View>
          <Paragraph style={styles.description}>
            {projectDescription}
          </Paragraph>
          
          {/* Project Status Control */}
          <View style={styles.statusControl}>
            <Text style={styles.statusLabel}>Update Project Status:</Text>
            <View style={styles.statusButtons}>
              <ToggleButton
                icon="progress-check"
                value="active"
                status={projectStatus === 'active' ? 'checked' : 'unchecked'}
                onPress={() => handleStatusUpdate('active')}
                disabled={updatingStatus}
                style={styles.statusButton}
              />
              <ToggleButton
                icon="check-circle"
                value="completed"
                status={projectStatus === 'completed' ? 'checked' : 'unchecked'}
                onPress={() => handleStatusUpdate('completed')}
                disabled={updatingStatus}
                style={styles.statusButton}
              />
              <ToggleButton
                icon="pause-circle"
                value="on-hold"
                status={projectStatus === 'on-hold' ? 'checked' : 'unchecked'}
                onPress={() => handleStatusUpdate('on-hold')}
                disabled={updatingStatus}
                style={styles.statusButton}
              />
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Progress Section */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Project Progress</Title>
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text variant="bodyMedium">{progressPercentage}% Complete</Text>
              <Text variant="bodyMedium" style={styles.phaseText}>
                {tasks.length} Tasks • {tasks.filter((t: any) => t.status === 'completed').length} Completed
              </Text>
            </View>
            <ProgressBar 
              progress={progressPercentage / 100}
              color={progressPercentage > 70 ? '#10B981' : progressPercentage > 40 ? '#6366F1' : '#F59E0B'}
              style={styles.progressBar}
            />
          </View>
        </Card.Content>
      </Card>

      {/* Budget Overview */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Budget Overview</Title>
          <View style={styles.budgetContainer}>
            <View style={styles.budgetItem}>
              <Text variant="bodySmall" style={styles.budgetLabel}>Total Budget</Text>
              <Text variant="titleMedium" style={styles.budgetAmount}>
                {formatCurrency(budget)}
              </Text>
            </View>
            <View style={styles.budgetItem}>
              <Text variant="bodySmall" style={styles.budgetLabel}>Amount Spent</Text>
              <Text variant="titleMedium" style={[styles.budgetAmount, styles.spentAmount]}>
                {formatCurrency(spent)}
              </Text>
            </View>
            <View style={styles.budgetItem}>
              <Text variant="bodySmall" style={styles.budgetLabel}>Remaining</Text>
              <Text variant="titleMedium" style={[styles.budgetAmount, styles.remainingAmount]}>
                {formatCurrency(remaining)}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Trello Integration Section */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>Project Collaboration</Title>
            <IconButton
              icon="trello"
              size={20}
              iconColor="#6366F1"
            />
          </View>
          
          {trelloConnected ? (
            <View style={styles.connectedState}>
              <Chip mode="flat" style={styles.connectedChip} icon="check-circle">
                Connected to Trello
              </Chip>
              <Text style={styles.trelloDescription}>
                View real-time project progress and collaborate with your team on Trello.
              </Text>
              <Button
                mode="contained"
                style={styles.trelloButton}
                onPress={handleViewTrelloBoard}
                icon="open-in-new"
              >
                View Trello Board
              </Button>
            </View>
          ) : (
            <View style={styles.disconnectedState}>
              <Text style={styles.trelloDescription}>
                Connect to Trello to view project tasks, progress updates, and collaborate with your team in real-time.
              </Text>
              <Button
                mode="outlined"
                style={styles.trelloButton}
                onPress={handleConnectTrello}
                icon="trello"
              >
                Connect Trello
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Recent Tasks */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Recent Tasks</Title>
          {tasks.slice(0, 5).map((task: any) => (
            <List.Item
              key={task.id}
              title={task.title || 'Untitled Task'}
              description={task.description || 'No description'}
              left={props => (
                <Avatar.Icon 
                  {...props} 
                  icon={
                    task.status === 'completed' ? 'check-circle' :
                    task.status === 'in_progress' ? 'progress-clock' : 'checkbox-blank-circle-outline'
                  }
                  size={40}
                  style={{
                    backgroundColor: 
                      task.status === 'completed' ? '#10B98120' :
                      task.status === 'in_progress' ? '#6366F120' : '#64748B20'
                  }}
                  color={
                    task.status === 'completed' ? '#10B981' :
                    task.status === 'in_progress' ? '#6366F1' : '#64748B'
                  }
                />
              )}
              right={props => (
                <Chip 
                  mode="outlined" 
                  style={[
                    styles.taskStatusChip,
                    {
                      backgroundColor: 
                        task.status === 'completed' ? '#10B98120' :
                        task.status === 'in_progress' ? '#6366F120' : '#64748B20'
                    }
                  ]}
                  textStyle={{
                    color: 
                      task.status === 'completed' ? '#10B981' :
                      task.status === 'in_progress' ? '#6366F1' : '#64748B',
                    fontSize: 12
                  }}
                >
                  {task.status?.replace('_', ' ').toUpperCase() || 'PENDING'}
                </Chip>
              )}
            />
          ))}
          {tasks.length === 0 && (
            <Text style={styles.noTasksText}>No tasks available for this project.</Text>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

// ... (keep your existing styles the same)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
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
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  projectTitle: {
    flex: 1,
    marginRight: 12,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  statusChip: {
    height: 32,
  },
  description: {
    marginBottom: 16,
    lineHeight: 20,
    color: '#64748B',
  },
  statusControl: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  statusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statusButton: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  phaseText: {
    color: '#64748B',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  budgetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetItem: {
    alignItems: 'center',
    flex: 1,
  },
  budgetLabel: {
    color: '#64748B',
    marginBottom: 8,
    fontSize: 12,
  },
  budgetAmount: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1E293B',
  },
  spentAmount: {
    color: '#EF4444',
  },
  remainingAmount: {
    color: '#10B981',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  connectedState: {
    alignItems: 'center',
  },
  disconnectedState: {
    alignItems: 'center',
  },
  connectedChip: {
    backgroundColor: '#D1FAE5',
    marginBottom: 12,
  },
  trelloDescription: {
    textAlign: 'center',
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 16,
  },
  trelloButton: {
    borderRadius: 8,
  },
  taskStatusChip: {
    height: 24,
  },
  noTasksText: {
    textAlign: 'center',
    color: '#64748B',
    fontStyle: 'italic',
    marginVertical: 16,
  },
});

export default ClientProjectDetailScreen;