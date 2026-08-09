# **BAB IV**  
# **HASIL DAN PEMBAHASAN**

---

### **4.1. Lingkungan Eksperimen dan Implementasi Sistem**

Sub-bab ini menyajikan deskripsi lingkungan komputasi, arsitektur integrasi *Dual-Backend Hybrid*, implementasi modul antarmuka pengguna, serta hasil pengujian kelayakan sistem yang dikembangkan guna menjawab **Pertanyaan Penelitian ke-4 (RQ4)** mengenai perancangan dan pembangunan produk aplikasi web komparator sentimen real-time.

#### **4.1.1. Lingkungan Perangkat Keras dan Perangkat Lunak**
Pelaksanaan eksperimen komparatif dan pengujian inferensi aplikasi web memanfaatkan kombinasi lingkungan komputasi berkinerja tinggi (*High-Performance Computing*) serta infrastruktur *cloud deployment*. Eksperimen utama dieksekusi menggunakan akselerasi GPU NVIDIA A100 Tensor Core (varian 40 GB VRAM pada Google Colab High-RAM) guna menjamin kestabilan *throughput* pelatihan multi-seed dan presisi pengukuran latensi inferensi. 

Spesifikasi lengkap perangkat keras dan perangkat lunak yang digunakan dalam penelitian ini disajikan pada **Tabel 4.1**:

**Tabel 4.1. Spesifikasi Lingkungan Eksperimen dan Implementasi Sistem**

| Komponen | Spesifikasi / Alat | Fungsi Utama |
|---|---|---|
| **GPU Accelerator** | NVIDIA A100 Tensor Core GPU (40 GB VRAM) | Akselerasi pelatihan multi-epoch & inferensi real-time |
| **Pustaka Deep Learning** | PyTorch 2.x, Hugging Face `transformers` | Pelatihan model BERT (`bert-base-uncased`) & manipulasi tensor |
| **Pustaka Evaluasi & Statistik** | Scikit-Learn, SciPy, AFINN 0.1, `evaluate` | Pengujian statistik McNemar, Wilcoxon, Bootstrap CI, & AFINN |
| **Backend API Framework** | Python 3.10+, FastAPI, Uvicorn | Pelayanan REST API & manajemen basis data |
| **Database Engine** | SQLite 3 (`app.db`), SQLAlchemy ORM | Persistensi data *benchmark* empiris & riwayat prediksi |
| **Frontend Framework** | React 18 (Vite), TailwindCSS, Framer Motion | Antarmuka pengguna PWA interaktif & visualisasi data |
| **Deployment Cloud** | Vercel (Frontend PWA) & Railway (CPU Backend) | Hosting aplikasi web publik dan redundansi server cadangan |

*Sumber: Data Diolah Peneliti (2026)*

Untuk menjamin objektivitas dan transparansi data konsumsi daya komputasi, alokasi penggunaan memori puncak GPU (*Peak VRAM Allocation*) pada setiap siklus pelatihan dan inferensi diukur secara konsisten di setiap *run random seed* setelah *CUDA context warm-up* terpenuhi, sesuai dengan instrumen pengukuran PyTorch (`torch.cuda.max_memory_allocated()`) yang telah dirancang pada Bab III Sub-bab 3.9.2. Selain itu, latensi inferensi diukur menggunakan `torch.cuda.Event(enable_timing=True)` dengan `torch.cuda.synchronize()` untuk menjamin akurasi eksekusi tanpa terdistorsi oleh sifat eksekusi asinkron GPU.

#### **4.1.2. Arsitektur Integrasi Dual-Backend Hybrid**
Untuk menjamin ketersediaan tinggi (*high availability*) dan latensi inferensi yang responsif pada aplikasi web, dikembangkan arsitektur *Dual-Backend Hybrid* dengan alur integrasi sebagai berikut:
1. **Primary Backend (GPU Server)**: Berjalan di Google Colab menggunakan GPU NVIDIA A100 Tensor Core (40 GB VRAM) yang dihubungkan melalui *Ngrok Static Tunnel* (`irritably-tipper-january.ngrok-free.dev`). Backend ini melayani inferensi real-time dengan latensi ultra-cepat ($\sim 1{,}82\text{ ms}$).
2. **Fallback Backend (CPU Server)**: Berjalan di Railway Cloud Service (1-vCPU Server) sebagai server cadangan otomatis jika runtime GPU Colab dalam keadaan non-aktif (*offline*), melayani inferensi dengan latensi rerata $24{,}65\text{ ms}$ (Model A) dan $25{,}12\text{ ms}$ (Model B) (rerata gabungan $\sim 24{,}88\text{ ms}$). Mekanisme *failover* dirancang dengan ambang batas *timeout* maksimum 6,0 detik sesuai Sub-bab 3.10.7. Dalam praktik eksekusinya, deteksi eror koneksi jaringan instan (*Immediate Network Connection Error Detection / ECONNREFUSED*) pada modul HTTP Handler frontend mampu menangkap kegagalan *handshake socket* secara langsung dalam kurun waktu **$1{,}24\text{ detik}$**, sehingga pengalihan rute ke server CPU Fallback dapat terjadi jauh lebih cepat dari batas *timeout* maksimum 6,0 detik.
3. **PWA Offline Storage**: Menggunakan *service worker* `vite-plugin-pwa` untuk melakukan *precaching* 10 aset statis aplikasi web untuk akses *offline* serta mendukung penginstalan aplikasi *native*.

#### **4.1.3. Implementasi Antarmuka Web Application**
Aplikasi web *BERT Sentiment Lab* dikembangkan untuk membuktikan efektivitas rancangan serta memberikan bukti nyata (*evidence of implementation*) atas hasil eksperimen komparatif. Aplikasi ini telah di-deploy secara publik dan dapat diakses secara *live* melalui tautan berikut: **[https://bert-sentiment-lab.vercel.app](https://bert-sentiment-lab.vercel.app/)** (Frontend PWA) dengan backend REST API yang berjalan terintegrasi pada server GPU Primary dan CPU Fallback. Antarmuka aplikasi terdiri dari tiga modul utama dan sistem keamanan berbasis peran:

##### **a. Modul Beranda (Home Page)**
Modul Beranda menampilkan identitas akademik institusi (FIKTI UMSU), identitas peneliti (*Syafiq Hasan, NPM: 2209010182*), serta kartu perbandingan dasar antara Model A (*Feature Extraction*) dan Model B (*Fine-Tuning*). Tampilan Halaman Beranda ditunjukkan pada **Gambar 4.1**:

![Gambar 4.1 Halaman Beranda Web App BERT Sentiment Lab](images/screenshot_home_beranda.png)

**Gambar 4.1 Halaman Beranda Web App BERT Sentiment Lab**  
*Sumber: Hasil Implementasi Antarmuka Aplikasi Web Peneliti (2026)*

##### **b. Modul Komparator Inferensi Real-Time**
Modul Komparator memungkinkan pengguna menguji kalimat ulasan secara *side-by-side* untuk mengamati skor probabilitas polaritas sentimen (%) dan latensi inferensi (ms) dari kedua model secara bersamaan. Antarmuka ini juga dilengkapi tombol *preset* kalimat kompleks dan tabel riwayat prediksi. Tampilan Modul Komparator ditunjukkan pada **Gambar 4.2**:

![Gambar 4.2 Modul Komparator Inferensi Real-Time Side-by-Side](images/screenshot_comparator_inferensi.png)

**Gambar 4.2 Modul Komparator Inferensi Real-Time Side-by-Side**  
*Sumber: Hasil Implementasi Antarmuka Aplikasi Web Peneliti (2026)*

##### **c. Modul Dashboard Analitik & Otentikasi RBAC**
Modul Dashboard Analitik berfungsi menyajikan visualisasi data *benchmark* empiris 6 *seed*, *Radar Chart* 5 kategori linguistik, matriks kontingensi McNemar 2x2, serta *tooltip* akademik penjelas statistik inferensial. Akses ke modul analitik dilindungi oleh sistem otentikasi *Role-Based Access Control* (RBAC) dengan modal login bertema *glassmorphism* untuk membedakan peran Pengguna Publik (*Public User*: hanya dapat melakukan inferensi komparator) dan Peneliti/Dosen (*Researcher/Admin*: mendapatkan hak akses penuh ke modul analitik dan riwayat pengujian). Tampilan Dashboard Analitik ditunjukkan pada **Gambar 4.3**:

![Gambar 4.3 Dashboard Analitik Benchmark Komparatif](images/screenshot_analytics_dashboard.png)

**Gambar 4.3 Dashboard Analitik Benchmark Komparatif**  
*Sumber: Hasil Implementasi Antarmuka Aplikasi Web Peneliti (2026)*

##### **d. Fitur Theme Toggle Switcher**
Untuk meningkatkan kenyamanan pengguna, antarmuka dilengkapi *sliding switch pill* dua arah untuk berganti antara *Dark Mode* dan *Light Mode* yang telah memenuhi standar kontras WCAG 2.1 AA. Tampilan fitur *Theme Toggle* ditunjukkan pada **Gambar 4.4**:

![Gambar 4.4 Antarmuka Mode Terang (Light Mode) dan Theme Toggle](images/screenshot_theme_toggle.png)

**Gambar 4.4 Antarmuka Mode Terang (Light Mode) dan Theme Toggle**  
*Sumber: Hasil Implementasi Antarmuka Aplikasi Web Peneliti (2026)*

#### **4.1.4. Implementasi Fitur Tambahan (Stretch Goals)**
Selain pemenuhan seluruh fungsionalitas utama (*Minimum Viable Product* / MVP), pengembangan aplikasi web *BERT Sentiment Lab* berhasil mengimplementasikan secara utuh **seluruh 7 fitur tambahan (*stretch goals*)** yang dirancang pada Sub-bab 3.10.12.B Proposal, ditambah dua fitur penyempurnaan sistem pendukung:

1. **Progressive Web App (PWA) & Offline Caching**: Penggunaan *service worker* `vite-plugin-pwa` dengan *precaching* 10 aset statis produksi untuk mendukung akses *offline* serta instalasi aplikasi desktop/seluler *native*.
2. **Sistem Autentikasi dan Kontrol Akses (RBAC)**: Pembatasan akses *Role-Based Access Control* dengan modal login *glassmorphism* untuk membedakan peran Pengguna Publik (*Public*) dan Peneliti/Dosen (*Researcher/Admin*).
3. **Arsitektur Dual-Backend Hybrid dengan Automatic Failover**: Pengalihan rute *failover* otomatis dari server GPU Colab Primary ke server CPU Railway Fallback ($1{,}24\text{ detik}$) jika server utama non-aktif.
4. **Visualisasi Interaktif Radar Chart 5 Kategori Linguistik**: Modul visualisasi grafik jaring (*Radar Chart*) interaktif pada Dashboard Analitik untuk membandingkan akurasi kedua model pada 5 kategori kompleksitas linguistik.
5. **Visualisasi Interaktif Matriks Kontingensi McNemar 2x2**: Tampilan matriks frekuensi $2 \times 2$ interaktif dengan *tooltip* penjelas parameter statistik $a, b, c, d$ dan $\chi^2$.
6. **Mikro-Animasi Transisi Halus (Framer Motion)**: Penerapan perpindahan antar-halaman, *loading skeleton*, serta efek *hover pill/cards* berbasis pustaka `framer-motion` untuk meningkatkan kenyamanan UI/UX.
7. **Theme Toggle Switcher (Dark/Light Mode)**: Sakelar luncur kontras tinggi berstandar WCAG 2.1 AA dengan skema warna hangat Amber (Mode Terang) dan Indigo/Gold (Mode Gelap).

*Fitur Bonus Penyempurnaan Tambahan:*
- **Pencarian dan Manajemen Riwayat Prediksi**: Tabel riwayat prediksi interaktif dengan pencarian teks, salin ke *clipboard*, dan hapus riwayat.
- **Pembatasan Laju API (API Rate Limiting)**: Pengontrolan laju *request* pada endpoint `/api/predict` dengan batas maksimum 10 request/menit per IP (HTTP 429) sesuai rancangan Bab III Sub-bab 3.10.6.

Bukti keberhasilan implementasi Progressive Web App (PWA) beserta petunjuk instalasi aplikasi dan *Service Worker active status* ditunjukkan pada **Gambar 4.5**:

![Gambar 4.5 Antarmuka Prompt Instalasi Progressive Web App (PWA) dan Status Service Worker](images/screenshot_pwa_installation.png)

**Gambar 4.5 Antarmuka Prompt Instalasi Progressive Web App (PWA) dan Status Service Worker**  
*Sumber: Hasil Implementasi Antarmuka Aplikasi Web Peneliti (2026)*

#### **4.1.5. Hasil Pengujian Sistem Aplikasi Web**
Sesuai dengan rancangan evaluasi sistem pada Bab III Sub-bab 3.15, pengujian terhadap sistem aplikasi web *BERT Sentiment Lab* dilaksanakan secara bertingkat yang mencakup tiga domain pengujian utama: *Unit Testing & Security* pada backend API, *Integration Testing & Failover*, serta *User Acceptance Testing* (UAT) menggunakan instrumen *System Usability Scale* (SUS) (Brooke, 1996, p. 189).

Ringkasan hasil dari ketiga tingkatan pengujian sistem dirangkum pada **Tabel 4.1a**:

**Tabel 4.1a. Hasil Pengujian Sistem Aplikasi Web BERT Sentiment Lab**

| Jenis Pengujian | Metrik Evaluasi | Target / Ambang Batas | Hasil Pengujian | Status Kelayakan |
|:---|:---|:---:|:---:|:---:|
| **Unit Testing (Backend API)** | Code Coverage Line Rate | $\ge 70\%$ | **86,5%** (15/15 test cases pass) | **✅ Lulus** |
| **API Security & Rate Limiting** | Batas Laju Request `/api/predict` | Maksimal 10 req/menit per IP | **10 req/menit (HTTP 429 triggered)** | **✅ Lulus** |
| **Integration Testing** | End-to-End API Flow Passing Rate | 100% Passing | **100%** (5/5 modul terintegrasi) | **✅ Lulus** |
| **Failover Testing (Backend)** | Waktu Alih GPU $\to$ CPU Failover | $< 6{,}0\text{ detik}$ (Max Timeout) | **1,24 detik (Deteksi Instan)** | **✅ Lulus** |
| **UAT (System Usability Scale)** | Skor Rerata SUS ($N=10$ Responden) | $\ge 68{,}0$ (*Acceptable*) | **82,50** (*Grade A / Excellent*) | **✅ Lulus** |

*Sumber: Data Hasil Pengujian Sistem Diproses Peneliti (2026)*

**Analisis Hasil Pengujian Sistem:**
1. **Unit Testing, Code Coverage & Pemetaan 7 Endpoint API**: Pengujian unit backend yang dieksekusi dengan *framework* `pytest` pada berkas `backend/tests/test_main.py` menghasilkan cakupan kode (*code coverage*) sebesar **$86{,}5\%$**, melebihi target minimal $70\%$. Seluruh **15 *test cases*** berhasil dieksekusi tanpa kesalahan (*0 failures/errors*) dengan pemetaan penuh terhadap **7 endpoint REST API** (Proposal Tabel 3.5):
   - **Endpoint 1 (`GET /health`)**: 1 *test case* (`test_health_check`).
   - **Endpoint 2 (`POST /api/predict`)**: 2 *test cases* (`test_predict_endpoint_valid`, `test_predict_endpoint_empty_text`).
   - **Endpoint 3 (`GET /api/benchmark-stats`)**: 1 *test case* (`test_benchmark_stats_endpoint`).
   - **Endpoint 4 (`GET /api/history`)**: 1 *test case* (`test_prediction_history_get`).
   - **Endpoint 5 (`DELETE /api/history/{log_id}`)**: 2 *test cases* (`test_delete_single_history_item`, `test_delete_single_history_not_found`).
   - **Endpoint 6 (`DELETE /api/history`)**: 1 *test case* (`test_delete_all_history_endpoint`).
   - **Endpoint 7 (`POST /api/login`)**: 3 *test cases* (`test_login_valid_researcher`, `test_login_invalid_username`, `test_login_invalid_password`).
   - **API Security & Rate Limiting (Middleware)**: 2 *test cases* (`test_rate_limiting_normal_traffic`, `test_rate_limiting_exceeded`).
   - **Arsitektur & Middleware Safeguards**: 2 *test cases* (`test_cors_headers_presence`, `test_error_handling_fallback`).
   
   Pengujian *API Rate Limiting* membuktikan bahwa permintaan ke-11 dalam kurun waktu 1 menit pada endpoint `/api/predict` secara konsisten diblokir dengan respon status **HTTP 429 (Too Many Requests)**.
2. **Integration & Automatic Failover Testing**: Pengujian integrasi membuktikan bahwa sistem aplikasi web mampu mendeteksi status ketersediaan server GPU Primary secara otomatis. Ketika server GPU diposisikan dalam keadaan *offline*, modul HTTP Handler frontend menerima penolakan koneksi TCP (*socket connection refused*) secara instan dalam waktu **$1{,}24\text{ detik}$** tanpa perlu menunggu batas *timeout* maksimum 6,0 detik (Sub-bab 3.10.7) terlampaui. *Automatic Failover Handler* pada frontend berhasil mengalihkan rute permintaan inferensi ke server CPU Fallback dengan lancar. Pada lingkungan CPU Fallback (Railway Cloud 1-vCPU), latensi inferensi rerata tercatat sebesar **$24{,}65\text{ ms}$** (Model A) dan **$25{,}12\text{ ms}$** (Model B), menunjukkan bahwa mekanisme *failover* tetap menyajikan respon inferensi real-time yang sangat responsif ($< 100\text{ ms}$) meskipun secara komputasional $\sim 13{,}6\times$ lebih lambat dibandingkan akselerasi GPU NVIDIA A100 Primary ($\sim 1{,}82\text{ ms}$).
3. **User Acceptance Testing (UAT - SUS)**: Evaluasi kebolehgunaan antarmuka dilakukan terhadap 10 responden (3 Dosen/Peneliti NLP dan 7 Mahasiswa FIKTI UMSU). Responden direkrut secara sukarela dari lingkungan akademik FIKTI UMSU, di mana 3 responden dosen/peneliti memiliki pengalaman riset langsung dalam bidang Pemrosesan Bahasa Alami (NLP) dan 7 mahasiswa tingkat akhir telah menempuh mata kuliah Kecerdasan Buatan dan Pembelajaran Mesin. Pengujian dilaksanakan secara mandiri (*unmoderated remote testing*) melalui tautan publik aplikasi web selama periode 3 hari kerja. Berdasarkan kalkulasi 10 item kuesioner standar SUS (Brooke, 1996, p. 189), aplikasi web memperoleh skor rerata SUS sebesar **$82{,}50$**. Berdasarkan skala kepuasan industri, skor ini masuk dalam kategori ***Grade A (Excellent)*** serta berada di atas ambang batas *Acceptable* ($68{,}0$), yang mengindikasikan bahwa antarmuka *BERT Sentiment Lab* sangat intuitif, mudah digunakan, dan layak disajikan secara publik.

---

### **4.2. Hasil Evaluasi Empiris dan Benchmark Metrik**

Sub-bab ini menyajikan hasil evaluasi eksperimental komparatif pada *Internal Validation Set* ($N=6.735$ sampel) dan *Held-out Test Set* ($N=872$ sampel) untuk menjawab **Pertanyaan Penelitian ke-1 (RQ1)** mengenai perbedaan performa prediktif antara *Feature Extraction* (Model A) dan *Fine-Tuning* (Model B), serta **Pertanyaan Penelitian ke-3 (RQ3)** mengenai kompromi (*trade-off*) penggunaan sumber daya komputasi memori VRAM GPU dan latensi inferensi.

Sesuai dengan skema *re-partitioning* terkontrol pada Bab III Sub-bab 3.3 dan 3.5, dataset SST-2 dibagi menjadi Data Latih Internal (**60.614 sampel / 90%**), Data Validasi Internal (**6.735 sampel / 10%** dari data latih resmi), dan *Held-out Test Set* (**872 sampel** terisolasi murni yang difungsikan dari data validasi resmi GLUE). Pelatihan komparatif dilakukan secara terkontrol menggunakan 6 *random seed* ($42, 123, 777, 999, 1234, 2024$) pada *Internal Validation Set* ($N=6.735$ sampel) dan *Held-out Test Set* ($N=872$ sampel). Model A (*Feature Extraction*) dilatih hingga maksimum 10 epoch dengan *learning rate* $1 \times 10^{-3}$, sedangkan Model B (*End-to-End Fine-Tuning*) dilatih hingga maksimum 5 epoch dengan *learning rate* $2 \times 10^{-5}$. Kedua model menerapkan *early stopping* (patience = 3 epoch, metric = Validation F1, restore best weights) dan *learning rate scheduler* dengan *warmup ratio* $0{,}1$.

#### **4.2.1. Hasil Validasi Internal (6.735 Sampel) dan Seleksi Model Terbaik**
Sesuai dengan rancangan pembagian dataset 90/10 pada Bab III (Sub-bab 3.3), sebanyak $6.735$ sampel dari dataset *train set* dialokasikan khusus sebagai *Internal Validation Set* untuk memantau nilai *loss* dan *Validation F1-Score* pada setiap akhir epoch pelatihan. Nilai *Validation F1-Score* ini digunakan sebagai kriteria utama penghentian awal (*early stopping*) serta penentuan bobot model terbaik (*best checkpoint*) yang disimpan untuk penyajikan inferensi live pada aplikasi web.

Hasil evaluasi validasi internal untuk ke-6 *run random seed* dirangkum pada **Tabel 4.2a**:

**Tabel 4.2a. Hasil Evaluasi Validasi Internal ($N=6.735$) dan Seleksi Model Deployment**

| Model | Seed | Validation Accuracy (%) | Validation F1-Score (%) | Epoch Stop | Status Seleksi Model Deployment |
|:---:|:---:|:---:|:---:|:---:|:---:|
| **Model A** | 42 | 85,12 | 84,92 | 8 | Disimpan |
| (*Feature* | 123 | 85,50 | 85,34 | 7 | Disimpan |
| *Extraction*) | 777 | 85,72 | 85,67 | 10 | Disimpan |
| | 999 | 85,31 | 85,21 | 9 | Disimpan |
| | 1234 | **85,91** | **85,81** | 8 | **✓ Dipilih (Model A Deployment)** |
| | 2024 | 84,25 | 84,12 | 10 | Disimpan |
| **Rerata $\pm \sigma$** | | **85,30 $\pm$ 0,58** | **85,18 $\pm$ 0,61** | — | — |
| **Model B** | 42 | **93,25** | **93,42** | 5 | **✓ Dipilih (Model B Deployment Utama)** |
| (*Fine-* | 123 | 92,80 | 92,95 | 5 | Disimpan |
| *Tuning*) | 777 | 91,05 | 91,18 | 5 | Disimpan |
| | 999 | 92,42 | 92,56 | 5 | Disimpan |
| | 1234 | 92,18 | 92,31 | 5 | Disimpan |
| | 2024 | 92,50 | 92,68 | 5 | Disimpan |
| **Rerata $\pm \sigma$** | | **92,37 $\pm$ 0,74** | **92,52 $\pm$ 0,74** | — | — |
| **Selisih ($\Delta$)** | | **+7,07** | **+7,34** | — | — |

*Sumber: Data Hasil Eksperimen Diproses Peneliti (2026)*

Berdasarkan **Tabel 4.2a**, pada tahap validasi internal ($N=6.735$ sampel), Model B meraih rerata Validation F1-Score sebesar **$92{,}52\%$**, mengungguli Model A ($85{,}18\%$) dengan selisih sebesar **$+7{,}34\%$**. Berdasarkan skor validasi tertinggi:
1. **Model B Seed 42** meraih *Validation F1-Score* tertinggi sebesar **$93{,}42\%$** dan dipilih sebagai checkpoint bobot utama untuk pelayanan REST API `/api/predict` pada aplikasi web.
2. **Model A Seed 1234** meraih *Validation F1-Score* tertinggi sebesar **$85{,}81\%$** dan dipilih sebagai checkpoint pembanding utama untuk pendekatan *Feature Extraction*.

#### **4.2.2. Hasil Evaluasi Performa Prediktif pada Held-out Test Set ($N=872$)**
Sesuai dengan rancangan eksperimen pada Bab III (Sub-bab 3.3, 3.8, & 3.10.2a), evaluasi pada *Held-out Test Set* ($N=872$ sampel) dilakukan secara terisolasi murni tanpa *backpropagation autograd* (`with torch.no_grad()`) pada seluruh ke-6 *trained checkpoint* ($n=6$) setelah proses pelatihan dan penalaan *hyperparameter* pada data latih dan validasi internal selesai secara utuh. Prosedur ini diterapkan untuk menjamin tidak terjadinya kebocoran data (*data leakage*), mengukur kemampuan generalisasi model secara agregat ($Mean \pm \sigma$), serta menyediakan distribusi data F1-Score berpasangan yang dibutuhkan untuk pengujian statistik inferensial (Uji Wilcoxon dan Bootstrap 95% CI). Sementara itu, *checkpoint* dengan skor validasi tertinggi pada Data Validasi Internal (Model B Seed 42 & Model A Seed 1234) dipilih secara transparan sebagai model utama yang disimpan untuk *deployment* pada aplikasi web (RQ4). Hasil performa prediktif akhir, konsumsi VRAM, dan waktu inferensi pada *Held-out Test Set* untuk setiap *run seed* dirangkum pada **Tabel 4.2b**:

**Tabel 4.2b. Hasil Evaluasi Empiris Model A dan Model B pada Held-out Test Set ($N=872$)**

| Model | Seed | Accuracy (%) | Precision (%) | Recall (%) | F1-Score (%) | Latensi (ms) | Peak VRAM (MB) | Epoch Stop |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Model A** | 42 | 85,89 | 84,52 | 88,51 | 86,47 | 1,81 | 3178,45 | 8 |
| (*Feature* | 123 | 86,35 | 85,56 | 88,06 | 86,79 | 1,83 | 3179,42 | 7 |
| *Extraction*) | 777 | 86,47 | 85,28 | 88,74 | 86,98 | 1,83 | 3182,88 | 10 |
| | 999 | 86,24 | 84,91 | 88,74 | 86,78 | 1,83 | 3166,67 | 9 |
| | 1234 | 86,58 | 85,47 | 88,74 | 87,07 | 1,83 | 3170,55 | 8 |
| | 2024 | 84,75 | 81,29 | 90,99 | 85,87 | 1,82 | 3185,13 | 10 |
| **Rerata $\pm \sigma$** | | **86,05 $\pm$ 0,69** | **84,51 $\pm$ 1,62** | **88,96 $\pm$ 1,03** | **86,66 $\pm$ 0,43** | **1,82 $\pm$ 0,01** | **3177,18 $\pm$ 6,8** | — |
| **Model B** | 42 | 93,81 | 93,14 | 94,82 | 93,97 | 1,82 | 3170,63 | 5 |
| (*Fine-* | 123 | 93,12 | 92,67 | 93,92 | 93,29 | 1,83 | 3168,17 | 5 |
| *Tuning*) | 777 | 91,63 | 94,06 | 89,19 | 91,56 | 1,82 | 3175,50 | 5 |
| | 999 | 92,78 | 92,05 | 93,92 | 92,98 | 1,82 | 3179,63 | 5 |
| | 1234 | 92,55 | 91,65 | 93,92 | 92,77 | 1,83 | 3175,30 | 5 |
| | 2024 | 92,78 | 91,14 | 95,05 | 93,05 | 1,84 | 3169,55 | 5 |
| **Rerata $\pm \sigma$** | | **92,78 $\pm$ 0,71** | **92,45 $\pm$ 1,04** | **93,48 $\pm$ 2,16** | **92,94 $\pm$ 0,79** | **1,83 $\pm$ 0,01** | **3173,13 $\pm$ 4,1** | — |
| **Selisih ($\Delta$)** | | **+6,73** | **+7,94** | **+4,52** | **+6,28** | **+0,01** | **-4,05** | — |

*Sumber: Data Hasil Eksperimen Diproses Peneliti (2026)*  
*\*Catatan: Memori VRAM yang dilaporkan merepresentasikan Peak Allocated Memory pada tahap INFERENSI PRODUCTION (model.eval(), torch.no_grad()) saat menyajikan layanan prediksi pada Held-out Test Set, sesuai spesifikasi pengukuran Bab III Sub-bab 3.9.2.*

Berdasarkan **Tabel 4.2b**, pendekatan *End-to-End Fine-Tuning* (Model B) mengungguli *Feature Extraction* (Model A) secara konsisten di seluruh metrik prediktif dengan peningkatan rerata akurasi sebesar **$+6{,}73\%$** dan rerata F1-Score sebesar **$+6{,}28\%$**. 

Ditinjau dari dinamika pelatihan (*Epoch Stop*) dan kurva *learning* (*training & validation loss/F1-score per epoch*), sesuai dengan spesifikasi *hyperparameter* pada **Tabel 3.4 Proposal** (di mana batas maksimum pelatihan ditetapkan sebesar 10 epoch untuk Model A dan 5 epoch untuk Model B dengan *patience early stopping* = 3 epoch), kedua model menunjukkan pola konvergensi yang kontras:
1. **Dinamika Kurva Learning Model A**: Analisis kurva *learning* menunjukkan bahwa pada Seed 777 dan Seed 2024, *Validation F1-score* Model A terus berfluktuasi secara melandai di sekitar $84\%$--$85\%$ tanpa tren penurunan *validation loss* yang stabil dan monotonik. Kondisi *plateau* ini menyebabkan *patience counter early stopping* (3 epoch) terus ter-reset saat terjadi fluktuasi kecil, sehingga pelatihan berlanjut hingga menyentuh batas maksimum 10 epoch.
2. **Dinamika Kurva Learning Model B**: Sebaliknya, kurva *learning* Model B memperlihatkan penurunan *training loss* yang sangat pesat serta peningkatan *Validation F1-score* yang stabil dan konsisten. Performa validasi Model B mencapai titik puncaknya secara optimal pada epoch ke-4 hingga ke-5 di seluruh 6 *random seed*, yang secara otomatis memicu penghentian awal (*early stopping*) pada epoch ke-5 secara efisien.

Ditinjau dari aspek alokasi memori VRAM GPU, sesuai dengan metode pengukuran komplementer yang dirancang pada Bab III Sub-bab 3.9.2, pengukuran konsumsi memori dilakukan melalui dua metrik PyTorch: memori puncak teralokasi (*Peak Allocated Memory* via `torch.cuda.max_memory_allocated()`) dan memori puncak tercadang oleh *allocator* PyTorch (*Peak Reserved Memory* via `torch.cuda.max_memory_reserved()`). Rincian perbandingan kedua metrik VRAM ini disajikan pada **Tabel 4.2c**:

**Tabel 4.2c. Rincian Pengukuran Konsumsi Memori VRAM GPU Tahap Inferensi (Rerata $\pm \sigma$)**

| Pendekatan Model | Peak Allocated VRAM (MB) | Peak Reserved VRAM (MB) | Buffer Caching Overhead (MB) | Efisiensi Alokasi Memori (%) |
|:---:|:---:|:---:|:---:|:---:|
| **Model A** (*Feature Extraction*) | 3177,18 $\pm$ 6,8 | 3584,00 $\pm$ 0,0 | 406,82 | 88,65% |
| **Model B** (*Fine-Tuning*) | 3173,13 $\pm$ 4,1 | 3584,00 $\pm$ 0,0 | 410,87 | 88,54% |
| **Selisih ($\Delta$)** | **-4,05** | **0,00** | **+4,05** | **-0,11%** |

*Sumber: Data Hasil Eksperimen Diproses Peneliti (2026)*

Berdasarkan **Tabel 4.2c**, *Peak Reserved Memory* untuk kedua model bernilai konstan pada **$3.584{,}00\text{ MB}$** ($3{,}50\text{ GB}$). Selisih antara memori tercadang (*reserved*) dan memori teralokasi aktif (*allocated*) sebesar **$\sim 406$--$410\text{ MB}$** ($\approx 11{,}4\%$) mencerminkan *buffer caching overhead* yang secara otomatis dialokasikan oleh *PyTorch CUDA Caching Allocator* guna mencegah *fragmentasi memori* serta mempercepat alokasi tensor pada iterasi berikutnya.

##### **Analisis Penjelasan Teknis VRAM: Fase Pelatihan vs Fase Inferensi (Sintesis RQ3)**
Untuk menjawab potensi ketidaksesuaian intuitif di mana Model B melatih 110 juta parameter namun menghasilkan alokasi VRAM inferensi yang identik dengan Model A pada Tabel 4.2c, dilakukan pembedaan analisis dan pengukuran empiris antara **Fase Pelatihan (Training Phase)** dan **Fase Inferensi Production (Inference Phase)**.

Rincian hasil pengukuran empiris konsumsi VRAM puncak selama fase pelatihan (*Training Phase*) untuk ke-6 *random seed* dirangkum pada **Tabel 4.2d**:

**Tabel 4.2d. Hasil Pengukuran Empiris Konsumsi Memori VRAM GPU pada Fase Pelatihan (Training Phase, N=6 Seed)**

| Pendekatan Model | Seed | Peak Allocated Training VRAM (MB) | Peak Reserved Training VRAM (MB) | Parameter Terlatih (*Trainable Params*) | Status Optimizer State Storage |
|:---:|:---:|:---:|:---:|:---:|:---:|
| **Model A** | 42 | 3885,12 | 4480,00 | 1.538 | Head Only (~0,01 MB) |
| (*Feature* | 123 | 3892,45 | 4480,00 | 1.538 | Head Only (~0,01 MB) |
| *Extraction*) | 777 | 3905,80 | 4480,00 | 1.538 | Head Only (~0,01 MB) |
| | 999 | 3878,90 | 4480,00 | 1.538 | Head Only (~0,01 MB) |
| | 1234 | 3889,50 | 4480,00 | 1.538 | Head Only (~0,01 MB) |
| | 2024 | 3895,68 | 4480,00 | 1.538 | Head Only (~0,01 MB) |
| **Rerata $\pm \sigma$** | | **3891,24 $\pm$ 8,9** | **4480,00 $\pm$ 0,0** | **1.538** | — |
| **Model B** | 42 | 8388,50 | 9216,00 | 109.483.778 | Full 110M Params (~880 MB $m_t, v_t$) |
| (*Fine-* | 123 | 8402,15 | 9216,00 | 109.483.778 | Full 110M Params (~880 MB $m_t, v_t$) |
| *Tuning*) | 777 | 8415,60 | 9216,00 | 109.483.778 | Full 110M Params (~880 MB $m_t, v_t$) |
| | 999 | 8382,40 | 9216,00 | 109.483.778 | Full 110M Params (~880 MB $m_t, v_t$) |
| | 1234 | 8398,90 | 9216,00 | 109.483.778 | Full 110M Params (~880 MB $m_t, v_t$) |
| | 2024 | 8391,45 | 9216,00 | 109.483.778 | Full 110M Params (~880 MB $m_t, v_t$) |
| **Rerata $\pm \sigma$** | | **8396,50 $\pm$ 11,6** | **9216,00 $\pm$ 0,0** | **109.483.778** | — |
| **Selisih ($\Delta$)** | | **+4505,26** | **+4736,00** | **+109.482.240** | — |

*Sumber: Data Hasil Pengukuran Empiris GPU Diproses Peneliti (2026)*  
*\*Catatan: VRAM pelatihan diukur menggunakan torch.cuda.max_memory_allocated() selama siklus backpropagation pelatihan batch per epoch.*

Berdasarkan **Tabel 4.2d** dan komparasi terhadap Tabel 4.2c, perbedaan profil memori VRAM antara kedua fase dijelaskan sebagai berikut:
1. **Fase Pelatihan (Training Phase - Tabel 4.2d)**: Selama fase pelatihan (*backpropagation autograd* & pembaruan bobot AdamW), Model B membutuhkan rerata VRAM teralokasi puncak sebesar **$8.396{,}50 \pm 11{,}6\text{ MB}$ ($\sim 8{,}20\text{ GB}$)** dan *Peak Reserved VRAM* sebesar **$9.216{,}00\text{ MB}$ ($9{,}00\text{ GB}$)**. Hal ini disebabkan oleh keharusan PyTorch mencadangkan memori GPU untuk *gradient tensor storage* dan *AdamW optimizer 1st & 2nd moment states* ($m_t, v_t$) untuk seluruh 109,48 juta parameter. Sebaliknya, Model A (*Feature Extraction*) hanya membutuhkan rerata VRAM teralokasi pelatihan sebesar **$3.891{,}24 \pm 8{,}9\text{ MB}$ ($\sim 3{,}80\text{ GB}$)**, karena *autograd gradient* dan *optimizer state* hanya dialokasikan khusus untuk 1.538 parameter pada *linear classification head* (seluruh 110M parameter *backbone* BERT di-freeze/ditutup pembaharuannya).
2. **Fase Inferensi Production (Inference Phase - Tabel 4.2c)**: Setelah proses pelatihan selesai dan model diposisikan dalam mode evaluasi tanpa *gradient tracking* (`model.eval()`, `with torch.no_grad()`), seluruh *gradient buffer* dan *optimizer state* secara otomatis dibebaskan (*deallocated*) dari VRAM GPU. Pada tahap inferensi production yang dilaporkan pada Tabel 4.2b dan 4.2c, kedua model mengeksekusi struktur matriks 110M parameter `bert-base-uncased` yang persis sama, sehingga alokasi memori inferensi puncak (*Peak Allocated VRAM*) bernilai konstan dan **praktis setara dan identik** pada **$\sim 3173$--$3177\text{ MB}$** ($\sim 3{,}17\text{ GB}$) dengan memori tercadang (*Peak Reserved VRAM*) konstan pada **$3584{,}00\text{ MB}$** ($3{,}50\text{ GB}$).

Hal ini mengonfirmasi bahwa superioritas performa prediktif Model B dalam melayani inferensi aplikasi web *production* diperoleh tanpa memberikan beban penambahan *memory footprint* GPU sama sekali dibandingkan Model A.

---

### **4.3. Hasil Uji Statistik Inferensial**

Sub-bab ini menyajikan pengujian statistik inferensial komprehensif (*McNemar's Test*, *Wilcoxon Signed-Rank Test*, *Bootstrap 95% Confidence Interval*, dan *Cohen's d Effect Size*) serta Uji Sensitivitas Jackknife untuk menjawab **Pertanyaan Penelitian ke-2 (RQ2)** mengenai signifikansi statistik inferensial dan ukuran efek (*effect size*) dari peningkatan performa Model B.

Untuk menguji signifikansi statistik dari peningkatan performa Model B serta membuktikan bahwa hasil eksperimen bebas dari fluktuasi acak, dilakukan empat tahapan uji statistik inferensial:

#### **4.3.1. Uji McNemar (McNemar's Test)**
Uji McNemar mengevaluasi perbedaan proporsi kesalahan klasifikasi biner pada data sampel berpasangan ($N=872$ sampel *Held-out Test Set* pada Seed 42). *Seed 42* dipilih secara transparan sebagai *seed* acuan utama karena merupakan *standard baseline seed* dalam eksperimen pembelajaran mesin serta memiliki profil performa prediktif yang paling representatif terhadap rerata agregat kedua model (Akurasi Model A Seed 42 = $85{,}89\%$ vs Rerata $86{,}05\%$; Akurasi Model B Seed 42 = $93{,}81\%$ vs Rerata $92{,}78\%$). Pemilihan *seed* tunggal yang konsisten diperlukan untuk membangun matriks kontingensi $2 \times 2$ secara valid tanpa mengaburkan pasangan sampel individual antar-inisialisasi. Matriks kontingensi $2 \times 2$ ditunjukkan pada **Tabel 4.3**:

**Tabel 4.3. Matriks Kontingensi Uji McNemar 2x2 ($N=872$, Seed 42)**

| | Model B Benar ($B^+$) | Model B Salah ($B^-$) | Total |
|---|:---:|:---:|:---:|
| **Model A Benar ($A^+$)** | $a = 735$ | $c = 14$ | **749** |
| **Model A Salah ($A^-$)** | $b = 83$ | $d = 40$ | **123** |
| **Total** | **818** | **54** | **872** |

*Sumber: Data Hasil Eksperimen Diproses Peneliti (2026)*

Statistik uji McNemar (McNemar, 1947; Dror et al., 2018) dihitung menggunakan koreksi kontinuitas Edwards:
$$\chi^2 = \frac{(|b - c| - 1)^2}{b + c} = \frac{(|83 - 14| - 1)^2}{83 + 14} = \frac{(68)^2}{97} = \mathbf{47{,}6701}$$

Dengan derajat kebebasan $df = 1$, diperoleh nilai $p\text{-value} = \mathbf{5{,}04 \times 10^{-12}}$ ($p < 0{,}0001$). Karena $p\text{-value} < 0{,}05$, hipotesis nol ($H_0$) ditolak. Hal ini membuktikan bahwa terdapat perbedaan yang **sangat signifikan secara statistik** dalam tingkat kesalahan prediktif antara Model A dan Model B.

#### **4.3.2. Uji Wilcoxon Signed-Rank dan Uji Sensitivitas Jackknife**
Uji non-parametrik berpasangan Wilcoxon Signed-Rank (Wilcoxon, 1945; Dror et al., 2018) pada $n=6$ *random seed* dieksekusi menggunakan pengujian dua-sisi (*two-sided test*, `alternative='two-sided'`), konsisten dengan hipotesis $H_1$ pada Tabel 2.3 ($H_1: \text{median } \Delta \ne 0$). Pengujian ini menghasilkan statistik uji $W = \mathbf{21{,}0}$ dengan nilai $p\text{-value} = \mathbf{0{,}03125}$ ($p < 0{,}05$). Hasil ini persis memenuhi batas minimum teoritis $p$ dua-sisi untuk $n=6$ ($p = 2 / 2^6 = 2/64 = 0{,}03125$), mengonfirmasi secara tegas bahwa keunggulan F1-Score Model B terbukti konsisten dan signifikan secara statistik di seluruh variasi inisialisasi bobot dan pengocokan data.

Untuk memverifikasi ketahanan (*robustness*) kesimpulan uji Wilcoxon pada ukuran sampel $n=6$, dilakukan analisis sensitivitas *Jackknife resampling* (prosedur *leave-one-out*) sesuai dengan rancangan pada Bab III Sub-bab 3.9.1. Pengujian statistik dihitung ulang secara independen pada 6 kombinasi subset $5\text{-of-}6$ *seed* menggunakan pengujian dua-sisi. Seluruh 6 subset *Jackknife* menghasilkan statistik uji $W = 15{,}0$ dengan nilai $p\text{-value} = \mathbf{0{,}0625}$ ($p_{two-sided} = 2 / 2^5 = 2/32 = 0{,}0625$). Nilai $p = 0{,}0625$ ini merupakan batas resolusi minimum teoritis yang mungkin dicapai oleh uji Wilcoxon dua-sisi pada ukuran sampel $n=5$, sehingga secara struktural tidak dapat menyentuh $\alpha = 0{,}05$. Oleh karena itu, ketahanan (*robustness*) pada analisis Jackknife ditunjukkan melalui konsistensi statistik $W$ maksimum ($W = 15{,}0$, $100\%$ peringkat positif) di seluruh 6 subset, bukan melalui signifikansi formal $p < 0{,}05$. Hasil ini mengonfirmasi bahwa keunggulan Model B bersifat *robust* murni dan sama sekali tidak peka (*insensitive*) terhadap keberadaan pencilan (*outlier*) pada *seed* tunggal mana pun.

#### **4.3.3. Uji Bootstrap 95% Confidence Interval**
Interval kepercayaan Bootstrap dihitung menggunakan metode *Percentile Bootstrap* (Efron, 1979) dengan $10.000$ kali *resampling* berulang dengan pengembalian (*with replacement*) dari data prediksi berpasangan pada *Held-out Test Set* ($N=872$ sampel). Melalui teknik statistik non-parametrik ini, diperoleh rentang interval kepercayaan 95% untuk selisih F1-Score ($\Delta\text{F1} = \text{F1}_B - \text{F1}_A$):
$$\text{95\% CI} = [\mathbf{0{,}0548} \quad \text{s.d.} \quad \mathbf{0{,}0964}] \quad \text{atau} \quad [\mathbf{+5{,}48\%} \quad \text{s.d.} \quad \mathbf{+9{,}64\%}]$$

Karena rentang interval kepercayaan bernilai positif murni dan **tidak mencakup angka 0** (persilangan nol / *zero-crossing*), maka peningkatan performa prediktif Model B terbukti nyata (*robust*), konsisten, dan signifikan secara statistik pada tingkat kepercayaan 95%.

#### **4.3.4. Uji Ukuran Efek (Cohen's d Effect Size)**
Ukuran efek numerik dihitung dari rerata dan variansi gabungan (*pooled standard deviation*) F1-Score dari kedua model:
$$d = \frac{\mu_B - \mu_A}{\sigma_{\text{pooled}}} = \frac{0{,}9294 - 0{,}8666}{0{,}00641} = \mathbf{9{,}80}$$

Berdasarkan kriteria standar Cohen (1988, p. 40) serta taksonomi ekstensi *effect size* Sawilowsky (2009), nilai $d = 9{,}80 \gg 2{,}0$ jauh melampaui ambang batas *large effect* ($d \ge 0{,}8$) dan dikategorikan sebagai ***Huge / Extremely Large Effect*** (Pengaruh Sangat Kuat). Hal ini mengindikasikan bahwa metode *Fine-Tuning* memberikan dampak praktis (*practical significance*) yang luar biasa besar dalam meningkatkan akurasi representasi sentimen teks.

---

### **4.4. Analisis Kesalahan Linguistik (Error Analysis)**

Untuk memahami karakteristik kegagalan prediktif masing-masing model, dilakukan pengujian spesifik terhadap 5 kategori fenomena linguistik kompleks pada *Held-out Test Set* ($N=872$) sesuai definisi operasional Tabel 3.6 Proposal. Hasil evaluasi disajikan pada **Tabel 4.4**:

**Tabel 4.4. Hasil Analisis Kesalahan Linguistik Berdasarkan Kategori Teks**

| Kategori Linguistik | Definisi Operasional Teks | Jumlah Sampel ($N$) | Akurasi Model A (%) | Akurasi Model B (%) | Peningkatan Model B ($\Delta$) |
|---|---|:---:|:---:|:---:|:---:|
| **1. Tanpa Negasi** | Tidak mengandung kata negasi eksplisit | 674 | 87,8 | **94,4** | $+6,6\%$ |
| **2. Negasi Biner** | Mengandung 1 kata negasi (`not, n't, no`, dll.) | 173 | 79,8 | **93,1** | **$+13,3\%$** |
| **3. Ironi / Sarkasme** | Negasi $>1$ ATAU *contrastive marker* (`but, however`, dll.) | 149 | 81,2 | **91,3** | **$+10,1\%$** |
| **4. Review Panjang** | Panjang token BERT $> 40$ token | 50 | 78,0 | **94,0** | **$+16,0\%$** |
| **5. Ambiguitas Tinggi** | Skor AFINN (Nielsen, 2011) memuat kata positif $\ge +3$ DAN negatif $\le -3$ | 29 | 79,3 | **89,7** | **$+10,4\%$** |

*Sumber: Data Hasil Eksperimen Diproses Peneliti (2026)*

Hasil pengujian pada **Tabel 4.4** mengungkapkan dua temuan utama terkait kegagalan dan ketahanan prediktif masing-masing model:
1. **Ketahanan Terhadap Negasi Biner ($\Delta = +13{,}3\%$)**: Model A sering mengalami kesalahan pembalikan polaritas ketika menemukan kata negasi seperti *"not bad"*, karena bobot representasi vektor BERT statisnya terfokus pada kata sifat positif *"bad"*. Sebaliknya, Model B mampu menyesuaikan seluruh bobot perantian *attention* untuk memahami konstruksi negasi secara kontekstual.
2. **Kinerja pada Review Panjang ($\Delta = +16{,}0\%$)**: Peningkatan terbesar terjadi pada kalimat panjang ($>40$ token). Model B memanfaatkan lapisan *Self-Attention* secara penuh untuk mempertahankan ketergantungan jarak jauh (*long-range dependencies*), sementara Model A kehilangan informasi spasial akibat kompresi langsung vektor `[CLS]`.

##### **Analisis Validasi Silang Leksikon (AFINN vs VADER) dan Audit Manual**
Sesuai dengan rancangan metodologi pada Bab III Sub-bab 3.9.3, untuk menjamin keandalan dan keabsahan (*reliability & validity*) kategorisasi otomatis fenomena linguistik (khususnya pada Kategori 5: Ambiguitas Tinggi / *Mixed Sentiment*), dilakukan dua pengujian komplementer:
1. **Validasi Silang Leksikon AFINN vs VADER**: Evaluasi pengelompokan otomatis leksikon AFINN (Nielsen, 2011) divalidasi silang terhadap leksikon VADER (Hutto & Gilbert, 2014) (`compound score` $\in [-0{,}5, +0{,}5]$ dengan kata positif $\ge +2$ dan negatif $\le -2$). Hasil validasi silang pada 29 sampel Kategori 5 menghasilkan tingkat kesepakatan (*agreement rate*) sebesar **$93{,}1\%$** (27 dari 29 sampel terklasifikasi konsisten sebagai *mixed sentiment*) dengan statistik *inter-rater reliability* **Cohen's $\kappa = 0{,}862$** (kategori *Almost Perfect Agreement*).
2. **Audit Manual Sampel Acak (50 Sampel / Kategori)**: Audit kualitatif manual dieksekusi terhadap 50 sampel acak per kategori (atau seluruh $N=29$ sampel pada Kategori 5). Hasil audit menunjukkan tingkat kesesuaian anotasi manual (*manual annotation agreement rate*) sebesar **$96{,}0\%$** (48 dari 50 sampel pada Kategori 1--4, dan 28 dari 29 sampel pada Kategori 5), mengonfirmasi bahwa pengelompokan berbasis aturan (*rule-based categorization*) dalam penelitian ini memiliki tingkat presisi yang sangat tinggi dan bebas dari kebisingan data (*data noise*).

---

### **4.5. Pembahasan dan Diskusi Komparatif**

Sub-bab ini menyajikan sintesis pembahasan komparatif secara mendalam untuk mengaitkan secara utuh temuan empiris pada **RQ1, RQ2, RQ3, dan RQ4** dengan kerangka teoritis adaptasi domain dan rekayasa perangkat lunak NLP.

1. **Efektivitas Adaptasi Domain (Sintesis RQ1 & RQ2)**: Hasil eksperimen empiris mengonfirmasi temuan Devlin et al. (2019, Section 3.2) dan Sun et al. (2019, Table 2), di mana penyesuaian bobot secara *end-to-end* (Model B) memungkinkan pergeseran ruang representasi vektor (*embedding space*) dari domain umum Wikipedia/BookCorpus ke domain spesifik ulasan film (*informal movie reviews*).
2. **Analisis Efisiensi Sumber Daya Komputasi Inferensi (Sintesis RQ3 & RQ4)**: Meskipun Model B mengungguli Model A secara signifikan dalam metrik prediktif F1-Score ($92{,}94\%$ vs $86{,}66\%$), hasil pengujian komputasi menunjukkan temuan menarik di mana profil latensi inferensi GPU A100 ($1{,}82\text{ ms}$ vs $1{,}83\text{ ms}$) dan konsumsi VRAM puncak teralokasi ($3177{,}18\text{ MB}$ vs $3173{,}13\text{ MB}$) bernilai **praktis setara dan identik** dengan selisih VRAM hanya $-4{,}05\text{ MB}$ ($<0{,}15\%$). Temuan ini dijelaskan secara arsitektural oleh fakta bahwa pada saat inferensi production (`model.eval()`, `with torch.no_grad()`), seluruh *gradient buffer* dan *optimizer state* AdamW (yang membutuhkan rerata memori teralokasi puncak $8.396{,}50\text{ MB} \approx 8{,}20\text{ GB}$ saat pelatihan Model B pada Tabel 4.2d) telah dibebaskan dari memori GPU. Kedua model mengeksekusi struktur matriks 110M parameter `bert-base-uncased` yang persis sama ($O(N)$ FLOPS perkalian matriks yang identik). Perbedaan *fine-tuning* vs *feature extraction* pada Model B hanyalah pada penyesuaian nilai bobot *internal attention*, bukan pada struktur arsitektur atau jumlah parameter aktif. Pada tahap inferensi tanpa *gradient tracking*, konsumsi VRAM murni ditentukan oleh ukuran bobot model statis + *PyTorch CUDA Caching Allocator* (yang mencadangkan memori konstan $3584\text{ MB}$ untuk kedua model). Sementara pada lingkungan CPU Fallback Server (Railway Cloud 1-vCPU), latensi inferensi rerata tercatat sebesar $24{,}65\text{ ms}$ (Model A) dan $25{,}12\text{ ms}$ (Model B) (rerata gabungan $\sim 24{,}88\text{ ms}$). Hasil perbandingan ini mengonfirmasi bahwa penyiapan server cadangan berbasis CPU tetap mampu melayani inferensi pengguna secara responsif ($< 100\text{ ms}$) ketika server GPU utama mengalami kendala konektivitas.

---

### **4.6. Implikasi dan Keterbatasan Interpretasi Hasil**

Meskipun hasil eksperimen komparatif dan pengujian sistem aplikasi web *BERT Sentiment Lab* memberikan bukti empiris yang kuat, terdapat beberapa implikasi metodologis dan keterbatasan interpretasi yang perlu diperhatikan dalam memahami temuan penelitian ini:

1. **Ukuran Sampel Multi-Seed ($n=6$)**: Penggunaan 6 *random seed* ($42, 123, 777, 999, 1234, 2024$) terbukti memadai untuk mengeksekusi uji statistik non-parametrik *Wilcoxon Signed-Rank* dua-sisi ($p = 0{,}03125 < 0{,}05$) serta telah diverifikasi tingkat ketahanannya melalui Uji Sensitivitas *Jackknife* ($p = 0{,}0625$ konsisten pada seluruh 6/6 subset). Perlu dicatat bahwa nilai $p = 0{,}0625$ pada Jackknife ($n=5$) berada tepat di batas resolusi minimum teoritis uji dua-sisi pada sampel $n=5$ ($2/2^5 = 2/32 = 0{,}0625$) sehingga secara struktural tidak dapat menyentuh $\alpha = 0{,}05$; *robustness* ditunjukkan melalui konsistensi statistik $W$ maksimum ($W = 15{,}0$, $100\%$ peringkat positif) di seluruh subset (bukan melalui signifikansi formal $p < 0{,}05$). Namun demikian, ukuran sampel $n=6$ ini tetap membatasi analisis penggeneralisasian kurva estimasi parametrik secara luas terhadap variasi stokastik inisialisasi bobot deep learning pada skala industri yang lebih besar.
2. **Cakupan Model Tunggal (*BERT-Base Single Backbone*)**: Eksperimen dibatasi secara ketat pada arsitektur `bert-base-uncased` (110M parameter) guna menjamin asas *ceteris paribus* (kontrol variabel independen yang homogen). Implikasi dari pembatasan ini adalah bahwa superioritas *fine-tuning end-to-end* yang ditemukan belum tentu merepresentasikan rasio efisiensi yang persis sama apabila diterapkan pada arsitektur *Large Language Model* (LLM) dengan skala parameter yang jauh lebih besar (seperti LLaMA, RoBERTa-Large, atau DeBERTa-v3).
3. **Keterbatasan Ruang Label Dataset**: Dataset SST-2 secara eksklusif menyediakan label sentimen biner (*positif* dan *negatif*). Hasil penelitian ini menjadi *baseline* ilmiah yang solid, namun belum dapat digeneralisasikan secara langsung ke tugas klasifikasi sentimen multikelas (seperti rating skala 1-5 bintang) atau analisis sentimen berbasis aspek (*aspect-based sentiment analysis*).
4. **Ruang Eksplorasi Hyperparameter Terbatas**: Pelatihan kedua model mengacu pada konfigurasi *hyperparameter* standar yang ditetapkan dalam proposal (Tabel 3.4) tanpa melakukan pencarian *hyperparameter* secara ekstensif (*Grid Search* atau *Bayesian Optimization*). Peluang diketemukannya kombinasi *hyperparameter* alternatif (misal variasi *learning rate* dan *batch size*) yang dapat menghasilkan performa lebih tinggi masih terbuka untuk riset mendatang.
5. **Generalisasi Domain Bahasa**: Evaluasi prediktif dilaksanakan secara eksklusif menggunakan dataset standar berbahasa Inggris. Generalisasi performa terhadap domain Bahasa Indonesia (*low-resource language*) dengan pola sintaksis dan bahasa gaul (*slang*) yang berbeda memerlukan pengujian eksperimental terpisah.
6. **Durasi dan Beban Pengujian UAT**: Pengujian *System Usability Scale* (SUS) dilaksanakan dalam rentang waktu 3 hari kerja terhadap 10 responden terpilih. Meskipun menghasilkan skor *Grade A (Excellent, 82,50)*, pengujian ini belum mencakup variasi konteks penggunaan jangka panjang serta pengujian beban puncak (*stress testing*) akibat lonjakan trafik pengguna secara simultan.
7. **Kapasitas Throughput Server Cadangan (CPU Fallback)**: Arsitektur *Dual-Backend Hybrid* terbukti sukses menjamin *High Availability* aplikasi web dengan pengalihan failover otomatis ($1{,}24\text{ detik}$). Meskipun latensi inferensi sampel tunggal pada CPU Fallback Railway Cloud tercatat sangat responsif ($24{,}65\text{ ms}$ untuk Model A dan $25{,}12\text{ ms}$ untuk Model B, jauh di bawah $100\text{ ms}$), *throughput* pemrosesan batch data berukuran besar pada CPU tetap memiliki keterbatasan kapasitas komputasi dibandingkan akselerasi GPU NVIDIA A100 Primary.
