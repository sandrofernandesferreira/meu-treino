import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ExerciseDetailScreen({ route, navigation }) {
  const { exercise } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#FF6B35" />
        </TouchableOpacity>
        <Text style={styles.title}>{exercise.name}</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Image */}
        <View style={styles.imageContainer}>
          {exercise.imageUrl ? (
            <Image
              source={{ uri: exercise.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={64} color="#666" />
              <Text style={styles.placeholderText}>
                Sem imagem
              </Text>
            </View>
          )}
        </View>

        {/* Exercise Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Detalhes do Exercício</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Séries</Text>
              <View style={styles.infoBadge}>
                <Text style={styles.infoBadgeText}>
                  {exercise.series}
                </Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Repetições</Text>
              <View style={styles.infoBadge}>
                <Text style={styles.infoBadgeText}>
                  {exercise.reps}
                </Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Peso</Text>
              <View style={styles.infoBadge}>
                <Text style={styles.infoBadgeText}>
                  {exercise.weight}
                </Text>
              </View>
              <Text style={{ fontSize: 10, color: '#999', marginTop: 2 }}>
                kg
              </Text>
            </View>
          </View>
        </View>

        {/* Volume de Treino */}
        <View style={styles.volumeCard}>
          <Text style={styles.volumeTitle}>Volume Total</Text>
          <View style={styles.volumeRow}>
            <View style={styles.volumeItem}>
              <Text style={styles.volumeLabel}>Repetições Totais</Text>
              <Text style={styles.volumeValue}>
                {exercise.series * exercise.reps}
              </Text>
            </View>
            <View style={styles.volumeItem}>
              <Text style={styles.volumeLabel}>Carga Total</Text>
              <Text style={styles.volumeValue}>
                {(exercise.series * exercise.reps * exercise.weight).toFixed(0)} kg
              </Text>
            </View>
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Dicas</Text>
          <Text style={styles.tipItem}>
            • Mantenha a forma correta durante todo o movimento
          </Text>
          <Text style={styles.tipItem}>
            • Controle a velocidade, não use impulso
          </Text>
          <Text style={styles.tipItem}>
            • Descanse 60-90 segundos entre séries
          </Text>
          <Text style={styles.tipItem}>
            • Aumente o peso quando conseguir fazer todas as reps
          </Text>
        </View>
      </ScrollView>

      {/* Action Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.actionButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Workaround para View chamado Card
const Card = ({ children, style }) => (
  <View style={[styles.infoCard, style]}>{children}</View>
);

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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#1A1A2E',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
  },
  placeholderText: {
    color: '#666',
    marginTop: 12,
    fontSize: 14,
  },
  infoCard: {
    backgroundColor: '#1A1A2E',
    borderLeftColor: '#FF6B35',
    borderLeftWidth: 4,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  infoBadge: {
    backgroundColor: '#FF6B35',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 50,
    alignItems: 'center',
  },
  infoBadgeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D0D1A',
  },
  volumeCard: {
    backgroundColor: '#1A1A2E',
    borderLeftColor: '#4CAF50',
    borderLeftWidth: 4,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  volumeTitle: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  volumeRow: {
    flexDirection: 'row',
    gap: 16,
  },
  volumeItem: {
    flex: 1,
    backgroundColor: '#0D0D1A',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  volumeLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 6,
  },
  volumeValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  tipsCard: {
    backgroundColor: '#1A1A2E',
    borderLeftColor: '#2196F3',
    borderLeftWidth: 4,
    borderRadius: 12,
    padding: 16,
    marginBottom: 80,
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
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#0D0D1A',
    borderTopColor: '#FF6B35',
    borderTopWidth: 1,
  },
  actionButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0D0D1A',
  },
});
