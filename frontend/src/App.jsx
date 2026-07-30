import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cpu, Zap, BarChart2, GitCompare, History, Info, Wifi, WifiOff, Download, Award, Sun, Moon, Lock, Unlock, User, LogOut, KeyRound, ShieldCheck, AlertCircle, X, Eye, EyeOff, Home as HomeIcon } from 'lucide-react'
import Comparator from './components/Comparator'
import Analytics from './components/Analytics'
import Home from './components/Home'
import { GPU_BACKEND_URL, CPU_BACKEND_URL } from './config'

function App() {
  // Helper to determine initial active tab from URL path, hash, or localStorage
  const getInitialTab = () => {
    const path = window.location.pathname.replace(/^\/+/, '').toLowerCase()
    if (['home', 'comparator', 'analytics'].includes(path)) {
      return path
    }
    const hash = window.location.hash.replace('#', '').toLowerCase()
    if (['home', 'comparator', 'analytics'].includes(hash)) {
      return hash
    }
    const saved = localStorage.getItem('active_tab')
    if (['home', 'comparator', 'analytics'].includes(saved)) {
      return saved
    }
    return 'home'
  }

  const [activeTab, setActiveTab] = useState(getInitialTab) // 'home', 'comparator', 'analytics'
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [serverDeviceStatus, setServerDeviceStatus] = useState('GPU') // 'GPU' | 'CPU' | 'Offline'
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallBtn, setShowInstallBtn] = useState(false)
  const [theme, setTheme] = useState('dark')

  // RBAC State Management (Public vs Peneliti / Dosen)
  const [userRole, setUserRole] = useState(() => localStorage.getItem('user_role') || 'public')
  const [userName, setUserName] = useState(() => localStorage.getItem('user_name') || 'Mahasiswa / Public')
  const [userUsername, setUserUsername] = useState(() => localStorage.getItem('user_username') || 'public')
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  const isDosenOrPeneliti = userRole === 'dosen' || userRole === 'peneliti'

  // Sync activeTab state to URL pathname (History API) and localStorage whenever it changes
  useEffect(() => {
    if (activeTab === 'analytics' && !isDosenOrPeneliti) {
      setActiveTab('home')
      localStorage.setItem('active_tab', 'home')
      window.history.replaceState(null, '', '/')
      return
    }
    localStorage.setItem('active_tab', activeTab)

    // Clean URL paths without hashes (#)
    const targetPath = activeTab === 'home' ? '/' : `/${activeTab}`
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath)
    } else if (window.location.hash) {
      window.history.replaceState(null, '', targetPath)
    }
  }, [activeTab, isDosenOrPeneliti])

  // Listen to browser Back/Forward navigation (popstate) & hashchange fallback
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname.replace(/^\/+/, '').toLowerCase()
      const hash = window.location.hash.replace('#', '').toLowerCase()
      const currentTab = ['comparator', 'analytics'].includes(path) 
        ? path 
        : ['comparator', 'analytics'].includes(hash) 
          ? hash 
          : 'home'

      if (currentTab === 'analytics' && !isDosenOrPeneliti) {
        setShowLoginModal(true)
        return
      }
      setActiveTab(currentTab)
    }

    window.addEventListener('popstate', handleUrlChange)
    window.addEventListener('hashchange', handleUrlChange)
    return () => {
      window.removeEventListener('popstate', handleUrlChange)
      window.removeEventListener('hashchange', handleUrlChange)
    }
  }, [isDosenOrPeneliti])

  // Initialize and apply theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark'
    setTheme(savedTheme)
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light')
    } else {
      document.documentElement.classList.remove('light')
    }
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    localStorage.setItem('theme', nextTheme)
    if (nextTheme === 'light') {
      document.documentElement.classList.add('light')
    } else {
      document.documentElement.classList.remove('light')
    }
  }

  // Handle Tab Change with Role Access Guard
  const handleTabChange = (tabId) => {
    if (tabId === 'analytics' && !isDosenOrPeneliti) {
      setLoginError('')
      setShowLoginModal(true)
      return
    }
    setActiveTab(tabId)
  }

  // Handle Login Authentication with GPU -> CPU failover
  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setLoginError('')
    setLoginLoading(true)

    const gpuLoginUrl = `${GPU_BACKEND_URL}/api/login?ngrok-skip-browser-warning=true`
    const cpuLoginUrl = `${CPU_BACKEND_URL}/api/login`

    let res
    let isSuccess = false

    // 1. Try GPU Backend
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 6000)

      res = await fetch(gpuLoginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      if (res.ok) isSuccess = true
    } catch (gpuErr) {
      console.warn("GPU server unreachable for login, trying Railway CPU...", gpuErr)
    }

    // 2. Fallback to CPU Backend if GPU failed
    if (!isSuccess) {
      try {
        res = await fetch(cpuLoginUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: loginUsername, password: loginPassword })
        })
      } catch (cpuErr) {
        console.error("Both backends failed for login:", cpuErr)
      }
    }

    try {
      if (res && res.ok) {
        const data = await res.json()
        if (data.status === 'success') {
          localStorage.setItem('user_role', data.role)
          localStorage.setItem('user_name', data.user_name)
          localStorage.setItem('user_username', data.user_username)
          setUserRole(data.role)
          setUserName(data.user_name)
          setUserUsername(data.user_username)
          setShowLoginModal(false)
          setLoginUsername('')
          setLoginPassword('')
          setActiveTab('analytics')
          return
        }
      }

      if (res) {
        const data = await res.json().catch(() => ({}))
        setLoginError(data.detail || 'Username atau password salah.')
      } else {
        setLoginError('Gagal terhubung ke server backend.')
      }
    } catch (err) {
      setLoginError('Gagal terhubung ke server backend.')
    } finally {
      setLoginLoading(false)
    }
  }

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('user_role')
    localStorage.removeItem('user_name')
    localStorage.removeItem('user_username')
    setUserRole('public')
    setUserName('Mahasiswa / Public')
    setUserUsername('public')
    setActiveTab('comparator')
  }

  // Listen to network status and backend GPU/CPU availability
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => {
      setIsOnline(false)
      setServerDeviceStatus('Offline')
    }
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    const checkHealth = async () => {
      // Define GPU and CPU health check endpoint URLs in variables
      const gpuHealthUrl = `${GPU_BACKEND_URL}/api/health?ngrok-skip-browser-warning=true`
      const cpuHealthUrl = `${CPU_BACKEND_URL}/api/health`

      // 1. Try Primary GPU Backend (Google Colab Tesla T4)
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 4000)
        const resGpu = await fetch(gpuHealthUrl, {
          headers: { 'ngrok-skip-browser-warning': 'true' },
          signal: controller.signal
        })
        clearTimeout(timeoutId)
        if (resGpu.ok) {
          setIsOnline(true)
          setServerDeviceStatus('GPU')
          return
        }
      } catch (e) {
        // GPU server offline
      }

      // 2. Try Secondary CPU Backend (Railway CPU)
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 4000)
        const resCpu = await fetch(cpuHealthUrl, {
          signal: controller.signal
        })
        clearTimeout(timeoutId)
        if (resCpu.ok) {
          setIsOnline(true)
          setServerDeviceStatus('CPU')
          return
        }
      } catch (e) {
        // CPU server offline
      }

      // 3. Both backends offline
      setIsOnline(false)
      setServerDeviceStatus('Offline')
    }

    checkHealth()
    const interval = setInterval(checkHealth, 12000)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(interval)
    }
  }, [])

  const [showInstallModal, setShowInstallModal] = useState(false)

  // Listen to PWA install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallBtn(true)
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = () => {
    setShowInstallModal(true)
  }

  const handleConfirmInstall = async () => {
    setShowInstallModal(false)
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
    setShowInstallBtn(false)
  }

  // Navigation items with role lock indicators
  const navItems = [
    { id: 'home', label: 'Beranda', icon: HomeIcon, isProtected: false },
    { id: 'comparator', label: 'Comparator', icon: GitCompare, isProtected: false },
    { id: 'analytics', label: 'Analytics', icon: BarChart2, isProtected: true },
  ]

  return (
    <div className="min-h-screen bg-umsu-canvas flex flex-col pb-20 sm:pb-0 transition-colors duration-300">
      {/* Decorative sunburst rays overlay */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-umsu-gold/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-umsu-royal/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-lg px-4 py-3 sm:py-4 transition-all duration-300 ${
        theme === 'light'
          ? 'bg-white/90 border-b border-slate-200/90 shadow-sm'
          : 'bg-[#040814]/80 border-b border-blue-900/30'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Identity */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center flex-shrink-0">
              <img src="/icons/icon-192x192.svg?v=6.0" alt="Logo UMSU NLP" className="w-full h-full object-contain drop-shadow-xl" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <h1 className={`font-bold text-sm sm:text-base md:text-lg leading-none whitespace-nowrap ${
                  theme === 'light' ? 'text-slate-900' : 'text-slate-100'
                }`}>
                  BERT Sentiment Lab
                </h1>
                <span className="hidden sm:inline-block bg-umsu-royal/15 text-umsu-royal text-[10px] font-bold px-2 py-0.5 rounded-full border border-umsu-royal/30 whitespace-nowrap">
                  FIKTI UMSU
                </span>
              </div>
              <p className={`text-[11px] mt-1 hidden xl:block whitespace-nowrap ${
                theme === 'light' ? 'text-slate-500' : 'text-slate-400'
              }`}>
                Penerapan Fine-Tuning Model BERT - Syafiq Hasan (NPM: 2209010182)
              </p>
            </div>
          </div>

          {/* Desktop Nav & User Role Controls */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5 flex-shrink-0">
            {/* Desktop Navigation */}
            <nav className={`hidden md:flex space-x-1 p-1 rounded-xl border transition-colors ${
              theme === 'light'
                ? 'bg-slate-100/90 border-slate-200'
                : 'bg-slate-900/60 border-umsu-border'
            }`}>
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                const isLocked = item.isProtected && !isDosenOrPeneliti

                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-lg text-xs font-semibold transition-all relative whitespace-nowrap ${
                      isActive
                        ? 'bg-umsu-gold text-[#040814] shadow-md shadow-umsu-gold/10 font-bold'
                        : theme === 'light'
                          ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    <Icon size={14} className="flex-shrink-0" />
                    <span>{item.label}</span>
                    {isLocked && (
                      <Lock size={12} className={theme === 'light' ? 'text-slate-500 ml-0.5 flex-shrink-0' : 'text-slate-400 ml-0.5 flex-shrink-0'} />
                    )}
                  </button>
                )
              })}
            </nav>

            {/* Role Authentication Badge & Button */}
            {isDosenOrPeneliti ? (
              <div className="flex items-center space-x-2 flex-shrink-0">
                <div className="hidden xl:flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-umsu-gold/10 border border-umsu-gold/30 text-umsu-gold text-xs font-bold whitespace-nowrap">
                  <ShieldCheck size={14} className="flex-shrink-0" />
                  <span>{userName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 border border-rose-500/30 text-xs font-semibold transition-all whitespace-nowrap cursor-pointer"
                  title="Keluar Sesi Peneliti"
                >
                  <LogOut size={13} className="flex-shrink-0" />
                  <span className="hidden lg:inline">Keluar</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setLoginError('')
                  setShowLoginModal(true)
                }}
                className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-umsu-royal/10 hover:bg-umsu-royal/20 text-umsu-royal border border-umsu-royal/30 text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 cursor-pointer"
              >
                <Lock size={13} className="flex-shrink-0" />
                <span className="hidden lg:inline">Login Dosen / Peneliti</span>
                <span className="lg:hidden">Login</span>
              </button>
            )}

            {/* Server Device / Network Status Badge */}
            <div
              title={
                serverDeviceStatus === 'GPU'
                  ? 'Server Backend Terhubung pada NVIDIA Tesla T4 GPU (~7.5 ms)'
                  : serverDeviceStatus === 'CPU'
                  ? 'Server Backend Terhubung pada Railway CPU (~2.8 s)'
                  : 'Server Backend Tidak Terhubung / Offline'
              }
              className={`flex items-center space-x-1.5 px-2.5 lg:px-3 py-1.5 rounded-full border text-[11px] font-bold transition-all whitespace-nowrap flex-shrink-0 ${
                serverDeviceStatus === 'GPU'
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                  : serverDeviceStatus === 'CPU'
                  ? 'bg-sky-500/15 text-sky-400 border-sky-500/40 shadow-sm shadow-sky-500/10'
                  : 'bg-rose-500/15 text-rose-400 border-rose-500/40 animate-pulse'
              }`}
            >
              {serverDeviceStatus === 'GPU' ? (
                <Zap size={12} className="flex-shrink-0 text-emerald-400" />
              ) : serverDeviceStatus === 'CPU' ? (
                <Cpu size={12} className="flex-shrink-0 text-sky-400" />
              ) : (
                <WifiOff size={12} className="flex-shrink-0 text-rose-400" />
              )}
              <span className="font-mono tracking-wide">{serverDeviceStatus}</span>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full border transition-all flex-shrink-0 cursor-pointer ${
                theme === 'light'
                  ? 'border-slate-300 bg-slate-100 text-slate-700 hover:text-amber-600 hover:border-amber-400'
                  : 'border-blue-900/30 bg-slate-900/60 text-slate-300 hover:text-umsu-gold hover:border-umsu-gold/50'
              }`}
              title={theme === 'dark' ? 'Aktifkan Mode Terang' : 'Aktifkan Mode Gelap'}
            >
              {theme === 'dark' ? <Sun size={12} /> : <Moon size={12} />}
            </button>

            {/* Install PWA Button */}
            {showInstallBtn && (
              <button
                onClick={handleInstallClick}
                className="flex items-center space-x-1 bg-umsu-gold hover:bg-yellow-400 text-[#040814] px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-umsu-gold/20 transition-all hover:scale-105 whitespace-nowrap flex-shrink-0 cursor-pointer"
                title="Pasang PWA App"
              >
                <Download size={12} className="flex-shrink-0" />
                <span className="hidden sm:inline">Install</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-6 z-10">
        {serverDeviceStatus === 'Offline' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-umsu-gold/10 border border-umsu-gold/30 text-umsu-gold px-4 py-3 rounded-xl flex items-center space-x-3 text-xs"
          >
            <Info size={16} className="flex-shrink-0" />
            <span>
              <strong>Mode Offline Aktif:</strong> Anda sedang melihat data benchmark lokal yang tersimpan di cache Service Worker Anda.
            </span>
          </motion.div>
        )}

        {/* Tab Content Rendering */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {activeTab === 'home' ? (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                <Home theme={theme} onNavigate={(tabId) => handleTabChange(tabId)} />
              </motion.div>
            ) : activeTab === 'comparator' ? (
              <motion.div
                key="comparator"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                <Comparator theme={theme} userUsername={userUsername} />
              </motion.div>
            ) : isDosenOrPeneliti ? (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                <Analytics theme={theme} />
              </motion.div>
            ) : (
              <motion.div
                key="protected-lock"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card p-8 max-w-lg mx-auto text-center space-y-4 my-12 border border-umsu-royal/30"
              >
                <div className="w-14 h-14 rounded-2xl bg-umsu-royal/10 border border-umsu-royal/30 text-umsu-royal mx-auto flex items-center justify-center">
                  <Lock size={28} />
                </div>
                <h2 className="text-lg font-bold text-slate-100">Akses Terbatas: Benchmark Analytics</h2>
                <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
                  Halaman Analisis Benchmark Multi-Seed & Uji Statistik Inferensial (McNemar, Wilcoxon, Bootstrap, Cohen's d) dilindungi dan khusus diperuntukkan bagi <strong>Peneliti & Dosen UMSU</strong>.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setLoginError('')
                      setShowLoginModal(true)
                    }}
                    className="px-6 py-3 rounded-xl bg-umsu-gold hover:bg-yellow-400 text-[#040814] font-bold text-xs shadow-lg shadow-umsu-gold/20 transition-all flex items-center justify-center space-x-2 mx-auto"
                  >
                    <KeyRound size={14} />
                    <span>Login Dosen / Peneliti</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar (Equal 33.3% Grid Distribution) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-umsu-canvas/95 backdrop-blur-lg border-t border-umsu-border px-2 py-2 grid grid-cols-3 justify-items-center items-center z-40 transition-colors duration-300">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          const isLocked = item.isProtected && !isDosenOrPeneliti

          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className="flex flex-col items-center justify-center space-y-1 py-1 w-full text-center relative cursor-pointer"
            >
              <div className={`p-1.5 rounded-xl transition-all ${
                isActive 
                  ? 'bg-umsu-gold/10 text-umsu-gold scale-110' 
                  : 'text-slate-400'
              }`}>
                <Icon size={19} />
              </div>
              <span className={`text-[10px] font-medium transition-all flex items-center justify-center space-x-1 whitespace-nowrap ${
                isActive ? 'text-umsu-gold font-bold' : 'text-slate-400'
              }`}>
                <span>{item.label}</span>
                {isLocked && <Lock size={10} className="text-slate-500 flex-shrink-0" />}
              </span>
            </button>
          )
        })}
      </nav>

      {/* Glassmorphism Login Modal Peneliti & Dosen */}
      <AnimatePresence>
        {showLoginModal && (
          <div 
            onClick={() => setShowLoginModal(false)}
            className="fixed inset-0 z-50 bg-[#040814]/80 backdrop-blur-lg flex items-center justify-center p-4"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className={`p-7 sm:p-10 md:p-12 max-w-[500px] w-full rounded-3xl shadow-2xl border relative space-y-6 overflow-hidden ${
                theme === 'light' 
                  ? 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-300/50' 
                  : 'bg-[#0a1128]/95 border-blue-900/40 text-slate-100 shadow-black/80'
              }`}
            >
              {/* Subtle Ambient Radial Glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-umsu-gold/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-umsu-royal/10 rounded-full blur-3xl pointer-events-none" />

              {/* Close Modal Button */}
              <button
                onClick={() => setShowLoginModal(false)}
                className={`absolute top-5 right-5 p-2 rounded-xl transition-all ${
                  theme === 'light' 
                    ? 'text-slate-400 hover:text-slate-800 hover:bg-slate-100' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
                title="Tutup Modal"
              >
                <X size={18} />
              </button>

              {/* Modal Brand Header (Centered Logo & Text Alignment) */}
              <div className="flex flex-col items-center text-center space-y-2.5">
                <div className="w-14 h-14 flex items-center justify-center flex-shrink-0 mx-auto">
                  <img src="/icons/icon-192x192.svg?v=6.0" alt="Logo UMSU NLP" className="w-full h-full object-contain drop-shadow" />
                </div>
                <div className="space-y-1">
                  <div className="inline-flex items-center justify-center space-x-1.5 px-3 py-0.5 rounded-full bg-umsu-royal/10 border border-umsu-royal/20 text-umsu-royal text-[10px] font-bold tracking-wider uppercase">
                    <span>BERT Sentiment Lab</span>
                  </div>
                  <h3 className={`text-lg font-bold leading-tight ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                    Autentikasi Dosen & Peneliti
                  </h3>
                  <p className="text-xs text-slate-400 leading-normal max-w-sm mx-auto">
                    Akses khusus analisis statistik & benchmark eksperimen BERT.
                  </p>
                </div>
              </div>

              {/* Error Message Alert */}
              {loginError && (
                <div className="bg-umsu-rose/10 border border-umsu-rose/30 text-umsu-rose p-3.5 rounded-2xl text-xs flex items-start space-x-2.5">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-umsu-rose" />
                  <span className="leading-snug">{loginError}</span>
                </div>
              )}

              {/* Professional Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                    Username Peneliti
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Masukkan username (e.g. dosen)"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border text-xs transition-all focus:outline-none focus:ring-2 focus:ring-umsu-gold/30 ${
                        theme === 'light'
                          ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-umsu-gold'
                          : 'bg-[#040814] border-blue-900/40 text-slate-100 focus:border-umsu-gold'
                      }`}
                    />
                    <User className="absolute left-3.5 top-3.5 text-slate-400" size={15} />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Masukkan password (e.g. umsu2026)"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className={`w-full pl-10 pr-10 py-3 rounded-xl border text-xs transition-all focus:outline-none focus:ring-2 focus:ring-umsu-gold/30 ${
                        theme === 'light'
                          ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-umsu-gold'
                          : 'bg-[#040814] border-blue-900/40 text-slate-100 focus:border-umsu-gold'
                      }`}
                    />
                    <KeyRound className="absolute left-3.5 top-3.5 text-slate-400" size={15} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200 transition-colors"
                      title={showPassword ? 'Sembunyikan Password' : 'Tampilkan Password'}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowLoginModal(false)}
                    className="px-5 py-3 rounded-xl text-xs font-bold text-white bg-[#0f172a] hover:bg-[#1e293b] border border-slate-700 transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="px-6 py-3 rounded-xl text-xs font-black text-[#040814] bg-gradient-to-r from-umsu-gold via-yellow-400 to-amber-500 hover:from-yellow-400 hover:to-yellow-500 shadow-xl shadow-umsu-gold/20 transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50 hover:scale-[1.01]"
                  >
                    {loginLoading ? (
                      <span>Memverifikasi Sesi...</span>
                    ) : (
                      <>
                        <ShieldCheck size={16} />
                        <span>Masuk Halaman Benchmark</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Glassmorphism PWA Installation Modal */}
      <AnimatePresence>
        {showInstallModal && (
          <div 
            onClick={() => setShowInstallModal(false)}
            className="fixed inset-0 z-50 bg-[#040814]/80 backdrop-blur-lg flex items-center justify-center p-4"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className={`p-6 sm:p-8 max-w-md w-full rounded-3xl shadow-2xl border relative space-y-6 overflow-hidden text-center ${
                theme === 'light' 
                  ? 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-300/50' 
                  : 'bg-[#0a1128]/95 border-blue-900/40 text-slate-100 shadow-black/80'
              }`}
            >
              {/* Subtle Ambient Radial Glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-umsu-gold/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-umsu-royal/10 rounded-full blur-3xl pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setShowInstallModal(false)}
                className={`absolute top-5 right-5 p-2 rounded-xl transition-all ${
                  theme === 'light' 
                    ? 'text-slate-400 hover:text-slate-800 hover:bg-slate-100' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
                title="Tutup Modal"
              >
                <X size={18} />
              </button>

              {/* App Icon Graphic */}
              <div className="pt-2">
                <div className="w-20 h-20 mx-auto rounded-3xl p-3 bg-gradient-to-br from-umsu-gold/20 via-yellow-500/10 to-transparent border border-umsu-gold/30 shadow-xl shadow-umsu-gold/10 flex items-center justify-center">
                  <img src="/icons/icon-192x192.svg?v=6.0" alt="Logo UMSU NLP" className="w-full h-full object-contain drop-shadow-md" />
                </div>
              </div>

              {/* Header Title & Subtitle */}
              <div className="space-y-1.5">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-umsu-gold/10 border border-umsu-gold/30 text-umsu-gold text-[10px] font-extrabold uppercase tracking-wider">
                  <Download size={12} />
                  <span>Progressive Web App</span>
                </div>
                <h3 className={`text-xl font-extrabold ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                  Pasang BERT Sentiment Lab
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Jadikan web app ini sebagai aplikasi native di perangkat Anda dengan fitur penuh dan performa lebih cepat.
                </p>
              </div>

              {/* App Benefits List */}
              <div className={`p-4 rounded-2xl border text-left space-y-2.5 text-xs ${
                theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#040814]/70 border-blue-900/30'
              }`}>
                <div className="flex items-center space-x-2.5 text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-umsu-emerald/20 border border-umsu-emerald/40 text-umsu-emerald flex items-center justify-center flex-shrink-0">
                    ✓
                  </div>
                  <span className={theme === 'light' ? 'text-slate-700' : 'text-slate-200'}>
                    Akses instan dari <strong>Home Screen / Desktop</strong>
                  </span>
                </div>
                <div className="flex items-center space-x-2.5 text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-umsu-emerald/20 border border-umsu-emerald/40 text-umsu-emerald flex items-center justify-center flex-shrink-0">
                    ✓
                  </div>
                  <span className={theme === 'light' ? 'text-slate-700' : 'text-slate-200'}>
                    Mode Fullscreen <strong>tanpa URL Bar browser</strong>
                  </span>
                </div>
                <div className="flex items-center space-x-2.5 text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-umsu-emerald/20 border border-umsu-emerald/40 text-umsu-emerald flex items-center justify-center flex-shrink-0">
                    ✓
                  </div>
                  <span className={theme === 'light' ? 'text-slate-700' : 'text-slate-200'}>
                    Dukungan cache <strong>Mode Offline</strong>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowInstallModal(false)}
                  className="px-5 py-3 rounded-xl text-xs font-bold text-white bg-[#0f172a] hover:bg-[#1e293b] border border-slate-700 transition-all cursor-pointer"
                >
                  Nanti Saja
                </button>
                <button
                  type="button"
                  onClick={handleConfirmInstall}
                  className="px-6 py-3 rounded-xl text-xs font-black text-[#040814] bg-gradient-to-r from-umsu-gold via-yellow-400 to-amber-500 hover:from-yellow-400 hover:to-yellow-500 shadow-xl shadow-umsu-gold/20 transition-all flex items-center space-x-2 cursor-pointer hover:scale-[1.01]"
                >
                  <Download size={16} />
                  <span>Pasang Aplikasi</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
