import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import client from '../api/client'

function SeatButton({ seat, seatIndex, selected, onClick }) {
  const base = 'w-12 h-12 rounded-lg text-xs font-semibold transition flex flex-col items-center justify-center gap-0.5'
  const label = `${seatIndex + 1}번`

  if (seat.status === 'SOLD') {
    return (
      <div className={`${base} bg-red-900 text-red-400 cursor-not-allowed relative`}>
        <span className="text-lg font-bold">✕</span>
      </div>
    )
  }
  if (seat.status === 'RESERVED') {
    return (
      <div className={`${base} bg-yellow-900 text-yellow-600 cursor-not-allowed`}>
        <span>{label}</span>
        <span>선점</span>
      </div>
    )
  }
  return (
    <button
      onClick={() => onClick({ ...seat, seatIndex })}
      className={`${base} ${
        selected
          ? 'bg-indigo-600 text-white ring-2 ring-indigo-300'
          : 'bg-slate-600 hover:bg-indigo-700 text-white'
      }`}
    >
      <span>{label}</span>
    </button>
  )
}

export default function SeatSelectPage() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const { token, userId } = useAuthStore()
  const [selectedSeats, setSelectedSeats] = useState([])
  const [seatsByGrade, setSeatsByGrade] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const res = await client.get(`/events/${eventId}/seats`)
        const seats = res.data

        // grade 기준으로 그룹핑
        const grouped = seats.reduce((acc, seat) => {
          const grade = seat.grade ?? seat.section ?? '일반'
          if (!acc[grade]) acc[grade] = []
          acc[grade].push(seat)
          return acc
        }, {})

        setSeatsByGrade(grouped)
      } catch (err) {
        setError('좌석 정보를 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchSeats()
  }, [eventId])

  const toggleSeat = (seat) => {
    setSelectedSeats((prev) =>
      prev.find((s) => s.eventSeatId === seat.eventSeatId)
        ? prev.filter((s) => s.eventSeatId !== seat.eventSeatId)
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
      {loading && (
        <p className="text-slate-400 text-center py-10">좌석 정보를 불러오는 중...</p>
      )}

      {error && (
        <p className="text-red-400 text-center py-10">{error}</p>
      )}

      {!loading && !error && (
        <div className="space-y-8">
          {Object.entries(seatsByGrade).map(([grade, seats]) => (
            <div key={grade}>
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-white font-semibold">{grade}</h2>
                <span className="text-slate-400 text-sm">
                  {seats[0]?.price.toLocaleString()}원
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {seats.map((seat, index) => (
                  <SeatButton
                    key={seat.eventSeatId}
                    seat={seat}
                    seatIndex={index}
                    selected={!!selectedSeats.find((s) => s.eventSeatId === seat.eventSeatId)}
                    onClick={toggleSeat}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

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
          <div className="w-4 h-4 rounded bg-red-900 flex items-center justify-center text-red-400 text-xs font-bold">✕</div> 판매 완료
        </div>
      </div>

      {/* 하단 선택 요약 */}
      {selectedSeats.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">
                선택한 좌석: {selectedSeats.map((s) => `${s.grade}석 ${s.seatIndex + 1}번`).join(', ')}
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
