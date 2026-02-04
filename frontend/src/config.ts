/**
 * 백엔드 API 베이스 URL.
 * - .env에 VITE_BACKEND_BASE_URL 설정 시: 개발 서버에서 /api 를 그 주소로 프록시하므로
 *   브라우저는 같은 오리진(localhost:5173)으로만 요청 → CORS 없음. 이때 API_BASE는 ''(빈 문자열).
 * - 미설정 시: http://localhost:8080 (로컬 백엔드)
 */
export const API_BASE =
  import.meta.env.VITE_BACKEND_BASE_URL && import.meta.env.DEV
    ? '' // 개발 모드 + 배포 백엔드 URL 있음 → 프록시 사용, 상대 경로
    : (import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:8080')
