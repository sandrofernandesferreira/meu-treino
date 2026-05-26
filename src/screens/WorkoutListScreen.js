import React, { useContext, useFocusEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { WorkoutContext } from '../context/WorkoutContext';

export default function WorkoutListScreen({ navigation }) {
  const { workouts, loadWorkouts, deleteWorkout } = useContext(WorkoutContext);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadWorkouts();
    }, [])
  );

  const handleDelete = (id, name) => {
    Alert.alert('Deletar', `Excluir "${name}"?`, [
      { text: 'Cancelar', onPress: () => {} },
      {
        text: 'Deletar',
        onPress: () => {
          deleteWorkout(id);
        },
        style: 'destructive',
      },
    ]);
  };

  const renderWorkout = ({ item }) => (
    <View style={styles.workoutCard}>
      <View style={styles.workoutHeader}>
        <View>
          <Text style={styles.workoutTitle}>{item.name}</Text>
          <Text style={styles.workoutDate}>{item.date}</Text>
        </View>
        <Text style={styles.exerciseCount}>{item.exercises.length} exercicios</Text>
      </View>

      <View style={styles.workoutActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('WorkoutDetail', { id: item.id })}
        >
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id, item.name)}
        >
          <Text style={styles.deleteButtonText}>Deletar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Treinos</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('WorkoutDetail')}
        >
          <Text style={styles.addButtonText}>+ Novo</Text>
        </TouchableOpacity>
      </View>

      {workouts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Nenhum treino criado</Text>
        </View>
      ) : (
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id}
          renderItem={renderWorkout}
          scrollEnabled={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D1A',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  addButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#0D0D1A',
    fontWeight: 'bold',
    fontSize: 14,
  },
  workoutCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  workoutDate: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
  exerciseCount: {
    fontSize: 12,
    color: '#FF6B35',
    backgroundColor: '#0D0D1A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  workoutActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#FF6B35',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#0D0D1A',
    fontWeight: 'bold',
    fontSize: 12,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#8B0000',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
