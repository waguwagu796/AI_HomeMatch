import { useState } from 'react'
import { FileText, Lightbulb, CheckCircle, AlertTriangle, Copy, FileCheck, ChevronRight, ArrowLeft } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

export default function ContractReviewDetailPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [selectedClause, setSelectedClause] = useState(0)

  const reviewId = searchParams.get('reviewId')

  const clauses = [
    {
      id: 0,
      title: '전세 보증금 반환 의무',
      keywords: ['보증금', '반환', '의무', '만기'],
      conclusion:
        '현재 특약 문구는 기본적인 보증금 반환 의무는 규정하고 있으나, 반환 시점과 공제 범위가 모호해 분쟁 소지가 있습니다. 반환 기한과 공제 항목을 더 구체적으로 명시하는 것이 안전합니다.',
      risk_points: [
        '“즉시 반환” 표현만 있고 구체적인 지급 기한(예: 계약 종료 후 ○일 이내)이 없어 지연 시 분쟁 가능성',
        '임차인의 모든 채무 공제 범위가 넓고 추상적이라, 과도한 공제 주장 위험',
        '중도 해지 또는 부분 해지 시 보증금 정산 방식이 규정되어 있지 않음',
      ],
      law_basis: [
        {
          text: '주택임대차보호법 제3조는 임대차의 대항력 및 보증금 회수를 보호하는 취지로, 임차인의 보증금 반환 요구권을 전제로 합니다.',
        },
        {
          text: '민법 제618조 이하 임대차 규정에 따라 임대인은 목적물 사용·수익의 대가로서 보증금을 반환할 기본 의무가 있습니다.',
        },
      ],
      precedent_basis: [
        {
          why_important: '보증금 반환 지연 시, 반환 기한을 둘러싼 분쟁에서 계약 문구의 명확성이 핵심 판단 요소가 됨',
          evidence:
            '판례에서는 “상당한 기간 내” 등 추상적 표현보다, 계약서에 구체적인 지급 기한이 명시된 경우 그 기준에 따라 지연 손해배상 책임을 인정·제한한 사례가 다수 존재합니다.',
        },
      ],
      mediation_cases: [
        {
          text: '임대인이 “수리비 공제”를 이유로 보증금의 절반 이상을 공제하려다, 실제 수리 견적과 불일치해 조정 과정에서 상당 부분 반환이 이뤄진 사례가 있습니다.',
        },
      ],
      original:
        '제3조(보증금의 반환) 임대인은 임대차 계약기간이 만료되거나 해지되었을 때 임대차 보증금을 임차인에게 즉시 반환하여야 한다. 다만, 임차인의 채무불이행으로 인한 손해배상금 등 임대차 관계에서 발생하는 임차인의 모든 채무를 공제하고 남은 금액을 반환한다.',
      recommended_clauses:
        '① 임대인은 임대차 계약기간이 만료되거나 해지된 날로부터 ○일 이내에 임차인에게 보증금을 반환한다.\n② 임대인은 임차인의 연체차임, 공과금, 객관적으로 입증 가능한 수리비 등 실제 발생한 채무만을 보증금에서 공제할 수 있으며, 공제 내역과 산출 근거를 서면(또는 전자문서)로 제공한다.\n③ 중도 해지 또는 부분 해지 시 보증금 정산 기준(일할 계산, 공과금 정산 기준 등)은 별도 특약에 따라 정한다.',
    },
    {
      id: 1,
      title: '임대차 계약 갱신 청구권',
      keywords: ['갱신', '청구권', '계약'],
      conclusion:
        '갱신 요구권 행사 요건과 절차가 부족하게 기재된 특약입니다. 세입자의 법정 갱신요구권을 제한하는 내용이 없는지, 법령과 충돌하지 않는지 반드시 확인해야 합니다.',
      risk_points: [
        '계약서 특약이 법정 갱신요구권보다 불리하게 규정된 경우, 실제 효력에 대한 분쟁 가능성',
        '갱신 거절 사유(보증금 미납, 목적물 훼손 등)에 대한 기준이 모호하면 분쟁 시 해석 다툼 발생',
      ],
      law_basis: [
        {
          text: '주택임대차보호법 제6조의3(계약갱신 요구권)은 일정 요건 하에 임차인의 계약갱신 요구권을 보장하며, 이에 반하는 특약은 무효가 될 수 있습니다.',
        },
      ],
      precedent_basis: [
        {
          why_important: '갱신 거절 사유를 둘러싼 분쟁에서, 판례는 임차인 보호와 계약의 구체적 문구를 함께 고려하여 효력을 판단합니다.',
          evidence:
            '세입자의 경미한 의무 위반만을 이유로 갱신 거절을 인정하지 않은 판례들이 있어, 특약 문구가 과도하게 임차인에게 불리할 경우 실제 효력은 제한될 수 있습니다.',
        },
      ],
      mediation_cases: [
        {
          text: '“계약 만료 시 재계약 불가”라는 특약만 기재되었으나, 실제로는 법정 갱신요구권이 인정되어 임차인이 추가 2년 거주를 확보한 분쟁조정 사례가 있습니다.',
        },
      ],
      original: '제4조(계약 갱신) 임차인은 임대차 기간 만료 3개월 전까지 갱신 의사를 서면으로 통지하지 않을 경우, 임대인은 갱신을 거절할 수 있다.',
      recommended_clauses:
        '① 임차인은 임대차 기간 만료 6개월 전부터 2개월 전 사이에 서면(전자문서 포함)으로 계약 갱신을 요구할 수 있다.\n② 임대인은 주택임대차보호법 등 관련 법령에서 정한 정당한 거절 사유가 있는 경우에 한하여 갱신을 거절할 수 있으며, 그 사유를 서면으로 통지한다.\n③ 본 조는 주택임대차보호법상 계약갱신 요구권을 배제하거나 제한하지 않는 범위에서만 효력이 있다.',
    },
  ]

  const currentClause = clauses[selectedClause]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/contract/review')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">계약서 상세 분석 결과</h1>
            <p className="text-sm text-gray-500 mt-1">
              특약별로 핵심 결론, 리스크, 법·판례·분쟁 근거를 한 번에 확인하세요.
              {reviewId && <span className="ml-2 text-xs text-gray-400">({reviewId}번 계약)</span>}
            </p>
          </div>
        </div>
      </div>

      {/* 상단: 특약 리스트 탭 + AI 종합 판단 카드 */}
      <div className="space-y-6 mt-0">
        <div>
          <div className="flex gap-1 bg-gray-50">
            {clauses.map((clause, idx) => (
              <button
                key={clause.id}
                onClick={() => setSelectedClause(idx)}
                className={`px-4 py-2 text-sm rounded-t-lg transition-all ${
                  selectedClause === idx
                    ? 'bg-white border border-gray-300 border-b-white text-gray-900 font-semibold'
                    : 'text-gray-500 border border-gray-200 bg-white hover:text-gray-700'
                }`}
              >
                {clause.title}
              </button>
            ))}
          </div>

          <div className="bg-white border border-gray-200 rounded-b-xl border-t-0">
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                    <Lightbulb className="w-3.5 h-3.5" />
                    AI 종합 판단
                  </div>
                  <h2 className="mt-3 text-xl font-bold text-gray-900">{currentClause.title}</h2>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-gray-800">{currentClause.conclusion}</p>

              {/* 카드 하단에 녹아드는 면책 고지 */}
              <div className="mt-4 rounded-md bg-red-50 px-3 py-2 border border-red-100">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-red-700 border border-red-100">
                    중요 안내
                  </span>
                  <span className="text-[11px] font-medium text-red-800">면책 고지</span>
                </div>
                <p className="text-[11px] leading-relaxed text-red-800">
                  본 AI 점검 결과는 법률 자문이 아니며, 정보 제공 목적의 참고 자료입니다. 정확한 법률 판단이 필요하다면 반드시 전문가와 상담하세요.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 원문 & 추천 특약 문구 */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-primary-600" />
              <h3 className="text-sm font-semibold text-gray-900">선택 특약 원문</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-800 whitespace-pre-wrap leading-relaxed">
              {currentClause.original}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary-600" />
                <h3 className="text-sm font-semibold text-gray-900">권장 수정/보완 특약 문구</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(currentClause.recommended_clauses || '')
                }}
                className="flex items-center gap-1 rounded-lg border border-gray-300 px-2.5 py-1 text-[11px] text-gray-700 hover:bg-gray-50"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>복사</span>
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-800 whitespace-pre-wrap leading-relaxed">
              {currentClause.recommended_clauses}
            </div>
          </div>
        </div>

        {/* 리스크 포인트 */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-semibold text-gray-900">주요 리스크 포인트</h3>
          </div>
          <ul className="mt-1 space-y-2 text-sm text-gray-800">
            {currentClause.risk_points?.map((risk: string, idx: number) => (
              <li key={idx} className="flex gap-2">
                <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-amber-500" />
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 법·판례·분쟁 근거 */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-6 md:col-span-1">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">법령 근거</h3>
            <ul className="space-y-2 text-xs text-gray-800">
              {currentClause.law_basis?.map(
                (law: { text: string }, idx: number) => (
                  <li key={idx} className="leading-relaxed">
                    {law.text}
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 md:col-span-1">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">판례 근거</h3>
            <ul className="space-y-3 text-xs text-gray-800">
              {currentClause.precedent_basis?.map(
                (p: { why_important: string; evidence: string }, idx: number) => (
                  <li key={idx} className="space-y-1 leading-relaxed">
                    <p className="font-medium text-gray-900">{p.why_important}</p>
                    <p className="text-gray-700">{p.evidence}</p>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 md:col-span-1">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">분쟁조정사례 요약</h3>
            <ul className="space-y-2 text-xs text-gray-800">
              {currentClause.mediation_cases?.map(
                (m: { text: string }, idx: number) => (
                  <li key={idx} className="leading-relaxed">
                    {m.text}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* 다음 단계: 등기부등본 분석 CTA */}
        <div className="bg-white border border-primary-200 rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50">
                <FileCheck className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">다음 단계: 등기부등본 분석으로 이어가기</h3>
                <p className="mt-1 text-xs text-gray-600">
                  소유자 일치, 근저당·가압류, 공동 소유 등 핵심 6가지를 한 번에 점검하세요.
                </p>
              </div>
            </div>
            <Link
              to="/contract/deed"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              등기부등본 분석하기
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

