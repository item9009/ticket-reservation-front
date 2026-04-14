import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import client from '../api/client'

export default function ReservationPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!state) {
    navigate('/')
    return null
  }

  const { selectedSeats, eventId, userId } = state
  const totalAmount = selectedSeats.reduce((sum, s) => sum + s.price, 0)

  const handleConfirm = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await client.post('/reservations', {
        userId,
        eventId,
        eventSeatIds: selectedSeats.map((s) => s.id),
      })
      navigate('/reservation-complete', { state: { reservation: res.data } })
    } catch (err) {
      setError(err.response?.data?.message || '예매 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="text-slate-400 hover:text-white text-sm mb-6 flex items-center gap-1"
      >
        ← 좌석 선택으로
      </button>

      <h1 className="text-2xl font-bold text-white mb-8">예매 확인</h1>

      <div className="bg-slate-800 rounded-2xl p-6 space-y-4 mb-6">
        <h2 className="text-white font-semibold border-b border-slate-700 pb-3">
          선택한 좌석
        </h2>
        {selectedSeats.map((seat) => (
          <div key={seat.id} className="flex justify-between text-sm">
            <span className="text-slate-300">
              {seat.row}열 {seat.num}번
            </span>
            <span className="text-white font-medium">
              {seat.price.toLocaleString()}원
            </span>
          </div>
        ))}
        <div className="border-t border-slate-700 pt-3 flex justify-between">
          <span className="text-slate-400">총 결제금액</span>
          <span className="text-indigo-400 font-bold text-lg">
            {totalAmount.toLocaleString()}원
          </span>
        </div>
      </div>

      <div className="bg-slate-800 rounded-2xl p-5 mb-6 text-sm text-slate-400">
        <p className="flex items-center gap-2 mb-2">
          <span>⏱️</span>
          예매 후 <strong className="text-white">10분 이내</strong> 결제하지 않으면 자동 취소됩니다.
        </p>
        <p className="flex items-center gap-2">
          <span>🔒</span>
          Redis 분산 락으로 중복 예매를 방지합니다.
        </p>
      </div>

      {error && (
        <p className="text-red-400 text-sm text-center mb-4">{error}</p>
      )}

      <button
        onClick={handleConfirm}
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-bold py-4 rounded-xl text-lg transition"
      >
        {loading ? '예매 처리 중...' : `${totalAmount.toLocaleString()}원 결제하기`}
      </button>
    </div>
  )
}
