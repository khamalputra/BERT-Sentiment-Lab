

**FAKULTAS ILMU KOMPUTER DAN TEKNOLOGI INFORMASI**<br>
**UNIVERSITAS MUHAMMADIYAH SUMATERA UTARA**<br>
**Unggul | Cerdas | Terpercaya**<br>

# **PENERAPAN _FINE-TUNING_ MODEL BERT UNTUK EFEKTIVITAS KLASIFIKASI TEKS** 

## **PROPOSAL SKRIPSI** 

**Diajukan sebagai salah satu syarat untuk memperoleh gelar Sarjana Komputer (S.Kom) dalam Program Studi Sistem Informasi pada Fakultas Ilmu Komputer dan Teknologi Informasi, Universitas Muhammadiyah Sumatera Utara** 

## **<u>MHD SYAFIQ HASAN JAMBAK</u>** 

**NPM. 2209010182** 

## **PROGRAM STUDI SISTEM INFORMASI** 

**FAKULTAS ILMU KOMPUTER DAN TEKNOLOGI INFORMASI UNIVERSITAS MUHAMMADIYAH SUMATERA UTARA** 

## **MEDAN** 

**2026** 

## **BAB I** 

## **PENDAHULUAN** 

## **1.1. Latar Belakang Masalah** 

Klasifikasi teks merupakan salah satu tugas fundamental dalam bidang _Natural Language Processing_ (NLP) yang bertujuan untuk menetapkan label kategori pada unit teks seperti kalimat, dokumen, atau paragraf berdasarkan isi semantiknya. Tugas ini memiliki peran penting dalam berbagai aplikasi praktis, termasuk analisis sentimen, deteksi spam, klasifikasi berita, serta pengelompokan konten digital (Minaee et al., 2021). Seiring meningkatnya volume data tekstual yang dihasilkan secara masif, kebutuhan terhadap model klasifikasi yang mampu memahami makna bahasa secara mendalam menjadi semakin krusial. 

Pendekatan klasik dalam klasifikasi teks umumnya menggunakan representasi berbasis fitur seperti _bag-of-words_ atau TF-IDF yang kemudian diproses menggunakan algoritma pembelajaran mesin seperti _Naïve Bayes_ atau _Support Vector Machine_ . Meskipun metode ini relatif sederhana dan efisien, representasi yang dihasilkan cenderung mengabaikan urutan kata serta relasi kontekstual antar token, sehingga terbatas dalam menangkap makna semantik yang lebih kompleks (Minaee et al., 2021). Keterbatasan tersebut mendorong berkembangnya pendekatan berbasis representasi kontekstual yang mampu memodelkan dependensi antar kata secara lebih efektif. 

Kemajuan signifikan dalam bidang NLP terjadi dengan diperkenalkannya arsitektur _Transformer neural network architecture_ oleh Vaswani et al. (2017), yang memanfaatkan mekanisme _self-attention_ untuk memodelkan dependensi global dalam suatu urutan teks tanpa bergantung pada struktur sekuensial seperti pada 

RNN. Pendekatan ini memungkinkan pemrosesan representasi teks secara paralel serta menangkap hubungan antar token secara lebih fleksibel dan efisien. Salah satu implementasi paling berpengaruh dari arsitektur ini adalah BERT yang diperkenalkan oleh Devlin et al. (2018). BERT dirancang untuk menghasilkan representasi bahasa yang bersifat bidireksional dengan mempertimbangkan konteks kiri dan kanan secara simultan, serta menunjukkan performa unggul pada berbagai tugas NLP, termasuk klasifikasi teks dalam _benchmark_ seperti GLUE (Wang et al., 2018). 

Model BERT mengadopsi paradigma _transfer learning_ yang terdiri dari dua tahap utama, yaitu _pre-training_ pada korpus besar untuk mempelajari representasi bahasa umum, diikuti dengan tahap adaptasi pada tugas spesifik melalui _fine-tuning_ . Pendekatan ini memungkinkan model untuk memanfaatkan pengetahuan yang telah dipelajari sebelumnya sehingga meningkatkan efisiensi pembelajaran, terutama ketika data berlabel terbatas (Ruder et al., 2019). Dalam praktiknya, BERT dapat digunakan baik sebagai _feature extractor_ dengan parameter yang dibekukan maupun sebagai model yang dilatih ulang secara _end-to-end_ melalui proses _finetuning_ . 

Sejumlah penelitian menunjukkan bahwa penerapan BERT berbasis _transfer learning_ mampu meningkatkan performa klasifikasi teks pada berbagai domain. Misalnya, Qasim et al. (2022) serta Zaman-Khan et al. (2024) melaporkan bahwa model berbasis BERT menghasilkan akurasi yang tinggi pada berbagai dataset klasifikasi. Namun demikian, sebagian besar studi tersebut berfokus pada pelaporan metrik performa tanpa merancang eksperimen komparatif yang terkontrol secara ketat antara konfigurasi dengan dan tanpa _fine-tuning_ . Selain itu, 

pengujian signifikansi statistik terhadap perbedaan performa juga jarang dilakukan, sehingga sulit untuk memastikan apakah peningkatan yang dilaporkan benar-benar mencerminkan efek model atau sekadar variasi acak. 

Permasalahan ini sejalan dengan temuan dalam literatur yang menyoroti pentingnya evaluasi eksperimental yang ketat dalam penelitian NLP. Dror et al. (2018) menekankan bahwa tanpa pengujian signifikansi statistik, perbedaan performa antar model tidak dapat dipastikan sebagai efek yang nyata dan berpotensi bersifat kebetulan. Di sisi lain, studi komparatif oleh Galke et al. (2024) menunjukkan bahwa banyak penelitian klasifikasi teks menghadapi tantangan dalam hal komparabilitas hasil, terutama terkait optimasi _baseline_ dan konsistensi pengaturan eksperimen. Hal ini mengindikasikan adanya kebutuhan untuk merancang studi yang tidak hanya membandingkan performa model, tetapi juga memastikan validitas inferensi melalui metodologi statistik yang tepat. 

Berdasarkan kesenjangan tersebut, penelitian ini dirancang untuk melakukan evaluasi kuantitatif yang terkontrol terhadap pengaruh _fine-tuning_ pada model BERT dalam tugas klasifikasi teks. Dua konfigurasi model dibandingkan secara sistematis, yaitu (1) penggunaan BERT sebagai _frozen feature extractor_ dengan _classifier_ sederhana, dan (2) _fine-tuning_ seluruh parameter model secara _end-to-end_ . Evaluasi dilakukan pada dataset SST-2 yang merupakan bagian dari GLUE _benchmark_ , sehingga memungkinkan perbandingan hasil dengan studi terdahulu dalam literatur. 

Untuk memastikan validitas temuan, penelitian ini tidak hanya mengandalkan metrik performa seperti akurasi, tetapi juga menerapkan beberapa metode statistik inferensial, termasuk _McNemar’s Test_ , _Wilcoxon Signed-Rank Test_ , _Bootstrap Confidence Interval_ , dan _Cohen’s d_ . Dengan demikian, penelitian ini diharapkan dapat memberikan bukti empiris yang lebih kuat mengenai kontribusi _fine-tuning_ terhadap peningkatan performa klasifikasi teks, sekaligus memberikan pemahaman yang lebih komprehensif terkait _trade-off_ antara akurasi dan kompleksitas komputasi dalam penggunaan model BERT. Selain itu, untuk memperluas kegunaan praktis dari temuan eksperimental ini, hasil pemodelan dan visualisasi analisis statistik diintegrasikan ke dalam sebuah produk aplikasi web interaktif berbasis *FastAPI* dan *React*. Aplikasi ini dirancang untuk memfasilitasi pengujian inferensi klasifikasi sentimen secara *real-time* serta menyajikan *dashboard* perbandingan performa model yang dapat diakses dengan mudah oleh praktisi dan penguji sistem. 

## **1.2. Rumusan Masalah** 

Berdasarkan latar belakang tersebut, penelitian ini merumuskan empat 

pertanyaan penelitian berikut: 

1. Bagaimana perbedaan performa klasifikasi teks antara penggunaan BERT sebagai _feature extractor_ (Model A) dan BERT dengan _fine-tuning end-to-end_ (Model B) pada dataset SST-2, ditinjau dari metrik akurasi, precision, recall, dan F1-score? 

2. Apakah perbedaan performa antara Model A dan Model B signifikan secara statistik, serta seberapa besar ukuran efek ( _effect size_ ) dari perbedaan tersebut? 

3. Bagaimana _trade-off_ antara peningkatan performa prediktif dan efisiensi komputasi (waktu inferensi dan memori GPU), serta apakah peningkatan performa sebanding dengan biaya komputasi yang ditimbulkan? 

4. Bagaimana merancang dan membangun produk aplikasi web interaktif yang relevan untuk melakukan inferensi pembandingan model secara _real-time_ serta memvisualisasikan hasil analisis statistik komparatif tersebut?

## **1.3. Batasan Masalah** 

Untuk menjaga fokus penelitian serta memastikan konsistensi dan validitas eksperimen, ruang lingkup penelitian ini dibatasi pada beberapa aspek berikut: 

1. Penelitian difokuskan pada penggunaan satu arsitektur model bahasa, yaitu BERT _Base Uncased_ ( _bert-base-uncased_ ), guna menjaga konsistensi dan kontrol eksperimen tanpa membandingkan dengan varian model lain. 

2. Dataset yang digunakan adalah SST-2 dari benchmark GLUE, yang merupakan tugas klasifikasi sentimen biner berbahasa Inggris. 

3. Pembagian data menggunakan skema *re-partitioning* terkontrol untuk menghindari kebocoran data (*data leakage*). Data latih resmi SST-2 (67.349 sampel) dibagi menjadi *Train Set* internal (60.614 sampel / 90%) dan *Validation Set* internal (6.735 sampel / 10%) untuk validasi performa iterasi dan pelatihan. Adapun data validasi resmi GLUE SST-2 (872 sampel) difungsikan murni sebagai *Held-out Test Set* (data uji terisolasi) yang hanya diuji satu kali pada evaluasi akhir. 

4. Untuk mendukung analisis statistik inferensial yang *valid* dan *robust* (khususnya *Wilcoxon Signed-Rank Test* berpasangan), eksperimen dijalankan menggunakan 6 nilai _random seed_ yang terkontrol ($n=6$, yaitu 42, 123, 777, 999, 1234, dan 2024). 

5. Penelitian hanya membandingkan dua konfigurasi model, yaitu: 

   5.1. Model A: BERT digunakan sebagai _feature extractor_ dengan parameter dibekukan, diikuti oleh _classification head_ linear (768→2). 

   5.2. Model B: BERT dilatih menggunakan pendekatan _fine-tuning end-to-end_ melalui arsitektur _BertForSequenceClassification_ . 

6. Evaluasi performa difokuskan pada tiga aspek utama, yaitu: 

   6.1. Performa prediktif: akurasi, _precision_ , _recall_ , dan _F1-score_ . 

   6.2. Efisiensi komputasi: waktu inferensi (ms/sampel) dan penggunaan memori GPU (VRAM peak). 

   6.3. Unjuk kerja sistem web: latensi respons API inferensi real-time.

7. Eksperimen pelatihan dilakukan pada lingkungan komputasi berbasis GPU (NVIDIA Tesla T4 atau setara), tanpa mempertimbangkan variasi perangkat keras lain. 

8. Penelitian ini tidak mencakup eksplorasi _hyperparameter tuning_ secara ekstensif, tidak membandingkan arsitektur model lain di luar BERT, serta tidak mengeksplorasi variasi desain _classification head_ di luar konfigurasi yang telah ditetapkan. 

9. Penelitian ini tidak mencakup variasi dataset di luar SST-2, sehingga evaluasi dibatasi pada tugas klasifikasi sentimen biner berbahasa Inggris. 

10. Analisis difokuskan pada evaluasi perbedaan performa antara kedua konfigurasi model dalam konteks klasifikasi teks, tanpa membahas aspek interpretabilitas model atau generalisasi lintas domain. 

11. Output penelitian ini dilengkapi dengan pengembangan produk aplikasi web interaktif berbasis *FastAPI* (Backend API) dan *React/Vite* (Frontend UI) yang berfungsi sebagai portal penelitian dengan tiga halaman utama: (a) Beranda informasi penelitian, (b) Komparator Inferensi Sentimen *Real-Time*, dan (c) *Dashboard* Analitik *Benchmark* Statistik. Aplikasi dirancang dengan sistem autentikasi berbasis peran (*Role-Based Access Control* / RBAC) serta kemampuan *Progressive Web App* (PWA) yang memungkinkan instalasi langsung pada perangkat pengguna.

## **1.4. Tujuan Penelitian** 

Sesuai dengan rumusan masalah yang telah dirumuskan, tujuan penelitian ini adalah sebagai berikut: 

1. Mengukur dan membandingkan performa klasifikasi teks antara Model A (BERT _feature extractor_ ) dan Model B (BERT _fine-tuning_ ) pada dataset SST-2 berdasarkan metrik akurasi, _precision_ , _recall_ , dan _F1-score_ . 

2. Menganalisis signifikansi statistik dari perbedaan performa antara kedua model serta mengkuantifikasi besar pengaruh ( _effect size_ ) dari perbedaan tersebut melalui uji McNemar, Wilcoxon, Bootstrap CI, dan Cohen's d. 

3. Mengevaluasi _trade-off_ antara peningkatan performa prediktif dan biaya komputasi, serta menilai apakah peningkatan performa yang diperoleh melalui _fine-tuning_ sebanding dengan sumber daya komputasi yang digunakan. 

4. Merancang dan mengimplementasikan produk aplikasi web interaktif berbasis *FastAPI* dan *React* yang menyediakan fitur komparasi inferensi sentimen secara *real-time*, visualisasi *dashboard* evaluasi statistik *benchmark* model, serta sistem autentikasi berbasis peran untuk pengelolaan akses data penelitian.

## **1.5. Manfaat Penelitian** 

Berdasarkan tujuan penelitian yang telah dirumuskan, penelitian ini diharapkan dapat memberikan kontribusi ilmiah yang relevan serta manfaat praktis yang aplikatif, sebagai berikut: 

### **1.5.1. Manfaat Teoritis** 

Penelitian ini menghasilkan bukti empiris kuantitatif yang terverifikasi secara statistik mengenai efek _fine-tuning_ pada model BERT dalam tugas klasifikasi teks. Temuan ini berkontribusi dalam memperkuat validitas empiris pendekatan _transfer learning_ , khususnya dalam perbandingan antara metode _feature extraction_ dan _fine-tuning_ . 

### **1.5.2. Manfaat Praktis** 

Penelitian ini memberikan manfaat praktis bagi berbagai pihak. Adapun manfaat tersebut dapat diuraikan sebagai berikut: 

1. Bagi institusi akademik, penelitian ini menyediakan contoh desain eksperimen terkontrol berbasis _machine learning_ yang dilengkapi produk aplikasi web interaktif yang dapat dijadikan referensi dalam pembelajaran pada bidang kecerdasan buatan, pemrosesan bahasa alami, dan sistem informasi. 

2. Bagi peneliti, studi ini memberikan pengalaman dalam merancang eksperimen komputasional terkontrol, mengimplementasikan model berbasis _transformer_ menggunakan pustaka _Hugging Face Transformers_ , menerapkan metode statistik inferensial, serta membangun sistem inferensi NLP berbasis web. 

3. Bagi praktisi dan pengembang sistem NLP, hasil penelitian ini memberikan dasar kuantitatif dalam pengambilan keputusan terkait pemilihan strategi adaptasi model BERT, khususnya dalam mempertimbangkan _trade-off_ antara akurasi prediktif dan efisiensi komputasi. 

4. Bagi pengguna akhir dan penguji sistem, menyediakan aplikasi web interaktif yang siap pakai untuk membandingkan inferensi sentimen secara *real-time* serta memvisualisasikan hasil analisis statistik secara intuitif.

## **1.6. Sistematika Penulisan** 

Penulisan skripsi ini disusun dalam lima bab dengan sistematika sebagai 

berikut: 

### **Bab I Pendahuluan** 

Menguraikan latar belakang, rumusan masalah, batasan masalah, tujuan, manfaat penelitian, dan sistematika penulisan. 

### **Bab II Tinjauan Pustaka** 

Membahas landasan teori yang meliputi klasifikasi teks, arsitektur _Transformer_ , _transfer learning_ , BERT, dataset SST-2, metrik evaluasi, serta metode statistik inferensial. Selain itu, bab ini juga memuat kajian penelitian terdahulu, identifikasi research gap, kerangka konseptual, dan hipotesis penelitian. 

### **Bab III Metodologi Penelitian** 

Menjelaskan pendekatan kuantitatif eksperimental, lingkungan penelitian, desain eksperimen, arsitektur Model A dan Model B, parameter pelatihan, teknik analisis statistik, serta **rancangan arsitektur produk aplikasi web berbasis FastAPI dan React**.

## **BAB II** 

## **TINJAUAN PUSTAKA** 

## **2.1.** **_Natural Language Processing_ (NLP)** 

_Natural Language Processing_ (NLP) merupakan cabang dari kecerdasan buatan yang berfokus pada interaksi antara komputer dan bahasa manusia untuk memproses, menginterpretasikan, serta menghasilkan teks secara otomatis (Nasution, 2021; Minaee et al., 2021). Bidang ini mencakup berbagai tugas penting seperti klasifikasi teks, analisis sentimen, dan penerjemahan mesin (Lubis, 2022). 

Perkembangan NLP modern didorong oleh ketersediaan data teks berskala besar serta pergeseran dari representasi kata statis menuju representasi kontekstual berbasis jaringan saraf (Peters et al., 2018). Pendekatan kontekstual ini memungkinkan sistem untuk menangkap dinamika makna semantik yang berbeda tergantung pada lingkungan kalimatnya. 

## **2.2. Klasifikasi Teks dalam NLP** 

Klasifikasi teks merupakan salah satu tugas utama dalam NLP yang bertujuan untuk menetapkan label kategori pada dokumen atau kalimat berdasarkan isi semantiknya. Tugas ini memiliki berbagai aplikasi praktis, seperti analisis sentimen, deteksi spam, klasifikasi berita, serta pengelompokan konten digital (Minaee et al., 2021). 

Pendekatan awal dalam klasifikasi teks umumnya menggunakan metode pembelajaran mesin klasik seperti _Naïve Bayes_ dan _Support Vector Machine_ (SVM) dengan representasi berbasis _bag-of-words_ atau TF-IDF. Representasi ini memperlakukan teks sebagai kumpulan kata tanpa mempertimbangkan struktur 

urutan maupun relasi kontekstual secara eksplisit, sehingga memiliki keterbatasan dalam menangkap makna semantik yang kompleks. 

Untuk mengatasi keterbatasan tersebut, pendekatan berbasis _deep learning_ diperkenalkan dengan kemampuan untuk mempelajari representasi fitur secara otomatis dari data. Model _deep learning_ mampu menangkap dependensi antar kata serta struktur linguistik yang lebih kompleks, sehingga meningkatkan performa klasifikasi teks pada berbagai tugas. 

## **2.3.** **_Deep Learning_ dalam Pemrosesan Bahasa** 

_Deep learning_ merupakan pendekatan pembelajaran mesin yang memungkinkan model mempelajari representasi data dalam bentuk hierarki konsep melalui banyak lapisan pemrosesan. Pendekatan ini tidak memerlukan rekayasa fitur manual secara eksplisit karena fitur dipelajari langsung dari data selama proses pelatihan menggunakan algoritma optimasi seperti _backpropagation_ (Goodfellow et al., 2016). 

Dalam konteks NLP, berbagai arsitektur _deep learning_ telah dikembangkan, termasuk _Convolutional Neural Network_ (CNN) dan _Recurrent Neural Network_ (RNN). CNN efektif dalam menangkap pola lokal dalam teks, sedangkan RNN dirancang untuk memodelkan data sekuensial dengan mempertimbangkan urutan kata. Namun, RNN memiliki keterbatasan dalam menangkap dependensi jangka panjang serta rentan terhadap masalah _vanishing gradient_ . 

## **2.4. Arsitektur Transformer** 

Sebagai alternatif dari model sekuensial seperti RNN, arsitektur _Transformer_ diperkenalkan oleh Vaswani et al. (2017) dengan memanfaatkan mekanisme _self-attention_ . Mekanisme ini memungkinkan model untuk menghitung 

hubungan antar token dalam suatu urutan secara langsung tanpa bergantung pada pemrosesan sekuensial. 

_Transformer_ mampu memproses seluruh input secara paralel dan menangkap dependensi global dalam teks secara lebih efisien. Hal ini menjadikan _Transformer_ sebagai pendekatan yang banyak digunakan dalam berbagai tugas NLP modern, termasuk klasifikasi teks. 

## **2.5. BERT (** **_Bidirectional Encoder Representations from Transformers_ )** 

Salah satu implementasi paling berpengaruh dari arsitektur _Transformer_ adalah BERT yang diperkenalkan oleh Devlin et al. (2018). BERT dirancang untuk menghasilkan representasi bahasa yang bersifat bidireksional, yaitu dengan mempertimbangkan konteks kiri dan kanan secara simultan dalam setiap lapisan model. 

BERT dilatih menggunakan dua tugas utama, yaitu _masked language modeling_ dan _next sentence prediction_ , yang memungkinkan model mempelajari struktur bahasa secara mendalam. Model ini telah menunjukkan performa yang sangat baik pada berbagai _benchmark_ NLP, termasuk GLUE yang mencakup tugas klasifikasi sentimen seperti SST-2. 

## **2.6.** **_Transfer Learning_ dalam NLP** 

_Transfer learning_ merupakan pendekatan yang memanfaatkan pengetahuan yang telah dipelajari model pada suatu tugas untuk diterapkan pada tugas lain yang terkait. Dalam NLP, pendekatan ini umumnya dilakukan melalui dua tahap utama, yaitu: 

1. _Pre-training_ , yaitu pelatihan model pada korpus teks besar untuk mempelajari representasi bahasa umum. 

2. _Fine-tuning_ , yaitu penyesuaian model pada dataset spesifik sesuai tugas 

yang dihadapi. 

Pendekatan ini terbukti efektif dalam meningkatkan performa model, 

terutama ketika data berlabel terbatas. Penelitian oleh Howard dan Ruder (2018) 

menunjukkan bahwa _fine-tuning_ model bahasa dapat mencapai performa tinggi bahkan dengan jumlah data yang relatif kecil. 

## **2.7.** **_Feature Extraction_ vs** **_Fine-Tuning_ pada BERT** 

Dalam adaptasi model BERT ke tugas klasifikasi teks, terdapat dua pendekatan utama, yaitu: 

1. **_Feature-Based Approach_ (_Feature Extraction_)**: Pada pendekatan ini, parameter *transformer encoder* BERT dibekukan (_frozen_) dan berfungsi murni sebagai ekstraktor fitur kontekstual. Representasi token `[CLS]` (768 dimensi) kemudian diteruskan sebagai input bagi *classifier head* linear. 

2. **_Fine-Tuning Approach_**: Pada pendekatan ini, seluruh parameter model BERT (~110 juta parameter) dilatih ulang secara bersama-sama dengan *classification head* untuk menyesuaikan representasi internal terhadap tugas spesifik. 

Penelitian oleh Hao et al. (2020) menunjukkan bahwa proses _fine-tuning_ tidak hanya menyesuaikan output model, tetapi juga mengubah representasi internal, khususnya pada mekanisme _attention_ di lapisan akhir serta fitur pada lapisan menengah. Selain itu, _fine-tuning_ secara umum menunjukkan performa yang lebih baik dibandingkan pendekatan _feature-based_ , meskipun memerlukan sumber daya komputasi yang lebih tinggi. 

## **2.8. Dataset SST-2 (** **_Stanford Sentiment Treebank_ )** 

Dataset yang digunakan dalam penelitian ini adalah _Stanford Sentiment Treebank_ (SST-2) yang diperkenalkan oleh Socher et al. (2013). Dataset ini terdiri dari kalimat-kalimat ulasan film yang diberi label sentimen positif atau negatif. 

SST-2 merupakan bagian dari _benchmark_ GLUE dan telah menjadi standar evaluasi dalam penelitian klasifikasi teks. Dataset ini memungkinkan evaluasi model dalam memahami komposisionalitas makna dalam kalimat, termasuk efek negasi dan struktur linguistik lainnya. 

## **2.9. Metode Evaluasi Klasifikasi** 

Evaluasi performa model klasifikasi teks dalam penelitian ini menggunakan beberapa metrik utama, yaitu: 

1. _Accuracy_ , untuk mengukur proporsi prediksi yang benar dari keseluruhan sampel. 
2. _Precision_ , untuk mengukur ketepatan prediksi kelas positif. 
3. _Recall_ , untuk mengukur kemampuan model dalam mengidentifikasi seluruh instance positif. 
4. _F1-score_ , sebagai rata-rata harmonis antara precision dan recall yang menggambarkan keseimbangan performa model. 

## **2.10. Metode Statistik Inferensial** 

Untuk memastikan bahwa perbedaan performa antar model signifikan secara statistik dan bukan disebabkan oleh variansi acak, penelitian ini menerapkan empat metode statistik inferensial: 

1. **McNemar’s Test**: Menguji perbedaan proporsi kesalahan klasifikasi biner pada data sampel berpasangan (*Held-out Test Set*). 
2. **Wilcoxon Signed-Rank Test**: Uji non-parametrik untuk membandingkan median perbedaan performa F1-score antar model dari $n=6$ *random seed*. 
3. **Bootstrap Confidence Interval**: Metode *resampling* (10.000 kali) untuk mengestimasi interval kepercayaan 95% dari selisih performa tanpa asumsi distribusi tertentu. 
4. **Cohen’s d**: Mengukur ukuran efek (_effect size_) numerik dari perbedaan performa antar kedua model. 

## **2.11. Arsitektur Aplikasi Web, REST API, dan Progressive Web App (PWA)** 

Aplikasi web modern mengadopsi arsitektur terpisah (*decoupled architecture*) yang memisahkan antara lapisan *backend API* dan *frontend user interface*. Pendekatan ini memberikan fleksibilitas tinggi dalam penyajian inferensi model *machine learning* secara *real-time* serta visualisasi *dashboard* data.

1. **REST API (Representational State Transfer)**: Standar komunikasi data berbasis HTTP dengan format JSON. Framework **FastAPI** dimanfaatkan untuk menerima *request* teks dari klien, menjalankan inferensi model PyTorch/BERT, dan mengembalikan *response* label, skor kepercayaan %, serta latensi ms secara *real-time*.
2. **Frontend Web Framework**: Antarmuka pengguna berbasis *Single Page Application* (SPA) dengan **React** dan **Vite** yang menyajikan tampilan *side-by-side comparator* dan *interactive benchmark dashboard*.
3. **Progressive Web App (PWA)**: Pendekatan pengembangan web yang menghadirkan pengalaman mirip aplikasi native pada perangkat seluler. PWA mengandalkan dua komponen utama:
   1. **Service Worker**: Skrip latar belakang yang bertindak sebagai proksi jaringan antara web browser, cache lokal, dan server backend. Komponen ini mengadopsi strategi caching (seperti *Stale-While-Revalidate* dan *Network-First*) untuk menyimpan aset statis dan data respons API lokal, memungkinkan akses offline terhadap data benchmark skripsi.
   2. **Web App Manifest (`manifest.json`)**: File konfigurasi berformat JSON yang mendefinisikan metadata aplikasi (nama, ikon, warna tema, dan display mode) sehingga aplikasi dapat diinstal langsung ke layar utama (*Add to Home Screen - A2HS*) tanpa melalui App Store atau Play Store.
4. **Pustaka Visualisasi Data (*Recharts*)**: Penyajian data statistik pada *dashboard* web memanfaatkan pustaka visualisasi berbasis React seperti *Recharts*, yang mendukung pembuatan grafik batang (*bar chart*), grafik radar (*radar chart*), dan komponen visual interaktif lainnya secara deklaratif.
5. **Pustaka Animasi Antarmuka (*Framer Motion*)**: Untuk meningkatkan kualitas pengalaman pengguna (*user experience*), pustaka *Framer Motion* digunakan untuk menambahkan animasi transisi halaman, efek *scroll reveal* (`whileInView`), serta *micro-interactions* pada komponen antarmuka.
6. **Kontrol Akses Berbasis Peran (*Role-Based Access Control* / RBAC)**: Mekanisme otorisasi yang membatasi akses fitur tertentu pada aplikasi web berdasarkan peran pengguna yang terotentikasi. Dalam konteks aplikasi web penelitian, RBAC digunakan untuk membedakan hak akses antara pengguna publik dan pengguna terotentikasi (misalnya dosen pembimbing atau penguji) terhadap data *benchmark* statistik.

## **2.12. Penelitian Terdahulu** 

Beberapa penelitian terdahulu yang relevan dengan klasifikasi teks berbasis BERT dan pendekatan _fine-tuning_ dirangkum dalam Tabel 2.1. 

**Tabel 2.1 Penelitian Terdahulu** 

|**Peneliti**|**Metode**|**Temuan Utama**|**Keterbatasan**|
|---|---|---|---|
|Qasim et al. (2022)|BERT + *Transfer Learning*|Meningkatkan akurasi klasifikasi teks|Tidak membandingkan *fine-tuning* vs *feature extraction* secara terkontrol|
|Zaman-Khan et al. (2024)|BERT-based Classification|Performa tinggi pada berbagai dataset|Tidak menggunakan uji statistik inferensial|
|Hao et al. (2020)|Analisis *Fine-Tuning* BERT|*Fine-tuning* mengubah representasi internal model|Tidak fokus pada evaluasi performa klasifikasi|
|Howard & Ruder (2018)|ULMFiT (*Transfer Learning*)|*Fine-tuning* efektif pada data terbatas|Tidak menggunakan arsitektur *Transformer* modern|

## **2.13. Research Gap** 

Berdasarkan sintesis penelitian terdahulu, diidentifikasi 6 kesenjangan riset utama yang menjadi dasar dilakukannya studi ini, sebagaimana dirangkum dalam Tabel 2.2. 

**Tabel 2.2 Research Gap** 

|**Aspek**|**Penelitian Sebelumnya**|**Penelitian Ini**|
|---|---|---|
|Perbandingan Model|Tidak ada perbandingan terkontrol|Membandingkan _feature extraction_ vs _fine-tuning_ secara terkontrol|
|Validasi Statistik|Tidak menggunakan uji inferensial|Menggunakan uji inferensial (_McNemar_, _Wilcoxon_, _Bootstrap CI_, _Cohen’s d_)|
|Desain Eksperimen|Tidak terkontrol|Eksperimen terkontrol (dataset & parameter simetris)|
|Evaluasi Komputasi|Fokus pada akurasi saja|Menambahkan efisiensi komputasi (waktu inferensi & VRAM GPU)|
|_Robustness_|_Single run_|Eksperimen _multi-seed_ ($n = 6$ seed terkontrol)|
|Output Sistem|Hanya eksplorasi skrip / *notebook*|Produk Aplikasi Web Interaktif (*FastAPI* & *React UI*)|

Kesenjangan pada Tabel 2.2 menunjukkan pentingnya merancang eksperimen yang mengisolasi variabel perlakuan, memverifikasi signifikansi perbedaan performa secara statistik, serta menyajikan hasil riset ke dalam bentuk produk aplikasi web yang siap pakai.


## **2.14. Kerangka Konseptual** 

Berdasarkan kesenjangan penelitian yang telah diidentifikasi, diperlukan suatu kerangka konseptual yang mampu menggambarkan hubungan antar variabel secara sistematis serta mendukung perancangan eksperimen yang terkontrol dan pengembangan sistem web. Penelitian ini berfokus pada perbandingan dua pendekatan adaptasi model BERT, yaitu _feature extraction_ dan _fine-tuning_ . 

Variabel independen dalam penelitian ini adalah pendekatan adaptasi model, sedangkan variabel dependen meliputi performa klasifikasi ( _accuracy_ , _precision_ , _recall_ , _F1-score_ ), efisiensi komputasi (waktu inferensi dan VRAM GPU), serta unjuk kerja latensi pada aplikasi web. 

```text
+-----------------------------------------------------------------------------------+
|                           Model Adaptation Strategy                               |
|        * Feature Extraction (Model A)         * End-to-End Fine-Tuning (Model B)   |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                                 Model Comparison                                  |
|  * Model A: BERT (Frozen) -> [CLS] -> Linear (768 -> 2)                           |
|  * Model B: BERT (Trainable) -> BertForSequenceClassification (768 -> 2)          |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                                Evaluation Metrics                                 |
|  * Predictive Performance : Accuracy, Precision, Recall, F1-score                 |
|  * Computational Cost     : Inference Time (ms/sample), Peak VRAM (MB)            |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                               Statistical Validation                              |
|         McNemar Test | Wilcoxon Test (n=6) | Bootstrap CI | Cohen's d            |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                        Web Product Deployment & Application                       |
|  * FastAPI Backend  : REST API (Inference, Benchmark, Auth, Health Check)         |
|  * React/Vite PWA   : Beranda, Comparator, Analytics Dashboard (RBAC Protected)  |
+-----------------------------------------------------------------------------------+
```

## **2.15. Hipotesis Penelitian** 

Berdasarkan kerangka konseptual yang telah disusun, penelitian ini bertujuan untuk menguji apakah terdapat perbedaan performa yang signifikan antara dua pendekatan adaptasi model BERT, yaitu _feature extraction_ dan _finetuning_ . Untuk itu, digunakan beberapa metode statistik inferensial guna memastikan validitas hasil secara kuantitatif. Hipotesis statistik dalam penelitian ini dirumuskan sebagai berikut: 

**Tabel 2.3 Hipotesis Statistik Penelitian** 

|**Metode Uji**|**Hipotesis Nol (H0)**|**Hipotesis Alternatif (H1)**|
|---|---|---|
|McNemar’s Test|Tidak terdapat perbedaan yang signifikan dalam proporsi prediksi antara Model A dan Model B (kesalahan bersifat simetris).|Terdapat perbedaan yang signifikan dalam proporsi prediksi antara Model A dan Model B (kesalahan tidak simetris).|
|Wilcoxon Signed-Rank Test|Median perbedaan performa F1-score dari $n=6$ seed antara Model A dan Model B adalah nol.|Median perbedaan performa F1-score dari $n=6$ seed antara Model A dan Model B tidak sama dengan nol ($p < 0.05$).|
|Bootstrap Confidence Interval|Interval kepercayaan 95% dari selisih performa mencakup nilai nol (tidak signifikan).|Interval kepercayaan 95% dari selisih performa tidak mencakup nilai nol (signifikan).|
|Cohen’s d (Effect Size)|Nilai effect size mendekati nol ($d \approx 0$), menunjukkan tidak adanya pengaruh yang berarti.|Nilai effect size berbeda dari nol ($d \ne 0$), menunjukkan adanya pengaruh yang berarti.|

Berdasarkan Tabel 2.3, seluruh hipotesis dalam penelitian ini dirumuskan untuk menguji perbedaan performa antara Model A dan Model B dari berbagai perspektif statistik. Setiap metode uji digunakan untuk melengkapi analisis, baik dari sisi signifikansi maupun besar pengaruh perbedaan yang dihasilkan. Dengan demikian, pengujian hipotesis tidak hanya bersifat deskriptif, tetapi juga inferensial dan komprehensif. Pendekatan ini diharapkan mampu memberikan hasil yang lebih valid dan dapat dipertanggungjawabkan.


## **BAB III** 

## **METODOLOGI PENELITIAN** 

## **3.1. Pendekatan dan Desain Penelitian** 

Penelitian ini menggunakan pendekatan kuantitatif dengan metode eksperimen. Pendekatan kuantitatif dipilih karena penelitian ini bertujuan untuk menguji hipotesis secara objektif melalui pengukuran numerik dan analisis statistik terhadap performa model klasifikasi teks. Menurut Creswell (2014), penelitian kuantitatif berfokus pada pengujian teori melalui pengukuran variabel dan analisis statistik untuk menentukan hubungan antar variabel. 

Desain penelitian yang digunakan adalah eksperimen komparatif terkontrol ( _controlled comparative experiment_ ), yaitu membandingkan dua perlakuan dalam kondisi yang dikendalikan secara ketat agar perbedaan hasil dapat diatribusikan secara valid pada variabel yang diteliti. Dalam konteks ini, dua perlakuan yang dibandingkan adalah strategi adaptasi model BERT, yaitu _feature extraction_ dan _fine-tuning_ . Pendekatan ini sejalan dengan prinsip desain eksperimen yang menekankan kontrol terhadap variabel perancu untuk meningkatkan validitas inferensi kausal sebagaimana dijelaskan oleh Shadish et al. (2002) dalam teori validitas eksperimen. Selain itu, penelitian ini diakhiri dengan tahap rekayasa sistem (*system engineering*) untuk mengimplementasikan model ke dalam produk aplikasi web interaktif.

## **3.2 Variabel Penelitian** 

Berdasarkan desain penelitian yang telah dijelaskan pada subbab sebelumnya, penelitian ini melibatkan tiga jenis variabel, yaitu variabel independen, variabel dependen, dan variabel kontrol. Variabel independen adalah strategi adaptasi model BERT yang terdiri dari dua kondisi, yaitu _feature extraction_ dan _fine-tuning end-to-end_ . Variabel dependen berupa performa model klasifikasi teks yang diukur menggunakan metrik prediktif (akurasi, _precision_ , _recall_ , dan _F1-score_ ), efisiensi komputasi (waktu inferensi dan VRAM GPU), serta unjuk kerja latensi pada aplikasi web. 

Untuk menjaga konsistensi dan validitas eksperimen, beberapa variabel dikontrol, meliputi arsitektur model yang digunakan (BERT _Base Uncased_ ), dataset (SST-2), skema pembagian data, parameter pelatihan (*batch size*, *learning rate schedule*), serta lingkungan komputasi. Ringkasan klasifikasi variabel dalam penelitian ini disajikan pada Tabel 3.1. 

**Tabel 3.1. Variabel Penelitian** 

|**Jenis Variabel**|**Nama Variabel**|**Deskripsi**|
|---|---|---|
|Variabel Independen|Strategi Adaptasi Model BERT|Variabel yang dimanipulasi dalam penelitian, terdiri dari dua kondisi, yaitu penggunaan BERT sebagai _feature extractor_ (parameter dibekukan) dan BERT dengan _fine-tuning end-to-end_ (seluruh parameter dilatih ulang).|
|Variabel Dependen|Performa Prediktif Model|Metrik numerik meliputi akurasi, _precision_ , _recall_ , dan _F1-score_ untuk mengevaluasi kemampuan model dalam klasifikasi teks.|
|Variabel Dependen|Efisiensi Komputasi & Web Latency|Waktu inferensi (ms/sampel), penggunaan memori GPU VRAM *peak* (MB), serta latensi respons API pada aplikasi web.|
|Variabel Kontrol|Arsitektur Model|Menggunakan arsitektur yang sama, yaitu BERT _Base Uncased_ (`bert-base-uncased`), untuk memastikan konsistensi eksperimen.|
|Variabel Kontrol|Dataset & Skema Partitioning|Dataset SST-2 dari GLUE benchmark dengan pembagian data latih internal (60.614), validasi internal (6.735), dan *held-out test set* terisolasi (872).|
|Variabel Kontrol|Pengaturan Multi-Seed|Penggunaan 6 *random seed* yang terkontrol ($n=6$, yaitu 42, 123, 777, 999, 1234, dan 2024).|
|Variabel Kontrol|Batch Size & Hyperparameter|Batch size pelatihan dan inferensi dijaga seragam pada nilai 32 untuk kedua konfigurasi model.|
|Variabel Kontrol|Lingkungan Komputasi|Eksperimen dijalankan pada GPU NVIDIA Tesla T4 16GB pada Google Colab untuk perbandingan yang adil.|

## **3.3. Lokasi dan Waktu Penelitian** 

Penelitian ini dilaksanakan secara komputasional menggunakan _platform_ _Google Colab_ sebagai lingkungan eksperimen berbasis _cloud computing_ dan lingkungan lokal/cloud server untuk *deployment* aplikasi web. Seluruh proses penelitian, mulai dari pemrosesan data hingga evaluasi model dan *deployment* web, dilakukan secara daring. Pendekatan ini memungkinkan fleksibilitas dalam penggunaan sumber daya komputasi sekaligus mendukung _reproducibility_ eksperimen. 

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

## **3.4. Lingkungan Penelitian** 

Eksperimen dalam penelitian ini dijalankan menggunakan GPU NVIDIA Tesla T4 dengan kapasitas memori 16 GB yang tersedia pada _platform Google Colab_ . Pemilihan akselerasi komputasi GPU ini penting untuk mempercepat proses pelatihan dan evaluasi model Transformer berskala besar (Nugroho, 2021). _Pipeline_ penelitian dibangun menggunakan bahasa pemrograman Python 3.x dengan _framework_ utama _PyTorch_ dan pustaka _Hugging Face Transformers_ . Pemilihan lingkungan ini didasarkan pada kebutuhan komputasi model _deep learning_ yang tinggi serta dukungan ekosistem yang luas untuk implementasi model berbasis _Transformer_ . Pengembangan aplikasi web menggunakan *FastAPI* sebagai framework REST API dan *React / Vite* sebagai framework antarmuka pengguna.

## **3.5. Dataset Penelitian** 

Dataset yang digunakan adalah SST-2 yang merupakan bagian dari _benchmark_ GLUE. Dataset ini terdiri dari kalimat berbahasa Inggris yang diklasifikasikan ke dalam dua label sentimen, yaitu positif dan negatif (Socher et al., 2013). Untuk menghindari kebocoran data (*data leakage*) serta kebingungan akibat tidak tersedianya label publik pada data uji resmi GLUE SST-2, penelitian ini menerapkan skema *re-partitioning* yang ketat:

1. Data latih resmi SST-2 (67.349 sampel) dibagi secara acak terstrata menjadi **Data Latih Internal** (60.614 sampel / 90%) untuk pembaruan bobot model, dan **Data Validasi Internal** (6.735 sampel / 10%) untuk validasi performa iterasi dan penalaan *hyperparameter*.
2. Data validasi resmi SST-2 (872 sampel) difungsikan murni sebagai **Held-out Test Set** (data uji terisolasi) yang hanya diuji satu kali pada tahap evaluasi akhir untuk mengukur kemampuan generalisasi model.

Jumlah data pada masing-masing subset ditunjukkan pada Tabel 3.3. 

**Tabel 3.3. Distribusi Data pada Dataset SST-2** 

|**Subset Data**|**Jumlah Baris**|**Fungsi / Peranan dalam Penelitian**|
|---|---|---|
|Train (Internal)|60.614|Pelatihan dan pembaruan bobot parameter model|
|Validation (Internal)|6.735|Validasi performa iterasi dan penalaan *hyperparameter*|
|Held-out Test Set|872|Evaluasi akhir performa prediktif & uji statistik|
|**Total Digunakan**|**68.221**|**Total sampel berlabel aktif**|

## **3.6. Data Preparation** 

Proses data _preparation_ dilakukan untuk menyesuaikan format data teks mentah dengan kebutuhan arsitektur model BERT. Tahap ini meliputi proses tokenisasi menggunakan _tokenizer_ BERT ( _bert-base-uncased_ ), yang mengubah teks menjadi representasi token ID sesuai dengan _vocabulary_ model. 

Selanjutnya dilakukan _padding_ dan _truncation_ untuk memastikan panjang input seragam sesuai dengan batas maksimum panjang sekuens ($max\_length = 128$). Data kemudian dikonversi ke dalam PyTorch `Tensor` yang mencakup *input IDs*, *attention mask*, dan *token type IDs*.

## **3.7. Desain Eksperimen** 

Penelitian ini dirancang sebagai eksperimen komparatif terkontrol yang membandingkan dua strategi adaptasi model BERT dalam tugas klasifikasi teks. Kedua model dikembangkan dengan arsitektur dasar yang sama (`bert-base-uncased`), namun dibedakan berdasarkan mekanisme pelatihan yang digunakan:

1. **Model A (Feature Extraction)**: Seluruh parameter 12 lapisan *transformer encoder* BERT dibekukan (*frozen*). Output token `[CLS]` (768 dimensi) diteruskan secara langsung ke *classification head* berupa `Linear(768 -> 2)`. Hanya parameter pada *linear layer* (1.538 parameter) yang diperbarui selama proses pelatihan.
2. **Model B (End-to-End Fine-Tuning)**: Seluruh parameter BERT (~110 juta parameter) dilatih ulang secara bersamaan dengan *classification head* `Linear(768 -> 2)` melalui kelas `BertForSequenceClassification`.

Untuk memastikan transparansi, reproduktibilitas, dan kesetaraan perlakuan eksperimen (*fair baseline*), konfigurasi parameter yang digunakan pada kedua model dirangkum dalam Tabel 3.7.

**Tabel 3.7. Parameter Penelitian** 

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
|Random Seed|42, 123, 777, 999, 1234, 2024 ($n=6$)|42, 123, 777, 999, 1234, 2024 ($n=6$)|
|Status Parameter BERT|Frozen (dibekukan)|Trainable (end-to-end)|
|Parameter Dilatih|~1.538 parameter|~110.000.000 parameter|
|Optimizer|AdamW|AdamW|
|Learning Rate|1e-3|2e-5|
|Weight Decay|0.01|0.01|
|Warmup Ratio|0.1|0.1|
|Early Stopping|Tidak Digunakan|Tidak Digunakan|
|Maksimum Epoch|1 epoch|1 epoch|

## **3.8. Prosedur Eksperimen** 

Prosedur eksperimen dilaksanakan secara sistematis mengikuti tahapan-tahapan berikut:

```text
+-----------------------------------------------------------------------------------+
|                                 START EXPERIMENT                                  |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                                 Data Preparation                                  |
|   SST-2 Dataset Partitioning: Train (60.614), Val (6.735), Held-out Test (872)   |
|   BertTokenizerFast (lowercase, truncation max_len=128, padding, attention_mask)  |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                            Multi-Seed Training Loop (n=6)                         |
|   Seeds: [42, 123, 777, 999, 1234, 2024]                                          |
|   Model A : Freeze BERT Encoder + Train Linear Classifier (1 Epoch)               |
|   Model B : End-to-End Fine-Tune BERT + Classifier (1 Epoch)                        |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                               Held-Out Test Evaluation                            |
|   Metrics      : Accuracy, Precision, Recall, F1-Score                            |
|   Computation  : Inference Time per Sample (ms) & Peak GPU VRAM (MB)              |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                                Statistical Analysis                               |
|   McNemar Test (Contingency Table)  |  Wilcoxon Signed-Rank Test (n=6 F1 scores)  |
|   Bootstrap 95% Confidence Interval |  Cohen's d Effect Size                            |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                       Model Export & Web Product Integration                      |
|   Export PyTorch Model Checkpoints & Pre-computed Benchmarks JSON                 |
|   Build FastAPI REST API Engine & React UI (Comparator & Benchmark Dashboard)     |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                                 END OF EXPERIMENT                                 |
+-----------------------------------------------------------------------------------+
```

## **3.9. Teknik Analisis Data** 

### **3.9.1. Uji Statistik Inferensial** 

Uji statistik digunakan untuk menentukan apakah perbedaan performa antara Model A dan Model B signifikan secara statistik atau sekadar variasi acak:

1. **McNemar’s Test**: Digunakan pada level prediksi sampel individu pada *Held-out Test Set* (872 sampel) untuk menguji apakah perbedaan proporsi kesalahan klasifikasi bersifat simetris atau asimetris (Dror et al., 2018). Uji ini menghasilkan statistik $\chi^2$ dan nilai $p$-value.
2. **Wilcoxon Signed-Rank Test**: Digunakan pada level agregat untuk membandingkan distribusi F1-score yang diperoleh dari 6 run *random seed* ($n=6$). Dengan $n=6$, nilai $p$-value secara teoritis dapat mencapai $p < 0.05$ (nilai minimum $p = 0,03125$), sehingga uji signifikansi statistik non-parametrik berpasangan menjadi valid.
3. **Bootstrap Confidence Interval**: Menggunakan metode *resampling* dengan pengulangan 10.000 kali (*10,000 bootstrap resamples*) untuk menghitung interval kepercayaan 95% dari perbedaan nilai F1-score antar model (Efron, 1979).
4. **Cohen’s d**: Mengukur ukuran efek (*effect size*) dari perbedaan performa prediktif untuk menilai seberapa besar pengaruh praktis dari perlakuan *fine-tuning* (Cohen, 1988).

### **3.9.2. Evaluasi *Trade-off* Komputasi** 

Evaluasi *trade-off* komputasi mengukur efisiensi penggunaan sumber daya perangkat keras pada dua lingkungan yang berbeda:

1. **Waktu Inferensi pada Lingkungan Eksperimen (GPU Colab)**: Diukur secara presisi menggunakan instrumen PyTorch `torch.cuda.Event(enable_timing=True)` untuk menghindari inkonsistensi eksekusi asinkron CUDA pada GPU Tesla T4.
2. **Waktu Inferensi pada Lingkungan Aplikasi Web (CPU Server)**: Diukur menggunakan rata-rata *wall-clock time* dari 50 iterasi inferensi setelah 5 iterasi *warm-up* untuk menghilangkan *cold-start penalty* alokasi *thread* CPU.
3. **Penggunaan Memori GPU (MB)**: Diukur menggunakan `torch.cuda.max_memory_allocated()` untuk mencatat puncak alokasi VRAM selama proses evaluasi pada lingkungan Colab.

### **3.9.3. *Error Analysis* Berbasis Kategori Linguistik** 

*Error analysis* dilakukan untuk mengidentifikasi pola kesalahan prediksi yang dihasilkan oleh kedua model berdasarkan karakteristik linguistik kalimat. Sampel pada *held-out test set* ($N=872$) diklasifikasikan ke dalam 5 kategori fenomena linguistik berdasarkan analisis sintaksis dan pola leksikal:

1. **Tanpa Negasi (*Standard Sentences*)**: Kalimat langsung tanpa partikel negasi.
2. **Negasi Biner (*Simple Negation*)**: Kalimat yang memuat satu kata negasi langsung seperti *not*, *no*, *never*, atau *without*.
3. **Ironi / Sarkasme dan Negasi Majemuk (*Double Negation & Contrastive Negation*)**: Kalimat dengan struktur negasi majemuk atau kontradiktif yang memerlukan pemahaman semantik komposisional.
4. **Review Panjang (*Long Sequences*, Token Length > 40)**: Kalimat ulasan yang memiliki panjang klausa di atas 40 *token*.
5. **Ambiguitas Tinggi (*High Ambiguity / Mixed Sentiment*)**: Kalimat yang memuat pasangan kata bersentimen positif dan negatif sekaligus dalam satu kalimat.

Untuk setiap kategori $C_k$, akurasi dihitung sebagai rasio prediksi benar terhadap total sampel dalam kategori tersebut. Visualisasi akurasi per-kategori disajikan dalam bentuk grafik radar multidimensi pada *dashboard* aplikasi web.

## **3.10. Rancangan Arsitektur Produk Aplikasi Web**

Untuk memenuhi kebutuhan penyajian hasil penelitian yang dapat diakses secara interaktif oleh pengguna, dosen pembimbing, dan dosen penguji, dirancang sebuah produk aplikasi web berbasis *FastAPI* (Backend REST API) dan *React/Vite* (Frontend SPA). Aplikasi ini berfungsi sebagai portal penelitian yang mengintegrasikan inferensi klasifikasi sentimen secara *real-time* dengan *dashboard* visualisasi statistik *benchmark* komparatif.

### **3.10.1. Modul-Modul Sistem**

Sistem aplikasi web dirancang di atas 7 modul perangkat lunak utama:

1. **Modul *Data Pipeline***: Bertanggung jawab melakukan pra-pemrosesan data teks input pengguna secara *real-time* menggunakan `BertTokenizerFast` (tokenisasi, *truncation*, *padding*, dan konversi ke *tensor* PyTorch) sebelum diteruskan ke modul inferensi.
2. **Modul *Model Engine***: Memuat artefak model terlatih (Model A dan Model B) ke dalam memori GPU/CPU pada saat inisialisasi server untuk melakukan inferensi *dual-model* secara paralel berbasis PyTorch murni. Modul ini dilengkapi dengan fitur *PyTorch Explicit CUDA Synchronization* (`torch.cuda.synchronize()`) sebelum dan sesudah inferensi untuk menjamin kepastian pengukuran latensi eksekusi di VRAM GPU berakurasi mikrodetik tanpa terdistorsi oleh sifat eksekusi asinkron GPU.
3. **Modul Basis Data**: Mengelola persistensi data menggunakan ORM *SQLAlchemy* dengan basis data *SQLite* untuk mencatat riwayat prediksi pengguna, menyimpan log *benchmark* multi-*seed*, dan menyimpan hasil pengujian statistik inferensial.
4. **Modul REST API *Service***: Dibangun dengan *framework FastAPI* untuk menyediakan *endpoint* komunikasi data berbasis format JSON antara *frontend* dan *backend*. Modul ini menangani operasi inferensi, penyajian data *benchmark*, manajemen riwayat prediksi, pemeriksaan kesehatan server, serta autentikasi pengguna.
5. **Modul Autentikasi dan Kontrol Akses (RBAC)**: Mengimplementasikan sistem *Role-Based Access Control* yang membedakan hak akses antara pengguna publik dan pengguna terotentikasi (dosen pembimbing, dosen penguji, dan peneliti). Halaman *Dashboard* Analitik *Benchmark* dirancang sebagai halaman terlindungi (*protected route*) yang hanya dapat diakses setelah proses autentikasi berhasil.
6. **Modul Pemantauan Kesehatan Jaringan & Perangkat (*Device Status Badge*)**: Melakukan *polling* berkala (setiap 12 detik) ke *endpoint* `/api/health` untuk memantau status konektivitas dan mengidentifikasi perangkat keras server yang sedang aktif. Sistem secara otomatis menampilkan *Dynamic Status Badge* di *Navbar*: lencana 🟢 **`GPU`** (terhubung ke Colab Tesla T4 GPU), lencana 🔵 **`CPU`** (terhubung ke Railway CPU backup), atau lencana 🔴 **`Offline`** (terputus dari kedua backend).
7. **Modul Antarmuka Pengguna (React PWA)**: Dibangun dengan *React*, *Tailwind CSS*, *Recharts* (visualisasi data), dan *Framer Motion* (animasi antarmuka). Modul ini menyajikan tiga halaman utama dalam arsitektur *Single Page Application* (SPA) yang dilengkapi kemampuan *Progressive Web App* (PWA) untuk instalasi pada perangkat pengguna.

### **3.10.2. Spesifikasi API *Endpoints***

Backend REST API dirancang untuk menyediakan 7 *endpoint* utama sebagaimana dirangkum dalam Tabel 3.8.

**Tabel 3.8. Spesifikasi API *Endpoints***

|**No**|**Metode**|***Endpoint***|**Deskripsi Fungsi**|
|---|---|---|---|
|1|`GET`|`/api/health`|Memeriksa status kesehatan server dan mengembalikan *timestamp* respons.|
|2|`POST`|`/api/predict`|Menerima input teks kalimat (maks. 500 karakter), menjalankan inferensi *dual-model* (Model A dan Model B) secara simultan, mencatat hasil ke basis data, dan mengembalikan label prediksi, skor kepercayaan (%), serta latensi inferensi (ms) untuk masing-masing model.|
|3|`GET`|`/api/benchmark-stats`|Mengembalikan data ringkasan statistik *benchmark* komparatif dari 6 *run random seed* (rerata dan simpangan baku akurasi, *F1-score*, latensi, VRAM) beserta hasil pengujian statistik inferensial (*McNemar p-value*, *Wilcoxon p-value*, *Bootstrap* 95% CI, dan *Cohen's d*).|
|4|`GET`|`/api/history`|Mengembalikan daftar riwayat pengujian inferensi sentimen terbaru yang tersimpan di basis data, dengan parameter `limit` opsional.|
|5|`DELETE`|`/api/history`|Menghapus seluruh riwayat pengujian inferensi dari basis data.|
|6|`DELETE`|`/api/history/{log_id}`|Menghapus satu entri riwayat pengujian berdasarkan *ID* spesifik.|
|7|`POST`|`/api/login`|Memvalidasi kredensial pengguna (nama pengguna dan kata sandi) dan mengembalikan token autentikasi beserta peran akses (*role*) apabila kredensial valid.|

### **3.10.3. Rancangan Antarmuka Pengguna (*User Interface*)**

Antarmuka web dirancang dengan tiga halaman utama yang saling terhubung melalui sistem navigasi *hash-based routing*:

1. **Halaman Beranda (*Home*)**: Berfungsi sebagai portal informasi penelitian yang menampilkan identitas akademik peneliti (nama, NPM, program studi, dan institusi), latar belakang singkat penelitian, perbandingan arsitektur visual Model A (*Feature Extraction*) dan Model B (*Fine-Tuning*) dalam bentuk kartu interaktif, serta ringkasan sorotan temuan statistik utama yang dilengkapi *badge* multi-*seed* ($n=6$). Halaman ini dapat diakses secara publik tanpa autentikasi.

2. **Halaman Komparator Inferensi Sentimen (*Comparator*)**: Menyediakan antarmuka pengujian inferensi *real-time* yang memungkinkan pengguna memasukkan kalimat ulasan (hingga 500 karakter) ke dalam kotak teks, dilengkapi penghitung karakter dan *chip* preset contoh kalimat (negasi, sentimen campuran, kekecewaan). Hasil inferensi Model A dan Model B ditampilkan secara bersisian (*side-by-side*) dengan *progress bar* skor kepercayaan yang teranimasi, *badge* latensi inferensi (ms), serta *badge* penanda model pemenang (*Confidence Winner*). Halaman ini juga menyajikan tabel riwayat pengujian yang dapat dicari (*searchable*), disalin ke *clipboard*, dan dihapus secara individual maupun keseluruhan melalui dialog konfirmasi. Halaman ini dapat diakses secara publik tanpa autentikasi.

3. **Halaman *Dashboard* Analitik *Benchmark* (*Analytics*) [Akses Terlindungi]**: Menyajikan visualisasi grafik interaktif dari hasil evaluasi *benchmark* statistik komparatif. Halaman ini dilindungi oleh sistem RBAC dan hanya dapat diakses oleh pengguna yang telah terotentikasi (dosen pembimbing, dosen penguji, atau peneliti). Komponen visualisasi pada halaman ini meliputi:
   1. Empat kartu ringkasan statistik utama (delta rerata akurasi, delta rerata *F1-score*, alokasi GPU VRAM, dan rerata latensi inferensi).
   2. Grafik batang sumbu ganda (*dual-axis bar chart*) menggunakan *Recharts* yang menampilkan perbandingan *F1-score* (%), latensi (ms), dan *peak* VRAM (MB) antar model.
   3. Grafik radar multidimensi (*radar chart*) menggunakan *Recharts* yang menampilkan analisis kesalahan linguistik berdasarkan 5 kategori: tanpa negasi, negasi biner, ironi/sarkasme dan negasi majemuk, *review* panjang (>40 token), dan ambiguitas tinggi.
   4. Matriks kontingensi 2×2 Uji *McNemar* yang menampilkan distribusi kesepakatan dan ketidaksepakatan prediksi pada $N=872$ sampel *held-out test set*.
   5. *Badge* metrik pengujian statistik inferensial (*McNemar p-value*, *Wilcoxon p-value*, bilah interval *Bootstrap* 95% CI, dan *gauge* ukuran efek *Cohen's d*).
   6. *Tooltip* penjelasan akademis pada setiap komponen statistik.

### **3.10.4. Rancangan Sistem Navigasi dan Tema Visual**

Sistem navigasi aplikasi dirancang menggunakan pendekatan *hash-based routing* (`#home`, `#comparator`, `#analytics`) yang disinkronisasi dengan `localStorage` untuk mempertahankan posisi halaman terakhir pengguna setelah *refresh* atau penutupan peramban. Navigasi ditampilkan melalui dua komponen:

1. **Navigasi *Header* Desktop**: Bilah navigasi horizontal tetap (*fixed top bar*) dengan tombol perpindahan halaman dan ikon pengaturan tema.
2. **Navigasi Bawah *Mobile***: Bilah navigasi tetap di bagian bawah layar (*fixed bottom bar*) dengan tiga kolom ikon untuk akses cepat pada perangkat seluler.

Sistem tema visual dirancang dengan dukungan mode gelap (*dark mode*) dan mode terang (*light mode*):

1. **Mode Gelap (*Default*)**: Latar belakang kanvas `#040814`, kartu *glassmorphism* transparan, dan aksen warna emas serta biru kerajaan.
2. **Mode Terang**: Latar belakang kanvas putih, kartu latar abu-abu terang, dan teks gelap.

Perpindahan tema dikendalikan melalui tombol ikon Matahari/Bulan dan disimpan secara persisten di `localStorage`.

Animasi antarmuka dirancang menggunakan pustaka *Framer Motion* untuk meningkatkan kualitas pengalaman pengguna, meliputi:

1. Transisi halaman *fade/slide* menggunakan komponen `AnimatePresence`.
2. Efek *scroll reveal* bertahap (*staggered*) pada bagian *hero* dan kartu informasi menggunakan atribut `whileInView`.
3. Efek elevasi pada *hover* kartu model menggunakan atribut `whileHover`.
4. Animasi ekspansi lebar pada bilah skor kepercayaan (*confidence progress bar*).
5. Transisi skala masuk pada modal (*pop-up*).

### **3.10.5. Rancangan *Progressive Web App* (PWA)**

Aplikasi dirancang sebagai *Progressive Web App* (PWA) menggunakan *plugin* `vite-plugin-pwa` yang mengintegrasikan *Workbox* sebagai *service worker generator*. Strategi *caching* yang dirancang meliputi:

1. ***Precaching* Aset Statis**: Seluruh aset statis (*JavaScript*, *CSS*, *HTML*, ikon SVG/PNG) di-*cache* secara otomatis pada saat instalasi *service worker* untuk menjamin ketersediaan antarmuka secara *offline*.
2. ***Runtime Caching* — *Network-First***: Data dari *endpoint* `/api/benchmark-stats` di-*cache* dengan strategi *Network-First* (ekspirasi 1 hari) sehingga data *benchmark* statistik tetap dapat diakses saat koneksi terputus. Data dari *endpoint* `/api/history` di-*cache* dengan ekspirasi 1 jam.
3. **Modal Instalasi Kustom**: Dirancang modal *glassmorphism* kustom yang menjelaskan manfaat instalasi aplikasi ke perangkat pengguna (*Add to Home Screen*) dan dipicu melalui *event* `beforeinstallprompt`.
4. ***Web App Manifest***: File `manifest.json` dikonfigurasi dengan mode tampilan *standalone*, orientasi *portrait*, tema warna sesuai desain, dan ikon *maskable* SVG beresolusi 192×192 dan 512×512 piksel.

### **3.10.6. Rancangan Sistem Autentikasi dan Kontrol Akses**

Sistem autentikasi dirancang menggunakan mekanisme *Role-Based Access Control* (RBAC) dengan dua tingkat akses:

1. **Pengguna Publik**: Dapat mengakses Halaman Beranda dan Halaman Komparator Inferensi Sentimen tanpa memerlukan proses masuk (*login*).
2. **Pengguna Terotentikasi (Peran: Dosen/Peneliti)**: Dapat mengakses seluruh fitur aplikasi, termasuk Halaman *Dashboard* Analitik *Benchmark* yang berisi data statistik penelitian.

Apabila pengguna yang belum terotentikasi mencoba mengakses halaman terlindungi, sistem menampilkan kartu penguncian (*lock card*) dan membuka modal *login* bertema *glassmorphism*. Setelah proses autentikasi berhasil melalui *endpoint* `POST /api/login`, token autentikasi disimpan di `localStorage` peramban untuk mempertahankan sesi pengguna.

### **3.10.7. Alur Integrasi Operasional Model & Arsitektur Dual-Backend Hybrid**

Alur integrasi operasional dari tahap eksplorasi komputasional hingga pemuatan pada server aplikasi web dirancang dalam arsitektur *Dual-Backend Hybrid* dengan mekanisme *Automatic Resilient Failover*:

1. **Tahap Eksplorasi dan Pelatihan di Google Colab**:
   1. Pelatihan Model A (*Feature Extraction*) dan Model B (*Fine-Tuning*) dilakukan pada *Google Colab* GPU Tesla T4 (16 GB VRAM).
   2. Proses pelatihan dieksekusi secara *multi-seed* ($n=6$) untuk menghasilkan log performa dan evaluasi statistik.

2. **Tahap Ekspor dan Penyimpanan Artefak Model**:
   1. Bobot parameter model terbaik hasil pelatihan disimpan menggunakan fungsi `torch.save()` dan *Hugging Face* `save_pretrained()` menjadi file artefak bobot model (`model_a.pt` dan direktori `model_b/`).
   2. Seluruh hasil perhitungan metrik prediktif, alokasi VRAM GPU, latensi, matriks kontingensi Uji *McNemar*, dan data *error analysis* diekspor ke dalam file terstruktur dan dimuat ke basis data melalui skrip *seeding* (`init_db.py`).

3. **Tahap Pemuatan Model & Deployment Server Web (Arsitektur Dual-Backend)**:
   1. **Server GPU Utama (Google Colab Tesla T4)**: Server *FastAPI* berjalan di *Google Colab* dengan akselerasi GPU Tesla T4 (16 GB VRAM) terhubung secara *real-time* ke publik via *Ngrok Permanent Static Tunnel* (`https://irritably-tipper-january.ngrok-free.dev`), menyajikan inferensi *real-time* dengan kecepatan kilat (**~7.5 ms**).
   2. **Server CPU Pencadangan (Railway Cloud)**: Server *FastAPI* pencadangan di-deploy pada *platform Railway* (`https://nurturing-creation-production-4414.up.railway.app`) sebagai penopang redundansi saat server GPU Colab mengalami *downtime* atau *restart*.
   3. **Konfigurasi Sentral Terpisahkan (`config.js`)**: Seluruh *endpoint* URL backend dienkapsulasi secara modular di dalam modul `frontend/src/config.js` (`GPU_BACKEND_URL` dan `CPU_BACKEND_URL`). Setiap fungsi API pada *frontend* menyimpan URL ke dalam variabel eksplisit sebelum dieksekusi oleh logika percabangan *failover* (GPU *Primary* dengan *timeout* 6 detik ➔ CPU *Fallback*).

### **3.10.8. Rancangan Basis Data (*Database Schema*)**

Untuk mendukung *data persistence*, pencatatan riwayat inferensi pengguna, serta penyimpanan log eksperimen *benchmark* secara terstruktur, aplikasi web dilengkapi dengan basis data relasional **SQLite** yang dikelola melalui ORM *SQLAlchemy* pada *FastAPI*. Skema basis data dirancang terdiri dari 3 tabel utama:

1. **Tabel `prediction_logs`**: Menyimpan setiap riwayat pengujian kalimat ulasan yang dikirimkan oleh pengguna melalui Komparator Inferensi *Real-Time*.
   1. `id` (INTEGER, *Primary Key*, *Auto Increment*)
   2. `input_text` (TEXT, isi kalimat ulasan input)
   3. `model_a_label` (VARCHAR(20), label prediksi Model A)
   4. `model_a_confidence` (FLOAT, skor kepercayaan Model A %)
   5. `model_a_latency_ms` (FLOAT, latensi inferensi Model A ms)
   6. `model_b_label` (VARCHAR(20), label prediksi Model B)
   7. `model_b_confidence` (FLOAT, skor kepercayaan Model B %)
   8. `model_b_latency_ms` (FLOAT, latensi inferensi Model B ms)
   9. `created_at` (DATETIME, *timestamp* waktu pengujian)

2. **Tabel `benchmark_results`**: Menyimpan ringkasan metrik evaluasi komparatif dari 6 *run random seed*.
   1. `id` (INTEGER, *Primary Key*, *Auto Increment*)
   2. `seed_number` (INTEGER, nilai *seed*: 42, 123, 777, 999, 1234, 2024)
   3. `model_type` (VARCHAR(20), 'Model A' atau 'Model B')
   4. `accuracy` (FLOAT), `precision` (FLOAT), `recall` (FLOAT), `f1_score` (FLOAT)
   5. `inference_time_ms` (FLOAT), `peak_vram_mb` (FLOAT)

3. **Tabel `statistical_tests`**: Menyimpan hasil pengujian statistik inferensial.
   1. `id` (INTEGER, *Primary Key*, *Auto Increment*)
   2. `mcnemar_p_value` (FLOAT), `wilcoxon_p_value` (FLOAT)
   3. `bootstrap_ci_lower` (FLOAT), `bootstrap_ci_upper` (FLOAT)
   4. `cohens_d` (FLOAT)
   5. `created_at` (DATETIME, *timestamp* waktu pengujian statistik)

### **3.10.9. Diagram Kasus Penggunaan (*Use Case Diagram*)**

Diagram *Use Case* menggambarkan interaksi antara dua aktor utama (*Pengguna Publik* dan *Dosen/Peneliti*) dengan fitur-fitur yang disediakan oleh aplikasi web portal penelitian:

```text
+-----------------------------------------------------------------------------------+
|                        SISTEM APLIKASI WEB ANALISIS SENTIMEN                      |
|                                                                                   |
|  +-------------------+                                                            |
|  |  Pengguna Publik  |                                                            |
|  +---------+---------+                                                            |
|            |                                                                      |
|            +---> (UC-01: Melihat Beranda & Informasi Penelitian)                  |
|            |                                                                      |
|            +---> (UC-02: Menguji Inferensi Sentimen Real-Time)                    |
|            |                                                                      |
|            +---> (UC-03: Melihat & Menghapus Riwayat Pengujian)                   |
|            |                                                                      |
|            +---> (UC-04: Menginstal Aplikasi Web PWA)                             |
|            |                                                                      |
|            +---> (UC-05: Melakukan Autentikasi Login RBAC)                        |
|                                     |                                             |
|                                     v                                             |
|  +-------------------+              |                                             |
|  | Dosen / Peneliti  |--------------+                                             |
|  +---------+---------+                                                            |
|            |                                                                      |
|            +---> (UC-06: Mengakses Dashboard Analitik Benchmark) [Protected]      |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

Rincian peran dan interaksi aktor dalam diagram *Use Case* didefinisikan sebagai berikut:

1. **Pengguna Publik**: Memiliki hak akses dasar untuk membaca informasi penelitian pada Halaman Beranda (UC-01), menjalankan inferensi sentimen *real-time* pada Halaman Komparator (UC-02), mengelola riwayat pengujian lokal (UC-03), menginstal aplikasi PWA (UC-04), dan melakukan proses *login* (UC-05).
2. **Dosen / Peneliti (Pengguna Terotentikasi)**: Memiliki seluruh hak akses Pengguna Publik ditambah hak akses khusus untuk membuka Halaman *Dashboard* Analitik *Benchmark* (UC-06) yang dilindungi oleh kontrol akses RBAC.

### **3.10.10. Diagram Alur Sistem (*System Flowchart Diagram*)**

Diagram alur sistem menggambarkan urutan eksekusi logika dan alur data dari sudut pandang interaksi pengguna hingga pemrosesan di *backend*:

```text
+-----------------------------------------------------------------------------------+
|                                 START USER FLOW                                   |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                           Navigasi Halaman Utama (SPA)                            |
|       [Beranda (#home)]  -  [Komparator (#comparator)]  -  [Analitik (#analytics)] |
+-----------------------------------------+-----------------------------------------+
                                          |
                        +-----------------+-----------------+
                        |                                   |
                        v                                   v
+-----------------------------------------------+   +-------------------------------+
|     Halaman Komparator (Input Teks Ulasan)    |   | Halaman Dashboard Analitik    |
+-----------------------+-----------------------+   +---------------+---------------+
                        |                                           |
                        v                                           v
+-----------------------------------------------+   +-------------------------------+
|  Kirim request POST /api/predict ke FastAPI   |   | Cek Token Autentikasi (RBAC)  |
+-----------------------+-----------------------+   +---------------+---------------+
                        |                                           |
                        v                             +-------------+-------------+
+-----------------------------------------------+     |                           |
| Tokenisasi BertTokenizerFast (max_length=128) |     v                           v
+-----------------------+-----------------------+ [Token Valid]            [Belum Login]
                        |                             |                           |
                        v                             v                           v
+-----------------------------------------------+  Tampilkan       Tampilkan Modal Login /
| Parallel Inference: Model A & Model B (GPU/CPU)|  Visualisasi     Akses Kartu Penguncian
+-----------------------+-----------------------+  Recharts        (*Lock Card*)
                        |
                        v
+-----------------------------------------------+
| Log Prediksi ke DB SQLite (prediction_logs)   |
+-----------------------+-----------------------+
                        |
                        v
+-----------------------------------------------+
| Tampilkan Hasil Inferensi Bersisian (Side-by- |
| Side Card, Confidence Bar, Latency Badge)     |
+-----------------------------------------------+
```

Alur sistem aplikasi web berlangsung dalam 4 tahapan eksekusi:

1. **Tahap Navigasi**: Pengguna memilih halaman target via *hash-based routing*.
2. **Tahap Pengujian Inferensi**: Input teks dikirim ke *endpoint* `POST /api/predict`, ditokenisasi oleh `BertTokenizerFast`, lalu diinferensi secara paralel oleh Model A dan Model B.
3. **Tahap Persistensi Data**: Hasil prediksi, skor kepercayaan, dan latensi secara otomatis dicatat ke dalam tabel `prediction_logs` pada basis data SQLite.
4. **Tahap Otorisasi Dashboard**: Akses ke *Dashboard* Analitik memicu pemeriksaan token JWT/RBAC di `localStorage`. Jika valid, data statistik dari `GET /api/benchmark-stats` dimuat dan ditampilkan via *Recharts*.

### **3.10.11. Diagram Relasi Entitas Basis Data (*Entity Relationship Diagram / ERD*)**

Struktur fisik dan skema tabel basis data relasional SQLite dirancang untuk menyimpan log prediksi dan data statistik *benchmark* komparatif:

```text
+------------------------------------+       +------------------------------------+
|          prediction_logs           |       |         benchmark_results          |
+------------------------------------+       +------------------------------------+
| PK  id                  INTEGER    |       | PK  id                  INTEGER    |
|     input_text          TEXT       |       |     seed_number         INTEGER    |
|     model_a_label       VARCHAR(20)|       |     model_type          VARCHAR(20)|
|     model_a_confidence  FLOAT      |       |     accuracy            FLOAT      |
|     model_a_latency_ms  FLOAT      |       |     precision           FLOAT      |
|     model_b_label       VARCHAR(20)|       |     recall              FLOAT      |
|     model_b_confidence  FLOAT      |       |     f1_score            FLOAT      |
|     model_b_latency_ms  FLOAT      |       |     inference_time_ms   FLOAT      |
|     created_at          DATETIME   |       |     peak_vram_mb        FLOAT      |
+------------------------------------+       +------------------------------------+

                                             +------------------------------------+
                                             |         statistical_tests          |
                                             +------------------------------------+
                                             | PK  id                  INTEGER    |
                                             |     mcnemar_p_value     FLOAT      |
                                             |     wilcoxon_p_value    FLOAT      |
                                             |     bootstrap_ci_lower  FLOAT      |
                                             |     bootstrap_ci_upper  FLOAT      |
                                             |     cohens_d            FLOAT      |
                                             |     created_at          DATETIME   |
                                             +------------------------------------+
```

Deskripsi peranan 3 entitas tabel basis data:

1. **Entitas `prediction_logs`**: Mengakomodasi kebutuhan audit log riwayat pengujian kalimat ulasan pengguna, menyimpan prediksi label sentimen, tingkat kepercayaan (%), dan latensi komputasi (ms) dari kedua model.
2. **Entitas `benchmark_results`**: Menyimpan data hasil evaluasi performa prediktif dan efisiensi komputasi dari 6 *run random seed* untuk Model A dan Model B.
3. **Entitas `statistical_tests`**: Menyimpan nilai statistik pengujian inferensial kuantitatif (*McNemar p-value*, *Wilcoxon p-value*, interval *Bootstrap 95% CI*, dan *Cohen's d*) yang ditampilkan pada *Dashboard* Analitik.

## **3.11. Kontrol Variansi dan Reliabilitas** 

Untuk memastikan konsistensi hasil, eksperimen dilakukan menggunakan pendekatan multi-seed dengan 6 nilai seed yang berbeda (42, 123, 777, 999, 1234, dan 2024). Setiap konfigurasi model dijalankan berulang kali untuk menghasilkan beberapa observasi performa yang digunakan dalam analisis statistik. Pendekatan ini mengikuti rekomendasi Bouthillier et al. (2021) untuk menjamin reliabilitas estimasi performa model *deep learning*. Hasil eksperimen dilaporkan dalam bentuk nilai rata-rata dan deviasi standar ($\mu \pm \sigma$).

## **3.12. Validitas Penelitian** 

Validitas internal dijaga melalui kontrol variabel eksperimen, penggunaan skema pembagian dataset terisolasi (*held-out test set*), serta eliminasi kebocoran data (*data leakage*). Penggunaan uji statistik pada level prediksi individu dan agregat juga mendukung validitas kesimpulan yang diperoleh. Validitas eksternal dibatasi pada penggunaan dataset SST-2, sedangkan validitas konstruk dijaga melalui metrik evaluasi standar klasifikasi teks (Accuracy, Precision, Recall, F1-score, latency, dan VRAM usage).



## **DAFTAR PUSTAKA** 

Bouthillier, X., Tsirigotis, C., Henderson, P., Deleu, T., Bindel, D., Lerer, A., & Bengio, Y. (2021). Accounting for variance in machine learning benchmarks. *Proceedings of Machine Learning and Systems*, 3, 747–769. 

Cohen, J. (1988). *Statistical power analysis for the behavioral sciences* (2nd ed.). Lawrence Erlbaum Associates. 

Creswell, J. W. (2014). *Research design: Qualitative, quantitative, and mixed methods approaches* (4th ed.). SAGE Publications. 

Devlin, J., Chang, M. W., Lee, K., & Toutanova, K. (2018). BERT: Pre-training of deep bidirectional transformers for language understanding. *arXiv preprint arXiv:1810.04805*. https://doi.org/10.48550/arXiv.1810.04805 

Dror, R., Baumer, G., Shlomov, S., & Reichart, R. (2018). The Hitchhiker's guide to testing statistical significance in natural language processing. In *Proceedings of the 56th Annual Meeting of the Association for Computational Linguistics (ACL 2018)* (pp. 1383–1392). Association for Computational Linguistics. 

Efron, B. (1979). Bootstrap methods: Another look at the jackknife. *The Annals of Statistics*, 7(1), 1–26. https://doi.org/10.1214/aos/1176344552 

Galke, L., Diera, A., Lin, B. X., Khera, B., Meuser, T., Singhal, T., Karl, F., & Scherp, A. (2024). Are we really making much progress in text classification? A comparative review. *ACM Computing Surveys*. 

Goodfellow, I., Bengio, Y., & Courville, A. (2016). *Deep learning*. MIT Press. 

Hao, Y., Dong, L., Wei, F., & Xu, K. (2020). Investigating learning dynamics of BERT fine-tuning. In *Proceedings of AACL-IJCNLP* (pp. 87–92). Association for Computational Linguistics. 

Howard, J., & Ruder, S. (2018). Universal language model fine-tuning for text classification. In *Proceedings of ACL 2018* (pp. 328–339). https://doi.org/10.18653/v1/P18-1031 

Lubis, A. H. (2022). Implementasi deep learning dalam pengolahan teks berbahasa Indonesia. *Jurnal Sistem Informasi UMSU*, 4(1), 12–25. 

McNemar, Q. (1947). Note on the sampling error of the difference between correlated proportions or percentages. *Psychometrika*, 12(2), 153–157. https://doi.org/10.1007/BF02295996 

Minaee, S., Kalchbrenner, N., Cambria, E., Nikzad, N., Chenaghlu, M., & Gao, J. (2021). Deep learning–based text classification: A comprehensive review. *ACM Computing Surveys*, 54(3), 1–40. 

Nasution, M. K. M. (2021). Pendekatan komputasi untuk analisis teks dalam kecerdasan buatan. *Jurnal Informatika dan Teknologi UMSU*, 3(2), 45–60. 

Nugroho, A. (2021). Akselerasi komputasi GPU dalam pelatihan model NLP skala besar. *Jurnal Teknologi Informasi FIKTI UMSU*, 5(1), 8–19. 

Peters, M. E., Neumann, M., Iyyer, M., Gardner, M., Clark, C., Lee, K., & Zettlemoyer, L. (2018). Deep contextualized word representations. In *Proceedings of NAACL-HLT 2018* (pp. 2227–2237). https://doi.org/10.18653/v1/N18-1202 

Qasim, R., Bangyal, W. H., Alqarni, M. A., & Ali Almazroi, A. (2022). A fine-tuned BERT-based transfer learning approach for text classification. *Journal of Healthcare Engineering*, 2022, Article 3498123. 

Ruder, S., Peters, M. E., Swayamdipta, S., & Wolf, T. (2019). Transfer learning in natural language processing. In *Proceedings of NAACL-HLT 2019 Tutorials* (pp. 15–18). Association for Computational Linguistics. 

Shadish, W. R., Cook, T. D., & Campbell, D. T. (2002). *Experimental and quasi-experimental designs for generalized causal inference*. Houghton Mifflin. 

Socher, R., Perelygin, A., Wu, J., Chuang, J., Manning, C. D., Ng, A., & Potts, C. (2013). Recursive deep models for semantic compositionality over a sentiment treebank. In *Proceedings of EMNLP 2013* (pp. 1631–1642). https://doi.org/10.18653/v1/D13-1170 

Sun, C., Qiu, X., Xu, Y., & Huang, X. (2019). How to fine-tune BERT for text classification? In *Proceedings of CCL 2019* (pp. 194–206). https://doi.org/10.1007/978-3-030-32381-3_16 

Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł., & Polosukhin, I. (2017). Attention is all you need. In *Advances in Neural Information Processing Systems (NeurIPS 2017)* (pp. 5998–6008). 

Wang, A., Singh, A., Michael, J., Hill, F., Levy, O., & Bowman, S. R. (2018). GLUE: A multi-task benchmark and analysis platform for natural language understanding. In *Proceedings of EMNLP 2018 Workshop BlackboxNLP*. https://doi.org/10.18653/v1/W18-5446 

Wilcoxon, F. (1945). Individual comparisons by ranking methods. *Biometrics Bulletin*, 1(6), 80–83. https://doi.org/10.2307/3001968 

Zaman-Khan, H., Naeem, M., Guarasci, R., Khalid, U., Esposito, M., & Gargiulo, F. (2024). Enhancing text classification using BERT: A transfer learning approach. *Computación y Sistemas*, 28(4), 2279–2295. https://doi.org/10.13053/cys-28-4-5290
