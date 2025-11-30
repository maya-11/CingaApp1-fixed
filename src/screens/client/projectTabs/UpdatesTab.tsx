// frontend/src/screens/client/projectTabs/UpdatesTab.tsx - FULLY FIXED
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { Project } from '../../../types';

interface Props {
  project: Project;
}

const UpdatesTab: React.FC<Props> = ({ project }) => {
  return (
    <View style={styles.container}>
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>📊</Text>
        <Text style={styles.emptyTitle}>Progress Updates Coming Soon</Text>
        <Text style={styles.emptyText}>
          Track project milestones, client progress updates, and activity logs here.
          You'll be able to update project status and view historical changes.
        </Text>
        <Text style={styles.emptySubtext}>
          Project: {project.title}
        </Text>
        <Button
          mode="outlined"
          onPress={() => console.log('Updates feature coming soon')}
          style={styles.button}
          icon="chart-line"
          disabled
        >
          Feature In Development
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  button: {
    borderRadius: 8,
    borderColor: '#CBD5E1',
  },
});

export default UpdatesTab;