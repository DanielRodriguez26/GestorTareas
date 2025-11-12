# Comandos Útiles - Task Manager

## 🚀 Inicio Rápido

### Opción 1: Docker Compose (Recomendado)
```bash
# Iniciar todo el stack
docker-compose up --build

# Ejecutar en segundo plano
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v
```

### Opción 2: Desarrollo Local

#### Backend (Terminal 1)
```bash
cd backend

# Crear entorno virtual (solo primera vez)
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependencias (solo primera vez)
pip install -r requirements.txt

# Iniciar servidor de desarrollo
uvicorn app.main:app --reload

# O con host y puerto específicos
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### Frontend (Terminal 2)
```bash
cd frontend

# Instalar dependencias (solo primera vez)
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview build de producción
npm run preview
```

---

## 🧪 Testing

### Backend (pytest)
```bash
cd backend
source venv/bin/activate  # Activar entorno virtual

# Instalar dependencias de testing
pip install pytest httpx

# Ejecutar todos los tests
pytest tests/ -v

# Ejecutar con cobertura
pytest tests/ --cov=app --cov-report=html

# Ejecutar test específico
pytest tests/test_tasks.py::test_create_task -v

# Ver cobertura en navegador
open htmlcov/index.html  # Mac
start htmlcov/index.html # Windows
```

### Frontend (linting y type checking)
```bash
cd frontend

# Linting
npm run lint

# Fix automático de linting
npm run lint -- --fix

# Type checking
npx tsc --noEmit

# Verificar build
npm run build
```

---

## 🐳 Docker - Comandos Avanzados

### Construcción
```bash
# Construir sin cache
docker-compose build --no-cache

# Construir solo un servicio
docker-compose build backend
docker-compose build frontend

# Construir imagen individual
docker build -t task-manager-backend ./backend
docker build -t task-manager-frontend ./frontend
```

### Gestión de Contenedores
```bash
# Listar contenedores en ejecución
docker-compose ps

# Entrar a un contenedor
docker-compose exec backend bash
docker-compose exec frontend sh

# Ejecutar comando en contenedor
docker-compose exec backend python --version
docker-compose exec frontend node --version

# Reiniciar un servicio
docker-compose restart backend
docker-compose restart frontend

# Ver uso de recursos
docker stats
```

### Limpieza
```bash
# Eliminar contenedores detenidos
docker-compose rm

# Limpiar todo (contenedores, volúmenes, redes)
docker-compose down -v --rmi all

# Limpiar sistema Docker (cuidado!)
docker system prune -a --volumes
```

---

## 📡 Testing de API

### Con curl
```bash
# Health check
curl http://localhost:8000/health

# Listar todas las tareas
curl http://localhost:8000/api/tasks

# Crear tarea
curl -X POST http://localhost:8000/api/tasks/ \
  -H "Content-Type: application/json" \
  -d '{"title": "Mi primera tarea", "description": "Descripción de prueba"}'

# Obtener tarea por ID
curl http://localhost:8000/api/tasks/1

# Actualizar tarea
curl -X PUT http://localhost:8000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Tarea actualizada", "is_completed": true}'

# Toggle completado
curl -X PATCH http://localhost:8000/api/tasks/1/complete

# Eliminar tarea
curl -X DELETE http://localhost:8000/api/tasks/1
```

### Con httpie (más legible)
```bash
# Instalar httpie
pip install httpie

# Listar tareas
http GET http://localhost:8000/api/tasks

# Crear tarea
http POST http://localhost:8000/api/tasks/ \
  title="Mi tarea" \
  description="Descripción"

# Actualizar
http PUT http://localhost:8000/api/tasks/1 \
  title="Actualizada" \
  is_completed:=true
```

---

## 🔍 Debugging

### Backend
```bash
# Ver logs de uvicorn
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --log-level debug

# Modo debug de Python
PYTHONDONTWRITEBYTECODE=1 uvicorn app.main:app --reload

# Inspeccionar base de datos SQLite
sqlite3 backend/tasks.db
# Dentro de sqlite:
.tables
SELECT * FROM tasks;
.exit
```

### Frontend
```bash
# Ver build en modo debug
npm run dev -- --debug

# Inspeccionar bundle
npm run build -- --mode development
npx vite preview

# Clear cache de Vite
rm -rf node_modules/.vite
npm run dev
```

---

## 📦 Gestión de Dependencias

### Backend
```bash
cd backend
source venv/bin/activate

# Actualizar una dependencia
pip install --upgrade fastapi

# Agregar nueva dependencia
pip install nueva-libreria
pip freeze > requirements.txt

# Ver dependencias instaladas
pip list

# Ver dependencias desactualizadas
pip list --outdated
```

### Frontend
```bash
cd frontend

# Actualizar una dependencia
npm update axios

# Agregar nueva dependencia
npm install nueva-libreria

# Agregar dev dependency
npm install -D nueva-dev-libreria

# Ver dependencias desactualizadas
npm outdated

# Actualizar todas (cuidado!)
npm update
```

---

## 🚨 Solución de Problemas Comunes

### Backend no arranca
```bash
# Verificar puerto 8000 no esté ocupado
# Linux/Mac:
lsof -i :8000
# Windows:
netstat -ano | findstr :8000

# Cambiar puerto temporalmente
uvicorn app.main:app --port 8001 --reload
```

### Frontend no conecta al backend
```bash
# Verificar CORS en backend/app/main.py
# Verificar variable de entorno
echo $VITE_API_URL

# Verificar backend está corriendo
curl http://localhost:8000/health
```

### Docker no inicia
```bash
# Ver logs detallados
docker-compose up --build --verbose

# Reconstruir desde cero
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### SQLite bloqueado
```bash
# Eliminar archivo de base de datos
rm backend/tasks.db

# Reiniciar backend (recreará la DB)
uvicorn app.main:app --reload
```

---

## 🔧 Configuración del Entorno

### Variables de Entorno - Backend
```bash
# Crear archivo .env en backend/
cat > backend/.env << EOF
DATABASE_URL=sqlite:///./tasks.db
ENVIRONMENT=development
DEBUG=True
EOF
```

### Variables de Entorno - Frontend
```bash
# Crear archivo .env en frontend/
cat > frontend/.env << EOF
VITE_API_URL=http://localhost:8000/api
EOF
```

---

## 📊 Monitoreo

### Logs en tiempo real
```bash
# Backend
tail -f backend/logs/app.log

# Docker logs con timestamp
docker-compose logs -f --tail=100 --timestamps
```

### Estadísticas de Docker
```bash
# Uso de recursos
docker stats

# Inspeccionar contenedor
docker inspect task-manager-backend
```

---

## 🎯 Producción

### Build para producción
```bash
# Backend
cd backend
pip install -r requirements.txt
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker

# Frontend
cd frontend
npm run build
# Los archivos estarán en dist/
```

### Deploy con Docker
```bash
# Producción con Docker Compose
docker-compose -f docker-compose.yml up -d

# Ver logs de producción
docker-compose logs -f --tail=50
```

---

## 📝 Git

### Comandos básicos
```bash
# Ver estado
git status

# Agregar cambios
git add .

# Commit
git commit -m "descripción del cambio"

# Push
git push origin main

# Ver historial
git log --oneline --graph --all
```

---

**¡Usa estos comandos según lo necesites!** 🚀
