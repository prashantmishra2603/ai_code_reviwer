import React, { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

/* ─── Feature data ───────────────────────────────────────────────── */
const features = [
  {
    icon: '🔍',
    title: 'Smart Analysis',
    desc: 'Deep static analysis with AI to detect bugs, anti-patterns, and code smells instantly.',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    icon: '🛡️',
    title: 'Security Scanning',
    desc: 'Detect SQL injection, XSS, CSRF, and dozens of OWASP vulnerabilities automatically.',
    color: 'from-red-500 to-orange-500',
  },
  {
    icon: '⚡',
    title: 'Performance Insights',
    desc: 'Spot memory leaks, inefficient loops, and unoptimized queries with precision.',
    color: 'from-yellow-500 to-amber-500',
  },
  {
    icon: '💬',
    title: 'AI Chat Assistant',
    desc: 'Ask questions about your code and get context-aware answers powered by RAG.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: '📚',
    title: 'Auto Documentation',
    desc: 'Generate comprehensive docstrings, README files, and API docs in seconds.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: '📊',
    title: 'Quality Scoring',
    desc: 'Get detailed scores for maintainability, reliability, and technical debt.',
    color: 'from-cyan-500 to-indigo-500',
  },
]

const stats = [
  { value: '50K+', label: 'Code Reviews' },
  { value: '99.2%', label: 'Accuracy Rate' },
  { value: '2s', label: 'Avg. Review Time' },
  { value: '12+', label: 'Languages' },
]

/* ─── Animated background blobs ─────────────────────────────────── */
const Blobs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[
      { w: 500, h: 500, x: '10%', y: '20%', color: 'rgba(99,102,241,0.12)', delay: 0 },
      { w: 400, h: 400, x: '70%', y: '10%', color: 'rgba(168,85,247,0.10)', delay: 1 },
      { w: 350, h: 350, x: '80%', y: '60%', color: 'rgba(236,72,153,0.08)', delay: 2 },
      { w: 300, h: 300, x: '5%',  y: '70%', color: 'rgba(59,130,246,0.08)', delay: 1.5 },
    ].map((b, i) => (
      <motion.div
        key={i}
        style={{
          position: 'absolute',
          width: b.w, height: b.h,
          left: b.x, top: b.y,
          borderRadius: '50%',
          background: b.color,
          filter: 'blur(80px)',
        }}
        animate={{ scale: [1, 1.1, 1], x: [0, 20, 0], y: [0, -20, 0] }}
        transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: b.delay }}
      />
    ))}
  </div>
)

const Landing = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 400], [0, -60])

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard')
  }, [isAuthenticated, navigate])

  return (
    <div className="min-h-screen bg-[#080b14] text-white overflow-x-hidden">
      <Blobs />

      {/* ── NAVBAR ── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex items-center justify-between px-6 lg:px-16 py-5
                   border-b border-white/5 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-xl"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
          >
            🤖
          </div>
          <span className="font-bold text-lg">CodeReview <span className="gradient-text">AI</span></span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-5 py-2 rounded-xl text-sm font-semibold text-slate-300
                       hover:text-white hover:bg-white/10 transition-smooth"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-smooth
                       hover:-translate-y-0.5 hover:shadow-lg"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
          >
            Get Started Free
          </Link>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <motion.section
        style={{ y: heroY }}
        className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-24 pb-32"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-sm font-medium"
          style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
          </span>
          <span className="text-indigo-300">AI-Powered · Instant · Accurate</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-tight mb-6 max-w-5xl"
        >
          Code Review That{' '}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)' }}
          >
            Actually Works
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="text-lg sm:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed"
        >
          Upload your code and get instant AI-powered feedback on bugs, security vulnerabilities,
          performance, and maintainability — in seconds.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Link
            to="/register"
            className="px-8 py-4 rounded-2xl text-base font-bold text-white
                       transition-smooth hover:-translate-y-1 hover:shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              boxShadow: '0 0 40px rgba(99,102,241,0.3)',
            }}
          >
            Start Free Review →
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 rounded-2xl text-base font-semibold text-white
                       transition-smooth hover:-translate-y-0.5"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            Sign In
          </Link>
        </motion.div>

        {/* Code preview badge */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.7 }}
          className="mt-16 w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl"
          style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(15,23,42,0.8)' }}
        >
          {/* Terminal bar */}
          <div className="flex items-center gap-2 px-4 py-3" style={{ background: 'rgba(0,0,0,0.4)' }}>
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-4 text-slate-400 text-xs font-mono">app.py — CodeReview AI</span>
          </div>
          {/* Code snippet */}
          <pre className="px-6 py-5 text-sm font-mono text-left overflow-x-auto leading-relaxed">
            <span className="text-slate-500"># 🤖 AI Review Results</span>{'\n'}
            <span className="text-indigo-400">def</span>{' '}
            <span className="text-emerald-400">authenticate_user</span>
            <span className="text-white">(username, password):</span>{'\n'}
            {'    '}<span className="text-yellow-400">query</span>{' = '}
            <span className="text-red-400">"SELECT * FROM users WHERE name='"</span>{' + username'}{'\n'}
            {'    '}<span className="text-slate-400"># ⚠️  SQL Injection vulnerability detected</span>{'\n'}
            {'    '}<span className="text-slate-400"># ✅  Fix: Use parameterized queries</span>{'\n'}
            {'    '}<span className="text-slate-500">score: 42 / 100 — Critical Issues: 1</span>
          </pre>
        </motion.div>
      </motion.section>

      {/* ── STATS ── */}
      <section className="relative z-10 py-16 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-4xl font-black bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                {stat.value}
              </p>
              <p className="text-slate-400 text-sm mt-1 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-black mb-4">
              Everything you need for{' '}
              <span className="gradient-text">great code</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              One platform, all the tools. No configuration needed.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="p-6 rounded-2xl transition-smooth"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4
                                 bg-gradient-to-br ${f.color} bg-opacity-20`}
                  style={{ boxShadow: '0 0 20px rgba(99,102,241,0.15)' }}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FOOTER ── */}
      <section className="relative z-10 py-24 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-4xl font-black mb-4">Ready to ship better code?</h2>
          <p className="text-slate-400 mb-8">Join thousands of developers who review smarter.</p>
          <Link
            to="/register"
            className="inline-block px-10 py-4 rounded-2xl text-base font-bold text-white
                       transition-smooth hover:-translate-y-1 hover:shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              boxShadow: '0 0 40px rgba(99,102,241,0.3)',
            }}
          >
            Get Started — It's Free →
          </Link>
        </motion.div>
      </section>

      <footer className="relative z-10 text-center py-8 text-slate-600 text-sm border-t border-white/5">
        © 2024 CodeReview AI · All rights reserved.
      </footer>
    </div>
  )
}

export default Landing
