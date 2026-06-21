import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SUPPORTED = '.py, .java, .cpp, .js, .ts, .go'
const ACCEPT    = '.py,.java,.cpp,.js,.ts,.go'

const FileUploader = ({ onFileSelect }) => {
  const [isDragActive, setIsDragActive] = useState(false)
  const [selected, setSelected]         = useState(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(e.type === 'dragenter' || e.type === 'dragover')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file) { setSelected(file); onFileSelect(file) }
  }

  const handleChange = (e) => {
    const file = e.target.files[0]
    if (file) { setSelected(file); onFileSelect(file) }
  }

  return (
    <div className="space-y-4">
      <motion.div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        animate={isDragActive ? { scale: 1.02 } : { scale: 1 }}
        className={`relative rounded-2xl border-2 border-dashed p-12 text-center transition-smooth cursor-pointer ${
          isDragActive
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10'
            : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
        }`}
      >
        <input
          id="file-upload"
          type="file"
          accept={ACCEPT}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <AnimatePresence mode="wait">
          {isDragActive ? (
            <motion.div key="drag" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
              <div className="text-5xl mb-4">📥</div>
              <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">Drop it!</p>
            </motion.div>
          ) : (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="text-5xl mb-4"
              >
                📁
              </motion.div>
              <p className="text-base font-bold text-slate-800 dark:text-white mb-1">
                Drag & drop your file here
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                or <span className="text-indigo-500 font-semibold">browse</span> to select
              </p>
              <p className="text-xs text-slate-400 font-mono">{SUPPORTED}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Selected file info */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30"
        >
          <span className="text-2xl">📄</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{selected.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {(selected.size / 1024).toFixed(1)} KB
            </p>
          </div>
          <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default FileUploader
