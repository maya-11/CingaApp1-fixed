import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Linking, Alert } from 'react-native';
import { 
  Card, 
  Title, 
  Text, 
  Button, 
  Divider, 
  TextInput,
  Chip,
  Avatar,
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

  // Real contact information
  const contactInfo = {
    supportEmail: 'support@cinga.com',
    salesEmail: 'info@cinga.com',
    whatsappNumber: '+27821234567',
    officePhone: '+27101234567',
    officeAddress: '123 Innovation Street, Sandton, Johannesburg, 2196',
    businessHours: 'Mon - Fri: 8:00 AM - 5:00 PM SAST'
  };

  const feedbackTypes = [
    { key: 'general', label: 'General', icon: 'chat' },
    { key: 'issue', label: 'Issue', icon: 'alert-circle' },
    { key: 'suggestion', label: 'Suggestion', icon: 'lightbulb' },
    { key: 'urgent', label: 'Urgent', icon: 'clock-alert' }
  ];

  const handleSendEmail = () => {
    const subject = `Support Request - ${feedbackType.toUpperCase()} - Project: ${project?.title || 'General'}`;
    const body = `Project: ${project?.title || 'N/A'}\n\nMessage:\n${message}`;
    
    Linking.openURL(`mailto:${contactInfo.supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
      .catch(() => {
        Alert.alert('Error', 'Could not open email app. Please email us directly at: ' + contactInfo.supportEmail);
      });
  };

  const handleOpenWhatsApp = () => {
    const text = `Hello Cinga Support,\n\nI need assistance with: ${project?.title || 'General Inquiry'}`;
    Linking.openURL(`https://wa.me/${contactInfo.whatsappNumber}?text=${encodeURIComponent(text)}`)
      .catch(() => {
        Alert.alert('Error', 'Could not open WhatsApp. Please contact us directly at: ' + contactInfo.whatsappNumber);
      });
  };

  const handleCall = () => {
    Linking.openURL(`tel:${contactInfo.officePhone}`)
      .catch(() => {
        Alert.alert('Error', 'Could not make a call. Please call us directly at: ' + contactInfo.officePhone);
      });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Contact Information */}
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Title style={styles.sectionTitle}>Contact Support</Title>
          <Text style={styles.description}>
            Get in touch with our support team for any questions or assistance with your project.
          </Text>
          
          <View style={styles.contactItem}>
            <Avatar.Icon size={40} icon="email" style={styles.contactIcon} />
            <View style={styles.contactDetails}>
              <Text style={styles.contactLabel}>Email Support</Text>
              <Text style={styles.contactValue}>{contactInfo.supportEmail}</Text>
              <Button 
                mode="contained" 
                icon="email" 
                style={styles.contactButton}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
                onPress={handleSendEmail}
              >
                Send Email
              </Button>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.contactItem}>
            <Avatar.Icon size={40} icon="whatsapp" style={styles.contactIcon} />
            <View style={styles.contactDetails}>
              <Text style={styles.contactLabel}>WhatsApp</Text>
              <Text style={styles.contactValue}>{contactInfo.whatsappNumber}</Text>
              <Button 
                mode="outlined" 
                icon="whatsapp" 
                style={styles.contactButton}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
                onPress={handleOpenWhatsApp}
              >
                Message on WhatsApp
              </Button>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.contactItem}>
            <Avatar.Icon size={40} icon="phone" style={styles.contactIcon} />
            <View style={styles.contactDetails}>
              <Text style={styles.contactLabel}>Office Phone</Text>
              <Text style={styles.contactValue}>{contactInfo.officePhone}</Text>
              <Button 
                mode="outlined" 
                icon="phone" 
                style={styles.contactButton}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
                onPress={handleCall}
              >
                Call Us
              </Button>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Quick Message */}
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Title style={styles.sectionTitle}>Quick Message</Title>
          
          <Text style={styles.inputLabel}>Message Type</Text>
          <View style={styles.feedbackTypes}>
            {feedbackTypes.map((type) => (
              <Chip
                key={type.key}
                selected={feedbackType === type.key}
                onPress={() => setFeedbackType(type.key as any)}
                icon={type.icon}
                style={styles.feedbackChip}
                textStyle={styles.chipText}
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
            placeholder="Describe your question or issue..."
            theme={{
              colors: {
                primary: '#6366F1',
                background: '#FFFFFF'
              }
            }}
            contentStyle={styles.textInputContent}
          />
          
          <Button 
            mode="contained" 
            onPress={handleSendEmail}
            disabled={!message.trim()}
            style={styles.sendButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            icon="send"
          >
            Send via Email
          </Button>
        </Card.Content>
      </Card>

      {/* Business Information */}
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Title style={styles.sectionTitle}>Business Information</Title>
          
          <View style={styles.infoItem}>
            <Avatar.Icon size={36} icon="clock-outline" style={styles.infoIcon} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Business Hours</Text>
              <Text style={styles.infoValue}>{contactInfo.businessHours}</Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.infoItem}>
            <Avatar.Icon size={36} icon="map-marker" style={styles.infoIcon} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Office Address</Text>
              <Text style={styles.infoValue}>{contactInfo.officeAddress}</Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.infoItem}>
            <Avatar.Icon size={36} icon="email" style={styles.infoIcon} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>General Inquiries</Text>
              <Text style={styles.infoValue}>{contactInfo.salesEmail}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Response Time */}
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Title style={styles.sectionTitle}>Response Times</Title>
          <View style={styles.responseTimes}>
            <View style={styles.responseItem}>
              <Text style={styles.responseType}>General Inquiries</Text>
              <Text style={styles.responseTime}>Within 24 hours</Text>
            </View>
            <View style={styles.responseItem}>
              <Text style={styles.responseType}>Technical Issues</Text>
              <Text style={styles.responseTime}>Within 4 business hours</Text>
            </View>
            <View style={styles.responseItem}>
              <Text style={styles.responseType}>Urgent Matters</Text>
              <Text style={styles.responseTime}>Within 1 hour (via WhatsApp/Phone)</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    // Removed all shadows and elevation
  },
  cardContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1E293B',
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  contactIcon: {
    backgroundColor: '#6366F1',
    marginRight: 12,
  },
  contactDetails: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  contactValue: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  contactButton: {
    borderRadius: 6,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  divider: {
    marginVertical: 16,
    backgroundColor: '#E2E8F0',
    height: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  feedbackTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  feedbackChip: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  messageInput: {
    marginBottom: 16,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  textInputContent: {
    paddingVertical: 12,
  },
  sendButton: {
    borderRadius: 6,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    backgroundColor: '#94A3B8',
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  infoValue: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  responseTimes: {
    gap: 12,
  },
  responseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  responseType: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
    letterSpacing: 0.2,
  },
  responseTime: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});

export default FeedbackSupportScreen;