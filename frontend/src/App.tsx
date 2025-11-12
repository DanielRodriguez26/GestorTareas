import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { useTasks } from './hooks/useTasks';

function App() {
  const {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
  } = useTasks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        {/* Header with enhanced design */}
        <header className="mb-12 text-center">
          <div className="inline-block mb-4">
            <div className="relative">
              <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-2 tracking-tight animate-gradient">
                Task Manager
              </h1>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full"></div>
            </div>
          </div>
          <p className="text-gray-700 text-xl font-medium max-w-2xl mx-auto">
            Organiza tu vida, una tarea a la vez ✨
          </p>

          {/* Stats badges */}
          <div className="flex justify-center gap-4 mt-6 flex-wrap">
            <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-purple-100">
              <span className="text-2xl font-bold text-purple-600">{tasks.length}</span>
              <span className="text-sm text-gray-600 ml-2">Total</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-yellow-100">
              <span className="text-2xl font-bold text-yellow-600">{tasks.filter(t => !t.is_completed).length}</span>
              <span className="text-sm text-gray-600 ml-2">Pendientes</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-green-100">
              <span className="text-2xl font-bold text-green-600">{tasks.filter(t => t.is_completed).length}</span>
              <span className="text-sm text-gray-600 ml-2">Completadas</span>
            </div>
          </div>
        </header>

        {/* Task Form with enhanced design */}
        <TaskForm onSubmit={createTask} />

        {/* Task List */}
        <TaskList
          tasks={tasks}
          loading={loading}
          error={error}
          onToggle={toggleTaskCompletion}
          onDelete={deleteTask}
          onUpdate={updateTask}
        />

        {/* Enhanced Footer */}
        <footer className="mt-16 text-center">
          <div className="bg-white/60 backdrop-blur-md px-8 py-4 rounded-2xl shadow-lg inline-block border border-white/50">
            <p className="text-gray-700 font-medium">
              Desarrollado con{' '}
              <span className="text-red-500 inline-block animate-pulse">♥</span>{' '}
              usando{' '}
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">FastAPI</span>
              {' + '}
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600">React</span>
              {' + '}
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">TypeScript</span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
