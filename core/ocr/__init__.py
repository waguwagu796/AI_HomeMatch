"""
OCR 모듈

계약서 이미지 파일에서 텍스트를 추출하는 기능을 제공합니다.
"""

from .extract_text import (
    OCRProcessor,
    extract_text_from_contract,
)

__all__ = [
    'OCRProcessor',
    'extract_text_from_contract',
]

