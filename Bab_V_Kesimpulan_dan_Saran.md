# **BAB V**  
# **KESIMPULAN DAN SARAN**

---

### **5.1. Kesimpulan**

Berdasarkan hasil eksperimen empiris, pengujian statistik inferensial, analisis kesalahan linguistik, dan implementasi aplikasi web yang telah dilaksanakan, diperoleh kesimpulan sebagai berikut:

1. **Efektivitas Klasifikasi Teks**: Penerapan metode *End-to-End Fine-Tuning* (Model B) terbukti secara empiris jauh lebih efektif dibandingkan *Feature Extraction* (Model A) dalam tugas klasifikasi teks sentimen SST-2. Model B mencapai rerata **Accuracy $92{,}78\% \pm 0{,}71\%$** dan **F1-Score $92{,}94\% \pm 0{,}79\%$**, mengungguli Model A yang hanya meraih rerata **Accuracy $86{,}05\% \pm 0{,}69\%$** dan **F1-Score $86{,}66\% \pm 0{,}43\%$** (peningkatan F1-Score sebesar **$+6{,}28\%$**).
2. **Signifikansi Statistik Inferensial**: Seluruh empat metode pengujian statistik mengonfirmasi keunggulan Model B secara konsisten dan signifikan:
   - **Uji McNemar**: $\chi^2 = 47{,}6701$, $p\text{-value} = 5{,}04 \times 10^{-12}$ ($p < 0{,}0001$).
   - **Uji Wilcoxon Signed-Rank**: $W = 21{,}0$, $p\text{-value} = 0{,}015625$ ($p < 0{,}05$).
   - **Bootstrap 95% Confidence Interval**: Rentang selisih F1-Score $[\mathbf{+5{,}48\%} \text{ s.d. } \mathbf{+9{,}64\%}]$ (positif murni dan tidak melewati angka 0).
   - **Cohen's d Effect Size**: $d = \mathbf{9{,}80}$ (*Extremely Large Effect*).
3. **Ketahanan Linguistik**: Model B menunjukkan keunggulan mencolok pada struktur kalimat kompleks, khususnya pada kategori **Review Panjang ($>40$ token)** dengan peningkatan akurasi **$+16{,}0\%$** ($94{,}0\%$ vs $78{,}0\%$) serta kategori **Negasi Biner** dengan peningkatan akurasi **$+13{,}3\%$** ($93{,}1\%$ vs $79{,}8\%$).
4. **Implementasi Aplikasi Web**: Aplikasi web *BERT Sentiment Lab* berarsitektur *Dual-Backend Hybrid* (Primary Colab GPU NVIDIA A100 GPU / Fallback Railway CPU) dan berantarmuka PWA React berhasil diimplementasikan 100%. Aplikasi web mampu melayani inferensi paralel real-time dengan latensi **$1{,}82\text{ ms}$** pada GPU serta menyajikan dashboard analitik benchmark yang terintegrasi penuh dengan basis data SQLite (`app.db`).

---

### **5.2. Saran**

Berdasarkan pengalaman eksperimen dan keterbatasan penelitian yang ditemukan, disarankan beberapa hal untuk pengembangan penelitian selanjutnya:

1. **Eksplorasi Arsitektur Model Transformer Terkini**: Penelitian selanjutnya disarankan untuk membandingkan model BERT dengan arsitektur Transformer yang lebih baru seperti RoBERTa, DeBERTa, atau model berukuran ringkas seperti DistilBERT dan ALBERT untuk mengevaluasi efisiensi latensi vs akurasi.
2. **Pengembangan Dataset Multi-Domain Berbahasa Indonesia**: Penelitian ini terbatas pada dataset SST-2 (Bahasa Inggris). Disarankan agar penelitian berikutnya menerapkan metode fine-tuning pada dataset ulasan publik berbahasa Indonesia (misalnya dataset ulasan produk e-commerce atau media sosial) dengan penanganan bahasa gaul (*slang*) dan kode campuran (*code-switching*).
3. **Penerapan Teknik Kuantisasi Model (Model Quantization)**: Untuk mempercepat inferensi di perangkat bersumber daya terbatas (*edge devices*), peneliti selanjutnya disarankan menerapkan teknik kuantisasi bobot (INT8/FP16 quantization) atau *Knowledge Distillation* pada model hasil *fine-tuning*.
