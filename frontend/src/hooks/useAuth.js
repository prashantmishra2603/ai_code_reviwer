import { useState, useCallback } from 'react'
import { authAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

export const useLogin = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { login } = useAuth()

  const handleLogin = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authAPI.login({ email, password })
      login(response.data.user, response.data.access_token)
      return response.data
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed')
      throw err
    } finally {
      setLoading(false)
    }
  }, [login])

  return { handleLogin, loading, error }
}

export const useRegister = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { login } = useAuth()

  const handleRegister = useCallback(async (email, username, password, fullName) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authAPI.register({
        email,
        username,
        password,
        full_name: fullName,
      })
      login(response.data.user, response.data.access_token)
      return response.data
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
      throw err
    } finally {
      setLoading(false)
    }
  }, [login])

  return { handleRegister, loading, error }
}
