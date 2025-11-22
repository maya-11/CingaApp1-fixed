import React from 'react';
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

interface AppHeaderProps {
  title: string;
  showBackButton?: boolean;
  showNotifications?: boolean;
  showProfile?: boolean;
  rightActions?: React.ReactNode;
}

const AppHeader: React.FC<AppHeaderProps> = ({ 
  title, 
  showBackButton = false,
  showNotifications = true,
  showProfile = true,
  rightActions
}) => {
  const navigation = useNavigation();

  const handleProfilePress = () => {
    navigation.navigate('Profile' as never);
  };

  const handleNotificationsPress = () => {
    navigation.navigate('Notifications' as never);
  };

  return (
    <Appbar.Header>
      {/* Back Button */}
      {showBackButton && (
        <Appbar.BackAction onPress={() => navigation.goBack()} />
      )}
      
      {/* Title */}
      <Appbar.Content title={title} />
      
      {/* Custom Right Actions */}
      {rightActions}
      
      {/* Default Right Actions */}
      {showNotifications && (
        <Appbar.Action 
          icon="bell-outline" 
          onPress={handleNotificationsPress} 
        />
      )}
      
      {showProfile && (
        <Appbar.Action 
          icon="account-circle" 
          onPress={handleProfilePress} 
        />
      )}
    </Appbar.Header>
  );
};

export default AppHeader;