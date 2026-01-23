@echo off
echo OCR 서버 시작 중...
echo.
cd /d %~dp0
python -m uvicorn app:app --reload --host 0.0.0.0 --port 8000
pause

