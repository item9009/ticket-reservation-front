import { useLocation, useNavigate } from 'react-router-dom'

export default function ReservationCompletePage() {
  const { state } = useLocation()
  const navigate = useNavigate()

  if (!state) {
    navigate('/')
    return null
  }

  const { reservation } = state

  return (
    <div className="max-w-lg mx-auto px-6 py-16 text-center">
      <div className="text-6xl mb-6">🎉</div>
      <h1 className="text-2xl font-bold text-white mb-2">예매 완료!</h1>
      <p className="text-slate-400 text-sm mb-8">
        결제가 완료되면 티켓이 자동으로 발급됩니다.
      </p>

      <div className="bg-slate-800 rounded-2xl p-6 text-left space-y-3 mb-8">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">예매 번호</span>
          <span className="text-white font-mono font-semibold">
            {reservation.reservationNo}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">상태</span>
          <span className="text-yellow-400 font-semibold">
            {reservation.status === 'PENDING' ? '결제 대기 중' : reservation.status}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">결제 금액</span>
          <span className="text-white font-semibold">
            {reservation.totalAmount?.toLocaleString()}원
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">만료 시간</span>
          <span className="text-red-400 text-xs">
            {new Date(reservation.expiresAt).toLocaleTimeString('ko-KR')} 까지
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => navigate('/my-reservations')}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-xl transition"
        >
          내 예매 확인
        </button>
        <button
          onClick={() => navigate('/')}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition"
        >
          홈으로
        </button>
      </div>
    </div>
  )
}
