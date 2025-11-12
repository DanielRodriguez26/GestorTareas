# 📚 Explicación del Proyecto - Task Manager

## 🎯 ¿Qué hace este proyecto?

Es una aplicación web para gestionar tareas (tipo "To-Do List") que permite:
- Crear nuevas tareas
- Ver la lista de tareas
- Marcar tareas como completadas
- Editar tareas existentes
- Eliminar tareas

**Arquitectura:** Cliente-Servidor
- **Frontend:** Interfaz visual que ve el usuario (React)
- **Backend:** Servidor que guarda y procesa los datos (FastAPI)
- **Base de datos:** SQLite (archivo local)

---

## 🏗️ Arquitectura General

```
┌─────────────────┐         HTTP/REST          ┌─────────────────┐
│                 │ ────────────────────────►  │                 │
│   NAVEGADOR     │    (JSON)                  │   SERVIDOR      │
│   (Frontend)    │                            │   (Backend)     │
│   React + TS    │ ◄──────────────────────── │   FastAPI       │
│                 │                            │                 │
└─────────────────┘                            └────────┬────────┘
                                                        │
                                                        ▼
                                                ┌───────────────┐
                                                │   SQLite DB   │
                                                │   (tasks.db)  │
                                                └───────────────┘
```

---

## 📁 BACKEND - FastAPI (Python)

### 📄 `backend/app/main.py`
**¿Qué hace?** Es el punto de entrada de la aplicación backend.

```python
# Lo que hace:
1. Crea la aplicación FastAPI
2. Configura CORS (permite que el frontend se conecte)
3. Registra las rutas (endpoints) de la API
4. Crea las tablas en la base de datos al iniciar
```

**Conceptos:**
- **FastAPI:** Framework para crear APIs (servicios web) en Python
- **CORS:** Configuración de seguridad que permite peticiones desde otros dominios
- **Endpoint:** Una URL que responde a peticiones (ej: `/api/tasks`)

**Ejemplo:**
```python
app = FastAPI(title="Task Manager API")  # Crea la app

# CORS permite que React (puerto 5173) hable con FastAPI (puerto 8000)
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173"])

# Incluye los endpoints de tareas
app.include_router(todos.router)
```

---

### 📄 `backend/app/database.py`
**¿Qué hace?** Configura la conexión a la base de datos.

```python
# Lo que hace:
1. Crea la conexión a SQLite (archivo tasks.db)
2. Define cómo se crean las sesiones de base de datos
3. Proporciona la función get_db() para usar en los endpoints
```

**Conceptos:**
- **SQLAlchemy:** Biblioteca que traduce Python a SQL
- **Session:** Una "conversación" temporal con la base de datos
- **Dependency Injection:** Patrón que inyecta la base de datos en las funciones

**Flujo:**
```
Endpoint solicita DB → get_db() crea sesión → Realiza operación → Cierra sesión
```

---

### 📄 `backend/app/models.py`
**¿Qué hace?** Define cómo se ve una "Tarea" en la base de datos.

```python
class Task(Base):
    id = Column(Integer, primary_key=True)    # Identificador único
    title = Column(String(200))                # Título de la tarea
    description = Column(String(1000))         # Descripción opcional
    is_completed = Column(Boolean)             # ¿Está completada?
    created_at = Column(DateTime)              # Fecha de creación
    updated_at = Column(DateTime)              # Última actualización
```

**Conceptos:**
- **ORM (Object-Relational Mapping):** Permite trabajar con objetos Python en vez de SQL
- **Primary Key:** Identificador único de cada registro
- **Column:** Una columna en la tabla de base de datos

**Tabla SQL resultante:**
```
┌────┬───────────┬─────────────┬──────────────┬─────────────┬─────────────┐
│ id │   title   │ description │ is_completed │ created_at  │ updated_at  │
├────┼───────────┼─────────────┼──────────────┼─────────────┼─────────────┤
│ 1  │ Comprar   │ En el super │    False     │ 2024-11-12  │ 2024-11-12  │
│ 2  │ Estudiar  │ Python      │    True      │ 2024-11-12  │ 2024-11-12  │
└────┴───────────┴─────────────┴──────────────┴─────────────┴─────────────┘
```

---

### 📄 `backend/app/schemas.py`
**¿Qué hace?** Define cómo lucen los datos que entran y salen de la API.

```python
# TaskCreate: Lo que el usuario envía para crear una tarea
class TaskCreate(BaseModel):
    title: str          # Obligatorio
    description: str?   # Opcional
    is_completed: bool  # Default: False

# TaskResponse: Lo que la API devuelve
class TaskResponse(BaseModel):
    id: int             # Añadido por la base de datos
    title: str
    description: str?
    is_completed: bool
    created_at: datetime
    updated_at: datetime?
```

**Conceptos:**
- **Pydantic:** Valida datos automáticamente
- **Schema:** Contrato de qué datos se esperan
- **Validation:** Si envías un texto donde debería ir un número, Pydantic lo rechaza

**Ejemplo de validación:**
```python
# ✅ Válido
{"title": "Comprar leche"}

# ❌ Inválido (title falta)
{"description": "Algo"}  # Error: title es requerido

# ❌ Inválido (title muy largo)
{"title": "A" * 300}  # Error: max 200 caracteres
```

---

### 📄 `backend/app/routers/todos.py`
**¿Qué hace?** Define todas las operaciones que se pueden hacer con tareas.

**Los 6 endpoints:**

#### 1. **GET /api/tasks** - Listar todas las tareas
```python
@router.get("/", response_model=List[TaskResponse])
def get_tasks(db: Session = Depends(get_db)):
    tasks = db.query(Task).all()  # SELECT * FROM tasks
    return tasks
```
**Uso:** El frontend llama a esto cuando carga la página.

---

#### 2. **GET /api/tasks/{id}** - Obtener una tarea específica
```python
@router.get("/{task_id}")
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task
```
**Uso:** Ver detalles de una tarea en particular.

---

#### 3. **POST /api/tasks/** - Crear nueva tarea
```python
@router.post("/", status_code=201)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    db_task = Task(**task.model_dump())  # Convierte Pydantic → SQLAlchemy
    db.add(db_task)                      # INSERT INTO tasks ...
    db.commit()                          # Guarda en la base de datos
    db.refresh(db_task)                  # Obtiene el ID generado
    return db_task
```
**Uso:** Cuando el usuario llena el formulario y hace clic en "Crear".

---

#### 4. **PUT /api/tasks/{id}** - Actualizar tarea completa
```python
@router.put("/{task_id}")
def update_task(task_id: int, task_update: TaskUpdate, db: Session):
    db_task = db.query(Task).filter(Task.id == task_id).first()

    # Actualiza solo los campos enviados
    for field, value in task_update.model_dump(exclude_unset=True).items():
        setattr(db_task, field, value)  # UPDATE tasks SET field=value

    db.commit()
    return db_task
```
**Uso:** Cuando editas el título o descripción de una tarea.

---

#### 5. **PATCH /api/tasks/{id}/complete** - Toggle completado
```python
@router.patch("/{task_id}/complete")
def toggle_task_completion(task_id: int, db: Session):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    db_task.is_completed = not db_task.is_completed  # Invierte el valor
    db.commit()
    return db_task
```
**Uso:** Cuando haces clic en el checkbox para marcar como completada.

---

#### 6. **DELETE /api/tasks/{id}** - Eliminar tarea
```python
@router.delete("/{task_id}", status_code=204)
def delete_task(task_id: int, db: Session):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    db.delete(db_task)  # DELETE FROM tasks WHERE id=task_id
    db.commit()
    return None
```
**Uso:** Cuando haces clic en el botón "Eliminar".

---

### 📄 `backend/requirements.txt`
**¿Qué hace?** Lista todas las bibliotecas Python necesarias.

```
fastapi         → Framework web
uvicorn         → Servidor para ejecutar FastAPI
sqlalchemy      → ORM para base de datos
pydantic        → Validación de datos
python-dotenv   → Manejo de variables de entorno
pytest          → Testing
httpx           → Cliente HTTP para tests
```

**Uso:**
```bash
pip install -r requirements.txt  # Instala todo
```

---

## 🎨 FRONTEND - React + TypeScript

### 📄 `frontend/src/types/task.ts`
**¿Qué hace?** Define los tipos TypeScript para las tareas.

```typescript
// Interfaz: Contrato de cómo luce una tarea
export interface Task {
  id: number;
  title: string;
  description: string | null;    // Puede ser texto o null
  is_completed: boolean;
  created_at: string;
  updated_at: string | null;
}

// Para crear una tarea nueva (sin id, created_at, etc.)
export interface TaskCreate {
  title: string;
  description?: string;          // ? = opcional
  is_completed?: boolean;
}

// Para actualizar (todos los campos opcionales)
export interface TaskUpdate {
  title?: string;
  description?: string;
  is_completed?: boolean;
}
```

**Conceptos:**
- **Interface:** Contrato que define la estructura de un objeto
- **Type Safety:** TypeScript avisa si usas mal los tipos
- **Optional (?):** El campo puede existir o no

---

### 📄 `frontend/src/services/api.ts`
**¿Qué hace?** Conecta el frontend con el backend.

```typescript
// Crea cliente Axios configurado
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' }
});

// Métodos para comunicarse con la API
export const taskApi = {
  // GET /api/tasks
  getAll: async () => {
    const response = await api.get<Task[]>('/tasks');
    return response.data;  // Retorna array de tareas
  },

  // POST /api/tasks/
  create: async (task: TaskCreate) => {
    const response = await api.post<Task>('/tasks/', task);
    return response.data;  // Retorna la tarea creada (con id)
  },

  // PUT /api/tasks/{id}
  update: async (id: number, task: TaskUpdate) => {
    const response = await api.put<Task>(`/tasks/${id}`, task);
    return response.data;
  },

  // PATCH /api/tasks/{id}/complete
  toggleComplete: async (id: number) => {
    const response = await api.patch<Task>(`/tasks/${id}/complete`);
    return response.data;
  },

  // DELETE /api/tasks/{id}
  delete: async (id: number) => {
    await api.delete(`/tasks/${id}`);
  }
};
```

**Conceptos:**
- **Axios:** Biblioteca para hacer peticiones HTTP
- **Async/Await:** Espera a que el servidor responda
- **HTTP Methods:** GET (leer), POST (crear), PUT (actualizar), DELETE (eliminar)

**Flujo de una petición:**
```
Component → taskApi.create() → axios.post() → Backend API → Database
                                                              ↓
Component ← Promise<Task>    ← JSON response ← HTTP 201    ← INSERT
```

---

### 📄 `frontend/src/hooks/useTasks.ts`
**¿Qué hace?** Hook personalizado que maneja el estado de las tareas.

```typescript
export const useTasks = () => {
  // Estado local (React)
  const [tasks, setTasks] = useState<Task[]>([]);      // Lista de tareas
  const [loading, setLoading] = useState(false);       // ¿Cargando?
  const [error, setError] = useState<string | null>(null);  // Mensaje de error

  // Obtener tareas del servidor
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await taskApi.getAll();  // Llama al backend
      setTasks(data);                       // Actualiza el estado
    } catch (err) {
      setError('Error al cargar tareas');
    } finally {
      setLoading(false);
    }
  };

  // Crear tarea
  const createTask = async (task: TaskCreate) => {
    const newTask = await taskApi.create(task);
    setTasks([newTask, ...tasks]);  // Añade al inicio de la lista
  };

  // Cargar tareas cuando el componente monta
  useEffect(() => {
    fetchTasks();
  }, []);  // [] = solo una vez al inicio

  return { tasks, loading, error, createTask, ... };
};
```

**Conceptos:**
- **Custom Hook:** Reutiliza lógica entre componentes
- **useState:** Almacena datos que cambian (estado)
- **useEffect:** Ejecuta código cuando el componente carga
- **Async/Await:** Espera respuestas del servidor

**Diagrama de flujo:**
```
Componente monta
    ↓
useEffect se ejecuta
    ↓
fetchTasks() llama API
    ↓
setTasks() actualiza estado
    ↓
React re-renderiza con nuevos datos
```

---

### 📄 `frontend/src/components/TaskForm.tsx`
**¿Qué hace?** Formulario para crear nuevas tareas.

```typescript
export const TaskForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');           // Estado del input título
  const [description, setDescription] = useState('');  // Estado del textarea
  const [submitting, setSubmitting] = useState(false); // ¿Enviando?

  const handleSubmit = async (e) => {
    e.preventDefault();  // Previene recarga de página

    setSubmitting(true);
    try {
      await onSubmit({ title, description });  // Llama función del padre
      setTitle('');           // Limpia el formulario
      setDescription('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}  // Actualiza estado
        maxLength={200}
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button disabled={submitting || !title.trim()}>
        {submitting ? 'Creando...' : 'Crear Tarea'}
      </button>
    </form>
  );
};
```

**Conceptos:**
- **Controlled Component:** React controla el valor del input
- **onChange:** Se ejecuta cada vez que escribes
- **onSubmit:** Se ejecuta al enviar el formulario
- **Validation:** Deshabilita botón si no hay título

**Flujo:**
```
Usuario escribe → onChange actualiza estado → React re-renderiza input
Usuario envía   → handleSubmit llama onSubmit → createTask en hook
                                                → API crea tarea
                                                → Formulario se limpia
```

---

### 📄 `frontend/src/components/TaskItem.tsx`
**¿Qué hace?** Muestra una tarea individual con opciones de editar/eliminar.

```typescript
export const TaskItem = ({ task, onToggle, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);  // Modo edición
  const [editTitle, setEditTitle] = useState(task.title);

  // Si está en modo edición
  if (isEditing) {
    return (
      <div>
        <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
        <button onClick={async () => {
          await onUpdate(task.id, { title: editTitle });
          setIsEditing(false);
        }}>
          Guardar
        </button>
      </div>
    );
  }

  // Modo normal (no edición)
  return (
    <div className={task.is_completed ? 'opacity-70' : ''}>
      {/* Checkbox para marcar completada */}
      <input
        type="checkbox"
        checked={task.is_completed}
        onChange={() => onToggle(task.id)}
      />

      {/* Título con tachado si está completada */}
      <h3 className={task.is_completed ? 'line-through' : ''}>
        {task.title}
      </h3>

      <button onClick={() => setIsEditing(true)}>Editar</button>
      <button onClick={() => {
        if (confirm('¿Eliminar?')) onDelete(task.id);
      }}>
        Eliminar
      </button>
    </div>
  );
};
```

**Conceptos:**
- **Conditional Rendering:** Muestra diferentes vistas según el estado
- **Callbacks:** onToggle, onDelete se definen en el componente padre
- **CSS Classes dinámicas:** Aplica estilos según condiciones

---

### 📄 `frontend/src/components/TaskList.tsx`
**¿Qué hace?** Muestra la lista completa de tareas.

```typescript
export const TaskList = ({ tasks, loading, error, onToggle, onDelete, onUpdate }) => {
  // Estado de carga
  if (loading) {
    return <div>Cargando tareas...</div>;
  }

  // Estado de error
  if (error) {
    return <div className="error">{error}</div>;
  }

  // Sin tareas
  if (tasks.length === 0) {
    return <div>No hay tareas todavía</div>;
  }

  // Separar tareas pendientes y completadas
  const pendingTasks = tasks.filter(t => !t.is_completed);
  const completedTasks = tasks.filter(t => t.is_completed);

  return (
    <div>
      <h2>Pendientes ({pendingTasks.length})</h2>
      {pendingTasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}

      <h2>Completadas ({completedTasks.length})</h2>
      {completedTasks.map(task => (
        <TaskItem key={task.id} task={task} ... />
      ))}
    </div>
  );
};
```

**Conceptos:**
- **Array.filter():** Filtra elementos por condición
- **Array.map():** Transforma cada elemento en un componente
- **key prop:** Ayuda a React identificar elementos únicos

---

### 📄 `frontend/src/App.tsx`
**¿Qué hace?** Componente principal que une todo.

```typescript
function App() {
  // Hook personalizado con toda la lógica
  const {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion
  } = useTasks();

  return (
    <div>
      <h1>Task Manager</h1>

      {/* Formulario para crear */}
      <TaskForm onSubmit={createTask} />

      {/* Lista de tareas */}
      <TaskList
        tasks={tasks}
        loading={loading}
        error={error}
        onToggle={toggleTaskCompletion}
        onDelete={deleteTask}
        onUpdate={updateTask}
      />
    </div>
  );
}
```

**Arquitectura de componentes:**
```
App
├── TaskForm (crear)
│   └── inputs + button
└── TaskList (listar)
    ├── Pendientes
    │   ├── TaskItem 1
    │   ├── TaskItem 2
    │   └── TaskItem 3
    └── Completadas
        └── TaskItem 4
```

---

## 🐳 DOCKER

### 📄 `backend/Dockerfile`
**¿Qué hace?** Convierte el backend en un contenedor Docker.

```dockerfile
# Etapa 1: Build (construcción)
FROM python:3.11-slim as builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --user -r requirements.txt  # Instala en carpeta usuario

# Etapa 2: Runtime (ejecución)
FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /root/.local /root/.local  # Copia solo dependencias
COPY ./app ./app                                # Copia código
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Conceptos:**
- **Multi-stage build:** Reduce tamaño de la imagen final
- **WORKDIR:** Directorio de trabajo dentro del contenedor
- **COPY:** Copia archivos del host al contenedor
- **CMD:** Comando que ejecuta al iniciar

---

### 📄 `frontend/Dockerfile`
**¿Qué hace?** Convierte el frontend en un contenedor con Nginx.

```dockerfile
# Etapa 1: Build de React
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci                    # Instala dependencias
COPY . .
RUN npm run build            # Crea build de producción (dist/)

# Etapa 2: Nginx para servir archivos estáticos
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html  # Copia build
COPY nginx.conf /etc/nginx/conf.d/default.conf      # Config nginx
CMD ["nginx", "-g", "daemon off;"]
```

**Flujo:**
```
Source code → npm build → dist/ (HTML, CSS, JS minificados)
                          ↓
                     Nginx sirve archivos estáticos
```

---

### 📄 `docker-compose.yml`
**¿Qué hace?** Orquesta backend y frontend juntos.

```yaml
services:
  backend:
    build: ./backend          # Construye desde Dockerfile
    ports:
      - "8000:8000"          # Puerto host:contenedor
    volumes:
      - ./backend/app:/app/app     # Sincroniza código (hot reload)
    networks:
      - task-manager-network

  frontend:
    build: ./frontend
    ports:
      - "80:80"              # Frontend en puerto 80
    depends_on:
      - backend              # Espera a que backend inicie
    networks:
      - task-manager-network

networks:
  task-manager-network:      # Red privada entre contenedores
```

**Conceptos:**
- **Service:** Un contenedor (backend o frontend)
- **Ports:** Mapea puerto del contenedor al host
- **Volumes:** Sincroniza carpetas (cambios en código se reflejan)
- **Networks:** Permite comunicación entre contenedores
- **depends_on:** Define orden de inicio

**Arquitectura Docker:**
```
┌─────────────────────────────────────┐
│         Docker Host                 │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  task-manager-network        │  │
│  │                              │  │
│  │  ┌─────────────┐  ┌────────┐│  │
│  │  │  Backend    │  │Frontend││  │
│  │  │  :8000      │  │  :80   ││  │
│  │  │  FastAPI    │  │  Nginx ││  │
│  │  └──────┬──────┘  └────────┘│  │
│  │         │                    │  │
│  │         ▼                    │  │
│  │   ┌──────────┐              │  │
│  │   │tasks.db  │              │  │
│  │   └──────────┘              │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

---

## 🎨 TAILWIND CSS

### 📄 `tailwind.config.js`
**¿Qué hace?** Configura TailwindCSS.

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // Archivos donde buscar clases
  ],
  theme: {
    extend: {},  // Puedes extender colores, fuentes, etc.
  },
  plugins: [],
}
```

**Ejemplo de uso:**
```tsx
<div className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700">
  {/*
    bg-blue-600:     Fondo azul
    text-white:      Texto blanco
    p-4:             Padding de 1rem
    rounded-lg:      Bordes redondeados
    hover:bg-blue-700: Fondo más oscuro al pasar mouse
  */}
  Botón
</div>
```

**Ventaja:** No escribes CSS, usas clases predefinidas.

---

## 🔄 Flujo Completo de una Operación

### Ejemplo: Crear una tarea

```
1. Usuario escribe en TaskForm
   └─► Estado local: title = "Comprar leche"

2. Usuario hace clic en "Crear"
   └─► handleSubmit() llama onSubmit({ title: "Comprar leche" })

3. onSubmit es createTask del hook useTasks
   └─► createTask llama taskApi.create()

4. taskApi.create() hace petición HTTP
   └─► POST http://localhost:8000/api/tasks/
       Body: {"title": "Comprar leche"}

5. Backend (FastAPI) recibe la petición
   └─► @router.post("/") ejecuta create_task()

6. create_task valida con Pydantic
   └─► TaskCreate schema valida que title existe

7. SQLAlchemy inserta en base de datos
   └─► INSERT INTO tasks (title, is_completed, created_at)
       VALUES ('Comprar leche', False, '2024-11-12 10:30:00')

8. Backend retorna la tarea creada
   └─► HTTP 201 Created
       Body: {"id": 1, "title": "Comprar leche", ...}

9. Frontend recibe la respuesta
   └─► taskApi.create() retorna Task object

10. Hook actualiza estado
    └─► setTasks([newTask, ...tasks])

11. React detecta cambio de estado
    └─► Re-renderiza TaskList

12. TaskList muestra nueva tarea
    └─► Usuario ve "Comprar leche" en pantalla
```

---

## 📊 Resumen de Tecnologías

| Tecnología | Propósito | Alternativas |
|------------|-----------|--------------|
| **FastAPI** | Framework backend | Flask, Django |
| **SQLAlchemy** | ORM (base de datos) | Django ORM, Prisma |
| **Pydantic** | Validación de datos | Marshmallow, Cerberus |
| **SQLite** | Base de datos | PostgreSQL, MySQL |
| **React** | Librería UI | Vue, Angular, Svelte |
| **TypeScript** | JavaScript con tipos | JavaScript puro |
| **Vite** | Build tool | Webpack, Parcel |
| **TailwindCSS** | Framework CSS | Bootstrap, Material-UI |
| **Axios** | Cliente HTTP | Fetch API, ky |
| **Docker** | Contenedores | Podman, LXC |

---

## 🎓 Conceptos Clave

### REST API
**Qué es:** Estilo de arquitectura para APIs web.

**Principios:**
- Usa HTTP methods (GET, POST, PUT, DELETE)
- Recursos identificados por URLs (`/api/tasks/1`)
- Sin estado (cada petición es independiente)
- Formato JSON para datos

**Ejemplo:**
```
GET    /api/tasks     → Listar todos
POST   /api/tasks     → Crear nuevo
GET    /api/tasks/1   → Obtener uno
PUT    /api/tasks/1   → Actualizar completo
PATCH  /api/tasks/1   → Actualizar parcial
DELETE /api/tasks/1   → Eliminar
```

---

### CRUD
**Create, Read, Update, Delete** - Operaciones básicas en datos.

| Operación | HTTP Method | SQL | Descripción |
|-----------|-------------|-----|-------------|
| Create | POST | INSERT | Crear nuevo registro |
| Read | GET | SELECT | Leer registros |
| Update | PUT/PATCH | UPDATE | Modificar registro |
| Delete | DELETE | DELETE | Eliminar registro |

---

### ORM (Object-Relational Mapping)
**Qué es:** Traduce entre objetos Python y tablas SQL.

**Sin ORM (SQL manual):**
```python
cursor.execute("INSERT INTO tasks (title) VALUES (?)", ("Comprar leche",))
```

**Con ORM (SQLAlchemy):**
```python
task = Task(title="Comprar leche")
db.add(task)
db.commit()
```

---

### SPA (Single Page Application)
**Qué es:** Aplicación web que carga una sola página HTML.

**Tradicional:**
```
Click link → Server genera HTML → Browser muestra nueva página (reload)
```

**SPA (React):**
```
Click link → JavaScript cambia contenido → Sin reload
```

**Ventajas:**
- Más rápido (no recarga página)
- Mejor experiencia de usuario
- Aplicación se siente como app nativa

---

## 🔍 Debugging

### Ver qué está pasando en el Backend
```bash
# Ver logs en tiempo real
cd backend
uvicorn app.main:app --reload --log-level debug

# Inspeccionar base de datos
sqlite3 tasks.db
SELECT * FROM tasks;
```

### Ver qué está pasando en el Frontend
```javascript
// En cualquier componente
console.log('Tasks:', tasks);
console.log('Loading:', loading);

// En DevTools del navegador
// Network tab: Ver peticiones HTTP
// Console tab: Ver logs
// React DevTools: Ver estado de componentes
```

---

## 🚀 Próximos Pasos

Si quisieras extender el proyecto:

1. **Autenticación:** Login de usuarios
2. **Categorías:** Organizar tareas por categoría
3. **Fechas límite:** Agregar deadlines
4. **Prioridades:** Tareas urgentes vs normales
5. **Búsqueda:** Filtrar tareas por texto
6. **Compartir:** Colaboración entre usuarios
7. **Notificaciones:** Recordatorios
8. **Dark mode:** Tema oscuro

---

**¿Tienes preguntas sobre alguna parte específica?** 😊
