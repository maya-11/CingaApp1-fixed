// ClientDashboard.tsx
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, ProgressBar, Text, Button, Divider, Chip } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { ClientStackParamList, Project } from '../../types';
import AppHeader from '../../components/AppHeader';

// NAVIGATION PROP TYPE
type ClientDashboardNavigationProp = StackNavigationProp<ClientStackParamList, 'ClientDashboard'>;

interface Props {
  navigation: ClientDashboardNavigationProp;
}

const ClientDashboard: React.FC<Props> = ({ navigation }) => {
  // Mock project data for client
  const project: Project = {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete redesign of corporate website with modern UI/UX',
    client: 'Your Company Name',
    progress: 0.65,
    budget: 50000,
    spent: 32500,
    deadline: '2024-12-31',
    daysLeft: 86,
    status: 'active',
    manager: 'Sarah Johnson',
    managerEmail: 'sarah@company.com',
    recentUpdates: [
      {
        id: '1',
        date: '2024-10-25',
        title: 'Homepage Design Approved',
        description: 'Client has approved the final homepage design. Moving to development phase.',
      },
      {
        id: '2',
        date: '2024-10-20',
        title: 'Content Migration Started',
        description: 'Began migrating existing content to new structure. 40% complete.',
      }
    ]
  };

  const budgetUsage = (project.spent / project.budget) * 100;

  // Navigate to project details
  const handleViewProjectDetails = () => {
    navigation.navigate('ClientProjectDetail', { project });
  };

  // Navigate to payment tracking
  const handleViewPayments = () => {
    navigation.navigate('PaymentTracking', { project });
  };

  // Navigate to feedback
  const handleViewFeedback = () => {
    navigation.navigate('FeedbackSupport', { project });
  };

  return (
    <>
      <AppHeader navigation={navigation as any} title="My Projects" />
      <ScrollView style={styles.container}>
        {/* Project Overview */}
        <Card style={styles.overviewCard}>
          <Card.Content>
            <View style={styles.projectHeader}>
              <View>
                <Title style={styles.projectTitle}>{project.name}</Title>
                <Paragraph style={styles.projectDescription}>{project.description}</Paragraph>
              </View>
              <Chip mode="outlined" style={project.status === 'active' ? styles.chipActive : styles.chipCompleted}>
                {project.status.toUpperCase()}
              </Chip>
            </View>

            <Divider style={styles.divider} />

            {/* Quick Actions */}
            <View style={styles.actionsContainer}>
              <Button mode="contained" style={styles.actionButton} onPress={handleViewProjectDetails} icon="chart-box-outline">
                Project Details
              </Button>
              <Button mode="outlined" style={styles.actionButton} onPress={handleViewPayments} icon="cash">
                Payments
              </Button>
              <Button mode="outlined" style={styles.actionButton} onPress={handleViewFeedback} icon="message-text">
                Support
              </Button>
            </View>

            {/* Progress Section */}
            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>Project Progress</Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressLabels}>
                  <Text variant="bodyLarge">{(project.progress * 100).toFixed(0)}% Complete</Text>
                  <Text variant="bodyMedium" style={styles.daysLeft}>{project.daysLeft} days remaining</Text>
                </View>
                <ProgressBar progress={project.progress} style={styles.progressBar} color={project.progress > 0.7 ? '#4CAF50' : '#2196F3'} />
              </View>
            </View>

            {/* Budget Section */}
            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>Budget Overview</Text>
              <View style={styles.budgetStats}>
                <View style={styles.budgetItem}>
                  <Text variant="labelSmall">TOTAL BUDGET</Text>
                  <Text variant="titleLarge" style={styles.budgetAmount}>R {project.budget.toLocaleString()}</Text>
                </View>
                <View style={styles.budgetItem}>
                  <Text variant="labelSmall">AMOUNT SPENT</Text>
                  <Text variant="titleLarge" style={styles.spentAmount}>R {project.spent.toLocaleString()}</Text>
                </View>
                <View style={styles.budgetItem}>
                  <Text variant="labelSmall">REMAINING</Text>
                  <Text variant="titleLarge" style={styles.remainingAmount}>R {(project.budget - project.spent).toLocaleString()}</Text>
                </View>
              </View>

              <View style={styles.budgetProgress}>
                <View style={styles.budgetProgressLabels}>
                  <Text>Budget Usage: {budgetUsage.toFixed(1)}%</Text>
                  <Text>R {project.spent.toLocaleString()} / R {project.budget.toLocaleString()}</Text>
                </View>
                <ProgressBar progress={project.spent / project.budget} style={styles.budgetProgressBar} color={budgetUsage > 80 ? '#F44336' : budgetUsage > 60 ? '#FF9800' : '#4CAF50'} />
              </View>
            </View>

            {/* Project Manager */}
            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>Project Manager</Text>
              <Card style={styles.managerCard} mode="outlined">
                <Card.Content style={styles.managerContent}>
                  <View style={styles.managerInfo}>
                    <Text variant="titleSmall" style={styles.managerName}>{project.manager}</Text>
                    <Text variant="bodyMedium" style={styles.managerEmail}>{project.managerEmail}</Text>
                  </View>
                  <Button mode="contained" compact icon="email-outline" style={styles.contactButton}>
                    Contact
                  </Button>
                </Card.Content>
              </Card>
            </View>
          </Card.Content>
        </Card>

        {/* Recent Updates */}
        <Card style={styles.updatesCard}>
          <Card.Content>
            <View style={styles.updatesHeader}>
              <Title>Recent Updates</Title>
              <Button mode="text" compact onPress={handleViewProjectDetails}>View All</Button>
            </View>
            {project.recentUpdates?.map(update => (
              <Card key={update.id} style={styles.updateItem} mode="outlined">
                <Card.Content>
                  <View style={styles.updateHeader}>
                    <Text variant="titleSmall" style={styles.updateTitle}>{update.title}</Text>
                    <Text variant="labelSmall" style={styles.updateDate}>{update.date}</Text>
                  </View>
                  <Text variant="bodyMedium" style={styles.updateDescription}>{update.description}</Text>
                </Card.Content>
              </Card>
            ))}
          </Card.Content>
        </Card>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  overviewCard: { margin: 16, marginBottom: 8 },
  projectHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  projectTitle: { fontSize: 24, fontWeight: 'bold', flex: 1, marginRight: 12 },
  projectDescription: { color: '#666', marginTop: 4 },
  chipActive: { backgroundColor: '#E3F2FD' },
  chipCompleted: { backgroundColor: '#E8F5E8' },
  divider: { marginVertical: 16 },
  actionsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, gap: 8 },
  actionButton: { flex: 1 },
  section: { marginBottom: 24 },
  sectionTitle: { marginBottom: 12, fontWeight: 'bold' },
  progressContainer: { marginBottom: 8 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  daysLeft: { color: '#666' },
  progressBar: { height: 8, borderRadius: 4 },
  budgetStats: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  budgetItem: { alignItems: 'center', flex: 1 },
  budgetAmount: { color: '#2196F3', fontWeight: 'bold' },
  spentAmount: { color: '#FF9800', fontWeight: 'bold' },
  remainingAmount: { color: '#4CAF50', fontWeight: 'bold' },
  budgetProgress: { marginTop: 8 },
  budgetProgressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  budgetProgressBar: { height: 6, borderRadius: 3 },
  managerCard: { marginTop: 8 },
  managerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  managerInfo: { flex: 1 },
  managerName: { fontWeight: 'bold' },
  managerEmail: { color: '#666' },
  contactButton: { marginLeft: 12 },
  updatesCard: { margin: 16, marginTop: 8 },
  updatesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  updateItem: { marginBottom: 12 },
  updateHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  updateTitle: { flex: 1, marginRight: 12, fontWeight: 'bold' },
  updateDate: { color: '#666' },
  updateDescription: { color: '#555', lineHeight: 20 },
});

export default ClientDashboard;
