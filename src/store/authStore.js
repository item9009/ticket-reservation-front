import { create } from 'zustand'

const useAuthStore = create((set) => ({
  token: localStorage.getItem('token') || null,
  userId: localStorage.getItem('userId') || null,
  role: localStorage.getItem('role') || null,

  login: (token, userId, role) => {
    localStorage.setItem('token', token)
    localStorage.setItem('userId', userId)
    localStorage.setItem('role', role)
    set({ token, userId, role })
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('role')
    set({ token: null, userId: null, role: null })
  },
}))

export default useAuthStore
