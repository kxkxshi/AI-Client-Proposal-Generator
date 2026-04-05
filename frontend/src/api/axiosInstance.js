import axios from 'axios'
import { supabase } from '../lib/supabaseClient'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: attach Supabase JWT to every request
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }
  return config
})

// Response interceptor: handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.error(
        '[ProposeAI] 401 Unauthorized from backend.',
        'Check that SUPABASE_JWT_SECRET in backend/.env matches your Supabase project.',
        'Visit http://localhost:8080/debug/verify-token to diagnose.'
      )
      // Do NOT redirect — let the component handle the error
    }
    return Promise.reject(error)
  }
)

export default api
