import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TrainingPlanContext } from '../context/TrainingPlanContext';

export default function TrainingPlanListScreen({ navigation }) {
  const { plans, currentPlan, deletePlan, copyPlan, activatePlan, updatePlan } =
    useContext(TrainingPlanContext);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    startDate: '',
    endDate: '',
  });
  const [loading, setLoading] = useState(false);

  const handleDeletePlan = (planId) => {
    Alert.alert(
      'Deletar Plano',
      'Tem certeza que deseja deletar este plano?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          onPress: async () => {
            try {
              await deletePlan(planId);
              Alert.alert('Sucesso', 'Plano deletado com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível deletar o plano');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleCopyPlan = async (planId) => {
    try {
      await copyPlan(planId);
      Alert.alert('Sucesso', 'Plano copiado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível copiar o plano');
    }
  };

  const handleActivatePlan = async (planId) => {
    try {
      await activatePlan(planId);
      Alert.alert('Sucesso', 'Plano ativado!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível ativar o plano');
    }
  };

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setEditData({
      name: plan.name,
      startDate: plan.startDate,
      endDate: plan.endDate,
    });
    setDetailModalVisible(false);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!editData.name.trim()) {
      Alert.alert('Erro', 'Nome do plano não pode estar vazio');
      return;
    }

    try {
      setLoading(true);
      await updatePlan(selectedPlan.id, {
        name: editData.name,
        startDate: editData.startDate,
        endDate: editData.endDate,
      });
      Alert.alert('Sucesso', 'Plano atualizado com sucesso!');
      setEditModalVisible(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o plano');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewPlan = () => {
    navigation.navigate('CreatePlan', { mode: 'create' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Planos</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateNewPlan}
        >
          <Ionicons name="add" size={24} color="#0D0D1A" />
        </TouchableOpacity>
      </View>

      {plans.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum plano criado ainda</Text>
          <TouchableOpacity
            style={styles.createButtonLarge}
            onPress={handleCreateNewPlan}
          >
            <Text style={styles.createButtonText}>+ Criar Primeiro Plano</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          {plans.map((plan) => (
            <View key={plan.id} style={styles.planCard}>
              <TouchableOpacity
                style={styles.planInfo}
                onPress={() => {
                  setSelectedPlan(plan);
                  setDetailModalVisible(true);
                }}
              >
                <View style={styles.planHeader}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  {currentPlan?.id === plan.id && (
                    <View style={styles.activeBadge}>
                      <Text style={styles.activeBadgeText}>Ativo</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.planDate}>
                  {plan.startDate} até {plan.endDate}
                </Text>

                <Text style={styles.planDivision}>
                  Divisão: {plan.division}
                </Text>

                <View style={styles.scheduleSummary}>
                  <Text style={styles.scheduleSummaryText}>
                    {Object.values(plan.trainingSchedule).filter(
                      (d) => d !== 'off'
                    ).length}{' '}
                    dias por semana
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={styles.planActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => handleEditPlan(plan)}
                >
                  <Ionicons name="pencil" size={18} color="#FFF" />
                </TouchableOpacity>

                {currentPlan?.id !== plan.id && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.activateButton]}
                    onPress={() => handleActivatePlan(plan.id)}
                  >
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={18}
                      color="#FFF"
                    />
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[styles.actionButton, styles.copyButton]}
                  onPress={() => handleCopyPlan(plan.id)}
                >
                  <Ionicons name="copy" size={18} color="#FFF" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDeletePlan(plan.id)}
                >
                  <Ionicons name="trash" size={18} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Detail Modal */}
      <Modal visible={detailModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedPlan?.name}</Text>
              <TouchableOpacity onPress={() => setDetailModalVisible(false)}>
                <Ionicons name="close" size={28} color="#FF6B35" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} contentContainerStyle={styles.modalScrollContent}>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Período:</Text>
                <Text style={styles.detailValue}>
                  {selectedPlan?.startDate} até {selectedPlan?.endDate}
                </Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Divisão:</Text>
                <Text style={styles.detailValue}>{selectedPlan?.division}</Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Rotina Semanal:</Text>
                <View style={styles.scheduleGrid}>
                  {[
                    { key: 'monday', label: 'Seg' },
                    { key: 'tuesday', label: 'Ter' },
                    { key: 'wednesday', label: 'Qua' },
                    { key: 'thursday', label: 'Qui' },
                    { key: 'friday', label: 'Sex' },
                    { key: 'saturday', label: 'Sab' },
                    { key: 'sunday', label: 'Dom' },
                  ].map((day) => {
                    const training = selectedPlan?.trainingSchedule[day.key];
                    return (
                      <View
                        key={day.key}
                        style={[
                          styles.scheduleDay,
                          training === 'off' && styles.scheduleDayOff,
                        ]}
                      >
                        <Text style={styles.scheduleDayLabel}>{day.label}</Text>
                        <Text style={styles.scheduleDayValue}>
                          {training === 'off' ? 'OFF' : training}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.editModalButton]}
                onPress={() => handleEditPlan(selectedPlan)}
              >
                <Text style={styles.modalButtonText}>Editar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal visible={editModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Plano</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={28} color="#FF6B35" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Nome do Plano</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Digite o nome"
                  placeholderTextColor="#666"
                  value={editData.name}
                  onChangeText={(text) => setEditData({ ...editData, name: text })}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Data de Início</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#666"
                  value={editData.startDate}
                  onChangeText={(text) => setEditData({ ...editData, startDate: text })}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Data de Fim</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#666"
                  value={editData.endDate}
                  onChangeText={(text) => setEditData({ ...editData, endDate: text })}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveEdit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#0D0D1A" />
                ) : (
                  <Text style={styles.modalButtonText}>Salvar</Text>
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
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomColor: '#FF6B35',
    borderBottomWidth: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  createButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
    textAlign: 'center',
  },
  createButtonLarge: {
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D0D1A',
    textAlign: 'center',
  },
  planCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderLeftColor: '#FF6B35',
    borderLeftWidth: 4,
  },
  planInfo: {
    padding: 16,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  activeBadge: {
    backgroundColor: '#4CAF50',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  activeBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0D0D1A',
  },
  planDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  planDivision: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '600',
    marginBottom: 8,
  },
  scheduleSummary: {
    backgroundColor: '#0D0D1A',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  scheduleSummaryText: {
    fontSize: 11,
    color: '#FF6B35',
    fontWeight: '600',
  },
  planActions: {
    flexDirection: 'row',
    borderTopColor: '#0D0D1A',
    borderTopWidth: 1,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightColor: '#0D0D1A',
    borderRightWidth: 1,
  },
  editButton: {
    backgroundColor: '#2196F3',
  },
  activateButton: {
    backgroundColor: '#4CAF50',
  },
  copyButton: {
    backgroundColor: '#FF9800',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    borderRightWidth: 0,
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
    maxHeight: '90%',
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
    flex: 1,
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modalScrollContent: {
    paddingBottom: 20,
  },
  detailSection: {
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: 'bold',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 14,
    color: '#FFFFFF',
    backgroundColor: '#0D0D1A',
    padding: 10,
    borderRadius: 6,
  },
  scheduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  scheduleDay: {
    width: '30%',
    backgroundColor: '#0D0D1A',
    padding: 12,
    borderRadius: 8,
    borderLeftColor: '#FF6B35',
    borderLeftWidth: 3,
    alignItems: 'center',
  },
  scheduleDayOff: {
    borderLeftColor: '#666',
  },
  scheduleDayLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 4,
  },
  scheduleDayValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
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
  modalFooter: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editModalButton: {
    backgroundColor: '#FF6B35',
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0D0D1A',
  },
});
