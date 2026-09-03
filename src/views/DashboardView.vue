<template>
  <ion-page>
    <AppHeader />
    <ion-content class="bg-slate-50/50">
      <div class="max-w-2xl mx-auto px-4 py-4 space-y-5 page-content">
        
        <!-- 1. Modern Pill Search Bar -->
        <div class="space-y-2">
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

          <!-- Quick search suggestion chips -->
          <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 px-1">
            <span class="text-[10px] text-slate-400 font-medium whitespace-nowrap">Populer:</span>
            <button
              v-for="chip in popularChips"
              :key="chip"
              type="button"
              @click="searchByChip(chip)"
              class="text-[10px] bg-white border border-slate-200/80 hover:border-brand-300 text-slate-600 hover:text-brand-700 px-2.5 py-0.5 rounded-full font-medium whitespace-nowrap transition shadow-soft active:scale-95 cursor-pointer"
            >
              #{{ chip }}
            </button>
          </div>
        </div>

        <!-- 2. Modul & Spesialisasi Lapangan (4 Cards) -->
        <div>
          <div class="flex justify-between items-center mb-3">
            <h2 class="text-sm font-bold text-slate-900 tracking-tight">Modul Spesialisasi</h2>
            <router-link to="/library" class="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-0.5">
              Pustaka lengkap <span class="text-[10px]">❯</span>
            </router-link>
          </div>

          <div class="grid grid-cols-4 gap-2 sm:gap-2.5">
            <!-- Modul Agri -->
            <router-link
              to="/agri"
              class="bg-white p-3 rounded-2xl border border-slate-100/90 shadow-soft hover:shadow-card transition-all duration-200 flex flex-col items-center text-center group active:scale-95"
            >
              <div class="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl mb-1.5 group-hover:scale-105 transition-transform">
                🌾
              </div>
              <span class="text-xs font-bold text-slate-800">AgriMix</span>
              <span class="text-[10px] text-slate-400 mt-0.5">Tangki</span>
            </router-link>

            <!-- Modul Aqua -->
            <router-link
              to="/aqua"
              class="bg-white p-3 rounded-2xl border border-slate-100/90 shadow-soft hover:shadow-card transition-all duration-200 flex flex-col items-center text-center group active:scale-95"
            >
              <div class="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center text-xl mb-1.5 group-hover:scale-105 transition-transform">
                🦐
              </div>
              <span class="text-xs font-bold text-slate-800">AquaLog</span>
              <span class="text-[10px] text-slate-400 mt-0.5">Air & FCR</span>
            </router-link>

            <!-- Modul Livestock -->
            <router-link
              to="/livestock"
              class="bg-white p-3 rounded-2xl border border-slate-100/90 shadow-soft hover:shadow-card transition-all duration-200 flex flex-col items-center text-center group active:scale-95"
            >
              <div class="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl mb-1.5 group-hover:scale-105 transition-transform">
                🐄
              </div>
              <span class="text-xs font-bold text-slate-800">Ransum</span>
              <span class="text-[10px] text-slate-400 mt-0.5">Pakan IB</span>
            </router-link>

            <!-- Modul Herbal -->
            <router-link
              to="/library?q=herbal"
              class="bg-white p-3 rounded-2xl border border-slate-100/90 shadow-soft hover:shadow-card transition-all duration-200 flex flex-col items-center text-center group active:scale-95"
            >
              <div class="w-11 h-11 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center text-xl mb-1.5 group-hover:scale-105 transition-transform">
                🌿
              </div>
              <span class="text-xs font-bold text-slate-800">Herbal</span>
              <span class="text-[10px] text-slate-400 mt-0.5">Jamu Alami</span>
            </router-link>
          </div>
        </div>

        <!-- 3. Hero Status Banner -->
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
                  {{ dynamicHeroStatus }}
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

        <!-- 4. Quick Live Field Stats Strip (Real Dexie DB counts) -->
        <div class="grid grid-cols-3 gap-2.5">
          <router-link to="/agri" class="glass-stat-card p-3 rounded-2xl text-center transition hover:shadow-card group">
            <div class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center text-sm mb-1 group-hover:scale-110 transition">
              🌾
            </div>
            <span class="text-xs font-bold text-slate-800 block">{{ cropCount }} Jadwal</span>
            <span class="text-[10px] text-slate-400">Lahan Tani</span>
          </router-link>

          <router-link to="/aqua" class="glass-stat-card p-3 rounded-2xl text-center transition hover:shadow-card group">
            <div class="w-8 h-8 rounded-full bg-sky-50 text-sky-600 mx-auto flex items-center justify-center text-sm mb-1 group-hover:scale-110 transition">
              💧
            </div>
            <span class="text-xs font-bold text-slate-800 block">{{ waterLogCount > 0 ? `pH ${latestPh}` : 'Log Kosong' }}</span>
            <span class="text-[10px] text-slate-400">Kualitas Air</span>
          </router-link>

          <router-link to="/livestock" class="glass-stat-card p-3 rounded-2xl text-center transition hover:shadow-card group">
            <div class="w-8 h-8 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center text-sm mb-1 group-hover:scale-110 transition">
              🐄
            </div>
            <span class="text-xs font-bold text-slate-800 block">{{ breedingCount }} Ekor</span>
            <span class="text-[10px] text-slate-400">Ternak IB</span>
          </router-link>
        </div>

        <!-- 5. Kalender & Agenda Lapangan (Interactive Checklist) -->
        <div class="bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 shadow-card space-y-4">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-sm font-bold text-slate-900">Agenda & Jadwal Lapangan</h2>
              <p class="text-[11px] text-slate-400">{{ currentMonthYear }}</p>
            </div>
            <span class="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
              Tgl {{ selectedDate }}
            </span>
          </div>

          <!-- Horizontal Date Picker Strip -->
          <div class="flex gap-2 justify-between overflow-x-auto no-scrollbar py-1">
            <button
              v-for="d in dateStrip"
              :key="d.date"
              @click="onSelectDate(d.date)"
              type="button"
              class="flex flex-col items-center justify-center w-12 py-2.5 rounded-2xl transition-all duration-200 cursor-pointer"
              :class="selectedDate === d.date ? 'bg-brand-600 text-white shadow-soft scale-105 font-bold' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'"
            >
              <span class="text-sm leading-none font-bold">{{ d.date }}</span>
              <span class="text-[10px] mt-1 leading-none opacity-80">{{ d.day }}</span>
            </button>
          </div>

          <!-- Dynamic Checklist Items -->
          <div class="space-y-2.5 pt-2">
            <div
              v-for="(task, idx) in activeAgendaTasks"
              :key="task.id || idx"
              class="flex items-start gap-3 p-3 rounded-2xl border transition-all duration-150"
              :class="task.done ? 'bg-slate-50/60 border-slate-100 opacity-60' : task.bgClass"
            >
              <!-- Checkbox button -->
              <button
                type="button"
                @click="toggleTask(task)"
                class="w-5 h-5 mt-0.5 rounded-lg border flex items-center justify-center transition active:scale-90 shrink-0 cursor-pointer"
                :class="task.done ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'"
              >
                <svg v-if="task.done" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
              </button>

              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-2">
                  <span
                    class="font-bold text-xs leading-snug truncate"
                    :class="task.done ? 'line-through text-slate-400' : task.titleClass"
                  >
                    {{ task.title }}
                  </span>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0" :class="task.badgeClass">
                    {{ task.time }}
                  </span>
                </div>
                <p class="text-[11px] mt-0.5 leading-relaxed" :class="task.done ? 'text-slate-400' : task.descClass">
                  {{ task.desc }}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonContent } from '@ionic/vue';
import AppHeader from '@/components/AppHeader.vue';
import { useProfileStore } from '@/stores/useProfileStore';
import { getAllCropSchedules, getAllWaterLogs, getAllBreedingLogs } from '@/services/db';
import { triggerHapticImpact, triggerHapticSuccess } from '@/utils/haptics';

const router = useRouter();
const profileStore = useProfileStore();
const quickSearch = ref('');

const popularChips = ['Padi', 'Cabai', 'pH Kolam', 'Ransum CP 16%', 'Jahe Merah', 'PMK'];

const currentDate = new Date();
const currentMonthYear = currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
const todayNum = currentDate.getDate();

const selectedDate = ref(todayNum);

// Live Dexie stats
const cropCount = ref(0);
const waterLogCount = ref(0);
const latestPh = ref('7.5');
const breedingCount = ref(0);
const latestCropName = ref('');
const latestBreedingTag = ref('');

async function loadDashboardData() {
  try {
    const crops = await getAllCropSchedules();
    cropCount.value = crops.length;
    if (crops.length > 0) {
      latestCropName.value = crops[0].crop_name;
    }

    const waterLogs = await getAllWaterLogs();
    waterLogCount.value = waterLogs.length;
    if (waterLogs.length > 0) {
      latestPh.value = String(waterLogs[0].ph);
    }

    const breedings = await getAllBreedingLogs();
    breedingCount.value = breedings.length;
    if (breedings.length > 0) {
      latestBreedingTag.value = breedings[0].animal_tag;
    }
  } catch (e) {
    console.error('Error loading dashboard stats:', e);
  }
}

const dynamicHeroStatus = computed(() => {
  if (profileStore.activeRole === 'tani') {
    return latestCropName.value ? `${latestCropName.value} (Jadwal WTH Aktif)` : 'Waktu Henti Hama (WTH) H-14 Aman';
  } else if (profileStore.activeRole === 'tambak') {
    return waterLogCount.value > 0 ? `pH Terakhir: ${latestPh.value} (Stabil Kolam)` : 'Target pH 7.5 - 8.2 Stabil Kolam';
  } else {
    return latestBreedingTag.value ? `Tag: ${latestBreedingTag.value} (Pantau IB)` : 'Formulasi Ransum CP 16% Tercapai';
  }
});

// Interactive Tasks
const agendaTasks = ref([
  {
    id: 1,
    title: '🌿 Semprot Fungisida Mankozeb',
    desc: 'Dosis 16L Tangki (2 g/L) pada daun tanaman sebelum terik matahari.',
    time: '08.00',
    done: false,
    bgClass: 'bg-emerald-50/70 border-emerald-100/90',
    titleClass: 'text-emerald-900',
    descClass: 'text-emerald-700',
    badgeClass: 'bg-emerald-100 text-emerald-800'
  },
  {
    id: 2,
    title: '💧 Cek Salinitas & DO Kolam',
    desc: 'Pengukuran pH harian dan sirkulasi aerasi kincir air tambak.',
    time: '11.00',
    done: false,
    bgClass: 'bg-sky-50/70 border-sky-100/90',
    titleClass: 'text-sky-900',
    descClass: 'text-sky-700',
    badgeClass: 'bg-sky-100 text-sky-800'
  },
  {
    id: 3,
    title: '🌾 Ransum Pakan Sesi Sore',
    desc: 'Pemberian konsentrat formula Pearson Square untuk ternak.',
    time: '16.00',
    done: false,
    bgClass: 'bg-amber-50/70 border-amber-100/90',
    titleClass: 'text-amber-900',
    descClass: 'text-amber-700',
    badgeClass: 'bg-amber-100 text-amber-800'
  }
]);

const activeAgendaTasks = computed(() => agendaTasks.value);

function toggleTask(task) {
  task.done = !task.done;
  if (task.done) {
    triggerHapticSuccess();
  } else {
    triggerHapticImpact();
  }
}

function onSelectDate(date) {
  triggerHapticImpact();
  selectedDate.value = date;
}

// Generate 5-day calendar strip
const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const dateStrip = computed(() => {
  const list = [];
  for (let i = -1; i <= 3; i++) {
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
    router.push({ path: '/library', query: { q: quickSearch.value.trim() } });
  }
}

function searchByChip(chip) {
  triggerHapticImpact();
  quickSearch.value = chip;
  router.push({ path: '/library', query: { q: chip } });
}

onMounted(() => {
  loadDashboardData();
});
</script>
