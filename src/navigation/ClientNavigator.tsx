import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ClientDashboard from '../screens/client/ClientDashboard';
import ClientProjectDetailScreen from '../screens/client/ClientProjectDetailScreen';
import PaymentTrackingScreen from '../screens/client/PaymentTrackingScreen';
import FeedbackSupportScreen from '../screens/client/FeedbackSupportScreen';
import { ClientStackParamList } from '../types';

const Stack = createStackNavigator<ClientStackParamList>();

const ClientNavigator = () => {
  console.log('🔍 ClientNavigator: Loading client navigation stack');
  
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: true,
        headerStyle: {
          backgroundColor: '#2196F3', // Client theme color
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '600',
        }
      }}
    >
      <Stack.Screen 
        name="ClientDashboard" 
        component={ClientDashboard}
        options={{ 
          title: 'My Projects',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="ClientProjectDetail" 
        component={ClientProjectDetailScreen}
        options={{ 
          title: 'Project Details',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="PaymentTrackingScreen" 
        component={PaymentTrackingScreen}
        options={{ 
          title: 'Payment Tracking',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="FeedbackSupportScreen" 
        component={FeedbackSupportScreen}
        options={{ 
          title: 'Feedback & Support',
          headerShown: true 
        }}
      />
    </Stack.Navigator>
  );
};

export default ClientNavigator;