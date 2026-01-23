import { useState, useRef, useEffect } from 'react'
import { Upload, Calendar, Edit2, Plus, X, Image as ImageIcon, Trash2, Info, CheckCircle } from 'lucide-react'

interface HousingCost {
  rent: number // 월세
  maintenance: number // 관리비
  utilities: number // 전기/수도/가스
  paymentDate: number // 납부일 (일)
  autoRegister: boolean // 자동 등록 여부
}

interface MonthlyRecord {
  year: number
  month: number
  rent: number
  maintenance: number
  utilities: number
  paymentDate: number
  paid: boolean
}

interface EntryStatusRecord {
  id: string
  imageUrl: string
  date: string
  type: string
  description?: string
}

export default function ResidencyManagementPage() {
  const [residencyDate, setResidencyDate] = useState<string>('')
  const [isEditingDate, setIsEditingDate] = useState<boolean>(false)
  const [savedDate, setSavedDate] = useState<string>('')
  
  // 주거비 등록 관련 state
  const [isCostModalOpen, setIsCostModalOpen] = useState<boolean>(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false)
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false)
  const [housingCost, setHousingCost] = useState<HousingCost>({
    rent: 1200000,
    maintenance: 150000,
    utilities: 80000,
    paymentDate: 5,
    autoRegister: false
  })
  const [tempCost, setTempCost] = useState<HousingCost>(housingCost)
  const [monthlyRecords, setMonthlyRecords] = useState<MonthlyRecord[]>([])
  
  // 입주 상태 기록 관련 state
  const [entryStatusRecords, setEntryStatusRecords] = useState<EntryStatusRecord[]>([])
  const [isDragging, setIsDragging] = useState<boolean>(false)
  
  // localStorage에서 입주 상태 기록 데이터 불러오기
  useEffect(() => {
    const savedRecords = localStorage.getItem('entryStatusRecords')
    if (savedRecords) {
      try {
        setEntryStatusRecords(JSON.parse(savedRecords))
      } catch (e) {
        console.error('Failed to parse saved entry status records:', e)
      }
    }
  }, [])
  
  // 입주 상태 기록 데이터가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('entryStatusRecords', JSON.stringify(entryStatusRecords))
  }, [entryStatusRecords])
  const [isEntryStatusModalOpen, setIsEntryStatusModalOpen] = useState<boolean>(false)
  const [pendingEntryStatus, setPendingEntryStatus] = useState<{ imageUrl: string; date: string } | null>(null)
  const [entryStatusType, setEntryStatusType] = useState<string>('')
  const [customEntryStatusType, setCustomEntryStatusType] = useState<string>('')
  const [isCustomType, setIsCustomType] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // 거주 중 상태/이슈 기록 관련 state
  const [residencyIssueImage, setResidencyIssueImage] = useState<string | null>(null)
  const [residencyIssueMemo, setResidencyIssueMemo] = useState<string>('')
  const [isResidencyIssueDragging, setIsResidencyIssueDragging] = useState<boolean>(false)
  const residencyIssueFileInputRef = useRef<HTMLInputElement>(null)
  const [isIssueRecordModalOpen, setIsIssueRecordModalOpen] = useState<boolean>(false)
  const [issueRecordTitle, setIssueRecordTitle] = useState<string>('')
  const [issueRecordStatus, setIssueRecordStatus] = useState<'처리 중' | '접수 완료' | '처리 완료' | '거절'>('접수 완료')

  // 거주 중 이슈 기록 관련 state
  interface DefectIssue {
    id: string
    imageUrl: string
    title: string
    date: string
    status: '처리 중' | '접수 완료' | '처리 완료' | '거절'
  }
  const [defectIssues, setDefectIssues] = useState<DefectIssue[]>([
    {
      id: '1',
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiAyMEMyOC42ODYzIDIwIDI2IDIyLjY4NjMgMjYgMjZDMjYgMjkuMzEzNyAyOC42ODYzIDMyIDMyIDMyQzM1LjMxMzcgMzIgMzggMjkuMzEzNyAzOCAyNkMzOCAyMi42ODYzIDM1LjMxMzcgMjAgMzIgMjBaIiBmaWxsPSIjOUI5Q0E0Ii8+Cjwvc3ZnPgo=',
      title: '침대 프레임 파손',
      date: '2023-10-26',
      status: '처리 중'
    },
    {
      id: '2',
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiAyMEMyOC42ODYzIDIwIDI2IDIyLjY4NjMgMjYgMjZDMjYgMjkuMzEzNyAyOC42ODYzIDMyIDMyIDMyQzM1LjMxMzcgMzIgMzggMjkuMzEzNyAzOCAyNkMzOCAyMi42ODYzIDM1LjMxMzcgMjAgMzIgMjBaIiBmaWxsPSIjOUI5Q0E0Ii8+Cjwvc3ZnPgo=',
      title: '화장실 타일 금',
      date: '2023-10-20',
      status: '접수 완료'
    }
  ])
  
  // 입주 상태 종류 목록 (공간별)
  const entryStatusTypes = [
    '현관',
    '거실',
    '안방',
    '주방',
    '욕실',
    '베란다/발코니',
    '기타 공간'
  ]

  const handleDateSave = () => {
    if (residencyDate) {
      setSavedDate(residencyDate)
      setIsEditingDate(false)
    }
  }

  const handleCostSave = () => {
    setHousingCost(tempCost)
    
    // 자동 등록이 활성화되어 있으면 현재 및 향후 월에 자동으로 기록 생성
    if (tempCost.autoRegister) {
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear()
      const currentMonth = currentDate.getMonth() + 1
      
      // 향후 12개월까지 자동 생성
      const newRecords: MonthlyRecord[] = []
      for (let i = 0; i < 12; i++) {
        const targetDate = new Date(currentYear, currentMonth - 1 + i, 1)
        const year = targetDate.getFullYear()
        const month = targetDate.getMonth() + 1
        
        // 이미 기록이 있는지 확인
        const existingRecord = monthlyRecords.find(
          (r) => r.year === year && r.month === month
        )
        
        if (!existingRecord) {
          newRecords.push({
            year,
            month,
            rent: tempCost.rent,
            maintenance: tempCost.maintenance,
            utilities: tempCost.utilities,
            paymentDate: tempCost.paymentDate,
            paid: false,
          })
        }
      }
      
      if (newRecords.length > 0) {
        setMonthlyRecords([...monthlyRecords, ...newRecords])
      }
    }
    
    setIsCostModalOpen(false)
  }
  
  // 현재 월의 기록 가져오기
  const getCurrentMonthRecord = (): MonthlyRecord | null => {
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1
    
    return (
      monthlyRecords.find((r) => r.year === year && r.month === month) || null
    )
  }
  
  // 표시할 주거비 정보 결정 (월별 기록이 있으면 그것을, 없으면 기본값)
  const displayCost = getCurrentMonthRecord() || {
    rent: housingCost.rent,
    maintenance: housingCost.maintenance,
    utilities: housingCost.utilities,
    paymentDate: housingCost.paymentDate,
  }

  // 지난 주거비 내역 가져오기 (현재 월 이전의 기록들)
  const getPastRecords = (): MonthlyRecord[] => {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1
    
    return monthlyRecords
      .filter((record) => {
        if (record.year < currentYear) return true
        if (record.year === currentYear && record.month < currentMonth) return true
        return false
      })
      .sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year
        return b.month - a.month
      })
  }

  const handleCostCancel = () => {
    setTempCost(housingCost)
    setIsCostModalOpen(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원'
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  const formatDateShort = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // 파일 업로드 처리
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return

    // 첫 번째 파일만 처리 (다중 파일은 나중에 확장 가능)
    const file = files[0]
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string
      
      // 모달을 열어서 입주 상태 종류를 입력받음
      setPendingEntryStatus({
        imageUrl,
        date: new Date().toISOString(),
      })
      setIsEntryStatusModalOpen(true)
      setEntryStatusType('')
      setCustomEntryStatusType('')
      setIsCustomType(false)
    }
    reader.readAsDataURL(file)
  }

  // 입주 상태 기록 저장
  const handleEntryStatusSave = () => {
    if (!pendingEntryStatus) return

    const finalType = isCustomType ? customEntryStatusType : entryStatusType
    
    if (!finalType.trim()) {
      alert('입주 상태 종류를 입력해주세요.')
      return
    }

    const newRecord: EntryStatusRecord = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      imageUrl: pendingEntryStatus.imageUrl,
      date: pendingEntryStatus.date,
      type: finalType,
    }

    setEntryStatusRecords((prev) => [newRecord, ...prev])
    setIsEntryStatusModalOpen(false)
    setPendingEntryStatus(null)
    setEntryStatusType('')
    setCustomEntryStatusType('')
    setIsCustomType(false)
  }

  // 입주 상태 기록 모달 취소
  const handleEntryStatusCancel = () => {
    setIsEntryStatusModalOpen(false)
    setPendingEntryStatus(null)
    setEntryStatusType('')
    setCustomEntryStatusType('')
    setIsCustomType(false)
  }

  // 드래그 앤 드롭 핸들러
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileUpload(e.dataTransfer.files)
  }

  // 파일 선택 핸들러
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // 입주 상태 기록 삭제
  const handleDeleteEntryStatus = (id: string) => {
    setEntryStatusRecords((prev) => prev.filter((record) => record.id !== id))
  }

  // 거주 중 상태/이슈 기록 파일 업로드 처리
  const handleResidencyIssueUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string
      setResidencyIssueImage(imageUrl)
    }
    reader.readAsDataURL(file)
  }

  // 거주 중 상태/이슈 기록 드래그 앤 드롭 핸들러
  const handleResidencyIssueDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsResidencyIssueDragging(true)
  }

  const handleResidencyIssueDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsResidencyIssueDragging(false)
  }

  const handleResidencyIssueDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsResidencyIssueDragging(false)
    handleResidencyIssueUpload(e.dataTransfer.files)
  }

  // 거주 중 상태/이슈 기록 파일 선택 핸들러
  const handleResidencyIssueFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleResidencyIssueUpload(e.target.files)
    if (residencyIssueFileInputRef.current) {
      residencyIssueFileInputRef.current.value = ''
    }
  }

  // 거주 중 상태/이슈 기록 저장 (모달 열기)
  const handleResidencyIssueSaveOnly = () => {
    if (!residencyIssueImage) {
      alert('사진을 먼저 업로드해주세요.')
      return
    }
    
    // 메모를 기본 제목으로 설정
    setIssueRecordTitle(residencyIssueMemo || '')
    setIssueRecordStatus('접수 완료')
    setIsIssueRecordModalOpen(true)
  }

  // 이슈 기록 모달에서 저장
  const handleIssueRecordSave = () => {
    if (!issueRecordTitle.trim()) {
      alert('이슈 이름을 입력해주세요.')
      return
    }
    
    if (!residencyIssueImage) {
      alert('사진이 없습니다.')
      return
    }
    
    // 이슈 접수 내역에 추가
    const newDefectIssue: DefectIssue = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      imageUrl: residencyIssueImage,
      title: issueRecordTitle.trim(),
      date: new Date().toISOString().split('T')[0],
      status: issueRecordStatus
    }
    
    setDefectIssues((prev) => [newDefectIssue, ...prev])
    
    // 초기화
    setResidencyIssueImage(null)
    setResidencyIssueMemo('')
    setIssueRecordTitle('')
    setIssueRecordStatus('접수 완료')
    setIsIssueRecordModalOpen(false)
  }

  // 이슈 기록 모달 취소
  const handleIssueRecordCancel = () => {
    setIsIssueRecordModalOpen(false)
    setIssueRecordTitle('')
    setIssueRecordStatus('접수 완료')
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">거주 중 관리</h1>
        <p className="text-gray-600">
          거주 중 발생하는 하자 관리, 주거비 납부 추적, 퇴실 준비까지 한 번에 관리하세요.
        </p>
      </div>

      {/* Residency Date Registration */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">거주시점 날짜</h2>
          </div>
          {!isEditingDate && (
            <button
              onClick={() => setIsEditingDate(true)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              {savedDate ? '수정' : '등록'}
            </button>
          )}
        </div>

        {isEditingDate ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                입주일을 선택해주세요
              </label>
              <input
                type="date"
                value={residencyDate}
                onChange={(e) => setResidencyDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDateSave}
                disabled={!residencyDate}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                저장
              </button>
              <button
                onClick={() => {
                  setIsEditingDate(false)
                  setResidencyDate(savedDate)
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                취소
              </button>
            </div>
          </div>
        ) : savedDate ? (
          <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">등록된 거주시점</div>
            <div className="text-lg font-bold text-primary-700">
              {formatDate(savedDate)}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {(() => {
                const daysDiff = Math.floor(
                  (new Date().getTime() - new Date(savedDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                )
                return `거주 기간: ${daysDiff}일`
              })()}
            </div>
          </div>
        ) : (
          <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
            거주시점 날짜를 등록해주세요
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* 거주 중 이슈 기록 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">거주 중 이슈 기록</h2>
            <p className="text-sm text-gray-600 mb-4">
              이슈 사진을 업로드하고 AI로 분류하며, 임대인에게 보낼 문서를 자동 생성합니다.
            </p>

            {/* 파일 업로드 영역 */}
            <div
              onDragOver={handleResidencyIssueDragOver}
              onDragLeave={handleResidencyIssueDragLeave}
              onDrop={handleResidencyIssueDrop}
              onClick={() => residencyIssueFileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors mb-6 ${
                isResidencyIssueDragging
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
              }`}
            >
              <Upload className={`w-12 h-12 mx-auto mb-4 ${
                isResidencyIssueDragging ? 'text-primary-600' : 'text-gray-400'
              }`} />
              <p className={`text-gray-600 ${isResidencyIssueDragging ? 'text-primary-600 font-medium' : ''}`}>
                {isResidencyIssueDragging
                  ? '여기에 파일을 놓아주세요'
                  : '사진을 드래그하거나 클릭하여 업로드'}
              </p>
            </div>

            <input
              ref={residencyIssueFileInputRef}
              type="file"
              accept="image/*"
              onChange={handleResidencyIssueFileSelect}
              className="hidden"
            />

            {/* 한줄 메모와 기록하기 버튼 */}
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={residencyIssueMemo}
                onChange={(e) => setResidencyIssueMemo(e.target.value)}
                placeholder="이슈에 대한 간단한 메모를 입력하세요"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
              <button
                onClick={handleResidencyIssueSaveOnly}
                disabled={!residencyIssueImage}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium whitespace-nowrap"
              >
                기록하기
              </button>
            </div>

            {/* 최근 이슈 접수 내역 */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">최근 이슈 접수 내역</h2>
              {defectIssues.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  등록된 이슈가 없습니다.
                </div>
              ) : (
                <div className="space-y-4 mb-4">
                  {defectIssues.map((issue) => {
                    const statusColors = {
                      '처리 중': 'bg-yellow-100 text-yellow-800',
                      '접수 완료': 'bg-blue-100 text-blue-800',
                      '처리 완료': 'bg-green-100 text-green-800',
                      '거절': 'bg-red-100 text-red-800'
                    }

                    return (
                      <div key={issue.id} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                        <img
                          src={issue.imageUrl}
                          alt={issue.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{issue.title}</div>
                          <div className="text-sm text-gray-600">{issue.date}</div>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[issue.status]}`}>
                          {issue.status}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
              <button 
                onClick={() => {
                  if (defectIssues.length > 0) {
                    alert('임대인 요청 문서 생성 기능은 준비 중입니다.')
                  } else {
                    alert('등록된 이슈가 없습니다.')
                  }
                }}
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors"
              >
                임대인 요청 문서 생성
              </button>
            </div>
          </div>



        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Calendar */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {new Date().getMonth() + 1}월 주거비 달력
              </h3>
              <button
                onClick={() => {
                  const currentRecord = getCurrentMonthRecord()
                  if (currentRecord) {
                    setTempCost({
                      rent: currentRecord.rent,
                      maintenance: currentRecord.maintenance,
                      utilities: currentRecord.utilities,
                      paymentDate: currentRecord.paymentDate,
                      autoRegister: housingCost.autoRegister
                    })
                  } else {
                    setTempCost(housingCost)
                  }
                  setIsCostModalOpen(true)
                }}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                주거비 등록
              </button>
            </div>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-gray-700 py-2"
                >
                  {day}
                </div>
              ))}
              {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                <div
                  key={day}
                  onClick={() => {
                    const currentRecord = getCurrentMonthRecord()
                    setTempCost({ 
                      ...housingCost, 
                      paymentDate: day,
                      autoRegister: housingCost.autoRegister
                    })
                    setIsCostModalOpen(true)
                  }}
                  className={`text-center py-4 min-h-[48px] rounded cursor-pointer transition-colors ${
                    day === displayCost.paymentDate
                      ? 'bg-primary-100 text-primary-700 font-bold hover:bg-primary-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {day}
                  {day === displayCost.paymentDate && (
                    <div className="text-xs mt-1">납부일</div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600">
              ● 납부일을 클릭하여 주거비를 등록하거나 수정할 수 있습니다.
            </p>
          </div>

          {/* Estimated Cost */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {new Date().getMonth() + 1}월 예상 주거비
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700">월세</span>
                <span className="font-bold">{formatCurrency(displayCost.rent)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">관리비</span>
                <span className="font-bold">{formatCurrency(displayCost.maintenance)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">전기/수도/가스</span>
                <span className="font-bold">~{formatCurrency(displayCost.utilities)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="font-bold text-gray-900">
                  총 예상 금액
                </span>
                <span className="font-bold text-primary-600">
                  ~{formatCurrency(displayCost.rent + displayCost.maintenance + displayCost.utilities)}
                </span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">납부 예정일</div>
              <div className="text-sm font-medium text-gray-900">
                매월 {displayCost.paymentDate}일
              </div>
              {housingCost.autoRegister && (
                <div className="text-xs text-primary-600 mt-2 flex items-center gap-1">
                  <span>✓</span>
                  <span>자동 등록 활성화됨</span>
                </div>
              )}
            </div>
            <button 
              onClick={() => setIsHistoryModalOpen(true)}
              className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
            >
              지난 주거비 내역 보기
            </button>
          </div>
        </div>
      </div>

      {/* Entry Status Records */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-900">
            입주 상태 기록
          </h2>
          <button
            onClick={() => setIsGuideModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
          >
            <Info className="w-4 h-4" />
            촬영 가이드 보기
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          입주 당시 집 상태를 기록해 퇴실 시 분쟁을 예방하세요.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* 업로드 영역과 하자 목록 통합 */}
        <div className="grid md:grid-cols-4 gap-4">
          {/* 파일 업로드 영역 (맨 왼쪽) */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors min-h-[200px] flex flex-col items-center justify-center ${
              isDragging
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
            }`}
          >
            <Upload className={`w-10 h-10 mx-auto mb-3 ${
              isDragging ? 'text-primary-600' : 'text-gray-400'
            }`} />
            <p className={`text-sm ${isDragging ? 'text-primary-600 font-medium' : 'text-gray-600'}`}>
              {isDragging
                ? '여기에 파일을 놓아주세요'
                : '사진 업로드'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              드래그 또는 클릭
            </p>
          </div>

          {/* 등록된 입주 상태 기록 목록 */}
          {entryStatusRecords.map((record) => (
            <div
              key={record.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <img
                src={record.imageUrl}
                alt={record.type}
                className="w-full h-32 object-cover rounded mb-3 border border-gray-200"
              />
              <div className="font-medium text-gray-900 text-sm mb-1">
                {record.type}
              </div>
              <div className="text-xs text-gray-600">
                {formatDateShort(record.date)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 주거비 등록 모달 */}
      {isCostModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">주거비 등록</h2>
              <button
                onClick={handleCostCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* 납부일 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  납부일 (매월 몇 일)
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={tempCost.paymentDate}
                  onChange={(e) =>
                    setTempCost({
                      ...tempCost,
                      paymentDate: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  매월 {tempCost.paymentDate}일에 납부 예정입니다.
                </p>
              </div>

              {/* 월세 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  월세 (원)
                </label>
                <input
                  type="number"
                  min="0"
                  value={tempCost.rent}
                  onChange={(e) =>
                    setTempCost({
                      ...tempCost,
                      rent: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="월세 금액을 입력하세요"
                />
              </div>

              {/* 관리비 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  관리비 (원)
                </label>
                <input
                  type="number"
                  min="0"
                  value={tempCost.maintenance}
                  onChange={(e) =>
                    setTempCost({
                      ...tempCost,
                      maintenance: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="관리비 금액을 입력하세요"
                />
              </div>

              {/* 전기/수도/가스 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  전기/수도/가스 (원)
                </label>
                <input
                  type="number"
                  min="0"
                  value={tempCost.utilities}
                  onChange={(e) =>
                    setTempCost({
                      ...tempCost,
                      utilities: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="예상 전기/수도/가스 비용을 입력하세요"
                />
                <p className="text-xs text-gray-500 mt-1">
                  실제 사용량에 따라 변동될 수 있습니다.
                </p>
              </div>

              {/* 자동 등록 옵션 */}
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempCost.autoRegister}
                    onChange={(e) =>
                      setTempCost({
                        ...tempCost,
                        autoRegister: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      매월 자동 등록
                    </div>
                    <div className="text-xs text-gray-500">
                      설정한 주거비가 매월 자동으로 기록됩니다
                    </div>
                  </div>
                </label>
              </div>

              {/* 총액 미리보기 */}
              <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">총 예상 금액</div>
                <div className="text-2xl font-bold text-primary-700">
                  {formatCurrency(
                    tempCost.rent +
                      tempCost.maintenance +
                      tempCost.utilities
                  )}
                </div>
              </div>

              {/* 버튼 */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleCostSave}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  저장
                </button>
                <button
                  onClick={handleCostCancel}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 지난 주거비 내역 모달 */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">지난 주거비 내역</h2>
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {getPastRecords().length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-2">등록된 지난 주거비 내역이 없습니다.</p>
                <p className="text-sm text-gray-400">
                  주거비를 등록하면 여기서 확인할 수 있습니다.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {getPastRecords().map((record, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {record.year}년 {record.month}월
                        </h3>
                        <p className="text-xs text-gray-500">
                          납부일: 매월 {record.paymentDate}일
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        record.paid
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {record.paid ? '납부 완료' : '미납'}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">월세</div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(record.rent)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">관리비</div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(record.maintenance)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">전기/수도/가스</div>
                        <div className="text-sm font-medium text-gray-900">
                          ~{formatCurrency(record.utilities)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                      <span className="text-sm text-gray-600">총액</span>
                      <span className="text-lg font-bold text-primary-600">
                        ~{formatCurrency(
                          record.rent + record.maintenance + record.utilities
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 입주 상태 종류 입력 모달 */}
      {isEntryStatusModalOpen && pendingEntryStatus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">입주 상태 정보 입력</h2>
              <button
                onClick={handleEntryStatusCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* 이미지 미리보기 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  업로드된 사진
                </label>
                <img
                  src={pendingEntryStatus.imageUrl}
                  alt="입주 상태 사진"
                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                />
              </div>

              {/* 입주 상태 종류 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  입주 상태 종류
                </label>
                <div className="space-y-2">
                  {/* 기본 종류 선택 */}
                  <div className="grid grid-cols-2 gap-2">
                    {entryStatusTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setEntryStatusType(type)
                          setIsCustomType(false)
                        }}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          !isCustomType && entryStatusType === type
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  {/* 직접 입력 옵션 */}
                  <div className="pt-2 border-t border-gray-200">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isCustomType}
                        onChange={(e) => {
                          setIsCustomType(e.target.checked)
                          if (e.target.checked) {
                            setEntryStatusType('')
                          }
                        }}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">직접 입력</span>
                    </label>
                    {isCustomType && (
                      <input
                        type="text"
                        value={customEntryStatusType}
                        onChange={(e) => setCustomEntryStatusType(e.target.value)}
                        placeholder="입주 상태 종류를 입력하세요"
                        className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* 버튼 */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleEntryStatusSave}
                  disabled={!isCustomType ? !entryStatusType : !customEntryStatusType.trim()}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  저장
                </button>
                <button
                  onClick={handleEntryStatusCancel}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 입주 시점 하자 기록 가이드 모달 */}
      {isGuideModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">🏠 입주 시점 하자 사진 기록 가이드</h2>
              <button
                onClick={() => setIsGuideModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* 상단 안내 */}
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <p className="text-sm text-primary-800">
                  입주할 때 집 상태를 사진으로 남겨두면 퇴실 시 원상복구·보증금 분쟁을 효과적으로 예방할 수 있어요.
                  아래 항목을 따라 입주 첫날 촬영해 주세요.
                </p>
              </div>

              {/* 촬영 전 확인사항 */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-bold text-yellow-900 mb-2">📸 촬영 전 꼭 확인하세요</h3>
                <ul className="space-y-1 text-sm text-yellow-800">
                  <li>• 입주 당일 또는 입주 직후 촬영</li>
                  <li>• 흐리지 않게, 조명 켠 상태로</li>
                  <li>• 하자는 전체 사진 + 확대 사진 함께</li>
                </ul>
              </div>

              {/* 가이드 섹션들 */}
              <div className="space-y-6">
                {/* 1. 집 전체 구조 */}
                <div className="border border-gray-200 rounded-lg p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      1
                    </span>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">집 전체 구조 (필수)</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        <strong>왜 필요할까요?</strong> 입주 당시 집의 전반적인 상태를 증명할 수 있어요.
                      </p>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">촬영 가이드</p>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• 현관 → 거실 → 각 방 → 주방 → 화장실 순서</li>
                          <li>• 각 공간당 2~3장</li>
                          <li>• 문을 연 상태 / 닫은 상태 모두 포함</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. 벽 · 바닥 · 천장 */}
                <div className="border border-gray-200 rounded-lg p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      2
                    </span>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">벽 · 바닥 · 천장 상태</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        <strong>왜 필요할까요?</strong> 생활 중 생긴 오염과 기존 하자를 구분할 수 있어요.
                      </p>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">촬영 포인트</p>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• 벽지 찢김, 얼룩, 변색</li>
                          <li>• 바닥 긁힘, 찍힘, 들뜸</li>
                          <li>• 천장 누수 흔적, 곰팡이</li>
                        </ul>
                        <p className="text-xs text-primary-600 mt-2 font-medium">
                          📌 하자는 반드시 확대 촬영 + 메모 추천
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. 문 · 창문 · 손잡이 */}
                <div className="border border-gray-200 rounded-lg p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      3
                    </span>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">문 · 창문 · 손잡이 (분쟁 빈도 높음)</h3>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">촬영 포인트</p>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• 현관문, 방문, 베란다 창문</li>
                          <li>• 손잡이, 잠금장치, 경첩</li>
                          <li>• 개폐 상태 (열림 / 닫힘)</li>
                        </ul>
                        <p className="text-xs text-primary-600 mt-2 font-medium">
                          🎥 열고 닫을 때 소음이나 뻑뻑함이 있다면 짧은 영상 촬영을 권장해요.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. 주방 · 수납장 */}
                <div className="border border-gray-200 rounded-lg p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      4
                    </span>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">주방 · 수납장 내부</h3>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">촬영 포인트</p>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• 싱크대 상·하부장 내부</li>
                          <li>• 조리대, 타일, 후드</li>
                          <li>• 수납장 문 안쪽 긁힘</li>
                        </ul>
                        <p className="text-xs text-primary-600 mt-2 font-medium">
                          📌 문을 연 상태로 내부까지 촬영하면 좋아요.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. 화장실 */}
                <div className="border border-gray-200 rounded-lg p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      5
                    </span>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">화장실 (중요)</h3>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">촬영 포인트</p>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• 변기, 세면대, 샤워부스</li>
                          <li>• 타일 줄눈, 실리콘 상태</li>
                          <li>• 배수구, 환풍기</li>
                        </ul>
                        <p className="text-xs text-primary-600 mt-2 font-medium">
                          🎥 배수 불량·누수 의심 시 물 내리는 영상 촬영 추천
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6. 옵션 가전 */}
                <div className="border border-gray-200 rounded-lg p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      6
                    </span>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">옵션 가전 · 시설물</h3>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">촬영 포인트</p>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• 에어컨, 보일러, 세탁기, 냉장고</li>
                          <li>• 콘센트, 스위치, 조명, 인터폰</li>
                        </ul>
                        <p className="text-xs text-primary-600 mt-2 font-medium">
                          📌 전원이 켜지는 상태가 보이게 촬영해 주세요.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 7. 촬영 날짜 증빙 */}
                <div className="border border-gray-200 rounded-lg p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      7
                    </span>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">촬영 날짜 증빙 (꼭!)</h3>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">촬영 가이드</p>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• 사진 메타데이터(촬영일) 유지</li>
                          <li>• 또는 입주 계약서와 함께 촬영</li>
                        </ul>
                        <p className="text-xs text-primary-600 mt-2 font-medium">
                          📌 서비스에서 촬영일·메모가 자동 저장되면 추후 분쟁 시 증거로 활용하기 좋아요.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 좋은 기록의 기준 */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  좋은 기록의 기준
                </h3>
                <ul className="space-y-2 text-sm text-green-800">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✔</span>
                    <span>전체 + 확대 컷</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✔</span>
                    <span>하자는 메모와 함께</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✔</span>
                    <span>"내 책임일까?" 싶은 건 전부 기록</span>
                  </li>
                </ul>
              </div>

              {/* 하단 강조 */}
              <div className="bg-primary-600 text-white rounded-lg p-5 text-center">
                <p className="text-lg font-bold mb-1">✨ 지금 찍어둔 사진이, 나중에 보증금을 지켜줍니다.</p>
              </div>

              {/* 닫기 버튼 */}
              <div className="flex justify-end">
                <button
                  onClick={() => setIsGuideModalOpen(false)}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  확인했습니다
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 이슈 기록 모달 */}
      {isIssueRecordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">이슈 기록 등록</h3>
              <button
                onClick={handleIssueRecordCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 이미지 미리보기 */}
            {residencyIssueImage && (
              <div className="mb-4">
                <img
                  src={residencyIssueImage}
                  alt="업로드된 사진"
                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}

            {/* 이슈 이름 입력 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이슈 이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={issueRecordTitle}
                onChange={(e) => setIssueRecordTitle(e.target.value)}
                placeholder="이슈 이름을 입력하세요"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                autoFocus
              />
            </div>

            {/* 처리 상태 선택 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                처리 상태
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['처리 중', '접수 완료', '처리 완료', '거절'] as const).map((status) => {
                  const statusColors = {
                    '처리 중': 'bg-yellow-50 border-yellow-300 text-yellow-800',
                    '접수 완료': 'bg-blue-50 border-blue-300 text-blue-800',
                    '처리 완료': 'bg-green-50 border-green-300 text-green-800',
                    '거절': 'bg-red-50 border-red-300 text-red-800'
                  }
                  
                  return (
                    <button
                      key={status}
                      onClick={() => setIssueRecordStatus(status)}
                      className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                        issueRecordStatus === status
                          ? statusColors[status]
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {status}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex gap-2">
              <button
                onClick={handleIssueRecordCancel}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                취소
              </button>
              <button
                onClick={handleIssueRecordSave}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
