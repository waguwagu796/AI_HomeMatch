"""
FastAPI OCR 서버

이미지 파일을 업로드하여 OCR 텍스트를 추출하는 API 서버입니다.
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Optional
import tempfile
import os
from pathlib import Path
from extract_text import OCRProcessor, extract_text_from_contract

app = FastAPI(title="OCR API", description="계약서 이미지 OCR 텍스트 추출 API")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 프로덕션에서는 특정 도메인만 허용하도록 변경
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OCR 프로세서 초기화 (전역으로 한 번만 생성)
ocr_processor = OCRProcessor()


@app.get("/")
async def root():
    """헬스 체크 엔드포인트"""
    return {
        "message": "OCR API 서버가 실행 중입니다",
        "endpoints": {
            "POST /extract": "이미지 파일을 업로드하여 텍스트 추출",
            "GET /health": "서버 상태 확인"
        }
    }


@app.get("/health")
async def health():
    """서버 상태 확인"""
    return {"status": "healthy"}


@app.post("/extract")
async def extract_text(
    file: UploadFile = File(...),
    preprocess: bool = True,
    psm: int = 6,
    lang: str = "kor+eng"
):
    """
    이미지 파일을 업로드하여 텍스트 추출
    
    Args:
        file: 업로드할 이미지 파일
        preprocess: 이미지 전처리 수행 여부 (기본값: True)
        psm: 페이지 분할 모드 (기본값: 6)
        lang: 사용할 언어 (기본값: 'kor+eng')
    
    Returns:
        추출된 텍스트
    """
    # 파일 형식 검증
    allowed_extensions = {'.png', '.jpg', '.jpeg', '.bmp', '.tiff', '.gif', '.webp'}
    file_ext = Path(file.filename).suffix.lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"지원하지 않는 파일 형식입니다. 지원 형식: {', '.join(allowed_extensions)}"
        )
    
    # 임시 파일로 저장
    temp_file = None
    try:
        # 임시 파일 생성
        suffix = file_ext
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            # 업로드된 파일 내용을 임시 파일에 저장
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        # OCR 처리
        processor = OCRProcessor(preprocess=preprocess)
        extracted_text = processor.extract_from_image(
            temp_file_path,
            psm=psm,
            lang=lang
        )
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "text": extracted_text,
                "filename": file.filename,
                "length": len(extracted_text)
            }
        )
    
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR 처리 중 오류 발생: {str(e)}")
    
    finally:
        # 임시 파일 삭제
        if temp_file and os.path.exists(temp_file_path):
            try:
                os.unlink(temp_file_path)
            except Exception:
                pass


@app.post("/extract-from-path")
async def extract_text_from_path(
    file_path: str,
    preprocess: bool = True,
    psm: int = 6,
    lang: str = "kor+eng"
):
    """
    서버에 저장된 이미지 파일 경로로부터 텍스트 추출
    
    Args:
        file_path: 서버에 저장된 이미지 파일 경로
        preprocess: 이미지 전처리 수행 여부
        psm: 페이지 분할 모드
        lang: 사용할 언어
    
    Returns:
        추출된 텍스트
    """
    try:
        extracted_text = extract_text_from_contract(
            file_path,
            preprocess=preprocess,
            psm=psm,
            lang=lang
        )
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "text": extracted_text,
                "file_path": file_path,
                "length": len(extracted_text)
            }
        )
    
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR 처리 중 오류 발생: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

