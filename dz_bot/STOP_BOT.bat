@echo off
title Division Zero Bot - Stop
echo ========================================
echo   Stopping Division Zero Bot...
echo ========================================
echo.

taskkill /F /IM node.exe 2>nul

if %errorlevel%==0 (
    echo Bot stopped successfully!
) else (
    echo No bot process found running.
)

echo.
echo ========================================
pause
