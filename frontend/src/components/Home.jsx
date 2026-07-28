import React from 'react'
import { motion } from 'framer-motion'
import { 
  Sparkles, 
  GitCompare, 
  BarChart3, 
  Cpu, 
  ArrowRight, 
  Brain, 
  ShieldCheck, 
  Award
} from 'lucide-react'

export default function Home({ theme, onNavigate }) {
  const isLight = theme === 'light'
  const notebookSeeds = ['42', '123', '777', '999', '1234', '2024']

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 sm:space-y-10 py-2"
    >
      {/* HERO SECTION - UMSU Academic Design System */}
      <motion.section 
        variants={itemVariants}
        className={`relative overflow-hidden rounded-3xl border p-6 sm:p-10 md:p-12 transition-all backdrop-blur-xl ${
          isLight
            ? 'bg-white/95 border-slate-200 shadow-xl text-slate-900'
            : 'bg-[#0a1128]/95 border-blue-900/40 shadow-2xl text-slate-100'
        }`}
      >
        {/* Glow Spheres Background - UMSU Gold & Royal Blue */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-umsu-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-umsu-royal/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-5 sm:space-y-6">
          {/* Institution Badge */}
          <div className={`inline-flex items-center space-x-2 px-3.5 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-bold border shadow-sm max-w-full ${
            isLight
              ? 'bg-blue-50 text-blue-900 border-blue-200'
              : 'bg-umsu-royal/10 text-umsu-royal border-umsu-royal/30'
          }`}>
            <img src="/logo-umsu.png?v=2.0" alt="Logo UMSU" className="w-4 h-4 object-contain flex-shrink-0 drop-shadow-sm" />
            <span className="hidden sm:inline">Fakultas Ilmu Komputer & Teknologi Informasi • UMSU</span>
            <span className="inline sm:hidden">FIKTI • Universitas Muhammadiyah Sumatera Utara</span>
          </div>

          {/* Main Title & Subtitle */}
          <div className="space-y-2.5 sm:space-y-3">
            <h1 className={`text-3xl sm:text-5xl font-extrabold tracking-tight ${
              isLight ? 'text-slate-900' : 'text-slate-100'
            }`}>
              BERT Sentiment Lab
            </h1>
            <p className={`text-xs sm:text-base max-w-2xl mx-auto font-medium leading-relaxed ${
              isLight ? 'text-slate-700' : 'text-slate-300'
            }`}>
              Platform riset eksperimental komparatif inferensi sentimen ulasan film yang membandingkan metode <em>BERT Feature Extraction</em> dan <em>BERT Fine-Tuning</em> secara kuantitatif.
            </p>
          </div>

          {/* Researcher Identity Pill - Dynamic Light & Dark Mode Optimization */}
          <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-2xl border text-[11px] sm:text-xs font-semibold shadow-sm transition-all ${
            isLight
              ? 'bg-slate-100/90 border-slate-300 text-slate-800'
              : 'bg-[#040814] border-blue-900/60 text-slate-100'
          }`}>
            <ShieldCheck size={16} className={isLight ? 'text-amber-600 flex-shrink-0' : 'text-umsu-gold flex-shrink-0'} />
            <span>
              <span className={isLight ? 'text-slate-700 font-medium' : 'text-slate-300 font-medium'}>Peneliti: </span>
              <strong className={isLight ? 'text-slate-900 font-black' : 'text-white font-black'}>Syafiq Hasan</strong>
              <span className={isLight ? 'text-blue-900 font-bold' : 'text-amber-400 font-semibold'}> (NPM: 2209010182)</span>
            </span>
          </div>

          {/* Action Navigation Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
            <button
              onClick={() => onNavigate('comparator')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-black text-[#040814] bg-gradient-to-r from-umsu-gold via-yellow-400 to-amber-500 hover:from-yellow-400 hover:to-yellow-500 shadow-xl shadow-umsu-gold/20 transition-all flex items-center justify-center space-x-2 cursor-pointer hover:scale-[1.02]"
            >
              <GitCompare size={18} />
              <span>Uji Inferensi <em>Real-Time</em></span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => onNavigate('analytics')}
              className={`group w-full sm:w-auto px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold border transition-all flex items-center justify-center space-x-2 cursor-pointer hover:scale-[1.02] ${
                isLight
                  ? 'bg-white text-slate-900 border-slate-300 hover:bg-slate-900 hover:text-white hover:border-slate-900 shadow-md'
                  : 'bg-[#0f172a] text-slate-100 border-slate-700 hover:bg-[#1e293b] shadow-lg'
              }`}
            >
              <BarChart3 size={18} className="text-umsu-gold" />
              <span>Lihat Benchmark Statistik</span>
            </button>
          </div>
        </div>
      </motion.section>

      {/* TWO MODEL COMPARISON CARDS */}
      <motion.section 
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="space-y-4"
      >
        <div className="text-left sm:text-center space-y-1">
          <h2 className={`text-lg sm:text-xl font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            Arsitektur Model yang Dibandingkan
          </h2>
          <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Dua pendekatan komputasi utama berbasis BERT (<em>Bidirectional Encoder Representations from Transformers</em>)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {/* Model A Card */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.4 }}
            className={`p-5 sm:p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
              isLight
                ? 'bg-white border-slate-200 shadow-sm hover:border-sky-300'
                : 'bg-[#0a1128]/80 border-blue-900/40 hover:border-sky-500/40'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-500 flex items-center justify-center flex-shrink-0">
                    <Cpu size={20} />
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm sm:text-base ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                      Model A: <em>Feature Extraction</em>
                    </h3>
                    <span className={`text-[11px] font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}><em>Frozen Transformer Encoder</em></span>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border flex-shrink-0 ${
                  isLight ? 'bg-sky-50 text-sky-800 border-sky-200' : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}>
                  Model A
                </span>
              </div>

              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-700 font-normal' : 'text-slate-300'}`}>
                Seluruh 12 lapisan <em>transformer encoder</em> dibekukan (<em>frozen</em>) dan hanya lapisan <em>linear head</em> atas yang dilatih. Arsitektur ini memiliki efisiensi ekstraksi tinggi, namun terbatas dalam menangkap konteks negasi kompleks.
              </p>
            </div>

            <div className={`grid grid-cols-3 gap-2 pt-4 mt-auto text-center border-t ${isLight ? 'border-sky-100' : 'border-slate-800/40'}`}>
              <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-sky-50/60 border-sky-100' : 'bg-slate-900/50 border-transparent'}`}>
                <div className={`text-[11px] font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Akurasi</div>
                <div className={`text-xs font-extrabold ${isLight ? 'text-sky-700' : 'text-sky-400'}`}>85,15%</div>
              </div>
              <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-sky-50/60 border-sky-100' : 'bg-slate-900/50 border-transparent'}`}>
                <div className={`text-[11px] font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}><em>F1-score</em></div>
                <div className={`text-xs font-extrabold ${isLight ? 'text-sky-700' : 'text-sky-400'}`}>86,01%</div>
              </div>
              <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-sky-50/60 border-sky-100' : 'bg-slate-900/50 border-transparent'}`}>
                <div className={`text-[11px] font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Latensi</div>
                <div className={`text-xs font-extrabold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>~7,60 ms</div>
              </div>
            </div>
          </motion.div>

          {/* Model B Card */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.4 }}
            className={`p-5 sm:p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
              isLight
                ? 'bg-white border-slate-200 shadow-sm hover:border-purple-300'
                : 'bg-[#0a1128]/80 border-purple-900/40 hover:border-purple-500/40'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-500 flex items-center justify-center flex-shrink-0">
                    <Brain size={20} />
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm sm:text-base ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                      Model B: <em>Fine-Tuning</em>
                    </h3>
                    <span className={`text-[11px] font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}><em>End-to-End Parameter Optimization</em></span>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border flex-shrink-0 ${
                  isLight ? 'bg-purple-50 text-purple-800 border-purple-200' : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                }`}>
                  Model B
                </span>
              </div>

              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-700 font-normal' : 'text-slate-300'}`}>
                Seluruh 110 juta parameter BERT diperbarui secara menyeluruh melalui <em>backpropagation</em>. Arsitektur ini mampu memahami nuansa negasi majemuk (<em>double negation</em>) serta ketergantungan konteks yang kompleks dengan akurasi tinggi.
              </p>
            </div>

            <div className={`grid grid-cols-3 gap-2 pt-4 mt-auto text-center border-t ${isLight ? 'border-purple-100' : 'border-purple-900/30'}`}>
              <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-purple-50/60 border-purple-100' : 'bg-slate-900/50 border-transparent'}`}>
                <div className={`text-[11px] font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Akurasi</div>
                <div className={`text-xs font-extrabold ${isLight ? 'text-purple-700' : 'text-purple-400'}`}>91,61%</div>
              </div>
              <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-purple-50/60 border-purple-100' : 'bg-slate-900/50 border-transparent'}`}>
                <div className={`text-[11px] font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}><em>F1-score</em></div>
                <div className={`text-xs font-extrabold ${isLight ? 'text-purple-700' : 'text-purple-400'}`}>91,98%</div>
              </div>
              <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-purple-50/60 border-purple-100' : 'bg-slate-900/50 border-transparent'}`}>
                <div className={`text-[11px] font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Latensi</div>
                <div className={`text-xs font-extrabold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>~7,71 ms</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* STATISTICAL RESEARCH HIGHLIGHTS */}
      <motion.section 
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`p-5 sm:p-8 rounded-3xl border transition-all ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-950/60 border-blue-900/30'
        }`}
      >
        {/* Header with Award Icon Inline with Title */}
        <div className="space-y-2 mb-6 text-left">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center flex-shrink-0">
              <Award size={20} />
            </div>
            <h3 className={`font-bold text-base sm:text-lg leading-snug ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              Hasil Pengujian Hipotesis Statistik
            </h3>
          </div>

          {/* Explanation Text starting from below the logo */}
          <div className={`text-xs leading-relaxed space-y-2 pt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            <p>
              Evaluasi inferensial secara ketat menggunakan 6 <em>random seed initializations</em> (N = 6 <em>Seeds</em>):
            </p>
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {notebookSeeds.map((seed) => (
                <code key={seed} className={`px-2 py-0.5 rounded-md border font-mono text-[11px] font-semibold ${
                  isLight ? 'bg-slate-100/90 border-slate-200 text-slate-800 font-bold' : 'bg-slate-900 border-slate-700/80 text-teal-300'
                }`}>
                  {seed}
                </code>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          <div className={`p-4 rounded-2xl border text-center space-y-1 ${
            isLight ? 'bg-emerald-50/50 border-emerald-100' : 'bg-slate-900/80 border-blue-900/30'
          }`}>
            <div className={`text-xs font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Delta Rerata Akurasi</div>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">+6,46%</div>
            <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>95% CI: [+4,44%, +8,83%]</div>
          </div>

          <div className={`p-4 rounded-2xl border text-center space-y-1 ${
            isLight ? 'bg-sky-50/50 border-sky-100' : 'bg-slate-900/80 border-blue-900/30'
          }`}>
            <div className={`text-xs font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Uji <em>Wilcoxon Signed-Rank</em></div>
            <div className="text-xl font-black text-sky-600 dark:text-sky-400"><span className="italic">p</span> = 0,01562</div>
            <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Signifikan (<span className="italic">p</span> &lt; 0,05)</div>
          </div>

          <div className={`p-4 rounded-2xl border text-center space-y-1 ${
            isLight ? 'bg-purple-50/50 border-purple-100' : 'bg-slate-900/80 border-blue-900/30'
          }`}>
            <div className={`text-xs font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Uji Kestabilan <em>McNemar</em></div>
            <div className="text-xl font-black text-purple-600 dark:text-purple-400"><span className="italic">p</span> = 1,48e-8</div>
            <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Chi-Square χ² = 32,14</div>
          </div>

          <div className={`p-4 rounded-2xl border text-center space-y-1 ${
            isLight ? 'bg-amber-50/50 border-amber-100' : 'bg-slate-900/80 border-blue-900/30'
          }`}>
            <div className={`text-xs font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Ukuran Efek (<em>Cohen's d</em>)</div>
            <div className="text-xl font-black text-amber-600 dark:text-amber-400"><span className="italic">d</span> = 14,45</div>
            <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Efek Sangat Besar (<em>Extremely Large Effect</em>)</div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  )
}
