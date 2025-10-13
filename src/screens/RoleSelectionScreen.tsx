// Add this at the very top of the file
/// <reference types="react" />
/// <reference types="react-native" />
import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Card, Title, Button, Text, useTheme } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

type RoleSelectionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'RoleSelection'>;        

interface Props {
  navigation: RoleSelectionScreenNavigationProp;
}

const RoleSelectionScreen: React.FC<Props> = ({ navigation }: Props) => {
  const theme = useTheme();
  const { setUserRole } = useAuth();

  const selectRole = (role: 'manager' | 'client') => {
    setUserRole(role);

    if (role === 'manager') {
      navigation.navigate('ManagerDashboard');
    } else {
      navigation.navigate('ClientStack');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome to</Text>
        <Text style={styles.appName}>Cingaphambile</Text>
        <Text style={styles.subtitle}>How would you like to use the app?</Text>
      </View>

      <View style={styles.cardsContainer}>
        {/* Manager Card */}
        <Card style={[styles.roleCard, styles.managerCard]} elevation={4}>
          <View style={styles.cardGradient} />
          <Card.Content style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <View style={[styles.iconCircle, styles.managerIcon]}>
                <Text style={styles.emoji}>👨‍💼</Text>
              </View>
            </View>

            <Title style={styles.roleTitle}>Manager</Title>
            <Text style={styles.roleDescription}>
              Oversee all projects, track team performance, manage budgets, and generate comprehensive reports.
            </Text>

            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <View style={[styles.featureDot, styles.managerDot]} />
                <Text style={styles.featureText}>View all projects & team performance</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={[styles.featureDot, styles.managerDot]} />
                <Text style={styles.featureText}>Track budgets & spending</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={[styles.featureDot, styles.managerDot]} />
                <Text style={styles.featureText}>Monitor deadlines & progress</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={[styles.featureDot, styles.managerDot]} />
                <Text style={styles.featureText}>Generate reports & analytics</Text>
              </View>
            </View>

            <Button
              mode="contained"
              onPress={() => selectRole('manager')}
              style={styles.roleButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              Continue as Manager
            </Button>
          </Card.Content>
        </Card>

        {/* Client Card */}
        <Card style={[styles.roleCard, styles.clientCard]} elevation={4}>
          <View style={styles.cardGradient} />
          <Card.Content style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <View style={[styles.iconCircle, styles.clientIcon]}>
                <Text style={styles.emoji}>👩‍💻</Text>
              </View>
            </View>

            <Title style={styles.roleTitle}>Client</Title>
            <Text style={styles.roleDescription}>
              Monitor your project progress, track milestones, stay updated on budget usage, and communicate with your manager.
            </Text>

            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <View style={[styles.featureDot, styles.clientDot]} />
                <Text style={styles.featureText}>View project progress & milestones</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={[styles.featureDot, styles.clientDot]} />
                <Text style={styles.featureText}>Track deadlines & budget usage</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={[styles.featureDot, styles.clientDot]} />
                <Text style={styles.featureText}>Monitor spending & remaining budget</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={[styles.featureDot, styles.clientDot]} />
                <Text style={styles.featureText}>Communicate with project manager</Text>
              </View>
            </View>

            <Button
              mode="outlined"
              onPress={() => selectRole('client')}
              style={styles.roleButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.clientButtonLabel}
            >
              Continue as Client
            </Button>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  welcomeText: {
    fontSize: 18,
    color: '#64748B',
    marginBottom: 8,
    fontWeight: '500',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
  },
  cardsContainer: {
    paddingHorizontal: 20,
    gap: 24,
  },
  roleCard: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  managerCard: {
    borderTopWidth: 4,
    borderTopColor: '#6366F1',
  },
  clientCard: {
    borderTopWidth: 4,
    borderTopColor: '#10B981',
  },
  cardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'transparent',
  },
  cardContent: {
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  managerIcon: {
    backgroundColor: '#6366F1',
  },
  clientIcon: {
    backgroundColor: '#10B981',
  },
  emoji: {
    fontSize: 32,
  },
  roleTitle: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  roleDescription: {
    textAlign: 'center',
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
    marginBottom: 24,
  },
  featuresList: {
    gap: 12,
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  managerDot: {
    backgroundColor: '#6366F1',
  },
  clientDot: {
    backgroundColor: '#10B981',
  },
  featureText: {
    fontSize: 14,
    color: '#475569',
    flex: 1,
    lineHeight: 20,
  },
  roleButton: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  clientButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
  },
});

export default RoleSelectionScreen;