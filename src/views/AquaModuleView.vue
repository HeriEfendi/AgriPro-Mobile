<template>
  <ion-page>
    <AppHeader />
    <ion-content class="bg-slate-50/50">
      <div class="max-w-2xl mx-auto px-4 py-4 space-y-5 page-content">

        <!-- Ionic Segment Navigation (Pill Segment) -->
        <ion-segment v-model="selectedSegment" @ionChange="triggerHapticImpact()" class="shadow-soft">
          <ion-segment-button value="water">
            <ion-label class="text-xs font-bold">Log Air & Chart</ion-label>
          </ion-segment-button>
          <ion-segment-button value="fcr">
            <ion-label class="text-xs font-bold">FCR & Biomassa</ion-label>
          </ion-segment-button>
          <ion-segment-button value="sampling">
            <ion-label class="text-xs font-bold">Sampling ADG</ion-label>
          </ion-segment-button>
        </ion-segment>

        <!-- Segment 1: Log Kualitas Air & Chart.js Offline -->
        <div v-if="selectedSegment === 'water'" class="space-y-4">
          <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-card space-y-3">
            <div class="flex items-center gap-2.5 mb-1">
              <div class="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center text-xl">
                📊
              </div>
              <div>
                <h3 class="font-bold text-slate-900 text-sm">Grafik Kualitas Air Kolam (Offline)</h3>
                <p class="text-[11px] text-slate-400">Monitoring tren pH, suhu, dan oksigen terlarut</p>
              </div>
            </div>
            <WaterChart :logs="waterLogList" />
          </div>

          <!-- Quick Log Input Form -->
          <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-card space-y-4">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center text-xl">
                💧
              </div>
              <div>
                <h3 class="font-bold text-slate-900 text-sm">Catat Parameter Air Hari Ini</h3>
                <p class="text-[11px] text-slate-400">Evaluasi instan & simpan ke database lokal</p>
              </div>
            </div>

            <!-- Instant Water Condition Evaluation Badge -->
            <div class="p-3.5 rounded-2xl text-xs space-y-1" :class="waterConditionClass">
              <div class="font-bold flex items-center gap-1.5">
                <span>{{ waterConditionIcon }}</span>
                <span>Status Kondisi: {{ waterConditionTitle }}</span>
              </div>
              <p class="text-[11px] leading-relaxed">{{ waterConditionAdvice }}</p>
            </div>

            <div class="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label class="label-field">pH Air (Ideal: 7.2 - 8.2)</label>
                <input v-model.number="phVal" type="number" min="0" max="14" step="0.1" placeholder="7.5" class="input-field" />
              </div>
              <div>
                <label class="label-field">Suhu (°C) (Ideal: 28 - 31)</label>
                <input v-model.number="tempVal" type="number" min="0" step="0.1" placeholder="28.5" class="input-field" />
              </div>
              <div>
                <label class="label-field">Salinitas (ppt)</label>
                <input v-model.number="salinityVal" type="number" min="0" placeholder="15" class="input-field" />
              </div>
              <div>
                <label class="label-field">DO Terlarut (Ideal: > 4 mg/L)</label>
                <input v-model.number="doVal" type="number" min="0" step="0.1" placeholder="5.0" class="input-field" />
              </div>
            </div>

            <button @click="saveWaterLog" class="btn-secondary">
              <span>💾</span> Simpan Log Air ke Dexie DB
            </button>
          </div>

          <!-- Fitur Tambahan: Kalkulator Volume Air Kolam -->
          <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-card space-y-3">
            <div class="flex items-center justify-between cursor-pointer" @click="showVolCalc = !showVolCalc">
              <div class="flex items-center gap-2.5">
                <div class="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl">
                  📐
                </div>
                <div>
                  <h3 class="font-bold text-slate-900 text-sm">Kalkulator Volume Kolam (m³ & Liter)</h3>
                  <p class="text-[11px] text-slate-400">Hitung kubikasi air untuk dosis garam & kapur</p>
                </div>
              </div>
              <span class="text-xs text-slate-400 font-bold">{{ showVolCalc ? '▲' : '▼' }}</span>
            </div>

            <div v-if="showVolCalc" class="pt-2 space-y-3 text-xs border-t border-slate-100">
              <div class="flex gap-2">
                <button
                  type="button"
                  @click="pondShape = 'rect'"
                  :class="pondShape === 'rect' ? 'bg-teal-600 text-white font-bold' : 'bg-slate-100 text-slate-600'"
                  class="flex-1 py-1.5 rounded-xl transition text-xs cursor-pointer"
                >
                  Kolam Persegi
                </button>
                <button
                  type="button"
                  @click="pondShape = 'round'"
                  :class="pondShape === 'round' ? 'bg-teal-600 text-white font-bold' : 'bg-slate-100 text-slate-600'"
                  class="flex-1 py-1.5 rounded-xl transition text-xs cursor-pointer"
                >
                  Kolam Bundar (Bulat)
                </button>
              </div>

              <!-- Rect inputs -->
              <div v-if="pondShape === 'rect'" class="grid grid-cols-3 gap-2">
                <div>
                  <label class="label-field">Panjang (m)</label>
                  <input v-model.number="pondLength" type="number" min="0" placeholder="10" class="input-field" />
                </div>
                <div>
                  <label class="label-field">Lebar (m)</label>
                  <input v-model.number="pondWidth" type="number" min="0" placeholder="5" class="input-field" />
                </div>
                <div>
                  <label class="label-field">Tinggi Air (m)</label>
                  <input v-model.number="pondDepth" type="number" min="0" step="0.1" placeholder="1" class="input-field" />
                </div>
              </div>

              <!-- Round inputs -->
              <div v-else class="grid grid-cols-2 gap-2">
                <div>
                  <label class="label-field">Diameter Kolam (m)</label>
                  <input v-model.number="pondDiameter" type="number" min="0" placeholder="3" class="input-field" />
                </div>
                <div>
                  <label class="label-field">Tinggi Air (m)</label>
                  <input v-model.number="pondDepth" type="number" min="0" step="0.1" placeholder="1" class="input-field" />
                </div>
              </div>

              <!-- Volume Result -->
              <div class="p-3.5 bg-teal-50/70 rounded-2xl border border-teal-100 flex items-center justify-between">
                <div>
                  <span class="font-bold text-teal-950 block text-xs">Total Volume Air Kolam:</span>
                  <span class="text-[10px] text-teal-700">Setara {{ (calculatedVolumeM3 * 1000).toLocaleString('id-ID') }} Liter</span>
                </div>
                <span class="text-base font-extrabold text-teal-700">{{ calculatedVolumeM3 }} m³</span>
              </div>
            </div>
          </div>

          <!-- History Table from Dexie -->
          <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-card space-y-3">
            <div class="flex justify-between items-center">
              <h4 class="font-bold text-slate-900 text-xs">Riwayat Catatan Parameter Air</h4>
              <span class="text-[10px] text-slate-400">{{ waterLogList.length }} Catatan</span>
            </div>

            <div v-if="waterLogList.length > 0" class="space-y-2 max-h-48 overflow-y-auto pr-1">
              <div
                v-for="item in waterLogList"
                :key="item.id"
                class="p-3.5 bg-sky-50/60 rounded-2xl border border-sky-100 flex justify-between items-center text-xs"
              >
                <div>
                  <div class="font-bold text-sky-950 text-xs">pH {{ item.ph }} • Suhu {{ item.temp }}°C</div>
                  <div class="text-slate-500 text-[11px] mt-0.5">Salinitas {{ item.salinity }} ppt • DO {{ item.do_level }} mg/L</div>
                </div>
                <button @click="removeWaterLog(item.id)" class="btn-danger">
                  Hapus
                </button>
              </div>
            </div>
            <div v-else class="text-xs text-slate-400 text-center py-4">Belum ada catatan air tersimpan.</div>
          </div>
        </div>

        <!-- Segment 2: FCR & Biomassa -->
        <div v-else-if="selectedSegment === 'fcr'" class="space-y-4">
          <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-card space-y-4">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center text-xl">
                ⚖️
              </div>
              <div>
                <h3 class="font-bold text-slate-900 text-sm">Kalkulator Feed Conversion Ratio (FCR)</h3>
                <p class="text-[11px] text-slate-400">Efisiensi pakan udang & ikan budidaya</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label class="label-field">Total Pakan (kg)</label>
                <input v-model.number="totalFeedKg" type="number" placeholder="120" class="input-field" />
              </div>
              <div>
                <label class="label-field">Biomassa Akhir (kg)</label>
                <input v-model.number="finalBiomassKg" type="number" placeholder="100" class="input-field" />
              </div>
            </div>

            <div class="p-4 rounded-2xl border text-xs space-y-1.5" :class="fcrBgClass">
              <div class="flex justify-between font-extrabold text-base">
                <span>Nilai FCR:</span>
                <span>{{ fcrResult.fcr }}</span>
              </div>
              <p class="text-[11px] leading-relaxed opacity-90">{{ fcrResult.description }}</p>
            </div>
          </div>

          <!-- Kalkulator Pakan Harian -->
          <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-card space-y-4">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center text-xl">
                🍽️
              </div>
              <div>
                <h3 class="font-bold text-slate-900 text-sm">Estimasi Pakan Harian (Feeding Rate)</h3>
                <p class="text-[11px] text-slate-400">Hitung porsi makan per hari & per sesi</p>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-2 text-xs">
              <div>
                <label class="label-field">Populasi (Ekor)</label>
                <input v-model.number="population" type="number" placeholder="10000" class="input-field" />
              </div>
              <div>
                <label class="label-field">ABW (Gram)</label>
                <input v-model.number="abwGram" type="number" step="0.1" placeholder="10" class="input-field" />
              </div>
              <div>
                <label class="label-field">FR (%)</label>
                <input v-model.number="feedingRatePercent" type="number" step="0.1" placeholder="3" class="input-field" />
              </div>
            </div>

            <div class="p-4 bg-sky-50/70 rounded-2xl border border-sky-100/90 text-xs space-y-2">
              <div class="flex justify-between font-semibold text-slate-700">
                <span>Biomassa Total Kolam:</span>
                <span class="font-bold text-slate-900">{{ dailyFeedResult.totalBiomassKg }} kg</span>
              </div>
              <div class="flex justify-between font-bold text-sky-950 border-t border-sky-100 pt-2">
                <span>Kebutuhan Pakan Harian:</span>
                <span class="text-base text-sky-700 font-extrabold">{{ dailyFeedResult.dailyFeedKg }} kg / Hari</span>
              </div>
              <div class="flex justify-between text-slate-500">
                <span>Porsi 3x Makan:</span>
                <span class="font-semibold text-slate-700">{{ dailyFeedResult.feedPerMeal3xKg }} kg / sesi</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Segment 3: Sampling Growth Tracker -->
        <div v-else class="space-y-4">
          <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-card space-y-3">
            <div class="flex items-center gap-2.5 mb-1">
              <div class="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center text-xl">
                📈
              </div>
              <div>
                <h3 class="font-bold text-slate-900 text-sm">Kurva Pertumbuhan ABW (Chart Offline)</h3>
                <p class="text-[11px] text-slate-400">Tren penambahan bobot rata-rata mingguan</p>
              </div>
            </div>
            <GrowthChart :samples="sampleGrowthData" />
          </div>

          <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-card space-y-4">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center text-xl">
                🧮
              </div>
              <div>
                <h3 class="font-bold text-slate-900 text-sm">Hitung Average Daily Gain (ADG)</h3>
                <p class="text-[11px] text-slate-400">Pertambahan bobot harian udang/ikan</p>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-2 text-xs">
              <div>
                <label class="label-field">ABW Awal (g)</label>
                <input v-model.number="weightStart" type="number" step="0.1" placeholder="5" class="input-field" />
              </div>
              <div>
                <label class="label-field">ABW Akhir (g)</label>
                <input v-model.number="weightEnd" type="number" step="0.1" placeholder="15" class="input-field" />
              </div>
              <div>
                <label class="label-field">Jumlah Hari</label>
                <input v-model.number="daysCount" type="number" placeholder="10" class="input-field" />
              </div>
            </div>

            <div class="p-4 bg-sky-50/70 rounded-2xl border border-sky-100 text-xs flex justify-between items-center font-bold text-sky-950">
              <span>Laju ADG Harian:</span>
              <span class="text-base text-sky-700 font-extrabold">{{ adgResult.adgGramPerDay }} gram / hari</span>
            </div>
          </div>
        </div>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { IonPage, IonContent, IonSegment, IonSegmentButton, IonLabel } from '@ionic/vue';
import AppHeader from '@/components/AppHeader.vue';

import WaterChart from '@/components/charts/WaterChart.vue';
import GrowthChart from '@/components/charts/GrowthChart.vue';
import { calculateFCR, calculateDailyFeed, calculateADG } from '@/utils/calculators/aquaFcrCalc';
import { addWaterLog, getAllWaterLogs, deleteWaterLog } from '@/services/db';
import { triggerHapticImpact, triggerHapticSuccess } from '@/utils/haptics';

const selectedSegment = ref('water');

// Water log state & Dexie live data
const phVal = ref(7.5);
const tempVal = ref(28.5);
const salinityVal = ref(15);
const doVal = ref(5.0);
const waterLogList = ref([]);

// Pond Volume State
const showVolCalc = ref(false);
const pondShape = ref('rect');
const pondLength = ref(10);
const pondWidth = ref(5);
const pondDiameter = ref(3);
const pondDepth = ref(1.2);

const calculatedVolumeM3 = computed(() => {
  const depth = Math.max(0, parseFloat(pondDepth.value) || 0);
  if (pondShape.value === 'rect') {
    const l = Math.max(0, parseFloat(pondLength.value) || 0);
    const w = Math.max(0, parseFloat(pondWidth.value) || 0);
    return Number((l * w * depth).toFixed(2));
  } else {
    const d = Math.max(0, parseFloat(pondDiameter.value) || 0);
    const r = d / 2;
    return Number((Math.PI * r * r * depth).toFixed(2));
  }
});

// Real-Time Water Condition Evaluator
const waterCondition = computed(() => {
  const ph = parseFloat(phVal.value) || 7;
  const doL = parseFloat(doVal.value) || 5;
  const temp = parseFloat(tempVal.value) || 28;

  if (ph < 6.8) {
    return {
      status: 'warning',
      icon: '⚠️',
      title: 'Air Asam (pH Drop < 6.8)',
      advice: 'Tebarkan Kapur Dolomit 10-20 ppm bertahap untuk menstabilkan buffer keasaman kolam.',
      class: 'bg-amber-50 border border-amber-200 text-amber-900'
    };
  }
  if (ph > 8.5) {
    return {
      status: 'warning',
      icon: '⚠️',
      title: 'Air Terlalu Basa (pH > 8.5)',
      advice: 'Waspada ledakan alga (blooming). Berikan molase 2-3 ppm dan perbanyak sirkulasi air segar.',
      class: 'bg-amber-50 border border-amber-200 text-amber-900'
    };
  }
  if (doL < 4.0) {
    return {
      status: 'danger',
      icon: '🚨',
      title: 'DO Kritis (< 4.0 mg/L)',
      advice: 'Oksigen rendah! Segera nyalakan seluruh kincir air 24 jam dan kurangi pakan harian 50%.',
      class: 'bg-rose-50 border border-rose-200 text-rose-900'
    };
  }
  if (temp < 26 || temp > 32) {
    return {
      status: 'warning',
      icon: '🌡️',
      title: 'Suhu di Luar Rentang Ideal',
      advice: 'Suhu optimal udang/ikan: 28-31°C. Atur kedalaman air kolam untuk meredam fluktuasi cuaca.',
      class: 'bg-amber-50 border border-amber-200 text-amber-900'
    };
  }

  return {
    status: 'optimal',
    icon: '✅',
    title: 'Parameter Air Kolam Optimal',
    advice: 'pH, suhu, dan oksigen terlarut berada dalam batas aman untuk pertumbuhan maksimal komoditas.',
    class: 'bg-emerald-50 border border-emerald-200 text-emerald-900'
  };
});

const waterConditionIcon = computed(() => waterCondition.value.icon);
const waterConditionTitle = computed(() => waterCondition.value.title);
const waterConditionAdvice = computed(() => waterCondition.value.advice);
const waterConditionClass = computed(() => waterCondition.value.class);

async function loadWaterLogs() {
  let logs = await getAllWaterLogs();
  if (logs.length === 0) {
    const now = Date.now();
    const initialSamples = [
      { ph: 7.2, temp: 28.5, salinity: 15, do_level: 5.2, pond_id: 'Kolam Utama', timestamp: new Date(now - 3 * 86400000).toISOString() },
      { ph: 7.5, temp: 29.0, salinity: 15, do_level: 4.8, pond_id: 'Kolam Utama', timestamp: new Date(now - 2 * 86400000).toISOString() },
      { ph: 6.8, temp: 28.2, salinity: 14, do_level: 5.5, pond_id: 'Kolam Utama', timestamp: new Date(now - 1 * 86400000).toISOString() },
      { ph: 7.4, temp: 29.5, salinity: 15, do_level: 5.1, pond_id: 'Kolam Utama', timestamp: new Date(now).toISOString() }
    ];
    for (const sample of initialSamples) {
      await addWaterLog(sample);
    }
    logs = await getAllWaterLogs();
  }
  waterLogList.value = logs;
}

async function saveWaterLog() {
  await triggerHapticSuccess();
  await addWaterLog({
    ph: phVal.value,
    temp: tempVal.value,
    salinity: salinityVal.value,
    do_level: doVal.value,
    pond_id: 'Kolam Utama'
  });
  await loadWaterLogs();
}

async function removeWaterLog(id) {
  await deleteWaterLog(id);
  await loadWaterLogs();
}

// FCR State
const totalFeedKg = ref(120);
const finalBiomassKg = ref(100);

const fcrResult = computed(() => {
  return calculateFCR(totalFeedKg.value || 0, finalBiomassKg.value || 0);
});

const fcrBgClass = computed(() => {
  if (fcrResult.value.status === 'EXCELLENT') return 'bg-emerald-50 border-emerald-200 text-emerald-900';
  if (fcrResult.value.status === 'WARNING') return 'bg-amber-50 border-amber-200 text-amber-900';
  return 'bg-sky-50 border-sky-200 text-sky-900';
});

// Daily Feed State
const population = ref(10000);
const abwGram = ref(10);
const feedingRatePercent = ref(3);

const dailyFeedResult = computed(() => {
  return calculateDailyFeed(population.value || 0, abwGram.value || 0, feedingRatePercent.value || 3);
});

// Sampling & ADG State
const sampleGrowthData = ref([
  { week: 1, abwGram: 2.5 },
  { week: 2, abwGram: 5.0 },
  { week: 3, abwGram: 8.5 },
  { week: 4, abwGram: 12.0 },
  { week: 5, abwGram: 16.5 }
]);

const weightStart = ref(5);
const weightEnd = ref(15);
const daysCount = ref(10);

const adgResult = computed(() => {
  return calculateADG(weightEnd.value || 0, weightStart.value || 0, daysCount.value || 1);
});

onMounted(() => {
  loadWaterLogs();
});
</script>
