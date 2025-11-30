import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, Card, Title, Snackbar, ActivityIndicator } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Project } from '../types';
import { projectService } from '../services/backendService';
import { useAuth } from '../contexts/AuthContext';
import AppHeader from '../components/AppHeader';

type EditProjectScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditProjectScreen'>;
type EditProjectScreenRouteProp = RouteProp<RootStackParamList, 'EditProjectScreen'>;

interface Props {
  navigation: EditProjectScreenNavigationProp;
  route: EditProjectScreenRouteProp;
}

const EditProjectScreen: React.FC<Props> = ({ navigation, route }) => {
  const { user } = useAuth();
  const { project } = route.params;
  
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  // Form state - FIXED: status type
  const [projectData, setProjectData] = useState({
    title: project.title || '',
    description: project.description || '',
    budget: project.budget ? project.budget.toString() : '',
    status: (project.status || 'active') as 'active' | 'completed' | 'on-hold', // ✅ FIXED
    deadline: project.deadline || '',
  });

  const showSnackbar = (message: string): void => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const validateForm = (): boolean => {
    if (!projectData.title.trim()) {
      showSnackbar('Project title is required');
      return false;
    }
    if (!projectData.budget || isNaN(parseFloat(projectData.budget))) {
      showSnackbar('Valid budget is required');
      return false;
    }
    return true;
  };

  const handleUpdateProject = async (): Promise<void> => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const updatePayload = {
        title: projectData.title,
        description: projectData.description,
        budget: parseFloat(projectData.budget),
        status: projectData.status,
        deadline: projectData.deadline,
      };

      console.log('🔄 Updating project:', project.id, 'with:', updatePayload);

      const result = await projectService.updateProject(project.id, updatePayload);
      
      if (result) {
        console.log('✅ Project updated successfully:', result);
        showSnackbar('Project updated successfully!');
        
        setTimeout(() => {
          navigation.navigate('ProjectDetailScreen', { 
            project: { ...project, ...updatePayload } 
          });
        }, 1500);
      } else {
        throw new Error('Failed to update project');
      }

    } catch (error: any) {
      console.error('❌ Project update failed:', error);
      showSnackbar(error.message || 'Failed to update project');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = (): void => {
    Alert.alert(
      'Delete Project',
      'Are you sure you want to permanently delete this project? This action cannot be undone!',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              console.log('🗑️ Deleting project:', project.id);
              
              await projectService.deleteProject(project.id);
              
              console.log('✅ Project deleted successfully');
              showSnackbar('Project deleted permanently!');
              
              setTimeout(() => {
                navigation.navigate('ManagerDashboard');
              }, 1500);

            } catch (error: any) {
              console.error('❌ Project deletion failed:', error);
              showSnackbar(error.message || 'Failed to delete project');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <>
      <AppHeader title="Edit Project" />
      
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Edit Project</Title>
            
            {/* Project Title */}
            <TextInput
              label="Project Title *"
              value={projectData.title}
              onChangeText={(text) => setProjectData({...projectData, title: text})}
              style={styles.input}
              mode="outlined"
              theme={{ colors: { primary: '#6366F1' } }}
            />

            {/* Project Description */}
            <TextInput
              label="Project Description"
              value={projectData.description}
              onChangeText={(text) => setProjectData({...projectData, description: text})}
              style={[styles.input, styles.textArea]}
              mode="outlined"
              multiline
              numberOfLines={3}
              theme={{ colors: { primary: '#6366F1' } }}
            />

            {/* Budget */}
            <TextInput
              label="Project Budget (R) *"
              value={projectData.budget}
              onChangeText={(text) => setProjectData({...projectData, budget: text})}
              style={styles.input}
              mode="outlined"
              keyboardType="numeric"
              theme={{ colors: { primary: '#6366F1' } }}
            />

            {/* Status - FIXED: Use buttons instead of free text input */}
            <View style={styles.input}>
              <Text style={styles.label}>Status *</Text>
              <View style={styles.statusButtons}>
                <Button 
                  mode={projectData.status === 'active' ? 'contained' : 'outlined'}
                  onPress={() => setProjectData({...projectData, status: 'active'})}
                  style={styles.statusButton}
                >
                  Active
                </Button>
                <Button 
                  mode={projectData.status === 'completed' ? 'contained' : 'outlined'}
                  onPress={() => setProjectData({...projectData, status: 'completed'})}
                  style={styles.statusButton}
                >
                  Completed
                </Button>
                <Button 
                  mode={projectData.status === 'on-hold' ? 'contained' : 'outlined'}
                  onPress={() => setProjectData({...projectData, status: 'on-hold'})}
                  style={styles.statusButton}
                >
                  On Hold
                </Button>
              </View>
            </View>

            {/* Deadline */}
            <TextInput
              label="Deadline"
              value={projectData.deadline}
              onChangeText={(text) => setProjectData({...projectData, deadline: text})}
              style={styles.input}
              mode="outlined"
              placeholder="YYYY-MM-DD"
              theme={{ colors: { primary: '#6366F1' } }}
            />

            {/* Update Button */}
            <Button 
              mode="contained" 
              onPress={handleUpdateProject}
              loading={loading}
              disabled={loading}
              style={styles.updateButton}
              contentStyle={styles.buttonContent}
              icon="check"
            >
              Update Project
            </Button>

            {/* Delete Button (Only for managers) */}
            {user?.role === 'manager' && (
              <Button 
                mode="outlined" 
                onPress={handleDeleteProject}
                loading={loading}
                disabled={loading}
                style={styles.deleteButton}
                contentStyle={styles.buttonContent}
                icon="delete"
                textColor="#EF4444"
              >
                Delete Project Permanently
              </Button>
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={4000}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  card: {
    margin: 16,
    borderRadius: 16,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#1E293B',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 100,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#374151',
  },
  statusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  updateButton: {
    marginTop: 8,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#6366F1',
  },
  deleteButton: {
    borderColor: '#EF4444',
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  snackbar: {
    backgroundColor: '#1E293B',
  },
});

export default EditProjectScreen;