@echo off

set PORT=3000

:findport
netstat -ano | findstr ":%PORT% " | findstr "LISTENING" >nul 2>&1
if %errorlevel%==0 (
  set /a PORT+=1
  goto findport
)

start http://127.0.0.1:%PORT%

node server.js -p %PORT%

@pause