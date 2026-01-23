@echo off
echo OCR 패키지 설치 중...
echo.

pip install pytesseract
if %errorlevel% neq 0 (
    echo pytesseract 설치 실패
    pause
    exit /b 1
)

pip install pillow
if %errorlevel% neq 0 (
    echo pillow 설치 실패
    pause
    exit /b 1
)

pip install fastapi
if %errorlevel% neq 0 (
    echo fastapi 설치 실패
    pause
    exit /b 1
)

pip install "uvicorn[standard]"
if %errorlevel% neq 0 (
    echo uvicorn 설치 실패
    pause
    exit /b 1
)

pip install python-multipart
if %errorlevel% neq 0 (
    echo python-multipart 설치 실패
    pause
    exit /b 1
)

echo.
echo 모든 패키지 설치 완료!
pause

