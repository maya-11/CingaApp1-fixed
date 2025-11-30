// frontend/src/screens/client/ClientProjectDetailScreen.tsx - FIXED TYPES
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Text, Button, ProgressBar, Chip } from 'react-native-paper';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Project } from '../../types';
import OverviewTab from './projectTabs/OverviewTab';
import TasksTab from './projectTabs/TasksTab';
import ChatTab from './projectTabs/ChatTab';

// ✅ FIXED: Use RootStackParamList instead of ClientStackParamList
type ClientProjectDetailsRouteProp = RouteProp<RootStackParamList, 'ClientProjectDetails'>;

interface Props {
  route: ClientProjectDetailsRouteProp;
}

const ClientProjectDetailScreen: React.FC<Props> = ({ route }) => {
  const { project } = route.params;
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'chat'>('overview');

  console.log('🟢 REAL ClientProjectDetailScreen LOADED - Project:', project?.title);

  if (!project) {
    return (
      <View style={styles.errorContainer}>
        <Text>Project data not available</Text>
        <Button mode="contained" onPress={() => console.log('Go back')}>
          Go Back
        </Button>
      </View>
    );
  }

  const renderTabContent = () => {
    console.log('🔄 Rendering tab:', activeTab);
    
    switch (activeTab) {
      case 'overview':
        return <OverviewTab project={project} />;
      case 'tasks':
        return <TasksTab project={project} />;
      case 'chat':
        return <ChatTab project={project} />;
      default:
        return <OverviewTab project={project} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Debug Banner */}
      <View style={styles.debugBanner}>
        <Text style={styles.debugText}>🟢 REAL ClientProjectDetailScreen - Project: "{project.title}" | Active Tab: {activeTab}</Text>
      </View>

      {/* Tab Buttons */}
      <View style={styles.tabBar}>
        <Button 
          mode={activeTab === 'overview' ? 'contained' : 'outlined'} 
          onPress={() => setActiveTab('overview')}
          style={styles.tabButton}
        >
          Overview
        </Button>
        <Button 
          mode={activeTab === 'tasks' ? 'contained' : 'outlined'} 
          onPress={() => setActiveTab('tasks')}
          style={styles.tabButton}
        >
          Tasks
        </Button>
        <Button 
          mode={activeTab === 'chat' ? 'contained' : 'outlined'} 
          onPress={() => setActiveTab('chat')}
          style={styles.tabButton}
        >
          Chat
        </Button>
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.content}>
        {/* Project Header */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <View style={styles.header}>
              <View style={styles.headerInfo}>
                <Title style={styles.projectTitle}>{project.title}</Title>
                <Text style={styles.managerText}>Manager: {project.manager || 'Not assigned'}</Text>
              </View>
              <Chip
                mode="outlined"
                style={[
                  styles.statusChip,
                  project.status === 'active' ? styles.activeChip : 
                  project.status === 'completed' ? styles.completedChip : styles.pendingChip
                ]}
              >
                {project.status?.toUpperCase() || 'ACTIVE'}
              </Chip>
            </View>

            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Progress</Text>
                <Text style={styles.progressPercentage}>
                  {project.progress || project.completion_percentage || 0}%
                </Text>
              </View>
              <ProgressBar
                progress={(project.progress || project.completion_percentage || 0) / 100}
                color="#6366F1"
                style={styles.progressBar}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Tab Content */}
        {renderTabContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8FAFC' 
  },
  debugBanner: {
    backgroundColor: '#10B981',
    padding: 8,
  },
  debugText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20 
  },
  tabBar: { 
    flexDirection: 'row', 
    padding: 16, 
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  tabButton: { 
    flex: 1 
  },
  content: { 
    flex: 1 
  },
  headerCard: { 
    margin: 16, 
    marginBottom: 8, 
    borderRadius: 12 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerInfo: {
    flex: 1,
  },
  projectTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  managerText: {
    fontSize: 14,
    color: '#64748B',
  },
  statusChip: {
    height: 32,
  },
  activeChip: {
    backgroundColor: '#E0E7FF',
    borderColor: '#6366F1',
  },
  completedChip: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  pendingChip: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
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
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6366F1',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
});

export default ClientProjectDetailScreen;