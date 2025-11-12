import React, { useState } from 'react';
import type { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, updates: { title?: string; description?: string }) => Promise<void>;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    if (!editTitle.trim()) {
      return;
    }

    setIsUpdating(true);
    try {
      await onUpdate(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      try {
        await onDelete(task.id);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isEditing) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-5 rounded-2xl shadow-xl mb-4 border-2 border-blue-400 animate-fadeIn">
        <div className="mb-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg font-medium"
            maxLength={200}
            placeholder="Título de la tarea"
          />
        </div>
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl mb-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-vertical"
          rows={3}
          maxLength={1000}
          placeholder="Descripción (opcional)"
        />
        <div className="flex gap-3">
          <button
            onClick={handleUpdate}
            disabled={isUpdating || !editTitle.trim()}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            {isUpdating ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Guardar
              </>
            )}
          </button>
          <button
            onClick={handleCancel}
            disabled={isUpdating}
            className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-5 py-3 rounded-xl hover:from-gray-600 hover:to-gray-700 disabled:opacity-50 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group bg-white/90 backdrop-blur-sm p-5 rounded-2xl shadow-lg mb-4 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 border border-white/50 ${
        task.is_completed ? 'opacity-75 bg-gradient-to-r from-green-50 to-emerald-50' : 'hover:border-purple-200'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Custom Checkbox */}
        <label className="relative flex items-center cursor-pointer mt-1">
          <input
            type="checkbox"
            checked={task.is_completed}
            onChange={() => onToggle(task.id)}
            className="sr-only peer"
            aria-label={`Marcar tarea "${task.title}" como ${task.is_completed ? 'pendiente' : 'completada'}`}
          />
          <div className="w-6 h-6 border-2 border-purple-400 rounded-lg peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-emerald-600 peer-checked:border-transparent transition-all duration-300 flex items-center justify-center">
            {task.is_completed && (
              <svg className="w-4 h-4 text-white animate-checkmark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </label>

        <div className="flex-1 min-w-0">
          <h3
            className={`text-xl font-bold break-words transition-all duration-300 ${
              task.is_completed
                ? 'line-through text-gray-500'
                : 'text-gray-800 group-hover:text-purple-700'
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="text-gray-600 text-sm mt-2 break-words whitespace-pre-wrap leading-relaxed bg-gray-50 p-3 rounded-lg">
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-4 mt-3 text-xs">
            <span className="flex items-center gap-1 text-gray-500">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatDate(task.created_at)}
            </span>
            {task.updated_at && task.updated_at !== task.created_at && (
              <span className="flex items-center gap-1 text-blue-500">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {formatDate(task.updated_at)}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => setIsEditing(true)}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center gap-2 whitespace-nowrap"
            aria-label={`Editar tarea "${task.title}"`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar
          </button>
          <button
            onClick={handleDelete}
            className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-xl hover:from-red-600 hover:to-pink-700 transition-all text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center gap-2 whitespace-nowrap"
            aria-label={`Eliminar tarea "${task.title}"`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};
