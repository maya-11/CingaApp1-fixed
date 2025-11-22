import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, RefreshControl } from 'react-native';
import { Card, Title, Text, Button, ProgressBar, Chip, IconButton, ActivityIndicator, TextInput } from 'react-native-paper';
import { Tasks, Project } from '../types';
import { taskService } from '../services/backendService';
import AppHeader from '../components/AppHeader';

interface TasksScreenProps {
  navigation: any;
  route: any;
}

const TasksScreen: React.FC<TasksScreenProps> = ({ navigation, route }) => {
  const { project } = route.params;
  const [tasks, setTasks] = useState<Tasks[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [addingTask, setAddingTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      setLoading(true);
      console.log('📋 Fetching tasks for project:', project.id);
      
      const tasksData = await taskService.getProjectTasks(project.id.toString());
      console.log('✅ Tasks fetched:', tasksData.length);
      
      // Transform backend data to match frontend interface
      const transformedTasks = tasksData.map((task: any) => ({
        ...task,
        name: task.name || task.title, // Handle both 'name' and 'title' from backend
        progress: calculateTaskProgress(task.status), // Calculate progress for frontend
        assignee_name: task.assigned_name || 'Unassigned' // Map assigned_name to assignee_name
      }));
      
      setTasks(transformedTasks);
    } catch (error) {
      console.error('❌ Failed to fetch tasks:', error);
      Alert.alert('Error', 'Failed to load tasks. Please check your connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Calculate progress based on status (for frontend display only)
  const calculateTaskProgress = (status: string): number => {
    switch (status) {
      case 'todo': return 0;
      case 'in_progress': return 50;
      case 'completed': return 100;
      default: return 0;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [project.id]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTasks();
  };

  // Add new task
  const handleAddTask = async () => {
    if (!newTaskName.trim()) {
      Alert.alert('Error', 'Please enter a task name');
      return;
    }

    try {
      setAddingTask(true);
      const newTaskData = {
        id: Date.now().toString(), // Generate temporary ID
        project_id: project.id,
        name: newTaskName.trim(), // ✅ USING 'name' NOT 'title'
        description: '',
        status: 'todo' as const,
        priority: 'medium' as const,
        assigned_to: '' // Empty for now
      };
      
      await taskService.createTask(newTaskData);
      setNewTaskName('');
      await fetchTasks(); // Refresh tasks
      Alert.alert('Success', 'Task created successfully!');
    } catch (error) {
      console.error('Create task error:', error);
      Alert.alert('Error', 'Failed to create task. Please try again.');
    } finally {
      setAddingTask(false);
    }
  };

  // Update task status
  const handleUpdateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      // Update locally immediately for better UX
      setTasks(prev => prev.map(task => 
        task.id.toString() === taskId ? { 
          ...task, 
          status: newStatus as any,
          progress: calculateTaskProgress(newStatus) // Update progress too
        } : task
      ));
      
      await taskService.updateTaskStatus(taskId, newStatus);
    } catch (error) {
      console.error('Update task status error:', error);
      Alert.alert('Error', 'Failed to update task status');
      // Revert local change if service call fails
      fetchTasks();
    }
  };

  // Client update task (with notes)
  const handleClientUpdateTask = async (taskId: string, newStatus: string, notes: string) => {
    try {
      setTasks(prev => prev.map(task => 
        task.id.toString() === taskId ? { 
          ...task, 
          status: newStatus as any,
          progress: calculateTaskProgress(newStatus),
          client_notes: notes
        } : task
      ));
      
      await taskService.clientUpdateTask(taskId, newStatus, notes);
      Alert.alert('Success', 'Task updated successfully!');
    } catch (error) {
      console.error('Client update task error:', error);
      Alert.alert('Error', 'Failed to update task');
      fetchTasks();
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              // Remove locally immediately for better UX
              setTasks(prev => prev.filter(task => task.id.toString() !== taskId));
              
              await taskService.deleteTask(taskId);
              Alert.alert('Success', 'Task deleted successfully');
            } catch (error) {
              console.error('Delete task error:', error);
              Alert.alert('Error', 'Failed to delete task');
              // Revert if service call fails
              fetchTasks();
            }
          }
        }
      ]
    );
  };

  // Calculate task statistics
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(task => task.status === 'completed').length,
    inProgress: tasks.filter(task => task.status === 'in_progress').length,
    todo: tasks.filter(task => task.status === 'todo').length,
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'in_progress': return '#6366F1';
      case 'todo': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  // Get status display text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'COMPLETED';
      case 'in_progress': return 'IN PROGRESS';
      case 'todo': return 'TO DO';
      default: return status.toUpperCase();
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading tasks...</Text>
      </View>
    );
  }

  return (
    <>
      <AppHeader title="Project Tasks" showBackButton={true} />
      
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Task Statistics */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Task Overview</Title>
            <View style={styles.taskStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{taskStats.total}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, styles.statCompleted]}>{taskStats.completed}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, styles.statInProgress]}>{taskStats.inProgress}</Text>
                <Text style={styles.statLabel}>In Progress</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, styles.statTodo]}>{taskStats.todo}</Text>
                <Text style={styles.statLabel}>To Do</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Add Task Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Add New Task</Title>
            <View style={styles.addTaskContainer}>
              <TextInput
                label="Task Name"
                value={newTaskName}
                onChangeText={setNewTaskName}
                style={styles.taskInput}
                mode="outlined"
                disabled={addingTask}
                placeholder="Enter task name..."
              />
              <Button
                mode="contained"
                onPress={handleAddTask}
                loading={addingTask}
                disabled={addingTask || !newTaskName.trim()}
                style={styles.addButton}
                icon="plus"
              >
                Add Task
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Tasks List */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Title style={styles.sectionTitle}>
                Project Tasks ({taskStats.total})
              </Title>
            </View>

            {tasks.map((task) => (
              <Card key={task.id} style={styles.taskCard} mode="outlined">
                <Card.Content>
                  <View style={styles.taskHeader}>
                    <View style={styles.taskInfo}>
                      <Text style={styles.taskTitle}>{task.name}</Text> {/* ✅ USING task.name */}
                      {task.description ? (
                        <Text style={styles.taskDescription}>{task.description}</Text>
                      ) : null}
                      {task.assignee_name && (
                        <Text style={styles.taskAssignee}>
                          Assigned to: {task.assignee_name}
                        </Text>
                      )}
                      {task.due_date && (
                        <Text style={styles.taskDueDate}>
                          Due: {new Date(task.due_date).toLocaleDateString()}
                        </Text>
                      )}
                      {task.client_notes && (
                        <Text style={styles.taskNotes}>
                          Notes: {task.client_notes}
                        </Text>
                      )}
                    </View>
                    <Chip
                      mode="outlined"
                      style={[
                        styles.taskStatus,
                        { 
                          backgroundColor: getStatusColor(task.status) + '20',
                          borderColor: getStatusColor(task.status)
                        }
                      ]}
                      textStyle={{ color: getStatusColor(task.status), fontSize: 12 }}
                      onPress={() => {
                        const statusOptions = ['todo', 'in_progress', 'completed'];
                        const currentIndex = statusOptions.indexOf(task.status);
                        const nextStatus = statusOptions[(currentIndex + 1) % statusOptions.length];
                        handleUpdateTaskStatus(task.id.toString(), nextStatus);
                      }}
                    >
                      {getStatusText(task.status)}
                    </Chip>
                  </View>

                  {/* Progress Bar */}
                  <ProgressBar 
                    progress={task.progress ? task.progress / 100 : 0} 
                    color={getStatusColor(task.status)}
                    style={styles.progressBar}
                  />

                  <View style={styles.taskFooter}>
                    <Text style={styles.taskId}>ID: {task.id}</Text>
                    <View style={styles.taskActions}>
                      <IconButton 
                        icon="pencil-outline" 
                        size={16} 
                        iconColor="#64748B" 
                        onPress={() => {
                          Alert.prompt(
                            'Add Notes',
                            'Enter update notes:',
                            [
                              { text: 'Cancel', style: 'cancel' },
                              { 
                                text: 'Update', 
                                onPress: (notes: string | undefined) => {
                                  if (notes) {
                                    handleClientUpdateTask(task.id.toString(), task.status, notes);
                                  }
                                }
                              }
                            ],
                            'plain-text',
                            task.client_notes || ''
                          );
                        }} 
                      />
                      <IconButton 
                        icon="delete-outline" 
                        size={16} 
                        iconColor="#EF4444" 
                        onPress={() => handleDeleteTask(task.id.toString())} 
                      />
                    </View>
                  </View>
                </Card.Content>
              </Card>
            ))}

            {tasks.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No tasks yet</Text>
                <Text style={styles.emptyStateSubtext}>
                  Get started by adding tasks to track your project progress
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </>
  );
};

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
  taskStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  statCompleted: {
    color: '#10B981',
  },
  statInProgress: {
    color: '#6366F1',
  },
  statTodo: {
    color: '#F59E0B',
  },
  addTaskContainer: {
    gap: 12,
  },
  taskInput: {
    backgroundColor: '#FFFFFF',
  },
  addButton: {
    borderRadius: 8,
  },
  taskCard: {
    marginBottom: 12,
    borderRadius: 8,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  taskInfo: {
    flex: 1,
    marginRight: 12,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  taskAssignee: {
    fontSize: 12,
    color: '#6366F1',
    marginBottom: 4,
    fontWeight: '500',
  },
  taskDueDate: {
    fontSize: 12,
    color: '#64748B',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  taskNotes: {
    fontSize: 12,
    color: '#8B5CF6',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  taskStatus: {
    height: 28,
    minWidth: 100,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 12,
    backgroundColor: '#E2E8F0',
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskId: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  taskActions: {
    flexDirection: 'row',
  },
  emptyState: {
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
});

export default TasksScreen;