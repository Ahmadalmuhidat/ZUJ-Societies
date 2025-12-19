import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosClient from '../config/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  const getUserInformation = async () => {
    try {
      const token = getToken();
      if (!token) {
        setUser(null);
        return;
      }

      const response = await AxiosClient.get('/users/info');

      if (response.status === 200) {
        setUser(response.data.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      setUser(null);
    }
  };

  const login = async (email, password, rememberMe) => {
    setIsLoading(true);
    try {
      const response = await AxiosClient.get('/auth/login', {
        params: {
          email: email,
          password: password,
        },
      });

      if (response.status === 200) {
        const token = response.data.data;

        if (rememberMe) {
          localStorage.setItem('token', token);
        }
        else {
          sessionStorage.setItem('token', token);
        }

        await getUserInformation();
        navigate('/');
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  const refreshUser = async () => {
    setIsLoading(true);
    await getUserInformation();
    setIsLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      const token = getToken();
      if (token) {
        await getUserInformation();
      }
      setIsLoading(false);
    };
    init();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
