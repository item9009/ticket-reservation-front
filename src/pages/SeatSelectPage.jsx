import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

// Mock 좌석 데이터 (event_seats 테이블 기반)
const MOCK_SEATS = {
  VIP: [
    { id: 1, row: 'A', num: '1', price: 150000, status: 'AVAILABLE' },
    { id: 2, row: 'A', num: '2', price: 150000, status: 'AVAILABLE' },
    { id: 3, row: 'A', num: '3', price: 150000, status: 'RESERVED' },
    { id: 4, row: 'B', num: '1', price: 150000, status: 'AVAILABLE' },
    { id: 5, row: 'B', num: '2', price: 150000, status: 'AVAILABLE' },
    { id: 6, row: 'B', num: '3', price: 150000, status: 'SOLD' },
  ],
  R석: [
    { id: 4, row: 'C', num: '1', price: 100000, status: 'AVAILABLE' },
    { id: 5, row: 'C', num: '2', price: 100000, status: 'AVAILABLE' },
    { id: 6, row: 'C', num: '3', price: 100000, status: 'AVAILABLE' },
    { id: 7, row: 'D', num: '1', price: 100000, status: 'RESERVED' },
    { id: 8, row: 'D', num: '2', price: 100000, status: 'AVAILABLE' },
    { id: 9, row: 'D', num: '3', price: 100000, status: 'AVAILABLE' },
  ],
  S석: [
    { id: 10, row: 'E', num: '1', price: 80000, status: 'AVAILABLE' },
    { id: 11, row: 'E', num: '2', price: 80000, status: 'AVAILABLE' },
    { id: 12, row: 'E', num: '3', price: 80000, status: 'AVAILABLE' },
    { id: 13, row: 'F', num: '1', price: 80000, status: 'AVAILABLE' },
    { id: 14, row: 'F', num: '2', price: 80000, status: 'SOLD' },
    { id: 15, row: 'F', num: '3', price: 80000, status: 'AVAILABLE' },
  ],
}

function SeatButton({ seat, selected, onClick }) {
  const base = 'w-12 h-12 rounded-lg text-xs font-semibold transition flex flex-col items-center justify-center gap-0.5'

  if (seat.status === 'SOLD') {
    return (
      <div className={`${base} bg-slate-700 text-slate-500 cursor-not-allowed`}>
        <span>{seat.row}{seat.num}</span>
        <span>판매</span>
      </div>
    )
  }
  if (seat.status === 'RESERVED') {
    return (
      <div className={`${base} bg-yellow-900 text-yellow-600 cursor-not-allowed`}>
        <span>{seat.row}{seat.num}</span>
        <span>선점</span>
      </div>
    )
  }
  return (
    <button
      onClick={() => onClick(seat)}
      className={`${base} ${
        selected
          ? 'bg-indigo-600 text-white ring-2 ring-indigo-300'
          : 'bg-slate-600 hover:bg-indigo-700 text-white'
      }`}
    >
      <span>{seat.row}{seat.num}</span>
    </button>
  )
}

export default function SeatSelectPage() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const { token, userId } = useAuthStore()
  const [selectedSeats, setSelectedSeats] = useState([])

  const toggleSeat = (seat) => {
    setSelectedSeats((prev) =>
      prev.find((s) => s.id === seat.id)
        ? prev.filter((s) => s.id !== seat.id)
        : [...prev, seat]
    )
  }

  const totalAmount = selectedSeats.reduce((sum, s) => sum + s.price, 0)

  const handleReserve = () => {
    if (!token) {
      navigate('/login')
      return
    }
    if (selectedSeats.length === 0) return
    navigate(`/events/${eventId}/confirm`, {
      state: { selectedSeats, eventId: Number(eventId), userId: Number(userId) },
    })
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <button onClick={() => navigate('/')} className="text-slate-400 hover:text-white text-sm mb-6 flex items-center gap-1">
        ← 공연 목록으로
      </button>

      <h1 className="text-2xl font-bold text-white mb-1">좌석 선택</h1>
      <p className="text-slate-400 text-sm mb-8">원하는 좌석을 클릭해 선택하세요</p>

      {/* 무대 */}
      <div className="bg-slate-700 rounded-xl py-3 text-center text-slate-400 text-sm mb-10 tracking-widest">
        🎤 STAGE
      </div>

      {/* 좌석 구역 */}
      <div className="space-y-8">
        {Object.entries(MOCK_SEATS).map(([grade, seats]) => (
          <div key={grade}>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-white font-semibold">{grade}</h2>
              <span className="text-slate-400 text-sm">
                {seats[0]?.price.toLocaleString()}원
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {seats.map((seat) => (
                <SeatButton
                  key={seat.id}
                  seat={seat}
                  selected={!!selectedSeats.find((s) => s.id === seat.id)}
                  onClick={toggleSeat}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 범례 */}
      <div className="flex items-center gap-6 mt-10 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-slate-600" /> 선택 가능
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-indigo-600" /> 선택됨
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-900" /> 선점 중
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-slate-700" /> 판매 완료
        </div>
      </div>

      {/* 하단 선택 요약 */}
      {selectedSeats.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">
                선택한 좌석: {selectedSeats.map((s) => `${s.row}${s.num}`).join(', ')}
              </p>
              <p className="text-white font-bold text-lg">
                총 {totalAmount.toLocaleString()}원
              </p>
            </div>
            <button
              onClick={handleReserve}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3 rounded-xl transition"
            >
              예매하기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
