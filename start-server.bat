@echo off
REM ============================================
REM Division Zero - Start Development Server
REM ============================================
REM This script starts a local HTTP server on port 3000
REM Access the site at: http://localhost:3000
REM Press Ctrl+C to stop the server
REM ============================================

echo.
echo ========================================
echo   Division Zero - Development Server
echo ========================================
echo.
echo Starting server on http://localhost:3000
echo Press Ctrl+C to stop
echo.

cd /d "%~dp0"
"..\divisionzero - website\node-v20.11.0-win-x64\node.exe" "..\divisionzero - website\node-v20.11.0-win-x64\node_modules\http-server\bin\http-server" . -p 3000 -c-1
