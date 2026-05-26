import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TrainingPlanContext } from '../context/TrainingPlanContext';

export default function TrainingDayDetailScreen({ route, navigation }) {
  const { workoutId } = route.params;
  const { workouts, addExercise, updateExercise, deleteExercise } =
    useContext(TrainingPlanContext);

  const workout = workouts.find(w => w.id === workoutId);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [exerciseData, setExerciseData] = useState({
    name: '',
    series: '3',
    reps: '10',
    weight: '50',
  });
  const [loading, setLoading] = useState(false);

  if (!workout) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Treino não encontrado</Text>
      </View>
    );
  }

  const openModal = (exercise = null) => {
    if (exercise) {
      setEditingExercise(exercise);
      setExerciseData({
        name: exercise.name,
        series: exercise.series.toString(),
        reps: exercise.reps.toString(),
        weight: exercise.weight.toString(),
      });
    } else {
      setEditingExercise(null);
      setExerciseData({
        name: '',
        series: '3',
        reps: '10',
        weight: '50',
      });
    }
    setModalVisible(true);
  };

  const handleSaveExercise = async () => {
    try {
      if (!exerciseData.name.trim()) {
        Alert.alert('Erro', 'Digite o nome do exercício');
        return;
      }

      setLoading(true);

      if (editingExercise) {
        await updateExercise(workoutId, editingExercise.id, {
          name: exerciseData.name,
          series: parseInt(exerciseData.series) || 3,
          reps: parseInt(exerciseData.reps) || 10,
          weight: parseFloat(exerciseData.weight) || 0,
        });
        Alert.alert('Sucesso', 'Exercício atualizado!');
      } else {
        await addExercise(workoutId, {
          name: exerciseData.name,
          series: parseInt(exerciseData.series) || 3,
          reps: parseInt(exerciseData.reps) || 10,
          weight: parseFloat(exerciseData.weight) || 0,
          imageUrl: '',
        });
        Alert.alert('Sucesso', 'Exercício adicionado!');
      }

      setModalVisible(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o exercício');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExercise = (exerciseId) => {
    Alert.alert(
      'Deletar Exercício',
      'Tem certeza?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          onPress: async () => {
            try {
              await deleteExercise(workoutId, exerciseId);
              Alert.alert('Sucesso', 'Exercício deletado!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível deletar');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#FF6B35" />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.letterBadge}>{workout.letter}</Text>
          <View style={styles.headerInfo}>
            <Text style={styles.title}>{workout.name}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => openModal()}
          style={styles.addButton}
        >
          <Ionicons name="add-circle" size={32} color="#FF6B35" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Notes */}
        {workout.notes && (
          <View style={styles.notesCard}>
            <Text style={styles.notesTitle}>Notas</Text>
            <Text style={styles.notesText}>{workout.notes}</Text>
          </View>
        )}

        {/* Exercises List */}
        {workout.exercises.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="add-circle-outline" size={64} color="#666" />
            <Text style={styles.emptyText}>Nenhum exercício adicionado</Text>
            <TouchableOpacity
              onPress={() => openModal()}
              style={styles.emptyButton}
            >
              <Text style={styles.emptyButtonText}>+ Adicionar Exercício</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.exercisesContainer}>
            {workout.exercises.map((exercise, index) => (
              <View key={exercise.id} style={styles.exerciseCard}>
                <View style={styles.exerciseNumber}>
                  <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                </View>

                <TouchableOpacity
                  style={styles.exerciseInfo}
                  onPress={() => openModal(exercise)}
                >
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <View style={styles.exerciseStats}>
                    <View style={styles.stat}>
                      <Text style={styles.statLabel}>Séries</Text>
                      <Text style={styles.statValue}>
                        {exercise.series}
                      </Text>
                    </View>
                    <View style={styles.stat}>
                      <Text style={styles.statLabel}>Reps</Text>
                      <Text style={styles.statValue}>{exercise.reps}</Text>
                    </View>
                    <View style={styles.stat}>
                      <Text style={styles.statLabel}>Peso</Text>
                      <Text style={styles.statValue}>
                        {exercise.weight}kg
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

                <View style={styles.exerciseActions}>
                  <TouchableOpacity
                    onPress={() => openModal(exercise)}
                    style={styles.editButton}
                  >
                    <Ionicons name="pencil" size={18} color="#2196F3" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteExercise(exercise.id)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash" size={18} color="#F44336" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Exercise Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingExercise ? 'Editar Exercício' : 'Novo Exercício'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color="#FF6B35" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Exercise Name */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Nome</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Ex: Supino Reto"
                  placeholderTextColor="#666"
                  value={exerciseData.name}
                  onChangeText={(text) =>
                    setExerciseData({ ...exerciseData, name: text })
                  }
                />
              </View>

              {/* Series */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Séries</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="3"
                  placeholderTextColor="#666"
                  value={exerciseData.series}
                  onChangeText={(text) =>
                    setExerciseData({ ...exerciseData, series: text })
                  }
                  keyboardType="numeric"
                />
              </View>

              {/* Reps */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Repetições</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="10"
                  placeholderTextColor="#666"
                  value={exerciseData.reps}
                  onChangeText={(text) =>
                    setExerciseData({ ...exerciseData, reps: text })
                  }
                  keyboardType="numeric"
                />
              </View>

              {/* Weight */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Peso (kg)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="50"
                  placeholderTextColor="#666"
                  value={exerciseData.weight}
                  onChangeText={(text) =>
                    setExerciseData({ ...exerciseData, weight: text })
                  }
                  keyboardType="decimal-pad"
                />
              </View>

              {/* Image placeholder */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Imagem</Text>
                <TouchableOpacity style={styles.imageButton}>
                  <Ionicons name="image" size={24} color="#FF6B35" />
                  <Text style={styles.imageButtonText}>
                    Buscar Imagem (Em breve)
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveExercise}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#0D0D1A" />
                ) : (
                  <Text style={styles.saveButtonText}>Salvar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D1A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomColor: '#FF6B35',
    borderBottomWidth: 2,
  },
  headerTitle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  letterBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B35',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  addButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  notesCard: {
    backgroundColor: '#1A1A2E',
    borderLeftColor: '#FF6B35',
    borderLeftWidth: 4,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  notesTitle: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  notesText: {
    fontSize: 13,
    color: '#FFFFFF',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0D0D1A',
  },
  exercisesContainer: {
    gap: 12,
  },
  exerciseCard: {
    backgroundColor: '#1A1A2E',
    borderLeftColor: '#FF6B35',
    borderLeftWidth: 4,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  exerciseNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  exerciseNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D0D1A',
  },
  exerciseInfo: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  exerciseStats: {
    flexDirection: 'row',
    gap: 12,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: '#999',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  exerciseActions: {
    flexDirection: 'row',
    paddingRight: 12,
    gap: 8,
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1A1A2E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomColor: '#FF6B35',
    borderBottomWidth: 2,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  formInput: {
    backgroundColor: '#0D0D1A',
    borderColor: '#FF6B35',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 14,
  },
  imageButton: {
    backgroundColor: '#0D0D1A',
    borderColor: '#FF6B35',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 24,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  imageButtonText: {
    color: '#FF6B35',
    fontSize: 12,
    fontWeight: '600',
  },
  modalFooter: {
    paddingHorizontal: 20,
  },
  saveButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0D0D1A',
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B35',
    textAlign: 'center',
    marginTop: 20,
  },
});
