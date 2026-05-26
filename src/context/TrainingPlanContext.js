import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeSeedData } from '../data/seedData';

// Função simples para gerar UUID
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const TrainingPlanContext = createContext();

export function TrainingPlanProvider({ children }) {
  const [currentPlan, setCurrentPlan] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregar dados na inicialização
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);

      // Inicializar dados seed na primeira vez
      await initializeSeedData();

      // Carregar dados do AsyncStorage
      const plansData = await AsyncStorage.getItem('trainingPlans');
      const workoutsData = await AsyncStorage.getItem('workouts');
      const sessionsData = await AsyncStorage.getItem('sessions');
      const currentPlanId = await AsyncStorage.getItem('currentPlanId');

      if (plansData) setPlans(JSON.parse(plansData));
      if (workoutsData) setWorkouts(JSON.parse(workoutsData));
      if (sessionsData) setSessions(JSON.parse(sessionsData));

      // Carregar plano ativo se existir
      if (currentPlanId && plansData) {
        const plansArray = JSON.parse(plansData);
        const activePlan = plansArray.find(p => p.id === currentPlanId);
        setCurrentPlan(activePlan || null);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePlans = async (newPlans) => {
    try {
      setPlans(newPlans);
      await AsyncStorage.setItem('trainingPlans', JSON.stringify(newPlans));
    } catch (error) {
      console.error('Erro ao salvar planos:', error);
    }
  };

  const saveWorkouts = async (newWorkouts) => {
    try {
      setWorkouts(newWorkouts);
      await AsyncStorage.setItem('workouts', JSON.stringify(newWorkouts));
    } catch (error) {
      console.error('Erro ao salvar treinos:', error);
    }
  };

  const saveSessions = async (newSessions) => {
    try {
      setSessions(newSessions);
      await AsyncStorage.setItem('sessions', JSON.stringify(newSessions));
    } catch (error) {
      console.error('Erro ao salvar sessões:', error);
    }
  };

  const createPlan = async (planData) => {
    try {
      const newPlan = {
        id: generateId(),
        name: planData.name,
        division: planData.division,
        startDate: planData.startDate,
        endDate: planData.endDate,
        trainingSchedule: planData.trainingSchedule,
        createdAt: new Date().toISOString(),
      };

      const newPlans = [...plans, newPlan];
      await savePlans(newPlans);

      // Criar treinos vazios para cada letra da divisão
      const newWorkouts = planData.trainingLetters.map(letter => ({
        id: generateId(),
        trainingPlanId: newPlan.id,
        letter,
        name: `Treino ${letter}`,
        exercises: [],
        notes: '',
      }));

      await saveWorkouts([...workouts, ...newWorkouts]);

      // Ativar este plano automaticamente
      setCurrentPlan(newPlan);
      await AsyncStorage.setItem('currentPlanId', newPlan.id);

      return newPlan;
    } catch (error) {
      console.error('Erro ao criar plano:', error);
      throw error;
    }
  };

  const copyPlan = async (planId) => {
    try {
      const planToCopy = plans.find(p => p.id === planId);
      if (!planToCopy) throw new Error('Plano não encontrado');

      // Copiar plano
      const newPlan = {
        ...planToCopy,
        id: generateId(),
        name: `${planToCopy.name} (Cópia)`,
        createdAt: new Date().toISOString(),
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
      };

      // Copiar treinos associados
      const planWorkouts = workouts.filter(w => w.trainingPlanId === planId);
      const newWorkouts = planWorkouts.map(workout => ({
        ...workout,
        id: generateId(),
        trainingPlanId: newPlan.id,
      }));

      const updatedPlans = [...plans, newPlan];
      const updatedWorkouts = [...workouts, ...newWorkouts];

      await savePlans(updatedPlans);
      await saveWorkouts(updatedWorkouts);

      return newPlan;
    } catch (error) {
      console.error('Erro ao copiar plano:', error);
      throw error;
    }
  };

  const extendPlan = async (planId, newEndDate) => {
    try {
      const updatedPlans = plans.map(p =>
        p.id === planId ? { ...p, endDate: newEndDate } : p
      );
      await savePlans(updatedPlans);

      if (currentPlan?.id === planId) {
        setCurrentPlan({ ...currentPlan, endDate: newEndDate });
      }
    } catch (error) {
      console.error('Erro ao estender plano:', error);
      throw error;
    }
  };

  const deletePlan = async (planId) => {
    try {
      const updatedPlans = plans.filter(p => p.id !== planId);
      const updatedWorkouts = workouts.filter(w => w.trainingPlanId !== planId);
      const updatedSessions = sessions.filter(s => s.trainingPlanId !== planId);

      await savePlans(updatedPlans);
      await saveWorkouts(updatedWorkouts);
      await saveSessions(updatedSessions);

      if (currentPlan?.id === planId) {
        setCurrentPlan(null);
        await AsyncStorage.removeItem('currentPlanId');
      }
    } catch (error) {
      console.error('Erro ao deletar plano:', error);
      throw error;
    }
  };

  const activatePlan = async (planId) => {
    try {
      const plan = plans.find(p => p.id === planId);
      if (plan) {
        setCurrentPlan(plan);
        await AsyncStorage.setItem('currentPlanId', planId);
      }
    } catch (error) {
      console.error('Erro ao ativar plano:', error);
      throw error;
    }
  };

  const updatePlan = async (planId, updateData) => {
    try {
      const updatedPlans = plans.map(p =>
        p.id === planId ? { ...p, ...updateData } : p
      );

      await savePlans(updatedPlans);

      // Atualizar plano atual se for o plano ativo
      if (currentPlan?.id === planId) {
        const updatedPlan = updatedPlans.find(p => p.id === planId);
        setCurrentPlan(updatedPlan);
      }
    } catch (error) {
      console.error('Erro ao atualizar plano:', error);
      throw error;
    }
  };

  const addExercise = async (workoutId, exercise) => {
    try {
      const newExercise = {
        id: generateId(),
        ...exercise,
      };

      const updatedWorkouts = workouts.map(w =>
        w.id === workoutId
          ? { ...w, exercises: [...w.exercises, newExercise] }
          : w
      );

      await saveWorkouts(updatedWorkouts);
      return newExercise;
    } catch (error) {
      console.error('Erro ao adicionar exercício:', error);
      throw error;
    }
  };

  const updateExercise = async (workoutId, exerciseId, data) => {
    try {
      const updatedWorkouts = workouts.map(w =>
        w.id === workoutId
          ? {
              ...w,
              exercises: w.exercises.map(e =>
                e.id === exerciseId ? { ...e, ...data } : e
              ),
            }
          : w
      );

      await saveWorkouts(updatedWorkouts);
    } catch (error) {
      console.error('Erro ao atualizar exercício:', error);
      throw error;
    }
  };

  const deleteExercise = async (workoutId, exerciseId) => {
    try {
      const updatedWorkouts = workouts.map(w =>
        w.id === workoutId
          ? {
              ...w,
              exercises: w.exercises.filter(e => e.id !== exerciseId),
            }
          : w
      );

      await saveWorkouts(updatedWorkouts);
    } catch (error) {
      console.error('Erro ao deletar exercício:', error);
      throw error;
    }
  };

  const markSessionCompleted = async (date, completed = true) => {
    try {
      if (!currentPlan) return;

      // Pegar treino de hoje
      const todayWorkout = getCurrentDayWorkout();
      if (!todayWorkout) return;

      // Verificar se sessão já existe
      const existingSession = sessions.find(
        s =>
          s.trainingPlanId === currentPlan.id &&
          s.date === date &&
          s.workoutId === todayWorkout.id
      );

      let updatedSessions;
      if (existingSession) {
        updatedSessions = sessions.map(s =>
          s.id === existingSession.id
            ? { ...s, completed, skipped: !completed }
            : s
        );
      } else {
        updatedSessions = [
          ...sessions,
          {
            id: generateId(),
            trainingPlanId: currentPlan.id,
            workoutId: todayWorkout.id,
            letter: todayWorkout.letter,
            date,
            completed,
            skipped: !completed,
            notes: '',
          },
        ];
      }

      await saveSessions(updatedSessions);
    } catch (error) {
      console.error('Erro ao marcar sessão:', error);
      throw error;
    }
  };

  const getCurrentDayWorkout = () => {
    if (!currentPlan) return null;

    const today = new Date();
    const dayName = today
      .toLocaleDateString('pt-BR', { weekday: 'long' })
      .toLowerCase()
      .replace('ç', 'c')
      .replace('a', 'a')
      .replace('segunda-feira', 'monday')
      .replace('terça-feira', 'tuesday')
      .replace('quarta-feira', 'wednesday')
      .replace('quinta-feira', 'thursday')
      .replace('sexta-feira', 'friday')
      .replace('sábado', 'saturday')
      .replace('domingo', 'sunday');

    const dayMap = {
      'segunda-feira': 'monday',
      'terça-feira': 'tuesday',
      'quarta-feira': 'wednesday',
      'quinta-feira': 'thursday',
      'sexta-feira': 'friday',
      sábado: 'saturday',
      domingo: 'sunday',
    };

    const englishDay = dayMap[dayName] || dayName;
    const trainingLetter = currentPlan.trainingSchedule?.[englishDay];

    if (trainingLetter && trainingLetter !== 'off') {
      return workouts.find(
        w =>
          w.trainingPlanId === currentPlan.id && w.letter === trainingLetter
      );
    }

    return null;
  };

  const getSessionsByMonth = (year, month) => {
    return sessions.filter(s => {
      const sessionDate = new Date(s.date);
      return (
        sessionDate.getFullYear() === year &&
        sessionDate.getMonth() === month - 1
      );
    });
  };

  const getWorkoutsByPlan = (planId) => {
    return workouts.filter(w => w.trainingPlanId === planId);
  };

  const value = {
    currentPlan,
    workouts,
    sessions,
    plans,
    loading,
    createPlan,
    copyPlan,
    extendPlan,
    deletePlan,
    activatePlan,
    updatePlan,
    addExercise,
    updateExercise,
    deleteExercise,
    markSessionCompleted,
    getCurrentDayWorkout,
    getSessionsByMonth,
    getWorkoutsByPlan,
  };

  return (
    <TrainingPlanContext.Provider value={value}>
      {children}
    </TrainingPlanContext.Provider>
  );
}
