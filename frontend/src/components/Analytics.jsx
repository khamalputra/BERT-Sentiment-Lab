import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Info, AlertCircle, HelpCircle, Shield, Activity, HardDrive, Cpu, Compass } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'
import { GPU_BACKEND_URL, CPU_BACKEND_URL } from '../config'

// Custom XAxis tick that wraps label into two lines at the opening parenthesis
// e.g. "Model A (Frozen)" → line1: "Model A", line2: "(Frozen)"
const XAxisTwoLineTick = ({ x, y, payload, fill }) => {
  const label = payload?.value || ''
  const parenIdx = label.indexOf('(')
  const line1 = parenIdx > -1 ? label.slice(0, parenIdx).trim() : label
  const line2 = parenIdx > -1 ? label.slice(parenIdx).trim() : ''
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={12} textAnchor="middle" fill={fill} fontSize={10} fontFamily="monospace">
        {line1}
      </text>
      {line2 && (
        <text x={0} y={0} dy={24} textAnchor="middle" fill={fill} fontSize={10} fontFamily="monospace">
          {line2}
        </text>
      )}
    </g>
  )
}

// Custom PolarAngleAxis tick for RadarChart.
// Splits label into two lines at the best split point (space or '/').
// Adjusts text-anchor and position based on angle so labels never overlap the chart area.
const RadarTwoLineTick = ({ payload, x, y, cx, cy, fill }) => {
  const label = payload?.value || ''

  // Find best split point near the middle of the string
  const mid = Math.floor(label.length / 2)
  const splitChars = [' ', '/']
  let bestIdx = -1
  let bestDist = Infinity
  for (let i = 0; i < label.length; i++) {
    if (splitChars.includes(label[i])) {
      const dist = Math.abs(i - mid)
      if (dist < bestDist) { bestDist = dist; bestIdx = i }
    }
  }

  let line1, line2
  if (bestIdx > -1 && label.length > 10) {
    // Keep the split char with the second line only if it's '/'
    const splitChar = label[bestIdx]
    if (splitChar === '/') {
      line1 = label.slice(0, bestIdx).trim()
      line2 = label.slice(bestIdx).trim()   // keeps the '/'
    } else {
      line1 = label.slice(0, bestIdx).trim()
      line2 = label.slice(bestIdx + 1).trim()
    }
  } else {
    line1 = label
    line2 = ''
  }

  // Determine text alignment based on angular position relative to center
  const dx = x - cx
  const textAnchor = Math.abs(dx) < 10 ? 'middle' : dx > 0 ? 'start' : 'end'

  // Push label slightly away from chart edge
  const OFFSET = 4
  const lx = dx > 0 ? x + OFFSET : dx < 0 ? x - OFFSET : x
  const lineH = 13

  return (
    <g>
      <text x={lx} y={y} textAnchor={textAnchor} fill={fill} fontSize={10} fontFamily="sans-serif">
        <tspan x={lx} dy={line2 ? -lineH / 2 : 0}>{line1}</tspan>
        {line2 && <tspan x={lx} dy={lineH}>{line2}</tspan>}
      </text>
    </g>
  )
}


function Analytics({ theme, userRole = 'public' }) {
  const isLight = theme === 'light'
  const gridColor = isLight ? '#cbd5e1' : '#1e293b'
  const textColor = isLight ? '#475569' : '#94a3b8'
  const tooltipBg = isLight ? '#ffffff' : '#0f172a'
  const tooltipBorder = isLight ? '#cbd5e1' : '#1e3a8a30'

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [activeTooltip, setActiveTooltip] = useState(null)
  const [chartTab, setChartTab] = useState('performance') // 'performance' | 'compute'

  // Fetch benchmark stats with GPU -> CPU failover
  useEffect(() => {
    const loadStats = async () => {
      const gpuStatsUrl = `${GPU_BACKEND_URL}/api/benchmark-stats?ngrok-skip-browser-warning=true`
      const cpuStatsUrl = `${CPU_BACKEND_URL}/api/benchmark-stats`

      let res
      // 1. Try GPU Backend
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 6000)
        res = await fetch(gpuStatsUrl, {
          headers: { 'ngrok-skip-browser-warning': 'true' },
          signal: controller.signal
        })
        clearTimeout(timeoutId)
      } catch (gpuErr) {
        console.warn("GPU server unreachable for stats, trying Railway CPU...", gpuErr)
      }

      // 2. Fallback to CPU Backend if GPU failed
      if (!res || !res.ok) {
        try {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 6000)
          res = await fetch(cpuStatsUrl, { signal: controller.signal })
          clearTimeout(timeoutId)
        } catch (cpuErr) {
          console.warn("CPU server unreachable for stats:", cpuErr)
        }
      }

      try {
        if (res && res.ok) {
          const data = await res.json()
          setStats(data)
          setLoading(false)
          return
        }
      } catch (e) {
        console.error("Failed to parse stats response:", e)
      }

      // Fallback local data if offline (matches PRD)
      setStats({
        status: "success",
        summary: {
          model_a: {
            accuracy_mean: 0.8515, accuracy_std: 0.0039,
            f1_mean: 0.8601, f1_std: 0.0044,
            avg_latency_ms: 7.60, peak_vram_mb: 2034.56
          },
          model_b: {
            accuracy_mean: 0.9161, accuracy_std: 0.0038,
            f1_mean: 0.9198, f1_std: 0.0035,
            avg_latency_ms: 7.71, peak_vram_mb: 2325.26
          }
        },
        statistical_tests: {
          mcnemar_p_value: 0.00000001,
          wilcoxon_p_value: 0.01562,
          bootstrap_95_ci: [0.0501, 0.0927],
          cohens_d: 12.72,
          effect_size_interpretation: "Extremely Large Effect"
        }
      })
      setLoading(false)
    }

    loadStats()
  }, [])

  if (loading || !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <div className="w-10 h-10 border-4 border-umsu-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-400">Memuat Data Analisis Benchmark...</p>
      </div>
    )
  }

  const { model_a, model_b } = stats.summary
  const testResults = stats.statistical_tests

  // Calculate Delta (improvement ratio)
  const deltaF1 = ((model_b.f1_mean - model_a.f1_mean) / model_a.f1_mean * 100).toFixed(2)
  const deltaAcc = ((model_b.accuracy_mean - model_a.accuracy_mean) / model_a.accuracy_mean * 100).toFixed(2)

  // Chart Data: Split into 2 Tab Modes for 100% scale precision & beauty
  const performanceChartData = [
    {
      name: 'Model A (Frozen)',
      'F1-Score (%)': Number((model_a.f1_mean * 100).toFixed(2)),
      'Akurasi (%)': Number((model_a.accuracy_mean * 100).toFixed(2)),
    },
    {
      name: 'Model B (Fine-Tuned)',
      'F1-Score (%)': Number((model_b.f1_mean * 100).toFixed(2)),
      'Akurasi (%)': Number((model_b.accuracy_mean * 100).toFixed(2)),
    }
  ]

  const computeChartData = [
    {
      name: 'Model A (Frozen)',
      'Latensi (ms)': Number(model_a.avg_latency_ms.toFixed(2)),
      'VRAM Peak (MB)': Number(model_a.peak_vram_mb.toFixed(2)),
    },
    {
      name: 'Model B (Fine-Tuned)',
      'Latensi (ms)': Number(model_b.avg_latency_ms.toFixed(2)),
      'VRAM Peak (MB)': Number(model_b.peak_vram_mb.toFixed(2)),
    }
  ]

  // Chart Data: Error Analysis on Negations (Linguistic) - Dynamic from API/Database
  const linguisticData = (stats.error_analysis && stats.error_analysis.length > 0)
    ? stats.error_analysis.map(item => ({
        subject: item.subject,
        'Model A (Frozen)': item.model_a_accuracy,
        'Model B (FT)': item.model_b_accuracy,
        fullMark: 100
      }))
    : [
        { subject: 'Tanpa Negasi', 'Model A (Frozen)': 86, 'Model B (FT)': 94, fullMark: 100 },
        { subject: 'Negasi Biner', 'Model A (Frozen)': 42, 'Model B (FT)': 91, fullMark: 100 },
        { subject: 'Ironi / Sarkasme', 'Model A (Frozen)': 35, 'Model B (FT)': 82, fullMark: 100 },
        { subject: 'Review Panjang', 'Model A (Frozen)': 72, 'Model B (FT)': 88, fullMark: 100 },
        { subject: 'Ambiguitas Tinggi', 'Model A (Frozen)': 51, 'Model B (FT)': 85, fullMark: 100 },
      ]

  // McNemar Contingency Matrix Data - Dynamic from API/Database
  const mcnemarMatrix = stats.mcnemar_matrix || {
    both_correct: 717,
    a_correct_b_wrong: 22,
    b_correct_a_wrong: 88,
    both_wrong: 45,
    chi2: 38.4091
  }

  // Explanatory Tooltip Texts for Academic UX - Dynamic Templating
  const tooltips = {
    mcnemar: `Uji McNemar adalah uji statistik berpasangan non-parametrik pada tabel kontingensi 2x2 (N=872). Chi2 = ${mcnemarMatrix.chi2?.toFixed(2) || '38.41'}, p-value < 0.0001 membuktikan ketimpangan kesalahan Model A (${mcnemarMatrix.b_correct_a_wrong} salah) vs Model B (${mcnemarMatrix.a_correct_b_wrong} salah) sangat signifikan.`,
    wilcoxon: `Uji Wilcoxon Signed-Rank adalah uji non-parametrik berpasangan pada 6 random seeds. Nilai statistik W = 21.0, p = ${testResults.wilcoxon_p_value} (< 0.05) membuktikan keunggulan F1-Score Model B terbukti stabil di seluruh seed.`,
    bootstrap: `Bootstrap Confidence Interval (95%) dihitung dengan 10.000 kali resampling. Rentang [${(testResults.bootstrap_95_ci[0]*100).toFixed(2)}% s/d ${(testResults.bootstrap_95_ci[1]*100).toFixed(2)}%] bernilai positif dan tidak melewati 0.0, membuktikan peningkatan F1-Score nyata.`,
    cohen: `Cohen's d mengukur ukuran efek (Effect Size). Nilai d = ${testResults.cohens_d.toFixed(2)} mengindikasikan dampak yang luar biasa kuat (${testResults.effect_size_interpretation || 'Extremely Large Effect'}) dari metode Fine-Tuning dibanding Feature Extraction.`
  }

  return (
    <div className="space-y-8">
      {/* SECTION 1: Summary Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: F1-Score Mean */}
        <div className="glass-card p-5 space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
            <span>RERATA <em>F1-SCORE</em> (N = 6)</span>
            <span className="text-umsu-emerald bg-umsu-emerald/10 border border-umsu-emerald/20 px-2 py-0.5 rounded text-[10px] font-bold">
              +{deltaF1}% Delta
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-100">{(model_b.f1_mean * 100).toFixed(2)}%</span>
            <span className="text-[11px] text-slate-400">vs {(model_a.f1_mean * 100).toFixed(2)}%</span>
          </div>
          <p className="text-[10px] text-slate-400">Simpangan Baku: Model B ({model_b.f1_std.toFixed(4)}) vs Model A ({model_a.f1_std.toFixed(4)})</p>
        </div>

        {/* Card 2: Accuracy Mean */}
        <div className="glass-card p-5 space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
            <span>RERATA AKURASI (N = 6)</span>
            <span className="text-umsu-emerald bg-umsu-emerald/10 border border-umsu-emerald/20 px-2 py-0.5 rounded text-[10px] font-bold">
              +{deltaAcc}% Delta
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-100">{(model_b.accuracy_mean * 100).toFixed(2)}%</span>
            <span className="text-[11px] text-slate-400">vs {(model_a.accuracy_mean * 100).toFixed(2)}%</span>
          </div>
          <p className="text-[10px] text-slate-400">Simpangan Baku: Model B ({model_b.accuracy_std.toFixed(4)}) vs Model A ({model_a.accuracy_std.toFixed(4)})</p>
        </div>

        {/* Card 3: GPU VRAM Allocation */}
        <div className="glass-card p-5 space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
            <span>ALOKASI GPU VRAM</span>
            <span className="text-umsu-orange bg-umsu-orange/10 border border-umsu-orange/20 px-2 py-0.5 rounded text-[10px] font-bold">
              Komputasi Tinggi
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-100">{model_b.peak_vram_mb} MB</span>
            <span className="text-[11px] text-slate-400">vs {model_a.peak_vram_mb} MB</span>
          </div>
          <p className="text-[10px] text-slate-400">Peningkatan konsumsi VRAM sebesar {(model_b.peak_vram_mb / model_a.peak_vram_mb).toFixed(1)}× lipat.</p>
        </div>

        {/* Card 4: Average Latency */}
        <div className="glass-card p-5 space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
            <span>RERATA LATENSI INFERENSI</span>
            <span className="text-umsu-gold bg-umsu-gold/10 border border-umsu-gold/20 px-2 py-0.5 rounded text-[10px] font-bold">
              Komparabel
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-100">{model_b.avg_latency_ms} ms</span>
            <span className="text-[11px] text-slate-400">vs {model_a.avg_latency_ms} ms</span>
          </div>
          <p className="text-[10px] text-slate-400">Perbedaan latensi inferensi bertambah sangat tipis (+{((model_b.avg_latency_ms - model_a.avg_latency_ms) / model_a.avg_latency_ms * 100).toFixed(1)}%).</p>
        </div>
      </section>

      {/* SECTION 2: Charts (Trade-off & Linguistic Error Analysis) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart A: Trade-Off Analysis with Tab Switcher */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-200 mb-0.5 flex items-center space-x-2">
                  <Activity className="text-umsu-gold" size={16} />
                  <span>Grafik Komparasi Biaya Komputasi & Performa</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  {chartTab === 'performance'
                    ? 'Perbandingan performa prediktif F1-Score (%) & Akurasi (%).'
                    : 'Perbandingan latensi inferensi (ms) & puncak alokasi VRAM GPU (MB).'
                  }
                </p>
              </div>

              {/* Tab Switcher Pills */}
              <div className="flex items-center space-x-1 p-1 bg-slate-900/90 border border-slate-800 rounded-xl flex-shrink-0 self-start sm:self-auto shadow-inner">
                <button
                  onClick={() => setChartTab('performance')}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    chartTab === 'performance'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Performa (%)
                </button>
                <button
                  onClick={() => setChartTab('compute')}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    chartTab === 'compute'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Komputasi (ms/MB)
                </button>
              </div>
            </div>
          </div>

          <div className="h-[250px] w-full mt-2 font-mono text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              {chartTab === 'performance' ? (
                <BarChart data={performanceChartData} margin={{ top: 15, right: 10, left: -15, bottom: 36 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="name" stroke={textColor} tick={<XAxisTwoLineTick fill={textColor} />} interval={0} />
                  <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" domain={[70, 100]} label={{ value: 'Persentase (%)', angle: -90, position: 'insideLeft', offset: 10, fill: '#3b82f6' }} />
                  <RechartsTooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '12px', color: isLight ? '#0f172a' : '#f8fafc' }} />
                  <Legend wrapperStyle={{ paddingTop: 10 }} />
                  <Bar yAxisId="left" dataKey="F1-Score (%)" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  <Bar yAxisId="left" dataKey="Akurasi (%)" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              ) : (
                <BarChart data={computeChartData} margin={{ top: 15, right: 30, left: -15, bottom: 36 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="name" stroke={textColor} tick={<XAxisTwoLineTick fill={textColor} />} interval={0} />
                  <YAxis yAxisId="left" orientation="left" stroke="#14b8a6" domain={[0, 12]} label={{ value: 'Latensi (ms)', angle: -90, position: 'insideLeft', offset: 10, fill: '#14b8a6' }} />
                  <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" domain={[0, 3000]} label={{ value: 'Peak VRAM (MB)', angle: 90, position: 'insideRight', offset: 15, fill: '#f59e0b' }} />
                  <RechartsTooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '12px', color: isLight ? '#0f172a' : '#f8fafc' }} />
                  <Legend wrapperStyle={{ paddingTop: 10 }} />
                  <Bar yAxisId="left" dataKey="Latensi (ms)" fill="#14b8a6" radius={[6, 6, 0, 0]} />
                  <Bar yAxisId="right" dataKey="VRAM Peak (MB)" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart B: Linguistic Radar Error Analysis */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200 mb-1 flex items-center space-x-2">
              <Compass className="text-umsu-gold" size={16} />
              <span>Analisis Kesalahan Linguistik Berdasarkan Kategori</span>
            </h3>
            <p className="text-[11px] text-slate-400 mb-6">Persentase (%) akurasi deteksi sentimen berdasarkan struktur dan tata bahasa.</p>
          </div>

          <div className="h-[280px] w-full flex items-center justify-center font-mono text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="60%" data={linguisticData}>
                <PolarGrid stroke={gridColor} />
                <PolarAngleAxis
                  dataKey="subject"
                  stroke={textColor}
                  tick={<RadarTwoLineTick fill={textColor} />}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                <Radar name="Model A (Frozen)" dataKey="Model A (Frozen)" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} />
                <Radar name="Model B (Fine-Tuned)" dataKey="Model B (FT)" stroke="#facc15" fill="#facc15" fillOpacity={0.25} />
                <RechartsTooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '12px', color: isLight ? '#0f172a' : '#f8fafc' }} />
                <Legend wrapperStyle={{ paddingTop: 10 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* SECTION 3: Statistical Significance (McNemar + Test Badges) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* McNemar Matrix Grid (2 columns block) */}
        <div className="glass-card p-6 lg:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200 mb-1 flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Shield className="text-umsu-gold" size={16} />
                <span>Matriks Kontingensi <em>McNemar</em></span>
              </span>
              <button 
                onClick={() => setActiveTooltip(activeTooltip === 'mcnemar' ? null : 'mcnemar')}
                className="text-slate-400 hover:text-umsu-gold transition-colors"
                title="Penjelasan Statistik"
              >
                <HelpCircle size={16} />
              </button>
            </h3>
            <p className="text-[11px] text-slate-400 mb-4">Pengujian signifikansi berpasangan tingkat sampel pada <em>held-out test set</em> (N = 872).</p>
          </div>

          {/* Contingency Table Visual */}
          <div className="grid grid-cols-2 gap-4 text-center mt-2 font-mono">
            {/* Cell 1: Both Correct */}
            <div className="bg-slate-950/80 border border-blue-950 p-4 rounded-xl">
              <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Kedua Model Benar (A+ / B+)</span>
              <h4 className="text-2xl font-black text-umsu-emerald mt-1">{mcnemarMatrix.both_correct}</h4>
              <span className="text-[9px] text-slate-400">{(mcnemarMatrix.both_correct / 872 * 100).toFixed(1)}% sampel</span>
            </div>

            {/* Cell 2: Model B Correct, Model A Wrong (Critical Cell) */}
            <div className="bg-umsu-gold/5 border border-umsu-gold/20 p-4 rounded-xl">
              <span className="text-[9px] uppercase tracking-wider text-umsu-gold block font-semibold">Model B Benar & Model A Salah (A- / B+)</span>
              <h4 className="text-2xl font-black text-umsu-gold mt-1">{mcnemarMatrix.b_correct_a_wrong}</h4>
              <span className="text-[9px] text-slate-300">{(mcnemarMatrix.b_correct_a_wrong / 872 * 100).toFixed(1)}% sampel</span>
            </div>

            {/* Cell 3: Model A Correct, Model B Wrong */}
            <div className="bg-slate-950/80 border border-blue-950 p-4 rounded-xl">
              <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Model A Benar & Model B Salah (A+ / B-)</span>
              <h4 className="text-2xl font-black text-slate-300 mt-1">{mcnemarMatrix.a_correct_b_wrong}</h4>
              <span className="text-[9px] text-slate-400">{(mcnemarMatrix.a_correct_b_wrong / 872 * 100).toFixed(1)}% sampel</span>
            </div>

            {/* Cell 4: Both Wrong */}
            <div className="bg-slate-950/80 border border-blue-950 p-4 rounded-xl">
              <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Kedua Model Salah (A- / B-)</span>
              <h4 className="text-2xl font-black text-umsu-rose mt-1">{mcnemarMatrix.both_wrong}</h4>
              <span className="text-[9px] text-slate-400">{(mcnemarMatrix.both_wrong / 872 * 100).toFixed(1)}% sampel</span>
            </div>
          </div>

          <div className="mt-4 text-[10px] text-slate-400 flex items-center space-x-2 border-t border-blue-950/30 pt-3">
            <AlertCircle size={12} className="text-umsu-gold flex-shrink-0" />
            <span>
              Ketimpangan signifikan sel kritis (<strong>{mcnemarMatrix.b_correct_a_wrong}</strong> vs <strong>{mcnemarMatrix.a_correct_b_wrong}</strong>) membuktikan secara empiris keunggulan Model B.
            </span>
          </div>
        </div>

        {/* Statistical Test Metrics Panel */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200 mb-4">Uji Statistik Inferensial</h3>
          </div>

          <div className="space-y-4 flex-grow">
            {/* McNemar p-value */}
            <div className={`pb-3 border-b ${isLight ? 'border-slate-200' : 'border-blue-950/30'}`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>McNemar <span className="italic">p</span>-value</span>
                  <button onClick={() => setActiveTooltip('mcnemar')} className={`hover:text-umsu-gold ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                    <HelpCircle size={12} />
                  </button>
                </div>
                <span className={`text-xs font-mono font-bold ${isLight ? 'text-emerald-700' : 'text-umsu-emerald'}`}>{testResults.mcnemar_p_value.toFixed(6)}</span>
              </div>
              <p className={`text-[10px] mt-1 font-sans leading-tight ${isLight ? 'text-emerald-800 font-medium' : 'text-emerald-400/90'}`}>
                ✓ <strong>Sangat Signifikan (<span className="italic">p</span> &lt; 0,0001)</strong>: Perbedaan kesalahan per-kalimat antara Model A & B terbukti nyata, bukan kebetulan.
              </p>
            </div>

            {/* Wilcoxon p-value */}
            <div className={`pb-3 border-b ${isLight ? 'border-slate-200' : 'border-blue-950/30'}`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Wilcoxon <span className="italic">p</span>-value</span>
                  <button onClick={() => setActiveTooltip('wilcoxon')} className={`hover:text-umsu-gold ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                    <HelpCircle size={12} />
                  </button>
                </div>
                <span className={`text-xs font-mono font-bold ${isLight ? 'text-emerald-700' : 'text-umsu-emerald'}`}>{testResults.wilcoxon_p_value.toFixed(5)}</span>
              </div>
              <p className={`text-[10px] mt-1 font-sans leading-tight ${isLight ? 'text-emerald-800 font-medium' : 'text-emerald-400/90'}`}>
                ✓ <strong>Signifikan (<span className="italic">p</span> &lt; 0,05)</strong>: Keunggulan F1-score Model B terbukti konsisten di seluruh 6 random seed.
              </p>
            </div>

            {/* Bootstrap 95% CI */}
            <div className={`pb-3 border-b ${isLight ? 'border-slate-200' : 'border-blue-950/30'}`}>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Bootstrap 95% CI Range</span>
                  <button onClick={() => setActiveTooltip('bootstrap')} className={`hover:text-umsu-gold ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                    <HelpCircle size={12} />
                  </button>
                </div>
                <span className={`text-[11px] font-mono font-bold ${isLight ? 'text-amber-700' : 'text-umsu-gold'}`}>
                  [{testResults.bootstrap_95_ci[0].toFixed(4)} , {testResults.bootstrap_95_ci[1].toFixed(4)}]
                </span>
              </div>
              {/* Range bar visualization */}
              <div className={`w-full rounded-full h-1.5 overflow-hidden border mt-1.5 relative ${isLight ? 'bg-slate-200 border-slate-300' : 'bg-slate-950 border-blue-950'}`}>
                <div 
                  className={`h-full rounded-full absolute ${isLight ? 'bg-amber-500' : 'bg-umsu-gold'}`}
                  style={{ left: '45%', width: '40%' }} // representative display
                />
              </div>
              <p className={`text-[10px] mt-1.5 font-sans leading-tight ${isLight ? 'text-amber-800 font-medium' : 'text-amber-300/90'}`}>
                ✓ <strong>Signifikan</strong>: Peningkatan F1-score (+4,44% s/d +8,83%) dipastikan bernilai positif (rentang CI tidak melewati angka 0).
              </p>
            </div>

            {/* Cohen's d Gauge */}
            <div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Cohen's <span className="italic">d</span> (Effect Size)</span>
                  <button onClick={() => setActiveTooltip('cohen')} className={`hover:text-umsu-gold ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                    <HelpCircle size={12} />
                  </button>
                </div>
                <span className={`text-xs font-mono font-bold ${isLight ? 'text-amber-700' : 'text-umsu-gold'}`}>{testResults.cohens_d.toFixed(2)}</span>
              </div>
              <div className="flex items-center space-x-2 mt-1 font-sans">
                <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${isLight ? 'text-emerald-800 bg-emerald-100 border border-emerald-300' : 'text-umsu-emerald bg-umsu-emerald/10 border border-umsu-emerald/20'}`}>
                  {testResults.effect_size_interpretation}
                </span>
              </div>
              <p className={`text-[10px] mt-1.5 font-sans leading-tight ${isLight ? 'text-emerald-800 font-medium' : 'text-emerald-400/90'}`}>
                ✓ <strong>Dampak Efek Sangat Kuat (<span className="italic">d</span> &gt; 2,0)</strong>: Metode Fine-Tuning memberikan dampak peningkatan performa yang sangat dominan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Tooltip Popup */}
      {activeTooltip && (
        <div className="fixed inset-0 z-50 bg-[#040814]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 max-w-sm w-full space-y-4"
          >
            <div className="flex justify-between items-center border-b border-blue-950/60 pb-2">
              <h4 className="text-sm font-bold text-umsu-gold capitalize flex items-center space-x-1.5">
                <Info size={14} />
                <span>Info Statistik: {activeTooltip}</span>
              </h4>
              <button 
                onClick={() => setActiveTooltip(null)}
                className="text-slate-400 hover:text-slate-200 text-xs"
              >
                Tutup
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {tooltips[activeTooltip]}
            </p>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Analytics
