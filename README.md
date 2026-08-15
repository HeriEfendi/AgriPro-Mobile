# 🌾 🦐 🐄 AgriPro Mobile

> **Offline-First Super-App** untuk Sektor Pertanian, Pertambakan, dan Peternakan di Daerah Rural & Zero-Connectivity.

![Vue 3](https://img.shields.io/badge/Vue.js-v3.5-4FC08D?style=flat-square&logo=vuedotjs)
![Ionic Vue](https://img.shields.io/badge/Ionic_Vue-v8.0-3880FF?style=flat-square&logo=ionic)
![Vite](https://img.shields.io/badge/Vite-v5.4-646CFF?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v3.4-38BDF8?style=flat-square&logo=tailwindcss)
![Capacitor](https://img.shields.io/badge/Capacitor-v6.0-119EFF?style=flat-square&logo=capacitor)
![IndexedDB](https://img.shields.io/badge/IndexedDB-Dexie.js_v4.0-008080?style=flat-square)
![PWA](https://img.shields.io/badge/PWA-Offline_Ready-5A0FC8?style=flat-square&logo=pwa)

---

## 📖 Tentang Projek

**AgriPro Mobile** adalah aplikasi super (*Super-App*) yang dirancang khusus untuk memenuhi kebutuhan teknis para **Petani**, **Petambak (Udang/Ikan)**, dan **Peternak** di wilayah pedesaan dengan akses internet terbatas atau tanpa sinyal (*zero-connectivity*). 

Seluruh fitur kalkulasi, pencatatan log air, kalender tanam/kebuntingan, serta pustaka diagnosa penyakit berjalan **100% Offline-First** menggunakan mesin database browser **IndexedDB (via Dexie.js)** dan **Capacitor Native Bridge**.

---

## ✨ Fitur Utama & Modul Sektor

### 1. ⚙️ Core & Setup Profil
* **Profile Switcher**: Ganti peran aktif (*Petani*, *Petambak*, atau *Peternak*) secara instan dari header untuk menyesuaikan dashboard utama.
* **Global Unit Converter Modal**: Konversi cepat satuan lapangan tradisional ke Standar Internasional (SI):
  * **Ubin / Bahu** $\rightarrow$ $\text{m}^2$ ($1\text{ ubin} = 14.0625\text{ m}^2$, $1\text{ bahu} = 7096.5\text{ m}^2$)
  * **Gembor / Sendok** $\rightarrow$ $\text{ml}$ ($1\text{ gembor} = 10000\text{ ml}$, $1\text{ sendok} = 15\text{ ml}$)
  * **ppm** $\rightarrow$ $\text{g/m}^3$ ($1\text{ ppm} = 1\text{ g/m}^3$ air kolam)

### 2. 🌾 Modul Pertanian (Agri)
* **Kalkulator Racik Tangki (AgriMix)**: Hitung otomatis dosis obat per tangki semprot ($\text{ml/g}$), estimasi total tangki, dan total kebutuhan obat per hektar.
* **Matriks Kompatibilitas Obat**: Cek bahaya pencampuran 2 jenis bahan aktif obat semprot (*Safe, Warning, Danger*) untuk mencegah daun terbakar (*fitotoksisitas*) atau nozel tersumbat.
* **Kalkulator Populasi & Bibit**: Hitung estimasi populasi tanaman dan kebutuhan benih lengkap dengan margin penyulaman (10%).
* **Smart Crop Calendar & WTH**: Jadwal tanam otomatis dengan pengingat lokal **Waktu Henti Hama (WTH)** sebelum panen aman.

### 3. 🦐 Modul Pertambakan (Aqua)
* **Water Quality Log & Offline Chart**: Catat parameter air (pH, Suhu °C, Salinitas ppt, DO mg/L) terhubung ke **Grafik Garis Offline Chart.js**.
* **Kalkulator FCR & Biomassa**: Hitung *Feed Conversion Ratio* (FCR) dan evaluasi tingkat efisiensi penggunaan pakan.
* **Feeding Rate Estimator**: Estimasi kebutuhan pakan harian berdasarkan populasi, ABW (gram), dan pembagian porsi makan (3x/4x sehari).
* **Sampling Growth Tracker**: Grafik *Average Daily Gain* (ADG) harian untuk deteksi dini pertumbuhan kerdil/anomali.

### 4. 🐄 Modul Peternakan (Livestock)
* **Feed Blender (Kalkulator Ransum)**: Formulasi adonan pakan lokal (jagung, dedak, konsentrat) berdasarkan target Protein Kasar (% CP) menggunakan algoritma matematika **Pearson Square**.
* **Breeding & Vaccine Calendar**: Kalender siklus birahi (H+21), estimasi tanggal melahirkan hasil Inseminasi Buatan (IB) Sapi (~283 Hari) & Kambing (~150 Hari), serta jadwal vaksin.

### 5. 📚 Shared Utility: Pustaka Taktis Offline
* Database lokal diagnosa gejala penyakit & solusi taktis untuk tanaman, ikan/udang, dan ternak tanpa internet.
* Fitur **Fuzzy Search Index Query** (`IonSearchbar`) + filter kategori multi-tag.

---

## 🛠️ Tech Stack & Arsitektur

* **Frontend Framework**: Vue 3 (Composition API + `<script setup>`) + Vite
* **UI Component Library**: Ionic Framework (`@ionic/vue` & `@ionic/vue-router`) + Ionicons
* **CSS Framework**: Tailwind CSS (Kustomisasi palette `agri`, `aqua`, `livestock`)
* **State Management**: Pinia (Persistensi profil aktif pengguna ke IndexedDB)
* **Local Database Engine**: IndexedDB wrapped dengan Dexie.js v4.0
* **Offline Charts**: Chart.js & `vue-chartjs` (Canvas rendering)
* **Native Mobile Bridge**: Capacitor Core v6 (`@capacitor/local-notifications`, `@capacitor/haptics`, `@capacitor/share`)
* **PWA & Offline Service Worker**: `vite-plugin-pwa` + Workbox (`sw.js`)

---

## 🚀 Panduan Memulai (Getting Started)

### Prasyarat
* Node.js v18+ atau v20+ / v26+
* npm v9+

### 1. Kloning Repository & Install Dependensi
```bash
git clone https://github.com/HeriEfendi/AgriPro-Mobile.git
cd AgriPro-Mobile
npm install
```

### 2. Jalankan Mode Pengembang (Development)
```bash
npm run dev
```
Aplikasi dapat diakses melalui browser di `http://localhost:5173`.

### 3. Build Production (Web & PWA)
```bash
npm run build
```
Hasil build web dan Service Worker PWA (`sw.js`, `manifest.webmanifest`) akan tersimpan di folder `dist/`.

---

## 📱 Konfigurasi Native Android (Capacitor)

### 1. Tambah Platform Android (Pertama Kali)
```bash
npx cap add android
```

### 2. Sync Web Build ke Android Native
Setiap kali ada perubahan kode atau setelah `npm run build`:
```bash
npx cap sync android
```

### 3. Buka di Android Studio
```bash
npx cap open android
```

---

## 📁 Struktur Direktori Proyek

```text
AgriPro-Mobile/
├── android/                   # Proyek Native Android (Capacitor wrapper)
├── dist/                      # Bundle hasil kompilasi produksi web & PWA
├── src/
│   ├── assets/                # Aset gambar & ikon
│   ├── components/            # Komponen UI Reusable
│   │   ├── AppHeader.vue      # Header utama & profile switcher
│   │   ├── AppTabBar.vue     # Ionic tab navigation bar
│   │   ├── UnitConverterModal.vue # Modal konversi satuan
│   │   └── charts/            # Komponen grafik offline Chart.js
│   │       ├── GrowthChart.vue
│   │       └── WaterChart.vue
│   ├── data/                  # Seed dataset JSON lokal
│   │   ├── chemicalCompatibility.json
│   │   └── knowledgeSeed.json
│   ├── router/                # Konfigurasi vue-router Ionic
│   ├── services/              # Database Dexie.js & Local Notification Engine
│   │   ├── db.js
│   │   ├── notificationService.js
│   │   └── seedService.js
│   ├── stores/                # Pinia State Management (useProfileStore.js)
│   ├── theme/                 # Ionic CSS variable themes
│   ├── utils/                 # Mesin Kalkulator & Utility Haptics
│   │   ├── calculators/
│   │   │   ├── agriMixCalc.js
│   │   │   ├── aquaFcrCalc.js
│   │   │   ├── feedBlenderCalc.js
│   │   │   └── unitConverter.js
│   │   └── haptics.js
│   ├── views/                 # Halaman utama aplikasi (Dashboard & Modul Sektor)
│   │   ├── AgriModuleView.vue
│   │   ├── AquaModuleView.vue
│   │   ├── DashboardView.vue
│   │   ├── LibraryView.vue
│   │   └── LivestockModuleView.vue
│   ├── App.vue                # Root App Component
│   ├── main.js                # Entry point Vue App
│   └── style.css              # Tailwind CSS entry
├── capacitor.config.json      # Konfigurasi Capacitor App ID & Plugins
├── prd.md                     # Product Requirement Document
├── task.md                    # Roadmap & Checklist Pengerjaan Task
├── tailwind.config.js         # Konfigurasi Tailwind CSS
└── vite.config.js             # Konfigurasi Vite & VitePWA Plugin
```

---

## 🤝 Lisensi & Kontribusi

Pengembangan oleh **AgriPro Mobile Team**. Bebas digunakan dan dikembangkan untuk memajukan produktivitas sektor pertanian, pertambakan, dan peternakan di Indonesia. 🇮🇩
