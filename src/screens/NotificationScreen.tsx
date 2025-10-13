import React from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Card, Text, Button, IconButton, Divider, Chip, useTheme } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import AppHeader from '../components/AppHeader';

type NotificationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Notifications'
>;

interface Props {
  navigation: NotificationScreenNavigationProp;
}

type Notification = {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  projectId?: string;
  projectName?: string;
};

const NotificationScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();

  // Mock notifications data
  const notifications: Notification[] = [
    {
      id: '1',
      title: 'Project Deadline Approaching',
      message: 'Website Redesign project deadline is in 3 days. Please review the progress.',
      timestamp: '2024-10-28 10:30 AM',
      type: 'warning',
      read: false,
      projectId: '1',
      projectName: 'Website Redesign'
    },
    {
      id: '2',
      title: 'Task Completed',
      message: 'Sarah Johnson completed the homepage design task.',
      timestamp: '2024-10-27 03:15 PM',
      type: 'success',
      read: false,
      projectId: '2',
      projectName: 'Mobile App Development'
    },
    {
      id: '3',
      title: 'Budget Alert',
      message: 'E-commerce Platform project has used 85% of allocated budget.',
      timestamp: '2024-10-26 09:45 AM',
      type: 'error',
      read: true,
      projectId: '3',
      projectName: 'E-commerce Platform'
    },
    {
      id: '4',
      title: 'New Message',
      message: 'You have a new message from ABC Corporation regarding project requirements.',
      timestamp: '2024-10-25 02:20 PM',
      type: 'info',
      read: true,
      projectId: '1',
      projectName: 'Website Redesign'
    },
    {
      id: '5',
      title: 'Milestone Reached',
      message: 'Mobile App Development project reached 90% completion milestone.',
      timestamp: '2024-10-24 11:00 AM',
      type: 'success',
      read: true,
      projectId: '2',
      projectName: 'Mobile App Development'
    },
    {
      id: '6',
      title: 'Team Update',
      message: 'New team member John Smith has been added to your projects.',
      timestamp: '2024-10-23 04:30 PM',
      type: 'info',
      read: true
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info': return '#2196F3';
      case 'warning': return '#FF9800';
      case 'success': return '#4CAF50';
      case 'error': return '#F44336';
      default: return '#757575';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return 'information';
      case 'warning': return 'alert';
      case 'success': return 'check-circle';
      case 'error': return 'alert-circle';
      default: return 'bell';
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    // Mark as read and navigate if it has a project
    if (notification.projectId) {
      // Navigate to project details
      console.log('Navigate to project:', notification.projectId);
    }
  };

  const handleMarkAllAsRead = () => {
    // Implement mark all as read functionality
    console.log('Mark all as read');
  };

  const handleClearAll = () => {
    // Implement clear all notifications functionality
    console.log('Clear all notifications');
  };

  const unreadCount = notifications.filter(notification => !notification.read).length;

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <Card 
      style={[
        styles.notificationCard, 
        !item.read && styles.unreadCard
      ]}
      onPress={() => handleNotificationPress(item)}
    >
      <Card.Content style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <View style={styles.titleContainer}>
            <IconButton
              icon={getTypeIcon(item.type)}
              size={16}
              iconColor={getTypeColor(item.type)}
              style={styles.typeIcon}
            />
            <Text variant="titleSmall" style={styles.notificationTitle}>
              {item.title}
            </Text>
          </View>
          {!item.read && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>New</Text>
            </View>
          )}
        </View>

        <Text variant="bodyMedium" style={styles.notificationMessage}>
          {item.message}
        </Text>

        <View style={styles.notificationFooter}>
          <Text variant="bodySmall" style={styles.timestamp}>
            {item.timestamp}
          </Text>
          {item.projectName && (
            <Chip 
              mode="outlined" 
              compact
              textStyle={styles.projectChipText}
            >
              {item.projectName}
            </Chip>
          )}
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <>
      {/* FIXED: Changed showBackButton to showBack */}
      <AppHeader 
        navigation={navigation}
        title="Notifications"
        showBack={true}
      />
      
      <View style={styles.container}>
        {/* Header Actions */}
        <View style={styles.headerActions}>
          <View style={styles.unreadCounter}>
            <Text variant="titleMedium" style={styles.unreadCounterText}>
              {unreadCount} unread notifications
            </Text>
          </View>
          <View style={styles.actionButtons}>
            <Button 
              mode="text" 
              onPress={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark all read
            </Button>
            <Button 
              mode="text" 
              textColor={theme.colors.error}
              onPress={handleClearAll}
            >
              Clear all
            </Button>
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Notifications List */}
        {notifications.length > 0 ? (
          <FlatList
            data={notifications}
            renderItem={renderNotificationItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        ) : (
          <View style={styles.emptyState}>
            <IconButton
              icon="bell-off-outline"
              size={64}
              iconColor={theme.colors.onSurfaceDisabled}
              disabled
            />
            <Text variant="titleMedium" style={styles.emptyStateTitle}>
              No notifications
            </Text>
            <Text variant="bodyMedium" style={styles.emptyStateText}>
              You're all caught up! New notifications will appear here.
            </Text>
          </View>
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
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  unreadCounter: {
    flex: 1,
  },
  unreadCounterText: {
    fontWeight: '600',
    color: '#1E293B',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  divider: {
    backgroundColor: '#E2E8F0',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  notificationCard: {
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    elevation: 1,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#6366F1',
    backgroundColor: '#F8FAFF',
  },
  notificationContent: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typeIcon: {
    margin: 0,
    marginRight: 8,
  },
  notificationTitle: {
    fontWeight: '600',
    flex: 1,
    color: '#1E293B',
  },
  unreadBadge: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  notificationMessage: {
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 12,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    color: '#94A3B8',
    fontSize: 12,
  },
  projectChipText: {
    fontSize: 11,
  },
  separator: {
    height: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
  },
  emptyStateTitle: {
    marginTop: 16,
    marginBottom: 8,
    color: '#64748B',
    textAlign: 'center',
  },
  emptyStateText: {
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default NotificationScreen;