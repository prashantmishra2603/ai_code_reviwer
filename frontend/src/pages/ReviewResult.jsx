import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { reviewAPI, chatAPI } from '../services/api'
import CodeEditor from '../components/CodeEditor'
import ChatPanel from '../components/ChatPanel'
import { useToast } from '../components/Toast'
import Loader from '../components/Loader'

/* ─── Score pill ─────────────────────────────────────────────────── */
const ScorePill = ({ label, value, color }) => {
  const pct = Math.min(100, Math.max(0, value ?? 0))
  const colorMap = {
    indigo: { bar: 'from-indigo-500 to-purple-500', text: 'text-indigo-600 dark:text-indigo-400' },
    red:    { bar: 'from-red-500 to-orange-500',    text: 'text-red-600 dark:text-red-400' },
    amber:  { bar: 'from-amber-500 to-yellow-500',  text: 'text-amber-600 dark:text-amber-400' },
    emerald:{ bar: 'from-emerald-500 to-teal-500',  text: 'text-emerald-600 dark:text-emerald-400' },
  }
  const scheme = colorMap[color] || colorMap.indigo

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="card text-center"
    >
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">{label}</p>
      <p className={`text-4xl font-black mb-3 ${scheme.text}`}>{pct.toFixed(0)}</p>
      <div className="progress-bar">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${scheme.bar}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  )
}

/* ─── Issue item ─────────────────────────────────────────────────── */
const IssueItem = ({ severity, line, description, fix, idx }) => {
  const [open, setOpen] = useState(false)
  const severityMap = {
    critical: { color: 'border-red-500',    badge: 'badge-critical', icon: '🔴' },
    high:     { color: 'border-orange-500', badge: 'badge-high',     icon: '🟠' },
    medium:   { color: 'border-yellow-500', badge: 'badge-medium',   icon: '🟡' },
    low:      { color: 'border-green-500',  badge: 'badge-low',      icon: '🟢' },
  }
  const s = severityMap[severity] || severityMap.medium

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.06 }}
      className={`border-l-4 ${s.color} pl-4 py-3 rounded-r-xl bg-slate-50 dark:bg-slate-800/50 cursor-pointer`}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={s.badge}>{s.icon} {severity?.toUpperCase()}</span>
          {line && <span className="text-xs text-slate-500 font-mono">Line {line}</span>}
        </div>
        <svg className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <p className="text-sm text-slate-700 dark:text-slate-300 mt-2 font-medium">{description}</p>
      <AnimatePresence>
        {open && fix && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3 overflow-hidden"
          >
            <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
              <span className="text-emerald-500 mt-0.5">✓</span>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">{fix}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─── Main Page ──────────────────────────────────────────────────── */
const ReviewResult = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [review, setReview]         = useState(null)
  const [loading, setLoading]       = useState(true)
  const [messages, setMessages]     = useState([])
  const [chatLoading, setChatLoading] = useState(false)
  const { addToast, ToastContainer } = useToast()

  useEffect(() => {
    const load = async () => {
      try {
        const [reviewRes, chatRes] = await Promise.all([
          reviewAPI.getReview(id),
          chatAPI.getHistory(id),
        ])
        setReview(reviewRes.data)
        const sorted = [...chatRes.data].reverse()
        const msgs = []
        sorted.forEach(c => {
          msgs.push({ type: 'user', content: c.user_message })
          msgs.push({ type: 'ai', content: c.ai_response })
        })
        setMessages(msgs)
      } catch {
        addToast('Failed to load review', 'error')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <Loader fullScreen={false} text="Loading review…" />
  if (!review)  return (
    <div className="page-container flex flex-col items-center justify-center py-20 gap-4">
      <div className="text-5xl">❌</div>
      <p className="text-slate-500 dark:text-slate-400">Review not found</p>
      <button onClick={() => navigate('/history')} className="btn-primary">← Back to History</button>
    </div>
  )

  const result = review.review_result || {}

  return (
    <div className="page-container">
      <ToastContainer />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between"
      >
        <div>
          <div className="flex items-center gap-3 mb-1">
            <button onClick={() => navigate('/history')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-smooth">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="page-heading">Review Result</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {review.file_name || 'Untitled'} ·{' '}
            <span className="capitalize">{review.code_language}</span> ·{' '}
            {new Date(review.created_at).toLocaleString()}
          </p>
        </div>
      </motion.div>

      {/* Scores */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <ScorePill label="Overall Score"    value={review.overall_score}         color="indigo"  />
        <ScorePill label="Security"          value={review.security_score}        color="red"     />
        <ScorePill label="Performance"       value={review.performance_score}     color="amber"   />
        <ScorePill label="Maintainability"   value={review.maintainability_score} color="emerald" />
      </div>

      {/* Code + Chat */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="card">
          <h3 className="section-heading mb-4">📄 Source Code</h3>
          <CodeEditor
            value={review.code_content}
            language={review.code_language}
            height="420px"
            readOnly
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <ChatPanel
            messages={messages}
            isLoading={chatLoading}
            onSendMessage={async (msg) => {
              setChatLoading(true)
              setMessages(prev => [...prev, { type: 'user', content: msg }])
              try {
                const res = await chatAPI.sendMessage(msg, parseInt(id))
                setMessages(prev => [...prev, { type: 'ai', content: res.data.ai_response }])
              } catch {
                addToast('Failed to send message', 'error')
              } finally {
                setChatLoading(false)
              }
            }}
          />
        </motion.div>
      </div>

      {/* Bugs */}
      {result.bugs?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card">
          <h3 className="section-heading mb-4">
            🐛 Bugs Found
            <span className="ml-2 badge badge-critical">{result.bugs.length}</span>
          </h3>
          <div className="space-y-3">
            {result.bugs.map((bug, i) => (
              <IssueItem key={i} idx={i} severity={bug.severity} line={bug.line} description={bug.description} fix={bug.fix} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Security */}
      {result.security_issues?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card">
          <h3 className="section-heading mb-4">
            🛡️ Security Issues
            <span className="ml-2 badge badge-high">{result.security_issues.length}</span>
          </h3>
          <div className="space-y-3">
            {result.security_issues.map((issue, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                className="border-l-4 border-orange-500 pl-4 py-3 rounded-r-xl bg-orange-50 dark:bg-orange-900/15">
                <p className="text-sm font-semibold text-orange-700 dark:text-orange-300">
                  {issue.issue || issue.description || JSON.stringify(issue)}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Best Practices */}
      {result.best_practices?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card">
          <h3 className="section-heading mb-4">⭐ Best Practices</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {result.best_practices.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/15 border border-emerald-200 dark:border-emerald-800">
                <span className="text-emerald-500 text-sm mt-0.5">✓</span>
                <p className="text-sm text-slate-700 dark:text-slate-300">{p}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ReviewResult
