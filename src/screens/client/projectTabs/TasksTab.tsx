// frontend/src/screens/client/projectTabs/TasksTab.tsx - SIMPLE TEST
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { Project } from '../../../types';

interface Props {
  project: Project;
}

const TasksTab: React.FC<Props> = ({ project }) => {
  console.log('🎯 TasksTab RENDERED - Project:', project.title);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>✅ TASKS TAB IS WORKING!</Text>
          <Text style={styles.subtitle}>Project: {project.title}</Text>
          <Text style={styles.projectId}>ID: {project.id}</Text>
          
          <View style={styles.testSection}>
            <Text style={styles.testTitle}>Real Tasks Interface:</Text>
            <Text style={styles.testItem}>• View assigned tasks</Text>
            <Text style={styles.testItem}>• Update task status</Text>
            <Text style={styles.testItem}>• Add comments/notes</Text>
            <Text style={styles.testItem}>• Track progress</Text>
          </View>

          <Button 
            mode="contained" 
            onPress={() => console.log('Tasks button pressed')}
            style={styles.button}
          >
            View All Tasks
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 4,
    textAlign: 'center',
  },
  projectId: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 16,
    textAlign: 'center',
  },
  testSection: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  testTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#065F46',
    marginBottom: 8,
  },
  testItem: {
    fontSize: 14,
    color: '#065F46',
    marginBottom: 4,
  },
  button: {
    marginTop: 8,
  },
});

export default TasksTab;