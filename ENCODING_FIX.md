# Solución al Error UnicodeDecodeError

## Problema

```
UnicodeDecodeError: 'utf-8' codec can't decode byte 0xf3 in position 85: invalid continuation byte
```

Este error ocurre cuando Python intenta leer archivos con una codificación incorrecta.

## Soluciones Implementadas

### 1. **Declaración de Codificación UTF-8 en Archivos Python**

Todos los archivos Python ahora tienen la declaración de codificación UTF-8:

```python
# -*- coding: utf-8 -*-
```

**Archivos modificados:**
- `backend/app/database.py`
- `backend/app/main.py`
- `backend/app/models.py`
- `backend/app/schemas.py`
- `backend/app/routers/todos.py`

### 2. **Carga Explícita de .env con UTF-8**

En `backend/app/database.py`:

```python
from pathlib import Path

env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path, encoding='utf-8')
```

### 3. **Variables de Entorno en launch.json**

Agregadas variables para forzar UTF-8:

```json
"env": {
    "PYTHONPATH": "${workspaceFolder}",
    "PYTHONUNBUFFERED": "1",
    "PYTHONIOENCODING": "utf-8",
    "PYTHONUTF8": "1"
}
```

### 4. **Configuración de VS Code**

En `.vscode/settings.json`:

```json
"files.encoding": "utf8",
"files.autoGuessEncoding": false,
"[python]": {
    "files.encoding": "utf8"
}
```

## Verificación

Para verificar que todo está configurado correctamente:

```bash
# Verificar codificación de archivos
file backend/app/*.py

# Verificar codificación del .env
file backend/.env

# Todos deberían mostrar: "UTF-8 Unicode text" o "ASCII text"
```

## Si el Error Persiste

### Opción 1: Verificar el archivo .env

```bash
# Convertir .env a UTF-8
iconv -f ISO-8859-1 -t UTF-8 backend/.env -o backend/.env.new
mv backend/.env.new backend/.env
```

### Opción 2: Usar SQLite Temporalmente

Si el problema es con PostgreSQL, puedes usar SQLite temporalmente:

1. Edita `backend/.env`:
   ```env
   USE_SQLITE=true
   ```

2. Reinicia el backend con F5

### Opción 3: Establecer Variables de Entorno del Sistema

**Windows:**
```powershell
# PowerShell (como Administrador)
[System.Environment]::SetEnvironmentVariable('PYTHONIOENCODING', 'utf-8', 'Machine')
[System.Environment]::SetEnvironmentVariable('PYTHONUTF8', '1', 'Machine')
```

**Linux/macOS:**
```bash
# Agregar a ~/.bashrc o ~/.zshrc
export PYTHONIOENCODING=utf-8
export PYTHONUTF8=1
```

### Opción 4: Reinstalar Dependencias

```bash
# Activar entorno virtual
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Linux/macOS

# Reinstalar con encoding UTF-8
pip install --force-reinstall --no-cache-dir -r backend/requirements.txt
```

## Prevención Futura

1. **Siempre usar UTF-8** para archivos de texto
2. **Evitar caracteres especiales** en nombres de variables o valores en .env
3. **Verificar la codificación** antes de commitear cambios:
   ```bash
   file backend/**/*.py backend/.env
   ```

## Archivos Críticos

Estos archivos DEBEN estar en UTF-8:
- `backend/.env`
- `backend/app/database.py`
- `backend/app/main.py`
- Todos los archivos `.py` en `backend/app/`

## Recursos Adicionales

- [PEP 263 - Defining Python Source Code Encodings](https://peps.python.org/pep-0263/)
- [Python Unicode HOWTO](https://docs.python.org/3/howto/unicode.html)
- [VS Code Encoding Settings](https://code.visualstudio.com/docs/editor/codebasics#_file-encoding-support)
