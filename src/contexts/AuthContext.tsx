import React, { createContext, useState, useContext, ReactNode } from 'react';
import { auth } from '../services/firebase';
import { User as FirebaseUser } from 'firebase/auth';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>; // FIX RETURN TYPE
  register: (email: string, password: string, name: string, role: 'manager' | 'client') => Promise<{ success: boolean; error?: string }>; // FIX RETURN TYPE
  logout: () => Promise<void>;
  setUserRole: (role: 'manager' | 'client') => void;
  userRole: 'manager' | 'client' | null; // ADD THIS
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
    userRole: null,
  });

  const setUserRole = (role: 'manager' | 'client') => {
    setAuthState(prev => ({
      ...prev,
      userRole: role
    }));
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setAuthState(prev => ({ ...prev, loading: true }));
    try {
      // Mock login for now - replace with actual Firebase auth
      console.log('Login attempt:', email, password);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockUser: User = {
        id: '1',
        email: email,
        name: 'Test User',
        role: email.includes('client') ? 'client' : 'manager',
        company: 'Test Company'
      };

      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        loading: false,
        userRole: mockUser.role,
      });

      return { success: true }; // RETURN SUCCESS
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, loading: false }));
      return { success: false, error: error.message }; // RETURN ERROR
    }
  };

  const register = async (email: string, password: string, name: string, role: 'manager' | 'client'): Promise<{ success: boolean; error?: string }> => {
    setAuthState(prev => ({ ...prev, loading: true }));
    try {
      // Mock registration
      console.log('Register attempt:', email, name, role);

      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockUser: User = {
        id: '1',
        email: email,
        name: name,
        role: role,
        company: 'Test Company'
      };

      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        loading: false,
        userRole: role,
      });

      return { success: true }; // RETURN SUCCESS
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, loading: false }));
      return { success: false, error: error.message }; // RETURN ERROR
    }
  };

  const logout = async (): Promise<void> => {
    setAuthState(prev => ({ ...prev, loading: true }));
    try {
      await auth.signOut();
      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false,
        userRole: null,
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    setUserRole,
    userRole: authState.userRole, // ADD THIS
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};