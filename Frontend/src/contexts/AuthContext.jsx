import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const admin = localStorage.getItem('admin');
    
    console.log('Initial auth check:', { token, admin });
    
    if (token) {
      // Set authentication state
      setIsAuthenticated(true);
      setUser({ token, admin: admin === 'true' });
      console.log('User authenticated on load:', { token, admin: admin === 'true' });
    } else {
      // Ensure clean state if no token
      setIsAuthenticated(false);
      setUser(null);
      console.log('No token found, user not authenticated');
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axios.post('http://localhost:3000/user/login', credentials);
      console.log('Login response:', response.data);
      
      if (response.data.success) {
        const { authToken, admin } = response.data;
        
        // Set localStorage first
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('admin', admin || false);
        
        // Update state immediately
        setUser({ token: authToken, admin: admin || false });
        setIsAuthenticated(true);
        
        console.log('Login successful:', {
          authToken,
          admin,
          isAuthenticated: true
        });
        
        return { success: true };
      } else {
        return { success: false, error: response.data.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('admin');
    setUser(null);
    setIsAuthenticated(false);
  };

  const isAdmin = () => {
    return localStorage.getItem('admin') === 'true';
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}; 