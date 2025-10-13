import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
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
  useTheme
} from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { ClientStackParamList, Project } from '../../types';

type ClientProjectDetailScreenNavigationProp = StackNavigationProp<ClientStackParamList, 'ClientProjectDetail'>;

interface ClientProjectDetailScreenProps {
  navigation: ClientProjectDetailScreenNavigationProp;
  route: any;
}

// Define interfaces for the additional data structure
interface Milestone {
  id: number;
  name: string;
  completed: boolean;
  date: string;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  avatar: string;
}

interface ProjectUpdate {
  id: number;
  date: string;
  message: string;
  author: string;
}

interface BudgetData {
  total: number;
  spent: number;
  remaining: number;
}

interface TimelineData {
  startDate: string;
  endDate: string;
  currentPhase: string;
}

interface AdditionalData {
  budget: BudgetData;
  timeline: TimelineData;
  milestones: Milestone[];
  team: TeamMember[];
  recentUpdates: ProjectUpdate[];
}

const ClientProjectDetailScreen: React.FC<ClientProjectDetailScreenProps> = ({
  navigation,
  route
}) => {
  const theme = useTheme();
  const { project } = route.params || {};

  // Mock data that matches Project interface
  const projectData: Project & { additionalData: AdditionalData } = {
    id: '1',
    name: 'Modern Kitchen Renovation',
    description: 'Complete kitchen remodeling with modern appliances and custom cabinets',
    client: 'Your Company Name',
    progress: 0.65,
    budget: 25000,
    spent: 16250,
    deadline: '2024-03-30',
    status: 'active',
    manager: 'John Chen',
    managerEmail: 'john@company.com',
    // Additional data for display (not part of Project interface)
    additionalData: {
      budget: {
        total: 25000,
        spent: 16250,
        remaining: 8750
      },
      timeline: {
        startDate: '2024-01-15',
        endDate: '2024-03-30',
        currentPhase: 'Cabinet Installation'
      },
      milestones: [
        { id: 1, name: 'Design Approval', completed: true, date: '2024-01-20' },
        { id: 2, name: 'Demolition Complete', completed: true, date: '2024-02-05' },
        { id: 3, name: 'Electrical & Plumbing', completed: true, date: '2024-02-20' },
        { id: 4, name: 'Cabinet Installation', completed: false, date: '2024-03-10' },
        { id: 5, name: 'Countertops & Backsplash', completed: false, date: '2024-03-20' },
        { id: 6, name: 'Final Inspection', completed: false, date: '2024-03-30' }
      ],
      team: [
        { id: 1, name: 'John Chen', role: 'Project Manager', avatar: 'JC' },
        { id: 2, name: 'Maria Rodriguez', role: 'Lead Contractor', avatar: 'MR' }
      ],
      recentUpdates: [
        { id: 1, date: '2024-02-22', message: 'Cabinet delivery completed. Installation starts Monday.', author: 'John Chen' },
        { id: 2, date: '2024-02-18', message: 'Electrical inspection passed successfully.', author: 'Maria Rodriguez' }     
      ]
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return '#4CAF50';
      case 'active': return '#FFA000';
      case 'on-hold': return '#757575';
      default: return '#757575';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'In Progress';
      case 'completed': return 'Completed';
      case 'on-hold': return 'On Hold';
      default: return status;
    }
  };

  // Helper function to get initials from name
  const getInitials = (name: string): string => {
    return name.split(' ').map((n: string) => n[0]).join('');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Project Header */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Title style={styles.projectTitle}>{projectData.name}</Title>
            <Chip
              mode="outlined"
              textStyle={{ color: getStatusColor(projectData.status) }}
            >
              {getStatusText(projectData.status)}
            </Chip>
          </View>
          <Paragraph style={styles.description}>
            {projectData.description}
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Progress Section */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Project Progress</Title>
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text variant="bodyMedium">{Math.round(projectData.progress * 100)}% Complete</Text>
              <Text variant="bodyMedium" style={styles.phaseText}>
                Current: {projectData.additionalData.timeline.currentPhase}
              </Text>
            </View>
            <ProgressBar 
              progress={projectData.progress}
              color={theme.colors.primary}
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
                ${projectData.additionalData.budget.total.toLocaleString()}
              </Text>
            </View>
            <View style={styles.budgetItem}>
              <Text variant="bodySmall" style={styles.budgetLabel}>Amount Spent</Text>
              <Text variant="titleMedium" style={[styles.budgetAmount, styles.spentAmount]}>
                ${projectData.additionalData.budget.spent.toLocaleString()}
              </Text>
            </View>
            <View style={styles.budgetItem}>
              <Text variant="bodySmall" style={styles.budgetLabel}>Remaining</Text>
              <Text variant="titleMedium" style={[styles.budgetAmount, styles.remainingAmount]}>
                ${projectData.additionalData.budget.remaining.toLocaleString()}
              </Text>
            </View>
          </View>
          <Button
            mode="contained" 
            style={styles.button}
            onPress={() => navigation.navigate('PaymentTracking', { project: projectData })}
            icon="cash"
          >
            View Payment Details
          </Button>
        </Card.Content>
      </Card>

      {/* Milestones */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Project Milestones</Title>
          {projectData.additionalData.milestones.map((milestone: Milestone, index: number) => (
            <View key={milestone.id} style={styles.milestoneItem}>
              <View style={styles.milestoneLeft}>
                <View
                  style={[
                    styles.milestoneIcon,
                    {
                      backgroundColor: milestone.completed
                        ? theme.colors.primary
                        : '#E0E0E0'
                    }
                  ]}
                >
                  <Text style={styles.milestoneNumber}>{index + 1}</Text>
                </View>
                <View style={styles.milestoneContent}>
                  <Text variant="bodyMedium" style={styles.milestoneName}>
                    {milestone.name}
                  </Text>
                  <Text variant="bodySmall" style={styles.milestoneDate}>
                    Due: {milestone.date}
                  </Text>
                </View>
              </View>
              {milestone.completed && (
                <Chip mode="flat" compact textStyle={{ fontSize: 12 }}>
                  Completed
                </Chip>
              )}
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Recent Updates */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Recent Updates</Title>
          {projectData.additionalData.recentUpdates.map((update: ProjectUpdate) => (
            <View key={update.id} style={styles.updateItem}>
              <View style={styles.updateHeader}>
                <Avatar.Text size={32} label={getInitials(update.author)} />
                <View style={styles.updateAuthor}>
                  <Text variant="bodyMedium" style={styles.authorName}>{update.author}</Text>
                  <Text variant="bodySmall" style={styles.updateDate}>{update.date}</Text>
                </View>
              </View>
              <Text variant="bodyMedium" style={styles.updateMessage}>
                {update.message}
              </Text>
              <Divider style={styles.divider} />
            </View>
          ))}
          <Button
            mode="outlined"
            style={styles.button}
            onPress={() => navigation.navigate('FeedbackSupport', { project: projectData })}
            icon="message-text"
          >
            Send Message to Team
          </Button>
        </Card.Content>
      </Card>

      {/* Project Team */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Project Team</Title>
          {projectData.additionalData.team.map((member: TeamMember) => (
            <List.Item
              key={member.id}
              title={member.name}
              description={member.role}
              left={props => <Avatar.Text {...props} label={member.avatar} />}
              right={props => <Button mode="text" icon="phone">Call</Button>}
            />
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  projectTitle: {
    flex: 1,
    marginRight: 12,
  },
  description: {
    marginTop: 8,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  phaseText: {
    color: '#666',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  budgetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  budgetItem: {
    alignItems: 'center',
    flex: 1,
  },
  budgetLabel: {
    color: '#666',
    marginBottom: 4,
  },
  budgetAmount: {
    fontWeight: 'bold',
  },
  spentAmount: {
    color: '#FF6B35',
  },
  remainingAmount: {
    color: '#4CAF50',
  },
  milestoneItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  milestoneLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  milestoneIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  milestoneNumber: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneName: {
    fontWeight: '500',
  },
  milestoneDate: {
    color: '#666',
    marginTop: 2,
  },
  updateItem: {
    marginBottom: 16,
  },
  updateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  updateAuthor: {
    marginLeft: 12,
  },
  authorName: {
    fontWeight: '500',
  },
  updateDate: {
    color: '#666',
  },
  updateMessage: {
    marginLeft: 44,
    lineHeight: 20,
  },
  divider: {
    marginTop: 12,
  },
  button: {
    marginTop: 8,
  },
});

export default ClientProjectDetailScreen;