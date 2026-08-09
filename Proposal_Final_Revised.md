

**FAKULTAS ILMU KOMPUTER DAN TEKNOLOGI INFORMASI**<br>
**UNIVERSITAS MUHAMMADIYAH SUMATERA UTARA**<br>
**Unggul | Cerdas | Terpercaya**<br>

# **PENERAPAN *FINE-TUNING* MODEL BERT UNTUK EFEKTIVITAS KLASIFIKASI TEKS** 

## **PROPOSAL SKRIPSI** 

**Diajukan sebagai salah satu syarat untuk memperoleh gelar Sarjana Komputer (S.Kom) dalam Program Studi Sistem Informasi pada Fakultas Ilmu Komputer dan Teknologi Informasi, Universitas Muhammadiyah Sumatera Utara** 

## **<u>MHD SYAFIQ HASAN JAMBAK</u>** 

**NPM. 2209010182** 

## **PROGRAM STUDI SISTEM INFORMASI** 

**FAKULTAS ILMU KOMPUTER DAN TEKNOLOGI INFORMASI UNIVERSITAS MUHAMMADIYAH SUMATERA UTARA** 

## **MEDAN** 

**2026** 

---

## **KATA PENGANTAR**

Puji dan syukur penulis panjatkan ke hadirat Allah SWT atas segala rahmat, karunia, dan hidayah-Nya sehingga proposal skripsi yang berjudul **“Penerapan *Fine-Tuning* Model BERT untuk Efektivitas Klasifikasi Teks”** ini dapat diselesaikan dengan baik. Shalawat serta salam semoga senantiasa tercurah kepada junjungan kita, Nabi Muhammad SAW, beserta keluarga, para sahabat, dan pengikutnya hingga akhir zaman.

Proposal skripsi ini disusun sebagai salah satu syarat akademis untuk memperoleh gelar Sarjana Komputer (S.Kom) pada Program Studi Sistem Informasi, Fakultas Ilmu Komputer dan Teknologi Informasi, Universitas Muhammadiyah Sumatera Utara (UMSU).

Penelitian ini berfokus pada evaluasi komparatif secara empiris terhadap dua pendekatan utama dalam adaptasi model berbasis *Transformer*, yaitu *Feature Extraction* (*Frozen Encoder*) dan *End-to-End Fine-Tuning*, pada tugas klasifikasi sentimen teks menggunakan dataset SST-2 yang merupakan bagian dari *benchmark* GLUE. Evaluasi dilaksanakan melalui validasi eksperimental terkontrol *multi-seed* ($n=6$) dengan mengukur performa prediktif (*Accuracy*, *Precision*, *Recall*, *F1-score*), efisiensi komputasi latensi inferensi dan alokasi VRAM GPU, pengujian statistik inferensial (*McNemar's Test*, *Wilcoxon Signed-Rank Test*, *Bootstrap Confidence Interval*, *Cohen's d*), evaluasi kategori linguistik (*error analysis*), serta diwujudkan dalam produk aplikasi web interaktif berbasis *FastAPI* dan *React* dengan dukungan *Progressive Web App* (PWA).

Dalam proses penyusunan proposal penelitian ini, penulis menyadari sepenuhnya bahwa keberhasilan penyelesaian dokumen ini tidak terlepas dari bimbingan, arahan, dukungan, serta bantuan dari berbagai pihak. Oleh karena itu, dengan penuh rasa hormat dan kerendahan hati, penulis menyampaikan terima kasih yang sebesar-besarnya kepada:

1. Kedua orang tua tercinta dan keluarga besar yang senantiasa memberikan doa tulus, motivasi, serta dukungan moral dan material yang tiada terhingga selama proses studi.
2. Bapak Assoc. Prof. Dr. Al-Khowarizmi, S.Kom., M.Kom., selaku Dekan Fakultas Ilmu Komputer dan Teknologi Informasi Universitas Muhammadiyah Sumatera Utara.
3. Bapak Mahardika Abdi Prawira Tanjung, S.Kom., M.Kom., selaku Ketua Program Studi Sistem Informasi sekaligus Dosen Pembimbing yang telah memberikan arahan akademik, bimbingan teknis, saran, dan wawasan yang sangat bernilai serta konstruktif dalam penyempurnaan proposal ini.
4. Seluruh Dosen dan Staf Pengajar Program Studi Sistem Informasi, Fakultas Ilmu Komputer dan Teknologi Informasi UMSU, atas transfer ilmu pengetahuan, bimbingan, dan dedikasi keilmuan selama masa perkuliahan.
5. Rekan-rekan mahasiswa Program Studi Sistem Informasi angkatan 2022 serta seluruh pihak yang telah memberikan bantuan, semangat, dan kerja sama selama proses penyusunan proposal ini.

Penulis menyadari bahwa proposal skripsi ini masih memiliki keterbatasan, baik dalam ruang lingkup kajian maupun teknis pelaksanaan eksperimen yang akan dikembangkan lebih lanjut pada tahap penelitian. Oleh karena itu, saran dan kritik yang membangun dari dosen penguji serta pembaca sangat diharapkan demi penyempurnaan naskah ini.

Akhir kata, penulis berharap semoga proposal skripsi ini dapat memberikan kontribusi nyata dalam pengembangan keilmuan *Natural Language Processing* (NLP) dan rekayasa perangkat lunak berbasis pembelajaran mesin, serta menjadi rujukan bermanfaat bagi penelitian-penelitian selanjutnya.

<br>

Medan, 27 April 2026

Penulis,


**<u>Mhd Syafiq Hasan Jambak</u>**  
NPM. 2209010182

---

## **DAFTAR ISI**

**KATA PENGANTAR**
**BAB I PENDAHULUAN**
  1.1. Latar Belakang Masalah
  1.2. Rumusan Masalah
  1.3. Batasan Masalah
  1.4. Tujuan Penelitian
  1.5. Manfaat Penelitian
**BAB II LANDASAN TEORI DAN KERANGKA KONSEPTUAL**
  2.1. *Natural Language Processing* (NLP)
  2.2. Pemrosesan Bahasa Alami dan Klasifikasi Teks
  2.3. *Deep Learning* dalam Pemrosesan Bahasa
  2.4. Arsitektur *Transformer*
  2.5. BERT (*Bidirectional Encoder Representations from Transformers*)
  2.5.1. Tahapan dan Mekanisme Kerja BERT
  2.6. *Transfer Learning* dalam NLP
  2.7. *Feature Extraction* vs *Fine-Tuning* pada BERT
  2.8. Dataset SST-2 (*Stanford Sentiment Treebank*)
  2.9. Metode Evaluasi Klasifikasi
  2.10. Metode Statistik Inferensial
  2.11. Arsitektur Aplikasi Web, REST API, dan Progressive Web App (PWA)
  2.12. Penelitian Terdahulu
  2.13. *Research Gap*
  2.14. Kerangka Konseptual
  2.15. Hipotesis Penelitian
**BAB III METODOLOGI PENELITIAN**
  3.1. Pendekatan dan Desain Penelitian
  3.2. Variabel Penelitian
  3.3. Lokasi dan Waktu Penelitian
  3.4. Lingkungan Penelitian
  3.5. Dataset Penelitian
  3.6. Pra-Pemrosesan Data
  3.7. Desain Eksperimen
  3.7.1. *Early Stopping*
  3.8. Prosedur Eksperimen
  3.9. Teknik Analisis Data
  3.9.1. Uji Statistik Inferensial
  3.9.2. Evaluasi *Trade-off* Komputasi
  3.9.3. *Error Analysis* Berbasis Kategori Linguistik
  3.10. Rancangan Arsitektur Produk Aplikasi Web
  3.10.1. Modul-Modul Sistem
  3.10.2. Spesifikasi API *Endpoints*
  3.10.2a. Strategi Seleksi Model untuk *Deployment*
  3.10.3. Rancangan Antarmuka Pengguna (*User Interface*)
  3.10.4. Rancangan Sistem Navigasi dan Tema Visual
  3.10.5. Rancangan *Progressive Web App* (PWA)
  3.10.6. Rancangan Sistem Autentikasi dan Kontrol Akses
  3.10.7. Alur Integrasi Operasional Model & Arsitektur *Dual-Backend Hybrid*
  3.10.8. Rancangan Basis Data (*Database Schema*)
  3.10.9. Diagram Kasus Penggunaan (*Use Case Diagram*)
  3.10.10. Diagram Alur Sistem (*System Flowchart Diagram*)
  3.10.11. Diagram Relasi Entitas Basis Data (*Entity Relationship Diagram / ERD*)
  3.10.12. Ruang Lingkup Minimum dan Fitur Tambahan (MVP vs *Stretch*)
  3.11. Kontrol Variansi dan Reliabilitas
  3.12. Validitas Penelitian
  3.13. Reproduktibilitas dan Keterbukaan Penelitian
  3.14. Pertimbangan Etika Penelitian
  3.15. Rencana Pengujian Aplikasi Web
**DAFTAR PUSTAKA**

---

## **DAFTAR TABEL**

**Tabel 2.1** Penelitian Terdahulu
**Tabel 2.2** *Research Gap*
**Tabel 2.3** Hipotesis Statistik Penelitian
**Tabel 3.1** Variabel Penelitian
**Tabel 3.2** Jadwal Kegiatan Penelitian
**Tabel 3.3** Distribusi Data pada Dataset SST-2
**Tabel 3.4** Perbandingan Spesifikasi Eksperimen Model A dan Model B
**Tabel 3.5** Spesifikasi API *Endpoints*
**Tabel 3.6** Definisi Operasional Kategori Linguistik *Error Analysis*

---

## **DAFTAR GAMBAR**

**Gambar 2.1** Diagram Alur Tahapan dan Mekanisme Kerja BERT
**Gambar 2.2** Diagram Kerangka Konseptual Penelitian
**Gambar 3.1** Arsitektur Komparatif Model A (Feature Extraction) vs Model B (End-to-End Fine-Tuning)
**Gambar 3.2** Diagram Alur Prosedur Eksperimen Multi-Seed
**Gambar 3.3** Diagram Kasus Penggunaan (Use Case Diagram) Aplikasi Web
**Gambar 3.4** Diagram Alur Sistem (System Flowchart Diagram) Aplikasi Web
**Gambar 3.5** Diagram Relasi Entitas (Entity Relationship Diagram / ERD) Basis Data

---

## **BAB I** 

## **PENDAHULUAN** 

## **1.1. Latar Belakang Masalah** 

Klasifikasi teks merupakan salah satu tugas fundamental dalam *Natural Language Processing* (NLP) yang bertujuan mengelompokkan unit teks ke dalam kategori tertentu berdasarkan makna semantiknya (Minaee et al., 2021). Perkembangan pemrosesan data dan ekstraksi fitur klasifikasi cerdas di lingkungan FIKTI UMSU dieksplorasi oleh Al-Khowarizmi (2021) pada prediksi data teks dan Tanjung (2019) pada analisis ekstraksi fitur klasifikasi citra. Pendekatan klasik berbasis fitur seperti TF-IDF dan algoritma pembelajaran mesin konvensional memiliki keterbatasan utama dalam menangkap urutan kata dan hubungan konteks yang kompleks. Terobosan besar terjadi ketika Vaswani et al. (2017) memperkenalkan arsitektur *Transformer*, yang kemudian dikembangkan oleh Devlin et al. (2019) menjadi model *Bidirectional Encoder Representations from Transformers* (BERT). BERT memanfaatkan mekanisme *self-attention* bidireksional dan paradigma *transfer learning* untuk mempelajari representasi bahasa mendalam yang unggul pada berbagai *benchmark* NLP seperti GLUE (Wang et al., 2018; Ruder et al., 2019).

Dalam penerapannya, model pra-terlatih BERT dapat diadaptasikan melalui dua strategi utama, yaitu *frozen feature extraction* (mempertahankan bobot BERT dan hanya melatih *classifier*) dan *end-to-end fine-tuning* (memperbarui seluruh bobot model). Meskipun sejumlah penelitian terdahulu seperti Qasim et al. (2022) dan Zaman-Khan et al. (2024) mengonfirmasi efektivitas BERT dalam meningkatkan akurasi klasifikasi teks, sebagian besar studi tersebut menguji *fine-tuning* tanpa skema perbandingan terkontrol secara simetris terhadap metode *feature extraction*. Selain itu, evaluasi komputasi mengenai *trade-off* penggunaan VRAM GPU dan latensi inferensi masih relatif jarang dilaporkan secara bersamaan.

Ketiadaan pengujian signifikansi statistik inferensial menjadi kesenjangan kritis lain dalam literatur. Dror et al. (2018) menekankan bahwa peningkatan metrik prediktif tanpa uji signifikansi statistik berisiko mencerminkan variasi acak semata dan bukan efek perlakuan model yang sesungguhnya. Temuan ini diperkuat oleh Galke et al. (2024) yang menyoroti masalah komparabilitas dan reliabilitas dalam eksperimen klasifikasi teks. Oleh karena itu, diperlukan studi komparatif terkontrol untuk mengintegrasikan pengujian statistik inferensial komprehensif untuk membuktikan signifikansi perbedaan performa kedua strategi adaptasi BERT secara ilmiah.

Berdasarkan kesenjangan tersebut, penelitian ini merancang eksperimen komparatif terkontrol untuk membandingkan strategi *feature extraction* (Model A) dan *end-to-end fine-tuning* (Model B) pada dataset SST-2 GLUE benchmark. Pengujian tidak hanya mengukur metrik prediktif (akurasi, *precision*, *recall*, *F1-score*), tetapi juga menguji signifikansi statistik menggunakan 4 metode uji (*McNemar Test*, *Wilcoxon Signed-Rank Test* $n=6$, *Bootstrap 95% CI*, dan *Cohen's d effect size*) serta mengevaluasi *trade-off* efisiensi komputasi (waktu inferensi dan VRAM GPU). Untuk memperluas dampak praktis penelitian, seluruh hasil eksperimen dan analisis statistik diintegrasikan ke dalam produk aplikasi web interaktif berbasis *FastAPI* dan *React* dengan dukungan PWA (*Progressive Web App*).

## **1.2. Rumusan Masalah** 

Berdasarkan latar belakang tersebut, penelitian ini merumuskan empat pertanyaan penelitian berikut: 

1. Bagaimana perbedaan performa klasifikasi teks antara penggunaan BERT sebagai *feature extraction* (Model A) dan BERT dengan *fine-tuning end-to-end* (Model B) pada dataset SST-2, ditinjau dari metrik akurasi, *precision*, *recall*, dan *F1-score*? 

2. Apakah perbedaan performa antara Model A dan Model B signifikan secara statistik, serta seberapa besar ukuran efek (*effect size*) dari perbedaan tersebut? 

3. Bagaimana *trade-off* antara peningkatan performa prediktif dan efisiensi komputasi (waktu inferensi dan memori GPU), serta apakah peningkatan performa sebanding dengan biaya komputasi yang ditimbulkan? 

4. Bagaimana merancang dan membangun produk aplikasi web interaktif yang dapat melakukan inferensi pembandingan model secara *real-time* serta memvisualisasikan hasil analisis statistik komparatif tersebut?

## **1.3. Batasan Masalah** 

Untuk menjaga fokus penelitian serta memastikan konsistensi dan validitas eksperimen, ruang lingkup penelitian ini dibatasi pada beberapa aspek berikut: 

1. Penelitian difokuskan pada penggunaan satu arsitektur model bahasa, yaitu BERT *Base Uncased* (*bert-base-uncased*), guna menjaga konsistensi dan kontrol eksperimen tanpa membandingkan dengan varian model lain. 

2. Dataset yang digunakan adalah SST-2 dari benchmark GLUE, yang merupakan tugas klasifikasi sentimen biner berbahasa Inggris. 

3. Pembagian data menggunakan skema *re-partitioning* terkontrol untuk menghindari kebocoran data (*data leakage*). Data latih resmi SST-2 (67.349 sampel) dibagi menjadi *Train Set* internal (60.614 sampel / 90%) dan *Validation Set* internal (6.735 sampel / 10%) untuk validasi performa iterasi dan pelatihan. Adapun data validasi resmi GLUE SST-2 (872 sampel) difungsikan murni sebagai *Held-out Test Set* (data uji terisolasi) yang hanya diuji satu kali pada evaluasi akhir. 

4. Untuk mendukung analisis statistik inferensial yang *valid* dan *robust* (khususnya *Wilcoxon Signed-Rank Test* berpasangan), eksperimen dijalankan menggunakan 6 nilai *random seed* yang terkontrol ($n=6$, yaitu 42, 123, 777, 999, 1.234, dan 2024). 

5. Penelitian hanya membandingkan dua konfigurasi model, yaitu: 

 a. Model A: BERT digunakan sebagai *feature extraction* dengan parameter dibekukan, diikuti oleh *classification head* linear (768→2). 

 b. Model B: BERT dilatih menggunakan pendekatan *fine-tuning end-to-end* melalui arsitektur *BertForSequenceClassification*. 

6. Evaluasi performa difokuskan pada tiga aspek utama, yaitu: 

 a. Performa prediktif: akurasi, *precision*, *recall*, dan *F1-score*. 

 b. Efisiensi komputasi: waktu inferensi (ms/sampel) dan penggunaan memori GPU (VRAM peak). 

 c. Unjuk kerja sistem web: latensi respons API inferensi real-time.

7. Eksperimen pelatihan dilakukan pada lingkungan komputasi berbasis GPU (NVIDIA A100 Tensor Core GPU atau setara), tanpa mempertimbangkan variasi perangkat keras lain. 

8. Penelitian ini tidak mencakup eksplorasi *hyperparameter tuning* secara ekstensif, tidak membandingkan arsitektur model lain di luar BERT, serta tidak mengeksplorasi variasi desain *classification head* di luar konfigurasi yang telah ditetapkan. 

9. Penelitian ini tidak mencakup variasi dataset di luar SST-2, sehingga evaluasi terbatas pada tugas klasifikasi sentimen biner berbahasa Inggris. 

10. Analisis difokuskan pada evaluasi perbedaan performa antara kedua konfigurasi model dalam konteks klasifikasi teks, tanpa membahas aspek interpretabilitas model atau generalisasi lintas domain. 

11. Hasil penelitian ini diwujudkan dalam bentuk produk aplikasi web interaktif berbasis *FastAPI* dan *React* dengan dukungan PWA (*Progressive Web App*). Aplikasi ini berfungsi sebagai portal penelitian yang menyediakan tiga halaman utama, yaitu: (a) Beranda informasi penelitian, (b) Komparator Inferensi Sentimen *Real-Time*, dan (c) *Dashboard* Analitik *Benchmark* Statistik. Sistem dirancang menggunakan autentikasi berbasis peran (*Role-Based Access Control* / RBAC) serta kemampuan *Progressive Web App* (PWA) untuk instalasi langsung pada perangkat pengguna. Mengingat keterbatasan waktu, implementasi difokuskan pada fitur minimum (*Minimum Viable Product* / MVP) sebagaimana dijelaskan pada Bab III Sub-bab 3.10.12, sedangkan fitur tambahan dikembangkan sebagai target pengayaan (*stretch goals*).

## **1.4. Tujuan Penelitian** 

Sesuai dengan rumusan masalah yang telah dirumuskan, tujuan penelitian ini adalah sebagai berikut: 

1. Mengukur dan membandingkan performa klasifikasi teks antara Model A (BERT *feature extraction*) dan Model B (BERT *fine-tuning*) pada dataset SST-2 berdasarkan metrik akurasi, *precision*, *recall*, dan *F1-score*. 

2. Menganalisis signifikansi statistik dari perbedaan performa antara kedua model serta mengkuantifikasikan besar pengaruh (*effect size*) dari perbedaan tersebut melalui uji McNemar, Wilcoxon, Bootstrap CI, dan *Cohen's d*. 

3. Mengevaluasi *trade-off* antara peningkatan performa prediktif dan biaya komputasi, serta menilai apakah peningkatan performa yang diperoleh melalui *fine-tuning* sebanding dengan sumber daya komputasi yang digunakan. 

4. Merancang dan mengimplementasikan produk aplikasi web interaktif berbasis *FastAPI* dan *React*. Aplikasi ini menyediakan fitur komparasi inferensi sentimen *real-time*, visualisasi *dashboard* statistik *benchmark* model, serta sistem autentikasi berbasis peran (RBAC) untuk pengelolaan akses data penelitian.

## **1.5. Manfaat Penelitian** 

Berdasarkan tujuan penelitian yang telah dirumuskan, penelitian ini diharapkan dapat memberikan kontribusi ilmiah yang relevan serta manfaat praktis yang aplikatif, sebagai berikut: 

### **1.5.1. Manfaat Teoritis** 

Penelitian ini diharapkan menghasilkan bukti empiris kuantitatif yang terverifikasi secara statistik mengenai efek *fine-tuning* pada model BERT dalam tugas klasifikasi teks. Temuan ini berkontribusi dalam memperkuat validitas empiris pendekatan *transfer learning*, khususnya dalam perbandingan antara metode *feature extraction* dan *fine-tuning*. 

### **1.5.2. Manfaat Praktis** 

Penelitian ini memberikan manfaat praktis bagi berbagai pihak. Adapun manfaat tersebut dapat diuraikan sebagai berikut: 

1. Bagi institusi akademik, penelitian ini menyediakan contoh desain eksperimen terkontrol berbasis *machine learning* yang dilengkapi produk aplikasi web interaktif yang dapat dijadikan referensi dalam pembelajaran pada bidang kecerdasan buatan, pemrosesan bahasa alami, dan sistem informasi. 

2. Bagi peneliti, studi ini memberikan pengalaman dalam merancang eksperimen komputasional terkontrol, mengimplementasikan model berbasis *transformer* menggunakan pustaka *Hugging Face Transformers*, menerapkan metode statistik inferensial, serta membangun sistem inferensi NLP berbasis web. 

3. Bagi praktisi dan pengembang sistem NLP, hasil penelitian ini memberikan dasar kuantitatif dalam pengambilan keputusan terkait pemilihan strategi adaptasi model BERT, khususnya dalam mempertimbangkan *trade-off* antara akurasi prediktif dan efisiensi komputasi. 

4. Bagi pengguna akhir dan penguji sistem, menyediakan aplikasi web interaktif yang siap pakai untuk membandingkan inferensi sentimen secara *real-time* serta memvisualisasikan hasil analisis statistik secara intuitif.

## **1.6. Sistematika Penulisan** 

Penulisan skripsi ini disusun dalam lima bab dengan sistematika sebagai berikut: 

### **Bab I Pendahuluan** 

Menguraikan latar belakang, rumusan masalah, batasan masalah, tujuan, manfaat penelitian, dan sistematika penulisan. 

### **Bab II Tinjauan Pustaka** 

Membahas landasan teori yang meliputi klasifikasi teks, arsitektur *Transformer*, *transfer learning*, BERT, dataset SST-2, metrik evaluasi, serta metode statistik inferensial. Selain itu, bab ini juga memuat kajian penelitian terdahulu, identifikasi research gap, kerangka konseptual, dan hipotesis penelitian. 

### **Bab III Metodologi Penelitian** 

Menjelaskan pendekatan kuantitatif eksperimental, lingkungan penelitian, desain eksperimen, arsitektur Model A dan Model B, parameter pelatihan, teknik analisis statistik, serta **rancangan arsitektur produk aplikasi web berbasis FastAPI dan React**.

## **BAB II** 

## **TINJAUAN PUSTAKA** 

## **2.1.** ***Natural Language Processing* (NLP)** 

*Natural Language Processing* (NLP) merupakan cabang dari kecerdasan buatan yang berfokus pada interaksi antara komputer dan bahasa manusia untuk memproses, menginterpretasikan, serta menghasilkan teks secara otomatis (Minaee et al., 2021). Bidang ini mencakup berbagai tugas penting seperti klasifikasi teks, analisis sentimen, dan penerjemahan mesin. 

Perkembangan NLP modern didorong oleh ketersediaan data teks berskala besar serta pergeseran dari representasi kata statis menuju representasi kontekstual berbasis jaringan saraf (Peters et al., 2018). Pendekatan kontekstual ini memungkinkan sistem untuk menangkap dinamika makna semantik yang berbeda tergantung pada lingkungan kalimatnya. 

## **2.2. Pemrosesan Bahasa Alami dan Klasifikasi Teks** 

Klasifikasi teks merupakan salah satu tugas utama dalam NLP yang bertujuan untuk menetapkan label kategori pada dokumen atau kalimat berdasarkan isi semantiknya. Tugas ini memiliki berbagai aplikasi praktis, seperti analisis sentimen, deteksi spam, klasifikasi berita, serta pengelompokan konten digital (Minaee et al., 2021). 

Pendekatan awal dalam klasifikasi teks umumnya menggunakan metode pembelajaran mesin klasik seperti *Naïve Bayes* dan *Support Vector Machine* (SVM) dengan representasi berbasis *bag-of-words* atau TF-IDF. Representasi ini memperlakukan teks sebagai kumpulan kata tanpa mempertimbangkan struktur urutan maupun relasi kontekstual secara eksplisit, sehingga memiliki keterbatasan dalam menangkap makna semantik yang kompleks. 

Untuk mengatasi keterbatasan tersebut, pendekatan berbasis *deep learning* diperkenalkan dengan kemampuan untuk mempelajari representasi fitur secara otomatis dari data. Model *deep learning* mampu menangkap dependensi antar kata serta struktur linguistik yang lebih kompleks, sehingga meningkatkan performa klasifikasi teks pada berbagai tugas. 

## **2.3.** ***Deep Learning* dalam Pemrosesan Bahasa** 

*Deep learning* merupakan pendekatan pembelajaran mesin yang memungkinkan model mempelajari representasi data dalam bentuk hierarki konsep melalui banyak lapisan pemrosesan. Pendekatan ini tidak memerlukan rekayasa fitur manual secara eksplisit karena fitur dipelajari langsung dari data selama proses pelatihan menggunakan algoritma optimasi seperti *backpropagation* (Goodfellow et al., 2016). 

Dalam konteks NLP, berbagai arsitektur *deep learning* telah dikembangkan, termasuk *Convolutional Neural Network* (CNN) dan *Recurrent Neural Network* (RNN). CNN efektif dalam menangkap pola lokal dalam teks, sedangkan RNN dirancang untuk memodelkan data sekuensial dengan mempertimbangkan urutan kata. Namun, RNN memiliki keterbatasan dalam menangkap dependensi jangka panjang serta rentan terhadap masalah *vanishing gradient*. 

## **2.4. Arsitektur** ***Transformer*** 

Sebagai alternatif dari model sekuensial seperti RNN, arsitektur *Transformer* diperkenalkan oleh Vaswani et al. (2017) dengan memanfaatkan mekanisme *self-attention*. Mekanisme ini memungkinkan model untuk menghitung hubungan antar token dalam suatu urutan secara langsung tanpa bergantung pada pemrosesan sekuensial. 

*Transformer* mampu memproses seluruh input secara paralel dan menangkap dependensi global dalam teks secara lebih efisien. Hal ini menjadikan *Transformer* sebagai pendekatan yang banyak digunakan dalam berbagai tugas NLP modern, termasuk klasifikasi teks. 

## **2.5. BERT (*Bidirectional Encoder Representations from Transformers*)** 

Salah satu implementasi paling berpengaruh dari arsitektur *Transformer* adalah BERT yang diperkenalkan oleh Devlin et al. (2019). BERT dirancang untuk menghasilkan representasi bahasa yang bersifat bidireksional, yaitu mempertimbangkan konteks kiri dan kanan secara simultan dalam setiap lapisan model. 

BERT dilatih menggunakan dua tugas utama, yaitu *masked language modeling* dan *next sentence prediction*, yang memungkinkan model mempelajari struktur bahasa secara mendalam. Model ini telah menunjukkan performa yang sangat baik pada berbagai *benchmark* NLP, termasuk GLUE yang mencakup tugas klasifikasi sentimen seperti SST-2.

Perkembangan lebih lanjut dari arsitektur BERT dilakukan oleh Liu et al. (2019) yang memperkenalkan RoBERTa (*Robustly Optimized BERT Pretraining Approach*) dengan optimasi *hyperparameter* dan pelatihan yang lebih ekstensif. Meskipun demikian, BERT tetap menjadi model yang banyak digunakan sebagai *baseline* dalam penelitian klasifikasi teks karena keseimbangan antara performa dan kebutuhan komputasi (Wolf et al., 2020).

Implementasi BERT dan arsitektur *transformer* lainnya didukung oleh pustaka *Transformers* dari Hugging Face (Wolf et al., 2020), yang menyediakan antarmuka terstandar untuk memuat, melatih, dan mengevaluasi model-model bahasa modern. Pustaka ini digunakan secara luas dalam penelitian NLP karena menyederhanakan proses *fine-tuning* dan *deployment* model.

### **2.5.1. Tahapan dan Mekanisme Kerja BERT**

Mekanisme kerja model BERT dalam memproses teks hingga menghasilkan keluaran prediksi klasifikasi sentimen berlangsung secara terstruktur melalui empat tahapan utama (Devlin et al., 2019), sebagaimana diilustrasikan pada Gambar 2.1:

```text
+-----------------------------------------------------------------------------------+
| TAHAP 1: REPRESENTASI INPUT & TOKENISASI                                          |
| Teks Mentah -> WordPiece Tokenizer -> [CLS] & [SEP] -> Add Embeddings (Tok+Seg+Pos)|
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
| TAHAP 2: PEMROSESAN KONTEKSTUAL TRANSFORMER ENCODER                               |
| Multi-Head Self-Attention (Q, K, V) -> Residual & LayerNorm -> Vektor 768-Dimensi |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
| TAHAP 3: PRA-PELATIHAN (PRE-TRAINING PHASE - DUA TUGAS UTAMA)                    |
| 1. Masked Language Modeling (MLM - 15% [MASK])                                   |
| 2. Next Sentence Prediction (NSP - IsNext/NotNext)                               |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
| TAHAP 4: ADAPTASI TUGAS HILIR (DOWNSTREAM ADAPTATION / INFERENCE)                |
| Ekstraksi Vektor Token [CLS] (768-D) -> Linear Classifier Head -> Label Sentimen  |
| (Jalur Model A: Feature Extraction vs Jalur Model B: Fine-Tuning)                 |
+-----------------------------------------------------------------------------------+
```
*Gambar 2.1. Diagram Alur Tahapan dan Mekanisme Kerja BERT*  
*Sumber: Diolah dari Devlin et al. (2019) & Vaswani et al. (2017)*

Penjelasan detail untuk setiap tahapan komputasi BERT didefinisikan sebagai berikut:

a. **Tahap Representasi Input (*Input Representation & Tokenization*)**
 Teks mentah diawali dengan proses pemecahan menjadi unit-unit token sub-kata (*subword*) menggunakan *WordPiece Tokenizer* (Wu et al., 2016). Struktur input BERT dilengkapi dua token khusus (Devlin et al., 2019):
 - Token `[CLS]` (*Classification Token*) ditempatkan pada posisi pertama sekuens input (indeks 0). Vektor representasi pada posisi ini digunakan sebagai representasi agregat seluruh kalimat untuk tugas klasifikasi.
 - Token `[SEP]` (*Separator Token*) ditempatkan di akhir sekuens sebagai pemisah antar kalimat.
 Vektor input akhir dibentuk dari penjumlahan tiga matriks *embedding*: *Token Embeddings* (representasi bobot kata), *Segment Embeddings* (membedakan kalimat A dan B), dan *Position Embeddings* (menandai urutan posisi token).

b. **Tahap Pemrosesan Kontekstual (*Transformer Encoder*)**
 Vektor input diteruskan ke dalam tumpukan 12 lapisan *Transformer Encoder* pada varian `bert-base-uncased` (Vaswani et al., 2017; Devlin et al., 2019). Di setiap lapisan, dilakukan perhitungan *Multi-Head Self-Attention* menggunakan matriks *Query* ($Q$), *Key* ($K$), dan *Value* ($V$) untuk menghitung dependensi konteks antar token secara simultan dari dua arah (bidireksional). Hasilnya dikombinasikan dengan mekanisme *Residual Connection* dan *Layer Normalization*, menghasilkan representasi fitur kontekstual berdimensi 768 per token.

c. **Tahap Pra-Pelatihan (*Pre-Training Phase*)**
 BERT dipra-latih pada korpus teks skala besar (*BookCorpus* 800M kata dan *English Wikipedia* 2.500M kata) menggunakan dua tugas pembelajaran tanpa pengawasan (Devlin et al., 2019):
 - *Masked Language Modeling* (MLM): Menutupi 15% token secara acak dengan simbol `[MASK]` dan melatih model untuk memprediksi token asli berdasarkan konteks sekitarnya.
 - *Next Sentence Prediction* (NSP): Melatih model memprediksi apakah Kalimat B secara logis mengikuti Kalimat A (klasifikasi biner `IsNext` atau `NotNext`).

d. **Tahap Adaptasi Tugas Hilir (*Downstream Adaptation: Feature Extraction vs Fine-Tuning*)**
 Pada tugas hilir klasifikasi sentimen ulasan film (SST-2), vektor keluaran dari token `[CLS]` di lapisan paling atas ($h_{\text{[CLS]}} \in \mathbb{R}^{768}$) diekstraksi dan diteruskan ke *Classifier Head* (lapisan linier $768 \rightarrow 2$) untuk menghitung probabilitas kelas positif atau negatif (Devlin et al., 2019; Wolf et al., 2020). Pada penelitian ini, tahap adaptasi dievaluasi dalam dua jalur: *Model A (Feature Extraction)* yang membekukan parameter BERT dan hanya melatih *classifier head*, serta *Model B (End-to-End Fine-Tuning)* yang mengupdate seluruh 110 juta parameter BERT secara serentak.

## **2.6.** ***Transfer Learning* dalam NLP** 

*Transfer learning* merupakan pendekatan yang memanfaatkan pengetahuan yang telah dipelajari model pada suatu tugas untuk diterapkan pada tugas lain yang terkait. Dalam NLP, pendekatan ini umumnya dilakukan melalui dua tahap utama, yaitu: 

1. *Pre-training*, yaitu pelatihan model pada korpus teks besar untuk mempelajari representasi bahasa umum. 

2. *Fine-tuning*, yaitu penyesuaian model pada dataset spesifik sesuai tugas yang dihadapi. 

Pendekatan ini terbukti efektif dalam meningkatkan performa model, terutama ketika data berlabel terbatas. Penelitian oleh Howard dan Ruder (2018) menunjukkan bahwa *fine-tuning* model bahasa dapat mencapai performa tinggi bahkan dengan jumlah data yang relatif kecil. 

## **2.7.** ***Feature Extraction* vs *Fine-Tuning* pada BERT** 

Dalam adaptasi model BERT ke tugas klasifikasi teks, terdapat dua pendekatan utama, yaitu: 

1. ***Feature-Based Approach* (*Feature Extraction*)**
 Pada pendekatan ini, parameter *transformer encoder* BERT dibekukan (*frozen*) dan berfungsi murni sebagai ekstraktor fitur kontekstual. Representasi token `[CLS]` (768 dimensi) kemudian diteruskan sebagai input bagi *classifier head* linear.

2. ***Fine-Tuning Approach***
 Pada pendekatan ini, seluruh parameter model BERT (~110 juta parameter) dilatih ulang secara bersama-sama dengan *classification head* untuk menyesuaikan representasi internal terhadap tugas spesifik.

Studi eksperimental oleh Sun et al. (2019) serta Hao et al. (2020) menunjukkan bahwa proses *fine-tuning* tidak hanya menyesuaikan output model, tetapi juga mengubah representasi internal, khususnya pada mekanisme *attention* di lapisan akhir serta fitur pada lapisan menengah. Selain itu, *fine-tuning* secara umum menunjukkan performa yang lebih baik dibandingkan pendekatan *feature-based*, meskipun memerlukan sumber daya komputasi yang lebih tinggi. 

## **2.8. Dataset SST-2 (** ***Stanford Sentiment Treebank*)** 

Dataset yang digunakan dalam penelitian ini adalah *Stanford Sentiment Treebank* (SST-2) yang diperkenalkan oleh Socher et al. (2013). Dataset ini terdiri dari kalimat-kalimat ulasan film yang diberi label sentimen positif atau negatif. 

SST-2 merupakan bagian dari *benchmark* GLUE dan telah menjadi standar evaluasi dalam penelitian klasifikasi teks. Dataset ini memungkinkan evaluasi model dalam memahami komposisionalitas makna dalam kalimat, termasuk efek negasi dan struktur linguistik lainnya. 

## **2.9. Metode Evaluasi Klasifikasi** 

Evaluasi performa model klasifikasi teks berbasis *deep learning* secara komprehensif tidak cukup hanya mengandalkan satu metrik prediktif tunggal, melainkan membutuhkan kerangka evaluasi kuantitatif multidimensi dari matriks kontingensi (*confusion matrix*) serta pengujian perilaku linguistik (*behavioral testing*). Hal ini penting untuk memberikan gambaran komprehensif mengenai ketepatan, sensitivitas, keseimbangan performa, dan ketahanan model terhadap variasi struktur bahasa.

Kerangka evaluasi metrik prediktif ini didasarkan pada formulasi standar evaluasi klasifikasi oleh Sokolova dan Lapalme (2009) serta survei evaluasi pemrosesan teks oleh Minaee et al. (2021). Evaluasi dihitung berdasarkan empat elemen *confusion matrix*, yaitu *True Positive* ($TP$), *True Negative* ($TN$), *False Positive* ($FP$), dan *False Negative* ($FN$). Adapun metrik evaluasi yang digunakan dalam penelitian ini meliputi:

1. **Akurasi (*Accuracy*)**
   Mengukur proporsi total prediksi yang benar terhadap keseluruhan jumlah sampel data uji.
   $$\text{Accuracy} = \frac{TP + TN}{TP + TN + FP + FN}$$

2. ***Precision***
   Mengukur tingkat ketepatan model dalam memprediksi kelas positif, yaitu rasio antara sampel positif yang diprediksi benar terhadap seluruh sampel yang diprediksi positif.
   $$\text{Precision} = \frac{TP}{TP + FP}$$

3. ***Recall* (Sensitivitas)**
   Mengukur kemampuan model dalam mengidentifikasi seluruh sampel yang berlabel positif aktual.
   $$\text{Recall} = \frac{TP}{TP + FN}$$

4. ***F1-Score***
   Rata-rata harmonis (*harmonic mean*) antara *precision* dan *recall* yang memberikan ukuran keseimbangan performa model, terutama ketika mengevaluasi trade-off antara ketepatan dan cakupan prediksi (Sokolova & Lapalme, 2009).
   $$\text{F1-score} = 2 \times \frac{\text{Precision} \times \text{Recall}}{\text{Precision} + \text{Recall}} = \frac{2 \cdot TP}{2 \cdot TP + FP + FN}$$

5. ***Error Analysis* Berbasis Kategori Linguistik**
   Untuk melengkapi metrik prediktif numerik, penelitian ini mengadopsi pendekatan *behavioral testing* yang dikembangkan oleh Ribeiro et al. (2020) (*CheckList*). Analisis ini bertujuan mengidentifikasi kelemahan spesifik model pada 5 fenomena struktur bahasa (kalimat tanpa negasi, negasi biner, ironi/sarkasme, ulasan panjang, dan ambiguitas tinggi).

## **2.10. Metode Statistik Inferensial** 

Untuk memastikan bahwa perbedaan performa antar model signifikan secara statistik dan bukan disebabkan oleh variansi acak, penelitian ini menerapkan empat metode statistik inferensial: 

1. ***McNemar’s Test***
 Menguji perbedaan proporsi kesalahan klasifikasi biner pada data sampel berpasangan (*Held-out Test Set*) (McNemar, 1947; Dror et al., 2018).
2. ***Wilcoxon Signed-Rank Test***
 Uji non-parametrik untuk membandingkan median perbedaan performa F1-score antar model dari $n=6$ *random seed* (Wilcoxon, 1945; Dror et al., 2018).
3. ***Bootstrap Confidence Interval***
 Metode *resampling* (10.000 kali) untuk mengestimasi interval kepercayaan 95% dari selisih performa tanpa asumsi distribusi tertentu (Efron, 1979).
4. ***Cohen’s d***
 Mengukur ukuran efek (*effect size*) numerik dari perbedaan performa antar kedua model (Cohen, 1988).

## **2.11. Arsitektur Aplikasi Web, REST API, dan Progressive Web App (PWA)**

Pengembangan produk aplikasi web sistem berbasis *machine learning* secara profesional tidak hanya berfokus pada fungsionalitas inferensi, tetapi juga membutuhkan arsitektur terpisah (*decoupled architecture*) dan redundansi infrastruktur agar layanan tetap stabil, responsif, dan mudah dipelihara secara berkelanjutan. Argumen ini didasarkan pada prinsip rekayasa sistem *machine learning* yang diidentifikasi oleh Sculley et al. (2015) serta pola *web engineering* terdistribusi yang direkomendasikan oleh Pressman dan Maxim (2020) dan sejalan dengan pengembangan aplikasi web oleh Hariani dan Sari (2021) di FIKTI UMSU. Oleh karena itu, skripsi ini merancang arsitektur aplikasi web terpisah yang memisahkan lapisan *backend REST API* dan *frontend user interface*:

1. **REST API (Representational State Transfer)**
   Standar komunikasi data berbasis HTTP dengan format JSON. Framework **FastAPI** dimanfaatkan untuk menerima *request* teks dari klien, menjalankan inferensi model PyTorch/BERT, dan mengembalikan *response* label, skor kepercayaan %, serta latensi ms secara *real-time*.
2. **Frontend Web Framework**
 Antarmuka pengguna berbasis *Single Page Application* (SPA) dengan **React** dan **Vite** yang menyajikan tampilan *side-by-side comparator* dan *interactive benchmark dashboard*.
3. **Progressive Web App (PWA)**
 Pendekatan pengembangan web yang menghadirkan pengalaman mirip aplikasi native pada perangkat seluler. PWA mengandalkan dua komponen utama:
 a. **Service Worker**
 Skrip latar belakang yang bertindak sebagai proksi jaringan antara web browser, cache lokal, dan server backend. Komponen ini mengadopsi strategi caching (seperti *Stale-While-Revalidate* dan *Network-First*) untuk menyimpan aset statis dan data respons API lokal, memungkinkan akses offline terhadap data benchmark skripsi.
 b. **Web App Manifest (`manifest.json`)**
 File konfigurasi berformat JSON yang mendefinisikan metadata aplikasi (nama, ikon, warna tema, dan display mode) sehingga aplikasi dapat diinstal langsung ke layar utama (*Add to Home Screen* / A2HS) tanpa melalui App Store atau Play Store.
4. **Pustaka Visualisasi Data (*Recharts*)**
 Penyajian data statistik pada *dashboard* web memanfaatkan pustaka visualisasi berbasis React seperti *Recharts*, yang mendukung pembuatan grafik batang (*bar chart*), grafik radar (*radar chart*), dan komponen visual interaktif lainnya secara deklaratif.
5. **Pustaka Animasi Antarmuka (*Framer Motion*)**
 Untuk meningkatkan kualitas pengalaman pengguna (*user experience*), pustaka *Framer Motion* digunakan untuk menambahkan animasi transisi halaman, efek *scroll reveal* (`whileInView`), serta *micro-interactions* pada komponen antarmuka.
6. **Kontrol Akses Berbasis Peran (*Role-Based Access Control* / RBAC)**
 Mekanisme otorisasi yang membatasi akses fitur tertentu pada aplikasi web berdasarkan peran pengguna yang terotentikasi. Dalam konteks aplikasi web penelitian, RBAC digunakan untuk membedakan hak akses antara pengguna publik dan pengguna terotentikasi (misalnya dosen pembimbing atau penguji) terhadap data *benchmark* statistik.

## **2.12. Penelitian Terdahulu** 

Beberapa penelitian terdahulu yang relevan dengan klasifikasi teks berbasis BERT dan pendekatan *fine-tuning* dirangkum dalam Tabel 2.1. 

**Tabel 2.1 Penelitian Terdahulu** 

|**Peneliti**|**Metode**|**Temuan Utama**|**Keterbatasan**|
|---|---|---|---|
|Qasim et al. (2022)|BERT + *Transfer Learning*|Meningkatkan akurasi klasifikasi teks|Tidak membandingkan *fine-tuning* vs *feature extraction* secara terkontrol|
|Zaman-Khan et al. (2024)|BERT-based Classification|Performa tinggi pada berbagai dataset|Tidak menggunakan uji statistik inferensial|
|Hao et al. (2020)|Analisis *fine-tuning* BERT|*Fine-tuning* mengubah representasi internal model|Tidak fokus pada evaluasi performa klasifikasi|
|Howard & Ruder (2018)|ULMFiT (*Transfer Learning*)|*Fine-tuning* efektif pada data terbatas|Tidak menggunakan arsitektur *Transformer* modern|
|Sun et al. (2019)|Fine-Tuning BERT Klasifikasi Teks|Menganalisis strategi layer & learning rate|Fokus pada fine-tuning tanpa membandingkan feature extraction|
|Ribeiro et al. (2020)|CheckList Behavioral Testing|Evaluasi model NLP dengan pengujian perilaku|Tidak mengukur efisiensi komputasi VRAM & latensi|
|Minaee et al. (2021)|Survei Deep Learning Klasifikasi Teks|Meninjau berbagai model klasifikasi teks|Survei deskriptif tanpa eksperimen komparatif langsung|
|Galke et al. (2024)|Review Komparatif Klasifikasi Teks|Mengevaluasi kemajuan model klasifikasi|Tidak mengintegrasikan produk aplikasi web interaktif|

*Sumber: Hasil Sintesis Literatur Peneliti (2026)*

## **2.13. Research Gap** 

Berdasarkan sintesis penelitian terdahulu, diidentifikasi 6 kesenjangan riset utama yang menjadi dasar dilakukannya studi ini, sebagaimana dirangkum dalam Tabel 2.2. 

**Tabel 2.2 Research Gap** 

|**Aspek**|**Penelitian Sebelumnya**|**Penelitian Ini**|
|---|---|---|
|Perbandingan Model|Tidak ada perbandingan terkontrol|Membandingkan *feature extraction* vs *fine-tuning* secara terkontrol|
|Validasi Statistik|Tidak menggunakan uji inferensial|Menggunakan uji inferensial (*McNemar*, *Wilcoxon*, *Bootstrap CI*, *Cohen's d*)|
|Desain Eksperimen|Tidak terkontrol|Eksperimen terkontrol (dataset & parameter simetris)|
|Evaluasi Komputasi|Fokus pada akurasi saja|Menambahkan efisiensi komputasi (waktu inferensi & VRAM GPU)|
|*Robustness*|*Single run*|Eksperimen *multi-seed* ($n = 6$ seed terkontrol)|
|Output Sistem|Hanya eksplorasi skrip / *notebook*|Produk Aplikasi Web Interaktif (*FastAPI* & *React UI*)|

*Sumber: Hasil Identifikasi Research Gap Peneliti (2026)*

Kesenjangan pada Tabel 2.2 menunjukkan pentingnya merancang eksperimen yang mengisolasi variabel perlakuan, memverifikasi signifikansi perbedaan performa secara statistik, serta menyajikan hasil riset ke dalam bentuk produk aplikasi web yang siap pakai.


## **2.14. Kerangka Konseptual** 

Berdasarkan kesenjangan penelitian yang telah diidentifikasi, diperlukan suatu kerangka konseptual yang mampu menggambarkan hubungan antar variabel secara sistematis serta mendukung perancangan eksperimen yang terkontrol dan pengembangan sistem web. Penelitian ini berfokus pada perbandingan dua pendekatan adaptasi model BERT, yaitu *feature extraction* dan *fine-tuning*. 

Secara konseptual, manipulasi strategi adaptasi model (variabel independen) dihubungkan dengan pengukuran performa prediktif, efisiensi sumber daya komputasi, serta signifikansi statistik inferensial (variabel dependen). Alur hubungan antar komponen variabel dan integrasi produk web dirangkum dalam bagan kerangka konseptual sebagaimana ditunjukkan pada Gambar 2.2. 

```text
+-----------------------------------------------------------------------------------+
| Model Adaptation Strategy |
| * Feature Extraction (Model A) * End-to-End Fine-Tuning (Model B) |
+-----------------------------------------+-----------------------------------------+
 |
 v
+-----------------------------------------------------------------------------------+
| Model Comparison |
| * Model A: BERT (Frozen) -> [CLS] -> Linear (768 -> 2) |
| * Model B: BERT (Trainable) -> BertForSequenceClassification (768 -> 2) |
+-----------------------------------------+-----------------------------------------+
 |
 v
+-----------------------------------------------------------------------------------+
| Evaluation Metrics |
| * Predictive Performance: Accuracy, Precision, Recall, F1-score |
| * Computational Cost: Inference Time (ms/sample), Peak VRAM (MB) |
+-----------------------------------------+-----------------------------------------+
 |
 v
+-----------------------------------------------------------------------------------+
| Statistical Validation |
| McNemar Test | Wilcoxon Test (n=6) | Bootstrap CI | *Cohen's d* |
+-----------------------------------------+-----------------------------------------+
 |
 v
+-----------------------------------------------------------------------------------+
| Web Product Deployment & Application |
| * FastAPI Backend: REST API (Inference, Benchmark, Auth, Health Check) |
| * React/Vite PWA: Beranda, Comparator, Analytics Dashboard (RBAC Protected) |
+-----------------------------------------------------------------------------------+
```
*Gambar 2.2. Diagram Kerangka Konseptual Penelitian*  
*Sumber: Kerangka Konseptual Penelitian Peneliti (2026)*

## **2.15. Hipotesis Penelitian** 

Berdasarkan kerangka konseptual yang telah disusun, penelitian ini bertujuan untuk menguji apakah terdapat perbedaan performa yang signifikan antara dua pendekatan adaptasi model BERT, yaitu *feature extraction* dan *fine-tuning*. Untuk itu, digunakan beberapa metode statistik inferensial guna memastikan validitas hasil secara kuantitatif. Hipotesis statistik dalam penelitian ini dirumuskan sebagaimana disajikan pada Tabel 2.3: 

**Tabel 2.3 Hipotesis Statistik Penelitian** 

|**Metode Uji**|**Hipotesis Nol (H0)**|**Hipotesis Alternatif (H1)**|
|---|---|---|
|*McNemar’s Test*|Tidak terdapat perbedaan yang signifikan dalam proporsi prediksi antara Model A dan Model B (kesalahan bersifat simetris).|Terdapat perbedaan yang signifikan dalam proporsi prediksi antara Model A dan Model B (kesalahan tidak simetris).|
|*Wilcoxon Signed-Rank Test*|Median perbedaan performa F1-score dari $n=6$ seed antara Model A dan Model B adalah nol.|Median perbedaan performa F1-score dari $n=6$ seed antara Model A dan Model B tidak sama dengan nol ($p < 0,05$).|
|*Bootstrap Confidence Interval*|Interval kepercayaan 95% dari selisih performa mencakup nilai nol (tidak signifikan).|Interval kepercayaan 95% dari selisih performa tidak mencakup nilai nol (signifikan).|
|*Cohen’s d* (Effect Size)|Nilai effect size mendekati nol ($d \approx 0$), menunjukkan tidak adanya pengaruh yang berarti.|Nilai effect size berbeda dari nol ($d \ne 0$), menunjukkan adanya pengaruh yang berarti.|

*Sumber: Formulasi Hipotesis Penelitian (2026)*

Berdasarkan Tabel 2.3, seluruh hipotesis dalam penelitian ini dirumuskan untuk menguji perbedaan performa antara Model A dan Model B dari berbagai perspektif statistik. Setiap metode uji digunakan untuk melengkapi analisis, baik dari sisi signifikansi maupun besar pengaruh perbedaan yang dihasilkan. Dengan demikian, pengujian hipotesis tidak hanya bersifat deskriptif, tetapi juga inferensial dan komprehensif. Pendekatan ini diharapkan mampu memberikan hasil yang lebih valid dan dapat dipertanggungjawabkan.


## **BAB III** 

## **METODOLOGI PENELITIAN** 

## **3.1. Pendekatan dan Desain Penelitian** 

Penelitian ini menggunakan pendekatan kuantitatif dengan metode eksperimen. Pendekatan kuantitatif dipilih karena penelitian ini bertujuan untuk menguji hipotesis secara objektif melalui pengukuran numerik dan analisis statistik terhadap performa model klasifikasi teks. Menurut Creswell (2014), penelitian kuantitatif berfokus pada pengujian teori melalui pengukuran variabel dan analisis statistik untuk menentukan hubungan antar variabel. 

Desain penelitian yang digunakan adalah eksperimen komparatif terkontrol (*controlled comparative experiment*), yaitu membandingkan dua perlakuan dalam kondisi yang dikendalikan secara ketat agar perbedaan hasil dapat dihubungkan secara valid pada variabel yang diteliti. Dalam konteks ini, dua perlakuan yang dibandingkan adalah strategi adaptasi model BERT, yaitu *feature extraction* dan *fine-tuning*. Pendekatan ini sejalan dengan prinsip desain eksperimen yang menekankan kontrol terhadap variabel perancu untuk meningkatkan validitas inferensi kausal sebagaimana dijelaskan oleh Shadish et al. (2002) dalam teori validitas eksperimen. Selain itu, penelitian ini diakhiri dengan tahap rekayasa sistem (*system engineering*) untuk mengimplementasikan model ke dalam produk aplikasi web interaktif.

## **3.2. Variabel Penelitian** 

Berdasarkan desain penelitian yang telah dijelaskan pada subbab sebelumnya, penelitian ini melibatkan tiga jenis variabel, yaitu variabel independen, variabel dependen, dan variabel kontrol. Variabel independen adalah strategi adaptasi model BERT yang terdiri dari dua kondisi, yaitu *feature extraction* dan *fine-tuning end-to-end*. Variabel dependen berupa performa model klasifikasi teks yang diukur menggunakan metrik prediktif (akurasi, *precision*, *recall*, dan *F1-score*), efisiensi komputasi (waktu inferensi dan VRAM GPU), serta unjuk kerja latensi pada aplikasi web. 

Untuk menjaga konsistensi dan validitas eksperimen, beberapa variabel dikontrol, meliputi arsitektur model yang digunakan (BERT *Base Uncased*), dataset (SST-2), skema pembagian data, parameter pelatihan (*batch size*, *learning rate schedule*), serta lingkungan komputasi. Ringkasan klasifikasi variabel dalam penelitian ini disajikan pada Tabel 3.1. 

**Tabel 3.1. Variabel Penelitian** 

|**Jenis Variabel**|**Nama Variabel**|**Deskripsi**|
|---|---|---|
|Variabel Independen|Strategi Adaptasi Model BERT|Variabel yang dimanipulasi dalam penelitian, terdiri dari dua kondisi, yaitu penggunaan BERT sebagai *feature extraction* (parameter dibekukan) dan BERT dengan *fine-tuning end-to-end* (seluruh parameter dilatih ulang).|
|Variabel Dependen|Performa Prediktif Model|Metrik numerik meliputi akurasi, *precision*, *recall*, dan *F1-score* untuk mengevaluasi kemampuan model dalam klasifikasi teks.|
|Variabel Dependen|Efisiensi Komputasi & Latensi Web|Waktu inferensi (ms/sampel), penggunaan memori GPU VRAM *peak* (MB), serta latensi respons API pada aplikasi web.|
|Variabel Kontrol|Arsitektur Model|Menggunakan arsitektur yang sama, yaitu BERT *Base Uncased* (`bert-base-uncased`), untuk memastikan konsistensi eksperimen.|
|Variabel Kontrol|Dataset & Skema Partitioning|Dataset SST-2 dari GLUE benchmark dengan pembagian data latih internal (60.614), validasi internal (6.735), dan *held-out test set* terisolasi (872).|
|Variabel Kontrol|Pengaturan Multi-Seed|Penggunaan 6 *random seed* yang terkontrol ($n=6$, yaitu 42, 123, 777, 999, 1234, dan 2024).|
|Variabel Kontrol|Batch Size & Hyperparameter|Batch size pelatihan dan inferensi dijaga seragam pada nilai 32 untuk kedua konfigurasi model.|
|Variabel Kontrol|Lingkungan Komputasi|Eksperimen dijalankan pada GPU NVIDIA A100 (40 GB VRAM) pada Google Colab untuk perbandingan yang adil.|

*Sumber: Operasionalisasi Variabel Peneliti (2026)*

## **3.3. Lokasi dan Waktu Penelitian** 

Penelitian ini dilaksanakan secara komputasional menggunakan *platform* *Google Colab* sebagai lingkungan eksperimen berbasis *cloud computing* dan lingkungan lokal/cloud server untuk *deployment* aplikasi web. Seluruh proses penelitian, mulai dari pemrosesan data hingga evaluasi model dan *deployment* web, dilakukan secara daring. Pendekatan ini memungkinkan fleksibilitas dalam penggunaan sumber daya komputasi sekaligus mendukung *reproducibility* eksperimen. 

Waktu penelitian direncanakan berlangsung selama tiga bulan, yang mencakup tahap studi literatur, perancangan eksperimen, implementasi model, evaluasi hasil, pengembangan aplikasi web, serta penyusunan laporan akhir. Rincian jadwal penelitian telah disusun secara sistematis sebagaimana ditampilkan pada Tabel 3.2. 

**Tabel 3.2. Jadwal Penelitian** 

|**No**|**Kegiatan Penelitian**|**Bulan 1**|**Bulan 2**|**Bulan 3**|
|---|---|---|---|---|
|1|Studi literatur|✓|||
|2|Perumusan masalah & tujuan penelitian|✓|||
|3|Pengumpulan dan pemahaman dataset SST-2|✓|||
|4|Pra-pemrosesan data & re-partitioning dataset|✓|✓||
|5|Implementasi Model A (Feature Extraction)||✓||
|6|Implementasi Model B (Fine-tuning)||✓||
|7|Eksperimen multi-seed dan pelatihan model||✓||
|8|Evaluasi performa model & analisis statistik|||✓|
|9|Pengembangan Produk Aplikasi Web (FastAPI & React)|||✓|
|10|Penyusunan laporan akhir|||✓|

*Sumber: Perencanaan Pelaksanaan Penelitian (2026)*

## **3.4. Lingkungan Penelitian** 

Eksperimen dalam penelitian ini dijalankan menggunakan GPU NVIDIA A100 Tensor Core GPU dengan kapasitas memori 40 GB yang tersedia pada *platform Google Colab*. Pemilihan akselerasi komputasi GPU ini penting untuk mempercepat proses pelatihan dan evaluasi model Transformer berskala besar. *Pipeline* penelitian dibangun menggunakan bahasa pemrograman Python 3.x dengan *framework* utama PyTorch dan pustaka Hugging Face *Transformers* (Wolf et al., 2020). Pemilihan lingkungan ini didasarkan pada kebutuhan komputasi model *deep learning* yang tinggi serta dukungan ekosistem yang luas untuk implementasi model berbasis Transformer, sebagaimana ditekankan pada riset optimasi komputasi dan pengenalan pola di FIKTI UMSU (Al-Khowarizmi et al., 2023).

Pustaka *Transformers* menyediakan akses ke model BERT yang telah di-*pre-train* serta *utilities* untuk tokenisasi, *fine-tuning*, dan evaluasi secara terstandar. Untuk tahap integrasi dan *deployment* produk, pengembangan aplikasi web menggunakan *FastAPI* sebagai *framework REST API* pada *backend* dan *React / Vite* sebagai *framework* antarmuka pengguna pada *frontend*.

## **3.5. Dataset Penelitian** 

Dataset yang digunakan adalah SST-2 yang merupakan bagian dari *benchmark* GLUE. Dataset ini terdiri dari kalimat berbahasa Inggris yang diklasifikasikan ke dalam dua label sentimen, yaitu positif dan negatif (Socher et al., 2013). Untuk menghindari kebocoran data (*data leakage*) serta kebingungan akibat tidak tersedianya label publik pada data uji resmi GLUE SST-2, penelitian ini menerapkan skema *re-partitioning* yang ketat:

1. Data latih resmi SST-2 (67.349 sampel) dibagi secara acak terstrata menjadi **Data Latih Internal** (60.614 sampel / 90%) untuk pembaruan bobot model, dan **Data Validasi Internal** (6.735 sampel / 10%) untuk validasi performa iterasi dan penalaan *hyperparameter*.
2. Data validasi resmi SST-2 (872 sampel) difungsikan murni sebagai **Held-out Test Set** (data uji terisolasi) tanpa *backpropagation autograd* yang dievaluasi pada ke-6 *trained checkpoint* ($n=6$) pada tahap evaluasi akhir untuk mengukur kemampuan generalisasi model, memperoleh metrik agregat ($Mean \pm \sigma$), serta menyediakan data pasangan untuk pengujian statistik inferensial.

Jumlah data pada masing-masing subset ditunjukkan pada Tabel 3.3. 

**Tabel 3.3. Distribusi Data pada Dataset SST-2** 

|**Subset Data**|**Jumlah Baris**|**Fungsi / Peranan dalam Penelitian**|
|---|---|---|
|Train (Internal)|60.614|Pelatihan dan pembaruan bobot parameter model|
|Validation (Internal)|6.735|Validasi performa iterasi dan penalaan *hyperparameter*|
|Held-out Test Set|872|Evaluasi akhir performa prediktif & uji statistik|
|**Total Digunakan**|**68.221**|**Total sampel berlabel aktif**|

*Sumber: Diolah dari Dataset SST-2 (Socher et al., 2013; Wang et al., 2018)*

## **3.6. Pra-Pemrosesan Data** 

Proses data *preparation* dilakukan untuk menyesuaikan format data teks mentah dengan kebutuhan arsitektur model BERT. Tahap ini meliputi proses tokenisasi menggunakan *tokenizer* BERT (*bert-base-uncased*), yang mengubah teks menjadi representasi token ID sesuai dengan *vocabulary* model. 

Selanjutnya dilakukan *padding* dan *truncation* untuk memastikan panjang input seragam sesuai dengan batas maksimum panjang sekuens ($max\*length = 128$). Data kemudian dikonversi ke dalam PyTorch `Tensor` yang mencakup *input IDs*, *attention mask*, dan *token type IDs*.

## **3.7. Desain Eksperimen** 

Penelitian ini dirancang sebagai eksperimen komparatif terkontrol yang membandingkan dua strategi adaptasi model BERT dalam tugas klasifikasi teks. Kedua model dikembangkan dengan arsitektur dasar yang sama (`bert-base-uncased`), namun dibedakan berdasarkan mekanisme pelatihan yang digunakan:

1. **Model A (Feature Extraction)**
 Seluruh parameter 12 lapisan *transformer encoder* BERT dibekukan (*frozen*). Output token `[CLS]` (768 dimensi) diteruskan secara langsung ke *classification head* berupa `Linear(768 -> 2)`. Hanya parameter pada *linear layer* (1.538 parameter) yang diperbarui selama proses pelatihan.
2. **Model B (End-to-End Fine-Tuning)**
 Seluruh parameter BERT (~110 juta parameter) dilatih ulang secara bersamaan dengan *classification head* `Linear(768 -> 2)` melalui kelas `BertForSequenceClassification`.

Perbandingan diagramatis struktur arsitektur dan alur komputasi antara Model A (*Feature Extraction*) dan Model B (*End-to-End Fine-Tuning*) disajikan pada Gambar 3.1:

```text
+--------------------------------------------------------------------------------------------------+
| ARSITEKTUR KOMPARATIF MODEL |
+--------------------------------------------------+-----------------------------------------------+
| MODEL A (FEATURE EXTRACTION) | MODEL B (FINE-TUNING END-TO-END) |
+--------------------------------------------------+-----------------------------------------------+
| | |
| [Input Text: "The movie was engaging"] | [Input Text: "The movie was engaging"] |
| | | | |
| v | v |
| [BertTokenizerFast: max*length=128] | [BertTokenizerFast: max*length=128] |
| | | | |
| v | v |
| +--------------------------------------------+ | +--------------------------------------------+
| | BERT-Base Encoder (12 Layers) | | | BERT-Base Encoder (12 Layers) |
| | Status: FROZEN (Parameter Dibekukan) | | | Status: TRAINABLE (Fine-Tuning) |
| | Gradient: requires*grad = False | | | Gradient: requires*grad = True |
| +--------------------------------------------+ | +--------------------------------------------+
| | | | |
| v | v |
| [Output Vector Token [CLS]: 768 dimensi] | [Output Vector Token [CLS]: 768 dimensi] |
| | | | |
| v | v |
| +--------------------------------------------+ | +--------------------------------------------+
| | Linear Classification Head (768 -> 2) | | | BertForSequenceClassification Head |
| | Status: TRAINABLE (~1.538 Parameters) | | | Status: TRAINABLE (~110 Juta Parameters) |
| +--------------------------------------------+ | +--------------------------------------------+
| | | | |
| v | v |
| [Softmax Probabilities & Predicted Class] | [Softmax Probabilities & Predicted Class] |
| | |
+--------------------------------------------------+-----------------------------------------------+
```
*Gambar 3.1. Diagram Arsitektur Komparatif Model A (Feature Extraction) vs Model B (End-to-End Fine-Tuning)*  
*Sumber: Desain Arsitektur Model Peneliti (2026)*

Untuk memastikan transparansi, reproduktibilitas, dan kesetaraan perlakuan eksperimen (*fair baseline*), konfigurasi parameter yang digunakan pada kedua model dirangkum dalam Tabel 3.4.

**Tabel 3.4. Parameter Penelitian** 

|**Parameter**|**Model A (Feature Extraction)**|**Model B (Fine-Tuning)**|
|---|---|---|
|Arsitektur BERT|`bert-base-uncased`|`bert-base-uncased`|
|Tokenizer|`BertTokenizerFast`|`BertTokenizerFast`|
|Max Sequence Length|128|128|
|Train Batch Size|32|32|
|Eval Batch Size|32|32|
|Representasi Input|Token [CLS] (768 dimensi)|Token [CLS] (768 dimensi)|
|Classifier Head|Linear(768 → 2)|Linear(768 → 2)|
|Loss Function|CrossEntropyLoss|CrossEntropyLoss|
|Random Seed|42, 123, 777, 999, 1.234, 2024 ($n=6$)|42, 123, 777, 999, 1.234, 2024 ($n=6$)|
|Status Parameter BERT|Frozen (dibekukan, tidak diperbarui)|Trainable (dilatih end-to-end)|
|Jumlah Parameter yang Dilatih|~1.538 parameter (hanya classification head)*|~110.000.000 parameter (seluruh model)|
|Persentase Parameter yang Dilatih|~0,0014% dari total parameter*|100% dari total parameter|
|Optimizer|AdamW|AdamW|
|Learning Rate|1e-3|2e-5|
|Weight Decay|0,01|0,01|
|Warmup Ratio|0,1|0,1|
|*Early Stopping*|Validation F1 (*Patience* = 3)|Validation F1 (*Patience* = 3)|
|Maksimum Epoch|10 epoch|5 epoch|

*Sumber: Spesifikasi Konfigurasi Eksperimen Peneliti (2026)*

* Catatan Kaki: Jumlah parameter Model A dihitung dari Linear(768 → 2): $768 \times 2 + 2 = 1.538$ parameter. Total parameter BERT base adalah 110.000.000, sehingga hanya ~0,0014% parameter yang dilatih.*

Untuk Model A, jumlah epoch ditetapkan lebih tinggi (10 epoch) mengingat hanya *classification head* yang dilatih, sehingga memerlukan lebih banyak iterasi untuk konvergensi. Untuk Model B, penentuan jumlah epoch mengacu pada temuan Liu et al. (2019) dan Sun et al. (2019) yang menunjukkan bahwa *fine-tuning* BERT secara *end-to-end* umumnya mencapai konvergensi pada 3–5 epoch, serta Dodge et al. (2020) yang merekomendasikan penggunaan *early stopping* untuk mencegah *overfitting* pada model bahasa yang telah di-*pre-train*.

### **3.7.1. Early Stopping**

Untuk mencegah *overfitting* dan memastikan pemilihan model optimal, penelitian ini menerapkan mekanisme *early stopping* dengan kriteria:
a. **Metric yang dimonitor**
 *Validation F1-score*
b. **Mode**
 *Maximize* (meningkatkan performa)
c. ***Patience***
 3 epoch (jika tidak terjadi peningkatan selama 3 epoch berturut-turut)
d. ***Restore best weights***
 Ya (kembali ke bobot terbaik setelah *early stopping*)

Penerapan *early stopping* ini memastikan bahwa model yang digunakan untuk evaluasi akhir adalah model dengan performa validasi terbaik, bukan sekadar model pada epoch terakhir. Penelitian oleh Dodge et al. (2020) menunjukkan bahwa performa *fine-tuning* model bahasa sangat dipengaruhi oleh faktor-faktor seperti inisialisasi bobot, urutan data, dan strategi *early stopping*. Berdasarkan rekomendasi tersebut, penelitian ini menerapkan mekanisme *early stopping* dengan *patience = 3 epoch* untuk memastikan pemilihan model optimal tanpa *overfitting*.

## **3.8. Prosedur Eksperimen** 

Prosedur eksperimen dilaksanakan secara sistematis mengikuti tahapan-tahapan sebagaimana diilustrasikan pada Gambar 3.2:

```text
+-----------------------------------------------------------------------------------+
| START EXPERIMENT |
+-----------------------------------------+-----------------------------------------+
 |
 v
+-----------------------------------------------------------------------------------+
| Data Preparation |
| SST-2 Dataset Partitioning: Train (60.614), Val (6.735), Held-out Test (872) |
| BertTokenizerFast (lowercase, truncation max*len=128, padding, attention*mask) |
+-----------------------------------------+-----------------------------------------+
 |
 v
+-----------------------------------------------------------------------------------+
| Multi-Seed Training Loop (n=6) |
| Seeds: [42, 123, 777, 999, 1.234, 2024] |
| Model A: Freeze BERT Encoder + Train Classifier Head (Maks. 10 Epochs) |
| Model B: End-to-End Fine-Tune BERT + Classifier (Maks. 5 Epochs, Early Stopping) |
+-----------------------------------------+-----------------------------------------+
 |
 v
+-----------------------------------------------------------------------------------+
| Held-Out Test Evaluation |
| Metrics: Accuracy, Precision, Recall, F1-Score |
| Computation: Inference Time per Sample (ms) & Peak GPU VRAM (MB) |
+-----------------------------------------+-----------------------------------------+
 |
 v
+-----------------------------------------------------------------------------------+
| Statistical Analysis |
| McNemar Test (Contingency Table) | *Wilcoxon Signed-Rank Test* (n=6 F1 scores) |
| Bootstrap 95% Confidence Interval | *Cohen's d* Effect Size |
+-----------------------------------------+-----------------------------------------+
 |
 v
+-----------------------------------------------------------------------------------+
| Model Export & Web Product Integration |
| Export PyTorch Model Checkpoints & Pre-computed Benchmarks JSON |
| Build FastAPI REST API Engine & React UI (Comparator & Benchmark Dashboard) |
+-----------------------------------------+-----------------------------------------+
 |
 v
+-----------------------------------------------------------------------------------+
| END OF EXPERIMENT |
+-----------------------------------------------------------------------------------+
```
*Gambar 3.2. Diagram Alur Prosedur Eksperimen Multi-Seed*  
*Sumber: Alur Prosedur Eksperimen Peneliti (2026)*

Rincian alur prosedur eksperimen dilaksanakan melalui langkah-langkah berikut:
1. **Seleksi Checkpoint Model Deployment**
   Pilih *checkpoint* model dengan *validation F1-score* tertinggi pada Data Validasi Internal dari 6 *seed* untuk disimpan sebagai artefak bobot produksi yang di-*deploy* ke aplikasi web.
2. **Evaluasi Held-out Test Set Multi-Seed ($n=6$)**
   Evaluasi ke-6 *trained checkpoint* ($n=6$ *seed*) pada *Held-out Test Set* (872 sampel) secara terisolasi murni tanpa *gradient update/backpropagation* untuk mengukur kemampuan generalisasi, menghitung rerata metrik ($Mean \pm \sigma$), serta menyediakan distribusi data berpasangan untuk Uji Wilcoxon dan Bootstrap 95% CI.
3. **Ekspor Model & Data Benchmark**
   Simpan *checkpoint* terbaik terpilih untuk *deployment* aplikasi web dan ekspor seluruh log metrik *benchmark* ke basis data.

## **3.9. Teknik Analisis Data** 

### **3.9.1. Uji Statistik Inferensial** 

Uji statistik digunakan untuk menentukan apakah perbedaan performa antara Model A dan Model B signifikan secara statistik atau sekadar variasi acak:

1. ***McNemar’s Test***
 Digunakan pada level prediksi sampel individu pada *Held-out Test Set* (872 sampel) untuk menguji apakah perbedaan proporsi kesalahan klasifikasi bersifat simetris atau asimetris (McNemar, 1947; Dror et al., 2018). Matriks kontingensi $2 \times 2$ dibangun secara khusus dari pasangan prediksi sampel pada *seed* acuan utama (*Seed 42*), yang menghasilkan statistik $\chi^2$ dan nilai $p$-value.
2. ***Wilcoxon Signed-Rank Test***
 Digunakan pada level agregat untuk membandingkan distribusi F1-score yang diperoleh dari 6 run *random seed* ($n=6$) (Wilcoxon, 1945; Dror et al., 2018). Dengan $n=6$, nilai $p$-value secara teoritis dapat mencapai $p < 0,05$ (nilai minimum $p = 0,03125$), sehingga uji signifikansi statistik non-parametrik berpasangan menjadi valid.
3. ***Bootstrap Confidence Interval***
 Menggunakan metode *resampling* dengan pengulangan 10.000 kali (*10,000 bootstrap resamples*) untuk menghitung interval kepercayaan 95% dari perbedaan nilai F1-score antar model (Efron, 1979).
4. ***Cohen’s d***
 Mengukur ukuran efek (*effect size*) dari perbedaan performa prediktif untuk menilai seberapa besar pengaruh praktis dari perlakuan *fine-tuning* (Cohen, 1988).

#### **Keterbatasan Statistik dengan $n=6$**

Penggunaan $n=6$ *random seed* memberikan nilai minimum $p$-value teoritis sebesar 0,03125 untuk *Wilcoxon Signed-Rank Test* ($2⁵ = 32$ kemungkinan tanda). Meskipun nilai ini masih di bawah ambang signifikansi $\alpha = 0,05$, kekuatan statistik (*statistical power*) dari uji ini terbatas. Untuk mengkompensasi keterbatasan ini, penelitian ini menggunakan tiga strategi:

a. **Kombinasi Metode Uji**
 Penggunaan *McNemar Test* (berbasis 872 sampel individual), *Bootstrap CI* (10.000 *resamples*), dan *Cohen's d* (*effect size*) memberikan validasi komplementer yang tidak bergantung pada $n=6$ saja.
b. **Interpretasi Konservatif**
 Keputusan signifikan secara statistik hanya diambil jika seluruh empat metode uji menunjukkan konsistensi ($p < 0,05$ untuk *McNemar* dan *Wilcoxon*, CI tidak mencakup nol, dan $|d| > 0,2$).
c. ***Acknowledgement* Eksplisit**
 Keterbatasan ini diakui secara eksplisit dalam Bab V sebagai salah satu keterbatasan penelitian dan direkomendasikan untuk studi lanjutan dengan $n \ge 15$.
d. **Analisis Sensitivitas *Jackknife Resampling***
 Untuk memverifikasi stabilitas kesimpulan *Wilcoxon Test* pada sampel $n=6$, diterapkan analisis sensitivitas berbasis *Jackknife resampling* (menghitung ulang uji signifikansi pada 6 kombinasi *subset* 5-of-6 seed). Jika seluruh *subset* menghasilkan $p < 0,05$, maka kesimpulan statistik dinyatakan *robust* dan tidak peka terhadap pencilan *seed* tunggal.

### **3.9.2. Evaluasi *Trade-off* Komputasi** 

Evaluasi *trade-off* komputasi dirancang untuk mengukur efisiensi penggunaan sumber daya perangkat keras dan latensi inferensi pada dua moda arsitektur backend (*Dual-Backend Architecture*: GPU Primary & CPU Fallback):

1. **Waktu Inferensi Lingkungan GPU (Primary Server / NVIDIA A100 GPU)**
 Diukur secara presisi pada lingkungan server GPU menggunakan instrumen PyTorch *`torch.cuda.synchronize()`* dan `torch.cuda.Event(enable*timing=True)` untuk menjamin akurasi pengukuran latensi eksekusi di GPU NVIDIA A100 GPU tanpa terdistorsi oleh sifat eksekusi asinkron CUDA.
2. **Waktu Inferensi Lingkungan CPU (Fallback Server / Cloud CPU)**
 Diukur menggunakan rata-rata *wall-clock time* dari 50 iterasi inferensi setelah 5 iterasi *warm-up* untuk menghilangkan *cold-start penalty* alokasi *thread* CPU, sebagai *baseline* efisiensi saat terjadi *failover* ke server pencadangan.
3. **Penggunaan Memori VRAM GPU (MB)**
 Pengukuran VRAM dilakukan dengan dua pendekatan komplementer pada dua fase komputasi utama (Fase Pelatihan / *Training Phase* dan Fase Inferensi / *Production Inference Phase*):

 a. **Peak Allocated Memory**
 Menggunakan `torch.cuda.max_memory_allocated()` untuk mencatat puncak alokasi memori dinamis oleh PyTorch selama fase pelatihan batch (*backpropagation autograd* & pembaruan bobot AdamW) dan fase inferensi batch (`batch_size = 32`). Metrik ini mengukur memori yang benar-benar dialokasikan oleh tensor PyTorch pada kedua fase tersebut untuk menganalisis pembebasan *gradient buffer* dan *optimizer state*.

 b. **Peak Reserved Memory**
 Menggunakan `torch.cuda.max_memory_reserved()` untuk mencatat puncak memori yang dicadangkan (*reserved*) oleh *CUDA caching allocator*. Metrik ini mencakup memori yang belum dialokasikan tetapi telah direservasi.

 Kedua nilai dicatat menggunakan fungsi `torch.cuda.reset_peak_memory_stats()` sebelum setiap pengukuran batch untuk memastikan *reset* yang akurat. Perbedaan antara *allocated* dan *reserved* memberikan indikasi efisiensi *caching* PyTorch.

 Kode implementasi yang digunakan:
 ```python torch.cuda.reset*peak*memory*stats()
 with torch.no*grad():
 outputs = model(input*ids, attention*mask=attention*mask)
 peak*allocated = torch.cuda.max*memory*allocated() / (1024 ** 2) # MB peak*reserved = torch.cuda.max*memory*reserved() / (1024 ** 2) # MB
 ```

 Hasil utama yang dilaporkan dalam tabel perbandingan eksperimen adalah *peak allocated memory* (MB), mengikuti praktik standar dalam literatur evaluasi efisiensi model (Treviso et al., 2023).

### **3.9.3. Error Analysis Berbasis Kategori Linguistik**

*Error analysis* dilakukan menggunakan pendekatan *behavioral testing* (Ribeiro et al., 2020) dengan klasifikasi otomatis berbasis aturan (*rule-based categorization*) untuk mengidentifikasi pola kesalahan prediksi.

Definisi operasional kelima kategori disajikan pada Tabel 3.6:

**Tabel 3.6 Definisi Operasional Kategori Linguistik *Error Analysis***

|**No**|**Kategori**|**Definisi**|**Deteksi**|**Contoh**|
|---|---|---|---|---|
|1|Tanpa Negasi (*Standard Sentences*)|Kalimat yang tidak mengandung kata negasi eksplisit.|Tidak mengandung token negasi: *not*, *n't*, *no*, *never*, *neither*, *nor*, *without*, *none*, *nobody*, *nothing*.|*"The movie was fantastic and engaging"*.|
|2|Negasi Biner (*Simple Negation*)|Kalimat yang mengandung tepat satu partikel negasi langsung.|Hitungan token negasi = 1.|*"I did not enjoy this film"*.|
|3|Ironi/Sarkasme dan Negasi Majemuk (*Double Negation & Contrastive*)|Kalimat dengan lebih dari satu negasi atau struktur kontradiktif.|Hitungan token negasi > 1 ATAU mengandung kata *contrastive marker*: *but*, *although*, *despite*, *however*, *yet*.|*"It's not that I hated it, but I didn't love it either"*.|
|4|Review Panjang (*Long Sequences*)|Kalimat dengan panjang token di atas 40 (setelah tokenisasi).|Jumlah token hasil tokenisasi > 40.|Kalimat dengan lebih dari 40 token (biasanya ulasan detail).|
|5|Ambiguitas Tinggi (*High Ambiguity / Mixed Sentiment*)|Kalimat yang mengandung kata-kata positif dan negatif secara bersamaan.|Mengandung minimal 1 kata positif dan 1 kata negatif dari leksikon AFINN (Nielsen, 2011) dengan *threshold* skor $\ge +3$ dan $\le -3$.|*"The acting was brilliant but the plot was disappointing"*.|

*Sumber: Adaptasi dari Ribeiro et al. (2020) & Nielsen (2011)*

Untuk deteksi sentimen campuran (*Mixed Sentiment*) pada kategori 5, penelitian ini menggunakan leksikon AFINN yang dikembangkan oleh Nielsen (2011). AFINN menyediakan skor sentimen untuk kata-kata dalam rentang -5 (sangat negatif) hingga +5 (sangat positif). Suatu kalimat dikategorikan sebagai 'Ambiguitas Tinggi' apabila mengandung setidaknya satu kata dengan skor $\ge +3$ (positif kuat) dan satu kata dengan skor $\le -3$ (negatif kuat), mengindikasikan adanya kontradiksi sentimen dalam kalimat yang sama. Untuk memastikan keandalan pengelompokan, dilakukan validasi silang (*cross-validation*) dengan leksikon VADER (Hutto & Gilbert, 2014) serta audit manual pada 50 sampel acak per kategori.

Dalam skema evaluasi *error analysis*, suatu kalimat dapat terklasifikasikan ke dalam lebih dari satu kategori (kategori tumpang tindih). Analisis dilakukan per kategori secara independen. Untuk setiap kategori $C*k$, akurasi dihitung sebagai rasio prediksi benar terhadap total sampel dalam kategori tersebut, dan disajikan dalam bentuk grafik radar multidimensi pada *dashboard* aplikasi web.

## **3.10. Rancangan Arsitektur Produk Aplikasi Web**

Untuk memenuhi kebutuhan penyajian hasil penelitian yang dapat diakses secara interaktif oleh pengguna, dosen pembimbing, dan dosen penguji, dirancang sebuah produk aplikasi web berbasis *FastAPI* (Backend REST API) dan *React/Vite* (Frontend SPA). Aplikasi ini berfungsi sebagai portal penelitian yang mengintegrasikan inferensi klasifikasi sentimen secara *real-time* dengan *dashboard* visualisasi statistik *benchmark* komparatif.

Pengembangan sistem berbasis *machine learning* tidak hanya berfokus pada performa model, tetapi juga mempertimbangkan aspek rekayasa perangkat lunak seperti pemeliharaan sistem, skalabilitas, dan keandalan (Sculley et al., 2015). Untuk mengintegrasikan model ke dalam produk aplikasi web, penelitian ini memanfaatkan ekosistem Hugging Face *Transformers* (Wolf et al., 2020) untuk memuat model dan *tokenizer* yang telah dilatih, serta PyTorch sebagai *engine* inferensi utama pada *backend* FastAPI. Oleh karena itu, penelitian ini merancang aplikasi web dengan arsitektur modular yang memisahkan *backend* API, *frontend* pengguna, dan basis data untuk memudahkan pemeliharaan dan pengembangan di masa depan.

### **3.10.1. Modul-Modul Sistem**

Sistem aplikasi web dirancang di atas 7 modul perangkat lunak utama yang masing-masing memiliki tanggung jawab sebagai berikut:

1. **Modul *Data Pipeline***
 Bertanggung jawab melakukan pra-pemrosesan data teks input pengguna secara *real-time* menggunakan `BertTokenizerFast` (tokenisasi, *truncation*, *padding*, dan konversi ke *tensor* PyTorch) sebelum diteruskan ke modul inferensi.
2. **Modul *Model Engine***
 Memuat artefak model terlatih (Model A dan Model B) ke dalam memori GPU/CPU pada saat inisialisasi server untuk melakukan inferensi *dual-model* secara paralel berbasis PyTorch murni. Modul ini dilengkapi dengan fitur *PyTorch Explicit CUDA Synchronization* (*`torch.cuda.synchronize()`*) sebelum dan sesudah inferensi untuk menjamin kepastian pengukuran latensi eksekusi di VRAM GPU berakurasi mikrodetik tanpa terdistorsi oleh sifat eksekusi asinkron GPU.
3. **Modul Basis Data**
 Mengelola persistensi data menggunakan ORM *SQLAlchemy* dengan basis data *SQLite* untuk mencatat riwayat prediksi pengguna, menyimpan log *benchmark* multi-*seed*, dan menyimpan hasil pengujian statistik inferensial.
4. **Modul REST API *Service***
 Dibangun dengan *framework FastAPI* untuk menyediakan *endpoint* komunikasi data berbasis format JSON antara *frontend* dan *backend*. Modul ini menangani operasi inferensi, penyajian data *benchmark*, manajemen riwayat prediksi, pemeriksaan kesehatan server, serta autentikasi pengguna.
5. **Modul Autentikasi dan Kontrol Akses (RBAC)**
 Mengimplementasikan sistem *Role-Based Access Control* yang membedakan hak akses antara pengguna publik dan pengguna terotentikasi (dosen pembimbing, dosen penguji, dan peneliti). Halaman *Dashboard* Analitik *Benchmark* dirancang sebagai halaman terlindungi (*protected route*) yang hanya dapat diakses setelah proses autentikasi berhasil.
6. **Modul Pemantauan Kesehatan Jaringan & Perangkat (*Device Status Badge*)**
 Melakukan *polling* berkala (setiap 12 detik) ke *endpoint* `/api/health` untuk memantau status konektivitas dan mengidentifikasi perangkat keras server yang sedang aktif. Sistem secara otomatis menampilkan *Dynamic Status Badge* di *Navbar*: lencana 🟢 **`GPU`** (terhubung ke Colab NVIDIA A100 GPU GPU), lencana 🔵 **`CPU`** (terhubung ke Railway CPU backup), atau lencana 🔴 **`Offline`** (terputus dari kedua backend).
7. **Modul Antarmuka Pengguna (React dengan dukungan PWA)**
 Dibangun dengan *React*, *Tailwind CSS*, *Recharts* (visualisasi data), dan *Framer Motion* (animasi antarmuka). Modul ini menyajikan tiga halaman utama dalam arsitektur *Single Page Application* (SPA) yang dilengkapi kemampuan *Progressive Web App* (PWA) untuk instalasi pada perangkat pengguna.

### **3.10.2. Spesifikasi API *Endpoints***

Backend REST API dirancang untuk menyediakan 7 *endpoint* utama sebagaimana dirangkum dalam Tabel 3.5.

**Tabel 3.5. Spesifikasi API *Endpoints***

|**No**|**Metode**|***Endpoint***|**Deskripsi Fungsi**|
|---|---|---|---|
|1|`GET`|`/api/health`|Memeriksa status kesehatan server dan mengembalikan *timestamp* respons.|
|2|`POST`|`/api/predict`|Menerima input teks kalimat (maks. 500 karakter), menjalankan inferensi *dual-model* (Model A dan Model B) secara simultan, mencatat hasil ke basis data, dan mengembalikan label prediksi, skor kepercayaan (%), serta latensi inferensi (ms) untuk masing-masing model.|
|3|`GET`|`/api/benchmark-stats`|Mengembalikan data ringkasan statistik *benchmark* komparatif dari 6 *run random seed* (rerata dan simpangan baku akurasi, *F1-score*, latensi, VRAM) beserta hasil pengujian statistik inferensial (*McNemar p-value*, *Wilcoxon p-value*, *Bootstrap* 95% CI, dan *Cohen's d*).|

*Sumber: Spesifikasi API Endpoints Backend Peneliti (2026)*
|4|`GET`|`/api/history`|Mengembalikan daftar riwayat pengujian inferensi sentimen terbaru yang tersimpan di basis data, dengan parameter `limit` opsional.|
|5|`DELETE`|`/api/history`|Menghapus seluruh riwayat pengujian inferensi dari basis data.|
|6|`DELETE`|`/api/history/{log*id}`|Menghapus satu entri riwayat pengujian berdasarkan *ID* spesifik.|
|7|`POST`|`/api/login`|Memvalidasi kredensial pengguna (nama pengguna dan kata sandi) dan mengembalikan token autentikasi beserta peran akses (*role*) apabila kredensial valid.|

### **3.10.2a. Strategi Evaluasi Held-out Test Set dan Seleksi Model Deployment**

Prosedur evaluasi pada data uji dan pemilahan model untuk *deployment* dilakukan melalui dua tahap yang terpisah secara transparan:
1. **Evaluasi Held-out Test Set Multi-Seed ($n=6$)**: Seluruh *trained checkpoint* dari 6 *seed* dievaluasi secara terisolasi murni pada *Held-out Test Set* (872 sampel) tanpa *gradient update/backpropagation* (`with torch.no_grad()`). Hasil evaluasi ke-6 *seed* ini digunakan khusus untuk:
 a. Perbandingan performa agregat prediktif ($Mean \pm \sigma$) antar model (RQ1).
 b. Penyediaan distribusi metrik F1-score berpasangan untuk pengujian statistik inferensial (*McNemar's Test*, *Wilcoxon Signed-Rank Test*, *Bootstrap* 95% CI, dan *Cohen's d*) (RQ2).
2. **Seleksi Checkpoint Model Deployment**: Dari 6 *seed* yang dievaluasi, *checkpoint* dengan *validation F1-score* tertinggi pada data validasi internal (6.735 sampel) dipilih secara khusus sebagai model utama yang disimpan dan di-*deploy* ke aplikasi web (RQ4) (Model B Seed 42 & Model A Seed 1234).

Pendekatan ini memastikan tidak terjadi kebocoran data (*data leakage*) karena *Held-out Test Set* tidak pernah digunakan dalam iterasi pelatihan (*backpropagation*) maupun penalaan *hyperparameter*. Evaluasi pada *Held-out Test Set* dilakukan secara murni dalam mode inferensi pasif untuk keperluan verifikasi generalisasi dan uji statistik inferensial.

### **3.10.3. Rancangan Antarmuka Pengguna (*User Interface*)**

Antarmuka web dirancang dengan tiga halaman utama yang saling terhubung melalui sistem navigasi **hash-based routing**:

1. **Halaman Beranda (*Home*)**
 Berfungsi sebagai portal informasi penelitian yang menampilkan identitas akademik peneliti (nama, NPM, program studi, dan institusi), latar belakang singkat penelitian, perbandingan arsitektur visual Model A (*Feature Extraction*) dan Model B (*Fine-Tuning*) dalam bentuk kartu interaktif, serta ringkasan sorotan temuan statistik utama yang dilengkapi *badge* multi-*seed* ($n=6$). Halaman ini dapat diakses secara publik tanpa autentikasi.

2. **Halaman Komparator Inferensi Sentimen (*Comparator*)**
 Menyediakan antarmuka pengujian inferensi *real-time* yang memungkinkan pengguna memasukkan kalimat ulasan (hingga 500 karakter) ke dalam kotak teks, dilengkapi penghitung karakter dan *chip* preset contoh kalimat (negasi, sentimen campuran, kekecewaan). Hasil inferensi Model A dan Model B ditampilkan secara bersisian (*side-by-side*) dengan *progress bar* skor kepercayaan yang teranimasi, *badge* latensi inferensi (ms), serta *badge* penanda model pemenang (*Confidence Winner*). Halaman ini juga menyajikan tabel riwayat pengujian yang dapat dicari (*searchable*), disalin ke *clipboard*, dan dihapus secara individual maupun keseluruhan melalui dialog konfirmasi. Halaman ini dapat diakses secara publik tanpa autentikasi.

3. **Halaman *Dashboard* Analitik *Benchmark* (*Analytics*) [Akses Terlindungi]**
 Menyajikan visualisasi grafik interaktif dari hasil evaluasi *benchmark* statistik komparatif. Halaman ini dilindungi oleh sistem RBAC dan hanya dapat diakses oleh pengguna yang telah terotentikasi (dosen pembimbing, dosen penguji, atau peneliti). Komponen visualisasi pada halaman ini meliputi:
 a. Empat kartu ringkasan statistik utama (delta rerata akurasi, delta rerata *F1-score*, alokasi GPU VRAM, dan rerata latensi inferensi).
 b. Grafik batang sumbu ganda (*dual-axis bar chart*) menggunakan *Recharts* yang menampilkan perbandingan *F1-score* (%), latensi (ms), dan *peak* VRAM (MB) antar model.
 c. Grafik radar multidimensi (*radar chart*) berbasis *Recharts* yang menampilkan breakdown akurasi per-kategori fenomena linguistik (merujuk rumusan pada Sub-bab 3.9.3).
 d. Matriks kontingensi 2×2 Uji *McNemar* yang menampilkan distribusi kesepakatan dan ketidaksepakatan prediksi pada $N=872$ sampel *held-out test set*.
 e. Widget dan *badge* metrik pengujian statistik inferensial (*McNemar p-value*, *Wilcoxon p-value*, bilah visualisasi interval *Bootstrap* 95% CI, dan *gauge meter Cohen's d*).
 f. *Tooltip* penjelasan akademis pada setiap komponen statistik.

### **3.10.4. Rancangan Sistem Navigasi dan Tema Visual**

Sistem navigasi aplikasi dirancang menggunakan pendekatan **hash-based routing** (`#home`, `#comparator`, `#analytics`) yang disinkronisasi dengan `*localStorage*` untuk mempertahankan posisi halaman terakhir pengguna setelah *refresh* atau penutupan peramban. Navigasi ditampilkan melalui dua komponen:

1. **Navigasi *Header* Desktop**
 Bilah navigasi horizontal tetap (*fixed top bar*) dengan tombol perpindahan halaman dan ikon pengaturan tema.
2. **Navigasi Bawah *Mobile***
 Bilah navigasi tetap di bagian bawah layar (*fixed bottom bar*) dengan tiga kolom ikon untuk akses cepat pada perangkat seluler.

Sistem tema visual dirancang dengan dukungan mode gelap (*dark mode*) dan mode terang (*light mode*):

1. **Mode Gelap (*Default*)**
 Latar belakang kanvas `#040814`, kartu **glassmorphism** transparan, dan aksen warna emas serta biru kerajaan.
2. **Mode Terang**
 Latar belakang kanvas putih, kartu latar abu-abu terang, dan teks gelap.

Perpindahan tema dikendalikan melalui tombol ikon Matahari/Bulan dan disimpan secara persisten di `*localStorage*`.

Animasi antarmuka dirancang menggunakan pustaka *Framer Motion* untuk meningkatkan kualitas pengalaman pengguna, meliputi:

1. Transisi halaman *fade/slide* menggunakan komponen `AnimatePresence`.
2. Efek *scroll reveal* bertahap (*staggered*) pada bagian *hero* dan kartu informasi menggunakan atribut `whileInView`.
3. Efek elevasi pada *hover* kartu model menggunakan atribut `whileHover`.
4. Animasi ekspansi lebar pada bilah skor kepercayaan (*confidence progress bar*).
5. Transisi skala masuk pada modal (*pop-up*).

### **3.10.5. Rancangan *Progressive Web App* (PWA)**

Aplikasi dirancang sebagai *Progressive Web App* (PWA) menggunakan *plugin* `vite-plugin-pwa` yang mengintegrasikan *Workbox* sebagai *service worker generator*. Strategi *caching* yang dirancang meliputi:

1. ***Precaching* Aset Statis**
 Seluruh aset statis (*JavaScript*, *CSS*, *HTML*, ikon SVG/PNG) di-*cache* secara otomatis pada saat instalasi *service worker* untuk menjamin ketersediaan antarmuka secara *offline*.
2. ***Runtime Caching* — **Network-First****
 Data dari *endpoint* `/api/benchmark-stats` di-*cache* dengan strategi **Network-First** (ekspirasi 1 hari) sehingga data *benchmark* statistik tetap dapat diakses saat koneksi terputus. Data dari *endpoint* `/api/history` di-*cache* dengan ekspirasi 1 jam.
3. **Modal Instalasi Kustom**
 Dirancang modal **glassmorphism** kustom yang menjelaskan manfaat instalasi aplikasi ke perangkat pengguna (**Add to Home Screen**) dan dipicu melalui *event* `beforeinstallprompt`.
4. ***Web App Manifest***
 File `manifest.json` dikonfigurasi dengan mode tampilan *standalone*, orientasi *portrait*, tema warna sesuai desain, dan ikon *maskable* SVG beresolusi 192×192 dan 512×512 piksel.

### **3.10.6. Rancangan Sistem Autentikasi dan Kontrol Akses**

Sistem autentikasi dirancang menggunakan mekanisme *Role-Based Access Control* (RBAC) dengan dua tingkat akses:

1. **Pengguna Publik**
 Dapat mengakses Halaman Beranda dan Halaman Komparator Inferensi Sentimen tanpa memerlukan proses masuk (*login*).
2. **Pengguna Terotentikasi (Peran: Dosen/Peneliti)**
 Dapat mengakses seluruh fitur aplikasi, termasuk Halaman *Dashboard* Analitik *Benchmark* yang berisi data statistik penelitian.

Apabila pengguna yang belum terotentikasi mencoba mengakses halaman terlindungi, sistem menampilkan kartu penguncian (**lock card**) dan membuka modal *login* bertema **glassmorphism**. Setelah proses autentikasi berhasil melalui *endpoint* `POST /api/login`, token autentikasi disimpan di `*localStorage*` peramban untuk mempertahankan sesi pengguna. Untuk aspek keamanan web, sistem dilengkapi proteksi pencegahan *Cross-Site Scripting* (XSS), mitigasi CSRF, serta pembatasan laju permintaan (**API Rate Limiting** menggunakan `slowapi` maks. 10 req/menit per IP pada *endpoint* `/api/predict`).

### **3.10.7. Alur Integrasi Operasional Model & Arsitektur *Dual-Backend Hybrid***

Alur integrasi operasional dari tahap eksplorasi komputasional hingga pemuatan pada server aplikasi web dirancang dalam arsitektur *Dual-Backend Hybrid* dengan mekanisme *Automatic Resilient Failover*:

Pendekatan *dual-backend* dengan *failover* otomatis dirancang untuk mengatasi tantangan operasional yang diidentifikasi oleh Sculley et al. (2015), yaitu ketergantungan pada infrastruktur komputasi yang dapat menjadi titik kegagalan (*single point of failure*) dalam sistem produksi. Dengan menyediakan server pencadangan berbasis CPU, sistem tetap dapat beroperasi meskipun server GPU utama mengalami *downtime*.

1. **Tahap Eksplorasi dan Pelatihan di Google Colab**:
 1. Pelatihan Model A (*Feature Extraction*) dan Model B (*Fine-Tuning*) dilakukan pada *Google Colab* GPU NVIDIA A100 GPU (40 GB VRAM).
 2. Proses pelatihan dieksekusi secara *multi-seed* ($n=6$) untuk menghasilkan log performa dan evaluasi statistik.

2. **Tahap Ekspor dan Penyimpanan Artefak Model**:
 1. Bobot parameter model terbaik hasil pelatihan disimpan menggunakan fungsi `torch.save()` dan *Hugging Face* `save*pretrained()` menjadi file artefak bobot model (`model*a.pt` dan direktori `model*b/`).
 2. Seluruh hasil perhitungan metrik prediktif, alokasi VRAM GPU, latensi, matriks kontingensi Uji *McNemar*, dan data *error analysis* diekspor ke dalam file terstruktur dan dimuat ke basis data melalui skrip *seeding* (`init*db.py`).

3. **Tahap Pemuatan Model & Deployment Server Web (Arsitektur Dual-Backend)**:
 1. **Server GPU Utama (Google Colab NVIDIA A100 GPU)**
 Server *FastAPI* dirancang untuk berjalan di *Google Colab* dengan akselerasi GPU NVIDIA A100 GPU (40 GB VRAM) dan dihubungkan ke publik melalui *Ngrok Static Tunnel*, ditargetkan mampu menyajikan inferensi *real-time* dengan latensi orde milidetik.
 2. **Server CPU Pencadangan (Railway Cloud)**
 Server *FastAPI* pencadangan dirancang untuk di-*deploy* pada *platform Railway* sebagai penopang redundansi saat server GPU Colab mengalami *downtime* atau *restart*.
 3. **Konfigurasi Sentral Terpisahkan (`config.js`)**
 Seluruh *endpoint* URL backend dirancang untuk dienkapsulasi secara modular di dalam modul konfigurasi *frontend* (`GPU*BACKEND*URL` dan `CPU*BACKEND*URL`). Setiap fungsi API pada *frontend* dirancang menyimpan URL ke dalam variabel eksplisit sebelum dieksekusi oleh logika percabangan *failover* (GPU *Primary* dengan **timeout** 6 detik ➔ CPU *Fallback*).

### **3.10.8. Rancangan Basis Data (*Database Schema*)**

Untuk mendukung *data persistence*, pencatatan riwayat inferensi pengguna, serta penyimpanan log eksperimen *benchmark* secara terstruktur, aplikasi web dilengkapi dengan basis data relasional **SQLite** yang dikelola melalui ORM *SQLAlchemy* pada *FastAPI*. Skema basis data dirancang terdiri dari 4 tabel utama:

1. **Tabel `prediction*logs`**
 Menyimpan setiap riwayat pengujian kalimat ulasan yang dikirimkan oleh pengguna melalui Komparator Inferensi *Real-Time*.
 1. `id` (INTEGER, *Primary Key*, *Auto Increment*)
 2. `username` (VARCHAR(50), pengenal pengguna / *role*: 'public' atau nama akun)
 3. `input*text` (TEXT, isi kalimat ulasan input)
 4. `model*a*label` (VARCHAR(20), label prediksi Model A)
 5. `model*a*confidence` (FLOAT, skor kepercayaan Model A %)
 6. `model*a*latency*ms` (FLOAT, latensi inferensi Model A ms)
 7. `model*b*label` (VARCHAR(20), label prediksi Model B)
 8. `model*b*confidence` (FLOAT, skor kepercayaan Model B %)
 9. `model*b*latency*ms` (FLOAT, latensi inferensi Model B ms)
 10. `created*at` (DATETIME, *timestamp* waktu pengujian)

2. **Tabel `benchmark*results`**
 Menyimpan ringkasan metrik evaluasi komparatif dari 6 *run random seed*.
 1. `id` (INTEGER, *Primary Key*, *Auto Increment*)
 2. `seed*number` (INTEGER, nilai *seed*: 42, 123, 777, 999, 1.234, 2024)
 3. `model*type` (VARCHAR(20), 'Model A' atau 'Model B')
 4. `accuracy` (FLOAT), `precision` (FLOAT), `recall` (FLOAT), `f1*score` (FLOAT)
 5. `inference*time*ms` (FLOAT), `peak*vram*mb` (FLOAT)

3. **Tabel `statistical*tests`**
 Menyimpan hasil pengujian statistik inferensial dan matriks kontingensi Uji McNemar.
 1. `id` (INTEGER, *Primary Key*, *Auto Increment*)
 2. `mcnemar*p*value` (FLOAT), `wilcoxon*p*value` (FLOAT)
 3. `bootstrap*ci*lower` (FLOAT), `bootstrap*ci*upper` (FLOAT)
 4. `cohens*d` (FLOAT)
 5. `mcnemar*both*correct` (INTEGER), `mcnemar*a*correct*b*wrong` (INTEGER)
 6. `mcnemar*b*correct*a*wrong` (INTEGER), `mcnemar*both*wrong` (INTEGER)
 7. `mcnemar*chi2` (FLOAT)
 8. `created*at` (DATETIME, *timestamp* waktu pengujian statistik)

4. **Tabel `error*analysis*logs`**
 Menyimpan data evaluasi akurasi per-kategori fenomena linguistik untuk visualisasi grafik radar.
 1. `id` (INTEGER, *Primary Key*, *Auto Increment*)
 2. `category*name` (VARCHAR(50), nama kategori fenomena linguistik)
 3. `model*a*accuracy` (FLOAT, persentase akurasi Model A %)
 4. `model*b*accuracy` (FLOAT, persentase akurasi Model B %)
 5. `sample*count` (INTEGER, jumlah sampel dalam kategori)
 6. `created*at` (DATETIME, *timestamp* pembuatan log)

### **3.10.9. Diagram Kasus Penggunaan (*Use Case Diagram*)**

Diagram *Use Case* menggambarkan interaksi antara dua aktor utama (*Pengguna Publik* dan *Dosen/Peneliti*) dengan fitur-fitur yang disediakan oleh aplikasi web portal penelitian, sebagaimana diilustrasikan pada Gambar 3.3:

```text
+-----------------------------------------------------------------------------------+
| SISTEM APLIKASI WEB ANALISIS SENTIMEN |
| |
| +-------------------+ |
| | Pengguna Publik | |
| +---------+---------+ |
| | |
| +---> (UC-01: Melihat Beranda & Informasi Penelitian) |
| | |
| +---> (UC-02: Menguji Inferensi Sentimen Real-Time) |
| | |
| +---> (UC-03: Melihat & Menghapus Riwayat Pengujian) |
| | |
| +---> (UC-04: Menginstal Aplikasi Web PWA) |
| | |
| +---> (UC-05: Melakukan Autentikasi Login RBAC) |
| | |
| v |
| +-------------------+ | |
| | Dosen / Peneliti |--------------+ |
| +---------+---------+ |
| | |
| +---> (UC-06: Mengakses Dashboard Analitik Benchmark) [Protected] |
| |
+-----------------------------------------------------------------------------------+
```
*Gambar 3.3. Diagram Kasus Penggunaan (Use Case Diagram) Aplikasi Web*  
*Sumber: Diagram Use Case Sistem Peneliti (2026)*

Rincian peran dan interaksi aktor dalam diagram *Use Case* didefinisikan sebagai berikut:

1. **Pengguna Publik**
 Memiliki hak akses dasar untuk membaca informasi penelitian pada Halaman Beranda (UC-01), menjalankan inferensi sentimen *real-time* pada Halaman Komparator (UC-02), mengelola riwayat pengujian lokal (UC-03), menginstal aplikasi PWA (UC-04), dan melakukan proses *login* (UC-05).
2. **Dosen / Peneliti (Pengguna Terotentikasi)**
 Memiliki seluruh hak akses Pengguna Publik ditambah hak akses khusus untuk membuka Halaman *Dashboard* Analitik *Benchmark* (UC-06) yang dilindungi oleh kontrol akses RBAC.

### **3.10.10. Diagram Alur Sistem (*System Flowchart Diagram*)**

Diagram alur sistem menggambarkan urutan eksekusi logika dan alur data dari sudut pandang interaksi pengguna hingga pemrosesan di *backend*, sebagaimana diperlihatkan pada Gambar 3.4:

```text
+-----------------------------------------------------------------------------------+
| START USER FLOW |
+-----------------------------------------+-----------------------------------------+
 |
 v
+-----------------------------------------------------------------------------------+
| Navigasi Halaman Utama (SPA) |
| [Beranda (#home)] - [Komparator (#comparator)] - [Analitik (#analytics)] |
+-----------------------------------------+-----------------------------------------+
 |
 +-----------------+-----------------+
 | |
 v v
+-----------------------------------------------+ +-------------------------------+
| Halaman Komparator (Input Teks Ulasan) | | Halaman Dashboard Analitik |
+-----------------------+-----------------------+ +---------------+---------------+
 | |
 v v
+-----------------------------------------------+ +-------------------------------+
| Kirim request POST /api/predict ke FastAPI | | Cek Token Autentikasi (RBAC) |
+-----------------------+-----------------------+ +---------------+---------------+
 | |
 v +-------------+-------------+
+-----------------------------------------------+ | |
| Tokenisasi BertTokenizerFast (max*length=128) | v v
+-----------------------+-----------------------+ [Token Valid] [Belum Login]
 | | |
 v v v
+-----------------------------------------------+ Tampilkan Tampilkan Modal Login /
| Parallel Inference: Model A & Model B (GPU/CPU)| Visualisasi Akses Kartu Penguncian
+-----------------------+-----------------------+ Recharts (*Lock Card*)
 |
 v
+-----------------------------------------------+
| Log Prediksi ke DB SQLite (prediction*logs) |
+-----------------------+-----------------------+
 |
 v
+-----------------------------------------------+
| Tampilkan Hasil Inferensi Bersisian (Side-by- |
| Side Card, Confidence Bar, Latency Badge) |
+-----------------------------------------------+
```
*Gambar 3.4. Diagram Alur Sistem (System Flowchart Diagram) Aplikasi Web*  
*Sumber: Diagram Flowchart Alur Sistem Peneliti (2026)*

Alur sistem aplikasi web berlangsung dalam 4 tahapan eksekusi:

1. **Tahap Navigasi**
 Pengguna memilih halaman target via **hash-based routing**.
2. **Tahap Pengujian Inferensi**
 Input teks dikirim ke backend API, ditokenisasi oleh `BertTokenizerFast`, lalu diinferensi secara paralel oleh Model A dan Model B (merujuk spesifikasi API pada Tabel 3.5).
3. **Tahap Persistensi Data**
 Hasil prediksi, skor kepercayaan, dan latensi secara otomatis dicatat ke dalam basis data SQLite (`prediction*logs`).
4. **Tahap Otorisasi Dashboard**
 Akses ke *Dashboard* Analitik memicu verifikasi otorisasi RBAC; apabila valid, visualisasi statistik dimuat dari backend dan disajikan secara interaktif.

### **3.10.11. Diagram Relasi Entitas Basis Data (*Entity Relationship Diagram / ERD*)**

Struktur fisik, skema tabel, dan hubungan antar entitas basis data relasional SQLite dirancang untuk mengintegrasikan data pengujian inferensi *real-time*, log *benchmark* multi-*seed*, pengujian statistik inferensial, serta evaluasi kategori linguistik, sebagaimana disajikan pada Gambar 3.5:

```text
+------------------------------------+
| prediction*logs |
+------------------------------------+
| PK id INTEGER |
| username VARCHAR(50)| 
| input*text TEXT | 
| model*a*label VARCHAR(20)| 
| model*a*confidence FLOAT | 
| model*a*latency*ms FLOAT | 
| model*b*label VARCHAR(20)| 
| model*b*confidence FLOAT | 
| model*b*latency*ms FLOAT | 
| FK category*name VARCHAR(50)| --+ (Kategorisasi Input Teks)
| created*at DATETIME | |
+------------------------------------+ |
 v (N: 1)
+------------------------------------+ |
| error*analysis*logs | |
+------------------------------------+ |
| PK id INTEGER | |
| PK category*name VARCHAR(50)| <--+ (1)
| model*a*accuracy FLOAT |
| model*b*accuracy FLOAT |
| sample*count INTEGER |
| created*at DATETIME |
+------------------------------------+
 ^
 | (1: N Evaluasi Fenomena)
 |
+------------------------------------+ (1: 1 Agregasi Statistik) +------------------------------------+
| benchmark*results | -----------------------------------> | statistical*tests |
+------------------------------------+ +------------------------------------+
| PK id INTEGER | | PK id INTEGER |
| seed*number INTEGER | | mcnemar*p*value FLOAT |
| model*type VARCHAR(20)| | wilcoxon*p*value FLOAT |
| accuracy FLOAT | | bootstrap*ci*lower FLOAT |
| precision FLOAT | | bootstrap*ci*upper FLOAT |
| recall FLOAT | | cohens*d FLOAT |
| f1*score FLOAT | | mcnemar*chi2 FLOAT |
| inference*time*ms FLOAT | | created*at DATETIME |
| peak*vram*mb FLOAT | +------------------------------------+
+------------------------------------+
```
*Gambar 3.5. Diagram Relasi Entitas (Entity Relationship Diagram / ERD) Basis Data*  
*Sumber: Diagram Relasi Entitas Basis Data Peneliti (2026)*

Deskripsi peranan 4 entitas tabel basis data dan kardinalitas relasinya:

1. **Entitas `prediction*logs`**
 Mengakomodasi kebutuhan audit log riwayat pengujian kalimat ulasan pengguna, menyimpan nama/peran pengguna (`username`), prediksi label sentimen, tingkat kepercayaan (%), dan latensi komputasi (ms) dari kedua model.
2. **Entitas `benchmark*results`**
 Menyimpan data observasi mentah hasil evaluasi performa prediktif dan efisiensi komputasi dari 6 *run random seed* untuk Model A dan Model B.
3. **Entitas `statistical*tests`**
 Menyimpan ringkasan nilai statistik pengujian inferensial kuantitatif (*McNemar p-value*, *Wilcoxon p-value*, interval *Bootstrap 95% CI*, *Cohen's d*, dan matriks kontingensi $\chi^2$) yang ditampilkan pada *Dashboard* Analitik.
4. **Entitas `error*analysis*logs`**
 Menyimpan data breakdown akurasi per-kategori fenomena linguistik (tanpa negasi, negasi biner, ironi/sarkasme, review panjang, ambiguitas tinggi) untuk menyokong visualisasi grafik radar multidimensi.

**Kardinalitas & Hubungan Antar Tabel**:
- **Relasi `benchmark*results` ➔ `statistical*tests` (Agregasi 1: 1)**
 Observasi komparatif multi-*seed* ($n=6$) pada `benchmark*results` diolah secara inferensial untuk menghasilkan 1 entri agregat ringkasan pengujian statistik pada `statistical*tests`.
- **Relasi `benchmark*results` ➔ `error*analysis*logs` (Asosiasi 1: N)**
 Hasil evaluasi *benchmark* pada *held-out test set* dipetakan secara terstruktur ke dalam $N$ entri kategori fenomena linguistik pada `error*analysis*logs`.
- **Relasi `prediction*logs` ➔ `error*analysis*logs` (Kategorisasi N: 1)**
 Setiap entri riwayat inferensi pengguna pada `prediction*logs` terhubung secara logis ke 1 kategori fenomena linguistik pada `error*analysis*logs` berdasarkan karakteristik leksikal dan sintaksis kalimat input.

### **3.10.12. Ruang Lingkup Minimum dan Fitur Tambahan (MVP vs Stretch)**

Untuk memastikan kelayakan penyelesaian dalam batas waktu skripsi, pengembangan aplikasi web dibagi menjadi dua kategori:

#### **A. Fitur Minimum (*Minimum Viable Product* / MVP) - WAJIB:**
1. **Halaman Beranda**
 Informasi penelitian dan kartu perbandingan model
2. **Halaman Komparator**
 Input teks, inferensi *dual-model*, tampilan *side-by-side* dengan skor kepercayaan dan latensi
3. **Dashboard Sederhana**
 Empat kartu metrik dan grafik batang perbandingan *F1-score*
4. **Database Sederhana**
 Tabel `prediction*logs` untuk riwayat pengujian

#### **B. Fitur Tambahan (*Stretch Goals*) - Dikerjakan jika waktu memungkinkan:**
1. **PWA** dengan *service worker* dan *offline caching*
2. **RBAC** dan halaman *analytics* terlindungi
3. **Dual-backend** dengan *automatic failover*
4. **Grafik radar** *error analysis*
5. **Matriks kontingensi** *McNemar*
6. **Animasi** *Framer Motion*
7. **Dark/light mode** *toggle*

Penelitian ini akan melaporkan secara transparan fitur mana yang berhasil diimplementasikan dan mana yang masih dalam tahap rancangan pada saat penyusunan laporan akhir.

## **3.11. Kontrol Variansi dan Reliabilitas** 

Untuk memastikan konsistensi hasil, eksperimen dilakukan menggunakan pendekatan multi-seed dengan 6 nilai seed yang berbeda (42, 123, 777, 999, 1234, dan 2024). Setiap konfigurasi model dijalankan berulang kali untuk menghasilkan beberapa observasi performa yang digunakan dalam analisis statistik. Pendekatan ini mengikuti rekomendasi Bouthillier et al. (2021) untuk menjamin reliabilitas estimasi performa model *deep learning*. Hasil eksperimen dilaporkan dalam bentuk nilai rata-rata dan deviasi standar ($\mu \pm \sigma$).

Selain itu, untuk mengurangi variansi akibat inisialisasi acak dan urutan data (Dodge et al., 2020), setiap model dievaluasi pada *seed* yang berbeda dan hasil akhir dilaporkan dalam bentuk rata-rata dan deviasi standar, sebagaimana direkomendasikan oleh Bouthillier et al. (2021).

## **3.12. Validitas Penelitian** 

Validitas internal dijaga melalui kontrol variabel eksperimen, penggunaan skema pembagian dataset terisolasi (*held-out test set*), serta eliminasi kebocoran data (*data leakage*). Penggunaan uji statistik pada level prediksi individu dan agregat juga mendukung validitas kesimpulan yang diperoleh. Validitas eksternal dibatasi pada penggunaan dataset SST-2, sedangkan validitas konstruk dijaga melalui metrik evaluasi standar klasifikasi teks (Accuracy, Precision, Recall, F1-score, latency, dan VRAM usage).

## **3.13. Reproduktibilitas dan Keterbukaan Penelitian** 

Untuk menjamin transparansi dan reproduksibilitas hasil penelitian, diterapkan langkah-langkah berikut:

1. **Kode Sumber**
 Seluruh kode eksperimen (pra-pemrosesan data, pelatihan model, evaluasi, dan analisis statistik) akan dipublikasikan di repository GitHub publik dengan lisensi MIT.
2. **Environment Specification**
 File `requirements.txt` dan `environment.yml` akan disertakan untuk mereplikasi environment pengembangan yang digunakan.
3. **Seed Control**
 Setiap script eksperimen akan menginisialisasi random seed secara eksplisit menggunakan fungsi `set*seed()` untuk Python, NumPy, PyTorch, dan Transformers.
4. **Logging**
 Seluruh proses pelatihan akan dicatat secara otomatis menggunakan library `wandb` atau `tensorboard`, mencakup loss, akurasi, F1-score per epoch, dan waktu eksekusi.
5. **Artifact Versioning**
 Model checkpoint terbaik akan disimpan dengan versi yang terdokumentasi, termasuk timestamp, seed, dan metrik validasi.
6. **Dataset Versioning**
 Menggunakan versi dataset yang spesifik melalui Hugging Face `datasets` library dengan versi commit yang terdokumentasi.

Pendekatan ini sejalan dengan rekomendasi Bouthillier et al. (2021) dan Gundersen et al. (2018) mengenai praktik reproduktibilitas dalam *machine learning*.

## **3.14. Pertimbangan Etika Penelitian** 

Penelitian komputasi ini dilaksanakan dengan mematuhi prinsip-prinsip etika penelitian ilmiah dan etika kecerdasan buatan:

1. **Privasi dan Anonimitas Data**
 Dataset SST-2 yang digunakan merupakan data sekunder berlisensi publik yang telah teranonimisasi penuh tanpa memuat informasi pengidentifikasi pribadi (*Personally Identifiable Information* / PII). Pada produk aplikasi web, data masukan pengujian *real-time* disimpan dalam log tanpa mengumpulkan identitas sensitif pengguna.
2. **Integritas Ilmiah dan Akses Terbuka**
 Seluruh data evaluasi, metrik performa, dan log pengujian dilaporkan secara jujur tanpa manipulasi data (*data fabrication/falsification*) atau pemilihan hasil manis (*cherry-picking*).
3. **Kesadaran Bias Algoritma**
 Peneliti menyadari bahwa model bahasa pra-terlatih seperti BERT dilatih pada korpus teks internet skala besar yang berpotensi menyerap bias sosial. Evaluasi *error analysis* berbasis kategori linguistik dilakukan secara obyektif untuk memahami batasan model.
4. **Keamanan Sistem Aplikasi Web**
 Aplikasi web dilengkapi dengan mekanisme kontrol akses berbasis peran (*Role-Based Access Control* / RBAC) untuk melindungi antarmuka analitik dan mencegah manipulasi data oleh pihak yang tidak berwenang.

## **3.15. Rencana Pengujian Aplikasi Web** 

Guna menjamin keandalan operasional produk aplikasi web dalam menyajikan inferensi klasifikasi sentimen dan *dashboard analytics* statistik, pengujian sistem wajib dirancang dan dieksekusi secara terstruktur dari tingkat unit hingga penerimaan pengguna. Langkah ini penting untuk menjamin bahwa sistem terbebas dari *bug* fungsional, memiliki latensi responsif, serta memberikan tingkat ketergunaan (*usability*) yang tinggi bagi praktisi dan akademisi.

Rancangan pengujian multi-tingkat ini didasarkan pada metodologi pengujian perangkat lunak standar (Pressman & Maxim, 2020), sedangkan evaluasi ketergunaan antarmuka pengguna diukur menggunakan instrumen *System Usability Scale* (SUS) yang dikembangkan oleh Brooke (1996). Berdasarkan landasan tersebut, dirancang tiga tingkatan pengujian sistem secara terstruktur:

1. **Pengujian Unit (*Unit Testing - Backend*)**:
   - Pengujian fungsi inferensi model PyTorch/BERT menggunakan *framework* `pytest`.
   - Pengujian keabsahan respons *endpoint* API menggunakan `FastAPI TestClient`.
   - Pengujian logika otorisasi dan penanganan kesalahan *token* RBAC.
2. **Pengujian Integrasi (*Integration Testing*)**:
   - Pengujian alur pengujian inferensi *end-to-end* (input teks ➔ tokenisasi ➔ inferensi *dual-model* ➔ pencatatan basis data SQLite ➔ respons JSON).
   - Pengujian mekanisme *failover* otomatis arsitektur *dual-backend* (GPU Primary Colab ➔ CPU Fallback Railway).
3. **Pengujian Penerimaan Pengguna (*User Acceptance Testing / UAT*)**:
   - Pengujian langsung oleh 5–10 pengguna (dosen dan mahasiswa) untuk mengevaluasi aspek *usability*.
   - Evaluasi tingkat kebolehan sistem menggunakan kuesioner *System Usability Scale* (SUS) (Brooke, 1996).

Target cakupan pengujian (*test coverage*) ditetapkan minimal 70% *code coverage* untuk *backend REST API*.



## **DAFTAR PUSTAKA** 

Al-Khowarizmi. (2021). Implementation of artificial neural network in predicting text data and classification. *Journal of Computer Science, Information Technology and Telecommunication Engineering (JCoSITTE)*, 2(1), 120–127.

Al-Khowarizmi, Sari, I. P., & Hariani, P. P. (2023). Implementation and design of security system on motorcycle vehicles using Raspberry Pi3-based GPS tracker and face detection. *Sinkron: Jurnal dan Penelitian Teknik Informatika*, 8(1), 384–392. https://doi.org/10.33395/sinkron.v8i1.12123

Bouthillier, X., Delaunay, P., Bronzi, M., Trofimov, A., Nichyporuk, B., Szeto, J., Sepah, N., Raff, E., Madan, K., Voleti, V., Kahou, S. E., Michalski, V., Serdyuk, D., Arbel, T., Pal, C., Varoquaux, G., & Vincent, P. (2021). Accounting for variance in machine learning benchmarks. *Proceedings of Machine Learning and Systems*, 3, 747–769. 

Brooke, J. (1996). SUS: A 'quick and dirty' usability scale. In P. W. Jordan, B. Thomas, B. A. Weerdmeester, & I. L. McClelland (Eds.), *Usability evaluation in industry* (pp. 189–194). Taylor & Francis.

Cohen, J. (1988). *Statistical power analysis for the behavioral sciences* (2nd ed.). Lawrence Erlbaum Associates. 

Creswell, J. W. (2014). *Research design: Qualitative, quantitative, and mixed methods approaches* (4th ed.). SAGE Publications. 

Devlin, J., Chang, M. W., Lee, K., & Toutanova, K. (2019). BERT: Pre-training of deep bidirectional transformers for language understanding. In *Proceedings of the 2019 Conference of the North American Chapter of the Association for Computational Linguistics: Human Language Technologies (NAACL-HLT 2019)* (pp. 4171–4186). Association for Computational Linguistics. https://doi.org/10.18653/v1/N19-1423 

Dodge, J., Ilharco, G., Schwartz, R., Farhadi, A., Hajishirzi, H., & Smith, N. A. (2020). Fine-tuning pretrained language models: Weight initializations, data orders, and early stopping. *arXiv preprint arXiv:2002.06305*. https://doi.org/10.48550/arXiv.2002.06305

Dror, R., Baumer, G., Shlomov, S., & Reichart, R. (2018). The Hitchhiker's guide to testing statistical significance in natural language processing. In *Proceedings of the 56th Annual Meeting of the Association for Computational Linguistics (ACL 2018)* (pp. 1383–1392). Association for Computational Linguistics. 

Efron, B. (1979). Bootstrap methods: Another look at the jackknife. *The Annals of Statistics*, 7(1), 1–26. https://doi.org/10.1214/aos/1176344552 

Galke, L., Diera, A., Lin, B. X., Khera, B., Meuser, T., Singhal, T., Karl, F., & Scherp, A. (2024). Are we really making much progress in text classification? A comparative review. *ACM Computing Surveys*.

Hariani, P. P., & Sari, I. P. (2021). Analisis dan perancangan sistem informasi pengelolaan data akademik berbasis web. *Jurnal Sistem Informasi dan Komputerisasi Akuntansi (JSIKA)*, 6(2), 145–152. 

Gundersen, O. E., & Kjensmo, S. (2018). State of the art: Reproducibility in artificial intelligence. In *Proceedings of the AAAI Conference on Artificial Intelligence*, 32(1), 1644–1651. https://doi.org/10.1609/aaai.v32i1.11503

Goodfellow, I., Bengio, Y., & Courville, A. (2016). *Deep learning*. MIT Press. 

Hao, Y., Dong, L., Wei, F., & Xu, K. (2020). Investigating learning dynamics of BERT fine-tuning. In *Proceedings of AACL-IJCNLP* (pp. 87–92). Association for Computational Linguistics. 

Howard, J., & Ruder, S. (2018). Universal language model fine-tuning for text classification. In *Proceedings of ACL 2018* (pp. 328–339). https://doi.org/10.18653/v1/P18-1031 

Hutto, C. J., & Gilbert, E. (2014). VADER: A parsimonious rule-based model for sentiment analysis of social media text. In *Proceedings of the International AAAI Conference on Web and Social Media*, 8(1), 216–225. https://doi.org/10.1609/icwsm.v8i1.14550


Liu, Y., Ott, M., Goyal, N., Du, J., Joshi, M., Chen, D., Levy, O., Lewis, M., Zettlemoyer, L., & Stoyanov, V. (2019). RoBERTa: A robustly optimized BERT pretraining approach. *arXiv preprint arXiv:1907.11692*. https://doi.org/10.48550/arXiv.1907.11692

McNemar, Q. (1947). Note on the sampling error of the difference between correlated proportions or percentages. *Psychometrika*, 12(2), 153–157. https://doi.org/10.1007/BF02295996 

Minaee, S., Kalchbrenner, N., Cambria, E., Nikzad, N., Chenaghlu, M., & Gao, J. (2021). Deep learning–based text classification: A comprehensive review. *ACM Computing Surveys*, 54(3), 1–40. 


Nielsen, F. Å. (2011). A new ANEW: Evaluation of a word list for sentiment analysis in microblogs. In *Proceedings of the ESWC2011 Workshop on 'Making Sense of Microposts'* (pp. 93–98). CEUR-WS.


Peters, M. E., Neumann, M., Iyyer, M., Gardner, M., Clark, C., Lee, K., & Zettlemoyer, L. (2018). Deep contextualized word representations. In *Proceedings of NAACL-HLT 2018* (pp. 2227–2237). https://doi.org/10.18653/v1/N18-1202 

Pressman, R. S., & Maxim, B. R. (2020). *Software engineering: A practitioner's approach* (9th ed.). McGraw-Hill Education.

Qasim, R., Bangyal, W. H., Alqarni, M. A., & Ali Almazroi, A. (2022). A fine-tuned BERT-based transfer learning approach for text classification. *Journal of Healthcare Engineering*, 2022, Article 3498123. 

Ribeiro, M. T., Wu, T., Guestrin, C., & Singh, S. (2020). Beyond accuracy: Behavioral testing of NLP models with CheckList. In *Proceedings of the 58th Annual Meeting of the Association for Computational Linguistics (ACL 2020)* (pp. 4902–4912). https://doi.org/10.18653/v1/2020.acl-main.442

Ruder, S., Peters, M. E., Swayamdipta, S., & Wolf, T. (2019). Transfer learning in natural language processing. In *Proceedings of NAACL-HLT 2019 Tutorials* (pp. 15–18). Association for Computational Linguistics. 

Sawilowsky, S. S. (2009). New effect size rules of thumb. *Journal of Modern Applied Statistical Methods*, 8(2), 597–599. https://doi.org/10.22237/jmasm/1257035100

Sculley, D., Holt, G., Golovin, D., Davydov, E., Phillips, T., Ebner, D., Chaudhary, V., Young, M., Crespo, J. F., & Dennison, D. (2015). Hidden technical debt in machine learning systems. In *Advances in Neural Information Processing Systems 28 (NeurIPS 2015)* (pp. 2503–2511). Curran Associates, Inc. 

Shadish, W. R., Cook, T. D., & Campbell, D. T. (2002). *Experimental and quasi-experimental designs for generalized causal inference*. Houghton, Mifflin and Company. 

Socher, R., Perelygin, A., Wu, J., Chuang, J., Manning, C. D., Ng, A., & Potts, C. (2013). Recursive deep models for semantic compositionality over a sentiment treebank. In *Proceedings of EMNLP 2013* (pp. 1631–1642). https://doi.org/10.18653/v1/D13-1170 

Sokolova, M., & Lapalme, G. (2009). A systematic analysis of performance measures for classification tasks. *Information Processing & Management*, 45(4), 427–437. https://doi.org/10.1016/j.ipm.2009.03.002 

Sun, C., Qiu, X., Xu, Y., & Huang, X. (2019). How to fine-tune BERT for text classification? In *Chinese National Conference on Computational Linguistics* (pp. 194–206). Springer.

Tanjung, M. A. P. (2019). Klasifikasi kategori citra digital dengan metode bag of visual words. *JURTEKSI (Jurnal Teknologi dan Sistem Informasi)*, 5(2), 115–122. https://doi.org/10.33330/jurteksi.v5i2.356 

Treviso, M., Lee, J. U., Ji, T., van Aken, B., Cao, Q., Ciosici, M. R., Hassid, M., Heafield, K., Hooker, S., Martins, P. H., & Martins, A. F. T. (2023). Efficient methods for natural language processing: A survey. *Transactions of the Association for Computational Linguistics*, 11, 826–860. https://doi.org/10.1162/tacl_a_00577

Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł., & Polosukhin, I. (2017). Attention is all you need. In *Advances in Neural Information Processing Systems (NeurIPS 2017)* (pp. 5998–6008). 

Wang, A., Singh, A., Michael, J., Hill, F., Levy, O., & Bowman, S. R. (2018). GLUE: A multi-task benchmark and analysis platform for natural language understanding. In *Proceedings of EMNLP 2018 Workshop BlackboxNLP*. https://doi.org/10.18653/v1/W18-5446 

Wolf, T., Debut, L., Sanh, V., Chaumond, J., Delangue, C., Moi, A., Cistac, P., Rault, T., Louf, R., Funtowicz, M., Davison, J., Shleifer, S., von Platen, P., Ma, C., Jernite, Y., Plu, J., Xu, C., Le Scao, T., Gugger, S., ... & Rush, A. M. (2020). Transformers: State-of-the-art natural language processing. In *Proceedings of the 2020 Conference on Empirical Methods in Natural Language Processing: System Demonstrations (EMNLP 2020)* (pp. 38–45). Association for Computational Linguistics. https://doi.org/10.18653/v1/2020.emnlp-demos.6 

Wu, Y., Schuster, M., Chen, Z., Le, Q. V., Norouzi, M., Macherey, W., Krikun, M., Cao, Y., Gao, Q., Macherey, K., Klingner, J., Shah, A., Johnson, M., Liu, X., Kaiser, Ł., Gouws, S., Kato, Y., Kudo, T., Kazawa, H., ... & Dean, J. (2016). Google's neural machine translation system: Bridging the gap between human and machine translation. *arXiv preprint arXiv:1609.08144*.

Wilcoxon, F. (1945). Individual comparisons by ranking methods. *Biometrics Bulletin*, 1(6), 80–83. https://doi.org/10.2307/3001968 

Zaman-Khan, H., Naeem, M., Guarasci, R., Khalid, U., Esposito, M., & Gargiulo, F. (2024). Enhancing text classification using BERT: A transfer learning approach. *Computación y Sistemas*, 28(4), 2279–2295. https://doi.org/10.13053/cys-28-4-5290