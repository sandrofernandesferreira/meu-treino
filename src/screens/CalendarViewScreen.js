import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TrainingPlanContext } from '../context/TrainingPlanContext';

const DAYS_OF_WEEK = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export default function CalendarViewScreen() {
  const { currentPlan } = useContext(TrainingPlanContext);
  const [currentDate, setCurrentDate] = useState(new Date());

  const getTrainingForDate = (date) => {
    if (!currentPlan) return null;

    const dayName = DAYS_OF_WEEK[date.getDay()].toLowerCase();
    const dayMap = {
      'dom': 'sunday',
      'seg': 'monday',
      'ter': 'tuesday',
      'qua': 'wednesday',
      'qui': 'thursday',
      'sex': 'friday',
      'sab': 'saturday',
    };

    const fullDayName = dayMap[dayName];
    return currentPlan.trainingSchedule[fullDayName] || null;
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <View key={`empty-${i}`} style={styles.dayCell} />
      );
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const training = getTrainingForDate(date);
      const isToday =
        date.toDateString() === new Date().toDateString();

      days.push(
        <View
          key={`day-${day}`}
          style={[
            styles.dayCell,
            isToday && styles.todayCell,
          ]}
        >
          <Text style={[styles.dayNumber, isToday && styles.todayNumber]}>
            {day}
          </Text>
          {training ? (
            <Text style={[
              styles.trainingLetter,
              training === 'off' ? styles.offDay : styles.trainingDay
            ]}>
              {training === 'off' ? 'OFF' : training}
            </Text>
          ) : (
            <Text style={styles.noTraining}>-</Text>
          )}
        </View>
      );
    }

    return days;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calendário</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Month Navigation */}
        <View style={styles.monthHeader}>
          <TouchableOpacity onPress={handlePrevMonth} style={styles.monthButton}>
            <Ionicons name="chevron-back" size={24} color="#FF6B35" />
          </TouchableOpacity>

          <View style={styles.monthInfo}>
            <Text style={styles.monthText}>
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Text>
          </View>

          <TouchableOpacity onPress={handleNextMonth} style={styles.monthButton}>
            <Ionicons name="chevron-forward" size={24} color="#FF6B35" />
          </TouchableOpacity>
        </View>

        {/* Day of week headers */}
        <View style={styles.weekHeader}>
          {DAYS_OF_WEEK.map((day) => (
            <Text key={day} style={styles.weekDayLabel}>
              {day}
            </Text>
          ))}
        </View>

        {/* Calendar grid */}
        <View style={styles.calendarGrid}>
          {renderCalendar()}
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <Text style={[styles.legendBox, { backgroundColor: '#FF6B35' }]}>A</Text>
            <Text style={styles.legendText}>Treino Dia 1</Text>
          </View>
          <View style={styles.legendItem}>
            <Text style={[styles.legendBox, { backgroundColor: '#FF6B35' }]}>B</Text>
            <Text style={styles.legendText}>Treino Dia 2</Text>
          </View>
          <View style={styles.legendItem}>
            <Text style={[styles.legendBox, { backgroundColor: '#FF6B35' }]}>C</Text>
            <Text style={styles.legendText}>Treino Dia 3</Text>
          </View>
          <View style={styles.legendItem}>
            <Text style={[styles.legendBox, { backgroundColor: '#FF6B35' }]}>D</Text>
            <Text style={styles.legendText}>Treino Dia 4</Text>
          </View>
          <View style={styles.legendItem}>
            <Text style={[styles.legendBox, { backgroundColor: '#555' }]}>OFF</Text>
            <Text style={styles.legendText}>Descanso</Text>
          </View>
        </View>

        {!currentPlan && (
          <View style={styles.emptyMessage}>
            <Ionicons name="calendar-outline" size={48} color="#666" />
            <Text style={styles.emptyText}>Nenhum plano ativo</Text>
            <Text style={styles.emptySubtext}>
              Crie um plano para visualizar o calendário de treinos
            </Text>
          </View>
        )}
      </ScrollView>
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
  content: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomColor: '#FF6B35',
    borderBottomWidth: 1,
  },
  monthButton: {
    padding: 8,
  },
  monthInfo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF6B35',
    paddingVertical: 8,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderColor: '#1A1A2E',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    borderColor: '#1A1A2E',
    borderWidth: 1,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D0D1A',
  },
  todayCell: {
    backgroundColor: '#1A1A2E',
    borderColor: '#FF6B35',
    borderWidth: 2,
  },
  dayNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    marginBottom: 4,
  },
  todayNumber: {
    color: '#FF6B35',
    fontWeight: 'bold',
  },
  trainingLetter: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  trainingDay: {
    color: '#FF6B35',
    backgroundColor: '#FF6B35',
    color: '#0D0D1A',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 11,
    fontWeight: 'bold',
  },
  offDay: {
    color: '#666',
    fontSize: 10,
  },
  noTraining: {
    color: '#666',
    fontSize: 12,
  },
  legend: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  legendBox: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    fontWeight: 'bold',
    color: '#0D0D1A',
    fontSize: 12,
  },
  legendText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  emptyMessage: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
