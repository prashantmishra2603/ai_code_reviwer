import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'

const InputField = ({ id, label, type = 'text', value, onChange, placeholder, readOnly }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
      {label}
    </label>
    {type === 'textarea' ? (
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        readOnly={readOnly}
        className="input resize-none"
      />
    ) : (
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`input ${readOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
      />
    )}
  </div>
)

const StatBox = ({ label, value, icon }) => (
  <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/50">
    <span className="text-2xl mb-1">{icon}</span>
    <p className="text-xl font-black text-slate-900 dark:text-white">{value}</p>
    <p className="text-xs text-slate-500 dark:text-slate-400 text-center">{label}</p>
  </div>
)

const Profile = () => {
  const { user } = useAuth()
  const { addToast, ToastContainer } = useToast()
  const [formData, setFormData] = useState({
    email:    user?.email    || '',
    fullName: user?.full_name || '',
    bio:      '',
  })

  const update = (key) => (e) => setFormData({ ...formData, [key]: e.target.value })

  const handleSave = () => {
    addToast('Profile updated!', 'success')
  }

  const initials = (user?.full_name || user?.username || user?.email || 'U')
    .split(' ')
    .map(w => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  return (
    <div className="page-container">
      <ToastContainer />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-heading">Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Manage your personal information</p>
      </motion.div>

      {/* Top row: Avatar + stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="card flex flex-col items-center text-center gap-4"
        >
          {/* Avatar */}
          <div className="relative">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-24 h-24 rounded-3xl flex items-center justify-center text-4xl font-black text-white shadow-xl"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
            >
              {initials}
            </motion.div>
            <button
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-white dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 shadow flex items-center justify-center text-sm transition-smooth hover:scale-110"
              onClick={() => addToast('Photo upload coming soon!', 'info')}
            >
              ✏️
            </button>
          </div>

          <div>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {user?.full_name || user?.username || 'User'}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
          </div>

          {/* Plan badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold text-indigo-600 dark:text-indigo-400"
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
            ✨ Free Plan
          </div>

          <button
            onClick={() => addToast('Upgrade coming soon!', 'info')}
            className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-smooth hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
          >
            Upgrade to Pro 🚀
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2 card"
        >
          <h3 className="section-heading mb-5">Account Statistics</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatBox label="Total Reviews" value="—"   icon="📊" />
            <StatBox label="Avg. Score"    value="—"   icon="⭐" />
            <StatBox label="Reviews Left"  value="20"  icon="💳" />
            <StatBox label="Member Since"  value="2024" icon="📅" />
          </div>
          <div className="mt-5">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Monthly reviews used</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">0 / 20</span>
            </div>
            <div className="progress-bar">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #6366f1, #a855f7)' }}
                initial={{ width: 0 }}
                animate={{ width: '0%' }}
                transition={{ duration: 1.2, delay: 0.5 }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Edit form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card space-y-5"
        >
          <h3 className="section-heading">Edit Profile</h3>
          <InputField
            id="profile-fullname"
            label="Full Name"
            value={formData.fullName}
            onChange={update('fullName')}
            placeholder="Your full name"
          />
          <InputField
            id="profile-email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={update('email')}
            placeholder="you@example.com"
          />
          <InputField
            id="profile-bio"
            label="Bio"
            type="textarea"
            value={formData.bio}
            onChange={update('bio')}
            placeholder="Tell us about yourself…"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="btn-primary w-full sm:w-auto"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save Changes
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-5"
        >
          {/* Security */}
          <div className="card space-y-4">
            <h3 className="section-heading">🔐 Security</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Keep your account secure by using a strong password.
            </p>
            <button
              className="btn-secondary text-sm py-2"
              onClick={() => addToast('Password change coming soon!', 'info')}
            >
              Change Password
            </button>
          </div>

          {/* Danger Zone */}
          <div className="card border-red-200 dark:border-red-900/40 space-y-4">
            <h3 className="text-base font-bold text-red-500">⚠️ Danger Zone</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Once you delete your account, there is no going back.
            </p>
            <button
              className="btn-danger"
              onClick={() => addToast('Contact support to delete your account.', 'warning')}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Account
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Profile
