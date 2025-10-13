import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Card, Title, Text, Button, ProgressBar, Chip, IconButton, useTheme } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Project, TeamMember, Task, Payment } from '../types';

const { width } = Dimensions.get('window');

type ProjectDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProjectDetailScreen'>;
type ProjectDetailScreenRouteProp = RouteProp<RootStackParamList, 'ProjectDetailScreen'>;

interface Props {
  navigation: ProjectDetailScreenNavigationProp;
  route: ProjectDetailScreenRouteProp;
}

type TabType = 'overview' | 'tasks' | 'budget' | 'integrations';
const tabs: TabType[] = ['overview', 'tasks', 'budget', 'integrations'];

// Tab Components with proper typing
const OverviewTab: React.FC<{ project: Project }> = ({ project }) => (
  <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Title style={styles.sectionTitle}>Project Summary</Title>
        <Text style={styles.description}>{project.description}</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{(project.progress * 100).toFixed(0)}%</Text>
            <Text style={styles.statLabel}>Progress</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {Math.ceil((new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
            </Text>
            <Text style={styles.statLabel}>Days Left</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{project.teamMembers.length}</Text>
            <Text style={styles.statLabel}>Team</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, project.status === 'active' ? styles.activeValue : styles.completedValue]}>
              {project.status.toUpperCase()}
            </Text>
            <Text style={styles.statLabel}>Status</Text>
          </View>
        </View>
      </Card.Content>
    </Card>

    <Card style={styles.sectionCard}>
      <Card.Content>
        <Title style={styles.sectionTitle}>Project Progress</Title>
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Overall Completion</Text>
            <Text style={styles.progressPercentage}>{(project.progress * 100).toFixed(0)}%</Text>
          </View>
          <ProgressBar
            progress={project.progress}
            style={styles.progressBar}
            color={project.progress > 0.7 ? '#10B981' : project.progress > 0.4 ? '#6366F1' : '#F59E0B'}
          />
        </View>
      </Card.Content>
    </Card>

    <Card style={styles.sectionCard}>
      <Card.Content>
        <View style={styles.sectionHeader}>
          <Title style={styles.sectionTitle}>Team Members</Title>
          <Button mode="text" compact style={styles.manageButton}>
            Manage
          </Button>
        </View>
        {project.teamMembers.map((member: TeamMember, index: number) => (
          <View 
            key={member.id} 
            style={[
              styles.teamMember,
              index !== project.teamMembers.length - 1 && styles.teamMemberBorder
            ]}
          >
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberRole}>{member.role}</Text>
            </View>
            <IconButton
              icon="email-outline"
              size={20}
              iconColor="#6366F1"
              onPress={() => console.log('Contact', member.name)}
            />
          </View>
        ))}
      </Card.Content>
    </Card>
  </ScrollView>
);

const TasksTab: React.FC<{ project: Project }> = ({ project }) => (
  <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
    <Card style={styles.sectionCard}>
      <Card.Content>
        <View style={styles.sectionHeader}>
          <Title style={styles.sectionTitle}>Tasks</Title>
          <Button mode="contained" compact onPress={() => console.log('Add task')}>
            Add Task
          </Button>
        </View>

        {project.tasks.map((task: Task) => (
          <Card key={task.id} style={styles.taskCard} mode="outlined">
            <Card.Content>
              <View style={styles.taskHeader}>
                <View style={styles.taskInfo}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.taskAssignee}>Assigned to: {task.assignee}</Text>
                </View>
                <Chip
                  mode="outlined"
                  style={[
                    styles.taskStatus,
                    task.status === 'completed' ? styles.statusCompleted :
                    task.status === 'in-progress' ? styles.statusInProgress : styles.statusTodo
                  ]}
                >
                  {task.status.replace('-', ' ').toUpperCase()}
                </Chip>
              </View>

              <View style={styles.taskProgress}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Progress</Text>
                  <Text style={styles.progressPercentage}>{(task.progress * 100).toFixed(0)}%</Text>
                </View>
                <ProgressBar
                  progress={task.progress}
                  style={styles.taskProgressBar}
                  color={task.progress > 0.7 ? '#10B981' : task.progress > 0.4 ? '#6366F1' : '#F59E0B'}
                />
              </View>

              <View style={styles.taskFooter}>
                <Text style={styles.taskDueDate}>Due: {task.dueDate}</Text>
                <View style={styles.taskActions}>
                  <IconButton 
                    icon="pencil-outline" 
                    size={16} 
                    iconColor="#64748B" 
                    onPress={() => console.log('Edit task', task.id)} 
                  />
                  <IconButton 
                    icon="delete-outline" 
                    size={16} 
                    iconColor="#EF4444" 
                    onPress={() => console.log('Delete task', task.id)} 
                  />
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
      </Card.Content>
    </Card>
  </ScrollView>
);

const BudgetTab: React.FC<{ project: Project }> = ({ project }) => {
  const budgetUsage = (project.spent / project.budget) * 100;

  return (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Budget Overview</Title>
          <View style={styles.budgetSummary}>
            <View style={styles.budgetItem}>
              <Text style={styles.budgetLabel}>Total Budget</Text>
              <Text style={styles.budgetValue}>R{project.budget.toLocaleString()}</Text>
            </View>
            <View style={styles.budgetItem}>
              <Text style={styles.budgetLabel}>Amount Spent</Text>
              <Text style={styles.budgetValue}>R{project.spent.toLocaleString()}</Text>
            </View>
            <View style={styles.budgetItem}>
              <Text style={styles.budgetLabel}>Remaining</Text>
              <Text style={[styles.budgetValue, styles.remainingValue]}>
                R{project.remaining.toLocaleString()}
              </Text>
            </View>
            <View style={styles.budgetItem}>
              <Text style={styles.budgetLabel}>Usage</Text>
              <Text style={[
                styles.budgetValue,
                budgetUsage > 80 ? styles.overBudget : 
                budgetUsage > 60 ? styles.warningBudget : styles.healthyBudget
              ]}>
                {budgetUsage.toFixed(1)}%
              </Text>
            </View>
          </View>

          <View style={styles.budgetProgress}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Budget Usage</Text>
              <Text style={styles.progressPercentage}>{budgetUsage.toFixed(1)}%</Text>
            </View>
            <ProgressBar
              progress={project.spent / project.budget}
              style={styles.budgetProgressBar}
              color={budgetUsage > 80 ? '#EF4444' : budgetUsage > 60 ? '#F59E0B' : '#10B981'}
            />
            <Text style={styles.budgetText}>
              R{project.spent.toLocaleString()} of R{project.budget.toLocaleString()}
            </Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.sectionCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>Payment History</Title>
            <Button mode="text" compact style={styles.addPaymentButton}>
              Add Payment
            </Button>
          </View>

          {project.payments.map((payment: Payment) => (
            <Card key={payment.id} style={styles.paymentCard} mode="outlined">
              <Card.Content>
                <View style={styles.paymentHeader}>
                  <View style={styles.paymentInfo}>
                    <Text style={styles.paymentDescription}>{payment.description}</Text>
                    <Text style={styles.paymentDate}>{payment.date}</Text>
                  </View>
                  <View style={styles.paymentAmountSection}>
                    <Text style={styles.paymentAmount}>R{payment.amount.toLocaleString()}</Text>
                    <Chip
                      mode="outlined"
                      style={[
                        styles.paymentStatus,
                        payment.status === 'paid' ? styles.paidStatus : styles.pendingStatus
                      ]}
                    >
                      {payment.status.toUpperCase()}
                    </Chip>
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const IntegrationsTab: React.FC<{ project: Project }> = ({ project }) => (
  <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Title style={styles.sectionTitle}>Trello Integration</Title>
        {project.trelloConnected ? (
          <View style={styles.connectedState}>
            <View style={styles.connectionHeader}>
              <View style={styles.connectionInfo}>
                <Chip mode="flat" style={styles.connectedChip}>
                  Connected ✅
                </Chip>
                <Text style={styles.lastSync}>Last synced: {project.lastSync}</Text>
              </View>
              <IconButton 
                icon="sync" 
                size={24} 
                iconColor="#6366F1" 
                onPress={() => console.log('Sync now')} 
              />
            </View>
            <Text style={styles.integrationText}>
              Your Trello board is successfully connected. Tasks are automatically synced with your project.
            </Text>
            <View style={styles.integrationActions}>
              <Button 
                mode="outlined" 
                onPress={() => console.log('Manage connection')} 
                style={styles.integrationButton}
              >
                Manage Connection
              </Button>
              <Button 
                mode="contained" 
                onPress={() => console.log('Sync now')} 
                style={styles.integrationButton}
              >
                Sync Now
              </Button>
            </View>
          </View>
        ) : (
          <View style={styles.disconnectedState}>
            <Text style={styles.disconnectedText}>
              Connect your Trello board to automatically sync tasks and track progress.
            </Text>
            <Button 
              mode="contained" 
              onPress={() => console.log('Connect Trello')} 
              style={styles.connectButton}
            >
              Connect Trello Board
            </Button>
          </View>
        )}
      </Card.Content>
    </Card>
  </ScrollView>
);

const ProjectDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const project = route.params.project;

  const daysLeft = Math.ceil((new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab project={project} />;
      case 'tasks':
        return <TasksTab project={project} />;
      case 'budget':
        return <BudgetTab project={project} />;
      case 'integrations':
        return <IntegrationsTab project={project} />;
      default:
        return <OverviewTab project={project} />;
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.headerCard} elevation={2}>
        <Card.Content>
          <View style={styles.header}>
            <View style={styles.headerInfo}>
              <Title style={styles.projectTitle}>{project.name}</Title>
              <Text style={styles.clientName}>{project.client}</Text>
            </View>
            <Chip
              mode="outlined"
              style={[
                styles.projectStatus,
                project.status === 'active' ? styles.activeStatus : styles.completedStatus
              ]}
            >
              {project.status.toUpperCase()}
            </Chip>
          </View>
          <View style={styles.projectMeta}>
            <Text style={styles.projectDates}>
              {project.startDate} → {project.deadline} • {daysLeft} days remaining
            </Text>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.tabButtons}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.tabButtonsContent}
        >
          {tabs.map(tab => (
            <Button
              key={tab}
              mode={activeTab === tab ? 'contained' : 'text'}
              onPress={() => setActiveTab(tab)}
              style={styles.tabButton}
              labelStyle={styles.tabButtonLabel}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </ScrollView>
      </View>

      {renderActiveTab()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerCard: {
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerInfo: {
    flex: 1,
  },
  projectTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  clientName: {
    fontSize: 16,
    color: '#64748B',
    fontStyle: 'italic',
  },
  projectStatus: {
    height: 28,
  },
  activeStatus: {
    backgroundColor: '#E0E7FF',
    borderColor: '#6366F1',
  },
  completedStatus: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  projectMeta: {
    marginTop: 8,
  },
  projectDates: {
    fontSize: 14,
    color: '#64748B',
  },
  tabButtons: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tabButtonsContent: {
    paddingHorizontal: 16,
  },
  tabButton: {
    marginRight: 8,
  },
  tabButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  sectionCard: {
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    minWidth: (width - 64) / 4,
    marginRight: 12,
    marginBottom: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  activeValue: {
    color: '#6366F1',
  },
  completedValue: {
    color: '#10B981',
  },
  progressSection: {
    marginBottom: 8,
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
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
  },
  teamMember: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  teamMemberBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  memberRole: {
    fontSize: 14,
    color: '#64748B',
  },
  manageButton: {
    marginLeft: 8,
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
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  taskAssignee: {
    fontSize: 14,
    color: '#64748B',
  },
  taskStatus: {
    height: 24,
  },
  statusTodo: {
    backgroundColor: '#F1F5F9',
    borderColor: '#94A3B8',
  },
  statusInProgress: {
    backgroundColor: '#E0E7FF',
    borderColor: '#6366F1',
  },
  statusCompleted: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  taskProgress: {
    marginBottom: 12,
  },
  taskProgressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F1F5F9',
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskDueDate: {
    fontSize: 12,
    color: '#64748B',
  },
  taskActions: {
    flexDirection: 'row',
  },
  budgetSummary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  budgetItem: {
    alignItems: 'center',
    flex: 1,
    minWidth: (width - 80) / 2,
    marginRight: 12,
    marginBottom: 12,
  },
  budgetLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  budgetValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  remainingValue: {
    color: '#10B981',
  },
  healthyBudget: {
    color: '#10B981',
  },
  warningBudget: {
    color: '#F59E0B',
  },
  overBudget: {
    color: '#EF4444',
  },
  budgetProgress: {
    marginTop: 8,
  },
  budgetProgressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F1F5F9',
    marginBottom: 8,
  },
  budgetText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  paymentCard: {
    marginBottom: 8,
    borderRadius: 8,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  paymentDate: {
    fontSize: 12,
    color: '#64748B',
  },
  paymentAmountSection: {
    alignItems: 'flex-end',
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  paymentStatus: {
    height: 24,
  },
  paidStatus: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  pendingStatus: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  addPaymentButton: {
    marginLeft: 8,
  },
  connectedState: {
    marginBottom: 16,
  },
  connectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  connectionInfo: {
    flex: 1,
  },
  connectedChip: {
    backgroundColor: '#D1FAE5',
    marginBottom: 4,
  },
  lastSync: {
    fontSize: 14,
    color: '#64748B',
  },
  integrationText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 16,
  },
  integrationActions: {
    flexDirection: 'row',
  },
  integrationButton: {
    flex: 1,
    marginHorizontal: 6,
  },
  disconnectedState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  disconnectedText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  connectButton: {
    borderRadius: 12,
  },
});

export default ProjectDetailScreen;