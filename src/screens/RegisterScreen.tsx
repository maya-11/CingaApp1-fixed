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
  const [name, setName] = useState(''); // ADD NAME FIELD
  const [role, setRole] = useState<'manager' | 'client'>('client'); // ADD ROLE FIELD
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !name) { // CHECK NAME
      Alert.alert('Error', 'Please enter all fields');
      return;
    }
    setLoading(true);
    const result = await register(email, password, name, role); // PASS ALL PARAMETERS
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Account created successfully!');
      navigation.navigate('RoleSelection'); // NAVIGATE TO ROLE SELECTION
    } else {
      Alert.alert('Registration Failed', result.error || 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput label="Full Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput label="Email" value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" />
      <TextInput label="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
      
      {/* ADD ROLE SELECTION */}
      <Text style={styles.roleLabel}>I am a:</Text>
      <RadioButton.Group onValueChange={value => setRole(value as 'manager' | 'client')} value={role}>
        <View style={styles.radioOption}>
          <RadioButton value="client" />
          <Text>Client</Text>
        </View>
        <View style={styles.radioOption}>
          <RadioButton value="manager" />
          <Text>Manager</Text>
        </View>
      </RadioButton.Group>

      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button mode="contained" onPress={handleRegister}>Sign Up</Button>
      )}
      <Button onPress={() => navigation.navigate('Login')}>Already have an account? Sign In</Button>      
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
  input: { marginBottom: 10 },
  roleLabel: { marginTop: 10, marginBottom: 5, fontWeight: 'bold' },
  radioOption: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
});

export default RegisterScreen;