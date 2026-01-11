import { useState, useEffect } from 'react';
import api from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data);
        } catch (error) {
          localStorage.removeItem('access_token');
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await api.post('/auth/login', formData);
    localStorage.setItem('access_token', response.data.access_token);
    const userResponse = await api.get('/auth/me');
    setUser(userResponse.data);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  return { user, loading, login, logout };
};