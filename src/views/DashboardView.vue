<template>
  <ion-page>
    <AppHeader />
    <ion-content class="bg-slate-50/50">
      <div class="max-w-2xl mx-auto px-4 py-4 space-y-5 page-content">
        
        <!-- 1. Modern Pill Search Bar -->
        <div class="searchbar-pill">
          <svg class="w-5 h-5 text-slate-400 mr-2.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input
            v-model="quickSearch"
            @keyup.enter="goToSearch"
            type="text"
            placeholder="Cari takaran obat, penyakit, pakan, atau dosis..."
            class="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none border-none p-0 focus:ring-0"
          />
          <button
            v-if="quickSearch"
            @click="goToSearch"
            class="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded-full ml-1"
          >
            Cari
          </button>
        </div>

        <!-- 2. Modul & Spesialisasi Lapangan (Specialist Doctor Style) -->
        <div>
          <div class="flex justify-between items-center mb-3">
            <h2 class="text-sm font-bold text-slate-900 tracking-tight">Modul Spesialisasi</h2>
            <router-link to="/library" class="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-0.5">
              Lihat semua <span class="text-[10px]">❯</span>
            </router-link>
          </div>

          <div class="grid grid-cols-3 gap-2.5 sm:gap-3">
            <!-- Modul Agri -->
            <router-link
              to="/agri"
              class="bg-white p-3.5 rounded-2xl border border-slate-100/90 shadow-soft hover:shadow-card transition-all duration-200 flex flex-col items-center text-center group active:scale-95"
            >
              <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl mb-2 group-hover:scale-105 transition-transform">
                🌾
              </div>
              <span class="text-xs font-bold text-slate-800">AgriMix</span>
              <span class="text-[10px] text-slate-400 mt-0.5">Tangki & Bibit</span>
            </router-link>

            <!-- Modul Aqua -->
            <router-link
              to="/aqua"
              class="bg-white p-3.5 rounded-2xl border border-slate-100/90 shadow-soft hover:shadow-card transition-all duration-200 flex flex-col items-center text-center group active:scale-95"
            >
              <div class="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center text-2xl mb-2 group-hover:scale-105 transition-transform">
                🦐
              </div>
              <span class="text-xs font-bold text-slate-800">AquaLog</span>
              <span class="text-[10px] text-slate-400 mt-0.5">Air & FCR</span>
            </router-link>

            <!-- Modul Livestock -->
            <router-link
              to="/livestock"
              class="bg-white p-3.5 rounded-2xl border border-slate-100/90 shadow-soft hover:shadow-card transition-all duration-200 flex flex-col items-center text-center group active:scale-95"
            >
              <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl mb-2 group-hover:scale-105 transition-transform">
                🐄
              </div>
              <span class="text-xs font-bold text-slate-800">Ransum</span>
              <span class="text-[10px] text-slate-400 mt-0.5">Feed Blender</span>
            </router-link>
          </div>
        </div>

        <!-- 3. Hero Status Banner (My Appointment Style in Reference) -->
        <div class="glass-banner rounded-3xl p-5 shadow-elevated relative overflow-hidden text-white">
          <div class="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
          
          <div class="flex justify-between items-start mb-3.5">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl border border-white/20 shadow-inner">
                <span v-if="profileStore.activeRole === 'tani'">🌾</span>
                <span v-else-if="profileStore.activeRole === 'tambak'">🦐</span>
                <span v-else>🐄</span>
              </div>
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-full border border-white/20">
                  Mode {{ profileStore.activeRole.toUpperCase() }} AKTIF
                </span>
                <h3 class="text-base font-bold mt-1 text-white tracking-tight leading-tight">
                  {{ profileStore.namaLahan || 'Lahan Pertanian Utama' }}
                </h3>
              </div>
            </div>
          </div>

          <!-- Frosted Glass Pill Information Strip -->
          <div class="glass-pill rounded-2xl p-3.5 flex items-center justify-between text-xs">
            <div class="flex items-center gap-2">
              <span class="text-base">📅</span>
              <div>
                <div class="text-[10px] text-emerald-100 font-medium">Status Prioritas Lapangan:</div>
                <div class="font-bold text-white text-xs mt-0.5">
                  <span v-if="profileStore.activeRole === 'tani'">Waktu Henti Hama (WTH) H-14 Aman</span>
                  <span v-else-if="profileStore.activeRole === 'tambak'">Target pH 7.5 - 8.2 Stabil Kolam</span>
                  <span v-else>Formulasi Ransum CP 16% Tercapai</span>
                </div>
              </div>
            </div>
            <router-link
              :to="profileStore.activeRole === 'tani' ? '/agri' : profileStore.activeRole === 'tambak' ? '/aqua' : '/livestock'"
              class="bg-white text-brand-700 font-bold px-3 py-1.5 rounded-xl shadow-soft text-[11px] hover:bg-emerald-50 transition active:scale-95 whitespace-nowrap"
            >
              Buka
            </router-link>
          </div>
        </div>

        <!-- 4. Quick Field Stats Strip (Screen 3 Pill Stats Style) -->
        <div class="grid grid-cols-3 gap-2.5">
          <div class="glass-stat-card p-3 rounded-2xl text-center">
            <div class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center text-sm mb-1">
              ⚡
            </div>
            <span class="text-xs font-bold text-slate-800 block">100% Offline</span>
            <span class="text-[10px] text-slate-400">Tanpa Kuota</span>
          </div>

          <div class="glass-stat-card p-3 rounded-2xl text-center">
            <div class="w-8 h-8 rounded-full bg-sky-50 text-sky-600 mx-auto flex items-center justify-center text-sm mb-1">
              📦
            </div>
            <span class="text-xs font-bold text-slate-800 block">Dexie DB</span>
            <span class="text-[10px] text-slate-400">Simpan Lokal</span>
          </div>

          <div class="glass-stat-card p-3 rounded-2xl text-center">
            <div class="w-8 h-8 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center text-sm mb-1">
              🎯
            </div>
            <span class="text-xs font-bold text-slate-800 block">Akurasi Dosis</span>
            <span class="text-[10px] text-slate-400">Standar Agronomi</span>
          </div>
        </div>

        <!-- 5. Kalender & Agenda Lapangan (Screen 4 Schedule & Timeline Style) -->
        <div class="bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 shadow-card space-y-4">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-sm font-bold text-slate-900">Agenda & Jadwal Lapangan</h2>
              <p class="text-[11px] text-slate-400">{{ currentMonthYear }}</p>
            </div>
            <span class="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
              Hari Ini
            </span>
          </div>

          <!-- Horizontal Date Picker Strip (Pill style like reference) -->
          <div class="flex gap-2 justify-between overflow-x-auto no-scrollbar py-1">
            <button
              v-for="d in dateStrip"
              :key="d.date"
              @click="selectedDate = d.date"
              type="button"
              class="flex flex-col items-center justify-center w-12 py-2.5 rounded-2xl transition-all duration-200 cursor-pointer"
              :class="selectedDate === d.date ? 'bg-brand-600 text-white shadow-soft scale-105 font-bold' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'"
            >
              <span class="text-sm leading-none font-bold">{{ d.date }}</span>
              <span class="text-[10px] mt-1 leading-none opacity-80">{{ d.day }}</span>
            </button>
          </div>

          <!-- Vertical Timeline Rail (Screen 4 style) -->
          <div class="space-y-3 pt-2">
            <div class="flex items-start gap-3">
              <span class="text-xs font-bold text-slate-400 w-12 pt-1">08.00</span>
              <div class="flex-1 bg-emerald-50/70 border border-emerald-100/90 rounded-2xl p-3 shadow-soft">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-xs text-emerald-900">🌿 Semprot Fungisida Mankozeb</span>
                  <span class="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Pagi</span>
                </div>
                <p class="text-[11px] text-emerald-700 mt-1">Dosis 16L Tangki (2 g/L) pada daun padi sebelum terik matahari.</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <span class="text-xs font-bold text-slate-400 w-12 pt-1">11.00</span>
              <div class="flex-1 bg-sky-50/70 border border-sky-100/90 rounded-2xl p-3 shadow-soft">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-xs text-sky-900">💧 Cek Salinitas & DO Kolam</span>
                  <span class="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full">Siang</span>
                </div>
                <p class="text-[11px] text-sky-700 mt-1">Pengukuran pH harian dan sirkulasi aerasi kincir air tambak.</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <span class="text-xs font-bold text-slate-400 w-12 pt-1">16.00</span>
              <div class="flex-1 bg-amber-50/70 border border-amber-100/90 rounded-2xl p-3 shadow-soft">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-xs text-amber-900">🌾 Ransum Pakan Sesi Sore</span>
                  <span class="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Sore</span>
                </div>
                <p class="text-[11px] text-amber-700 mt-1">Pemberian konsentrat formula Pearson Square untuk ternak.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonContent } from '@ionic/vue';
import AppHeader from '@/components/AppHeader.vue';
import { useProfileStore } from '@/stores/useProfileStore';

const router = useRouter();
const profileStore = useProfileStore();
const quickSearch = ref('');

const currentDate = new Date();
const currentMonthYear = currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
const todayNum = currentDate.getDate();

const selectedDate = ref(todayNum);

// Generate 5-day calendar strip
const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const dateStrip = computed(() => {
  const list = [];
  for (let i = -1; i <= 4; i++) {
    const d = new Date();
    d.setDate(currentDate.getDate() + i);
    list.push({
      date: d.getDate(),
      day: dayNames[d.getDay()]
    });
  }
  return list;
});

function goToSearch() {
  if (quickSearch.value.trim()) {
    router.push({ path: '/library', query: { q: quickSearch.value } });
  }
}
</script>
