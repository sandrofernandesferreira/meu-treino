import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TrainingPlanProvider } from './src/context/TrainingPlanContext';
import { initializeSeedData } from './src/data/seedData';

import HomeScreen from './src/screens/HomeScreen';
import TrainingPlanListScreen from './src/screens/TrainingPlanListScreen';
import CreateTrainingPlanScreen from './src/screens/CreateTrainingPlanScreen';
import TrainingDayDetailScreen from './src/screens/TrainingDayDetailScreen';
import ExerciseDetailScreen from './src/screens/ExerciseDetailScreen';
import CalendarViewScreen from './src/screens/CalendarViewScreen';
import HistoryScreen from './src/screens/HistoryScreen';

function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
      />
      <Stack.Screen
        name="TrainingDayDetail"
        component={TrainingDayDetailScreen}
      />
      <Stack.Screen
        name="ExerciseDetail"
        component={ExerciseDetailScreen}
      />
    </Stack.Navigator>
  );
}

function PlansStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="PlansList"
        component={TrainingPlanListScreen}
      />
      <Stack.Screen
        name="CreatePlan"
        component={CreateTrainingPlanScreen}
      />
    </Stack.Navigator>
  );
}

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function SplashScreen() {
  return (
    <View style={styles.splashContainer}>
      <Text style={styles.splashTitle}>Meu Treino</Text>
      <ActivityIndicator size="large" color="#FF6B35" style={{ marginTop: 20 }} />
    </View>
  );
}

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: '#0D0D1A',
          borderBottomColor: '#FF6B35',
          borderBottomWidth: 1,
        },
        headerTintColor: '#FF6B35',
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#FFFFFF',
        },
        tabBarStyle: {
          backgroundColor: '#0D0D1A',
          borderTopColor: '#FF6B35',
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: '#FF6B35',
        tabBarInactiveTintColor: '#666',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Plans') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Calendar') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{ title: 'Hoje' }}
      />
      <Tab.Screen
        name="Plans"
        component={PlansStackNavigator}
        options={{ title: 'Meus Planos' }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarViewScreen}
        options={{ title: 'Calendário' }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: 'Histórico' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setLoading(true);
      setError(null);
      await initializeSeedData();
    } catch (err) {
      console.error('Erro ao inicializar app:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erro: {error}</Text>
      </View>
    );
  }

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <TrainingPlanProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#0D0D1A' },
          }}
        >
          <Stack.Screen name="MainApp" component={HomeTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </TrainingPlanProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#0D0D1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#0D0D1A',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#FF6B35',
    fontSize: 16,
    textAlign: 'center',
  },
});
