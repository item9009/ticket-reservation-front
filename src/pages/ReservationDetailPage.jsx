import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import client from '../api/client'

const STATUS_LABEL = {
  PENDING: { label: '결제 대기', color: 'text-yellow-400 bg-yellow-400/10' },
  CONFIRMED: { label: '예매 완료', color: 'text-green-400 bg-green-400/10' },
  EXPIRED: { label: '만료', color: 'text-slate-400 bg-slate-400/10' },
  CANCELLED: { label: '취소', color: 'text-red-400 bg-red-400/10' },
}

export default function ReservationDetailPage() {
  const { reservationNo } = useParams()
  const navigate = useNavigate()
  const [reservation, setReservation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    client.get(`/reservations/${reservationNo}`)
      .then((res) => setReservation(res.data))
      .catch(() => setError('예매 정보를 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }, [reservationNo])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-slate-400">불러오는 중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto px-6 py-10 text-center">
        <p className="text-red-400">{error}</p>
        <button onClick={() => navigate('/my-reservations')} className="mt-4 text-indigo-400 text-sm">
          ← 목록으로
        </button>
      </div>
    )
  }

  const s = STATUS_LABEL[reservation.status] || { label: reservation.status, color: 'text-slate-400' }

  return (
    <div className="max-w-lg mx-auto px-6 py-10">
      <button
        onClick={() => navigate('/my-reservations')}
        className="text-slate-400 hover:text-white text-sm mb-6 flex items-center gap-1"
      >
        ← 내 예매 목록
      </button>

      <h1 className="text-2xl font-bold text-white mb-8">예매 상세</h1>

      {/* 예매 기본 정보 */}
      <div className="bg-slate-800 rounded-2xl p-6 space-y-4 mb-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white font-semibold font-mono">{reservation.reservationNo}</p>
            <p className="text-slate-400 text-xs mt-1">
              {new Date(reservation.createdAt).toLocaleString('ko-KR')}
            </p>
          </div>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${s.color}`}>
            {s.label}
          </span>
        </div>

        {reservation.status === 'PENDING' && (
          <div className="bg-red-900/30 rounded-xl px-4 py-3 text-sm text-red-400">
            ⏱️ {new Date(reservation.expiresAt).toLocaleTimeString('ko-KR')} 까지 결제해주세요
          </div>
        )}
      </div>

      {/* 좌석 정보 */}
      {reservation.seats && reservation.seats.length > 0 && (
        <div className="bg-slate-800 rounded-2xl p-6 mb-4">
          <h2 className="text-white font-semibold mb-4 border-b border-slate-700 pb-3">선택한 좌석</h2>
          <div className="space-y-3">
            {reservation.seats.map((seat, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-slate-300">{seat.grade}석 {index + 1}번</span>
                <span className="text-white font-medium">{seat.price?.toLocaleString()}원</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 결제 금액 */}
      <div className="bg-slate-800 rounded-2xl p-6">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">총 결제금액</span>
          <span className="text-indigo-400 font-bold text-xl">
            {reservation.totalAmount?.toLocaleString()}원
          </span>
        </div>
      </div>
    </div>
  )
}
