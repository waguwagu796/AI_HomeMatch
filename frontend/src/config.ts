/**
 * 백엔드 API 베이스 URL.
 * - 개발 모드(DEV): VITE_BACKEND_BASE_URL 있으면 '' (프록시 사용), 없으면 http://localhost:8080
 * - 프로덕션: VITE_API_BASE_URL (cloudtype.io 환경변수) 우선, 없으면 VITE_BACKEND_BASE_URL, 최종 fallback http://localhost:8080
 */
export const API_BASE = import.meta.env.DEV
  ? (import.meta.env.VITE_BACKEND_BASE_URL ? '' : 'http://localhost:8080')
  : (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:8080')
