#!/bin/bash

echo "OCR 서버 시작 중..."
cd "$(dirname "$0")"
python -m uvicorn app:app --reload --host 0.0.0.0 --port 8000

