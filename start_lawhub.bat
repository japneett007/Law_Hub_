@echo off
echo Starting LawHub with optimized settings...

REM Set environment variables to use D: drive for model cache
set HF_HOME=D:\Law_Hub_\model_cache
set TRANSFORMERS_CACHE=D:\Law_Hub_\model_cache\transformers
set HUGGINGFACE_HUB_CACHE=D:\Law_Hub_\model_cache\huggingface

REM Create cache directories if they don't exist
if not exist "D:\Law_Hub_\model_cache" mkdir "D:\Law_Hub_\model_cache"
if not exist "D:\Law_Hub_\model_cache\transformers" mkdir "D:\Law_Hub_\model_cache\transformers"
if not exist "D:\Law_Hub_\model_cache\huggingface" mkdir "D:\Law_Hub_\model_cache\huggingface"

echo Environment variables set:
echo HF_HOME=%HF_HOME%
echo TRANSFORMERS_CACHE=%TRANSFORMERS_CACHE%
echo HUGGINGFACE_HUB_CACHE=%HUGGINGFACE_HUB_CACHE%

echo.
echo Starting LawHub application...
python app.py

pause
