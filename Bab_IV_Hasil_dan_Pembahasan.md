# **BAB IV**  
# **HASIL DAN PEMBAHASAN**

---

### **4.1. Lingkungan Eksperimen dan Implementasi Sistem**

Sub-bab ini menyajikan deskripsi lingkungan komputasi, arsitektur integrasi *Dual-Backend Hybrid*, implementasi modul antarmuka pengguna, serta hasil pengujian kelayakan sistem yang dikembangkan guna menjawab **Pertanyaan Penelitian ke-4 (RQ4)** mengenai perancangan dan pembangunan produk aplikasi web komparator sentimen real-time.

#### **4.1.1. Lingkungan Perangkat Keras dan Perangkat Lunak**
Pelaksanaan eksperimen komparatif dan pengujian inferensi aplikasi web memanfaatkan kombinasi lingkungan komputasi berkinerja tinggi (*High-Performance Computing*) serta infrastruktur *cloud deployment*. Eksperimen utama dieksekusi menggunakan akselerasi GPU NVIDIA A100 Tensor Core guna menjamin kestabilan *throughput* pelatihan multi-seed dan presisi pengukuran latensi inferensi. 

Spesifikasi lengkap perangkat keras dan perangkat lunak yang digunakan dalam penelitian ini disajikan pada **Tabel 4.1**:

**Tabel 4.1. Spesifikasi Lingkungan Eksperimen dan Implementasi Sistem**

| Komponen | Spesifikasi / Alat | Fungsi Utama |
|---|---|---|
| **GPU Accelerator** | NVIDIA A100 Tensor Core GPU | Akselerasi pelatihan multi-epoch & inferensi real-time |
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
1. **Primary Backend (GPU Server)**: Berjalan di Google Colab menggunakan GPU NVIDIA A100 Tensor Core yang dihubungkan melalui *Ngrok Static Tunnel* (`irritably-tipper-january.ngrok-free.dev`). Backend ini melayani inferensi real-time dengan latensi ultra-cepat ($\sim 1{,}82\text{ ms}$).
2. **Fallback Backend (CPU Server)**: Berjalan di Railway Cloud Service (1-vCPU Server) sebagai server cadangan otomatis jika runtime GPU Colab dalam keadaan non-aktif (*offline*), melayani inferensi dengan latensi rerata $24{,}65\text{ ms}$ (Model A) dan $25{,}12\text{ ms}$ (Model B) (rerata gabungan $\sim 24{,}88\text{ ms}$).
3. **PWA Offline Storage**: Menggunakan *service worker* `vite-plugin-pwa` untuk melakukan *precaching* 10 aset statis aplikasi web.

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
Modul Dashboard Analitik berfungsi menyajikan visualisasi data *benchmark* empiris 6 *seed*, *Radar Chart* 5 kategori linguistik, matriks kontingensi McNemar 2x2, serta *tooltip* akademik penjelas statistik inferensial. Akses ke modul analitik dilindungi oleh sistem otentikasi *Role-Based Access Control* (RBAC) dengan modal login bertema *glassmorphism* untuk membedakan peran Pengguna Publik (*Public*) dan Peneliti/Dosen (*Researcher/Admin*). Tampilan Dashboard Analitik ditunjukkan pada **Gambar 4.3**:

![Gambar 4.3 Dashboard Analitik Benchmark Komparatif](images/screenshot_analytics_dashboard.png)

**Gambar 4.3 Dashboard Analitik Benchmark Komparatif**  
*Sumber: Hasil Implementasi Antarmuka Aplikasi Web Peneliti (2026)*

##### **d. Fitur Theme Toggle Switcher**
Untuk meningkatkan kenyamanan pengguna, antarmuka dilengkapi *sliding switch pill* dua arah untuk berganti antara *Dark Mode* dan *Light Mode* yang telah memenuhi standar kontras WCAG 2.1 AA. Tampilan fitur *Theme Toggle* ditunjukkan pada **Gambar 4.4**:

![Gambar 4.4 Antarmuka Mode Terang (Light Mode) dan Theme Toggle](images/screenshot_theme_toggle.png)

**Gambar 4.4 Antarmuka Mode Terang (Light Mode) dan Theme Toggle**  
*Sumber: Hasil Implementasi Antarmuka Aplikasi Web Peneliti (2026)*

#### **4.1.4. Implementasi Fitur Tambahan (Stretch Goals)**
Selain pemenuhan seluruh fungsionalitas utama (*Minimum Viable Product* / MVP), pengembangan aplikasi web *BERT Sentiment Lab* berhasil mengimplementasikan lima fitur tambahan (*stretch goals*) yang dirancang pada Sub-bab 3.10.12 Bab III:
1. **Progressive Web App (PWA)**: Penggunaan *service worker* `vite-plugin-pwa` dengan *precaching* 10 aset statis produksi untuk mendukung akses *offline* serta instalasi sebagai aplikasi desktop/seluler *native*.
2. **Sistem Autentikasi dan Kontrol Akses (RBAC)**: Pembatasan akses *Role-Based Access Control* dengan modal login *glassmorphism* untuk membedakan peran Pengguna Publik (*Public*) dan Peneliti/Dosen (*Researcher/Admin*).
3. **Arsitektur Dual-Backend Hybrid dengan Automatic Failover**: Pengujian inferensi mencoba server GPU Colab Primary terlebih dahulu, dan secara otomatis melakukan *fallback* ke server CPU Railway jika server GPU non-aktif.
4. **Theme Toggle Switcher (Dark/Light Mode)**: Sakelar luncur kontras tinggi berstandar WCAG 2.1 AA dengan skema warna hangat Amber (Mode Terang) dan Indigo/Gold (Mode Gelap).
5. **Pencarian dan Manajemen Riwayat Prediksi**: Tabel riwayat prediksi interaktif dengan fitur pencarian teks (*searchable*), salin ke *clipboard*, hapus per-item, serta modal konfirmasi hapus seluruh riwayat.

Bukti keberhasilan implementasi Progressive Web App (PWA) beserta petunjuk instalasi aplikasi dan *Service Worker active status* ditunjukkan pada **Gambar 4.5**:

![Gambar 4.5 Antarmuka Prompt Instalasi Progressive Web App (PWA) dan Status Service Worker](images/screenshot_pwa_installation.png)

**Gambar 4.5 Antarmuka Prompt Instalasi Progressive Web App (PWA) dan Status Service Worker**  
*Sumber: Hasil Implementasi Antarmuka Aplikasi Web Peneliti (2026)*

#### **4.1.5. Hasil Pengujian Sistem Aplikasi Web**
Sesuai dengan rancangan evaluasi sistem pada Bab III Sub-bab 3.15, pengujian terhadap sistem aplikasi web *BERT Sentiment Lab* dilaksanakan secara bertingkat yang mencakup tiga domain pengujian utama: *Unit Testing* pada backend API, *Integration Testing & Failover*, serta *User Acceptance Testing* (UAT) menggunakan instrumen *System Usability Scale* (SUS).

Ringkasan hasil dari ketiga tingkatan pengujian sistem dirangkum pada **Tabel 4.1a**:

**Tabel 4.1a. Hasil Pengujian Sistem Aplikasi Web BERT Sentiment Lab**

| Jenis Pengujian | Metrik Evaluasi | Target / Ambang Batas | Hasil Pengujian | Status Kelayakan |
|:---|:---|:---:|:---:|:---:|
| **Unit Testing (Backend API)** | Code Coverage Line Rate | $\ge 70\%$ | **86,5%** (14/14 test cases pass) | **✅ Lulus** |
| **Integration Testing** | End-to-End API Flow Passing Rate | 100% Passing | **100%** (5/5 modul terintegrasi) | **✅ Lulus** |
| **Failover Testing (Backend)** | Waktu Alih GPU $\to$ CPU Failover | $< 5{,}0\text{ detik}$ | **1,24 detik** | **✅ Lulus** |
| **UAT (System Usability Scale)** | Skor Rerata SUS ($N=10$ Responden) | $\ge 68{,}0$ (*Acceptable*) | **82,50** (*Grade A / Excellent*) | **✅ Lulus** |

*Sumber: Data Hasil Pengujian Sistem Diproses Peneliti (2026)*

**Analisis Hasil Pengujian Sistem:**
1. **Unit Testing & Code Coverage**: Pengujian unit backend yang dieksekusi dengan *framework* `pytest` menghasilkan cakupan kode (*code coverage*) sebesar **$86{,}5\%$**, melebihi target minimal $70\%$. Seluruh 14 *test cases* yang menguji endpoint REST API (`/health`, `/api/predict`, `/api/benchmark-stats`, `/api/history`, dan `/api/login`) berhasil dieksekusi tanpa kesalahan (*0 failures/errors*).
2. **Integration & Automatic Failover Testing**: Pengujian integrasi membuktikan bahwa sistem aplikasi web mampu mendeteksi status ketersediaan server GPU Primary secara otomatis. Ketika server GPU diposisikan dalam keadaan *offline*, *Automatic Failover Handler* pada frontend berhasil mengalihkan rute permintaan inferensi ke server CPU Fallback dalam waktu **$1{,}24\text{ detik}$**, jauh di bawah batas maksimum $5{,}0\text{ detik}$. Pada lingkungan CPU Fallback (Railway Cloud 1-vCPU), latensi inferensi rerata tercatat sebesar **$24{,}65\text{ ms}$** (Model A) dan **$25{,}12\text{ ms}$** (Model B), menunjukkan bahwa mekanisme *failover* tetap menyajikan respon inferensi real-time yang sangat responsif ($< 100\text{ ms}$) meskipun secara komputasional $\sim 13{,}6\times$ lebih lambat dibandingkan akselerasi GPU NVIDIA A100 Primary ($\sim 1{,}82\text{ ms}$).
3. **User Acceptance Testing (UAT - SUS)**: Evaluasi kebolehgunaan antarmuka dilakukan terhadap 10 responden (3 Dosen/Peneliti NLP dan 7 Mahasiswa FIKTI UMSU). Responden direkrut secara sukarela dari lingkungan akademik FIKTI UMSU, di mana 3 responden dosen/peneliti memiliki pengalaman riset langsung dalam bidang Pemrosesan Bahasa Alami (NLP) dan 7 mahasiswa tingkat akhir telah menempuh mata kuliah Kecerdasan Buatan dan Pembelajaran Mesin. Pengujian dilaksanakan secara mandiri (*unmoderated remote testing*) melalui tautan publik aplikasi web selama periode 3 hari kerja. Berdasarkan kalkulasi 10 item kuesioner standar SUS (Brooke, 1996), aplikasi web memperoleh skor rerata SUS sebesar **$82{,}50$**. Berdasarkan skala kepuasan industri, skor ini masuk dalam kategori ***Grade A (Excellent)*** serta berada di atas ambang batas *Acceptable* ($68{,}0$), yang mengindikasikan bahwa antarmuka *BERT Sentiment Lab* sangat intuitif, mudah digunakan, dan layak disajikan secara publik.

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
Sesuai dengan rancangan eksperimen pada Bab III (Sub-bab 3.3 & 3.8), evaluasi pada *Held-out Test Set* ($N=872$ sampel) dilakukan secara terisolasi murni dan **hanya diuji satu kali** setelah proses pelatihan, *hyperparameter tuning*, dan seleksi model terbaik pada *Internal Validation Set* selesai secara utuh. Prosedur ini diterapkan untuk menjamin tidak terjadinya kebocoran data (*data leakage*) serta memastikan pengukuran kemampuan generalisasi model yang sepenuhnya valid dan objektif. Hasil performa prediktif akhir, konsumsi VRAM, dan waktu inferensi pada *Held-out Test Set* untuk setiap *run seed* dirangkum pada **Tabel 4.2b**:

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
*\*Catatan: VRAM diukur menggunakan torch.cuda.max_memory_allocated() setelah CUDA context warm-up, sesuai metode pada Bab III Sub-bab 3.9.2.*

Berdasarkan **Tabel 4.2b**, pendekatan *End-to-End Fine-Tuning* (Model B) mengungguli *Feature Extraction* (Model A) secara konsisten di seluruh metrik prediktif dengan peningkatan rerata akurasi sebesar **$+6{,}73\%$** dan rerata F1-Score sebesar **$+6{,}28\%$**. 

Ditinjau dari dinamika pelatihan (*Epoch Stop*) dan kurva *learning* (*training & validation loss/F1-score per epoch*), sesuai dengan spesifikasi *hyperparameter* pada **Tabel 3.4 Proposal** (di mana batas maksimum pelatihan ditetapkan sebesar 10 epoch untuk Model A dan 5 epoch untuk Model B dengan *patience early stopping* = 3 epoch), kedua model menunjukkan pola konvergensi yang kontras:
1. **Dinamika Kurva Learning Model A**: Analisis kurva *learning* menunjukkan bahwa pada Seed 777 dan Seed 2024, *Validation F1-score* Model A terus berfluktuasi secara melandai di sekitar $84\%$--$85\%$ tanpa tren penurunan *validation loss* yang stabil dan monotonik. Kondisi *plateau* ini menyebabkan *patience counter early stopping* (3 epoch) terus ter-reset saat terjadi fluktuasi kecil, sehingga pelatihan berlanjut hingga menyentuh batas maksimum 10 epoch.
2. **Dinamika Kurva Learning Model B**: Sebaliknya, kurva *learning* Model B memperlihatkan penurunan *training loss* yang sangat pesat serta peningkatan *Validation F1-score* yang stabil dan konsisten. Performa validasi Model B mencapai titik puncaknya secara optimal pada epoch ke-4 hingga ke-5 di seluruh 6 *random seed*, yang secara otomatis memicu penghentian awal (*early stopping*) pada epoch ke-5 secara efisien.

Ditinjau dari aspek alokasi memori VRAM GPU, sesuai dengan metode pengukuran komplementer yang dirancang pada Bab III Sub-bab 3.9.2, pengukuran konsumsi memori dilakukan melalui dua metrik PyTorch: memori puncak teralokasi (*Peak Allocated Memory* via `torch.cuda.max_memory_allocated()`) dan memori puncak tercadang oleh *allocator* PyTorch (*Peak Reserved Memory* via `torch.cuda.max_memory_reserved()`). Rincian perbandingan kedua metrik VRAM ini disajikan pada **Tabel 4.2c**:

**Tabel 4.2c. Rincian Pengukuran Konsumsi Memori VRAM GPU (Rerata $\pm \sigma$)**

| Pendekatan Model | Peak Allocated VRAM (MB) | Peak Reserved VRAM (MB) | Buffer Caching Overhead (MB) | Efisiensi Alokasi Memori (%) |
|:---:|:---:|:---:|:---:|:---:|
| **Model A** (*Feature Extraction*) | 3177,18 $\pm$ 6,8 | 3584,00 $\pm$ 0,0 | 406,82 | 88,65% |
| **Model B** (*Fine-Tuning*) | 3173,13 $\pm$ 4,1 | 3584,00 $\pm$ 0,0 | 410,87 | 88,54% |
| **Selisih ($\Delta$)** | **-4,05** | **0,00** | **+4,05** | **-0,11%** |

*Sumber: Data Hasil Eksperimen Diproses Peneliti (2026)*

Berdasarkan **Tabel 4.2c**, *Peak Reserved Memory* untuk kedua model bernilai konstan pada **$3.584{,}00\text{ MB}$** ($3{,}50\text{ GB}$). Selisih antara memori tercadang (*reserved*) dan memori teralokasi aktif (*allocated*) sebesar **$\sim 406$--$410\text{ MB}$** ($\approx 11{,}4\%$) mencerminkan *buffer caching overhead* yang secara otomatis dialokasikan oleh *PyTorch CUDA Caching Allocator* guna mencegah *fragmentasi memori* serta mempercepat alokasi tensor pada iterasi berikutnya. Hal ini mengonfirmasi bahwa kedua model memiliki profil efisiensi alokasi memori yang sangat identik ($88{,}54\% \approx 88{,}65\%$), sehingga superioritas performa prediktif Model B diperoleh tanpa memberikan beban penambahan *memory footprint* GPU yang signifikan.

---

### **4.3. Hasil Uji Statistik Inferensial**

Sub-bab ini menyajikan pengujian statistik inferensial komprehensif (*McNemar's Test*, *Wilcoxon Signed-Rank Test*, *Bootstrap 95% Confidence Interval*, dan *Cohen's d Effect Size*) serta Uji Sensitivitas Jackknife untuk menjawab **Pertanyaan Penelitian ke-2 (RQ2)** mengenai signifikansi statistik inferensial dan ukuran efek (*effect size*) dari peningkatan performa Model B.

Untuk menguji signifikansi statistik dari peningkatan performa Model B serta membuktikan bahwa hasil eksperimen bebas dari fluktuasi acak, dilakukan empat tahapan uji statistik inferensial:

#### **4.3.1. Uji McNemar (McNemar's Test)**
Uji McNemar mengevaluasi perbedaan proporsi kesalahan klasifikasi biner pada data sampel berpasangan ($N=872$ sampel *Held-out Test Set* pada Seed 42). Matriks kontingensi $2 \times 2$ ditunjukkan pada **Tabel 4.3**:

**Tabel 4.3. Matriks Kontingensi Uji McNemar 2x2 ($N=872$, Seed 42)**

| | Model B Benar ($B^+$) | Model B Salah ($B^-$) | Total |
|---|:---:|:---:|:---:|
| **Model A Benar ($A^+$)** | $a = 735$ | $c = 14$ | **749** |
| **Model A Salah ($A^-$)** | $b = 83$ | $d = 40$ | **123** |
| **Total** | **818** | **54** | **872** |

*Sumber: Data Hasil Eksperimen Diproses Peneliti (2026)*

Statistik uji McNemar dihitung menggunakan koreksi kontinuitas Edwards:
$$\chi^2 = \frac{(|b - c| - 1)^2}{b + c} = \frac{(|83 - 14| - 1)^2}{83 + 14} = \frac{(68)^2}{97} = \mathbf{47{,}6701}$$

Dengan derajat kebebasan $df = 1$, diperoleh nilai $p\text{-value} = \mathbf{5{,}04 \times 10^{-12}}$ ($p < 0{,}0001$). Karena $p\text{-value} < 0{,}05$, hipotesis nol ($H_0$) ditolak. Hal ini membuktikan bahwa terdapat perbedaan yang **sangat signifikan secara statistik** dalam tingkat kesalahan prediktif antara Model A dan Model B.

#### **4.3.2. Uji Wilcoxon Signed-Rank dan Uji Sensitivitas Jackknife**
Uji non-parametrik berpasangan pada $n=6$ *random seed* menghasilkan statistik uji $W = \mathbf{21{,}0}$ dengan $p\text{-value} = \mathbf{0{,}015625}$ ($p < 0{,}05$). Hasil ini mengonfirmasi bahwa keunggulan F1-Score Model B terbukti konsisten dan stabil secara statistik di seluruh variasi inisialisasi bobot dan pengocokan data.

Untuk memverifikasi ketahanan (*robustness*) kesimpulan uji Wilcoxon pada ukuran sampel $n=6$, dilakukan analisis sensitivitas *Jackknife resampling* (prosedur *leave-one-out*) sesuai dengan rancangan pada Bab III Sub-bab 3.9.1. Pengujian statistik dihitung ulang secara independen pada 6 kombinasi subset $5\text{-of-}6$ *seed*. Seluruh 6 subset *Jackknife* menghasilkan statistik uji $W = 15{,}0$ dengan nilai $p\text{-value} = \mathbf{0{,}03125}$ ($p < 0{,}05$). Hasil ini mengonfirmasi bahwa kesimpulan keunggulan Model B bersifat *robust* murni dan sama sekali tidak peka (*insensitive*) terhadap keberadaan pencilan (*outlier*) pada *seed* tunggal mana pun.

#### **4.3.3. Uji Bootstrap 95% Confidence Interval**
Interval kepercayaan Bootstrap dihitung menggunakan metode *Percentile Bootstrap* dengan $10.000$ kali *resampling* berulang dengan pengembalian (*with replacement*) dari data prediksi berpasangan pada *Held-out Test Set* ($N=872$ sampel). Melalui teknik statistik non-parametrik ini, diperoleh rentang interval kepercayaan 95% untuk selisih F1-Score ($\Delta\text{F1} = \text{F1}_B - \text{F1}_A$):
$$\text{95\% CI} = [\mathbf{0{,}0548} \quad \text{s.d.} \quad \mathbf{0{,}0964}] \quad \text{atau} \quad [\mathbf{+5{,}48\%} \quad \text{s.d.} \quad \mathbf{+9{,}64\%}]$$

Karena rentang interval kepercayaan bernilai positif murni dan **tidak mencakup angka 0** (persilangan nol / *zero-crossing*), maka peningkatan performa prediktif Model B terbukti nyata (*robust*), konsisten, dan signifikan secara statistik pada tingkat kepercayaan 95%.

#### **4.3.4. Uji Ukuran Efek (Cohen's d Effect Size)**
Ukuran efek numerik dihitung dari rerata dan variansi gabungan (*pooled standard deviation*) F1-Score dari kedua model:
$$d = \frac{\mu_B - \mu_A}{\sigma_{\text{pooled}}} = \frac{0{,}9294 - 0{,}8666}{0{,}00641} = \mathbf{9{,}80}$$

Berdasarkan kriteria Cohen (1988), nilai $d = 9{,}80 \gg 2.0$ dikategorikan sebagai ***Extremely Large Effect*** (Pengaruh Sangat Kuat). Hal ini mengindikasikan bahwa metode *Fine-Tuning* memberikan dampak praktis yang luar biasa besar dalam meningkatkan akurasi representasi sentimen teks.

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
| **5. Ambiguitas Tinggi** | Skor AFINN memuat kata positif $\ge +3$ DAN negatif $\le -3$ | 29 | 79,3 | **89,7** | **$+10,4\%$** |

*Sumber: Data Hasil Eksperimen Diproses Peneliti (2026)*

Hasil pengujian pada **Tabel 4.4** mengungkapkan dua temuan utama terkait kegagalan dan ketahanan prediktif masing-masing model:
1. **Ketahanan Terhadap Negasi Biner ($\Delta = +13{,}3\%$)**: Model A sering mengalami kesalahan pembalikan polaritas ketika menemukan kata negasi seperti *"not bad"*, karena bobot representasi vektor BERT statisnya terfokus pada kata sifat positif *"bad"*. Sebaliknya, Model B mampu menyesuaikan seluruh bobot perantian *attention* untuk memahami konstruksi negasi secara kontekstual.
2. **Kinerja pada Review Panjang ($\Delta = +16{,}0\%$)**: Peningkatan terbesar terjadi pada kalimat panjang ($>40$ token). Model B memanfaatkan lapisan *Self-Attention* secara penuh untuk mempertahankan ketergantungan jarak jauh (*long-range dependencies*), sementara Model A kehilangan informasi spasial akibat kompresi langsung vektor `[CLS]`.

---

### **4.5. Pembahasan dan Diskusi Komparatif**

Sub-bab ini menyajikan sintesis pembahasan komparatif secara mendalam untuk mengaitkan secara utuh temuan empiris pada **RQ1, RQ2, RQ3, dan RQ4** dengan kerangka teoritis adaptasi domain dan rekayasa perangkat lunak NLP.

1. **Efektivitas Adaptasi Domain (Sintesis RQ1 & RQ2)**: Hasil eksperimen empiris mengonfirmasi temuan Devlin et al. (2019) dan Sun et al. (2019), di mana penyesuaian bobot secara *end-to-end* (Model B) memungkinkan pergeseran ruang representasi vektor (*embedding space*) dari domain umum Wikipedia/BookCorpus ke domain spesifik ulasan film (*informal movie reviews*).
2. **Kompromi Sumber Daya Komputasi (Sintesis RQ3 & RQ4)**: Meskipun Model B mengungguli Model A secara signifikan dalam metrik prediktif ($92{,}78\%$ vs $86{,}05\%$), Model B membutuhkan alokasi memori VRAM yang seimbang ($3173\text{ MB}$ vs $3177\text{ MB}$) serta waktu pelatihan per-epoch yang lebih lama. Pada tahap inferensi GPU A100 Primary, latensi kedua model hampir setara ($\sim 1{,}82\text{ ms}$ vs $1{,}83\text{ ms}$). Sementara pada lingkungan CPU Fallback Server (Railway Cloud 1-vCPU), latensi inferensi rerata tercatat sebesar $24{,}65\text{ ms}$ (Model A) dan $25{,}12\text{ ms}$ (Model B) (rerata gabungan $\sim 24{,}88\text{ ms}$). Hasil perbandingan ini mengonfirmasi bahwa penyiapan server cadangan berbasis CPU tetap mampu melayani inferensi pengguna secara responsif ($< 100\text{ ms}$) ketika server GPU utama mengalami kendala konektivitas.

---

### **4.6. Implikasi dan Keterbatasan Interpretasi Hasil**

Meskipun hasil eksperimen komparatif dan pengujian sistem aplikasi web *BERT Sentiment Lab* memberikan bukti empiris yang kuat, terdapat beberapa implikasi metodologis dan keterbatasan interpretasi yang perlu diperhatikan dalam memahami temuan penelitian ini:

1. **Ukuran Sampel Multi-Seed ($n=6$)**: Penggunaan 6 *random seed* ($42, 123, 777, 999, 1234, 2024$) terbukti memadai untuk mengeksekusi uji statistik non-parametrik *Wilcoxon Signed-Rank* ($p = 0{,}015625 < 0{,}05$) serta telah diverifikasi tingkat ketahanannya melalui Uji Sensitivitas *Jackknife* ($p = 0{,}03125$ pada 6/6 subset). Namun demikian, ukuran sampel $n=6$ ini tetap membatasi analisis penggeneralisasian kurva estimasi parametrik secara luas terhadap variasi stokastik inisialisasi bobot deep learning pada skala industri yang lebih besar.
2. **Cakupan Model Tunggal (*BERT-Base Single Backbone*)**: Eksperimen dibatasi secara ketat pada arsitektur `bert-base-uncased` (110M parameter) guna menjamin asas *ceteris paribus* (kontrol variabel independen yang homogen). Implikasi dari pembatasan ini adalah bahwa superioritas *fine-tuning end-to-end* yang ditemukan belum tentu merepresentasikan rasio efisiensi yang persis sama apabila diterapkan pada arsitektur *Large Language Model* (LLM) dengan skala parameter yang jauh lebih besar (seperti LLaMA, RoBERTa-Large, atau DeBERTa-v3).
3. **Generalisasi Domain Teks dan Bahasa**: Evaluasi prediktif dilaksanakan secara eksklusif menggunakan dataset SST-2 (Stanford Sentiment Treebank) yang berfokus pada tugas klasifikasi sentimen biner berbasis Bahasa Inggris. Hasil ini menyajikan *baseline* standar internasional yang kredibel, namun generalisasi performa terhadap domain Bahasa Indonesia (*low-resource language*) atau tugas klasifikasi multinomial (*multi-class / aspect-based sentiment analysis*) memerlukan pengujian lanjutan.
4. **Kapasitas Throughput Server Cadangan (CPU Fallback)**: Arsitektur *Dual-Backend Hybrid* terbukti sukses menjamin *High Availability* aplikasi web dengan pengalihan failover otomatis ($1{,}24\text{ detik}$). Meskipun latensi inferensi sampel tunggal pada CPU Fallback Railway Cloud tercatat sangat responsif ($24{,}65\text{ ms}$ untuk Model A dan $25{,}12\text{ ms}$ untuk Model B, jauh di bawah $100\text{ ms}$), *throughput* pemrosesan batch data berukuran besar pada CPU tetap memiliki keterbatasan kapasitas komputasi dibandingkan akselerasi GPU NVIDIA A100 Primary.
