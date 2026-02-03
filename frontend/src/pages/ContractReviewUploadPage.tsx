import { useRef, useState, useMemo } from 'react'
import { ArrowLeft, FileText, Upload } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SpecialTermsInput from '../components/SpecialTermsInput'

export default function ContractReviewUploadPage() {
  const navigate = useNavigate()
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [specialTerms, setSpecialTerms] = useState<string[]>([''])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const formatBytes = (bytes: number) => {
    if (!Number.isFinite(bytes)) return ''
    if (bytes < 1024) return `${bytes}B`
    const kb = bytes / 1024
    if (kb < 1024) return `${kb.toFixed(1)}KB`
    const mb = kb / 1024
    if (mb < 1024) return `${mb.toFixed(1)}MB`
    const gb = mb / 1024
    return `${gb.toFixed(1)}GB`
  }

  const addFiles = (files: File[]) => {
    if (!files.length) return
    setUploadedFiles((prev) => [...prev, ...files])
  }

  // ✅ 버튼 활성화 조건: "파일 OR 특약" 중 하나라도 있으면 활성화
  const hasSpecialTerm = useMemo(
    () => specialTerms.some((v) => v.trim().length > 0),
    [specialTerms]
  )
  const isAnalyzeDisabled = uploadedFiles.length === 0 && !hasSpecialTerm

  // ✅ 분석 시작: 파일 업로드 및 DB 저장 후 detail로 이동
  const handleStartAnalyze = async () => {
    if (isAnalyzeDisabled) return

    const finalSpecialTerms = specialTerms
      .map((t) => t.trim())
      .filter((t) => t !== '')

    // 파일이 없고 특약만 있는 경우는 기존 로직 유지
    if (uploadedFiles.length === 0) {
      const reviewId = Date.now()
      const startedAt = Date.now()
      navigate(`/contract/review/detail?reviewId=${reviewId}`, {
        state: {
          reviewId,
          startedAt,
          specialTerms: finalSpecialTerms,
        },
      })
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        throw new Error('로그인이 필요합니다.')
      }

      // 모든 파일을 한 번에 업로드 (하나의 레코드에 저장)
      const formData = new FormData()
      uploadedFiles.forEach((file) => {
        formData.append('files', file)
      })
      formData.append('specialTerms', JSON.stringify(finalSpecialTerms))

      const response = await fetch('http://localhost:8080/api/contract/review/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: '업로드 실패' }))
        throw new Error(errorData.error || '파일 업로드에 실패했습니다.')
      }

      await response.json()

      // 업로드 성공 후 분석 페이지로 이동
      const reviewId = Date.now()
      const startedAt = Date.now()
      navigate(`/contract/review/detail?reviewId=${reviewId}`, {
        state: {
          reviewId,
          startedAt,
          specialTerms: finalSpecialTerms,
        },
      })
    } catch (error) {
      console.error('업로드 오류:', error)
      setUploadError(error instanceof Error ? error.message : '파일 업로드 중 오류가 발생했습니다.')
    } finally {
      setIsUploading(false)
    }
  }


  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            setUploadedFiles([])
            navigate('/contract/review')
          }}
          className="p-2 hover:bg-gray-100 rounded-lg"
          aria-label="목록으로"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">계약서 업로드</h1>
          <p className="text-sm text-gray-500 mt-1">이미지 또는 PDF를 올리고 점검을 시작하세요.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {/* 업로드 박스 */}
          <div className="lg:col-span-2">
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault()
                setIsDragging(false)
                addFiles(Array.from(e.dataTransfer.files || []))
              }}
              className={`rounded-2xl border-2 border-dashed p-6 sm:p-6 text-center cursor-pointer transition-colors ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-500'
                }`}
            >
              <Upload className="w-8 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-900 font-semibold mb-1">파일을 끌어다 놓거나 선택하세요</p>
              <p className="text-sm text-gray-500 mb-5">JPG/PNG 또는 PDF · 여러 장 업로드 가능</p>
              <div className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700">
                파일 선택
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                multiple
                className="hidden"
                onChange={(e) => addFiles(Array.from(e.target.files || []))}
              />
            </div>

            {/* 업로드된 파일 목록 */}
            {uploadedFiles.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-semibold text-gray-900">업로드된 파일</h4>
                  <span className="text-xs text-gray-500">{uploadedFiles.length}개</span>
                </div>
                <div className="mt-3 space-y-2">
                  {uploadedFiles.map((file, idx) => (
                    <div
                      key={`${file.name}-${file.size}-${idx}`}
                      className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-9 w-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {formatBytes(file.size)}{file.type ? ` · ${file.type}` : ''}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUploadedFiles((prev) => prev.filter((_, i) => i !== idx))}
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 우측 안내 */}
          <div className="space-y-3">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
              <div className="text-sm font-semibold text-gray-900 mb-1">업로드 팁</div>
              <ul className="text-xs text-gray-600 space-y-1 leading-relaxed">
                <li>- 글자가 선명한 원본(스캔/PDF)이 정확도가 좋아요.</li>
                <li>- 특약 페이지가 있으면 꼭 포함해 주세요.</li>
                <li>- 주민번호 등 민감정보는 가리는 것을 권장합니다.</li>
              </ul>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="text-sm font-semibold text-amber-900 mb-1">중요 안내</div>
              <p className="text-xs text-amber-900 leading-relaxed">
                본 AI 점검 결과는 법률 자문이 아니며, 정보 제공 목적의 참고 자료입니다.
              </p>
            </div>
          </div>
        </div>

        {/* 특약 입력 (분석 시작하기 버튼 위) */}
        <div className="mt-6">
          <SpecialTermsInput terms={specialTerms} setTerms={setSpecialTerms} />
        </div>

        {uploadError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 text-red-800 px-4 py-3 text-sm">
            {uploadError}
          </div>
        )}

        <button
          onClick={handleStartAnalyze}
          disabled={isAnalyzeDisabled || isUploading}
          className="mt-6 w-full rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isUploading ? '업로드 중...' : '분석 시작하기'}
        </button>
      </div>
    </div>
  )
}

