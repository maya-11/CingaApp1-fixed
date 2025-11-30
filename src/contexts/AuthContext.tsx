import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from '../services/firebase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: 'manager' | 'client') => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ ADD USER SYNC FUNCTION
  const syncUserToDatabase = async (firebaseUser: any, name?: string, role?: string) => {
    try {
      console.log('🔄 Syncing user to database...', firebaseUser.uid);
      
      const userData = {
        firebase_uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: name || firebaseUser.displayName || firebaseUser.email.split('@')[0],
        role: role || (firebaseUser.email === 'manager@cinga.com' ? 'manager' : 'client')
      };

      // Call your backend sync endpoint
      const response = await fetch('http://localhost:5000/api/users/sync-firebase-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to sync user');
      }

      console.log('✅ User synced to database:', result);
      return result;
    } catch (error) {
      console.error('❌ User sync failed:', error);
      // Don't throw error here - we still want the user to be able to login
      // even if sync fails (they can be synced later)
    }
  };

  // ✅ SIMPLIFIED: Use Firebase UID directly for new manager system
  const mapUserToDatabaseId = (firebaseUser: any): User => {
    const email = firebaseUser.email!;
    
    return {
      id: firebaseUser.uid, // ✅ Use Firebase UID directly (manager service will handle the rest)
      uid: firebaseUser.uid,
      email: email,
      name: firebaseUser.displayName || (email === 'manager@cinga.com' ? 'Cinga Project Manager' : email.split('@')[0]),
      role: email === 'manager@cinga.com' ? 'manager' : (email.includes('manager') ? 'manager' : 'client')
    };
  };

  useEffect(() => {
    console.log('🔄 AuthProvider: Setting up auth state listener');
    
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      console.log('🎯 Auth state changed:', firebaseUser?.email);
      
      if (firebaseUser) {
        // ✅ SYNC USER TO DATABASE ON AUTH STATE CHANGE
        await syncUserToDatabase(firebaseUser);
        
        const userData = mapUserToDatabaseId(firebaseUser);
        console.log('✅ User mapped - Firebase UID:', userData.uid, 'Role:', userData.role);
        setUser(userData);
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

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      if (!firebaseUser) throw new Error('Firebase login failed');
      console.log('✅ Firebase login successful:', firebaseUser.uid);

      // ✅ SYNC USER TO DATABASE ON LOGIN
      await syncUserToDatabase(firebaseUser);

      const userData = mapUserToDatabaseId(firebaseUser);
      setUser(userData);
      console.log('✅ Login complete, Firebase UID:', userData.uid, 'Role:', userData.role);

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

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, { displayName: name });

      // ✅ SYNC USER TO DATABASE ON REGISTRATION (with explicit name and role)
      await syncUserToDatabase(firebaseUser, name, role);

      const userData = mapUserToDatabaseId(firebaseUser);
      userData.name = name;
      userData.role = role;

      console.log('✅ Registration successful, Firebase UID:', userData.uid, 'Role:', userData.role);
      setUser(userData);

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

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
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