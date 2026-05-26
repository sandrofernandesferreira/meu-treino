import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    try {
      setLoading(true);
      if (email.length > 0 && password.length >= 4) {
        await AsyncStorage.setItem('userToken', JSON.stringify({
          email,
          loginTime: new Date().toISOString(),
        }));
        onLoginSuccess();
      } else {
        Alert.alert('Erro', 'Email invalido ou senha muito curta');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao fazer login');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Meu Treino</Text>
        <Text style={styles.subtitle}>App de Musculacao</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Senha (minimo 4 caracteres)"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.demoSection}>
          <Text style={styles.demoText}>Demo - Use qualquer email e senha com 4+ caracteres</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D1A',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 40,
  },
  form: {
    width: '100%',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#1A1A2E',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 12,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  button: {
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#0D0D1A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  demoSection: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#1A1A2E',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  demoText: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
  },
});
