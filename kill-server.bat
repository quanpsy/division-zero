@echo off
REM ============================================
REM Division Zero - Kill Server
REM ============================================
REM This script stops any server running on port 3000
REM ============================================

set PORT=%1
if "%PORT%"=="" set PORT=3000

echo.
echo Stopping server on port %PORT%...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :%PORT%') do taskkill /PID %%a /F 2>nul
echo Done.
