import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

export default function Navbar() {
  const { token, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-slate-900 border-b border-slate-700 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-white flex items-center gap-2">
          🎫 <span>티켓예매</span>
        </Link>
        <div className="flex items-center gap-4">
          {token ? (
            <>
              <Link
                to="/my-reservations"
                className="text-slate-300 hover:text-white text-sm transition"
              >
                내 예매
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition"
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
