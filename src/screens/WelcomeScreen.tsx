import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { AppTheme } from '../theme/AppTheme';

const WelcomeScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Cinga</Text>
        <Text style={styles.subtitle}>Project Management</Text>
        <Text style={styles.description}>
          Manage your projects, track progress, and handle payments all in one place
        </Text>
      </View>

      {/* Illustration/Image Section */}
      <View style={styles.imageContainer}>
        <View style={styles.illustration}>
          <Text style={styles.illustrationText}>📊</Text>
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.features}>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>✅</Text>
          <Text style={styles.featureText}>Track Project Progress</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>💰</Text>
          <Text style={styles.featureText}>Manage Payments</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>👥</Text>
          <Text style={styles.featureText}>Client Collaboration</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('Login')}
          style={styles.primaryButton}
          labelStyle={styles.buttonLabel}
        >
          Get Started
        </Button>
        <Button 
          mode="outlined" 
          onPress={() => navigation.navigate('Login')}
          style={styles.secondaryButton}
          labelStyle={styles.buttonLabel}
        >
          I Have an Account
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
    padding: AppTheme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginTop: AppTheme.spacing.xxl,
  },
  title: {
    fontSize: AppTheme.typography.headlineLarge.fontSize,
    lineHeight: AppTheme.typography.headlineLarge.lineHeight,
    fontWeight: AppTheme.typography.headlineLarge.fontWeight as any,
    color: AppTheme.colors.primary,
    marginBottom: AppTheme.spacing.xs,
  },
  subtitle: {
    fontSize: AppTheme.typography.titleLarge.fontSize,
    lineHeight: AppTheme.typography.titleLarge.lineHeight,
    fontWeight: AppTheme.typography.titleLarge.fontWeight as any,
    color: AppTheme.colors.text.primary,
    marginBottom: AppTheme.spacing.md,
  },
  description: {
    fontSize: AppTheme.typography.bodyLarge.fontSize,
    lineHeight: AppTheme.typography.bodyLarge.lineHeight,
    fontWeight: AppTheme.typography.bodyLarge.fontWeight as any,
    color: AppTheme.colors.text.secondary,
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: AppTheme.spacing.xxl,
  },
  illustration: {
    width: 200,
    height: 200,
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    ...AppTheme.shadows.lg,
  },
  illustrationText: {
    fontSize: 80,
  },
  features: {
    marginBottom: AppTheme.spacing.xxl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.lg,
    backgroundColor: AppTheme.colors.surface,
    padding: AppTheme.spacing.md,
    borderRadius: AppTheme.borderRadius.md,
    ...AppTheme.shadows.sm,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: AppTheme.spacing.md,
  },
  featureText: {
    fontSize: AppTheme.typography.bodyLarge.fontSize,
    lineHeight: AppTheme.typography.bodyLarge.lineHeight,
    fontWeight: AppTheme.typography.bodyLarge.fontWeight as any,
    color: AppTheme.colors.text.primary,
  },
  actions: {
    gap: AppTheme.spacing.md,
  },
  primaryButton: {
    backgroundColor: AppTheme.colors.primary,
    paddingVertical: AppTheme.spacing.sm,
    borderRadius: AppTheme.borderRadius.lg,
  },
  secondaryButton: {
    borderColor: AppTheme.colors.primary,
    paddingVertical: AppTheme.spacing.sm,
    borderRadius: AppTheme.borderRadius.lg,
  },
  buttonLabel: {
    fontSize: AppTheme.typography.titleMedium.fontSize,
    lineHeight: AppTheme.typography.titleMedium.lineHeight,
    fontWeight: AppTheme.typography.titleMedium.fontWeight as any,
    color: AppTheme.colors.text.light,
  },
});

export default WelcomeScreen;