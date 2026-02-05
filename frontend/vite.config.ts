import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendUrl = env.VITE_BACKEND_BASE_URL || ''

  const proxy: Record<string, { target: string; changeOrigin: boolean; rewrite?: (path: string) => string }> = {}

  if (backendUrl) {
    // 배포 백엔드(Cloudtype 등) 사용 시: /api 전부(등기부등본 포함) Java 백엔드로
    proxy['/api'] = {
      target: backendUrl,
      changeOrigin: true,
    }
  } else {
    // 로컬 개발 시: 등기부등본만 FastAPI(8000), 나머지 /api는 Java 로컬(8080)로
    proxy['/api/deed'] = {
      target: 'http://localhost:8000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/deed/, ''),
    }
    proxy['/api'] = {
      target: 'http://localhost:8080',
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
