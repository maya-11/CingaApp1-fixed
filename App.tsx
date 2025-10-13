
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootStackParamList } from './src/types';
import { AuthProvider } from './src/contexts/AuthContext';

// Import gesture handler at the very top (important!)
import 'react-native-gesture-handler'

// Auth Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import RoleSelectionScreen from './src/screens/RoleSelectionScreen';

// Manager Screens
import ManagerDashboard from './src/screens/ManagerDashboard';
import ProjectListScreen from './src/screens/ProjectListScreen';
import ProjectDetailScreen from './src/screens/ProjectDetailScreen';

// Client Navigator
import ClientNavigator from './src/navigation/ClientNavigator';

// Shared Screens
import ProfileScreen from './src/screens/ProfileScreen';
import NotificationScreen from './src/screens/NotificationScreen';

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  console.log('?? App.tsx is running!'); // ADD THIS LINE
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <AuthProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
              {/* Auth Screens */}
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />

              {/* Manager Screens */}
              <Stack.Screen name="ManagerDashboard" component={ManagerDashboard} />
              <Stack.Screen name="ProjectListScreen" component={ProjectListScreen} />
              <Stack.Screen name="ProjectDetailScreen" component={ProjectDetailScreen} />

              {/* Client Stack */}
              <Stack.Screen name="ClientStack" component={ClientNavigator} />

              {/* Shared Screens */}
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="Notifications" component={NotificationScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </AuthProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
};

export default App;
