# OCR 모듈

계약서 이미지 파일에서 텍스트를 추출하는 OCR 기능을 제공합니다.

## 설치

### OCR 전용 패키지 설치 (권장)

OCR 기능만 사용하는 경우:

```bash
cd core/ocr
pip install -r requirements.txt
```

### 전체 프로젝트 패키지 설치

다른 기능도 함께 사용하는 경우:

```bash
cd core
pip install -r requirements.txt
```

**주의**: `llama-cpp-python`은 Windows에서 C++ 컴파일러가 필요합니다. 
OCR만 사용하는 경우 `core/ocr/requirements.txt`를 사용하세요.

## 기능

- 이미지 파일(PNG, JPG, JPEG, BMP, TIFF, GIF, WEBP)에서 텍스트 추출
- 이미지 전처리 기능 (명도/대비 개선, 노이즈 제거)
- 한국어 및 영어 지원
- 다양한 페이지 분할 모드 지원
- FastAPI 기반 REST API 서버

## 사용 방법

### Python 모듈로 사용

```python
from ocr import extract_text_from_contract

# 이미지 파일에서 텍스트 추출
text = extract_text_from_contract('contract.png')
print(text)
```

### FastAPI 서버로 실행

```bash
cd core/ocr
uvicorn app:app --reload --port 8000
```

서버 실행 후:
- API 문서: http://localhost:8000/docs
- 헬스 체크: http://localhost:8000/health

### API 사용 예시

```bash
# 이미지 파일 업로드하여 텍스트 추출
curl -X POST "http://localhost:8000/extract" \
  -F "file=@contract.png" \
  -F "preprocess=true"
```

## 요구사항

- Tesseract OCR 설치 필요
  - Windows: https://github.com/UB-Mannheim/tesseract/wiki 에서 다운로드
  - Linux: `sudo apt-get install tesseract-ocr tesseract-ocr-kor`
  - macOS: `brew install tesseract tesseract-lang`

- Python 패키지:
  - pytesseract
  - pillow
  - fastapi
  - uvicorn
  - python-multipart

## 지원 파일 형식

- 이미지: PNG, JPG, JPEG, BMP, TIFF, GIF, WEBP

## 페이지 분할 모드 (PSM)

- `6`: 단일 블록 텍스트로 가정 (기본값, 대부분의 계약서에 적합)
- `11`: 희미한 텍스트가 있는 단일 블록
- `12`: OSD(방향 감지)만 수행
- `3`: 자동 페이지 분할 (기본값)
- 기타: 0-13까지 다양한 모드 지원

## 주의사항

- 이미지 품질이 낮으면 OCR 정확도가 떨어질 수 있습니다.
- 한국어 인식률을 높이려면 Tesseract에 한국어 언어팩이 설치되어 있어야 합니다.
- 전처리 기능은 대부분의 경우 정확도를 향상시키지만, 이미 품질이 좋은 이미지의 경우 오히려 악화시킬 수 있습니다.
