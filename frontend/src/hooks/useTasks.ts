import { useState, useEffect, useCallback } from 'react';
import { taskApi } from '../services/api';
import type { Task, TaskCreate, TaskUpdate } from '../types/task';

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  createTask: (task: TaskCreate) => Promise<Task>;
  updateTask: (id: number, task: TaskUpdate) => Promise<Task>;
  deleteTask: (id: number) => Promise<void>;
  toggleTaskCompletion: (id: number) => Promise<void>;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for managing tasks state and operations
 */
export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all tasks from API
   */
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskApi.getAll();
      setTasks(data);
    } catch (err) {
      setError('Error al cargar las tareas. Por favor, intenta de nuevo.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new task
   */
  const createTask = async (task: TaskCreate): Promise<Task> => {
    setError(null);
    try {
      const newTask = await taskApi.create(task);
      setTasks((prev) => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      setError('Error al crear la tarea. Por favor, intenta de nuevo.');
      throw err;
    }
  };

  /**
   * Update an existing task
   */
  const updateTask = async (id: number, task: TaskUpdate): Promise<Task> => {
    setError(null);
    try {
      const updatedTask = await taskApi.update(id, task);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? updatedTask : t))
      );
      return updatedTask;
    } catch (err) {
      setError('Error al actualizar la tarea. Por favor, intenta de nuevo.');
      throw err;
    }
  };

  /**
   * Delete a task
   */
  const deleteTask = async (id: number): Promise<void> => {
    setError(null);
    try {
      await taskApi.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError('Error al eliminar la tarea. Por favor, intenta de nuevo.');
      throw err;
    }
  };

  /**
   * Toggle task completion status
   */
  const toggleTaskCompletion = async (id: number): Promise<void> => {
    setError(null);
    try {
      const updatedTask = await taskApi.toggleComplete(id);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? updatedTask : t))
      );
    } catch (err) {
      setError('Error al actualizar el estado. Por favor, intenta de nuevo.');
      throw err;
    }
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    refetch: fetchTasks,
  };
};
