@echo off
echo ===================================================================
echo   Running Complete AIML Club Setup
echo ===================================================================
echo.

cd /d "%~dp0"

echo Step 1: Creating missing files and API routes...
node scripts\createMissingFiles.js
if errorlevel 1 (
    echo Error: Failed to create missing files
    pause
    exit /b 1
)
echo.

echo Step 2: Creating admin pages...
node scripts\createAdminPages.js
if errorlevel 1 (
    echo Error: Failed to create admin pages
    pause
    exit /b 1
)
echo.

echo Step 3: Setting up Appwrite collections and updating environment...
call npx ts-node scripts\setupAndUpdateEnv.ts
if errorlevel 1 (
    echo Error: Failed to setup Appwrite
    pause
    exit /b 1
)
echo.

echo ===================================================================
echo   Setup Complete!
echo ===================================================================
echo.
echo Next steps:
echo   1. Check .env.local - all collection IDs should be populated
echo   2. Run: npm run dev
echo   3. Open: http://localhost:3000
echo.
pause
