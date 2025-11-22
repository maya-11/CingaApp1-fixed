import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, ActivityIndicator, RadioButton } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useAuth } from '../contexts/AuthContext';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'manager' | 'client'>('client');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !name) {
      Alert.alert('Error', 'Please enter all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      await register(email, password, name, role);
      Alert.alert('Success', 'Account created successfully!');
      
      // 🚨 FIX: Navigate to RoleSelection WITH the selected role
      navigation.navigate('RoleSelection', { userRole: role });
      
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        label="Full Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
        autoCapitalize="words"
      />

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        label="Password"
        value={password} 
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
        autoCapitalize="none"
      />

      {/* Role Selection */}
      <Text style={styles.roleLabel}>I am a:</Text>
      <View style={styles.roleSelection}>
        <View style={styles.roleOption}>
          <RadioButton
            value="client"
            status={role === 'client' ? 'checked' : 'unchecked'}
            onPress={() => setRole('client')}
          />
          <Text style={styles.roleText}>Client</Text>
        </View>
        <View style={styles.roleOption}>
          <RadioButton
            value="manager"
            status={role === 'manager' ? 'checked' : 'unchecked'}
            onPress={() => setRole('manager')}
          />
          <Text style={styles.roleText}>Manager</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <Button 
          mode="contained"
          onPress={handleRegister}
          style={styles.registerButton}
          disabled={loading}
        >
          Sign Up
        </Button>
      )}

      <Button
        onPress={() => navigation.navigate('Login')}
        style={styles.loginLink}
        disabled={loading}
      >
        Already have an account? Sign In
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 'bold',
    color: '#333'
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#f9f9f9'
  },
  roleLabel: {
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333'
  },
  roleSelection: {
    marginBottom: 20,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 5
  },
  roleText: {
    fontSize: 16,
    marginLeft: 8,
  },
  registerButton: {
    marginTop: 10,
    paddingVertical: 8,
  },
  loginLink: {
    marginTop: 20,
  },
  loader: {
    marginTop: 20,
  }
});

export default RegisterScreen;