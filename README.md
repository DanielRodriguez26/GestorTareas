# Task Manager - Full Stack Application

![FastAPI](https://img.shields.io/badge/FastAPI-0.115.0-009688?logo=fastapi)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

Una aplicación completa de gestión de tareas construida con **FastAPI** (Python) en el backend y **React + TypeScript** en el frontend.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tech Stack](#-tech-stack)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [API Endpoints](#-api-endpoints)
- [Docker](#-docker)
- [Testing](#-testing)
- [Desarrollo](#-desarrollo)

---

## ✨ Características

### Funcionalidades Principales
- ✅ **Crear tareas** con título y descripción opcional
- 📝 **Editar tareas** con actualización inline
- ✔️ **Marcar tareas como completadas**
- 🗑️ **Eliminar tareas** con confirmación
- 📊 **Visualización organizada** (pendientes y completadas)
- 📱 **Diseño responsive** para móviles y tablets
- 🔄 **Actualizaciones en tiempo real**
- 💾 **Persistencia** con base de datos SQLite

### Características Técnicas
- 🚀 API RESTful con FastAPI
- 🎨 Interfaz moderna con TailwindCSS
- 🔒 Validación de datos con Pydantic
- 📚 Documentación automática (Swagger/ReDoc)
- 🐳 Dockerización completa
- 🔧 TypeScript para type safety
- 🎯 Custom hooks para gestión de estado

---

## 🛠 Tech Stack

### Backend
- **[FastAPI](https://fastapi.tiangolo.com/)** - Framework web async moderno
- **[SQLAlchemy](https://www.sqlalchemy.org/)** - ORM para Python
- **[Pydantic](https://docs.pydantic.dev/)** - Validación de datos
- **[Uvicorn](https://www.uvicorn.org/)** - Servidor ASGI
- **SQLite** - Base de datos ligera

### Frontend
- **[React 18](https://react.dev/)** - Librería de UI
- **[TypeScript](https://www.typescriptlang.org/)** - Superset de JavaScript con tipos
- **[Vite](https://vitejs.dev/)** - Build tool ultra-rápido
- **[TailwindCSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Axios](https://axios-http.com/)** - Cliente HTTP

### DevOps
- **Docker** - Contenedorización
- **Docker Compose** - Orquestación de servicios
- **Nginx** - Servidor web para producción

---

## 🚀 Instalación

### Prerrequisitos

- **Python 3.11+**
- **Node.js 18+** y npm
- **Git**
- **Docker** y Docker Compose (opcional)

### Backend Setup

```bash
# 1. Ir a la carpeta backend
cd backend

# 2. Crear entorno virtual
python -m venv venv

# 3. Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En Linux/Mac:
source venv/bin/activate

# 4. Instalar dependencias
pip install -r requirements.txt

# 5. Iniciar servidor
uvicorn app.main:app --reload
```

El backend estará disponible en: **http://localhost:8000**

### Frontend Setup

```bash
# 1. Ir a la carpeta frontend
cd frontend

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en: **http://localhost:5173**

---

## 🎯 Uso

### Desarrollo Local

#### 1. Iniciar Backend
```bash
cd backend
source venv/bin/activate  # o venv\Scripts\activate en Windows
uvicorn app.main:app --reload
```

#### 2. Iniciar Frontend (en otra terminal)
```bash
cd frontend
npm run dev
```

#### 3. Acceder a la aplicación
- **Frontend:** http://localhost:5173
- **API Docs (Swagger):** http://localhost:8000/docs
- **API Docs (ReDoc):** http://localhost:8000/redoc
- **Health Check:** http://localhost:8000/health

### Producción con Docker

```bash
# Construir e iniciar todos los servicios
docker-compose up --build

# Ejecutar en segundo plano
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

Acceder a: **http://localhost**

---

## 📡 API Endpoints

### Base URL
```
http://localhost:8000/api
```

### Endpoints Disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/tasks` | Obtener todas las tareas |
| `GET` | `/tasks/{id}` | Obtener una tarea específica |
| `POST` | `/tasks/` | Crear una nueva tarea |
| `PUT` | `/tasks/{id}` | Actualizar una tarea completa |
| `PATCH` | `/tasks/{id}/complete` | Toggle estado de completado |
| `DELETE` | `/tasks/{id}` | Eliminar una tarea |

### Ejemplos de Uso

#### Crear Tarea
```bash
curl -X POST "http://localhost:8000/api/tasks/" \
  -H "Content-Type: application/json" \
  -d '{"title": "Comprar leche", "description": "En el supermercado"}'
```

#### Obtener Todas las Tareas
```bash
curl -X GET "http://localhost:8000/api/tasks/"
```

---

## 🐳 Docker

### Inicio Rápido con Docker

La forma más fácil de ejecutar la aplicación es usando Docker. Todo está preconfigurado y listo para usar.

#### Opción 1: Scripts de PowerShell (Windows - RECOMENDADO)

Hemos creado scripts para facilitar el uso de Docker en Windows:

```powershell
# Iniciar la aplicación (construye e inicia todos los servicios)
.\docker-start.ps1

# Ver logs en tiempo real
.\docker-logs.ps1

# Ver logs de un servicio específico
.\docker-logs.ps1 -Service backend
.\docker-logs.ps1 -Service frontend
.\docker-logs.ps1 -Service postgres

# Detener la aplicación
.\docker-stop.ps1
```

#### Opción 2: Comandos Docker Compose Directos

```bash
# Construir e iniciar todos los servicios
docker compose up --build -d

# Ver el estado de los contenedores
docker compose ps

# Ver logs de todos los servicios
docker compose logs -f

# Ver logs de un servicio específico
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres

# Detener servicios
docker compose down

# Detener y eliminar volúmenes (base de datos)
docker compose down -v
```

### Servicios Docker

La aplicación se compone de 3 servicios:

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| **frontend** | 80 | React + TypeScript + Nginx |
| **backend** | 8000 | FastAPI + Python |
| **postgres** | 5432 | PostgreSQL 16 |

### URLs de Acceso

Una vez iniciados los contenedores:

- **Frontend:** http://localhost
- **Backend API:** http://localhost:8000
- **API Docs (Swagger):** http://localhost:8000/docs
- **API Docs (ReDoc):** http://localhost:8000/redoc
- **PostgreSQL:** localhost:5432
  - User: `postgres`
  - Password: `postgres`
  - Database: `gestortareas`

### Configuración de Docker Desktop

Si recibes un error de que Docker no está disponible en WSL:

1. **Instala Docker Desktop** desde: https://www.docker.com/products/docker-desktop
2. **Abre Docker Desktop** → Settings ⚙️
3. **Ve a Resources** → **WSL Integration**
4. **Activa:** "Enable integration with my default WSL distro"
5. **Marca** tu distribución de Ubuntu/WSL
6. **Haz clic en** "Apply & Restart"

### Verificar Health Checks

Los contenedores tienen health checks configurados. Para ver el estado:

```bash
docker compose ps
```

Deberías ver algo como:
```
NAME                      STATUS
task-manager-backend      Up (healthy)
task-manager-frontend     Up (healthy)
task-manager-postgres     Up (healthy)
```

### Troubleshooting Docker

**Problema:** Los contenedores no inician correctamente

```bash
# Ver logs detallados
docker compose logs

# Reconstruir desde cero
docker compose down -v
docker compose up --build
```

**Problema:** Puerto ya en uso

```bash
# Ver qué proceso usa el puerto 80
netstat -ano | findstr :80

# O cambiar el puerto en docker-compose.yml
ports:
  - "8080:80"  # Cambia el primer número
```

**Problema:** La base de datos no tiene datos

Los datos se persisten en un volumen Docker. Para resetear:

```bash
docker compose down -v  # Elimina volúmenes
docker compose up --build -d  # Inicia desde cero
```

---

## 🧪 Testing

### Backend Tests (Pytest)

```bash
cd backend
source venv/bin/activate
pytest tests/ -v
```

### Frontend

```bash
cd frontend
npm run lint
npx tsc --noEmit
```

---

## 📞 Soporte

Si encuentras algún problema:
1. Revisa la [documentación de la API](http://localhost:8000/docs)
2. Verifica los logs: `docker-compose logs -f`

---

**Desarrollado con FastAPI + React + TypeScript** 🚀
