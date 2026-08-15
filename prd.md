# Product Requirement Document (PRD): AgriPro Mobile

> **Offline-First Super-App** untuk Sektor Pertanian, Pertambakan, dan Peternak di Daerah Rural / Zero-Connectivity.

---

## 1. Executive Summary & Context

| Parameter | Detail |
| :--- | :--- |
| **Nama Produk (Draft)** | **AgriPro Mobile** (Offline-First Super-App) |
| **Target Usability** | Mobile-First (Android APK via Capacitor) & Responsive Web App (PWA) |
| **Target User** | Petani, Petambak (Udang/Ikan), dan Peternak rural (koneksi terbatas / zero-connectivity) |
| **Filosofi Arsitektur** | **100% Offline-First**. Seluruh kalkulasi, log, kalender jadwal, dan pustaka data disimpan secara lokal di perangkat pengguna menggunakan IndexedDB (via Dexie.js). |

---

## 2. Tech Stack & Arsitektur Utama

- **Frontend Framework**: Vue 3 (Composition API + `<script setup>`) + Vite
- **UI Component Library**: Ionic Framework (`@ionic/vue`) untuk komponen mobile native (Header, Segment, Toast, Modal, Grid, Tabs)
- **State Management**: Pinia (Sync state dengan Local Storage / IndexedDB)
- **Local Database Engine**: IndexedDB wrapped dengan Dexie.js (Fast, Reactive UI integration, Schema versioning)
- **Native Bridge**: Capacitor Core + `@capacitor/local-notifications` + `@capacitor/haptics` + `@capacitor/share`
- **CSS Framework**: Tailwind CSS (dikombinasikan dengan Ionic styling untuk kustomisasi cepat)

---

## 3. Scope & Structural Modules

### A. Modul Core & Setup Profil
* **Profile Switcher**: Pemilihan peran aktif (*Petani*, *Petambak*, atau *Peternak*) untuk menyesuaikan tampilan dashboard utama.
* **Global Unit Converter**: Tool cepat konversi satuan lapangan:
  * Ubin / Bahu $\rightarrow$ $\text{m}^2$
  * Gembor / Sendok $\rightarrow$ $\text{ml}$
  * $\text{ppm} \rightarrow \text{g/m}^3$

### B. Modul Pertanian (Agri)
* **Kalkulator Racik Tangki (AgriMix)**: Hitung dosis per tangki semprot ($\text{ml/g}$), volume total obat, dan matriks batas bahaya kompatibilitas pencampuran 2 jenis obat.
* **Kalkulator Populasi & Bibit**: Hitung estimasi kebutuhan bibit/benih berdasarkan luas lahan ($\text{m}^2/\text{Ha}$) dan jarak tanam.
* **Smart Crop Calendar**: Kalender tanam, jadwal pupuk, dan perhitungan otomatis Waktu Henti Hama (WTH) sebelum panen.

### C. Modul Pertambakan (Aqua)
* **Water Quality Log**: Input & pantau pH, suhu, salinitas, dan DO secara visual (grafik statistik offline).
* **Kalkulator FCR & Biomassa**: Hitung *Feed Conversion Ratio* dan estimasi kebutuhan pakan harian berdasarkan sampling berat.
* **Sampling Growth Tracker**: Grafik *Average Daily Gain* (ADG) harian untuk deteksi kerdil/anomali.

### D. Modul Peternakan (Livestock)
* **Feed Blender (Kalkulator Ransum)**: Formulasi pakan lokal (jagung, dedak, konsentrat) berdasarkan target protein kasar.
* **Breeding & Vaccine Calendar**: Kalender siklus birahi, estimasi tanggal melahirkan (Inseminasi Buatan), dan jadwal vaksin/obat cacing.

### E. Shared Utility: Pustaka Taktis Offline
* Database lokal *Troubleshooting Guide* untuk pencarian gejala penyakit tanaman/ikan/ternak tanpa jaringan internet.
