import React from 'react';
import { Appbar } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

interface AppHeaderProps {
  navigation: StackNavigationProp<RootStackParamList>;
  title: string;
  showBack?: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ 
  navigation, 
  title, 
  showBack = false 
}) => {
  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const handleNotificationsPress = () => {
    navigation.navigate('Notifications'); // FIXED: Now navigates to NotificationScreen
  };

  return (
    <Appbar.Header>
      {showBack ? (
        <Appbar.BackAction onPress={() => navigation.goBack()} />
      ) : null}
      <Appbar.Content title={title} />
      <Appbar.Action 
        icon="bell-outline" 
        onPress={handleNotificationsPress} 
      />
      <Appbar.Action 
        icon="account-circle" 
        onPress={handleProfilePress} 
      />
    </Appbar.Header>
  );
};

export default AppHeader;