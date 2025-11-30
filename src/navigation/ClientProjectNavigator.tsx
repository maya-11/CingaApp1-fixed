// TEMPORARY FIX - Replace ClientProjectNavigator.tsx with this:
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Button, Card } from 'react-native-paper';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../types';

type Props = {
  route: RouteProp<RootStackParamList, 'ClientProjectDetails'>;
};

const SimpleProjectView: React.FC<Props> = ({ route }) => {
  const { project } = route.params;
  const [activeTab, setActiveTab] = useState('overview');

  if (!project) {
    return (
      <View style={styles.errorContainer}>
        <Text>Project data not available</Text>
      </View>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.title}>Project Overview</Text>
              <Text>Status: {project.status}</Text>
              <Text>Progress: {project.progress}%</Text>
              <Text>Budget: R{project.budget}</Text>
            </Card.Content>
          </Card>
        );
      case 'tasks':
        return (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.title}>Tasks</Text>
              <Text>Tasks will appear here</Text>
            </Card.Content>
          </Card>
        );
      default:
        return (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.title}>{activeTab}</Text>
              <Text>Feature coming soon</Text>
            </Card.Content>
          </Card>
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* Simple Tab Buttons */}
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
        {renderTabContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  tabBar: { 
    flexDirection: 'row', 
    padding: 16, 
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  tabButton: { flex: 1 },
  content: { flex: 1 },
  card: { margin: 16 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  errorContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
});

export default SimpleProjectView;