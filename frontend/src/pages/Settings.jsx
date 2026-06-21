import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { useToast } from '../components/Toast'

/* ─── Toggle switch ──────────────────────────────────────────────── */
const Toggle = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative w-11 h-6 rounded-full transition-all duration-300 ${
      checked ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'
    }`}
  >
    <motion.div
      animate={{ x: checked ? 22 : 2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
    />
  </button>
)

/* ─── Setting row ────────────────────────────────────────────────── */
const SettingRow = ({ label, description, children }) => (
  <div className="flex items-center justify-between gap-6 py-4 border-b border-slate-100 dark:border-slate-700/50 last:border-0">
    <div className="min-w-0">
      <p className="text-sm font-semibold text-slate-800 dark:text-white">{label}</p>
      {description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>}
    </div>
    <div className="shrink-0">{children}</div>
  </div>
)

/* ─── Section card ───────────────────────────────────────────────── */
const Section = ({ title, icon, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="card"
  >
    <div className="flex items-center gap-2.5 mb-5">
      <span className="text-xl">{icon}</span>
      <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>
    </div>
    {children}
  </motion.div>
)

const Settings = () => {
  const { isDark, toggleTheme } = useTheme()
  const { addToast, ToastContainer } = useToast()
  const [prefs, setPrefs] = useState({
    notifications:   true,
    emailAlerts:     false,
    autoSave:        true,
    compactMode:     false,
    soundEffects:    false,
    analyticsShare:  true,
  })

  const toggle = (key) => setPrefs(p => ({ ...p, [key]: !p[key] }))

  const handleSave = () => {
    localStorage.setItem('user_prefs', JSON.stringify(prefs))
    addToast('Settings saved!', 'success')
  }

  return (
    <div className="page-container">
      <ToastContainer />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-heading">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Manage your preferences and account</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance */}
        <Section title="Appearance" icon="🎨" delay={0.05}>
          <SettingRow label="Dark Mode" description="Switch between light and dark interface">
            <Toggle checked={isDark} onChange={toggleTheme} />
          </SettingRow>
          <SettingRow label="Compact Mode" description="Reduce padding for more content">
            <Toggle checked={prefs.compactMode} onChange={() => toggle('compactMode')} />
          </SettingRow>
        </Section>

        {/* Notifications */}
        <Section title="Notifications" icon="🔔" delay={0.1}>
          <SettingRow label="Push Notifications" description="Receive alerts in the browser">
            <Toggle checked={prefs.notifications} onChange={() => toggle('notifications')} />
          </SettingRow>
          <SettingRow label="Email Alerts" description="Get review summaries via email">
            <Toggle checked={prefs.emailAlerts} onChange={() => toggle('emailAlerts')} />
          </SettingRow>
          <SettingRow label="Sound Effects" description="Play sounds on review completion">
            <Toggle checked={prefs.soundEffects} onChange={() => toggle('soundEffects')} />
          </SettingRow>
        </Section>

        {/* Privacy */}
        <Section title="Privacy & Security" icon="🔐" delay={0.15}>
          <SettingRow label="Analytics Sharing" description="Share usage data to improve the service">
            <Toggle checked={prefs.analyticsShare} onChange={() => toggle('analyticsShare')} />
          </SettingRow>
          <SettingRow label="Auto-Save" description="Automatically save drafts">
            <Toggle checked={prefs.autoSave} onChange={() => toggle('autoSave')} />
          </SettingRow>
          <div className="pt-4">
            <button
              className="text-sm font-semibold text-indigo-500 hover:text-indigo-400 transition-smooth"
              onClick={() => addToast('Data download requested', 'info')}
            >
              ↓ Download my data
            </button>
          </div>
        </Section>

        {/* API Keys */}
        <Section title="API Access" icon="🔑" delay={0.2}>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
            Generate API keys to integrate CodeReview AI into your CI/CD pipeline or custom tools.
          </p>
          <div className="p-3 rounded-xl font-mono text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 mb-4">
            cr_key_••••••••••••••••••••••••••
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              className="btn-primary text-sm py-2"
              onClick={() => addToast('API key generated!', 'success')}
            >
              Generate Key
            </button>
            <button
              className="btn-secondary text-sm py-2"
              onClick={() => addToast('Key copied to clipboard!', 'info')}
            >
              Copy Key
            </button>
          </div>
        </Section>
      </div>

      {/* Save */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="flex justify-end"
      >
        <motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          className="btn-primary"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Save Settings
        </motion.button>
      </motion.div>
    </div>
  )
}

export default Settings
