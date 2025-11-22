import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, ActivityIndicator } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useAuth } from '../contexts/AuthContext';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      // Navigation is handled automatically by AuthContext + App.tsx
      console.log(' Login completed - auto-navigation will happen');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cingaphambile</Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        theme={{ colors: { primary: '#007AFF', placeholder: '#888', text: '#333' } }}
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
        autoCapitalize="none"
        theme={{ colors: { primary: '#007AFF', placeholder: '#888', text: '#333' } }}
      />

      {/*  ADD FORGOT PASSWORD LINK */}
      <Button
        onPress={() => navigation.navigate('ForgotPassword')}
        style={styles.forgotPasswordLink}
        labelStyle={styles.forgotPasswordText}
      >
        Forgot Password?
      </Button>

      {loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <Button 
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          <Text style={styles.buttonText}>Login</Text>
        </Button>
      )}

      <Button
        onPress={() => navigation.navigate('Register')}
        style={styles.link}
        labelStyle={styles.linkText}
      >
        Don't have an account? Register
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
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 40,
    color: '#333'
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  // 🆕 ADD FORGOT PASSWORD STYLES
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: -5,
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    marginTop: 5,
    elevation: 0, // Remove shadow on Android
    shadowOpacity: 0, // Remove shadow on iOS
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
    marginTop: 15,
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

export default LoginScreen;