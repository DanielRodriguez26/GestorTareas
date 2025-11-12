import React, { useState } from 'react';
import type { TaskCreate } from '../types/task';

interface TaskFormProps {
  onSubmit: (task: TaskCreate) => Promise<Task>;
}

interface Task {
  id: number;
  title: string;
  description?: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
      });
      // Clear form on success
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error submitting task:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-10 bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/50 transform transition-all hover:shadow-3xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          Nueva Tarea
        </h2>
      </div>

      <div className="mb-5">
        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <span className="text-purple-500">✦</span>
          Título
          <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          placeholder="¿Qué necesitas hacer?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-5 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white/50 backdrop-blur-sm hover:border-purple-300 text-lg"
          required
          maxLength={200}
          disabled={submitting}
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-500">
            {title.length > 0 ? `${title.length} caracteres` : 'Mínimo 1 caracter'}
          </p>
          <p className="text-xs text-gray-400">
            {200 - title.length} restantes
          </p>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <span className="text-pink-500">✦</span>
          Descripción
          <span className="text-xs text-gray-400 font-normal">(opcional)</span>
        </label>
        <textarea
          id="description"
          placeholder="Agrega más detalles sobre tu tarea..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-5 py-3 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all resize-vertical bg-white/50 backdrop-blur-sm hover:border-pink-300"
          rows={3}
          maxLength={1000}
          disabled={submitting}
        />
        <p className="text-xs text-gray-400 mt-2 text-right">
          {description.length}/1000 caracteres
        </p>
      </div>

      <button
        type="submit"
        disabled={submitting || !title.trim()}
        className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group"
      >
        {submitting ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Creando tu tarea...</span>
          </>
        ) : (
          <>
            <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Crear Tarea</span>
          </>
        )}
      </button>
    </form>
  );
};
