import { useState, useEffect } from 'react'
import { User, FileText, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface UserData {
  name: string
  nickname: string
  email: string
  phone: string
}

interface DeedDocListItem {
  id: number
  sourceFilename?: string
  sourceMimeType?: string
  archived?: boolean
  createdAt?: string
  riskFlagsJson?: string
}

interface DeedDocDetail {
  id: number
  sourceFilename?: string
  sourceMimeType?: string
  archived?: boolean
  createdAt?: string
  extractedText?: string
  structuredJson?: string
  sectionsJson?: string
  riskFlagsJson?: string
  checkItemsJson?: string
  explanation?: string
}

export default function MyPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<UserData>({
    name: '',
    nickname: '',
    email: '',
    phone: ''
  })

  const [deedDocsActive, setDeedDocsActive] = useState<DeedDocListItem[]>([])
  const [deedDocsArchived, setDeedDocsArchived] = useState<DeedDocListItem[]>([])
  const [deedDocsLoading, setDeedDocsLoading] = useState(false)
  const [selectedDeedDoc, setSelectedDeedDoc] = useState<DeedDocDetail | null>(null)

  useEffect(() => {
    loadUserData()
  }, [])

  useEffect(() => {
    if (activeTab === 'settings') {
      void loadDeedDocuments()
    }
  }, [activeTab])

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        navigate('/login')
        return
      }

      const response = await fetch('http://localhost:8080/api/user/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login')
          return
        }
        throw new Error('사용자 정보를 불러오는데 실패했습니다.')
      }

      const data = await response.json()
      setFormData({
        name: data.name || '',
        nickname: data.nickname || '',
        email: data.email || '',
        phone: data.phone || ''
      })
      setLoading(false)
    } catch (error) {
      console.error('사용자 정보 로드 실패:', error)
      alert('사용자 정보를 불러오는데 실패했습니다.')
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSaving(true)
      const token = localStorage.getItem('accessToken')
      if (!token) {
        navigate('/login')
        return
      }

      const response = await fetch('http://localhost:8080/api/user/me', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login')
          return
        }
        const errorText = await response.text()
        throw new Error(errorText || '정보 수정에 실패했습니다.')
      }

      const updatedData = await response.json()
      
      // 닉네임이 변경되었으면 localStorage 업데이트
      if (updatedData.nickname) {
        localStorage.setItem('nickname', updatedData.nickname)
      }
      
      alert('정보가 성공적으로 수정되었습니다.')
      
      // 폼 데이터 업데이트
      setFormData({
        name: updatedData.name || '',
        nickname: updatedData.nickname || '',
        email: updatedData.email || '',
        phone: updatedData.phone || ''
      })
    } catch (error) {
      console.error('정보 수정 실패:', error)
      alert(error instanceof Error ? error.message : '정보 수정에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const loadDeedDocuments = async () => {
    try {
      setDeedDocsLoading(true)
      const token = localStorage.getItem('accessToken')
      if (!token) {
        navigate('/login')
        return
      }

      const [activeRes, archivedRes] = await Promise.all([
        fetch('http://localhost:8080/api/deed/documents?archived=false', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch('http://localhost:8080/api/deed/documents?archived=true', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ])

      if (!activeRes.ok || !archivedRes.ok) {
        throw new Error('등기부 분석 문서 목록을 불러오지 못했습니다.')
      }

      const activeData: DeedDocListItem[] = await activeRes.json()
      const archivedData: DeedDocListItem[] = await archivedRes.json()
      setDeedDocsActive(activeData || [])
      setDeedDocsArchived(archivedData || [])
    } catch (e) {
      console.error(e)
    } finally {
      setDeedDocsLoading(false)
    }
  }

  const openDeedDoc = async (id: number) => {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        navigate('/login')
        return
      }
      const res = await fetch(`http://localhost:8080/api/deed/documents/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('문서 상세 조회 실패')
      const detail: DeedDocDetail = await res.json()
      setSelectedDeedDoc(detail)
    } catch (e) {
      alert('문서 상세를 불러오지 못했습니다.')
    }
  }

  const setArchived = async (id: number, archived: boolean) => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      navigate('/login')
      return
    }
    await fetch(`http://localhost:8080/api/deed/documents/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ archived }),
    })
    await loadDeedDocuments()
  }

  const deleteDoc = async (id: number) => {
    const ok = confirm('이 문서를 삭제할까요? (복구 불가)')
    if (!ok) return
    const token = localStorage.getItem('accessToken')
    if (!token) {
      navigate('/login')
      return
    }
    await fetch(`http://localhost:8080/api/deed/documents/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    })
    await loadDeedDocuments()
  }

  const tabs = [
    { id: 'profile', label: '프로필 관리', icon: User },
    { id: 'documents', label: '데이터 출처 및 면책 안내', icon: FileText },
    { id: 'settings', label: '문서 삭제/보관 설정', icon: Trash2 },
  ]

  return (
    <div className="flex space-x-6">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border border-gray-200 rounded-lg p-4 h-fit">
        <h2 className="text-lg font-bold text-gray-900 mb-4">설정</h2>
        <nav className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white border border-gray-200 rounded-lg p-6">
        {selectedDeedDoc && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-3xl max-h-[85vh] overflow-auto p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 truncate">
                    {selectedDeedDoc.sourceFilename || `문서 #${selectedDeedDoc.id}`}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">{selectedDeedDoc.createdAt || ''}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDeedDoc(null)}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  닫기
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">위험 신호(요약)</h4>
                  <pre className="p-3 bg-gray-50 rounded text-xs text-gray-700 overflow-auto whitespace-pre-wrap">
                    {selectedDeedDoc.riskFlagsJson || ''}
                  </pre>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">6가지 결과</h4>
                  <pre className="p-3 bg-gray-50 rounded text-xs text-gray-700 overflow-auto whitespace-pre-wrap">
                    {selectedDeedDoc.checkItemsJson || ''}
                  </pre>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">설명</h4>
                  <pre className="p-3 bg-gray-50 rounded text-xs text-gray-700 overflow-auto whitespace-pre-wrap">
                    {selectedDeedDoc.explanation || ''}
                  </pre>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50"
                    href={`http://localhost:8080/api/deed/documents/${selectedDeedDoc.id}/file`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    원본 파일 열기
                  </a>
                </div>
                <details>
                  <summary className="cursor-pointer text-sm font-medium text-gray-700">추출된 원문 텍스트 보기</summary>
                  <pre className="mt-2 p-3 bg-gray-50 rounded text-xs text-gray-700 overflow-auto whitespace-pre-wrap max-h-64">
                    {selectedDeedDoc.extractedText || ''}
                  </pre>
                </details>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'profile' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">프로필 관리</h2>
            <p className="text-gray-600 mb-6">
              개인 정보 및 연락처를 업데이트합니다.
            </p>
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">사용자 정보를 불러오는 중...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이름
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    닉네임
                  </label>
                  <input
                    type="text"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이메일
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">이메일 변경 시 중복 체크가 수행됩니다.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    연락처
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="010-1234-5678"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? '저장 중...' : '변경 사항 저장'}
                </button>
              </form>
            )}
          </div>
        )}

        {activeTab === 'documents' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">데이터 출처 및 면책 안내</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-bold mb-2">데이터 출처</h3>
                <p className="text-sm">
                  Home'Scan는 공개된 부동산 정보 및 등기부등본 데이터를 기반으로 정보를 제공합니다.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">면책 조항</h3>
                <p className="text-sm">
                  본 서비스는 주거 관련 정보와 도구를 제공하며, 법률 자문을 대체하지 않습니다. 
                  특정 법률 문제에 대해서는 반드시 전문가와 상담하시기 바랍니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">문서 삭제/보관 설정</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">자동 삭제 설정</h3>
                <select className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg">
                  <option>1년 후 자동 삭제</option>
                  <option>2년 후 자동 삭제</option>
                  <option>3년 후 자동 삭제</option>
                  <option>수동 삭제만</option>
                </select>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">등기부등본 분석 문서</h3>

                {deedDocsLoading ? (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600">불러오는 중...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">최근 분석 문서</h4>
                      <div className="border border-gray-200 rounded-lg divide-y">
                        {deedDocsActive.length === 0 ? (
                          <div className="p-4 text-sm text-gray-600">문서가 없습니다.</div>
                        ) : (
                          deedDocsActive.map((d) => (
                            <div key={d.id} className="p-4 flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <p className="font-medium text-gray-900 truncate">{d.sourceFilename || `문서 #${d.id}`}</p>
                                <p className="text-xs text-gray-500 mt-1">{d.createdAt || ''}</p>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                  type="button"
                                  onClick={() => openDeedDoc(d.id)}
                                  className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50"
                                >
                                  보기
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setArchived(d.id, true)}
                                  className="px-3 py-1.5 text-sm border border-amber-300 text-amber-700 rounded hover:bg-amber-50"
                                >
                                  보관
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteDoc(d.id)}
                                  className="px-3 py-1.5 text-sm border border-red-300 text-red-700 rounded hover:bg-red-50"
                                >
                                  삭제
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">보관 문서</h4>
                      <div className="border border-gray-200 rounded-lg divide-y">
                        {deedDocsArchived.length === 0 ? (
                          <div className="p-4 text-sm text-gray-600">보관 중인 문서가 없습니다.</div>
                        ) : (
                          deedDocsArchived.map((d) => (
                            <div key={d.id} className="p-4 flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <p className="font-medium text-gray-900 truncate">{d.sourceFilename || `문서 #${d.id}`}</p>
                                <p className="text-xs text-gray-500 mt-1">{d.createdAt || ''}</p>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                  type="button"
                                  onClick={() => openDeedDoc(d.id)}
                                  className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50"
                                >
                                  보기
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setArchived(d.id, false)}
                                  className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50"
                                >
                                  보관 해제
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteDoc(d.id)}
                                  className="px-3 py-1.5 text-sm border border-red-300 text-red-700 rounded hover:bg-red-50"
                                >
                                  삭제
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


