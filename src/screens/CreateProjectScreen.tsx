import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Modal } from 'react-native';
import { TextInput, Button, Text, Card, Title, Chip, Snackbar, ActivityIndicator, Divider, IconButton } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Project, User, CreateProjectData } from '../types';
import { projectService, userService } from '../services/backendService';
import { useAuth } from '../contexts/AuthContext';
import AppHeader from '../components/AppHeader';

type CreateProjectScreenNavigationProp = StackNavigationProp<any, 'CreateProjectScreen'>;
type CreateProjectScreenRouteProp = RouteProp<any, 'CreateProjectScreen'>;

interface Props {
  navigation: CreateProjectScreenNavigationProp;
  route: CreateProjectScreenRouteProp;
}

const CreateProjectScreen: React.FC<Props> = ({ navigation, route }) => {
  const { user } = useAuth();
  const [clients, setClients] = useState<User[]>([]);
  const [selectedClient, setSelectedClient] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [clientsModalVisible, setClientsModalVisible] = useState(false);

  // Form state
  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
  });

  useEffect(() => {
    loadClients();
    
    if (route.params?.selectedClient) {
      console.log('✅ Pre-selected client from params:', route.params.selectedClient);
      setSelectedClient(route.params.selectedClient);
    }
  }, [route.params]);

  // Load clients
  const loadClients = async () => {
    try {
      setClientsLoading(true);
      console.log('🔄 Loading real clients from database...');
      
      const clientsData = await userService.getClients();
      console.log(`✅ Loaded ${clientsData.length} real clients`);
      
      setClients(clientsData);
      
      if (clientsData.length === 0) {
        console.log('⚠️ No clients found in database');
        showSnackbar('No clients found. Clients need to register first.');
      }
    } catch (error: any) {
      console.error('❌ Failed to load clients:', error);
      showSnackbar('Failed to load clients from server: ' + error.message);
      setClients([]);
    } finally {
      setClientsLoading(false);
    }
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  // Handle client selection from modal
  const handleSelectClient = (client: User) => {
    console.log('✅ Selected client:', client.name);
    setSelectedClient(client);
    setClientsModalVisible(false);
  };

  // Clients Modal Component
  const ClientsModal = () => (
    <Modal
      visible={clientsModalVisible}
      onDismiss={() => setClientsModalVisible(false)}
      style={styles.modalStyle}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Select Client</Text>
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
                onPress={() => handleSelectClient(client)}
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

  const validateDeadline = (date: string): string | null => {
    if (!date) return null;
    
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(date)) {
      return 'Date must be in YYYY-MM-DD format';
    }
    
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return 'Deadline cannot be in the past';
    }
    
    return null;
  };

  // ✅ FIXED: Create project function
  const handleCreateProject = async () => {
    if (!selectedClient) {
      showSnackbar('Please select a client');
      return;
    }

    if (!selectedClient.id) {
      showSnackbar('Invalid client selected');
      return;
    }

    if (!projectData.title || !projectData.budget || !projectData.deadline) {
      showSnackbar('Please fill in all required fields');
      return;
    }

    if (!user?.id) {
      showSnackbar('User not found. Please login again.');
      return;
    }

    // Validate deadline format
    const deadlineError = validateDeadline(projectData.deadline);
    if (deadlineError) {
      showSnackbar(deadlineError);
      return;
    }

    try {
      setLoading(true);
      
      const projectPayload: CreateProjectData = {
        title: projectData.title,
        description: projectData.description,
        manager_id: user.id,
        client_id: selectedClient.id,
        budget: parseFloat(projectData.budget.replace(/[^0-9.]/g, '')),
        deadline: projectData.deadline,
        status: 'active',
        start_date: new Date().toISOString().split('T')[0]
      };

      console.log('🚀 Creating project with CORRECT field names:', projectPayload);

      // ✅ FIXED: Don't check for result.success - just check if result exists
      const result = await projectService.createProject(projectPayload);
      
      if (result) {
        console.log('✅ Project created successfully:', result);
        showSnackbar('Project created successfully! Client will be notified.');
        
        setTimeout(() => {
          navigation.navigate('ManagerDashboard');
        }, 1500);
      } else {
        throw new Error('Failed to create project - no response from server');
      }

    } catch (error: any) {
      console.error('❌ Project creation failed:', error);
      // ✅ FIXED: Better error message
      showSnackbar('Failed to create project: ' + (error.response?.data?.error || error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppHeader title="Create Project" />
      
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Create New Project</Title>
            
            {/* Project Title */}
            <TextInput
              label="Project Title *"
              value={projectData.title}
              onChangeText={(text) => setProjectData({...projectData, title: text})}
              style={styles.input}
              mode="outlined"
              placeholder="Enter project title"
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
              placeholder="Describe the project scope and objectives"
              theme={{ colors: { primary: '#6366F1' } }}
            />

            {/* IMPROVED CLIENT SELECTION SECTION */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Client *</Text>
              
              {clientsLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#6366F1" />
                  <Text style={styles.loadingText}>Loading clients...</Text>
                </View>
              ) : (
                <>
                  {/* Selected Client Display - BEAUTIFIED */}
                  {selectedClient ? (
                    <Card style={styles.selectedClientCard}>
                      <Card.Content style={styles.selectedClientContent}>
                        <View style={styles.selectedClientHeader}>
                          <Text style={styles.selectedClientName}>{selectedClient.name}</Text>
                          <IconButton
                            icon="close"
                            size={16}
                            onPress={() => setSelectedClient(null)}
                            style={styles.removeClientButton}
                          />
                        </View>
                        <Text style={styles.selectedClientEmail}>{selectedClient.email}</Text>
                        <Chip 
                          mode="outlined" 
                          icon="check-circle"
                          style={styles.selectedClientChip}
                          textStyle={styles.selectedClientChipText}
                        >
                          Selected
                        </Chip>
                      </Card.Content>
                    </Card>
                  ) : (
                    <View style={styles.clientSelectionSection}>
                      <Button 
                        mode="outlined" 
                        icon="account-multiple"
                        onPress={() => setClientsModalVisible(true)}
                        style={styles.clientButton}
                        contentStyle={styles.clientButtonContent}
                        disabled={clients.length === 0}
                      >
                        {clients.length === 0 ? 'No Clients Available' : `Select Client (${clients.length} available)`}
                      </Button>
                      
                      {/* CLIENT CHIPS PREVIEW */}
                      {clients.length > 0 && (
                        <View style={styles.clientsPreview}>
                          <Text style={styles.clientsPreviewLabel}>Quick select:</Text>
                          <View style={styles.clientsChips}>
                            {clients.slice(0, 3).map((client) => (
                              <Chip 
                                key={client.id} 
                                mode="outlined" 
                                style={styles.clientChip}
                                onPress={() => handleSelectClient(client)}
                              >
                                {client.name}
                              </Chip>
                            ))}
                            {clients.length > 3 && (
                              <Chip 
                                mode="outlined" 
                                style={styles.moreChip}
                                onPress={() => setClientsModalVisible(true)}
                              >
                                +{clients.length - 3} more
                              </Chip>
                            )}
                          </View>
                        </View>
                      )}
                    </View>
                  )}

                  {clients.length === 0 && !clientsLoading && (
                    <Card style={styles.noClientsCard}>
                      <Card.Content style={styles.noClientsContent}>
                        <Text style={styles.noClientsText}>No Clients Available</Text>
                        <Text style={styles.noClientsSubtext}>
                          Clients need to register accounts before you can assign projects.
                        </Text>
                      </Card.Content>
                    </Card>
                  )}
                </>
              )}
            </View>

            <Divider style={styles.divider} />

            {/* Budget */}
            <TextInput
              label="Project Budget (R) *"
              value={projectData.budget}
              onChangeText={(text) => setProjectData({...projectData, budget: text})}
              style={styles.input}
              mode="outlined"
              keyboardType="numeric"
              placeholder="50000"
              theme={{ colors: { primary: '#6366F1' } }}
            />

            {/* Deadline */}
            <TextInput
              label="Deadline *"
              value={projectData.deadline}
              onChangeText={(text) => setProjectData({...projectData, deadline: text})}
              style={styles.input}
              mode="outlined"
              placeholder="YYYY-MM-DD"
              theme={{ colors: { primary: '#6366F1' } }}
            />

            {/* Create Button */}
            <Button 
              mode="contained" 
              onPress={handleCreateProject}
              loading={loading}
              disabled={loading || !selectedClient || !projectData.title || !projectData.budget || !projectData.deadline}
              style={styles.createButton}
              contentStyle={styles.createButtonContent}
              icon="check"
            >
              Create Project
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* CLIENTS MODAL */}
      <ClientsModal />

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

// ✅ FIXED: Clean professional styling - removed shadows, cleaned borders, improved text clarity
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  card: {
    margin: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    // Removed elevation for cleaner look
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
    color: '#1E293B',
    letterSpacing: 0.5,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  textArea: {
    height: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  loadingText: {
    marginLeft: 12,
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
  },
  clientSelectionSection: {
    gap: 16,
  },
  clientButton: {
    borderRadius: 8,
    borderColor: '#6366F1',
    borderWidth: 1.5,
  },
  clientButtonContent: {
    paddingVertical: 6,
  },
  clientsPreview: {
    gap: 8,
  },
  clientsPreviewLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  clientsChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  clientChip: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  moreChip: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  selectedClientCard: {
    borderRadius: 8,
    backgroundColor: '#F0F9FF',
    borderColor: '#0EA5E9',
    borderWidth: 1.5,
    // Removed elevation
  },
  selectedClientContent: {
    paddingVertical: 12,
  },
  selectedClientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  selectedClientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0369A1',
    flex: 1,
    letterSpacing: 0.3,
  },
  removeClientButton: {
    margin: -8,
  },
  selectedClientEmail: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  selectedClientChip: {
    backgroundColor: '#E0F2FE',
    borderColor: '#0EA5E9',
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  selectedClientChipText: {
    color: '#0369A1',
    fontWeight: '600',
    fontSize: 12,
  },
  noClientsCard: {
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
  },
  noClientsContent: {
    paddingVertical: 20,
  },
  noClientsText: {
    fontSize: 16,
    color: '#DC2626',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  noClientsSubtext: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  divider: {
    marginVertical: 16,
    backgroundColor: '#E2E8F0',
    height: 1,
  },
  createButton: {
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: '#6366F1',
    // Removed shadow for cleaner look
  },
  createButtonContent: {
    paddingVertical: 6,
  },
  snackbar: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
  },
  modalStyle: {
    margin: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    // Removed shadow
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    letterSpacing: 0.3,
  },
  modalContent: {
    maxHeight: 400,
    padding: 8,
  },
  emptyModal: {
    padding: 40,
    alignItems: 'center',
  },
  emptyModalText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  emptyModalSubtext: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  clientCard: {
    margin: 8,
    marginHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    // Removed elevation
  },
  clientCardContent: {
    padding: 16,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  clientEmail: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  clientRole: {
    fontSize: 12,
    color: '#6366F1',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  modalCloseButton: {
    borderRadius: 8,
  },
});

export default CreateProjectScreen;