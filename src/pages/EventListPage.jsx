import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../api/client'

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function EventListPage() {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await client.get('/events')
        setEvents(res.data)
      } catch (err) {
        setError('공연 목록을 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-white mb-2">공연 목록</h1>
      <p className="text-slate-400 text-sm mb-8">예매하고 싶은 공연을 선택하세요</p>

      {loading && (
        <p className="text-slate-400 text-center py-20">공연 목록을 불러오는 중...</p>
      )}

      {error && (
        <p className="text-red-400 text-center py-20">{error}</p>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-slate-800 rounded-2xl overflow-hidden hover:ring-2 hover:ring-indigo-500 transition cursor-pointer"
              onClick={() => navigate(`/events/${event.id}/seats`)}
            >
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
                    <span>{event.venueName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>💰</span>
                    <span>
                      {event.minPrice?.toLocaleString()}원 ~{' '}
                      {event.maxPrice?.toLocaleString()}원
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
      )}
    </div>
  )
}
