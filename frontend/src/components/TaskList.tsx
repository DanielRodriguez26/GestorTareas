import React from 'react';
import { TaskItem } from './TaskItem';
import type { Task, TaskUpdate } from '../types/task';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  onToggle: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, updates: TaskUpdate) => Promise<Task>;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  loading,
  error,
  onToggle,
  onDelete,
  onUpdate,
}) => {
  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="relative inline-block">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin absolute top-0 left-0 animate-reverse"></div>
        </div>
        <p className="mt-6 text-gray-700 text-xl font-semibold animate-pulse">Cargando tareas...</p>
        <p className="text-gray-500 text-sm mt-2">Un momento por favor</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 text-red-700 px-8 py-6 rounded-2xl shadow-xl animate-shake">
        <div className="flex items-center gap-3">
          <div className="bg-red-500 p-2 rounded-full">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-lg">¡Oops! Algo salió mal</p>
            <p className="font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 bg-gradient-to-br from-white/80 to-purple-50/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 animate-fadeIn">
        <div className="relative inline-block mb-6">
          <svg className="w-32 h-32 mx-auto text-purple-300 animate-float" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold animate-bounce">
            0
          </div>
        </div>
        <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-3">
          ¡Comienza tu día productivo!
        </h3>
        <p className="text-gray-600 text-lg max-w-md mx-auto mb-4">
          No hay tareas todavía
        </p>
        <p className="text-gray-500 text-sm">
          Crea tu primera tarea usando el formulario de arriba ☝️
        </p>
        <div className="mt-8 flex justify-center gap-2">
          <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></span>
          <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
          <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
        </div>
      </div>
    );
  }

  const completedTasks = tasks.filter((t) => t.is_completed);
  const pendingTasks = tasks.filter((t) => !t.is_completed);

  return (
    <div className="animate-fadeIn">
      {/* Enhanced Stats Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 p-1 rounded-2xl shadow-xl">
          <div className="bg-white rounded-2xl p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center transform transition-all hover:scale-105">
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-4 rounded-xl">
                  <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                    {tasks.length}
                  </p>
                  <p className="text-sm font-semibold text-gray-600 mt-1">Total</p>
                </div>
              </div>
              <div className="text-center transform transition-all hover:scale-105">
                <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-4 rounded-xl">
                  <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600">
                    {pendingTasks.length}
                  </p>
                  <p className="text-sm font-semibold text-gray-600 mt-1">Pendientes</p>
                </div>
              </div>
              <div className="text-center transform transition-all hover:scale-105">
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-4 rounded-xl">
                  <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                    {completedTasks.length}
                  </p>
                  <p className="text-sm font-semibold text-gray-600 mt-1">Completadas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Tasks Section */}
      {pendingTasks.length > 0 && (
        <div className="mb-10 animate-slideIn">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600">
              Tareas Pendientes
            </h3>
            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
              {pendingTasks.length}
            </span>
          </div>
          <div className="space-y-3">
            {pendingTasks.map((task, index) => (
              <div
                key={task.id}
                style={{ animationDelay: `${index * 0.1}s` }}
                className="animate-slideIn"
              >
                <TaskItem
                  task={task}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks Section */}
      {completedTasks.length > 0 && (
        <div className="animate-slideIn">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              Tareas Completadas
            </h3>
            <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
              {completedTasks.length}
            </span>
          </div>
          <div className="space-y-3">
            {completedTasks.map((task, index) => (
              <div
                key={task.id}
                style={{ animationDelay: `${index * 0.1}s` }}
                className="animate-slideIn"
              >
                <TaskItem
                  task={task}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
