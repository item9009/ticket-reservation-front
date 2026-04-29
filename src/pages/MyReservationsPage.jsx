import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../api/client'
import useAuthStore from '../store/authStore'

const STATUS_LABEL = {
  PENDING: { label: '결제 대기', color: 'text-yellow-400 bg-yellow-400/10' },
  CONFIRMED: { label: '예매 완료', color: 'text-green-400 bg-green-400/10' },
  EXPIRED: { label: '만료', color: 'text-slate-400 bg-slate-400/10' },
  CANCELLED: { label: '취소', color: 'text-red-400 bg-red-400/10' },
}

export default function MyReservationsPage() {
  const { userId, token } = useAuthStore()
  const navigate = useNavigate()
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    client.get(`/reservations/my/${userId}`)
      .then((res) => setReservations(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [userId, token])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-slate-400">불러오는 중...</div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-white mb-2">내 예매 목록</h1>
      <p className="text-slate-400 text-sm mb-8">총 {reservations.length}건</p>

      {reservations.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">🎫</div>
          <p className="text-slate-400">예매 내역이 없습니다.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm"
          >
            공연 보러 가기 →
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((r) => {
            const s = STATUS_LABEL[r.status] || { label: r.status, color: 'text-slate-400' }
            return (
              <div key={r.id} className="bg-slate-800 rounded-2xl p-5 cursor-pointer hover:ring-2 hover:ring-indigo-500 transition" onClick={() => navigate(`/my-reservations/${r.reservationNo}`)}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-white font-semibold font-mono text-sm">
                      {r.reservationNo}
                    </p>
                    <p className="text-slate-400 text-xs mt-0.5">
                      {new Date(r.createdAt).toLocaleString('ko-KR')}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${s.color}`}>
                    {s.label}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">결제 금액</span>
                  <span className="text-white font-semibold">
                    {r.totalAmount?.toLocaleString()}원
                  </span>
                </div>
                {r.status === 'PENDING' && (
                  <p className="text-xs text-red-400 mt-2">
                    ⏱️ {new Date(r.expiresAt).toLocaleTimeString('ko-KR')} 까지 결제해주세요
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
