import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple,
  Switch,
  Card,
  Button,
} from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Profile'
>;

interface Props {
  navigation: ProfileScreenNavigationProp;
}

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, logout, userRole } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: logout
        },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Edit profile functionality coming soon!');
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Password change functionality coming soon!');
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <View style={styles.avatarSection}>
            <Avatar.Text 
              size={80} 
              label={user?.email?.charAt(0).toUpperCase() || 'U'} 
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Title style={styles.title}>
                {user?.email || 'User'}
              </Title>
              <Caption style={styles.caption}>
                {userRole === 'manager' ? 'Project Manager' : 'Client'}
              </Caption>
            </View>
          </View>

          <Button 
            mode="outlined" 
            onPress={handleEditProfile}
            style={styles.editButton}
          >
            Edit Profile
          </Button>
        </Card.Content>
      </Card>

      {/* Account Settings */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Account Settings</Title>
          
          <TouchableRipple onPress={handleChangePassword}>
            <View style={styles.preference}>
              <Text>Change Password</Text>
              <Caption>Update your password</Caption>
            </View>
          </TouchableRipple>

          <View style={styles.preference}>
            <Text>Email Notifications</Text>
            <Caption>Receive project updates</Caption>
            <Switch value={true} onValueChange={() => {}} />
          </View>

          <View style={styles.preference}>
            <Text>Push Notifications</Text>
            <Caption>Get instant alerts</Caption>
            <Switch value={true} onValueChange={() => {}} />
          </View>
        </Card.Content>
      </Card>

      {/* App Information */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>App Information</Title>
          
          <View style={styles.preference}>
            <Text>Version</Text>
            <Caption>1.0.0</Caption>
          </View>

          <View style={styles.preference}>
            <Text>Build Number</Text>
            <Caption>1001001</Caption>
          </View>

          <TouchableRipple onPress={() => Alert.alert('Support', 'Contact support functionality coming soon!')}>
            <View style={styles.preference}>
              <Text>Contact Support</Text>
              <Caption>Get help with the app</Caption>
            </View>
          </TouchableRipple>
        </Card.Content>
      </Card>

      {/* Logout Button */}
      <Button 
        mode="contained" 
        onPress={handleLogout}
        style={styles.logoutButton}
        labelStyle={styles.logoutButtonLabel}
      >
        Logout
      </Button>

      <View style={styles.footer}>
        <Caption style={styles.footerText}>
          CingaApp Mobile v1.0.0
        </Caption>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileCard: {
    margin: 16,
    elevation: 4,
  },
  profileContent: {
    alignItems: 'center',
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: '#2196F3',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  editButton: {
    marginTop: 8,
  },
  sectionCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
    color: '#333',
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logoutButton: {
    margin: 16,
    marginTop: 24,
    backgroundColor: '#ff4444',
  },
  logoutButtonLabel: {
    color: 'white',
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    padding: 16,
    paddingTop: 24,
  },
  footerText: {
    textAlign: 'center',
    color: '#666',
  },
});

export default ProfileScreen;