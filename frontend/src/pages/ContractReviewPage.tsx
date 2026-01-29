import { useState, useRef, useEffect } from 'react'
import { FileText, Lightbulb, CheckCircle, AlertTriangle, Copy, Upload, ArrowLeft, Plus, FileCheck, ChevronRight } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'

export default function ContractReviewPage() {
  const [searchParams] = useSearchParams()
  const [view, setView] = useState<'list' | 'upload' | 'detail'>('list')
  const [selectedReview, setSelectedReview] = useState<number | null>(null)
  const [selectedClause, setSelectedClause] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [showDiscrepancy, setShowDiscrepancy] = useState(false)
  const discrepancyRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // URL 파라미터에서 reviewId를 받아서 상세 화면으로 이동
  useEffect(() => {
    const reviewId = searchParams.get('reviewId')
    if (reviewId) {
      const id = parseInt(reviewId)
      if (!isNaN(id)) {
        setSelectedReview(id)
        setView('detail')
      }
    }
  }, [searchParams])
  
  // 불일치 분석 섹션으로 스크롤
  useEffect(() => {
    if (showDiscrepancy && discrepancyRef.current) {
      discrepancyRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [showDiscrepancy])

  const clauses = [
    {
      id: 0,
      title: '전세 보증금 반환 의무',
      keywords: ['보증금', '반환', '의무', '만기'],
      original: '제3조(보증금의 반환) 임대인은 임대차 계약기간이 만료되거나 해지되었을 때 임대차 보증금을 임차인에게 즉시 반환하여야 한다. 다만, 임차인의 채무불이행으로 인한 손해배상금 등 임대차 관계에서 발생하는 임차인의 모든 채무를 공제하고 남은 금액을 반환한다.',
      explanation: '임대차 계약이 끝나면 임대인(집주인)은 세입자에게 보증금을 돌려줄 의무가 있습니다. 이때, 만약 세입자가 월세를 밀렸거나 집을 파손하여 수리비가 발생했다면, 그 금액을 제외하고 나머지 보증금을 돌려주게 됩니다.',
      laws: [
        '주택임대차보호법 제3조 (대항력 등)',
        '민법 제618조 (임대차의 의의)',
      ],
      disputes: [
        '계약 만기 시 보증금 반환 지연',
        '수리비, 공과금 등 공제 금액에 대한 이견',
        '임대인이 새로운 임차인을 구하지 못했다는 이유로 반환 거부',
      ],
      standard: '본 계약은 임대차 기간 만료 시 임차인은 임차 목적물을 원상회복하여 임대인에게 명도하고, 임대인은 보증금 전액을 임차인에게 반환한다.',
    },
    {
      id: 1,
      title: '임대차 계약 갱신 청구권',
      keywords: ['갱신', '청구권', '계약'],
      original: '',
      explanation: '',
      laws: [],
      disputes: [],
      standard: '',
    },
  ]

  const currentClause = clauses[selectedClause]

  // 지난 점검 목록 데이터 (계약 유형·주소·당사자 등 식별 정보 포함)
  const reviewList = [
    {
      id: 1,
      type: '전세',
      address: '서울시 강남구 테헤란로 123',
      lessor: '김○○',
      lessee: '이○○',
      date: '2024-01-15',
      deposit: '3억 5천만 원',
      period: '2024.01.15 ~ 2025.01.14',
      area: '전용 84㎡',
      purpose: '주거용',
      status: '완료',
      clauses: 3,
    },
    {
      id: 2,
      type: '월세',
      address: '서울시 서초구 반포대로 456',
      lessor: '박○○',
      lessee: '최○○',
      date: '2024-01-10',
      deposit: '5천만 원 / 50만 원',
      period: '2024.01.10 ~ 2025.01.09',
      area: '전용 59㎡',
      purpose: '주거용',
      status: '완료',
      clauses: 5,
    },
    {
      id: 3,
      type: '전세',
      address: '서울시 송파구 잠실로 789',
      lessor: '정○○',
      lessee: '한○○',
      date: '2024-01-05',
      deposit: '2억 2천만 원',
      period: '2024.01.05 ~ 2025.01.04',
      area: '전용 72㎡',
      purpose: '주거용',
      status: '완료',
      clauses: 2,
    },
  ]

  return (
    <div className="space-y-6">
      {/* 목록 보기 */}
      {view === 'list' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between max-w-[1000px] mx-auto">
            <h1 className="text-3xl font-bold text-gray-900">계약서 점검</h1>
            <button
              onClick={() => setView('upload')}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <Plus className="w-5 h-5" />
              <span>계약서 추가</span>
            </button>
          </div>

          {/* 지난 점검 목록 - 계약서 문서 형태 카드 */}
          {reviewList.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-16 max-w-[1000px] mx-auto pt-4">
              {reviewList.map((review) => (
                <button
                  key={review.id}
                  onClick={() => {
                    setSelectedReview(review.id)
                    setView('detail')
                  }}
                  className="group text-left transition-all duration-200 hover:scale-[1.01] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-sm"
                >
                  {/* 계약서 문서 형태 카드 */}
                  <div className="relative bg-[#faf8f5] rounded-sm shadow-md group-hover:shadow-lg overflow-hidden min-h-[260px] flex flex-col">
                    {/* 상단 접힌 부분 (문서 느낌) */}
                    <div className="h-1 bg-gradient-to-b from-gray-200/60 to-transparent" />

                    {/* 문서 헤더 - 계약서 제목 */}
                    <div className="px-5 pt-8 pb-5 border-b border-gray-400/40">
                      <div className="flex items-center justify-between">
                        <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 text-lg font-semibold rounded">
                          {review.type} 계약서
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-base font-medium rounded-full">
                          {review.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 mt-3.5 text-xl tracking-tight pl-1.5" style={{ fontFamily: 'Georgia, "Noto Serif KR", serif' }}>
                        {review.address}
                      </h4>
                    </div>

                    {/* 계약 내용 요약 (문서 본문 느낌) */}
                    <div className="flex-1 px-5 pt-8 pb-2 flex items-start text-base min-h-0">
                      <div className="flex justify-between w-full text-gray-700">
                        <span className="text-gray-500">계약일</span>
                        <span>{review.date}</span>
                      </div>
                    </div>

                    {/* 하단 구분선 + 분석 정보 */}
                    <div className="px-5 py-2.5 bg-gray-100/50 border-t border-gray-300/50 flex items-center justify-between">
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <FileCheck className="w-4 h-4" />
                        분석된 특약 {review.clauses}개
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors" />
                    </div>

                    {/* 우하단 '인' 스탬프 느낌 */}
                    <div className="absolute bottom-16 right-5 w-9 h-9 border-2 border-red-400/70 rounded-full flex items-center justify-center text-red-600/80 text-xs font-bold" style={{ fontFamily: 'Georgia, serif' }}>
                      인
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">아직 점검한 계약서가 없습니다.</p>
              <button
                onClick={() => setView('upload')}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                첫 계약서 업로드하기
              </button>
            </div>
          )}
        </div>
      )}

      {/* 이미지 업로드 모드 */}
      {view === 'upload' && (
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                setView('list')
                setUploadedFiles([])
              }}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">계약서 이미지 업로드</h1>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-primary-500 transition-colors"
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">계약서 이미지를 업로드하세요</p>
              <p className="text-sm text-gray-500 mb-4">
                JPG, PNG 파일을 지원합니다
              </p>
              <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                파일 선택
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files || [])
                  setUploadedFiles((prev) => [...prev, ...files])
                }}
              />
            </div>

            {/* 업로드된 파일 미리보기 */}
            {uploadedFiles.length > 0 && (
              <div className="mt-6 space-y-4">
                <h4 className="font-medium text-gray-900">업로드된 파일 ({uploadedFiles.length})</h4>
                <div className="grid grid-cols-3 gap-4">
                  {uploadedFiles.map((file, idx) => (
                    <div key={idx} className="relative border border-gray-200 rounded-lg p-3">
                      {file.type.startsWith('image/') ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-32 object-cover rounded mb-2"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-100 rounded mb-2 flex items-center justify-center">
                          <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <p className="text-xs text-gray-600 truncate">{file.name}</p>
                      <button
                        onClick={() => {
                          setUploadedFiles((prev) => prev.filter((_, i) => i !== idx))
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 text-sm w-6 h-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                본 AI 점검 결과는 법률 자문이 아니며, 정보 제공을 목적으로 합니다.
              </p>
            </div>

            <button
              onClick={() => {
                // 업로드 후 분석 시작 (실제로는 API 호출)
                // 여기서는 상세 화면으로 이동하는 것으로 시뮬레이션
                setView('detail')
                setSelectedReview(reviewList.length + 1)
              }}
              disabled={uploadedFiles.length === 0}
              className="mt-6 w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              계약서 분석 시작
            </button>
          </div>
        </div>
      )}

      {/* 상세 분석 결과 보기 */}
      {view === 'detail' && (
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <button
                  onClick={() => {
                    setView('list')
                    setSelectedReview(null)
                    setShowDiscrepancy(false)
                  }}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">계약서 상세 분석 결과</h1>
          </div>

          <div className="bg-red-50 p-5 rounded-xl shadow-sm">
            <span className="inline-block px-3 py-1 mb-2 text-sm font-semibold rounded-full bg-red-100 text-red-700">
              중요 안내
            </span>
            <div className="pl-2">
              <h3 className="font-bold text-red-900 mb-1 text-xl">면책 고지</h3>
              <p className="text-base text-red-800 leading-relaxed">
                본 AI 점검 결과는 법률 자문이 아니며, 정보 제공을 목적으로 합니다. 정확한 법률 판단은 반드시 전문가와 상담하시기 바랍니다.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {/* Left Panel - Clause List */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 h-full flex flex-col">
              <h2 className="text-lg font-bold text-gray-900 mb-4">특약 리스트 및 중요 키워드</h2>
              <div className="space-y-2">
                {clauses.map((clause, idx) => (
                  <button
                    key={clause.id}
                    onClick={() => setSelectedClause(idx)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedClause === idx
                        ? 'bg-primary-50 border-2 border-primary-500'
                        : 'border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium text-gray-900 mb-1">{clause.title}</div>
                    {selectedClause === idx && (
                      <div className="text-sm text-gray-600 mt-2">
                        주요 키워드: {clause.keywords.join(', ')}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Panel - Clause Details */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <FileText className="w-5 h-5 text-primary-600" />
                  <h3 className="text-lg font-bold text-gray-900">선택 특약 원문</h3>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap">
                  {currentClause.original}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-primary-600" />
                  <h3 className="text-lg font-bold text-gray-900">쉬운 설명</h3>
                </div>
                <p className="text-gray-700">{currentClause.explanation}</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                  <h3 className="text-lg font-bold text-gray-900">관련 법령</h3>
                </div>
                <ul className="space-y-2">
                  {currentClause.laws.map((law, idx) => (
                    <li key={idx} className="text-gray-700">• {law}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-primary-600" />
                  <h3 className="text-lg font-bold text-gray-900">분쟁 포인트</h3>
                </div>
                <ul className="space-y-2">
                  {currentClause.disputes.map((dispute, idx) => (
                    <li key={idx} className="text-gray-700">• {dispute}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-primary-600" />
                    <h3 className="text-lg font-bold text-gray-900">추천 표준 문구</h3>
                  </div>
                  <button className="flex items-center space-x-2 px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    <Copy className="w-4 h-4" />
                    <span>복사</span>
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
                  {currentClause.standard}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={() => {
                setShowDiscrepancy(true)
              }}
              className="block w-full px-10 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 text-center font-semibold text-lg shadow-md"
            >
              중개사 설명 vs 계약서 불일치 확인하기
            </button>
          </div>

          {/* 불일치 분석 섹션 */}
          {showDiscrepancy && (
            <div ref={discrepancyRef} className="mt-12 pt-8 border-t-2 border-gray-300 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  중개사 설명 vs 계약서 불일치 분석
                </h2>
                <p className="text-gray-600">
                  중개사의 설명과 실제 계약서 내용 간의 차이를 확인하고, 잠재적인 위험을 파악하세요.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Left Panel */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">제공된 중개사 설명</h3>
                  <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
                    부동산 중개인은 구두로 '해당 건물은 전세권 설정이 되어 있지 않으며, 대출금액이 적어 안전하다'고 설명했습니다. 또한, 건물주가 직접 거주하며 관리하고 있어 문제가 발생할 가능성이 매우 낮다고 강조했습니다.
                  </div>
                </div>

                {/* Center Panel - Warning */}
                <div className="bg-white border-2 border-red-500 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-red-900 mb-4">
                    중개사 설명과 계약서 내용이 심각하게 불일치
                  </h3>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p>
                      중개사는 전세권이 없으며 대출금액이 적어 안전하다고 설명했으나, 계약서에는 선순위 전세권과 2억 5천만 원의 근저당권이 명시되어 있습니다.
                    </p>
                    <p>
                      이는 임차인의 보증금 회수에 중대한 위험을 초래할 수 있습니다. 특히 선순위 전세권과 근저당권은 임차인의 보증금보다 우선하여 변제받을 수 있어, 경매 시 보증금 회수가 어려울 수 있습니다.
                    </p>
                    <p className="font-bold mt-4">
                      중개사에게 불일치 사항에 대한 명확한 설명을 요구하고, 계약 진행을 전면 재검토하거나 법률 전문가와 상담하세요.
                    </p>
                  </div>
                </div>

                {/* Right Panel */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">관련 계약서 조항</h3>
                  <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
                    본 계약 체결 전 확인된 등기부등본에 따르면, 해당 건물에는 선순위 전세권 설정(전세금 1억원)이 완료되어 있으며, 채무최고액 2억 5천만 원의 근저당권이 설정되어 있음을 확인한다. 임차인은 이 사실을 충분히 인지하고 본 계약에 동의한다.
                  </div>
                </div>
              </div>

              {/* Action Cards */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">임대인에게 확인 요청</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    불일치 사항에 대해 임대인에게 직접 문의하고 공식적인 답변을 받아보세요.
                  </p>
                  <button className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium">
                    임대인에게 확인 요청하기
                  </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">부동산 배지 검토</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    이 부동산의 신뢰도 및 안전성 관련 HomeMatch 배지를 상세하게 검토합니다.
                  </p>
                  <button className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium">
                    배지 검토하기
                  </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">위험 점수 가이드</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    불일치가 HomeMatch 위험 신호 점수에 어떻게 반영되는지 이해합니다.
                  </p>
                  <button className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium">
                    위험 점수 가이드 확인
                  </button>
                </div>
              </div>

              {/* 다음 단계: 등기부등본 분석 */}
              <div className="bg-white border-2 border-primary-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <FileCheck className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">다음: 등기부등본 분석</h3>
                      <p className="text-sm text-gray-600">
                        소유자 일치, 근저당·가압류, 공동소유 등 6가지만 확인하세요.
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/contract/deed"
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium"
                  >
                    등기부등본 분석하기
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}


