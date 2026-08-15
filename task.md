# Roadmap & Checklist Task Implementation: AgriPro Mobile

Task ini disusun secara terstruktur dari pembentukan scaffolding, UI/UX, logika kalkulasi/database (BE Lokal), hingga integrasi Capacitor Native.

---

## 📌 Phase 1: Project Scaffolding & Setup Baseline

- [x] **Task 1.1**: Inisialisasi Project Vue 3 + Vite dengan Ionic Vue (`@ionic/vue`).
- [x] **Task 1.2**: Install & Konfigurasi Tailwind CSS + `@capacitor/core` + `@capacitor/cli`.
- [x] **Task 1.3**: Setup Router (`vue-router`) dengan Ionic Page Transitions (`IonPage`, `IonRouterOutlet`).
- [x] **Task 1.4**: Setup State Management menggunakan Pinia.
- [x] **Task 1.5**: Integrasi Dexie.js (IndexedDB) & buat schema awal database (`src/services/db.js`).

---

## 💾 Phase 2: Offline Database Layer (Backend-in-Browser)

- [x] **Task 2.1 Schema Dexie.js**:
  - `profiles`: (`Role`: tani/tambak/ternak, `nama_lahan`, `unit_preference`)
  - `water_logs`: (`timestamp`, `ph`, `salinity`, `temp`, `do_level`, `pond_id`)
  - `crop_schedules`: (`id`, `crop_name`, `plant_date`, `wth_days`, `harvest_date`)
  - `breeding_logs`: (`id`, `animal_tag`, `ib_date`, `expected_birth_date`, `vaccine_status`)
  - `offline_knowledge`: (`id`, `category`, `symptom`, `solution`, `tags`)
- [x] **Task 2.2 Seed Data**:
  - Buat script seed data awal untuk Pustaka Taktis Offline (`knowledgeSeed.json`) dan Matriks Kompatibilitas Obat (`chemicalCompatibility.json`) dalam format JSON lokal dengan auto-seeder `seedService.js`.
- [x] **Task 2.3 Business Logic / Math Engines** (`src/utils/calculators/`):
  - `agriMixCalc.js`: Rumus kalkulasi obat per tangki, populasi bibit, & validasi bahaya pencampuran.
  - `aquaFcrCalc.js`: Rumus FCR, persentase pakan harian, biomassa, dan ADG.
  - `feedBlenderCalc.js`: Algoritma Pearson Square untuk racikan ransum pakan.
  - `unitConverter.js`: Fungsi konversi satuan tradisional (Ubin, Bahu, Gembor, Sendok, ppm) ke SI.

---

## 🎨 Phase 3: UI/UX Component Development

- [ ] **Task 3.1 Global Layout & Navigation**:
  - Buat `AppHeader.vue` dengan Ionic Header + Profile Switcher Dropdown.
  - Buat `AppTabBar.vue` menggunakan `IonTabBar` (*Home*, *Calculators*, *Schedule*, *Library*).
- [ ] **Task 3.2 View Architecture**:
  - `DashboardView.vue`: Widget ringkasan cepat berbasis profil aktif.
  - `AgriModuleView.vue`: Tab/Segment Ionic untuk AgriMix, Populasi, dan Tanam.
  - `AquaModuleView.vue`: Tab/Segment Ionic untuk Log Air, FCR, dan Sampling.
  - `LivestockModuleView.vue`: Tab/Segment Ionic untuk Feed Blender dan Breeding.
  - `LibraryView.vue`: Interface pencarian cepat (*instant search filter*) untuk Pustaka Offline.
- [ ] **Task 3.3 Offline Chart Integration**:
  - Integrasi Chart.js / ApexCharts untuk visualisasi tren air & grafik ADG pertumbuhan (100% offline Canvas rendering).

---

## ⚡ Phase 4: Integrasi Feature & Business Logic

- [ ] **Task 4.1 Form & Live Calculation Handling**:
  - Hubungkan input Form Ionic (`IonInput`, `IonSelect`) ke Pinia Store / Calculator Utilities secara real-time.
- [ ] **Task 4.2 Local Notification Engine**:
  - Setup Service `@capacitor/local-notifications`.
  - Buat mekanisme pemicu notifikasi lokal saat pengguna menambahkan jadwal penyemprotan (WTH) atau jadwal perkiraan lahir ternak.
- [ ] **Task 4.3 CRUD Log Water & Sampling**:
  - Integrasikan form input log air dengan Dexie.js (`db.water_logs.add()`) dan buat reactive live query ke UI.
- [ ] **Task 4.4 Offline Search Engine**:
  - Implementasikan fuzzy search pada modul Pustaka Taktis menggunakan Dexie.js index query.

---

## 📱 Phase 5: Capacitor Native Integration & Mobile Build

- [ ] **Task 5.1 Capacitor Platform Setup**:
  - Jalankan `npx cap add android`.
  - Konfigurasi `capacitor.config.json` (App ID, App Name, WebDir).
- [ ] **Task 5.2 App Icon & Splash Screen**:
  - Generate asset splash screen & icon responsive menggunakan `@capacitor/assets`.
- [ ] **Task 5.3 Native Build & Testing**:
  - Build Web Production (`npm run build`).
  - Sync web assets ke native (`npx cap sync`).
  - Test running di Android Emulator / Physical Device via Android Studio.

---

## 🌐 Phase 6: PWA Optimization & Polishing

- [ ] **Task 6.1 Service Worker & Cache**:
  - Setup `vite-plugin-pwa` agar aplikasi web dapat di-install sebagai PWA dan berjalan 100% offline di browser HP.
- [ ] **Task 6.2 Performance & UI Polish**:
  - Uji kontras warna UI (*High Contrast Mode*) agar tetap nyaman dibaca di bawah sinar matahari langsung.
  - Tambahkan haptic feedback (`@capacitor/haptics`) pada tombol-tombol konfirmasi utama.
