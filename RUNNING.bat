@echo off
set PATH=%PATH%;C:\xampp\php
title [ Running server - EXPRESS APP]
:UGNazI
pm2 start ./src/main.js
pause
cls
goto GLOBALHELL
