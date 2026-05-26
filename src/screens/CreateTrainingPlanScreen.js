import React, { useState } from 'react';
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

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Segunda', short: 'Seg' },
  { key: 'tuesday', label: 'Terça', short: 'Ter' },
  { key: 'wednesday', label: 'Quarta', short: 'Qua' },
  { key: 'thursday', label: 'Quinta', short: 'Qui' },
  { key: 'friday', label: 'Sexta', short: 'Sex' },
  { key: 'saturday', label: 'Sábado', short: 'Sab' },
  { key: 'sunday', label: 'Domingo', short: 'Dom' },
];

const DIVISIONS = [
  { label: '2 Treinos (A, B)', value: 'AB', letters: ['A', 'B'] },
  { label: '3 Treinos (A, B, C)', value: 'ABC', letters: ['A', 'B', 'C'] },
  { label: '4 Treinos (A, B, C, D)', value: 'ABCD', letters: ['A', 'B', 'C', 'D'] },
  { label: '5 Treinos (A, B, C, D, E)', value: 'ABCDE', letters: ['A', 'B', 'C', 'D', 'E'] },
];

export default function CreateTrainingPlanScreen({ navigation }) {
  const { createPlan } = React.useContext(TrainingPlanContext);

  const [planName, setPlanName] = useState('Meu Plano');
  const [selectedDivision, setSelectedDivision] = useState(DIVISIONS[2]); // ABC padrão
  const [selectedDays, setSelectedDays] = useState({
    monday: 'A',
    tuesday: 'B',
    wednesday: null,
    thursday: 'C',
    friday: 'A',
    saturday: 'B',
    sunday: null,
  });
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0]
  );
  const [divisionModalVisible, setDivisionModalVisible] = useState(false);
  const [dayModalVisible, setDayModalVisible] = useState(false);
  const [selectedDayForModal, setSelectedDayForModal] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDaySelect = (dayKey, letter) => {
    setSelectedDays({
      ...selectedDays,
      [dayKey]: letter === selectedDays[dayKey] ? null : letter,
    });
    setDayModalVisible(false);
  };

  const handleCreatePlan = async () => {
    try {
      if (!planName.trim()) {
        Alert.alert('Erro', 'Digite um nome para o plano');
        return;
      }

      const trainingDays = Object.values(selectedDays).filter(d => d !== null);
      if (trainingDays.length === 0) {
        Alert.alert('Erro', 'Selecione pelo menos um dia de treino');
        return;
      }

      setLoading(true);

      const planData = {
        name: planName,
        division: selectedDivision.value,
        startDate,
        endDate,
        trainingSchedule: selectedDays,
        trainingLetters: selectedDivision.letters,
      };

      await createPlan(planData);
      Alert.alert('Sucesso', 'Plano criado com sucesso!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar o plano');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getTrainingLettersForDay = (dayKey) => {
    const dayTrainings = [];
    selectedDivision.letters.forEach(letter => {
      const isSelected = selectedDays[dayKey] === letter;
      dayTrainings.push({ letter, isSelected });
    });
    return dayTrainings;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#FF6B35" />
        </TouchableOpacity>
        <Text style={styles.title}>Novo Plano</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Plan Name */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nome do Plano</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o nome"
            placeholderTextColor="#666"
            value={planName}
            onChangeText={setPlanName}
          />
        </View>

        {/* Division Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Divisão de Treino</Text>
          <TouchableOpacity
            style={styles.selectorButton}
            onPress={() => setDivisionModalVisible(true)}
          >
            <Text style={styles.selectorButtonText}>
              {selectedDivision.label}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#FF6B35" />
          </TouchableOpacity>
        </View>

        {/* Days Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dias de Treino</Text>
          <View style={styles.daysGrid}>
            {DAYS_OF_WEEK.map((day) => (
              <TouchableOpacity
                key={day.key}
                style={[
                  styles.dayButton,
                  selectedDays[day.key] && styles.dayButtonActive,
                ]}
                onPress={() => {
                  setSelectedDayForModal(day);
                  setDayModalVisible(true);
                }}
              >
                <Text style={styles.dayButtonLabel}>{day.short}</Text>
                <Text style={styles.dayButtonValue}>
                  {selectedDays[day.key] || '-'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Date Range */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Período</Text>
          <View style={styles.dateContainer}>
            <View style={styles.dateBox}>
              <Text style={styles.dateLabel}>Início:</Text>
              <TextInput
                style={styles.dateInput}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#666"
                value={startDate}
                onChangeText={setStartDate}
              />
            </View>
            <View style={styles.dateBox}>
              <Text style={styles.dateLabel}>Fim:</Text>
              <TextInput
                style={styles.dateInput}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#666"
                value={endDate}
                onChangeText={setEndDate}
              />
            </View>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumo</Text>
          <Text style={styles.summaryText}>
            Plano: <Text style={styles.summaryBold}>{planName}</Text>
          </Text>
          <Text style={styles.summaryText}>
            Divisão:{' '}
            <Text style={styles.summaryBold}>
              {selectedDivision.value}
            </Text>
          </Text>
          <Text style={styles.summaryText}>
            Dias por semana:{' '}
            <Text style={styles.summaryBold}>
              {Object.values(selectedDays).filter(d => d !== null).length}
            </Text>
          </Text>
          <Text style={styles.summaryText}>
            Duração:{' '}
            <Text style={styles.summaryBold}>
              {startDate} até {endDate}
            </Text>
          </Text>
        </View>
      </ScrollView>

      {/* Create Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreatePlan}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#0D0D1A" size="small" />
          ) : (
            <Text style={styles.createButtonText}>Criar Plano</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Division Modal */}
      <Modal
        visible={divisionModalVisible}
        transparent
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Divisão</Text>
              <TouchableOpacity
                onPress={() => setDivisionModalVisible(false)}
              >
                <Ionicons name="close" size={28} color="#FF6B35" />
              </TouchableOpacity>
            </View>

            {DIVISIONS.map((division) => (
              <TouchableOpacity
                key={division.value}
                style={[
                  styles.modalOption,
                  selectedDivision.value === division.value &&
                    styles.modalOptionActive,
                ]}
                onPress={() => {
                  setSelectedDivision(division);
                  setDivisionModalVisible(false);
                }}
              >
                <Text style={styles.modalOptionText}>{division.label}</Text>
                {selectedDivision.value === division.value && (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color="#FF6B35"
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Day Modal */}
      <Modal visible={dayModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedDayForModal?.label}
              </Text>
              <TouchableOpacity onPress={() => setDayModalVisible(false)}>
                <Ionicons name="close" size={28} color="#FF6B35" />
              </TouchableOpacity>
            </View>

            {/* Off option */}
            <TouchableOpacity
              style={[
                styles.modalOption,
                !selectedDays[selectedDayForModal?.key] &&
                  styles.modalOptionActive,
              ]}
              onPress={() =>
                handleDaySelect(selectedDayForModal?.key, null)
              }
            >
              <Text style={styles.modalOptionText}>Dia de descanso (OFF)</Text>
              {!selectedDays[selectedDayForModal?.key] && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color="#FF6B35"
                />
              )}
            </TouchableOpacity>

            {/* Training letters */}
            {selectedDivision.letters.map((letter) => (
              <TouchableOpacity
                key={letter}
                style={[
                  styles.modalOption,
                  selectedDays[selectedDayForModal?.key] === letter &&
                    styles.modalOptionActive,
                ]}
                onPress={() =>
                  handleDaySelect(selectedDayForModal?.key, letter)
                }
              >
                <Text style={styles.modalOptionText}>Treino {letter}</Text>
                {selectedDays[selectedDayForModal?.key] === letter && (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color="#FF6B35"
                  />
                )}
              </TouchableOpacity>
            ))}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#1A1A2E',
    borderColor: '#FF6B35',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 14,
  },
  selectorButton: {
    backgroundColor: '#1A1A2E',
    borderColor: '#FF6B35',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectorButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  dayButton: {
    width: '23%',
    backgroundColor: '#1A1A2E',
    borderColor: '#FF6B35',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  dayButtonActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  dayButtonLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  dayButtonValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  dayButtonActive: {
    backgroundColor: '#FF6B35',
  },
  dayButtonActive: {
    backgroundColor: '#FF6B35',
  },
  dayButtonActive: {
    backgroundColor: '#FF6B35',
  },
  dayButtonActive: {
    backgroundColor: '#FF6B35',
  },
  dateContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dateBox: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  dateInput: {
    backgroundColor: '#1A1A2E',
    borderColor: '#FF6B35',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 12,
  },
  summaryCard: {
    backgroundColor: '#1A1A2E',
    borderLeftColor: '#FF6B35',
    borderLeftWidth: 4,
    borderRadius: 8,
    padding: 16,
    marginTop: 10,
  },
  summaryTitle: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginVertical: 4,
  },
  summaryBold: {
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  footer: {
    padding: 20,
    paddingBottom: 25,
  },
  createButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D0D1A',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1A1A2E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
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
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  modalOptionActive: {
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
  },
  modalOptionText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});
