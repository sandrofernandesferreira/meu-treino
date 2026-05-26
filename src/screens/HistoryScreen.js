import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TrainingPlanContext } from '../context/TrainingPlanContext';

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export default function HistoryScreen() {
  const { sessions, currentPlan } = useContext(TrainingPlanContext);
  const [currentDate, setCurrentDate] = useState(new Date());

  const getMonthStats = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Sessões do mês
    const monthSessions = sessions.filter(s => {
      const sessionDate = new Date(s.date);
      return (
        sessionDate.getFullYear() === year &&
        sessionDate.getMonth() === month
      );
    });

    // Contar treinos feitos
    const completed = monthSessions.filter(s => s.completed).length;

    // Contar dias pulados
    const skipped = monthSessions.filter(s => s.skipped).length;

    // Dias de descanso (dias OFF da rotina semanal)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let daysOff = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()];

      if (currentPlan?.trainingSchedule[dayName] === 'off') {
        daysOff++;
      }
    }

    const total = daysInMonth;
    const completedPercent = total > 0 ? ((completed / total) * 100).toFixed(1) : 0;
    const skippedPercent = total > 0 ? ((skipped / total) * 100).toFixed(1) : 0;
    const offPercent = total > 0 ? ((daysOff / total) * 100).toFixed(1) : 0;

    return {
      completed,
      skipped,
      daysOff,
      completedPercent,
      skippedPercent,
      offPercent,
      total,
      sessions: monthSessions,
    };
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const stats = getMonthStats();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Histórico</Text>
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

        {/* Summary Stats */}
        <View style={styles.statsContainer}>
          {/* Completed */}
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Ionicons name="checkmark-circle" size={32} color="#4CAF50" />
              <Text style={styles.statTitle}>Treinos Feitos</Text>
            </View>
            <Text style={styles.statNumber}>{stats.completed}</Text>
            <Text style={styles.statPercent}>{stats.completedPercent}% do mês</Text>
          </View>

          {/* Skipped */}
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Ionicons name="close-circle" size={32} color="#FF9800" />
              <Text style={styles.statTitle}>Dias Pulados</Text>
            </View>
            <Text style={styles.statNumber}>{stats.skipped}</Text>
            <Text style={styles.statPercent}>{stats.skippedPercent}% do mês</Text>
          </View>

          {/* Rest Days */}
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Ionicons name="moon" size={32} color="#2196F3" />
              <Text style={styles.statTitle}>Dias OFF</Text>
            </View>
            <Text style={styles.statNumber}>{stats.daysOff}</Text>
            <Text style={styles.statPercent}>{stats.offPercent}% do mês</Text>
          </View>
        </View>

        {/* Monthly Overview */}
        <View style={styles.overviewCard}>
          <Text style={styles.overviewTitle}>Resumo do Mês</Text>

          <View style={styles.overviewRow}>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewLabel}>Dias úteis</Text>
              <Text style={styles.overviewValue}>
                {stats.total - stats.daysOff}
              </Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewLabel}>Total de dias</Text>
              <Text style={styles.overviewValue}>{stats.total}</Text>
            </View>
          </View>

          <View style={styles.progressBars}>
            {/* Completed Bar */}
            <View style={styles.progressItem}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Completados</Text>
                <Text style={styles.progressPercent}>{stats.completedPercent}%</Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${stats.completedPercent}%`,
                      backgroundColor: '#4CAF50',
                    },
                  ]}
                />
              </View>
            </View>

            {/* Skipped Bar */}
            <View style={styles.progressItem}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Pulados</Text>
                <Text style={styles.progressPercent}>{stats.skippedPercent}%</Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${stats.skippedPercent}%`,
                      backgroundColor: '#FF9800',
                    },
                  ]}
                />
              </View>
            </View>

            {/* Off Days Bar */}
            <View style={styles.progressItem}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Descanso</Text>
                <Text style={styles.progressPercent}>{stats.offPercent}%</Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${stats.offPercent}%`,
                      backgroundColor: '#2196F3',
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Dicas para Melhorar</Text>
          {stats.completedPercent < 50 ? (
            <>
              <Text style={styles.tipItem}>
                • Você completou menos de 50% dos treinos este mês
              </Text>
              <Text style={styles.tipItem}>
                • Tente aumentar sua frequência gradualmente
              </Text>
            </>
          ) : stats.completedPercent >= 80 ? (
            <>
              <Text style={styles.tipItem}>
                • Excelente consistência! Continue assim
              </Text>
              <Text style={styles.tipItem}>
                • Você está no caminho certo para atingir seus objetivos
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.tipItem}>
                • Bom progresso! Mantenha a frequência
              </Text>
              <Text style={styles.tipItem}>
                • Pequenos ajustes podem melhorar ainda mais seus resultados
              </Text>
            </>
          )}
        </View>

        {stats.sessions.length > 0 && (
          <View style={styles.sessionsCard}>
            <Text style={styles.sessionsTitle}>Treinos do Mês</Text>
            {stats.sessions.map((session) => (
              <View key={session.id} style={styles.sessionItem}>
                <View style={styles.sessionInfo}>
                  <Text style={styles.sessionDate}>{session.date}</Text>
                  <Text style={styles.sessionLetter}>{session.letter}</Text>
                </View>
                <View style={styles.sessionStatus}>
                  {session.completed ? (
                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  ) : (
                    <Ionicons name="close-circle" size={20} color="#FF9800" />
                  )}
                  <Text style={[
                    styles.sessionStatusText,
                    { color: session.completed ? '#4CAF50' : '#FF9800' }
                  ]}>
                    {session.completed ? 'Feito' : 'Pulado'}
                  </Text>
                </View>
              </View>
            ))}
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statsContainer: {
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 16,
    borderLeftColor: '#FF6B35',
    borderLeftWidth: 4,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  statTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    flex: 1,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 4,
  },
  statPercent: {
    fontSize: 12,
    color: '#999',
  },
  overviewCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftColor: '#4CAF50',
    borderLeftWidth: 4,
  },
  overviewTitle: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  overviewRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  overviewItem: {
    flex: 1,
    backgroundColor: '#0D0D1A',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  overviewLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 6,
  },
  overviewValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  progressBars: {
    gap: 12,
  },
  progressItem: {
    gap: 6,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  progressPercent: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#0D0D1A',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  tipsCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftColor: '#2196F3',
    borderLeftWidth: 4,
  },
  tipsTitle: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  tipItem: {
    fontSize: 12,
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 18,
  },
  sessionsCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 16,
    borderLeftColor: '#FF6B35',
    borderLeftWidth: 4,
  },
  sessionsTitle: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  sessionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#0D0D1A',
    borderBottomWidth: 1,
  },
  sessionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sessionDate: {
    fontSize: 12,
    color: '#999',
  },
  sessionLetter: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B35',
    backgroundColor: '#0D0D1A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  sessionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sessionStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
