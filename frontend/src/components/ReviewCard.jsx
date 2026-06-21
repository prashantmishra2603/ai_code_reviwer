import React from 'react'
import { motion } from 'framer-motion'

const ReviewCard = ({ review, onSelect }) => {
  const score     = review.overall_score     ?? 0
  const security  = review.security_score    ?? 0
  const perf      = review.performance_score ?? 0
  const bugCount  = review.review_result?.bugs?.length           ?? 0
  const secCount  = review.review_result?.security_issues?.length ?? 0

  const scoreColor = score >= 70 ? 'text-emerald-500' : score >= 40 ? 'text-amber-500' : 'text-red-500'
  const scoreBg    = score >= 70 ? 'from-emerald-500 to-teal-500'
                   : score >= 40 ? 'from-amber-500 to-orange-500'
                   : 'from-red-500 to-rose-500'

  const langColors = {
    python:     '#3b82f6',
    javascript: '#eab308',
    typescript: '#6366f1',
    java:       '#ef4444',
    cpp:        '#8b5cf6',
    go:         '#06b6d4',
  }
  const langColor = langColors[review.code_language?.toLowerCase()] || '#6366f1'

  return (
    <motion.div
      onClick={onSelect}
      className="card cursor-pointer group"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      {/* Top row: lang badge + date */}
      <div className="flex items-center justify-between mb-4">
        <span
          className="px-2.5 py-1 rounded-lg text-xs font-bold text-white uppercase tracking-wide"
          style={{ background: langColor }}
        >
          {review.code_language || '?'}
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
          {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
        </span>
      </div>

      {/* File name */}
      <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-4 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-smooth">
        {review.file_name || 'Untitled Review'}
      </h3>

      {/* Score + meta */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <p className={`text-3xl font-black ${scoreColor}`}>{score.toFixed(0)}</p>
          <p className="text-xs text-slate-400 mt-0.5">/ 100 overall</p>
        </div>
        <div className="flex gap-3 text-right">
          <div>
            <p className="text-sm font-bold text-red-500">{bugCount}</p>
            <p className="text-xs text-slate-400">bugs</p>
          </div>
          <div>
            <p className="text-sm font-bold text-orange-500">{secCount}</p>
            <p className="text-xs text-slate-400">security</p>
          </div>
        </div>
      </div>

      {/* Sub-scores */}
      <div className="space-y-2">
        {[
          { label: 'Security',     value: security },
          { label: 'Performance',  value: perf     },
        ].map(({ label, value }) => (
          <div key={label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{value.toFixed(0)}</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-700">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${scoreBg}`}
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Arrow indicator */}
      <div className="mt-4 flex items-center justify-end">
        <span className="text-xs font-semibold text-indigo-500 opacity-0 group-hover:opacity-100 transition-smooth flex items-center gap-1">
          View details
          <svg className="w-3.5 h-3.5 translate-x-0 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </motion.div>
  )
}

export default ReviewCard
