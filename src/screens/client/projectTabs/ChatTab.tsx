// frontend/src/screens/client/projectTabs/ChatTab.tsx - DEMO VERSION
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  Alert 
} from 'react-native';
import { Text, Button, Avatar, Card, IconButton, ActivityIndicator } from 'react-native-paper';
import { Project } from '../../../types';

interface Props {
  project: Project;
}

interface Message {
  id: string;
  text: string;
  sender: 'manager' | 'client';
  senderName: string;
  timestamp: Date;
  isRead: boolean;
}

const ChatTab: React.FC<Props> = ({ project }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Load demo messages
  useEffect(() => {
    console.log('💬 Loading demo chat for project:', project.title);
    
    const demoMessages: Message[] = [
      {
        id: '1',
        text: `Hi! I'm your project manager for "${project.title}". How's everything going with the project?`,
        sender: 'manager',
        senderName: 'Project Manager',
        timestamp: new Date(Date.now() - 3600000),
        isRead: true
      },
      {
        id: '2',
        text: "Hi! Everything is going well. I just reviewed the initial requirements and have some questions about the design phase.",
        sender: 'client',
        senderName: 'You',
        timestamp: new Date(Date.now() - 3500000),
        isRead: true
      },
      {
        id: '3',
        text: "Great! Feel free to ask any questions. I'm here to help clarify requirements and guide you through the process.",
        sender: 'manager',
        senderName: 'Project Manager',
        timestamp: new Date(Date.now() - 3400000),
        isRead: true
      },
      {
        id: '4',
        text: "Thanks! Regarding the design phase, should I follow the existing brand guidelines or do you have specific design requirements?",
        sender: 'client',
        senderName: 'You',
        timestamp: new Date(Date.now() - 3300000),
        isRead: true
      }
    ];
    
    setMessages(demoMessages);
    
    // Scroll to bottom after messages load
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [project.title]);

  const sendMessage = async () => {
    if (!newMessage.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    setSending(true);
    const messageText = newMessage.trim();
    
    try {
      // Add user message immediately
      const userMessage: Message = {
        id: 'user-' + Date.now(),
        text: messageText,
        sender: 'client',
        senderName: 'You',
        timestamp: new Date(),
        isRead: true
      };

      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');

      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);

      // Simulate manager reply after 2 seconds
      setTimeout(() => {
        const replies = [
          "Thanks for your message! I'll review this and get back to you.",
          "Noted! I'm looking into this now.",
          "Great question! Let me check the details.",
          "Thanks for the update! The project is progressing well.",
          "I appreciate you keeping me informed. Let's discuss this in our next check-in."
        ];
        
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        
        const managerMessage: Message = {
          id: 'manager-' + Date.now(),
          text: randomReply,
          sender: 'manager',
          senderName: 'Project Manager',
          timestamp: new Date(),
          isRead: false
        };
        
        setMessages(prev => [...prev, managerMessage]);
        
        // Scroll to bottom again
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }, 2000);
      
    } catch (error: any) {
      console.error('❌ Send message error:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'client' ? styles.clientMessage : styles.managerMessage
    ]}>
      {item.sender === 'manager' && (
        <Avatar.Text 
          size={32}
          label="M"
          style={[styles.avatar, styles.managerAvatar]}
        />
      )}
      <Card style={[
        styles.messageBubble,
        item.sender === 'client' ? styles.clientBubble : styles.managerBubble
      ]}>
        <Card.Content style={styles.messageContent}>
          <Text style={styles.senderName}>
            {item.senderName}
          </Text>
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.timestamp}>
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </Card.Content>
      </Card>
      {item.sender === 'client' && (
        <Avatar.Text 
          size={32}
          label="Y"
          style={[styles.avatar, styles.clientAvatar]}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Chat Header */}
      <Card style={styles.headerCard}>
        <Card.Content style={styles.headerContent}>
          <Avatar.Text size={40} label="M" style={styles.managerHeaderAvatar} />
          <View style={styles.headerText}>
            <Text style={styles.managerName}>Project Manager</Text>
            <Text style={styles.projectName}>{project.title}</Text>
            <Text style={styles.projectId}>Project ID: {project.id}</Text>
          </View>
          <View style={styles.statusIndicator}>
            <View style={[styles.onlineDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.statusText}>
              Demo Mode - Ready for Firebase
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Messages List */}
      <View style={styles.messagesContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No messages yet</Text>
              <Text style={styles.emptySubtext}>Start a conversation with your project manager</Text>
            </View>
          }
        />
      </View>

      {/* Message Input */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainer}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Type your message here..."
            value={newMessage}
            onChangeText={setNewMessage}
            style={styles.textInput}
            multiline
            maxLength={500}
            editable={!sending}
          />
          <IconButton
            icon={sending ? "clock" : "send"}
            size={24}
            onPress={sendMessage}
            disabled={!newMessage.trim() || sending}
            style={styles.sendButton}
            iconColor={newMessage.trim() && !sending ? '#6366F1' : '#94A3B8'}
          />
        </View>
        <Text style={styles.inputHint}>
          💬 Demo Chat - Ready for Firebase Integration
        </Text>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerCard: {
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  managerHeaderAvatar: {
    backgroundColor: '#6366F1',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  managerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  projectName: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  projectId: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#64748B',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 4,
    alignItems: 'flex-end',
  },
  clientMessage: {
    justifyContent: 'flex-end',
  },
  managerMessage: {
    justifyContent: 'flex-start',
  },
  avatar: {
    marginHorizontal: 8,
  },
  clientAvatar: {
    backgroundColor: '#10B981',
  },
  managerAvatar: {
    backgroundColor: '#6366F1',
  },
  messageBubble: {
    maxWidth: '70%',
    borderRadius: 16,
  },
  clientBubble: {
    backgroundColor: '#E0E7FF',
    borderBottomRightRadius: 4,
  },
  managerBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    elevation: 1,
  },
  messageContent: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  senderName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6366F1',
    marginBottom: 2,
  },
  messageText: {
    fontSize: 14,
    color: '#1E293B',
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'right',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 8,
  },
  inputContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 4,
    fontSize: 14,
    color: '#1E293B',
    maxHeight: 100,
  },
  sendButton: {
    margin: 0,
    marginLeft: 4,
  },
  inputHint: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default ChatTab;