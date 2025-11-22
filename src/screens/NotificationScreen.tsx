import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Appbar, Card, Text, Button, Chip, ActivityIndicator, useTheme } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { notificationService } from '../services/backendService';
import { useAuth } from '../contexts/AuthContext';

type NotificationScreenNavigationProp = StackNavigationProp<any, 'Notifications'>;

interface Props {
  navigation: NotificationScreenNavigationProp;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  related_entity_type?: string;
  related_entity_id?: string;
}

const NotificationScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { user } = useAuth();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      console.log('🔔 Loading REAL notifications for user:', user.id);
      
      const notificationsData = await notificationService.getUserNotifications(user.id);
      setNotifications(notificationsData);
      
      console.log(`✅ Loaded ${notificationsData.length} REAL notifications from database`);
    } catch (error) {
      console.error('❌ Failed to load notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
      console.log('✅ Notification marked as read in UI');
    } catch (error) {
      console.error('❌ Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.id) return;
    
    try {
      await notificationService.markAllAsRead(user.id);
      
      // Update all notifications to read
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, is_read: true }))
      );
      console.log('✅ All notifications marked as read in UI');
    } catch (error) {
      console.error('❌ Failed to mark all as read:', error);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return '#4CAF50';
      case 'warning': return '#FF9800';
      case 'error': return '#F44336';
      case 'info': 
      default: return '#2196F3';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return 'check-circle';
      case 'warning': return 'alert';
      case 'error': return 'alert-circle';
      case 'info':
      default: return 'information';
    }
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <Card 
      style={[
        styles.notificationCard,
        !item.is_read && styles.unreadNotification
      ]}
    >
      <Card.Content>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          {!item.is_read && (
            <Chip mode="outlined" style={styles.unreadChip}>NEW</Chip>
          )}
        </View>
        
        <Text style={styles.notificationMessage}>{item.message}</Text>
        
        <View style={styles.notificationFooter}>
          <Text style={styles.notificationDate}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
          
          {!item.is_read && (
            <Button 
              mode="text" 
              compact
              onPress={() => handleMarkAsRead(item.id)}
              style={styles.markReadButton}
            >
              Mark Read
            </Button>
          )}
        </View>
      </Card.Content>
    </Card>
  );

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={`Notifications (${unreadCount})`} />
        {unreadCount > 0 && (
          <Appbar.Action 
            icon="check-all" 
            onPress={handleMarkAllAsRead}
          />
        )}
      </Appbar.Header>

      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Loading notifications...</Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderNotificationItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={loadNotifications}
                colors={[theme.colors.primary]}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No notifications yet</Text>
                <Text style={styles.emptySubtext}>
                  You'll see real notifications here when you get assigned to projects
                </Text>
              </View>
            }
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  notificationCard: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#6366F1',
    backgroundColor: '#F8FAFF',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    flex: 1,
  },
  unreadChip: {
    backgroundColor: '#6366F1',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 12,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationDate: {
    fontSize: 12,
    color: '#94A3B8',
  },
  markReadButton: {
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
});

export default NotificationScreen;