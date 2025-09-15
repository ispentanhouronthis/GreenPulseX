@echo off
echo Starting Agri-Siddhi AI Platform...
echo.

echo Starting Backend...
start "Backend" cmd /c "cd backend && python app_real.py && pause"

timeout /t 3 /nobreak >nul

echo Starting Frontend...
start "Frontend" cmd /c "cd frontend && npm start && pause"

echo.
echo Both services are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause