import { useState, useCallback } from 'react'
import { reviewAPI } from '../services/api'

export const useCodeReview = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const review = useCallback(async (code, language, fileName = null) => {
    setLoading(true)
    setError(null)
    try {
      const response = await reviewAPI.reviewCode(code, language, fileName)
      setResult(response.data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.detail || 'Review failed')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const uploadFile = useCallback(async (file) => {
    setLoading(true)
    setError(null)
    try {
      const response = await reviewAPI.uploadFile(file)
      setResult(response.data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { review, uploadFile, loading, error, result }
}
