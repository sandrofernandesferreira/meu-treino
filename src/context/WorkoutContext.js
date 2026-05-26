import React, { createContext, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadWorkouts = useCallback(async () => {
    try {
      setLoading(true);
      const stored = await AsyncStorage.getItem('workouts');
      if (stored) {
        setWorkouts(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading workouts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveWorkouts = useCallback(async (updatedWorkouts) => {
    try {
      await AsyncStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
      setWorkouts(updatedWorkouts);
    } catch (error) {
      console.error('Error saving workouts:', error);
    }
  }, []);

  const addWorkout = useCallback((workout) => {
    const newWorkout = {
      ...workout,
      id: Date.now().toString(),
    };
    const updated = [...workouts, newWorkout];
    saveWorkouts(updated);
    return newWorkout;
  }, [workouts, saveWorkouts]);

  const updateWorkout = useCallback((id, updatedWorkout) => {
    const updated = workouts.map(w => w.id === id ? { ...updatedWorkout, id } : w);
    saveWorkouts(updated);
  }, [workouts, saveWorkouts]);

  const deleteWorkout = useCallback((id) => {
    const updated = workouts.filter(w => w.id !== id);
    saveWorkouts(updated);
  }, [workouts, saveWorkouts]);

  const getTodayWorkout = useCallback(() => {
    const today = new Date().toLocaleDateString('pt-BR');
    return workouts.find(w => w.date === today);
  }, [workouts]);

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        loading,
        loadWorkouts,
        addWorkout,
        updateWorkout,
        deleteWorkout,
        getTodayWorkout,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};
