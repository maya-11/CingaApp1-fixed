// src/screens/ProjectListScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text, Title, Chip, FAB, Searchbar, useTheme } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Project } from '../types';

type ProjectListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProjectListScreen'>;

interface Props {
  navigation: ProjectListScreenNavigationProp;
}

const ProjectListScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const theme = useTheme();

  // Fixed Mock projects data
  const projects: Project[] = [
    {
      id: '1',
      name: 'Website Redesign',
      description: 'Complete redesign of corporate website with modern UI/UX',
      client: 'ABC Corporation',
      progress: 0.65,
      budget: 50000,
      spent: 32500,
      deadline: '2024-12-31',
      status: 'active',
      manager: 'Sarah Johnson',
      managerEmail: 'sarah@company.com',
    },
    {
      id: '2',
      name: 'Mobile App Development',
      description: 'Develop a cross-platform mobile application for clients',
      client: 'XYZ Ltd',
      progress: 0.9,
      budget: 75000,
      spent: 68000,
      deadline: '2024-10-15',
      status: 'active',
      manager: 'John Doe',
      managerEmail: 'john@xyz.com',
    },
    {
      id: '3',
      name: 'E-commerce Platform',
      description: 'Build a full-featured e-commerce platform for retail clients',
      client: 'Retail Pro',
      progress: 0.3,
      budget: 120000,
      spent: 36000,
      deadline: '2025-03-20',
      status: 'active',
      manager: 'Alice Smith',
      managerEmail: 'alice@retailpro.com',
    },
    {
      id: '4',
      name: 'CRM System',
      description: 'Implement a CRM system to manage customer interactions',
      client: 'Tech Solutions Inc',
      progress: 1,
      budget: 80000,
      spent: 80000,
      deadline: '2024-08-30',
      status: 'completed',
      manager: 'Bob Martin',
      managerEmail: 'bob@techsolutions.com',
    },
    {
      id: '5',
      name: 'Payment Gateway',
      description: 'Integrate a secure payment gateway for online transactions',
      client: 'Finance Corp',
      progress: 0.45,
      budget: 95000,
      spent: 42750,
      deadline: '2025-01-15',
      status: 'active',
      manager: 'Clara Lee',
      managerEmail: 'clara@financecorp.com',
    },
  ];

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || project.status === filter;
    return matchesSearch && matchesFilter;
  });

  const ProjectCard = ({ project }: { project: Project }) => (
    <Card
      style={styles.projectCard}
      elevation={2}
      onPress={() => navigation.navigate('ProjectDetailScreen', { project })}
    >
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.projectInfo}>
            <Text style={styles.projectName}>{project.name}</Text>
            <Text style={styles.clientName}>{project.client}</Text>
          </View>
          <Chip
            mode="outlined"
            style={[
              styles.statusChip,
              project.status === 'active' ? styles.activeChip : styles.completedChip,
            ]}
          >
            {project.status.toUpperCase()}
          </Chip>
        </View>

        {/* Progress */}
        <View style={styles.progressSection}>
          <Text style={styles.progressLabel}>Progress: {(project.progress * 100).toFixed(0)}%</Text>
        </View>

        {/* Budget */}
        <View style={styles.statsRow}>
          <Text>Budget: R{project.budget.toLocaleString()}</Text>
          <Text>Spent: R{project.spent.toLocaleString()}</Text>
          <Text>Deadline: {project.deadline}</Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Projects</Title>
      <Searchbar
        placeholder="Search projects..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchBar}
      />
      <View style={styles.filterChips}>
        <Chip selected={filter === 'all'} onPress={() => setFilter('all')}>All</Chip>
        <Chip selected={filter === 'active'} onPress={() => setFilter('active')}>Active</Chip>
        <Chip selected={filter === 'completed'} onPress={() => setFilter('completed')}>Completed</Chip>
      </View>

      <FlatList
        data={filteredProjects}
        renderItem={({ item }) => <ProjectCard project={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => console.log('Add project')}
        color="#fff"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F8FAFC' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
  searchBar: { marginBottom: 12 },
  filterChips: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  projectCard: { marginBottom: 12, borderRadius: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  projectInfo: {},
  projectName: { fontWeight: 'bold', fontSize: 16 },
  clientName: { fontStyle: 'italic', color: '#64748B' },
  statusChip: { height: 24 },
  activeChip: { backgroundColor: '#E0E7FF', borderColor: '#6366F1' },
  completedChip: { backgroundColor: '#D1FAE5', borderColor: '#10B981' },
  progressSection: { marginBottom: 8 },
  progressLabel: { fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#6366F1' },
});

export default ProjectListScreen;
