import React from 'react';
import { View, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native';
import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple,
  Switch,
  Card,
  Button,
  Divider,
} from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

const { width } = Dimensions.get('window');

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Profile'
>;

interface Props {
  navigation: ProfileScreenNavigationProp;
}

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Edit profile functionality coming soon!');
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Password change functionality coming soon!');
  };

  const getInitials = (email?: string) => {
    return email?.charAt(0).toUpperCase() || 'U';
  };

  // Get user role safely
  const userRole = user?.role || 'client';
  const displayName = user?.email?.split('@')[0] || 'User';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <Card style={styles.headerCard} elevation={3}>
        <Card.Content style={styles.headerContent}>
          <View style={styles.avatarSection}>
            <Avatar.Text 
              size={80} 
              label={getInitials(user?.email)} 
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Title style={styles.userName}>
                {displayName}
              </Title>
              <Caption style={styles.userRole}>
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

      {/* Profile Information */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Profile Information</Title>
          <Divider style={styles.divider} />
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>📧</Text>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email || 'Not available'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>👤</Text>
              <Text style={styles.infoLabel}>Role</Text>
              <Text style={styles.infoValue}>
                {userRole === 'manager' ? 'Project Manager' : 'Client'}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>📅</Text>
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>March 2024</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Account Settings */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Account Settings</Title>
          <Divider style={styles.divider} />
          
          <TouchableRipple onPress={handleChangePassword}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>🔒</Text>
                <Text style={styles.settingText}>Change Password</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableRipple>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🔔</Text>
              <Text style={styles.settingText}>Email Notifications</Text>
            </View>
            <Switch value={true} onValueChange={() => {}} />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>📱</Text>
              <Text style={styles.settingText}>Push Notifications</Text>
            </View>
            <Switch value={true} onValueChange={() => {}} />
          </View>
        </Card.Content>
      </Card>

      {/* App Information */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>App Information</Title>
          <Divider style={styles.divider} />
          
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>ℹ️</Text>
              <Text style={styles.settingText}>App Version</Text>
            </View>
            <Text style={styles.versionText}>1.0.0</Text>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>📲</Text>
              <Text style={styles.settingText}>Build Number</Text>
            </View>
            <Text style={styles.versionText}>1001001</Text>
          </View>

          <TouchableRipple onPress={() => Alert.alert('Support', 'Contact support functionality coming soon!')}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>🎧</Text>
                <Text style={styles.settingText}>Contact Support</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
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
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  headerCard: {
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  headerContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: '#6366F1',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  editButton: {
    borderRadius: 12,
    borderColor: '#6366F1',
  },
  sectionCard: {
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  divider: {
    marginBottom: 12,
    backgroundColor: '#F1F5F9',
  },
  infoRow: {
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 18,
    width: 24,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 12,
    marginRight: 8,
    width: 100,
  },
  infoValue: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
    flex: 1,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 18,
    width: 24,
  },
  settingText: {
    fontSize: 15,
    color: '#1E293B',
    marginLeft: 12,
    flex: 1,
  },
  chevron: {
    fontSize: 18,
    color: '#64748B',
    fontWeight: 'bold',
  },
  versionText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  logoutButton: {
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#EF4444',
    paddingVertical: 6,
  },
  logoutButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 12,
  },
});

export default ProfileScreen;