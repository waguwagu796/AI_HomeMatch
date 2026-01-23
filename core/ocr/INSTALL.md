# OCR 패키지 설치 가이드

## 방법 1: 개별 패키지 설치 (권장)

Windows PowerShell 또는 CMD에서:

```bash
pip install pytesseract
pip install pillow
pip install fastapi
pip install "uvicorn[standard]"
pip install python-multipart
```

또는 한 줄로:

```bash
pip install pytesseract pillow fastapi "uvicorn[standard]" python-multipart
```

## 방법 2: 설치 스크립트 사용

### Windows
```bash
cd core/ocr
install.bat
```

### Linux/Mac
```bash
cd core/ocr
chmod +x install.sh
./install.sh
```

## 방법 3: 문제가 되는 패키지 제외하고 설치

전체 requirements.txt에서 문제가 되는 패키지만 제외:

```bash
cd core
pip install ipykernel pytesseract pillow pymupdf pymysql python-dotenv chromadb sentence-transformers fastapi "uvicorn[standard]" python-multipart
```

## 설치 확인

설치가 완료되면 다음 명령으로 확인:

```bash
python -c "import pytesseract; import PIL; import fastapi; print('모든 패키지 설치 완료!')"
```

## Tesseract OCR 설치

Python 패키지 외에 Tesseract OCR도 설치해야 합니다:

- **Windows**: https://github.com/UB-Mannheim/tesseract/wiki 에서 다운로드
- **Linux**: `sudo apt-get install tesseract-ocr tesseract-ocr-kor`
- **macOS**: `brew install tesseract tesseract-lang`

## 서버 실행

설치 완료 후:

```bash
cd core/ocr
uvicorn app:app --reload --port 8000
```

