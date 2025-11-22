import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Card, Text, Title, Chip, FAB, Searchbar, useTheme, ActivityIndicator, Button } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Project } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { projectService } from '../services/backendService';

type ProjectListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProjectListScreen'>;

interface Props {
  navigation: ProjectListScreenNavigationProp;
}

const ProjectListScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const theme = useTheme();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      if (!user) return;

      let projectsData: Project[] = [];
      
      if (user.role === 'manager') {
        projectsData = await projectService.getManagerProjects(user.id);
      } else {
        projectsData = await projectService.getClientProjects(user.id);
      }

      setProjects(projectsData);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadProjects();
  };

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
            <Text style={styles.projectName}>{project.title}</Text>
            <Text style={styles.clientName}>
              {user?.role === 'manager' ? project.client : project.manager}
            </Text>
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

        {/* Description */}
        {project.description && (
          <Text style={styles.description} numberOfLines={2}>
            {project.description}
          </Text>
        )}

        {/* Progress */}
        <View style={styles.progressSection}>
          <Text style={styles.progressLabel}>Progress: {project.progress}%</Text>
        </View>

        {/* Budget */}
        <View style={styles.statsRow}>
          <Text>Budget: R{project.budget.toLocaleString()}</Text>
          <Text>Spent: R{project.spent?.toLocaleString() || '0'}</Text>
          <Text>Deadline: {project.deadline}</Text>
        </View>

        {/* Additional Stats */}
        <View style={styles.additionalStats}>
          <Text style={styles.statsText}>
            Remaining: R{(project.budget - (project.spent || 0)).toLocaleString()}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading projects...</Text>
      </View>
    );
  }

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
        <Chip 
          selected={filter === 'all'} 
          onPress={() => setFilter('all')}
          style={filter === 'all' ? styles.selectedChip : styles.chip}
        >
          All
        </Chip>
        <Chip 
          selected={filter === 'active'} 
          onPress={() => setFilter('active')}
          style={filter === 'active' ? styles.selectedChip : styles.chip}
        >
          Active
        </Chip>
        <Chip 
          selected={filter === 'completed'} 
          onPress={() => setFilter('completed')}
          style={filter === 'completed' ? styles.selectedChip : styles.chip}
        >
          Completed
        </Chip>
      </View>

      <FlatList
        data={filteredProjects}
        renderItem={({ item }) => <ProjectCard project={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No projects found</Text>
            <Button 
              mode="contained" 
              onPress={() => console.log('Create first project')}
              style={styles.createButton}
            >
              Create Your First Project
            </Button>
          </View>
        }
      />

      {user?.role === 'manager' && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => console.log('Add project')}
          color="#fff"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#F8FAFC' 
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 16 
  },
  searchBar: { 
    marginBottom: 12 
  },
  filterChips: { 
    flexDirection: 'row', 
    gap: 8, 
    marginBottom: 16 
  },
  chip: {
    backgroundColor: '#FFFFFF',
  },
  selectedChip: {
    backgroundColor: '#6366F1',
  },
  listContent: { 
    paddingBottom: 100 
  },
  projectCard: { 
    marginBottom: 12, 
    borderRadius: 12 
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 8 
  },
  projectInfo: {},
  projectName: { 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  clientName: { 
    fontStyle: 'italic', 
    color: '#64748B' 
  },
  description: {
    color: '#666',
    marginBottom: 8,
    fontSize: 14,
  },
  statusChip: { 
    height: 24 
  },
  activeChip: { 
    backgroundColor: '#E0E7FF', 
    borderColor: '#6366F1' 
  },
  completedChip: { 
    backgroundColor: '#D1FAE5', 
    borderColor: '#10B981' 
  },
  progressSection: { 
    marginBottom: 8 
  },
  progressLabel: { 
    fontWeight: 'bold' 
  },
  statsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 8 
  },
  additionalStats: {
    marginTop: 4,
  },
  statsText: {
    fontSize: 12,
    color: '#64748B',
    fontStyle: 'italic',
  },
  fab: { 
    position: 'absolute', 
    right: 16, 
    bottom: 16, 
    backgroundColor: '#6366F1' 
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 16,
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: '#6366F1',
  },
});

export default ProjectListScreen;