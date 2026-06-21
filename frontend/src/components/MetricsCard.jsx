import React from 'react'
import { motion } from 'framer-motion'

const MetricsCard = ({ title, value, unit = '', icon, trend, color = 'indigo', delay = 0 }) => {
  const colors = {
    indigo:  { bg: 'bg-indigo-500/10 dark:bg-indigo-500/20',  text: 'text-indigo-600 dark:text-indigo-400',  icon: 'bg-indigo-500' },
    emerald: { bg: 'bg-emerald-500/10 dark:bg-emerald-500/20', text: 'text-emerald-600 dark:text-emerald-400', icon: 'bg-emerald-500' },
    red:     { bg: 'bg-red-500/10 dark:bg-red-500/20',         text: 'text-red-600 dark:text-red-400',         icon: 'bg-red-500' },
    amber:   { bg: 'bg-amber-500/10 dark:bg-amber-500/20',     text: 'text-amber-600 dark:text-amber-400',     icon: 'bg-amber-500' },
    purple:  { bg: 'bg-purple-500/10 dark:bg-purple-500/20',   text: 'text-purple-600 dark:text-purple-400',   icon: 'bg-purple-500' },
  }

  const scheme = colors[color] || colors.indigo

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="card group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            {title}
          </p>
          <div className="flex items-end gap-1">
            <span className={`text-3xl font-bold ${scheme.text}`}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
            {unit && <span className="text-sm text-slate-400 dark:text-slate-500 mb-1">{unit}</span>}
          </div>
          {trend && (
            <p className={`text-xs mt-1.5 font-medium ${trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last week
            </p>
          )}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${scheme.bg} transition-smooth group-hover:scale-110`}>
          {icon}
        </div>
      </div>
    </motion.div>
  )
}

export default MetricsCard
