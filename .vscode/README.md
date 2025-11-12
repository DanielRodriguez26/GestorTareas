# VS Code Configuration Guide

This directory contains VS Code configuration files for optimal development experience with the SaoraTecnica project.

## Files Overview

### 1. `launch.json` - Debug Configurations

Contains debug configurations for running and debugging the FastAPI backend with F5.

#### Available Configurations:

- **FastAPI: Backend (Debug)** - Default configuration for debugging
  - Runs with auto-reload enabled
  - Port: 8000
  - Full debug logging
  - **Press F5 to start debugging with this configuration**

- **FastAPI: Backend (Production Mode)** - Production-like environment
  - No auto-reload
  - Port: 8000

- **FastAPI: Backend (Custom Port 5000)** - Alternative port configuration
  - Useful if port 8000 is already in use
  - Port: 5000

- **Python: Current File** - Debug the currently open Python file

- **Python: Debug Tests (Pytest)** - Debug pytest test cases

### 2. `settings.json` - Workspace Settings

Configures Python environment, linting, formatting, and other editor settings.

#### Key Settings:

- **Python Interpreter**: Uses `.venv/Scripts/python.exe` (Python 3.12.10)
- **Formatter**: Black with 100 character line length
- **Import Sorting**: isort with Black profile
- **Type Checking**: Basic type checking enabled
- **Auto Save**: Enabled with 1 second delay
- **Format on Save**: Enabled for Python, TypeScript, and JSON files

### 3. `tasks.json` - Build and Development Tasks

Pre-configured tasks for common development operations.

#### Available Tasks (Ctrl+Shift+B):

- **Start Full Stack** (Default) - Starts both backend and frontend in parallel
- **Start Backend (Development)** - Starts FastAPI backend with hot reload
- **Start Frontend (Development)** - Starts Vite dev server
- **Install Backend Dependencies** - Runs pip install for backend
- **Install Frontend Dependencies** - Runs npm install for frontend
- **Run Backend Tests** - Executes pytest tests
- **Build Frontend (Production)** - Creates production build
- **Docker: Build & Run** - Starts all services with docker-compose
- **Docker: Stop All Services** - Stops all Docker containers
- **Format Backend Code (Black)** - Formats all backend Python code

### 4. `extensions.json` - Recommended Extensions

Lists recommended VS Code extensions for this project.

#### Essential Extensions:

**Python Development:**
- Python (ms-python.python)
- Pylance (ms-python.vscode-pylance)
- Black Formatter (ms-python.black-formatter)
- isort (ms-python.isort)

**Frontend Development:**
- ESLint (dbaeumer.vscode-eslint)
- Prettier (esbenp.prettier-vscode)
- ES7+ React Snippets (dsznajder.es7-react-js-snippets)
- Tailwind CSS IntelliSense (bradlc.vscode-tailwindcss)

**Docker & DevOps:**
- Docker (ms-azuretools.vscode-docker)

**Database:**
- SQLTools (mtxr.sqltools)
- SQLite (alexcvzz.vscode-sqlite)

## How to Use F5 Debugging

### Quick Start:

1. **Open VS Code** in the project root directory
   ```bash
   code .
   ```

2. **Ensure Python interpreter is selected**
   - Press `Ctrl+Shift+P`
   - Type "Python: Select Interpreter"
   - Select `.venv/Scripts/python.exe`

3. **Start Debugging**
   - Press `F5` or click "Run and Debug" in the sidebar
   - Select "FastAPI: Backend (Debug)" if prompted
   - The backend will start on http://localhost:8000

4. **Set Breakpoints**
   - Click in the left margin of any Python file to add breakpoints
   - Execution will pause at breakpoints when hit

5. **Access the Application**
   - API: http://localhost:8000
   - API Docs (Swagger): http://localhost:8000/docs
   - API Docs (ReDoc): http://localhost:8000/redoc

### Debug Controls:

When debugging is active, you can use:

- **F5** - Continue execution
- **F10** - Step Over (execute current line)
- **F11** - Step Into (enter function calls)
- **Shift+F11** - Step Out (exit current function)
- **Ctrl+Shift+F5** - Restart debugging
- **Shift+F5** - Stop debugging

### Debug Panel Features:

- **Variables** - Inspect variable values at runtime
- **Watch** - Monitor specific expressions
- **Call Stack** - View function call hierarchy
- **Breakpoints** - Manage all breakpoints
- **Debug Console** - Execute Python code in the current context

## Troubleshooting

### Issue: F5 doesn't work

**Solution:**
1. Install the Python extension: `ms-python.python`
2. Install debugpy: `.venv/Scripts/python.exe -m pip install debugpy`
3. Restart VS Code

### Issue: Module not found errors

**Solution:**
1. Verify Python interpreter is set to `.venv/Scripts/python.exe`
2. Check that PYTHONPATH includes the workspace folder (already configured)
3. Ensure all dependencies are installed: `pip install -r backend/requirements.txt`

### Issue: Port already in use

**Solution:**
1. Use the "Custom Port 5000" debug configuration
2. Or stop any process using port 8000:
   ```bash
   # Windows
   netstat -ano | findstr :8000
   taskkill /PID <process_id> /F
   ```

### Issue: Auto-reload not working

**Solution:**
- Use the "FastAPI: Backend (Debug)" configuration which includes `--reload`
- Ensure watchfiles is installed: `pip install watchfiles`

### Issue: Breakpoints not hitting

**Solution:**
1. Ensure you're running in debug mode (F5), not just running the file
2. Set "justMyCode": false in launch.json (already configured)
3. Verify the code is actually being executed

## Environment Variables

To add environment variables for debugging:

1. Open `.vscode/launch.json`
2. Add variables to the `env` section:
   ```json
   "env": {
       "PYTHONPATH": "${workspaceFolder}",
       "DATABASE_URL": "sqlite:///./tasks.db",
       "DEBUG": "True"
   }
   ```

## Advanced Configuration

### Custom Debug Arguments

To modify uvicorn arguments:

1. Open `.vscode/launch.json`
2. Edit the `args` array in the desired configuration
3. Available arguments:
   - `--reload` - Enable auto-reload
   - `--log-level debug` - Set log level (debug, info, warning, error)
   - `--workers N` - Number of worker processes
   - `--access-log` - Enable access logging

### Multiple Launch Configurations

To run backend and frontend simultaneously:

1. Use the Compound configuration feature
2. Add to launch.json:
   ```json
   "compounds": [
       {
           "name": "Full Stack Debug",
           "configurations": ["FastAPI: Backend (Debug)"],
           "presentation": {
               "hidden": false,
               "group": "full-stack",
               "order": 1
           }
       }
   ]
   ```

## Performance Tips

1. **Exclude unnecessary files from watching:**
   - Already configured in `settings.json` under `files.watcherExclude`

2. **Use workspace-specific Python environment:**
   - Keeps dependencies isolated and consistent

3. **Enable auto-save:**
   - Configured with 1-second delay for seamless development

## Additional Resources

- [VS Code Python Debugging](https://code.visualstudio.com/docs/python/debugging)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Uvicorn Server](https://www.uvicorn.org/)
- [Python Debugging in VS Code](https://code.visualstudio.com/docs/python/debugging)

## Project Architecture

```
SaoraTecnica/
├── .vscode/                 # VS Code configurations
│   ├── launch.json         # Debug configurations
│   ├── settings.json       # Workspace settings
│   ├── tasks.json          # Build tasks
│   └── extensions.json     # Recommended extensions
├── .venv/                   # Python virtual environment (Python 3.12.10)
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py         # FastAPI app entry point
│   │   ├── database.py     # Database configuration
│   │   ├── models.py       # SQLAlchemy models
│   │   ├── schemas.py      # Pydantic schemas
│   │   └── routers/
│   │       └── todos.py    # API routes
│   └── requirements.txt    # Python dependencies
├── frontend/                # React + TypeScript frontend
├── docker-compose.yml       # Docker orchestration
└── README.md               # Project documentation
```

## Support

For issues or questions about the VS Code configuration, refer to:
- Project README: `/mnt/c/Projects/SaoraTecnica/README.md`
- FastAPI Documentation: https://fastapi.tiangolo.com/
- VS Code Docs: https://code.visualstudio.com/docs
