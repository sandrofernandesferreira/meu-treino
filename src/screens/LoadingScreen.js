import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoadingScreen() {
  return (
    <LinearGradient
      colors={['#0D0D1A', '#1A1A2E']}
      style={styles.container}
    >
      <Text style={styles.logo}>MEU TREINO</Text>
      <ActivityIndicator color="#FF6B00" size="large" style={styles.spinner} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FF6B00',
    letterSpacing: 6,
    marginBottom: 30,
  },
  spinner: {
    marginTop: 10,
  },
});
