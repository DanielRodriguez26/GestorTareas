#!/bin/bash

# Script de inicio rápido para Task Manager
# Usage: ./start.sh

echo "=================================="
echo "  Task Manager - Inicio Rápido  "
echo "=================================="
echo ""

# Verificar si Docker está instalado
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo "✓ Docker detectado"
    echo ""
    echo "Selecciona el modo de ejecución:"
    echo "1) Docker (recomendado - todo configurado)"
    echo "2) Desarrollo local (backend + frontend separados)"
    read -p "Opción [1-2]: " option

    case $option in
        1)
            echo ""
            echo "Iniciando con Docker..."
            docker-compose up --build
            ;;
        2)
            echo ""
            echo "Modo desarrollo local"
            echo "Necesitas 2 terminales:"
            echo ""
            echo "Terminal 1 - Backend:"
            echo "  cd backend"
            echo "  python -m venv venv"
            echo "  source venv/bin/activate  # o venv\\Scripts\\activate en Windows"
            echo "  pip install -r requirements.txt"
            echo "  uvicorn app.main:app --reload"
            echo ""
            echo "Terminal 2 - Frontend:"
            echo "  cd frontend"
            echo "  npm install"
            echo "  npm run dev"
            ;;
        *)
            echo "Opción inválida"
            exit 1
            ;;
    esac
else
    echo "✗ Docker no detectado"
    echo ""
    echo "Configuración manual necesaria:"
    echo ""
    echo "Terminal 1 - Backend:"
    echo "  cd backend"
    echo "  python -m venv venv"
    echo "  source venv/bin/activate  # o venv\\Scripts\\activate en Windows"
    echo "  pip install -r requirements.txt"
    echo "  uvicorn app.main:app --reload"
    echo ""
    echo "Terminal 2 - Frontend:"
    echo "  cd frontend"
    echo "  npm install"
    echo "  npm run dev"
fi

echo ""
echo "=================================="
echo "  URLs de la aplicación:         "
echo "=================================="
echo "Frontend:      http://localhost:5173"
echo "Backend API:   http://localhost:8000"
echo "Swagger Docs:  http://localhost:8000/docs"
echo "=================================="
