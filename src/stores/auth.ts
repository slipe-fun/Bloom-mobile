import { create } from 'zustand'

type AuthStore = {
  email: string
  setEmail: (email: string) => void
  emailValid: boolean
  setEmailValid: (emailValid: boolean) => void
  otp: string
  setOtp: (otp: string) => void
  error: string
  setError: (error: string) => void
  footerHeight: number
  password: string
  setPasssword: (password: string) => void
  username: string
  setUsername: (username: string) => void
  exists: boolean
  setExists: (exists: boolean) => void
}

const useAuthStore = create<AuthStore>((set) => ({
  email: '',
  setEmail: (email) => set({ email }),
  emailValid: false,
  setEmailValid: (emailValid) => set({ emailValid }),
  otp: '',
  setOtp: (otp) => set({ otp }),
  error: '',
  setError: (error) => set({ error }),
  footerHeight: 68,
  password: '',
  setPasssword: (password) => set({ password }),
  username: '',
  setUsername: (username) => set({ username }),
  exists: false,
  setExists: (exists) => set({ exists }),
}))

export default useAuthStore
