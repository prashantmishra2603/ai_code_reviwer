import React, { Suspense, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import { Sidebar, MobileSidebar } from './components/Sidebar'
import Loader from './components/Loader'
import './styles/globals.css'

// Lazy pages
const Landing      = React.lazy(() => import('./pages/Landing'))
const Login        = React.lazy(() => import('./pages/Login'))
const Register     = React.lazy(() => import('./pages/Register'))
const Dashboard    = React.lazy(() => import('./pages/Dashboard'))
const UploadCode   = React.lazy(() => import('./pages/UploadCode'))
const ReviewResult = React.lazy(() => import('./pages/ReviewResult'))
const History      = React.lazy(() => import('./pages/History'))
const Settings     = React.lazy(() => import('./pages/Settings'))
const Profile      = React.lazy(() => import('./pages/Profile'))

// Page transition wrapper
const PageWrapper = ({ children }) => {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// App shell with sidebar
const AppShell = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white overflow-hidden">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile sidebar drawer */}
      <MobileSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main content column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <Suspense fallback={<Loader fullScreen={false} text="Loading page..." />}>
            <PageWrapper>
              <Routes>
                <Route path="/dashboard"   element={<Dashboard />} />
                <Route path="/upload"      element={<UploadCode />} />
                <Route path="/review/:id"  element={<ReviewResult />} />
                <Route path="/history"     element={<History />} />
                <Route path="/settings"    element={<Settings />} />
                <Route path="/profile"     element={<Profile />} />
                <Route path="*"            element={<Dashboard />} />
              </Routes>
            </PageWrapper>
          </Suspense>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Suspense fallback={<Loader fullScreen text="Starting up..." />}>
            <Routes>
              <Route path="/"         element={<Landing />} />
              <Route path="/login"    element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/*"        element={<AppShell />} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
