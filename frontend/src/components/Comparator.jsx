import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Trash2, Clipboard, Sparkles, CheckCircle, Clock, Zap, AlertCircle, Search, HelpCircle, History, Award, X, GitCompare, Cpu } from 'lucide-react'

function Comparator({ theme, userUsername = 'public' }) {
  const isLight = theme === 'light'
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [apiError, setApiError] = useState('')
  const [history, setHistory] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const textareaRef = useRef(null)

  const maxChars = 500

  // Presets with category-matched bullet & label colors
  const presets = [
    { 
      text: "The movie was not bad, in fact the acting was surprisingly good.", 
      label: "Negasi",
      dotClass: isLight ? "bg-orange-600" : "bg-orange-400",
      textClass: isLight ? "text-orange-600" : "text-orange-400"
    },
    { 
      text: "Great visuals and music, but the plot was utterly boring and terrible.", 
      label: "Campuran",
      dotClass: isLight ? "bg-sky-600" : "bg-sky-400",
      textClass: isLight ? "text-sky-600" : "text-sky-400"
    },
    { 
      text: "I expected a masterpiece, but it turned out to be a total waste of time.", 
      label: "Kekecewaan",
      dotClass: isLight ? "bg-rose-600" : "bg-rose-400",
      textClass: isLight ? "text-rose-600" : "text-rose-400"
    },
  ]

  // Load history from API for current isolated user account
  const fetchHistory = async () => {
    try {
      const activeUser = userUsername || 'public'
      const res = await fetch(`/api/history?username=${encodeURIComponent(activeUser)}&limit=10`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      })
      if (res.ok) {
        const data = await res.json()
        setHistory(data)
      }
    } catch (e) {
      console.error("Failed to fetch history:", e)
    }
  }

  // Delete single history log
  const handleDeleteItem = async (id) => {
    try {
      const res = await fetch(`/api/history/${id}`, {
        method: 'DELETE',
        headers: { 'ngrok-skip-browser-warning': 'true' }
      })
      if (res.ok) {
        setHistory(prev => prev.filter(item => item.id !== id))
      }
    } catch (e) {
      console.error("Failed to delete history item:", e)
    }
  }

  // Clear all prediction history for current isolated user account
  const handleConfirmClearAll = async (e) => {
    if (e && e.stopPropagation) e.stopPropagation()
    setShowConfirmModal(false)
    try {
      const activeUser = userUsername || 'public'
      const res = await fetch(`/api/history?username=${encodeURIComponent(activeUser)}`, {
        method: 'DELETE',
        headers: { 'ngrok-skip-browser-warning': 'true' }
      })
      if (res.ok) {
        setHistory([])
        await fetchHistory()
      }
    } catch (e) {
      console.error("Failed to clear history:", e)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [userUsername])

  // Handle Ctrl+Enter to submit
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  // Submit prediction request with account username isolation
  const handleSubmit = async () => {
    if (!text.trim() || loading) return
    setLoading(true)
    setResult(null)
    setApiError('')

    // Trigger haptic vibration if supported on mobile
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }

    try {
      const activeUser = userUsername || 'public'
      let res
      try {
        res = await fetch('https://irritably-tipper-january.ngrok-free.dev/api/predict?ngrok-skip-browser-warning=true', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, username: activeUser })
        })
        if (!res.ok) throw new Error("Primary GPU server unavailable")
      } catch (primaryErr) {
        console.warn("Primary GPU server offline, failing over to Railway CPU server...", primaryErr)
        res = await fetch('https://nurturing-creation-production-4414.up.railway.app/api/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, username: activeUser })
        })
      }

      if (res.ok) {
        const payload = await res.json()
        setResult(payload.data)
        fetchHistory() // Refresh logs
      } else {
        const errJson = await res.json().catch(() => ({}))
        setApiError(errJson.detail || "Gagal memproses analisis sentimen.")
      }
    } catch (e) {
      console.error("Connection error:", e)
      setApiError("Gagal terhubung ke server backend.")
    } finally {
      setLoading(false)
    }
  }

  const handlePresetClick = (presetText) => {
    setText(presetText)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText()
      if (clipboardText) {
        setText(clipboardText.substring(0, maxChars))
      }
    } catch (e) {
      console.error("Clipboard paste blocked:", e)
    }
  }

  const copyToClipboard = (txt, index) => {
    navigator.clipboard.writeText(txt)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const getLatencyColor = (ms, compareMs) => {
    if (!ms) return isLight ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-slate-800 text-slate-400 border-slate-700'
    const isFaster = !compareMs || ms <= compareMs
    if (isFaster) {
      return isLight 
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
        : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
    }
    return isLight 
      ? 'bg-sky-50 text-sky-700 border-sky-200' 
      : 'bg-sky-500/15 text-sky-300 border-sky-500/30'
  }

  // Filter history list
  const filteredHistory = history.filter(item => 
    item.input_text.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* SECTION 1: Interactive Input Panel */}
      <section className="glass-card p-6">
        <h2 className={`text-lg font-bold mb-4 flex items-center space-x-2 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
          <GitCompare className="text-umsu-gold" size={18} />
          <span>Komparator Inferensi Sentimen <em>Real-Time</em></span>
        </h2>

        {/* Text Area Card */}
        <div className="relative border border-blue-900/40 rounded-xl bg-slate-950/60 focus-within:border-umsu-gold/50 transition-all">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value.substring(0, maxChars))}
            onKeyDown={handleKeyDown}
            placeholder="Masukkan kalimat ulasan film berbahasa Inggris di sini untuk dianalisis..."
            className="w-full min-h-[120px] bg-transparent text-slate-100 p-4 pb-12 rounded-xl focus:outline-none resize-y text-sm font-sans"
          />

          {/* Bottom Action inside Textarea */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between border-t border-blue-950/40 pt-2 text-xs">
            <span className={`font-mono ${text.length >= maxChars ? 'text-umsu-rose' : 'text-slate-400'}`}>
              {text.length}/{maxChars}
            </span>

            <div className="flex items-center space-x-2">
              <button
                onClick={handlePaste}
                className="text-slate-400 hover:text-slate-200 px-2 py-1 rounded hover:bg-slate-900 transition-all"
                title="Tempel dari Papan Klip"
              >
                Tempel
              </button>
              {text && (
                <button
                  onClick={() => setText('')}
                  className="text-slate-400 hover:text-umsu-rose px-2 py-1 rounded hover:bg-slate-900 transition-all flex items-center space-x-1"
                  title="Hapus Teks Input"
                >
                  <Trash2 size={12} />
                  <span>Hapus</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Preset Chips & Action Buttons */}
        <div className="mt-5 space-y-4">
          {/* Preset Chips Header & List */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-2.5">
            <span className="text-xs text-slate-400 font-semibold flex-shrink-0 pt-1">
              Preset Contoh Kalimat:
            </span>
            <div className="flex flex-col gap-2 flex-grow w-full">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePresetClick(preset.text)}
                  className={`w-full text-[11px] border px-3.5 py-2 rounded-xl transition-all flex items-center space-x-2 text-left cursor-pointer group ${
                    isLight 
                      ? 'bg-slate-100/90 hover:bg-slate-200/80 text-slate-700 border-slate-300/80 hover:border-slate-400' 
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-blue-900/40 hover:border-umsu-gold/50'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform ${preset.dotClass}`} />
                  <span className={`font-bold flex-shrink-0 ${preset.textClass}`}>{preset.label}:</span>
                  <span className={`truncate flex-1 min-w-0 ${
                    isLight ? 'text-slate-700 group-hover:text-slate-900' : 'text-slate-300 group-hover:text-slate-100'
                  }`}>
                    {preset.text}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Trigger Button */}
          <div className="flex justify-end pt-1">
            <button
              onClick={handleSubmit}
              disabled={!text.trim() || loading}
              className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${
                !text.trim() || loading
                  ? 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                  : 'bg-umsu-gold hover:bg-yellow-400 text-[#040814] shadow-umsu-gold/20 hover:scale-[1.02]'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#040814] border-t-transparent rounded-full animate-spin" />
                  <span>Menganalisis...</span>
                </>
              ) : (
                <>
                  <Send size={14} />
                  <span>Uji Sentimen</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: Side-by-Side Inference Comparison */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Model A Loading Card */}
            <div className="glass-card p-6 border border-blue-900/20 animate-pulse space-y-4">
              <div className="flex justify-between items-center">
                <div className="h-6 w-28 bg-slate-800 rounded-lg" />
                <div className="h-5 w-24 bg-slate-800 rounded-full" />
              </div>
              <div className="h-10 w-2/3 bg-slate-800 rounded-lg mx-auto" />
              <div className="space-y-2">
                <div className="h-2 w-full bg-slate-800 rounded-full" />
                <div className="h-2 w-5/6 bg-slate-800 rounded-full" />
              </div>
              <div className="h-6 w-20 bg-slate-800 rounded-full" />
            </div>

            {/* Model B Loading Card */}
            <div className="glass-card p-6 border border-blue-900/20 animate-pulse space-y-4">
              <div className="flex justify-between items-center">
                <div className="h-6 w-28 bg-slate-800 rounded-lg" />
                <div className="h-5 w-24 bg-slate-800 rounded-full" />
              </div>
              <div className="h-10 w-2/3 bg-slate-800 rounded-lg mx-auto" />
              <div className="space-y-2">
                <div className="h-2 w-full bg-slate-800 rounded-full" />
                <div className="h-2 w-5/6 bg-slate-800 rounded-full" />
              </div>
              <div className="h-6 w-20 bg-slate-800 rounded-full" />
            </div>
          </motion.div>
        )}

        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-umsu-rose/10 border border-umsu-rose/30 text-umsu-rose text-xs flex items-center space-x-3"
          >
            <AlertCircle size={18} className="flex-shrink-0" />
            <span className="font-semibold">{apiError}</span>
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2 text-xs text-slate-400 font-semibold px-2">
              <AlertCircle size={14} className="text-umsu-gold" />
              <span>Garis emas menandai model dengan tingkat kepercayaan (<em>Confidence Score</em>) lebih tinggi.</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Model A Card */}
              {(() => {
                const isWinner = result.model_a.confidence > result.model_b.confidence
                const isPos = result.model_a.label === 'Positive'
                return (
                  <div className={`glass-card p-6 relative overflow-hidden flex flex-col justify-between ${
                    isWinner 
                      ? 'border-umsu-gold/60 shadow-lg shadow-umsu-gold/5 ring-1 ring-umsu-gold/30' 
                      : 'border-blue-900/20'
                  }`}>
                    {/* Gloss border neon award effect */}
                    {isWinner && (
                      <div className="absolute top-0 right-0 bg-umsu-gold text-[#040814] px-3 py-1 rounded-bl-xl text-[10px] font-black uppercase tracking-wider flex items-center space-x-1">
                        <Award size={10} />
                        <span>Confidence Winner</span>
                      </div>
                    )}

                    <div className="space-y-5">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-slate-400">MODEL A</span>
                        <span className="bg-umsu-royal/20 text-umsu-royal border border-umsu-royal/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          BERT Frozen
                        </span>
                      </div>

                      {/* Label Prediction */}
                      <div className="text-center py-4">
                        <p className="text-xs text-slate-400 font-medium">Prediksi Label Sentimen</p>
                        <h3 className={`text-3xl font-extrabold mt-1 tracking-wide ${
                          isPos ? 'text-umsu-emerald text-glow-emerald' : 'text-umsu-rose text-glow-rose'
                        }`}>
                          {result.model_a.label}
                        </h3>
                      </div>

                      {/* Confidence Score Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Confidence Score</span>
                          <span className="font-bold text-slate-200">{result.model_a.confidence}%</span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-blue-950">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${result.model_a.confidence}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className={`h-full rounded-full ${isPos ? 'bg-umsu-emerald' : 'bg-umsu-rose'}`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Latency Footer */}
                    <div className="border-t border-blue-950/40 pt-4 mt-6 flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-slate-400">
                        <Clock size={12} />
                        <span>Inference Latency</span>
                      </div>
                      <span className={`text-xs font-mono font-bold border px-2 py-0.5 rounded-full flex items-center space-x-1 ${getLatencyColor(result.model_a.latency_ms, result.model_b.latency_ms)}`}>
                        <Zap size={10} />
                        <span>{result.model_a.latency_ms} ms</span>
                      </span>
                    </div>
                  </div>
                )
              })()}

              {/* Model B Card */}
              {(() => {
                const isWinner = result.model_b.confidence > result.model_a.confidence
                const isPos = result.model_b.label === 'Positive'
                return (
                  <div className={`glass-card p-6 relative overflow-hidden flex flex-col justify-between ${
                    isWinner 
                      ? 'border-umsu-gold/60 shadow-lg shadow-umsu-gold/5 ring-1 ring-umsu-gold/30' 
                      : 'border-blue-900/20'
                  }`}>
                    {/* Gloss border neon award effect */}
                    {isWinner && (
                      <div className="absolute top-0 right-0 bg-umsu-gold text-[#040814] px-3 py-1 rounded-bl-xl text-[10px] font-black uppercase tracking-wider flex items-center space-x-1">
                        <Award size={10} />
                        <span>Confidence Winner</span>
                      </div>
                    )}

                    <div className="space-y-5">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-slate-400">MODEL B</span>
                        <span className="bg-umsu-gold/15 text-umsu-gold border border-umsu-gold/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          BERT Fine-Tuned
                        </span>
                      </div>

                      {/* Label Prediction */}
                      <div className="text-center py-4">
                        <p className="text-xs text-slate-400 font-medium">Prediksi Label Sentimen</p>
                        <h3 className={`text-3xl font-extrabold mt-1 tracking-wide ${
                          isPos ? 'text-umsu-emerald text-glow-emerald' : 'text-umsu-rose text-glow-rose'
                        }`}>
                          {result.model_b.label}
                        </h3>
                      </div>

                      {/* Confidence Score Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Confidence Score</span>
                          <span className="font-bold text-slate-200">{result.model_b.confidence}%</span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-blue-950">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${result.model_b.confidence}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className={`h-full rounded-full ${isPos ? 'bg-umsu-emerald' : 'bg-umsu-rose'}`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Latency Footer */}
                    <div className="border-t border-blue-950/40 pt-4 mt-6 flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-slate-400">
                        <Clock size={12} />
                        <span>Inference Latency</span>
                      </div>
                      <span className={`text-xs font-mono font-bold border px-2 py-0.5 rounded-full flex items-center space-x-1 ${getLatencyColor(result.model_b.latency_ms, result.model_a.latency_ms)}`}>
                        <Zap size={10} />
                        <span>{result.model_b.latency_ms} ms</span>
                      </span>
                    </div>
                  </div>
                )
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECTION 3: Logs & History Table */}
      <section className="glass-card p-6">
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <h2 className={`text-base font-bold flex items-center space-x-2 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              <History className="text-slate-400" size={16} />
              <span>Riwayat Inferensi Terkini</span>
            </h2>
          </div>

          {/* Search Box + Clear All Trash Button (Full Layout Width) */}
          <div className="flex items-center space-x-2.5 w-full">
            {/* Search Input (Flex 1 Full Width) */}
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="Cari kata kunci..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full text-xs pl-8 pr-4 py-2 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-umsu-gold/30 ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-umsu-gold'
                    : 'bg-slate-950 border-blue-900/40 text-slate-100 focus:border-umsu-gold'
                }`}
              />
              <Search className="absolute left-2.5 top-2.5 text-slate-400" size={13} />
            </div>

            {/* Clear All History Trash Button */}
            {history.length > 0 && (
              <button
                onClick={() => setShowConfirmModal(true)}
                className="flex items-center space-x-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 border border-rose-500/30 px-3 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 cursor-pointer"
                title="Hapus Seluruh Riwayat Inferensi"
              >
                <Trash2 size={14} />
                <span className="hidden sm:inline">Hapus Semua</span>
              </button>
            )}
          </div>
        </div>

        {/* History Table/Card Wrapper */}
        <div className="overflow-hidden border border-blue-950 rounded-xl bg-slate-950/40">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/80 text-slate-400 border-b border-blue-950 uppercase font-semibold tracking-wider font-mono">
                  <th className="p-3 w-[45%]">Input Text</th>
                  <th className="p-3 text-center">Model A (Frozen)</th>
                  <th className="p-3 text-center">Model B (Fine-Tuned)</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-950/40">
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3 text-slate-300 max-w-[280px] truncate" title={item.input_text}>
                        {item.input_text}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`inline-block font-semibold px-2 py-0.5 rounded text-[11px] ${
                          item.model_a_label === 'Positive' ? 'text-umsu-emerald' : 'text-umsu-rose'
                        }`}>
                          {item.model_a_label} ({item.model_a_confidence}%)
                        </span>
                        <div className="text-[10px] text-slate-500 mt-0.5">{item.model_a_latency_ms} ms</div>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`inline-block font-semibold px-2 py-0.5 rounded text-[11px] ${
                          item.model_b_label === 'Positive' ? 'text-umsu-emerald' : 'text-umsu-rose'
                        }`}>
                          {item.model_b_label} ({item.model_b_confidence}%)
                        </span>
                        <div className="text-[10px] text-slate-500 mt-0.5">{item.model_b_latency_ms} ms</div>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end space-x-1">
                          <button
                            onClick={() => copyToClipboard(item.input_text, idx)}
                            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-all"
                            title="Salin Teks Input"
                          >
                            {copiedIndex === idx ? (
                              <span className="text-[10px] font-bold text-umsu-emerald">Copied!</span>
                            ) : (
                              <Clipboard size={14} />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-slate-400 hover:text-umsu-rose p-1.5 rounded-lg hover:bg-umsu-rose/10 transition-all"
                            title="Hapus Item Riwayat Ini"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-6 text-center text-slate-500 italic">
                      Tidak ada riwayat inferensi yang cocok dengan pencarian Anda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden divide-y divide-blue-950/40">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((item, idx) => (
                <div key={item.id} className="p-4 space-y-3 hover:bg-slate-900/20 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs text-slate-300 font-medium line-clamp-2">{item.input_text}</p>
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <button
                        onClick={() => copyToClipboard(item.input_text, idx)}
                        className="text-slate-500 hover:text-slate-300 p-1"
                        title="Salin Teks"
                      >
                        {copiedIndex === idx ? (
                          <span className="text-[10px] font-bold text-umsu-emerald">Copied!</span>
                        ) : (
                          <Clipboard size={14} />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-slate-500 hover:text-umsu-rose p-1"
                        title="Hapus Item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-blue-950/40 text-[11px]">
                    <div>
                      <span className="text-slate-500 block uppercase font-mono text-[9px]">Model A (Frozen)</span>
                      <span className={`font-semibold ${item.model_a_label === 'Positive' ? 'text-umsu-emerald' : 'text-umsu-rose'}`}>
                        {item.model_a_label} ({item.model_a_confidence}%)
                      </span>
                      <span className="text-slate-500 block text-[9px] mt-0.5">{item.model_a_latency_ms} ms</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block uppercase font-mono text-[9px]">Model B (FT)</span>
                      <span className={`font-semibold ${item.model_b_label === 'Positive' ? 'text-umsu-emerald' : 'text-umsu-rose'}`}>
                        {item.model_b_label} ({item.model_b_confidence}%)
                      </span>
                      <span className="text-slate-500 block text-[9px] mt-0.5">{item.model_b_latency_ms} ms</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-500 italic text-xs">
                Tidak ada riwayat inferensi yang cocok dengan pencarian Anda.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Custom Web App Glassmorphism Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <div 
            onClick={() => setShowConfirmModal(false)}
            className="fixed inset-0 z-50 bg-[#040814]/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className={`p-6 max-w-md w-full rounded-2xl shadow-2xl border relative space-y-4 ${
                isLight ? 'bg-white border-rose-200 text-slate-900' : 'bg-[#0f172a] border-umsu-rose/30 text-slate-100'
              }`}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowConfirmModal(false)}
                className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors ${
                  isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
                title="Tutup"
              >
                <X size={16} />
              </button>

              <div className="flex items-start space-x-3.5 pr-6">
                <div className={`p-3 rounded-2xl flex-shrink-0 ${
                  isLight ? 'bg-rose-50 border border-rose-200 text-rose-600' : 'bg-umsu-rose/10 border border-umsu-rose/20 text-umsu-rose'
                }`}>
                  <Trash2 size={24} />
                </div>
                <div>
                  <h3 className={`text-base font-bold leading-snug ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                    Hapus Seluruh Riwayat Inferensi?
                  </h3>
                  <p className={`text-xs mt-1.5 leading-relaxed ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                    Tindakan ini akan menghapus semua riwayat pengujian sentimen yang tersimpan di database. Data yang sudah dihapus tidak dapat dikembalikan.
                  </p>
                </div>
              </div>

              <div className={`flex items-center justify-end space-x-3 pt-4 border-t ${
                isLight ? 'border-rose-100' : 'border-slate-800'
              }`}>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0f172a] hover:bg-[#1e293b] border border-slate-700 transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmClearAll}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-umsu-rose hover:bg-rose-600 shadow-md shadow-umsu-rose/20 transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span>Hapus Semua</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Comparator
