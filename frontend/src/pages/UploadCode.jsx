import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import CodeEditor from '../components/CodeEditor'
import FileUploader from '../components/FileUploader'
import { useCodeReview } from '../hooks/useCodeReview'
import { useToast } from '../components/Toast'

const LANGUAGES = [
  { value: 'python',     label: 'Python',     icon: '🐍' },
  { value: 'javascript', label: 'JavaScript',  icon: '🟨' },
  { value: 'typescript', label: 'TypeScript',  icon: '🔷' },
  { value: 'java',       label: 'Java',        icon: '☕' },
  { value: 'cpp',        label: 'C++',         icon: '⚙️' },
  { value: 'go',         label: 'Go',          icon: '🔵' },
]

const TABS = ['paste', 'upload']

const UploadCode = () => {
  const [code, setCode]         = useState('')
  const [language, setLanguage] = useState('python')
  const [fileName, setFileName] = useState('')
  const [activeTab, setActiveTab] = useState('paste')
  const navigate = useNavigate()
  const { review, uploadFile, loading } = useCodeReview()
  const { addToast, ToastContainer } = useToast()

  const handleReview = async () => {
    if (!code.trim()) {
      addToast('Please enter some code to review', 'warning')
      return
    }
    try {
      const result = await review(code, language, fileName)
      addToast('Review completed! 🎉', 'success')
      navigate(`/review/${result.id}`)
    } catch {
      addToast('Review failed. Please try again.', 'error')
    }
  }

  const handleFileSelect = async (file) => {
    try {
      const result = await uploadFile(file)
      addToast('File uploaded and reviewed!', 'success')
      navigate(`/review/${result.id}`)
    } catch {
      addToast('Upload failed. Please try again.', 'error')
    }
  }

  const currentLang = LANGUAGES.find(l => l.value === language) || LANGUAGES[0]

  return (
    <div className="page-container">
      <ToastContainer />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="page-heading">Upload & Review Code</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
          Paste your code or upload a file for AI-powered analysis
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex gap-1 p-1 rounded-xl w-fit"
        style={{ background: 'rgba(148,163,184,0.08)', border: '1px solid rgba(148,163,184,0.15)' }}
      >
        {TABS.map(tab => (
          <button
            key={tab}
            id={`tab-${tab}`}
            onClick={() => setActiveTab(tab)}
            className={`relative px-6 py-2.5 rounded-lg text-sm font-semibold transition-smooth capitalize ${
              activeTab === tab ? 'text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="tab-pill"
                className="absolute inset-0 rounded-lg"
                style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
              />
            )}
            <span className="relative z-10">
              {tab === 'paste' ? '✏️ Paste Code' : '📁 Upload File'}
            </span>
          </button>
        ))}
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'paste' ? (
          <motion.div
            key="paste"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Language + filename row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Programming Language
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none">
                    {currentLang.icon}
                  </span>
                  <select
                    id="language-select"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="input pl-10 cursor-pointer appearance-none"
                  >
                    {LANGUAGES.map(l => (
                      <option key={l.value} value={l.value}>{l.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  File Name <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  id="filename-input"
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="e.g., auth.py"
                  className="input"
                />
              </div>
            </div>

            {/* Editor */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Your Code
                </label>
                {code.length > 0 && (
                  <span className="text-xs text-slate-400 font-mono">
                    {code.split('\n').length} lines · {code.length} chars
                  </span>
                )}
              </div>
              <CodeEditor value={code} onChange={setCode} language={language} height="480px" />
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.01, y: loading ? 0 : -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReview}
              disabled={loading}
              id="start-review-btn"
              className="w-full py-4 rounded-xl font-bold text-white text-base transition-smooth
                         disabled:opacity-60 disabled:cursor-not-allowed
                         flex items-center justify-center gap-3"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analyzing code…
                </>
              ) : (
                <>
                  <span>🚀</span>
                  Start AI Review
                </>
              )}
            </motion.button>

            {/* Info chips */}
            <div className="flex flex-wrap gap-3">
              {['Bug Detection', 'Security Scanning', 'Performance Analysis', 'Best Practices'].map(tag => (
                <span key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                             bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  ✓ {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <FileUploader onFileSelect={handleFileSelect} />
            {loading && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-slate-500 dark:text-slate-400 mt-4 text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Uploading and reviewing…
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default UploadCode
