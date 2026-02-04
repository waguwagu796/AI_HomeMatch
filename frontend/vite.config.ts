import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendUrl = env.VITE_BACKEND_BASE_URL || ''

  const proxy: Record<string, { target: string; changeOrigin: boolean; rewrite?: (path: string) => string }> = {
    // 등기부등본 분석 API (통합 FastAPI: core/RAG/api_server.py, 포트 8000)
    '/api/deed': {
      target: 'http://localhost:8000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/deed/, ''),
    },
  }

  // 배포 백엔드(Cloudtype 등)로 /api 프록시 → CORS 없이 로컬에서 로그인 가능
  if (backendUrl) {
    proxy['/api'] = {
      target: backendUrl,
      changeOrigin: true,
    }
  }

  return {
    plugins: [react()],
    server: {
      proxy,
    },
  }
})
