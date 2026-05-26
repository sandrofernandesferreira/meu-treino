import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ao abrir o app, verifica se já tem usuário salvo
  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('@MeuTreino:user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.log('Erro ao carregar usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (userData) => {
    try {
      await AsyncStorage.setItem('@MeuTreino:user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.log('Erro ao salvar usuário:', error);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('@MeuTreino:user');
      setUser(null);
    } catch (error) {
      console.log('Erro ao deslogar:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
