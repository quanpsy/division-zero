@echo off
title Division Zero Bot - Portable
echo ========================================
echo   Division Zero Bot - Portable Edition
echo ========================================
echo.

:: Set path to portable Node.js (same folder)
set NODE_PATH=%~dp0node-portable

:: Check if Node.js exists
if not exist "%NODE_PATH%\node.exe" (
    echo ERROR: Node.js not found!
    echo.
    echo Please download Node.js portable and extract to:
    echo %NODE_PATH%
    echo.
    echo Download from: https://nodejs.org/dist/v20.18.1/node-v20.18.1-win-x64.zip
    echo Extract the contents so that %NODE_PATH%\node.exe exists.
    echo.
    pause
    exit /b 1
)

:: Add portable Node to PATH
set PATH=%NODE_PATH%;%PATH%

:: Navigate to bot directory
cd /d "%~dp0"

:: Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    echo.
    call npm install
    if errorlevel 1 (
        echo Failed to install dependencies.
        pause
        exit /b 1
    )
    echo.
)

:: Check if .env exists
if not exist ".env" (
    echo ERROR: .env file not found!
    echo.
    echo Please copy .env.example to .env and fill in your values.
    echo.
    pause
    exit /b 1
)

echo Starting Division Zero Bot...
echo Press Ctrl+C to stop.
echo ========================================
echo.

"%NODE_PATH%\node.exe" index.js

echo.
echo Bot stopped.
pause
