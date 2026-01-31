@echo off
REM ============================================
REM  ARW Cosmetics - Project Starter
REM  This script starts the entire project
REM ============================================

setlocal enabledelayedexpansion

REM Get the directory where this script is located
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

echo.
echo ================================
echo   ARW Cosmetics - Starting...
echo ================================
echo.

REM Check if Node.js is installed
echo Checking for Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Display Node.js version
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo Found Node.js: %NODE_VERSION%
echo.

REM Navigate to server folder
echo Installing/checking dependencies...
cd server
if not exist "node_modules" (
    echo Running: npm install
    call npm install
    if errorlevel 1 (
        echo.
        echo ERROR: Failed to install dependencies
        echo.
        pause
        exit /b 1
    )
) else (
    echo Dependencies already installed
)
echo.

REM Start the server
echo.
echo ================================
echo   Starting Server...
echo ================================
echo.
echo Server running on: http://localhost:4000
echo.
echo Press Ctrl+C in this window to stop the server
echo.

REM Give user a moment to read the message
timeout /t 2 /nobreak

REM Open the browser
start http://localhost:4000/home.html
timeout /t 2 /nobreak

REM Start the server (this will block)
node src/index.js

REM If server stops, keep window open
echo.
echo ================================
echo   Server Stopped
echo ================================
echo.
pause
