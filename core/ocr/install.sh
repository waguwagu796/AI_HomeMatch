#!/bin/bash

echo "OCR 패키지 설치 중..."
echo

pip install pytesseract || { echo "pytesseract 설치 실패"; exit 1; }
pip install pillow || { echo "pillow 설치 실패"; exit 1; }
pip install fastapi || { echo "fastapi 설치 실패"; exit 1; }
pip install "uvicorn[standard]" || { echo "uvicorn 설치 실패"; exit 1; }
pip install python-multipart || { echo "python-multipart 설치 실패"; exit 1; }

echo
echo "모든 패키지 설치 완료!"

