import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TrainingPlanContext } from '../context/TrainingPlanContext';

export default function HomeScreen({ navigation }) {
  const {
    currentPlan,
    loading,
    getCurrentDayWorkout,
    markSessionCompleted,
  } = useContext(TrainingPlanContext);
  const [todayWorkout, setTodayWorkout] = useState(null);

  useEffect(() => {
    const workout = getCurrentDayWorkout();
    setTodayWorkout(workout);
  }, [currentPlan]);

  const handleEditWorkout = () => {
    if (todayWorkout) {
      navigation.navigate('TrainingDayDetail', {
        workoutId: todayWorkout.id,
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  if (!currentPlan) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Meu Treino</Text>
        <Text style={styles.subtitle}>Nenhum plano ativo</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Plans')}
        >
          <Text style={styles.buttonText}>Criar Plano de Treino</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const today = new Date().toLocaleDateString('pt-BR');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.date}>{today}</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Plan Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Plano Ativo</Text>
          <Text style={styles.planName}>{currentPlan.name}</Text>
          <View style={styles.planInfo}>
            <Text style={styles.planDate}>
              Início: {currentPlan.startDate}
            </Text>
            <Text style={styles.planDate}>
              Fim: {currentPlan.endDate}
            </Text>
          </View>
        </View>

        {/* Today Workout */}
        {todayWorkout ? (
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>Treino de Hoje</Text>
              <TouchableOpacity
                onPress={handleEditWorkout}
                style={styles.editButton}
              >
                <Ionicons name="pencil" size={18} color="#FF6B35" />
              </TouchableOpacity>
            </View>
            <View style={styles.workoutHeader}>
              <View style={styles.letterBadge}>
                <Text style={styles.letterText}>{todayWorkout.letter}</Text>
              </View>
              <Text style={styles.workoutName}>{todayWorkout.name}</Text>
            </View>

            {/* Exercises */}
            <View style={styles.exercisesContainer}>
              <Text style={styles.exercisesTitle}>Exercicios:</Text>
              {todayWorkout.exercises.map((exercise) => (
                <TouchableOpacity
                  key={exercise.id}
                  style={styles.exerciseItem}
                  activeOpacity={0.7}
                  onPress={() =>
                    navigation.navigate('ExerciseDetail', { exercise })
                  }
                >
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseDetails}>
                    {exercise.series}x{exercise.reps} - {exercise.weight}kg
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Notes */}
            {todayWorkout.notes && (
              <View style={styles.notesContainer}>
                <Text style={styles.notesTitle}>Notas:</Text>
                <Text style={styles.notesText}>{todayWorkout.notes}</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Treino de Hoje</Text>
            <Text style={styles.offDay}>Dia de descanso</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Actions */}
      {todayWorkout && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.completeButton]}
            onPress={async () => {
              try {
                await markSessionCompleted(today, true);
                Alert.alert('Sucesso!', 'Treino marcado como feito! 🎉\n\nProximal treino amanhã.');
              } catch (error) {
                Alert.alert('Erro', 'Não foi possível marcar o treino');
              }
            }}
          >
            <Text style={styles.actionButtonText}>✓ Marcar como Feito</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.skipButton]}
            onPress={async () => {
              try {
                await markSessionCompleted(today, false);
                Alert.alert('Registrado', 'Dia pulado registrado no histórico.');
              } catch (error) {
                Alert.alert('Erro', 'Não foi possível registrar');
              }
            }}
          >
            <Text style={styles.actionButtonText}>Pulei Hoje</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D1A',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomColor: '#FF6B35',
    borderBottomWidth: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: '#999',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  card: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftColor: '#FF6B35',
    borderLeftWidth: 4,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  editButton: {
    padding: 6,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  planInfo: {
    backgroundColor: '#0D0D1A',
    borderRadius: 8,
    padding: 10,
  },
  planDate: {
    fontSize: 12,
    color: '#999',
    marginVertical: 4,
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  letterBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  letterText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  exercisesContainer: {
    marginBottom: 15,
  },
  exercisesTitle: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  exerciseItem: {
    backgroundColor: '#0D0D1A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftColor: '#FF6B35',
    borderLeftWidth: 3,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  exerciseDetails: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: 'bold',
  },
  notesContainer: {
    backgroundColor: '#0D0D1A',
    borderRadius: 8,
    padding: 12,
    borderLeftColor: '#FF6B35',
    borderLeftWidth: 3,
  },
  notesTitle: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  notesText: {
    fontSize: 12,
    color: '#FFFFFF',
    lineHeight: 18,
  },
  offDay: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 25,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: '#FF6B35',
  },
  skipButton: {
    backgroundColor: '#FF6B35',
    opacity: 0.6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0D0D1A',
  },
  button: {
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D0D1A',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});
