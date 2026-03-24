@echo off
REM Purpose: Starts the local web environment for Ketan Patil's Portfolio
REM Author: Ketan Patil
REM Date: 2026-03-02
setlocal EnableExtensions EnableDelayedExpansion
title Ketan Web App Server

set "ROOT_DIR=%~dp0"
set "APP_DIR=%ROOT_DIR%app"
set "BASE_PORT=5173"
set "MAX_PORT=5190"
set "APP_PORT="
set "APP_URL="
set "MAX_WAIT_SECONDS=45"

echo ==============================================
echo       Starting your Environment
echo ==============================================

if not exist "%APP_DIR%\package.json" (
    echo [ERROR] Could not find "%APP_DIR%\package.json".
    echo [ERROR] Expected project structure: ^<root^>\app\package.json
    pause
    exit /b 1
)

cd /d "%APP_DIR%"

where.exe npm >nul 2>nul
if errorlevel 1 (
    echo [ERROR] npm is not available in PATH. Install Node.js and try again.
    pause
    exit /b 1
)

if not exist "node_modules\.bin\vite.cmd" (
    echo [INFO] Installing dependencies...
    call npm.cmd install
    if errorlevel 1 (
        echo [ERROR] npm install failed.
        pause
        exit /b 1``
    )
)

echo [INFO] Searching for an available port...
for /l %%P in (%BASE_PORT%,1,%MAX_PORT%) do (
    set "CANDIDATE_URL=http://127.0.0.1:%%P"

    powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $r = Invoke-WebRequest -UseBasicParsing -TimeoutSec 1 '!CANDIDATE_URL!'; if ($r.Content -match 'Ketan Patil') { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>nul
    if !errorlevel! EQU 0 (
        echo [INFO] Existing app server detected at !CANDIDATE_URL!.
        echo [INFO] Opening browser...
        start "" "!CANDIDATE_URL!"
        exit /b 0
    )

    netstat -ano | findstr /R /C:":%%P .*LISTENING" >nul
    if errorlevel 1 (
        set "APP_PORT=%%P"
        goto :port_selected
    ) else (
        echo [WARN] Port %%P is in use by another process.
    )
)

echo [ERROR] No free port found in range %BASE_PORT%-%MAX_PORT%.
pause
exit /b 1

REM --- Selects the first available port and launches the Vite server ---
:port_selected
set "APP_URL=http://127.0.0.1:%APP_PORT%"

echo [INFO] Launching Vite dev server on port %APP_PORT%...
start "Ketan Web App Server" cmd /k "cd /d "%APP_DIR%" && npm.cmd run dev -- --host 127.0.0.1 --port %APP_PORT% --strictPort"

echo [INFO] Waiting for server to become available...
for /l %%I in (1,1,%MAX_WAIT_SECONDS%) do (
    powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $r = Invoke-WebRequest -UseBasicParsing -TimeoutSec 1 '%APP_URL%'; if ($r.Content -match 'Ketan Patil') { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>nul
    if !errorlevel! EQU 0 (
        echo [INFO] Server is up. Opening browser...
        start "" "%APP_URL%"
        echo [INFO] Done.
        exit /b 0
    )
    timeout /t 1 /nobreak >nul
)

echo [WARN] Timed out waiting for %APP_URL%.
echo [WARN] Check the "Ketan Web App Server" window for errors.
pause
exit /b 1
