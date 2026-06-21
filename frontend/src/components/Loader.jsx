import React from 'react'
import { motion } from 'framer-motion'

const Loader = ({ fullScreen = true, text = 'Loading...' }) => {
  const dots = [0, 1, 2]

  const container = (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Logo spinner */}
      <div className="relative">
        <motion.div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
          style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
          animate={{ rotate: [0, 10, -10, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          🤖
        </motion.div>
        {/* Ring */}
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-indigo-500/30"
          animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>

      {/* Dots */}
      <div className="flex items-center gap-2">
        {dots.map(i => (
          <motion.div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-indigo-500"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>

      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium tracking-wide">
        {text}
      </p>
    </div>
  )

  if (fullScreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-screen w-full bg-white dark:bg-slate-900"
      >
        {container}
      </motion.div>
    )
  }

  return (
    <div className="flex items-center justify-center py-20">
      {container}
    </div>
  )
}

export default Loader
