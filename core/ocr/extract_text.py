"""
계약서 이미지 OCR 텍스트 추출 모듈

이 모듈은 업로드된 계약서 이미지 파일에서 텍스트를 추출합니다.
"""

import os
from pathlib import Path
from typing import Optional, Union
import pytesseract
from PIL import Image, ImageEnhance, ImageFilter


class OCRProcessor:
    """이미지 OCR 처리를 위한 클래스"""
    
    # 지원하는 이미지 확장자
    SUPPORTED_FORMATS = ['.png', '.jpg', '.jpeg', '.bmp', '.tiff', '.gif', '.webp']
    
    def __init__(self, tesseract_cmd: Optional[str] = None, preprocess: bool = True):
        """
        Args:
            tesseract_cmd: Tesseract 실행 파일 경로 (Windows의 경우 필요할 수 있음)
                          예: r'C:\Program Files\Tesseract-OCR\tesseract.exe'
            preprocess: 이미지 전처리 수행 여부 (명도/대비 개선, 노이즈 제거 등)
        """
        if tesseract_cmd:
            pytesseract.pytesseract.tesseract_cmd = tesseract_cmd
        else:
            # Windows에서 기본 경로 시도
            default_paths = [
                r'C:\Program Files\Tesseract-OCR\tesseract.exe',
                r'C:\Program Files (x86)\Tesseract-OCR\tesseract.exe',
            ]
            for path in default_paths:
                if os.path.exists(path):
                    pytesseract.pytesseract.tesseract_cmd = path
                    break
        
        self.preprocess = preprocess
    
    def _preprocess_image(self, image: Image.Image) -> Image.Image:
        """
        OCR 정확도를 높이기 위한 이미지 전처리
        
        Args:
            image: PIL Image 객체
            
        Returns:
            전처리된 이미지
        """
        # RGB로 변환 (RGBA나 다른 모드인 경우)
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # 명도 및 대비 개선
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(1.5)  # 대비 1.5배 증가
        
        enhancer = ImageEnhance.Sharpness(image)
        image = enhancer.enhance(2.0)  # 선명도 2배 증가
        
        # 노이즈 제거 (약한 블러 적용)
        image = image.filter(ImageFilter.MedianFilter(size=3))
        
        return image
    
    def extract_from_image(
        self, 
        image_path: Union[str, Path],
        psm: int = 6,
        lang: str = 'kor+eng'
    ) -> str:
        """
        이미지 파일에서 텍스트 추출
        
        Args:
            image_path: 이미지 파일 경로 (PNG, JPG, JPEG, BMP 등)
            psm: 페이지 분할 모드 (0-13)
                6: 단일 블록 텍스트로 가정 (기본값)
                11: 희미한 텍스트가 있는 단일 블록
                12: OSD(방향 감지)만 수행
            lang: 사용할 언어 (기본값: 'kor+eng')
            
        Returns:
            추출된 텍스트
        """
        image_path = Path(image_path)
        if not image_path.exists():
            raise FileNotFoundError(f"이미지 파일을 찾을 수 없습니다: {image_path}")
        
        suffix = image_path.suffix.lower()
        if suffix not in self.SUPPORTED_FORMATS:
            raise ValueError(
                f"지원하지 않는 이미지 형식입니다: {suffix}. "
                f"지원 형식: {', '.join(self.SUPPORTED_FORMATS)}"
            )
        
        # 이미지 열기
        image = Image.open(image_path)
        
        # 전처리 수행
        if self.preprocess:
            image = self._preprocess_image(image)
        
        # OCR 수행
        text = pytesseract.image_to_string(
            image,
            lang=lang,
            config=f'--psm {psm}'
        )
        
        return text.strip()
    
    def extract_from_file(
        self, 
        file_path: Union[str, Path],
        psm: int = 6,
        lang: str = 'kor+eng'
    ) -> str:
        """
        이미지 파일에서 텍스트 추출 (extract_from_image의 별칭)
        
        Args:
            file_path: 이미지 파일 경로
            psm: 페이지 분할 모드
            lang: 사용할 언어
            
        Returns:
            추출된 텍스트
        """
        return self.extract_from_image(file_path, psm=psm, lang=lang)


def extract_text_from_contract(
    file_path: Union[str, Path],
    tesseract_cmd: Optional[str] = None,
    preprocess: bool = True,
    psm: int = 6,
    lang: str = 'kor+eng'
) -> str:
    """
    계약서 이미지 파일에서 텍스트를 추출하는 편의 함수
    
    Args:
        file_path: 계약서 이미지 파일 경로
        tesseract_cmd: Tesseract 실행 파일 경로 (선택사항)
        preprocess: 이미지 전처리 수행 여부
        psm: 페이지 분할 모드 (기본값: 6)
        lang: 사용할 언어 (기본값: 'kor+eng')
        
    Returns:
        추출된 텍스트
        
    Example:
        >>> text = extract_text_from_contract('contract.png')
        >>> print(text)
    """
    processor = OCRProcessor(tesseract_cmd=tesseract_cmd, preprocess=preprocess)
    return processor.extract_from_image(file_path, psm=psm, lang=lang)


if __name__ == "__main__":
    # 테스트 코드
    import sys
    
    if len(sys.argv) < 2:
        print("사용법: python extract_text.py <이미지파일경로>")
        print("예시: python extract_text.py contract.png")
        sys.exit(1)
    
    file_path = sys.argv[1]
    
    try:
        print(f"이미지 파일 처리 중: {file_path}")
        text = extract_text_from_contract(file_path)
        print("=" * 50)
        print("추출된 텍스트:")
        print("=" * 50)
        print(text)
        print("=" * 50)
        print(f"총 {len(text)} 글자 추출됨")
    except Exception as e:
        print(f"오류 발생: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

