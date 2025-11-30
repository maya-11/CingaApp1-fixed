// frontend/src/screens/client/projectTabs/OverviewTab.tsx - FIXED
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Text, ProgressBar, Chip } from 'react-native-paper';
import { Project } from '../../../types';

// ✅ FIX: Accept project directly as prop
interface Props {
  project: Project;
}

const OverviewTab: React.FC<Props> = ({ project }) => {
  const progress = project.progress || project.completion_percentage || 0;
  const budget = project.budget || 0;
  const currentSpent = project.current_spent || 0;
  const budgetProgress = budget > 0 ? (currentSpent / budget) * 100 : 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Project Status Card */}
      <Card style={styles.card} elevation={2}>
        <Card.Content>
          <View style={styles.header}>
            <Title style={styles.title}>Project Status</Title>
            <Chip
              mode="outlined"
              style={[
                styles.statusChip,
                project.status === 'active' ? styles.activeChip : 
                project.status === 'completed' ? styles.completedChip : styles.pendingChip
              ]}
            >
              {project.status?.toUpperCase() || 'PENDING'}
            </Chip>
          </View>
          
          <Text style={styles.description}>
            {project.description || 'No description available'}
          </Text>
        </Card.Content>
      </Card>

      {/* Progress Card */}
      <Card style={styles.card} elevation={2}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Project Progress</Title>
          
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Completion</Text>
              <Text style={styles.progressValue}>{progress}%</Text>
            </View>
            <ProgressBar
              progress={progress / 100}
              color={progress > 70 ? '#10B981' : progress > 40 ? '#6366F1' : '#F59E0B'}
              style={styles.progressBar}
            />
          </View>
        </Card.Content>
      </Card>

      {/* Budget Card */}
      <Card style={styles.card} elevation={2}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Budget Overview</Title>
          
          <View style={styles.budgetRow}>
            <View style={styles.budgetItem}>
              <Text style={styles.budgetLabel}>Total Budget</Text>
              <Text style={styles.budgetValue}>R{budget.toLocaleString('en-ZA')}</Text>
            </View>
            <View style={styles.budgetItem}>
              <Text style={styles.budgetLabel}>Spent</Text>
              <Text style={[styles.budgetValue, styles.spentValue]}>
                R{currentSpent.toLocaleString('en-ZA')}
              </Text>
            </View>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Budget Used</Text>
              <Text style={styles.progressValue}>{budgetProgress.toFixed(1)}%</Text>
            </View>
            <ProgressBar
              progress={budgetProgress / 100}
              color={budgetProgress > 90 ? '#EF4444' : budgetProgress > 70 ? '#F59E0B' : '#10B981'}
              style={styles.progressBar}
            />
          </View>
        </Card.Content>
      </Card>

      {/* Project Details Card */}
      <Card style={styles.card} elevation={2}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Project Details</Title>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Manager:</Text>
            <Text style={styles.detailValue}>{project.manager || 'Not assigned'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Deadline:</Text>
            <Text style={styles.detailValue}>
              {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline set'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Created:</Text>
            <Text style={styles.detailValue}>
              {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'Unknown'}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  card: {
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  statusChip: {
    height: 28,
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
  description: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  progressSection: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  progressValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  budgetItem: {
    flex: 1,
  },
  budgetLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  budgetValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  spentValue: {
    color: '#6366F1',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
  },
});

export default OverviewTab;