import React, { useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutContext } from '../context/WorkoutContext';

export default function DashboardScreen({ navigation }) {
  const { getTodayWorkout, loadWorkouts } = useContext(WorkoutContext);
  const todayWorkout = getTodayWorkout();

  useEffect(() => {
    const loadData = async () => {
      await loadWorkouts();
    };
    loadData();
  }, []);

  const handleLogout = async () => {
    Alert.alert('Logout', 'Deseja sair da aplicacao?', [
      { text: 'Cancelar', onPress: () => {} },
      {
        text: 'Sair',
        onPress: async () => {
          await AsyncStorage.removeItem('userToken');
          // Trigger re-render by restarting the app
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Treino de Hoje</Text>
        {todayWorkout ? (
          <>
            <Text style={styles.workoutName}>{todayWorkout.name}</Text>
            <Text style={styles.workoutDate}>{todayWorkout.date}</Text>

            <View style={styles.exercisesContainer}>
              {todayWorkout.exercises.map((exercise, index) => (
                <View key={index} style={styles.exerciseItem}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseDetails}>
                    {exercise.series}x{exercise.reps} - {exercise.weight}kg
                  </Text>
                </View>
              ))}
            </View>

            {todayWorkout.notes && (
              <View style={styles.notesBox}>
                <Text style={styles.notesTitle}>Notas:</Text>
                <Text style={styles.notesText}>{todayWorkout.notes}</Text>
              </View>
            )}
          </>
        ) : (
          <Text style={styles.noWorkoutText}>Nenhum treino agendado para hoje</Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate('WorkoutList')}
      >
        <Text style={styles.primaryButtonText}>Ver Todos os Treinos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('WorkoutDetail')}
      >
        <Text style={styles.secondaryButtonText}>Novo Treino</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D1A',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  logoutBtn: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  logoutText: {
    color: '#0D0D1A',
    fontWeight: 'bold',
    fontSize: 12,
  },
  card: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 12,
  },
  workoutName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  workoutDate: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  exercisesContainer: {
    marginBottom: 16,
  },
  exerciseItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  exerciseDetails: {
    fontSize: 13,
    color: '#FF6B35',
    marginTop: 2,
  },
  notesBox: {
    backgroundColor: '#0D0D1A',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B35',
  },
  notesTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 6,
  },
  notesText: {
    fontSize: 13,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  noWorkoutText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  primaryButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#0D0D1A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#1A1A2E',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF6B35',
    marginBottom: 30,
  },
  secondaryButtonText: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
