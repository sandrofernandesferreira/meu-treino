import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { WorkoutContext } from '../context/WorkoutContext';

export default function WorkoutDetailScreen({ route, navigation }) {
  const { workouts, addWorkout, updateWorkout } = useContext(WorkoutContext);
  const workoutId = route.params?.id;

  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const today = new Date().toLocaleDateString('pt-BR');
    setDate(today);

    if (workoutId) {
      const workout = workouts.find(w => w.id === workoutId);
      if (workout) {
        setName(workout.name);
        setDate(workout.date);
        setNotes(workout.notes || '');
        setExercises(workout.exercises || []);
      }
    }
  }, [workoutId]);

  const addExercise = () => {
    setExercises([
      ...exercises,
      { name: '', series: 3, reps: 10, weight: 0 },
    ]);
  };

  const updateExercise = (index, field, value) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const removeExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Digite o nome do treino');
      return;
    }

    if (exercises.length === 0) {
      Alert.alert('Erro', 'Adicione pelo menos um exercicio');
      return;
    }

    const workout = {
      name,
      date,
      notes,
      exercises: exercises.filter(e => e.name.trim()),
    };

    if (workoutId) {
      updateWorkout(workoutId, workout);
      Alert.alert('Sucesso', 'Treino atualizado!');
    } else {
      addWorkout(workout);
      Alert.alert('Sucesso', 'Treino criado!');
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Nome do Treino</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Peito e Triceps"
          placeholderTextColor="#666"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Data</Text>
        <TextInput
          style={styles.input}
          placeholder="DD/MM/YYYY"
          value={date}
          onChangeText={setDate}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.label}>Exercicios</Text>
          <TouchableOpacity style={styles.addExerciseBtn} onPress={addExercise}>
            <Text style={styles.addExerciseBtnText}>+ Adicionar</Text>
          </TouchableOpacity>
        </View>

        {exercises.map((exercise, index) => (
          <View key={index} style={styles.exerciseBox}>
            <TextInput
              style={styles.input}
              placeholder="Nome do exercicio"
              placeholderTextColor="#666"
              value={exercise.name}
              onChangeText={(val) => updateExercise(index, 'name', val)}
            />

            <View style={styles.exerciseRow}>
              <View style={styles.exerciseField}>
                <Text style={styles.fieldLabel}>Series</Text>
                <TextInput
                  style={styles.numberInput}
                  placeholder="3"
                  placeholderTextColor="#666"
                  value={exercise.series.toString()}
                  onChangeText={(val) => updateExercise(index, 'series', parseInt(val) || 0)}
                  keyboardType="number-pad"
                />
              </View>

              <View style={styles.exerciseField}>
                <Text style={styles.fieldLabel}>Reps</Text>
                <TextInput
                  style={styles.numberInput}
                  placeholder="10"
                  placeholderTextColor="#666"
                  value={exercise.reps.toString()}
                  onChangeText={(val) => updateExercise(index, 'reps', parseInt(val) || 0)}
                  keyboardType="number-pad"
                />
              </View>

              <View style={styles.exerciseField}>
                <Text style={styles.fieldLabel}>Peso (kg)</Text>
                <TextInput
                  style={styles.numberInput}
                  placeholder="0"
                  placeholderTextColor="#666"
                  value={exercise.weight.toString()}
                  onChangeText={(val) => updateExercise(index, 'weight', parseInt(val) || 0)}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => removeExercise(index)}
            >
              <Text style={styles.removeBtnText}>Remover</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Notas (Opcional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Dicas, observacoes..."
          placeholderTextColor="#666"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Salvar Treino</Text>
      </TouchableOpacity>

      <View style={{ height: 30 }} />
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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1A1A2E',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  textArea: {
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  addExerciseBtn: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addExerciseBtnText: {
    color: '#0D0D1A',
    fontWeight: 'bold',
    fontSize: 12,
  },
  exerciseBox: {
    backgroundColor: '#1A1A2E',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B35',
  },
  exerciseRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 10,
  },
  exerciseField: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 4,
  },
  numberInput: {
    backgroundColor: '#0D0D1A',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 8,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FF6B35',
    textAlign: 'center',
  },
  removeBtn: {
    backgroundColor: '#8B0000',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  removeBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  saveButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#0D0D1A',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
