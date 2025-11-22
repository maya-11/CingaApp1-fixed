import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from '../services/firebase';
import { authService, userService, User } from '../services/backendService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: 'manager' | 'client') => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 AuthProvider: Setting up auth state listener');
    
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      console.log('🎯 Auth state changed:', firebaseUser?.email);
      
      if (firebaseUser) {
        try {
          console.log('🔄 Firebase user detected, getting token...');
          const token = await firebaseUser.getIdToken();
          const response = await authService.login(token);

          if (response.success) {
            console.log('✅ Auto-login successful:', response.user.role);
            setUser(response.user);
          } else {
            console.error('❌ Auto-login failed');
            setUser(null);
          }
        } catch (error) {
          console.error('❌ Auto-login error:', error);
          setUser(null);
        }
      } else {
        console.log('👤 No user signed in');
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('🚀 Login started for:', email);

      // 1. Firebase authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      if (!firebaseUser) throw new Error('Firebase login failed');

      // 2. Backend authentication
      const token = await firebaseUser.getIdToken();
      const response = await authService.login(token);

      if (response.success) {
        console.log('✅ Login successful, user role:', response.user.role);
        setUser(response.user);
      } else {
        throw new Error(response.error || 'Login failed');
      }

    } catch (error: any) {
      console.error('❌ Login error:', error);
      
      let errorMessage = 'Login failed';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: 'manager' | 'client') => {
    setLoading(true);
    try {
      console.log('🚀 Registration started for:', email, 'as', role);

      // 1. Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // 2. Update Firebase profile
      await updateProfile(firebaseUser, { displayName: name });

      // 3. Backend registration with role
      const token = await firebaseUser.getIdToken();
      const response = await authService.login(token, role);

      if (response.success) {
        console.log('✅ Registration successful, user role:', response.user.role);
        setUser(response.user);
      } else {
        throw new Error(response.error || 'Registration failed');
      }

    } catch (error: any) {
      console.error('❌ Registration error:', error);
      
      let errorMessage = 'Registration failed';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered';
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      console.log('✅ Logout successful');
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error('Logout failed');
    }
  };

  const refreshUser = async () => {
    if (user) {
      try {
        const updatedUser = await userService.getUser(user.id);
        setUser(updatedUser);
      } catch (error) {
        console.error('Failed to refresh user:', error);
        throw error;
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};