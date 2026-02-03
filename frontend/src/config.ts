/** 백엔드 API 베이스 URL. 배포 백엔드 사용 시 .env에 VITE_BACKEND_BASE_URL 설정 */
export const API_BASE =
  import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:8080'
