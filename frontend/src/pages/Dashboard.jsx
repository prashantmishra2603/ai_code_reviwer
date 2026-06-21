import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { historyAPI } from '../services/api'
import MetricsCard from '../components/MetricsCard'
import { PieChartComponent } from '../components/Charts'
import { useToast } from '../components/Toast'

const quickActions = [
  {
    label: 'New Review',
    desc: 'Upload or paste code',
    icon: '📤',
    path: '/upload',
    color: 'from-indigo-500 to-purple-600',
    glow: 'rgba(99,102,241,0.35)',
  },
  {
    label: 'View History',
    desc: 'Browse past reviews',
    icon: '🕐',
    path: '/history',
    color: 'from-emerald-500 to-teal-600',
    glow: 'rgba(16,185,129,0.3)',
  },
  {
    label: 'Settings',
    desc: 'Manage preferences',
    icon: '⚙️',
    path: '/settings',
    color: 'from-slate-600 to-slate-700',
    glow: 'rgba(100,116,139,0.25)',
  },
]

const SkeletonCard = () => (
  <div className="card space-y-3">
    <div className="h-3 w-24 skeleton rounded" />
    <div className="h-8 w-16 skeleton rounded" />
    <div className="h-2.5 w-20 skeleton rounded" />
  </div>
)

const Dashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats]   = useState(null)
  const [loading, setLoading] = useState(true)
  const { addToast, ToastContainer } = useToast()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await historyAPI.getStats()
        setStats(response.data)
      } catch {
        addToast('Could not load stats', 'warning')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const languageData = stats
    ? Object.entries(stats.languages_used || {}).map(([name, value]) => ({ name, value }))
    : []

  const metricsConfig = [
    { title: 'Total Reviews',      value: stats?.total_reviews     ?? 0, icon: '📊', color: 'indigo',  delay: 0    },
    { title: 'Average Score',       value: stats?.average_score     ?? 0, unit: '/100', icon: '⭐', color: 'emerald', delay: 0.08 },
    { title: 'Security Issues',     value: stats?.security_issues   ?? 0, icon: '🛡️', color: 'red',    delay: 0.16 },
    { title: 'Performance Issues',  value: stats?.performance_issues ?? 0, icon: '⚡', color: 'amber',  delay: 0.24 },
  ]

  return (
    <div className="page-container">
      <ToastContainer />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="page-heading">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Your code quality overview at a glance
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          <Link
            to="/upload"
            id="dashboard-new-review"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg transition-smooth hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Review
          </Link>
        </motion.div>
      </motion.div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : metricsConfig.map((m, i) => (
              <MetricsCard key={i} {...m} />
            ))}
      </div>

      {/* Charts + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="card h-64 skeleton" />
          ) : languageData.length > 0 ? (
            <PieChartComponent data={languageData} title="Languages Distribution" />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card h-64 flex flex-col items-center justify-center text-center gap-3"
            >
              <div className="text-5xl">📊</div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                No language data yet.<br />Submit your first review!
              </p>
              <Link to="/upload" className="btn-primary text-sm py-2 px-4">
                Start Review
              </Link>
            </motion.div>
          )}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="card space-y-4"
        >
          <h3 className="section-heading">Quick Actions</h3>
          <div className="space-y-3">
            {quickActions.map((action, i) => (
              <motion.button
                key={i}
                whileHover={{ x: 4, transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(action.path)}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-smooth
                           hover:bg-slate-50 dark:hover:bg-slate-700/50 text-left group"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 bg-gradient-to-br ${action.color} transition-smooth group-hover:scale-110`}
                >
                  {action.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">{action.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{action.desc}</p>
                </div>
                <svg className="w-4 h-4 text-slate-400 ml-auto shrink-0 group-hover:text-indigo-500 transition-smooth" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Reviews */}
      {stats?.recent_reviews && stats.recent_reviews.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="section-heading">Recent Reviews</h3>
            <Link to="/history" className="text-sm font-semibold text-indigo-500 hover:text-indigo-400 transition-smooth">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recent_reviews.slice(0, 5).map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                onClick={() => navigate(`/review/${r.id}`)}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/40 cursor-pointer transition-smooth group"
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold text-white shrink-0"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                  {r.code_language?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                    {r.file_name || 'Untitled Review'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{r.code_language}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-sm font-bold ${
                    (r.overall_score ?? 0) >= 70 ? 'text-emerald-500' :
                    (r.overall_score ?? 0) >= 40 ? 'text-amber-500' : 'text-red-500'
                  }`}>
                    {(r.overall_score ?? 0).toFixed(0)}
                  </p>
                  <p className="text-xs text-slate-400">/100</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Dashboard
