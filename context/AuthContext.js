// context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const register = async (name, email, password) => {
    try {
      const response = await API.post('/register', { name, email, password });
      
      // Extraemos los datos de la respuesta
      const { token, user } = response.data.data;
      
      await AsyncStorage.setItem('token', token);
      setUser(user);
      return true;
    } catch (error) {
      console.error('Register error:', error);
      throw new Error(error.response?.data?.message || 'Error al registrarse');
    }
  };

  const login = async (email, password) => {
    try {
      const response = await API.post('/login', { email, password });
      const { token, user } = response.data.data;

      await AsyncStorage.setItem('token', token);
      setUser(user);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ register,user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
