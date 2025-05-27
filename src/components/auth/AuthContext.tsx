import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  username: string;
  role: 'admin' | 'nurse' | 'parent' | 'student';
  avatar?: string;
  isAuthenticated: boolean;
}

// Add FormData interface to match your login form
interface FormData {
  username: string;
  password: string;
  remember: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: User['role']) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data
const mockUsers: Record<string, User> = {
  'admin': {
    id: '1',
    name: 'Lê Văn Quản Trị',
    username: 'admin',
    role: 'admin',
    isAuthenticated: true,
  },
  'nurse': {
    id: '2',
    name: 'Nguyễn Thị Y Tá',
    username: 'nurse',
    role: 'nurse',
    isAuthenticated: true,
  },
  'parent': {
    id: '3',
    name: 'Trần Văn Phụ Huynh',
    username: 'parent',
    role: 'parent',
    isAuthenticated: true,
  },
  'student': {
    id: '4',
    name: 'Phạm Học Sinh',
    username: 'student',
    role: 'student',
    isAuthenticated: true,
  },
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Check localStorage for saved user
    const savedUser = localStorage.getItem('mockUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Updated login function to handle FormData properly
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login with:', { username, password });
      
      // Find user by username
      const foundUser = mockUsers[username];
      
      console.log('Found user:', foundUser);
      
      // Check if user exists and password matches
      if (foundUser && password === 'password123') {
        const authenticatedUser = {
          ...foundUser,
          isAuthenticated: true
        };
        
        setUser(authenticatedUser);
        localStorage.setItem('mockUser', JSON.stringify(authenticatedUser));
        
        console.log('Login successful for user:', authenticatedUser);
        return true;
      }
      
      console.log('Login failed: Invalid username or password');
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mockUser');
    console.log('User logged out');
  };

  const switchRole = (role: User['role']) => {
    if (user) {
      const updatedUser = {
        ...user,
        role,
        name: getMockUserName(role),
      };
      setUser(updatedUser);
      localStorage.setItem('mockUser', JSON.stringify(updatedUser));
      console.log('Role switched to:', role);
    }
  };

  const value = {
    user,
    login,
    logout,
    switchRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function
const getMockUserName = (role: string) => {
  switch (role) {
    case 'parent':
      return 'Trần Văn Phụ Huynh';
    case 'nurse':
      return 'Nguyễn Thị Y Tá';
    case 'admin':
      return 'Lê Văn Quản Trị';
    case 'student':
      return 'Phạm Học Sinh';
    default:
      return 'Người dùng';
  }
};