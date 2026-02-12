# AI_Home'Scan

# AI_HomeMatch (주거 계약 의사결정 보조 플랫폼)

전·월세 계약을 앞둔 사용자를 위한 **등기부등본 분석**, **계약서 특약 점검**, **AI 챗봇**, **입주·퇴실 관리**를 제공하는 웹 플랫폼입니다.

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| **등기부등본 분석** | 이미지/PDF 업로드 → OCR(EasyOCR) → 표제부/갑구/을구 구조화 → 위험 요소 분석 → GPT 기반 쉬운 설명 제공 |
| **계약서 점검** | 특약 문장 업로드 → RAG(법령·판례·조정사례) 검색 → Groq LLM으로 위험도·개선안 분석 |
| **AI 챗봇** | 계약서 검토, 등기부, 거주·퇴실 등 주제별 질의 응답 (OpenAI 연동) |
| **입주·퇴실 관리** | 입주 시점 기록, 월별 관리, 하자·합의 기록, 퇴실 체크리스트 |
| **매물/리스트** | 부동산 매물 목록·상세 조회 (메인 이미지·서브 이미지) |

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| **프론트엔드** | React 19, Vite, React Router, Tailwind CSS, Recharts |
| **백엔드** | Java 17, Spring Boot 3, Spring Security, JWT, JPA, MariaDB |
| **AI 서버** | Python, FastAPI (등기부: OCR·구조화·위험분석 / 계약서: RAG·LLM) |
| **등기부** | EasyOCR, PyMuPDF, OpenAI API(GPT), 규칙 기반 파싱 |
| **계약서** | LangChain, ChromaDB, BM25, Groq API |
| **배포** | Cloudtype (백엔드·프론트), WAR 배포 지원 |

---

## 프로젝트 구조

```
AI_HomeMatch/
├── frontend/          # React + Vite (포트 5173)
├── backend/          # Spring Boot (포트 8080)
├── core/             # Python FastAPI (포트 8000)
│   ├── RAG/          # 계약서 RAG·분석 API (LangChain, ChromaDB, Groq)
│   ├── register/     # 등기부등본 OCR·파싱·위험분석 API
│   └── requirements.txt
├── scripts/          # FastAPI 실행 스크립트 등
└── docs/             # PPT·문서 자료
```

---

## 사전 요구 사항

- **Node.js** 18+ (프론트엔드)
- **Java 17** (백엔드)
- **Python 3.10+** (core, FastAPI)
- **MariaDB** (또는 MySQL)
- (선택) **OPENAI_API_KEY**, **GROQ_API_KEY** (AI 기능 사용 시)

---

## 로컬 실행 방법

### 1. 데이터베이스

- MariaDB에 DB 생성 후 `backend/create_tables.sql` 실행 (또는 JPA `ddl-auto: update` 사용).

### 2. 백엔드 (Spring Boot)

```bash
cd backend
# .env 또는 환경 변수: DB_URL, DB_USER, DB_PASSWORD, FASTAPI_BASE_URL=http://localhost:8000
./gradlew bootRun
```

- 기본 포트: **8080**

### 3. AI 서버 (FastAPI)

```bash
cd core
pip install -r requirements.txt
# core/.env: OPENAI_API_KEY, GROQ_API_KEY (선택)
uvicorn RAG.api_server:app --reload --host 0.0.0.0 --port 8000
```

- 등기부·계약서 분석 API: **8000**

### 4. 프론트엔드

```bash
cd frontend
npm install
npm run dev
```

- 브라우저: **http://localhost:5173**
- 로컬 백엔드 사용 시 `frontend/.env`의 `VITE_BACKEND_BASE_URL`은 비워 두면 됩니다.

---

## 환경 변수 요약

| 위치 | 변수 | 용도 |
|------|------|------|
| backend | `DB_URL`, `DB_USER`, `DB_PASSWORD` | DB 연결 |
| backend | `FASTAPI_BASE_URL` | 등기부/계약서 FastAPI 주소 (로컬: `http://localhost:8000`) |
| backend | `PORT` | 서버 포트 (배포 시) |
| frontend | `VITE_BACKEND_BASE_URL` | 배포 백엔드 URL (로컬은 비움) |
| core | `OPENAI_API_KEY` | 등기부 설명·챗봇 (선택) |
| core | `GROQ_API_KEY` | 계약서 분석 (선택) |

---

## 배포 (Cloudtype 등)

- **백엔드**: WAR 빌드 후 PaaS에 배포, `DB_URL`, `DB_USER`, `DB_PASSWORD`, `PORT`, `FASTAPI_BASE_URL`(FastAPI 사용 시) 설정.
- **프론트**: `VITE_BACKEND_BASE_URL`에 배포된 백엔드 URL 넣고 `npm run build` 후 정적 호스팅.
- **FastAPI**: 별도 서버 또는 컨테이너에 배포 후 백엔드 `FASTAPI_BASE_URL`에 해당 URL 설정.

---

## 라이선스

본 프로젝트는 교육·포트폴리오 목적입니다.
