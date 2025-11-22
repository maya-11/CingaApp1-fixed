
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, ActivityIndicator } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { auth } from '../services/firebase';

import { sendPasswordResetEmail } from 'firebase/auth';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ForgotPassword'>;

interface Props {
  navigation: ForgotPasswordScreenNavigationProp;
}

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
      Alert.alert(
        'Email Sent', 
        'Password reset instructions have been sent to your email address.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      
      let errorMessage = 'Failed to send reset email. Please try again.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Please try again later.';
      }
      
      Alert.alert('Reset Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>
        Enter your email address and we'll send you instructions to reset your password.
      </Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        theme={{ colors: { primary: '#007AFF', placeholder: '#888', text: '#333' } }}
        disabled={loading}
      />

      {loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <Button 
          mode="contained"
          onPress={handleResetPassword}
          style={styles.button}
          contentStyle={styles.buttonContent}
          disabled={emailSent}
        >
          <Text style={styles.buttonText}>Send Reset Instructions</Text>
        </Button>
      )}

      <Button
        onPress={() => navigation.navigate('Login')}
        style={styles.link}
        labelStyle={styles.linkText}
        disabled={loading}
      >
        Back to Login
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333'
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
    lineHeight: 22,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    marginTop: 5,
    elevation: 0,
    shadowOpacity: 0,
  },
  buttonContent: {
    paddingVertical: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600'
  },
  link: {
    marginTop: 20,
  },
  linkText: {
    color: '#007AFF',
    fontSize: 15,
    textAlign: 'center'
  },
  loader: {
    marginTop: 20,
  }
});

export default ForgotPasswordScreen;