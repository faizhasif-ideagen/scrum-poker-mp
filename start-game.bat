@echo off
REM Story Point Arena - Startup Script for Windows

echo.
echo 🎮 Starting Story Point Arena Server...
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo 📦 Installing dependencies...
    call npm install
    echo.
)

REM Start the server
echo 🚀 Starting server on http://localhost:3000
echo.
start /B node server.js

REM Wait for server to start
timeout /t 2 /nobreak >nul

echo ✅ Server started successfully!
echo.
echo 📖 How to play:
echo    1. Open your browser to: http://localhost:3000
echo    2. Click 'Network Play'
echo    3. Click 'Create New Room'
echo    4. Share the room code with friends!
echo.
echo 🌐 To play from other devices on your network:
echo    Find your IP: ipconfig
echo    Share: http://YOUR_IP:3000
echo.
echo 🛑 To stop the server: Press Ctrl+C in this window
echo.
pause
