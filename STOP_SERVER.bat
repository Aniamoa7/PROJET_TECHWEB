@echo off
REM ============================================
REM  Stop All Node.js Processes
REM ============================================

echo.
echo Stopping Node.js processes...
echo.

taskkill /F /IM node.exe 2>nul

if errorlevel 1 (
    echo No Node.js processes found running.
) else (
    echo Node.js processes stopped successfully!
)

echo.
pause
