@REM @echo off
@REM echo === Simple Build and Start ===

@REM echo Step 1: Going to vitals app and building...
@REM cd packages\esm-patient-vitals-app

@REM if exist dist (
@REM     echo Removing dist folder...
@REM     rmdir /s /q dist
@REM )

@REM echo Running yarn build...
@REM call yarn build

@REM echo Step 2: Going back to main directory...
@REM cd ..\..

@REM echo Step 3: Starting dev server for 10 seconds...
@REM echo Starting yarn start...
@REM start /b yarn start --sources .\packages\esm-patient-vitals-app\

@REM :: Wait for the build to finish and the dist folder to be created
@REM echo Waiting for build to complete and dist folder to be created...

@REM :: Loop until dist folder is created (or max 5 minutes)
@REM set /a counter=0
@REM :wait_for_dist
@REM if not exist dist (
@REM     set /a counter+=1
@REM     if %counter% lss 300 (
@REM         timeout /t 1 >nul
@REM         goto wait_for_dist
@REM     ) else (
@REM         echo ERROR: Build timed out! Dist folder not created.
@REM         exit /b 1
@REM     )
@REM )



@REM :: Wait for 10 seconds to let the server start
@REM echo Waiting 10 seconds for server to start...
@REM timeout /t 10 /nobreak

@REM echo Step 4: Stopping dev server...
@REM taskkill /f /im node.exe >nul 2>&1
@REM taskkill /f /im yarn.exe >nul 2>&1

@REM echo Step 5: Checking if build was successful...
@REM if not exist packages\esm-patient-vitals-app\dist (
@REM     echo ERROR: No dist folder found! Build failed.
@REM     echo Cannot deploy to Docker.
@REM     pause
@REM     exit /b 1
@REM )

@REM echo Step 6: Deploying to Docker...
@REM cd packages\esm-patient-vitals-app\dist

@REM echo Copying to Docker container...
@REM docker cp . openmrs-distro-referenceapplication-frontend-1:/usr/share/nginx/html/openmrs-esm-patient-vitals-app-10.2.0

@REM echo Restarting Docker container...
@REM docker restart openmrs-distro-referenceapplication-frontend-1

@REM echo Going back to main directory...
@REM cd ..\..\..

@REM echo === Done! Your changes are deployed! ===
