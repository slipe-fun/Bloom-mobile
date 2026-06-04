import { API_URL } from '@constants/api'
import axios from 'axios'

interface LoginBeginResponse {
  challenge: string
  keys: {
    encrypted_master_key: string
    identity_keys: {
      encrypted_secret_keys: string
      public_keys: {
        ml_kem_public_key: string
        ecdh_public_key: string
        ed_public_key: string
      }
    }
  }
}

interface AuthResponse {
  user: { id: string }
  token: string
  session: any
}

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const authApi = {
  loginBegin: async (userId: string): Promise<LoginBeginResponse> => {
    const { data } = await apiClient.get(`/auth/login/begin/${userId}`)
    return data
  },

  loginFinish: async (userId: string, signature: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/login/finish', {
      user_id: userId,
      signature,
    })
    return data
  },

  register: async (payload: any): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/register', payload)
    return data
  },
}
