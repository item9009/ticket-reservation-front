import { useNavigate } from 'react-router-dom'

// 백엔드에 Event 조회 API가 없어서 Mock 데이터 사용
const MOCK_EVENTS = [
  {
    id: 1,
    title: '2026 봄 콘서트',
    description: '봄의 기운을 담은 특별한 공연',
    eventDate: '2026-06-01T19:00:00',
    venue: '올림픽홀',
    status: 'SCHEDULED',
    minPrice: 100000,
    maxPrice: 150000,
  },
  {
    id: 2,
    title: '여름 페스티벌',
    description: '여름밤을 수놓을 화려한 페스티벌',
    eventDate: '2026-07-15T18:00:00',
    venue: '올림픽공원',
    status: 'SCHEDULED',
    minPrice: 80000,
    maxPrice: 120000,
  },
  {
    id: 3,
    title: '가을 클래식 연주회',
    description: '감성을 자극하는 클래식 음악의 밤',
    eventDate: '2026-09-20T19:30:00',
    venue: '예술의 전당',
    status: 'SCHEDULED',
    minPrice: 50000,
    maxPrice: 200000,
  },
]

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function EventListPage() {
  const navigate = useNavigate()

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-white mb-2">공연 목록</h1>
      <p className="text-slate-400 text-sm mb-8">예매하고 싶은 공연을 선택하세요</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_EVENTS.map((event) => (
          <div
            key={event.id}
            className="bg-slate-800 rounded-2xl overflow-hidden hover:ring-2 hover:ring-indigo-500 transition cursor-pointer"
            onClick={() => navigate(`/events/${event.id}/seats`)}
          >
            {/* 썸네일 */}
            <div className="h-40 bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
              <span className="text-5xl">🎵</span>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                  예매 가능
                </span>
              </div>
              <h2 className="text-white font-bold text-lg mb-1">{event.title}</h2>
              <p className="text-slate-400 text-sm mb-3">{event.description}</p>

              <div className="space-y-1 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <span>📅</span>
                  <span>{formatDate(event.eventDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>{event.venue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>💰</span>
                  <span>
                    {event.minPrice.toLocaleString()}원 ~{' '}
                    {event.maxPrice.toLocaleString()}원
                  </span>
                </div>
              </div>

              <button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-2.5 rounded-lg transition">
                좌석 선택
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
