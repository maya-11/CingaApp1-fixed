import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ClientStackParamList } from '../types';
import ClientDashboard from '../screens/client/ClientDashboard';
import ClientProjectDetailScreen from '../screens/client/ClientProjectDetailScreen';
import PaymentTrackingScreen from '../screens/client/PaymentTrackingScreen';
import FeedbackSupportScreen from '../screens/client/FeedbackSupportScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationScreen from '../screens/NotificationScreen';

const Stack = createStackNavigator<ClientStackParamList>();

const ClientNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ClientDashboard" component={ClientDashboard} />
      <Stack.Screen name="ClientProjectDetail" component={ClientProjectDetailScreen} />
      <Stack.Screen name="PaymentTracking" component={PaymentTrackingScreen} />
      <Stack.Screen name="FeedbackSupport" component={FeedbackSupportScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Notifications" component={NotificationScreen} />
    </Stack.Navigator>
  );
};

export default ClientNavigator;
