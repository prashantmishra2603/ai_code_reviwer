import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { historyAPI } from '../services/api'
import ReviewCard from '../components/ReviewCard'
import { useToast } from '../components/Toast'
import Loader from '../components/Loader'

const LANGUAGES = ['python', 'java', 'cpp', 'javascript', 'typescript', 'go']

const History = () => {
  const [reviews, setReviews]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [language, setLanguage] = useState(null)
  const [search, setSearch]     = useState('')
  const navigate = useNavigate()
  const { addToast, ToastContainer } = useToast()

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const res = await historyAPI.getHistory(0, 50, language)
        setReviews(res.data)
      } catch {
        addToast('Failed to load history', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [language])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return
    try {
      await historyAPI.deleteReview(id)
      setReviews(prev => prev.filter(r => r.id !== id))
      addToast('Review deleted', 'success')
    } catch {
      addToast('Failed to delete', 'error')
    }
  }

  const handleExport = async (id, format = 'json') => {
    try {
      const res = await historyAPI.exportReview(id, format)
      const blob = new Blob([res.data], { type: res.headers['content-type'] })
      const url  = URL.createObjectURL(blob)
      const a    = Object.assign(document.createElement('a'), {
        href: url, download: `review_${id}.${format === 'markdown' ? 'md' : format}`,
      })
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      addToast(`Exported as ${format.toUpperCase()}`, 'success')
    } catch {
      addToast('Export failed', 'error')
    }
  }

  const filtered = reviews.filter(r =>
    !search || (r.file_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.code_language || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page-container">
      <ToastContainer />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h1 className="page-heading">Review History</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            {reviews.length} review{reviews.length !== 1 ? 's' : ''} total
          </p>
        </div>
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search reviews…"
            className="input pl-9 text-sm"
            id="history-search"
          />
        </div>
      </motion.div>

      {/* Language Filters */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-wrap gap-2">
        <button
          onClick={() => setLanguage(null)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-smooth ${
            language === null
              ? 'text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
          style={language === null ? { background: 'linear-gradient(135deg, #6366f1, #a855f7)' } : {}}
        >
          All
        </button>
        {LANGUAGES.map(lang => (
          <button
            key={lang}
            onClick={() => setLanguage(lang === language ? null : lang)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-smooth ${
              language === lang
                ? 'text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            style={language === lang ? { background: 'linear-gradient(135deg, #6366f1, #a855f7)' } : {}}
          >
            {lang}
          </button>
        ))}
      </motion.div>

      {/* Grid */}
      {loading ? (
        <Loader fullScreen={false} text="Loading history…" />
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 flex flex-col items-center gap-4"
        >
          <div className="text-6xl">📭</div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            {search ? 'No reviews match your search' : 'No reviews yet'}
          </p>
          {!search && (
            <button onClick={() => navigate('/upload')} className="btn-primary">
              Start your first review →
            </button>
          )}
        </motion.div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
        >
          <AnimatePresence>
            {filtered.map((review, i) => (
              <motion.div
                key={review.id}
                layout
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.04, duration: 0.35 }}
                className="relative group"
              >
                <ReviewCard
                  review={review}
                  onSelect={() => navigate(`/review/${review.id}`)}
                />
                {/* Action buttons appear on hover */}
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-smooth"
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); handleExport(review.id, 'json') }}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow"
                    style={{ background: '#4f46e5' }}
                    title="Export JSON"
                  >
                    JSON
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleExport(review.id, 'markdown') }}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow"
                    style={{ background: '#059669' }}
                    title="Export Markdown"
                  >
                    MD
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(review.id) }}
                    className="p-1.5 rounded-lg text-white shadow"
                    style={{ background: '#dc2626' }}
                    title="Delete"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}

export default History
