import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  username: string;
  role: 'admin' | 'nurse' | 'parent' | 'student';
  avatar?: string;
  isAuthenticated: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API Configuration - Keep the __method=POST
const API_BASE_URL = 'https://my.api.mockaroo.com/account.json?key=c12b5dc0&__method=POST';

// Default password for all users (temporary solution)
const DEFAULT_PASSWORD = 'password123';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Check localStorage for saved user
    const savedUser = localStorage.getItem('authUser');
    const savedToken = localStorage.getItem('authToken');
    
    if (savedUser && savedToken) {
      return JSON.parse(savedUser);
    }
    return null;
  });
  
  const [loading, setLoading] = useState(false);

  // API login function - Fixed to work with Mockaroo API
  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      console.log('Attempting login with Mockaroo API:', { username });
      
      // Step 1: Check if password is correct
      if (password !== DEFAULT_PASSWORD) {
        console.log('Login failed: Incorrect password');
        return false;
      }

      // Step 2: Fetch all users from Mockaroo API (not adding /users!)
      console.log('Fetching from Mockaroo API:', API_BASE_URL);
      
      const response = await fetch(API_BASE_URL, {
        method: 'GET', // Use GET even though URL has __method=POST
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        console.log('Failed to fetch users from Mockaroo API:', response.status);
        return false;
      }

      const usersData = await response.json();
      console.log('Mockaroo API Response:', usersData);

      // Step 3: Handle response format
      let users = [];
      if (Array.isArray(usersData)) {
        users = usersData;
      } else {
        console.log('Expected array from Mockaroo, got:', typeof usersData);
        return false;
      }

      if (users.length === 0) {
        console.log('No users found in API');
        return false;
      }

      // Log first user for debugging
      console.log('First user structure:', users[0]);
      console.log('Available fields:', Object.keys(users[0]));

      // Step 4: Find user by username (flexible matching)
      const foundUser = users.find((user: any) => {
        // Try different username fields that might exist in your Mockaroo data
        const userFields = [
          user.username,
          user.email,
          user.login,
          user.user_name,
          user.userName,
          user.account,
          user.id,
        ];
        
        return userFields.some(field => 
          field && field.toString().toLowerCase() === username.toLowerCase()
        );
      });

      if (!foundUser) {
        console.log('User not found:', username);
        console.log('Available users:', users.slice(0, 5).map((u: any) => 
          u.username || u.email || u.login || u.user_name || u.id || 'no-identifier'
        ));
        return false;
      }

      console.log('Found user:', foundUser);

      // Step 5: Create authenticated user object
      const authenticatedUser: User = {
        id: String(foundUser.id || Math.random()),
        name: foundUser.name || 
              foundUser.full_name || 
              foundUser.fullName ||
              foundUser.first_name + ' ' + foundUser.last_name ||
              foundUser.username ||
              username,
        username: foundUser.username || foundUser.email || foundUser.login || username,
        role: mapUserRole(foundUser.role || foundUser.user_type || 'student'),
        avatar: foundUser.avatar || foundUser.profile_picture,
        isAuthenticated: true,
      };

      // Step 6: Generate simple token
      const simpleToken = btoa(`${username}:${Date.now()}`);
      
      // Save user and token
      setUser(authenticatedUser);
      localStorage.setItem('authUser', JSON.stringify(authenticatedUser));
      localStorage.setItem('authToken', simpleToken);
      
      console.log('Login successful:', authenticatedUser);
      return true;

    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Helper function to map role values
  const mapUserRole = (roleValue: string): 'admin' | 'nurse' | 'parent' | 'student' => {
    if (!roleValue) return 'student';
    
    const role = roleValue.toLowerCase();
    
    if (role.includes('admin')) return 'admin';
    if (role.includes('nurse') || role.includes('medical')) return 'nurse';
    if (role.includes('parent') || role.includes('guardian')) return 'parent';
    
    return 'student';
  };

  // API logout function
  const logout = async () => {
    setLoading(true);
    
    try {
      console.log('Logging out user');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('authUser');
      localStorage.removeItem('authToken');
      setLoading(false);
      console.log('User logged out');
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
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

// Helper function to test API and show available users
export const testMockarooAPI = async () => {
  try {
    console.log('🔍 Testing Mockaroo API...');
    console.log('URL:', API_BASE_URL);
    
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Success!');
      console.log('Data type:', Array.isArray(data) ? `Array with ${data.length} items` : typeof data);
      
      if (Array.isArray(data) && data.length > 0) {
        console.log('📋 First user fields:', Object.keys(data[0]));
        console.log('👤 Sample data:', data[0]);
        
        // Show available login identifiers
        const identifiers = data.slice(0, 10).map((user: any) => 
          user.username || user.email || user.login || user.user_name || user.id || 'no-id'
        );
        console.log('🆔 Available usernames/identifiers:', identifiers);
        
        return data;
      }
    } else {
      console.error('❌ API Error:', response.status, response.statusText);
    }
    
    return null;
  } catch (error) {
    console.error('❌ Network Error:', error);
    return null;
  }
};

// Helper function to get all available usernames for testing
export const getTestUsernames = async (): Promise<string[]> => {
  try {
    const response = await fetch(API_BASE_URL);
    if (response.ok) {
      const users = await response.json();
      if (Array.isArray(users)) {
        return users.map((user: any) => 
          user.username || user.email || user.login || user.user_name || String(user.id)
        ).filter(Boolean);
      }
    }
    return [];
  } catch (error) {
    console.error('Error fetching test usernames:', error);
    return [];
  }
};

// API Helper functions
export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('authToken');
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  // Don't add endpoint to API_BASE_URL since it's already a complete URL
  const response = await fetch(API_BASE_URL, config);
  
  if (response.status === 401) {
    console.log('Token expired or invalid');
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  }
  
  return response;
};