import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useRegister } from '../hooks/useAuth'
import { useToast } from '../components/Toast'

const Field = ({ id, label, type = 'text', value, onChange, placeholder, required, minLength, hint, icon }) => {
  const [focused, setFocused] = useState(false)
  const [showPw, setShowPw]   = useState(false)

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-300 mb-2">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">{icon}</div>
        )}
        <input
          id={id}
          type={type === 'password' ? (showPw ? 'text' : 'password') : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full py-3 rounded-xl text-sm font-medium text-white placeholder-slate-500 outline-none transition-smooth"
          style={{
            paddingLeft: icon ? '2.5rem' : '1rem',
            paddingRight: type === 'password' ? '3rem' : '1rem',
            background: 'rgba(255,255,255,0.05)',
            border: `1.5px solid ${focused ? '#6366f1' : 'rgba(255,255,255,0.1)'}`,
          }}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-smooth"
          >
            {showPw ? '🙈' : '👁️'}
          </button>
        )}
      </div>
      {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
    </div>
  )
}

const Register = () => {
  const [formData, setFormData] = useState({ email: '', username: '', password: '', fullName: '' })
  const navigate = useNavigate()
  const { handleRegister, loading, error } = useRegister()
  const { addToast, ToastContainer } = useToast()

  const update = (key) => (e) => setFormData({ ...formData, [key]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password.length < 8) {
      addToast('Password must be at least 8 characters', 'warning')
      return
    }
    try {
      await handleRegister(formData.email, formData.username, formData.password, formData.fullName)
      addToast('Account created! Welcome 🎉', 'success')
      navigate('/dashboard')
    } catch (err) {
      addToast(err.response?.data?.detail || 'Registration failed', 'error')
    }
  }

  const fields = [
    { id: 'reg-fullname', label: 'Full Name', key: 'fullName', type: 'text', placeholder: 'John Doe', icon: '👤' },
    { id: 'reg-username', label: 'Username', key: 'username', type: 'text', placeholder: 'johndoe', required: true, minLength: 3, icon: '@' },
    { id: 'reg-email',    label: 'Email', key: 'email', type: 'email', placeholder: 'you@example.com', required: true, icon: '✉️' },
    { id: 'reg-password', label: 'Password', key: 'password', type: 'password', placeholder: '••••••••', required: true, minLength: 8, hint: 'At least 8 characters', icon: '🔒' },
  ]

  return (
    <div className="min-h-screen bg-[#080b14] flex items-center justify-center p-4 relative overflow-hidden">
      <ToastContainer />

      {/* Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, #a855f7, transparent)', top: '5%', right: '10%' }} />
        <div className="absolute w-80 h-80 rounded-full blur-3xl opacity-15"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)', bottom: '10%', left: '5%' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="rounded-3xl p-8 sm:p-10"
          style={{ background: 'rgba(15,23,42,0.85)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
            >
              🚀
            </motion.div>
            <h1 className="text-2xl font-black text-white">Create your account</h1>
            <p className="text-slate-400 text-sm mt-1">Start reviewing code in seconds</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ id, label, key, type, placeholder, required, minLength, hint, icon }) => (
              <Field
                key={id}
                id={id}
                label={label}
                type={type}
                value={formData[key]}
                onChange={update(key)}
                placeholder={placeholder}
                required={required}
                minLength={minLength}
                hint={hint}
                icon={<span className="text-sm">{icon}</span>}
              />
            ))}

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm">
                ⚠️ {error}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              id="register-submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white mt-2 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account…
                </span>
              ) : 'Create Account →'}
            </motion.button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-smooth">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Register
