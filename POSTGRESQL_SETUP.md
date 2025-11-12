# Configuración de PostgreSQL para Task Manager

## Resumen de Cambios

El backend ha sido migrado de SQLite a PostgreSQL para mejor rendimiento, escalabilidad y características empresariales.

## Configuración Local (Desarrollo)

### Opción 1: Usar PostgreSQL Local

1. **Instalar PostgreSQL** (si no lo tienes):
   ```bash
   # Windows (usando chocolatey)
   choco install postgresql

   # macOS
   brew install postgresql

   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   ```

2. **Crear la base de datos**:
   ```bash
   # Conectarse a PostgreSQL
   psql -U postgres

   # Crear la base de datos
   CREATE DATABASE gestortareas;

   # Salir
   \q
   ```

3. **Instalar dependencias de Python**:
   ```bash
   # Activar el entorno virtual
   .venv\Scripts\activate  # Windows
   source .venv/bin/activate  # Linux/macOS

   # Instalar dependencias
   pip install -r backend/requirements.txt
   ```

4. **Configurar variables de entorno**:

   El archivo `backend/.env` ya está configurado con valores por defecto:
   ```env
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   POSTGRES_DB=gestortareas
   USE_SQLITE=false
   ```

5. **Ejecutar el backend** (con F5 en VS Code o manualmente):
   ```bash
   cd backend
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Opción 2: Usar SQLite (Fallback para Desarrollo)

Si no quieres usar PostgreSQL localmente, puedes usar SQLite:

1. **Modificar `backend/.env`**:
   ```env
   USE_SQLITE=true
   ```

2. **Ejecutar el backend**:
   ```bash
   cd backend
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

## Configuración con Docker

### Usando Docker Compose (Recomendado para Producción)

1. **Levantar todos los servicios**:
   ```bash
   docker-compose up -d
   ```

   Esto iniciará:
   - PostgreSQL en puerto 5432
   - Backend (FastAPI) en puerto 8000
   - Frontend (React) en puerto 80

2. **Ver logs**:
   ```bash
   # Todos los servicios
   docker-compose logs -f

   # Solo PostgreSQL
   docker-compose logs -f postgres

   # Solo Backend
   docker-compose logs -f backend
   ```

3. **Conectarse a PostgreSQL**:
   ```bash
   docker exec -it task-manager-postgres psql -U postgres -d gestortareas
   ```

4. **Detener servicios**:
   ```bash
   docker-compose down
   ```

5. **Detener y eliminar datos**:
   ```bash
   docker-compose down -v
   ```

## Debugging con F5 en VS Code

La configuración de launch.json ya está lista para usar PostgreSQL:

1. **Asegúrate de tener PostgreSQL corriendo localmente** o **configura USE_SQLITE=true**

2. **Presiona F5** en VS Code

3. **Selecciona**: "FastAPI: Backend (Debug)"

4. El backend se iniciará en http://localhost:8000 con:
   - Hot reload habilitado
   - Debugger adjunto
   - Logs en la terminal integrada

## Verificación de la Instalación

1. **Health Check**:
   ```bash
   curl http://localhost:8000/health
   ```

   Respuesta esperada:
   ```json
   {
     "status": "healthy",
     "service": "task-manager-api"
   }
   ```

2. **Documentación API**:
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

3. **Verificar conexión a PostgreSQL**:
   ```bash
   # Desde el host
   psql -U postgres -d gestortareas -c "SELECT version();"

   # Desde Docker
   docker exec -it task-manager-postgres psql -U postgres -d gestortareas -c "SELECT version();"
   ```

## Estructura de la Base de Datos

Las tablas se crean automáticamente al iniciar el backend gracias a SQLAlchemy:

```sql
-- Tabla de tareas
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Comandos Útiles de PostgreSQL

```bash
# Conectarse a la base de datos
psql -U postgres -d gestortareas

# Listar todas las tablas
\dt

# Describir estructura de una tabla
\d tasks

# Ver todas las tareas
SELECT * FROM tasks;

# Contar tareas
SELECT COUNT(*) FROM tasks;

# Ver tareas completadas
SELECT * FROM tasks WHERE is_completed = true;

# Salir
\q
```

## Migración de Datos desde SQLite

Si tenías datos en SQLite y quieres migrarlos a PostgreSQL:

```python
# Script de migración (crear como migrate_data.py)
import sqlite3
import psycopg2
from datetime import datetime

# Conectar a SQLite
sqlite_conn = sqlite3.connect('tasks.db')
sqlite_cursor = sqlite_conn.cursor()

# Conectar a PostgreSQL
pg_conn = psycopg2.connect(
    dbname='gestortareas',
    user='postgres',
    password='postgres',
    host='localhost',
    port='5432'
)
pg_cursor = pg_conn.cursor()

# Obtener datos de SQLite
sqlite_cursor.execute("SELECT id, title, description, is_completed, created_at, updated_at FROM tasks")
tasks = sqlite_cursor.fetchall()

# Insertar en PostgreSQL
for task in tasks:
    pg_cursor.execute(
        """
        INSERT INTO tasks (id, title, description, is_completed, created_at, updated_at)
        VALUES (%s, %s, %s, %s, %s, %s)
        """,
        task
    )

pg_conn.commit()
print(f"Migradas {len(tasks)} tareas exitosamente")

# Cerrar conexiones
sqlite_conn.close()
pg_conn.close()
```

## Troubleshooting

### Error: "could not connect to server"
- Verifica que PostgreSQL esté corriendo: `pg_isready -U postgres`
- Verifica el puerto: `netstat -an | grep 5432`
- Revisa las credenciales en `.env`

### Error: "database does not exist"
- Crea la base de datos: `createdb -U postgres gestortareas`

### Error: "psycopg2" no instalado
- Instala: `pip install psycopg2-binary`

### Quiero volver a SQLite temporalmente
- Cambia `USE_SQLITE=true` en `backend/.env`
- Reinicia el backend

## Seguridad en Producción

Para producción, NUNCA uses las credenciales por defecto:

1. **Cambia la contraseña de PostgreSQL**:
   ```sql
   ALTER USER postgres WITH PASSWORD 'nueva_contraseña_segura';
   ```

2. **Actualiza las variables de entorno**:
   ```env
   POSTGRES_PASSWORD=nueva_contraseña_segura
   ```

3. **Usa secretos de Docker/Kubernetes** en lugar de variables de entorno planas

4. **Habilita SSL/TLS** para conexiones a la base de datos

## Recursos Adicionales

- [Documentación PostgreSQL](https://www.postgresql.org/docs/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [FastAPI Database Guide](https://fastapi.tiangolo.com/tutorial/sql-databases/)
