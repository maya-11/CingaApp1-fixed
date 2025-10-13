import React, { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  Text, 
  Button, 
  Divider, 
  TextInput,
  Chip,
  Avatar,
  List,
  useTheme
} from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { ClientStackParamList } from '../../types';

type FeedbackSupportScreenNavigationProp = StackNavigationProp<ClientStackParamList, 'FeedbackSupport'>;

interface Props {
  navigation: FeedbackSupportScreenNavigationProp;
  route: any;
}

const FeedbackSupportScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const { project } = route.params || {};
  
  const [message, setMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState<'general' | 'issue' | 'suggestion' | 'urgent'>('general');

  // Mock communication data
  const communicationData = {
    project: {
      name: 'Website Redesign',
      manager: 'Sarah Johnson',
      managerEmail: 'sarah@company.com',
      managerAvatar: 'SJ'
    },
    recentMessages: [
      {
        id: '1',
        date: '2025-01-08 14:30',
        sender: 'Sarah Johnson',
        message: 'The design team has completed the homepage mockups. Please review when you have a moment.',
        type: 'received' as const,
        read: true
      },
      {
        id: '2', 
        date: '2025-01-08 15:45',
        sender: 'You',
        message: 'The designs look great! I particularly like the new color scheme. One question about the navigation layout.',
        type: 'sent' as const,
        read: true
      },
      {
        id: '3',
        date: '2025-01-09 09:15',
        sender: 'Sarah Johnson',
        message: 'Happy to discuss the navigation. Would you like me to schedule a quick call to walk through it?',
        type: 'received' as const,
        read: true
      },
      {
        id: '4',
        date: '2025-01-09 10:20',
        sender: 'You',
        message: 'A call would be perfect. How about tomorrow at 2 PM?',
        type: 'sent' as const,
        read: true
      }
    ],
    supportTickets: [
      {
        id: 'T-001',
        title: 'Budget Query',
        status: 'resolved' as const,
        createdAt: '2025-01-05',
        updatedAt: '2025-01-07',
        priority: 'medium' as const
      },
      {
        id: 'T-002',
        title: 'Design Revision Request',
        status: 'in-progress' as const,
        createdAt: '2025-01-08',
        updatedAt: '2025-01-09',
        priority: 'high' as const
      }
    ]
  };

  const feedbackTypes = [
    { key: 'general', label: 'General', icon: 'chat' },
    { key: 'issue', label: 'Issue', icon: 'alert-circle' },
    { key: 'suggestion', label: 'Suggestion', icon: 'lightbulb' },
    { key: 'urgent', label: 'Urgent', icon: 'clock-alert' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return '#4CAF50';
      case 'in-progress': return '#FF9800';
      case 'open': return '#2196F3';
      default: return '#757575';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#F44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#757575';
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real app, this would send to backend
      alert('Message sent successfully!');
      setMessage('');
    }
  };

  const handleCreateTicket = () => {
    // In a real app, this would create a support ticket
    alert('Support ticket created! We will get back to you soon.');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Project Manager Contact */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Project Manager</Title>
          <View style={styles.managerInfo}>
            <Avatar.Text size={50} label={communicationData.project.managerAvatar} />
            <View style={styles.managerDetails}>
              <Text variant="titleSmall" style={styles.managerName}>
                {communicationData.project.manager}
              </Text>
              <Text variant="bodyMedium" style={styles.managerEmail}>
                {communicationData.project.managerEmail}
              </Text>
              <Text variant="bodySmall" style={styles.managerRole}>
                Project Manager
              </Text>
            </View>
          </View>
          <View style={styles.contactButtons}>
            <Button mode="contained" icon="email" style={styles.contactButton}>
              Send Email
            </Button>
            <Button mode="outlined" icon="phone" style={styles.contactButton}>
              Call
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* New Message */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Send Message</Title>
          
          <Text variant="bodyMedium" style={styles.inputLabel}>Message Type</Text>
          <View style={styles.feedbackTypes}>
            {feedbackTypes.map((type) => (
              <Chip
                key={type.key}
                selected={feedbackType === type.key}
                onPress={() => setFeedbackType(type.key as any)}
                icon={type.icon}
                style={styles.feedbackChip}
              >
                {type.label}
              </Chip>
            ))}
          </View>

          <TextInput
            label="Your message"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            style={styles.messageInput}
            mode="outlined"
          />
          
          <Button 
            mode="contained" 
            onPress={handleSendMessage}
            disabled={!message.trim()}
            style={styles.sendButton}
            icon="send"
          >
            Send Message
          </Button>
        </Card.Content>
      </Card>

      {/* Recent Messages */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>Recent Messages</Title>
            <Button mode="text" compact>
              View All
            </Button>
          </View>

          {communicationData.recentMessages.map((msg) => (
            <View 
              key={msg.id} 
              style={[
                styles.messageContainer,
                msg.type === 'sent' ? styles.sentMessage : styles.receivedMessage
              ]}
            >
              <View style={styles.messageHeader}>
                <Text variant="bodySmall" style={styles.messageSender}>
                  {msg.sender}
                </Text>
                <Text variant="labelSmall" style={styles.messageDate}>
                  {msg.date}
                </Text>
              </View>
              <Text variant="bodyMedium" style={styles.messageText}>
                {msg.message}
              </Text>
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Support Tickets */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>Support Tickets</Title>
            <Button mode="text" compact onPress={handleCreateTicket}>
              New Ticket
            </Button>
          </View>

          {communicationData.supportTickets.map((ticket) => (
            <Card key={ticket.id} style={styles.ticketItem} mode="outlined">
              <Card.Content>
                <View style={styles.ticketHeader}>
                  <Text variant="titleSmall" style={styles.ticketTitle}>
                    {ticket.title}
                  </Text>
                  <View style={styles.ticketStatus}>
                    <Chip 
                      mode="outlined"
                      textStyle={{ 
                        color: getStatusColor(ticket.status),
                        fontSize: 10 
                      }}
                    >
                      {ticket.status.toUpperCase()}
                    </Chip>
                    <Chip 
                      mode="flat"
                      compact
                      textStyle={{ 
                        color: getPriorityColor(ticket.priority),
                        fontSize: 10 
                      }}
                    >
                      {ticket.priority}
                    </Chip>
                  </View>
                </View>
                <View style={styles.ticketDates}>
                  <Text variant="bodySmall" style={styles.ticketDate}>
                    Created: {ticket.createdAt}
                  </Text>
                  <Text variant="bodySmall" style={styles.ticketDate}>
                    Updated: {ticket.updatedAt}
                  </Text>
                </View>
                <Button mode="text" compact icon="eye-outline">
                  View Details
                </Button>
              </Card.Content>
            </Card>
          ))}
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Quick Actions</Title>
          <View style={styles.quickActions}>
            <Button 
              mode="outlined" 
              icon="file-document-outline"
              style={styles.quickActionButton}
            >
              Project Docs
            </Button>
            <Button 
              mode="outlined" 
              icon="calendar"
              style={styles.quickActionButton}
            >
              Schedule Call
            </Button>
            <Button 
              mode="outlined" 
              icon="help-circle"
              style={styles.quickActionButton}
            >
              FAQ
            </Button>
          </View>
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
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  managerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  managerDetails: {
    marginLeft: 12,
    flex: 1,
  },
  managerName: {
    fontWeight: 'bold',
  },
  managerEmail: {
    color: '#666',
  },
  managerRole: {
    color: '#888',
    fontStyle: 'italic',
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  contactButton: {
    flex: 1,
  },
  inputLabel: {
    marginBottom: 8,
    fontWeight: '500',
  },
  feedbackTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  feedbackChip: {
    marginBottom: 4,
  },
  messageInput: {
    marginBottom: 16,
  },
  sendButton: {
    marginTop: 8,
  },
  messageContainer: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
  },
  sentMessage: {
    backgroundColor: '#E3F2FD',
    alignSelf: 'flex-end',
    marginLeft: 40,
  },
  receivedMessage: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignSelf: 'flex-start',
    marginRight: 40,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  messageSender: {
    fontWeight: 'bold',
  },
  messageDate: {
    color: '#666',
  },
  messageText: {
    lineHeight: 20,
  },
  ticketItem: {
    marginBottom: 12,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ticketTitle: {
    flex: 1,
    marginRight: 12,
    fontWeight: 'bold',
  },
  ticketStatus: {
    alignItems: 'flex-end',
    gap: 4,
  },
  ticketDates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ticketDate: {
    color: '#666',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
  },
  quickActionButton: {
    flex: 1,
  },
});

export default FeedbackSupportScreen;