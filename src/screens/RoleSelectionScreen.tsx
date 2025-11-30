import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Button, Card, ActivityIndicator, Title } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { AppTheme } from '../theme/AppTheme';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

type RoleSelectionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'RoleSelection'>;

interface Props {
  navigation: RoleSelectionScreenNavigationProp;
  route?: any;
}

const RoleSelectionScreen: React.FC<Props> = ({ navigation, route }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const userRole = user?.role || 'client';

  const handleRoleSelect = async (selectedRole: 'manager' | 'client') => {
    if (loading) return;
    
    console.log('🎯 User selected role:', selectedRole);
    setLoading(true);
    
    try {
      if (selectedRole === 'manager') {
        console.log('📍 Navigating to ManagerDashboard');
        navigation.replace('ManagerDashboard');
      } else {
        console.log('📍 Navigating to ClientDashboard');
        navigation.replace('ClientDashboard');
      }
    } catch (error) {
      console.error('❌ Navigation error:', error);
      setLoading(false);
    }
  };

  const isManager = user?.role === 'manager';
  const isClient = user?.role === 'client';

  if (!user) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={AppTheme.colors.primary} />
        <Text style={styles.loadingText}>Loading your account...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Beautiful Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeEmoji}>👋</Text>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>
              {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} Account
            </Text>
          </View>
        </View>
      </View>

      {/* Main Title */}
      <View style={styles.titleSection}>
        <Text style={styles.mainTitle}>Choose Your Dashboard</Text>
        <Text style={styles.subtitle}>
          Select the dashboard that matches your current role and responsibilities
        </Text>
      </View>

      {/* Role Selection Cards */}
      <View style={styles.cardsContainer}>
        {/* Manager Card */}
        <Card style={[styles.roleCard, styles.managerCard]}>
          <View style={styles.cardGradient} />
          <Card.Content style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <Text style={styles.roleEmoji}>👨‍💼</Text>
              </View>
              <View style={styles.roleHeader}>
                <Text style={styles.roleTitle}>Manager Dashboard</Text>
                <Text style={styles.roleSubtitle}>Full Administrative Access</Text>
              </View>
            </View>
            
            <Text style={styles.roleDescription}>
              Take control of your projects with comprehensive management tools. Create projects, assign tasks, track progress, and manage client relationships.
            </Text>

            <View style={styles.featuresGrid}>
              <View style={styles.featureItem}>
                <Text style={styles.featureEmoji}>📊</Text>
                <Text style={styles.featureText}>Project Analytics</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureEmoji}>👥</Text>
                <Text style={styles.featureText}>Team Management</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureEmoji}>💰</Text>
                <Text style={styles.featureText}>Budget Control</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureEmoji}>📋</Text>
                <Text style={styles.featureText}>Task Assignment</Text>
              </View>
            </View>

            <View style={styles.accessBadge}>
              <Text style={styles.accessText}>
                {isManager ? '✅ Access Granted' : '🔒 Manager Access Only'}
              </Text>
            </View>
          </Card.Content>
          <Card.Actions style={styles.cardActions}>
            <Button 
              mode="contained" 
              onPress={() => handleRoleSelect('manager')}
              disabled={!isManager || loading}
              loading={loading && isManager}
              style={[styles.roleButton, styles.managerButton]}
              labelStyle={styles.buttonLabel}
              icon="chart-bar"
            >
              {isManager ? 'Enter Manager Dashboard' : 'Restricted Access'}
            </Button>
          </Card.Actions>
        </Card>

        {/* Client Card */}
        <Card style={[styles.roleCard, styles.clientCard]}>
          <View style={styles.cardGradient} />
          <Card.Content style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <Text style={styles.roleEmoji}>👥</Text>
              </View>
              <View style={styles.roleHeader}>
                <Text style={styles.roleTitle}>Client Dashboard</Text>
                <Text style={styles.roleSubtitle}>Project Monitoring Access</Text>
              </View>
            </View>
            
            <Text style={styles.roleDescription}>
              Stay informed about your projects with real-time updates. Track progress, review milestones, and communicate directly with your project manager.
            </Text>

            <View style={styles.featuresGrid}>
              <View style={styles.featureItem}>
                <Text style={styles.featureEmoji}>📈</Text>
                <Text style={styles.featureText}>Progress Tracking</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureEmoji}>💬</Text>
                <Text style={styles.featureText}>Direct Communication</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureEmoji}>📅</Text>
                <Text style={styles.featureText}>Milestone Updates</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureEmoji}>📄</Text>
                <Text style={styles.featureText}>Document Review</Text>
              </View>
            </View>

            <View style={styles.accessBadge}>
              <Text style={styles.accessText}>
                {isClient ? '✅ Access Granted' : '🔒 Client Access Only'}
              </Text>
            </View>
          </Card.Content>
          <Card.Actions style={styles.cardActions}>
            <Button 
              mode="contained" 
              onPress={() => handleRoleSelect('client')}
              disabled={!isClient || loading}
              loading={loading && isClient}
              style={[styles.roleButton, styles.clientButton]}
              labelStyle={styles.buttonLabel}
              icon="monitor-dashboard"
            >
              {isClient ? 'Enter Client Dashboard' : 'Restricted Access'}
            </Button>
          </Card.Actions>
        </Card>
      </View>

      {/* User Profile Card */}
      <Card style={styles.profileCard}>
        <Card.Content>
          <View style={styles.profileHeader}>
            <Text style={styles.profileTitle}>👤 Account Profile</Text>
          </View>
          <View style={styles.profileGrid}>
            <View style={styles.profileItem}>
              <Text style={styles.profileLabel}>User ID</Text>
              <Text style={styles.profileValue}>{user?.id}</Text>
            </View>
            <View style={styles.profileItem}>
              <Text style={styles.profileLabel}>Email Address</Text>
              <Text style={styles.profileValue}>{user?.email}</Text>
            </View>
            <View style={styles.profileItem}>
              <Text style={styles.profileLabel}>Account Role</Text>
              <View style={[styles.roleTag, isManager ? styles.managerTag : styles.clientTag]}>
                <Text style={styles.roleTagText}>
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                </Text>
              </View>
            </View>
            <View style={styles.profileItem}>
              <Text style={styles.profileLabel}>Status</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>🟢 Active</Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>

      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>Preparing your dashboard...</Text>
          </View>
        </View>
      )}

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerSection: {
    backgroundColor: '#6366F1',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    elevation: 8,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  welcomeContainer: {
    alignItems: 'center',
  },
  welcomeEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 18,
    color: '#E0E7FF',
    fontWeight: '500',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  roleBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  roleBadgeText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  titleSection: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  cardsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  roleCard: {
    borderRadius: 24,
    marginBottom: 20,
    elevation: 6,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  managerCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#6366F1',
  },
  clientCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  cardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'linear-gradient(90deg, #6366F1, #8B5CF6)',
  },
  cardContent: {
    padding: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  roleEmoji: {
    fontSize: 24,
  },
  roleHeader: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  roleSubtitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  roleDescription: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 24,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginBottom: 20,
  },
  featureItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  featureEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  featureText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  accessBadge: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  accessText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  cardActions: {
    padding: 0,
    marginTop: 8,
  },
  roleButton: {
    borderRadius: 16,
    marginHorizontal: 24,
    marginBottom: 24,
    paddingVertical: 8,
    width: width - 88,
    elevation: 2,
  },
  managerButton: {
    backgroundColor: '#6366F1',
  },
  clientButton: {
    backgroundColor: '#10B981',
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  profileCard: {
    borderRadius: 24,
    marginHorizontal: 20,
    marginBottom: 24,
    elevation: 4,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  profileHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 16,
    marginBottom: 16,
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
  },
  profileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  profileItem: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  profileLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 6,
    fontWeight: '500',
  },
  profileValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  roleTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  managerTag: {
    backgroundColor: '#E0E7FF',
  },
  clientTag: {
    backgroundColor: '#D1FAE5',
  },
  roleTagText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
  },
  statusBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#065F46',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingContent: {
    backgroundColor: '#1E293B',
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 8,
  },
  loadingText: {
    marginTop: 16,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 40,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
});

export default RoleSelectionScreen;