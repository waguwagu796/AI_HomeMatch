# CloudType 프론트엔드 배포 가이드

## 1. 사전 준비

### 필요한 것들
- CloudType 계정 (https://cloudtype.io 에서 가입)
- GitHub 계정
- 프론트엔드 코드가 GitHub 저장소에 푸시되어 있어야 함

## 2. CloudType 대시보드에서 배포하기

### Step 1: 프로젝트 생성
1. https://cloudtype.io 에 로그인
2. 대시보드에서 **"새 프로젝트"** 또는 **"New Project"** 버튼 클릭

### Step 2: 저장소 연결
1. **GitHub 저장소 선택** 또는 **연결**
   - GitHub 계정이 연결되어 있지 않다면 먼저 연결 필요
   - 저장소 목록에서 `AI_HomeMatch` 저장소 선택
   - 또는 저장소 URL 직접 입력

### Step 3: 빌드 설정
1. **루트 디렉토리 설정**
   - 루트 디렉토리: `frontend` 입력
   - (프로젝트 루트가 아닌 frontend 폴더를 지정)

2. **빌드 명령어 설정**
   ```
   npm install
   npm run build
   ```

3. **출력 디렉토리 설정**
   ```
   dist
   ```
   (Vite는 기본적으로 `dist` 폴더에 빌드 결과물 생성)

4. **Node.js 버전**
   - Node.js 18.x 또는 20.x 선택 (권장: 20.x)

### Step 4: 환경 변수 설정 (선택사항)
CloudType 대시보드의 **"환경 변수"** 섹션에서:
- `VITE_BACKEND_BASE_URL`: 백엔드 API URL (예: `https://your-backend.cloudtype.app`)

### Step 5: 배포 실행
1. **"배포하기"** 또는 **"Deploy"** 버튼 클릭
2. CloudType이 자동으로:
   - 저장소에서 코드 클론
   - `npm install` 실행
   - `npm run build` 실행
   - 빌드된 정적 파일 배포

### Step 6: 배포 완료
- 배포가 완료되면 CloudType이 자동으로 URL 제공
- 예: `https://your-project-name.cloudtype.app`
- 이 URL로 프론트엔드에 접근 가능

## 3. 추가 설정 (필요시)

### 자동 배포 설정
- **"자동 배포"** 옵션 활성화
- GitHub에 푸시할 때마다 자동으로 재배포

### 커스텀 도메인
- CloudType 대시보드에서 **"도메인"** 설정
- 자신의 도메인 연결 가능

### HTTPS
- CloudType이 자동으로 HTTPS 인증서 발급 및 설정

## 4. 문제 해결

### 빌드 실패 시
- CloudType 대시보드의 **"빌드 로그"** 확인
- Node.js 버전 확인
- `package.json`의 빌드 스크립트 확인

### 환경 변수 문제
- 환경 변수가 제대로 설정되었는지 확인
- 빌드 시점에 환경 변수가 필요하므로 CloudType 대시보드에서 설정 필수

### CORS 오류
- 백엔드에서 CORS 설정 확인
- 프론트엔드 도메인을 백엔드 CORS 허용 목록에 추가

## 5. 참고사항

- CloudType은 정적 사이트 호스팅을 지원하므로 Vite로 빌드한 React 앱을 바로 배포 가능
- 빌드 후 `dist` 폴더의 내용이 자동으로 서빙됨
- 무료 플랜도 제공되지만 제한이 있을 수 있음

