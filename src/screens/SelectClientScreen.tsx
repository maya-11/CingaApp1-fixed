// src/screens/SelectClientScreen.tsx - COMPLETE FIXED VERSION
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Searchbar, Card, Text, Button, ActivityIndicator, useTheme, Appbar, List } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { User } from '../types';
import { userService } from '../services/backendService';
import { useAuth } from '../contexts/AuthContext';

type SelectClientScreenNavigationProp = StackNavigationProp<any, 'SelectClientScreen'>;
type SelectClientScreenRouteProp = RouteProp<any, 'SelectClientScreen'>;

interface Props {
  navigation: SelectClientScreenNavigationProp;
  route: SelectClientScreenRouteProp;
}

const SelectClientScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const { user } = useAuth();
  
  const [clients, setClients] = useState<User[]>([]);
  const [filteredClients, setFilteredClients] = useState<User[]>([]);
  const [selectedClient, setSelectedClient] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  // Filter clients based on search
  useEffect(() => {
    if (searchQuery) {
      const filtered = clients.filter(client => {
        const name = client?.name || '';
        const email = client?.email || '';
        
        return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               email.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setFilteredClients(filtered);
    } else {
      setFilteredClients(clients);
    }
  }, [searchQuery, clients]);

  // ✅ FIXED: Proper client loading with User type compatibility
  const loadClients = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading clients...');
      
      const clientsData = await userService.getClients();
      
      // ✅ FIXED: Transform backend data to match User interface
      const validatedClients: User[] = clientsData
        .filter(client => client && client.id && client.name)
        .map(client => ({
          id: String(client.id),
          uid: client.uid || String(client.id), // ✅ Add uid field
          name: String(client.name),
          email: String(client.email || ''),
          role: 'client' as const,
          phone: client.phone || '',
          company: client.company || ''
        }));
      
      console.log(`✅ Loaded ${validatedClients.length} valid clients`);
      
      setClients(validatedClients);
      setFilteredClients(validatedClients);
      
    } catch (error: any) {
      console.error('❌ Failed to load clients:', error);
      Alert.alert('Error', 'Failed to load clients. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectClient = (client: User) => {
    setSelectedClient(client);
    console.log('✅ Selected:', client.name);
  };

  const handleConfirmSelection = () => {
    if (!selectedClient) {
      Alert.alert('Select Client', 'Please select a client first');
      return;
    }

    console.log('🎯 Confirming selection:', selectedClient.name);
    
    // Navigate back with selected client
    navigation.navigate('CreateProjectScreen', {
      selectedClient: selectedClient
    });
  };

  // ✅ FIXED: Proper keyExtractor that returns string
  const keyExtractor = (item: User) => String(item.id);

  // Simple list item render
  const renderClientItem = ({ item }: { item: User }) => (
    <List.Item
      title={item.name}
      description={item.email}
      left={props => (
        <List.Icon 
          {...props} 
          icon="account" 
          color={selectedClient?.id === item.id ? theme.colors.primary : '#64748B'}
        />
      )}
      right={props => 
        selectedClient?.id === item.id ? (
          <List.Icon {...props} icon="check-circle" color={theme.colors.primary} />
        ) : null
      }
      onPress={() => handleSelectClient(item)}
      style={[
        styles.listItem,
        selectedClient?.id === item.id && styles.selectedItem
      ]}
      titleStyle={styles.itemTitle}
      descriptionStyle={styles.itemDescription}
    />
  );

  return (
    <>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Select Client" />
        {selectedClient && (
          <Appbar.Action icon="check" onPress={handleConfirmSelection} />
        )}
      </Appbar.Header>
      
      <View style={styles.container}>
        {/* Simple Search */}
        <Searchbar
          placeholder="Search clients..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />

        {/* Client Count */}
        <View style={styles.headerInfo}>
          <Text style={styles.clientCount}>
            {filteredClients.length} clients
          </Text>
          {searchQuery && (
            <Button 
              mode="text" 
              onPress={() => setSearchQuery('')}
              compact
            >
              Clear
            </Button>
          )}
        </View>

        {/* Loading */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
            <Text style={styles.loadingText}>Loading clients...</Text>
          </View>
        ) : (
          <>
            {/* ✅ FIXED: FlatList with proper keyExtractor */}
            <FlatList
              data={filteredClients}
              renderItem={renderClientItem}
              keyExtractor={keyExtractor} // ✅ Now returns string only
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>
                    {searchQuery ? 'No clients found' : 'No clients available'}
                  </Text>
                  <Text style={styles.emptySubtext}>
                    {searchQuery ? 'Try a different search' : 'Clients need to register first'}
                  </Text>
                </View>
              }
            />

            {/* Simple Confirm Button */}
            {selectedClient && (
              <View style={styles.confirmContainer}>
                <Button 
                  mode="contained" 
                  onPress={handleConfirmSelection}
                  style={styles.confirmButton}
                  icon="check"
                  contentStyle={styles.confirmButtonContent}
                >
                  Select {selectedClient.name}
                </Button>
              </View>
            )}
          </>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F1F5F9',
  },
  searchBar: {
    margin: 16,
    borderRadius: 8,
  },
  clientCount: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748B',
  },
  listItem: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 2,
    borderRadius: 8,
  },
  selectedItem: {
    backgroundColor: '#F0F9FF',
    borderLeftWidth: 4,
    borderLeftColor: '#6366F1',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
  },
  itemDescription: {
    fontSize: 14,
    color: '#64748B',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
  confirmContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  confirmButton: {
    borderRadius: 8,
    backgroundColor: '#6366F1',
  },
  confirmButtonContent: {
    paddingVertical: 6,
  },
});

export default SelectClientScreen;