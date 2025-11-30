// App.tsx - FULLY FIXED VERSION
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, ActivityIndicator, Text } from 'react-native';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import { RootStackParamList } from './src/types';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { AppTheme } from './src/theme/AppTheme';

import 'react-native-gesture-handler'

// Auth Screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import RoleSelectionScreen from './src/screens/RoleSelectionScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';

// Manager Screens
import ManagerDashboard from './src/screens/ManagerDashboard';
import CreateProjectScreen from './src/screens/CreateProjectScreen';
import SelectClientScreen from './src/screens/SelectClientScreen';
import ProjectListScreen from './src/screens/ProjectListScreen';
import ProjectDetailScreen from './src/screens/ProjectDetailScreen';
import EditProjectScreen from './src/screens/EditProjectScreen';

// Client Screens
import ClientDashboard from './src/screens/client/ClientDashboard';

// ✅ FIXED: Import the REAL ClientProjectDetailScreen
import ClientProjectDetailScreen from './src/screens/client/ClientProjectDetailScreen';

// ✅ ADDED: Import FeedbackSupportScreen
import FeedbackSupportScreen from './src/screens/client/FeedbackSupportScreen';

// New Screens
import TasksScreen from './src/screens/TasksScreen';
import BudgetScreen from './src/screens/BudgetScreen';

// Shared Screens
import ProfileScreen from './src/screens/ProfileScreen';
import NotificationScreen from './src/screens/NotificationScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  const { user, loading } = useAuth();

  console.log('🎯 AppNavigator: Auth state:', { 
    hasUser: !!user, 
    userRole: user?.role, 
    loading 
  });

  if (loading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: AppTheme.colors.background 
      }}>
        <ActivityIndicator size="large" color={AppTheme.colors.primary} />
        <Text style={{ marginTop: 16, color: AppTheme.colors.text.secondary }}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <Stack.Navigator 
      screenOptions={{
        headerStyle: {
          backgroundColor: AppTheme.colors.primary,
        },
        headerTintColor: AppTheme.colors.text.light,
        headerTitleStyle: {
          fontSize: AppTheme.typography.titleMedium.fontSize,
          fontWeight: AppTheme.typography.titleMedium.fontWeight as '600',
        },
      }}
    >
      {!user ? (
        <>
          <Stack.Screen 
            name="Welcome" 
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ title: 'Sign In' }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen}
            options={{ title: 'Create Account' }}
          />
          <Stack.Screen 
            name="ForgotPassword" 
            component={ForgotPasswordScreen}
            options={{ title: 'Reset Password' }}
          />
        </>
      ) : (
        <>
          <Stack.Screen 
            name="RoleSelection" 
            component={RoleSelectionScreen}
            options={{ title: 'Choose Role', headerShown: false }}
          />
          
          {/* Manager Routes */}
          {user?.role === 'manager' && (
            <>
              <Stack.Screen 
                name="ManagerDashboard" 
                component={ManagerDashboard}
                options={{ title: 'Dashboard' }}
              />
              <Stack.Screen 
                name="CreateProjectScreen"
                component={CreateProjectScreen}
                options={{ title: 'Create Project' }}
              />
              <Stack.Screen 
                name="SelectClientScreen"
                component={SelectClientScreen}
                options={{ title: 'Select Client' }}
              />
              <Stack.Screen 
                name="ProjectListScreen" 
                component={ProjectListScreen}
                options={{ title: 'My Projects' }}
              />
              <Stack.Screen 
                name="ProjectDetailScreen" 
                component={ProjectDetailScreen}
                options={{ title: 'Project Details' }}
              />
              <Stack.Screen 
                name="EditProjectScreen" 
                component={EditProjectScreen}
                options={{ title: 'Edit Project' }}
              />
            </>
          )}
          
          {/* Client Routes */}
          {user?.role === 'client' && (
            <>
              <Stack.Screen 
                name="ClientDashboard" 
                component={ClientDashboard}
                options={{ title: 'My Projects', headerShown: false }}
              />
              
              {/* ✅ FIXED: Use the REAL ClientProjectDetailScreen */}
              <Stack.Screen 
                name="ClientProjectDetails" 
                component={ClientProjectDetailScreen}
                options={({ route }): NativeStackNavigationOptions => ({
                  title: route.params?.project?.title || 'Project Details',
                  headerStyle: {
                    backgroundColor: AppTheme.colors.primary,
                  },
                  headerTintColor: AppTheme.colors.text.light,
                })}
              />

              {/* ✅ ADDED: FeedbackSupportScreen for clients */}
              <Stack.Screen 
                name="FeedbackSupportScreen" 
                component={FeedbackSupportScreen}
                options={{ title: 'Feedback & Support' }}
              />
            </>
          )}
          
          {/* Shared Manager/Client Screens */}
          <Stack.Screen 
            name="TasksScreen" 
            component={TasksScreen}
            options={{ title: 'Project Tasks' }}
          />
          <Stack.Screen 
            name="BudgetScreen" 
            component={BudgetScreen}
            options={{ title: 'Budget Management' }}
          />
          
          {/* Shared Screens */}
          <Stack.Screen 
            name="Profile" 
            component={ProfileScreen}
            options={{ title: 'My Profile' }}
          />
          <Stack.Screen 
            name="Notifications" 
            component={NotificationScreen}
            options={{ title: 'Notifications' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

const App: React.FC = () => {
  console.log('🚀 App.tsx is running!');
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={AppTheme}>
        <AuthProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </AuthProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
};

export default App;