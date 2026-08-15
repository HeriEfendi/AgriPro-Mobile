<template>
  <ion-page>
    <AppHeader />
    <ion-content class="ion-padding bg-gray-50">
      <div class="max-w-2xl mx-auto space-y-4">

        <!-- Ionic Segment Navigation -->
        <ion-segment v-model="selectedSegment" color="secondary" class="bg-white rounded-xl shadow-sm border p-1">
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
          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <h3 class="font-bold text-aqua-800 text-sm">📊 Grafik Tren Kualitas Air Offline</h3>
            <WaterChart :logs="waterLogList" />
          </div>

          <!-- Quick Log Input Form -->
          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <h3 class="font-bold text-gray-800 text-sm flex items-center gap-1.5">
              <span>➕</span> Catat Parameter Air Hari Ini
            </h3>
            <div class="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label class="font-bold text-gray-800 block mb-1">pH Air (6.5 - 8.5)</label>
                <input v-model.number="phVal" type="number" step="0.1" placeholder="7.5" class="input-field" />
              </div>
              <div>
                <label class="font-bold text-gray-800 block mb-1">Suhu (°C)</label>
                <input v-model.number="tempVal" type="number" step="0.1" placeholder="28.5" class="input-field" />
              </div>
              <div>
                <label class="font-bold text-gray-800 block mb-1">Salinitas (ppt)</label>
                <input v-model.number="salinityVal" type="number" placeholder="15" class="input-field" />
              </div>
              <div>
                <label class="font-bold text-gray-800 block mb-1">DO Terlarut (mg/L)</label>
                <input v-model.number="doVal" type="number" step="0.1" placeholder="5.0" class="input-field" />
              </div>
            </div>
            <button @click="saveWaterLog" class="btn-secondary">
              Simpan Log Air ke Dexie IndexedDB
            </button>
          </div>

          <!-- History Table from Dexie -->
          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <h4 class="font-bold text-gray-800 text-xs">📋 Riwayat Catatan Air Kolam</h4>
            <div v-if="waterLogList.length > 0" class="space-y-2 max-h-48 overflow-y-auto pr-1">
              <div v-for="item in waterLogList" :key="item.id" class="p-2.5 bg-aqua-50 rounded-lg border border-aqua-200 flex justify-between items-center text-xs">
                <div>
                  <div class="font-bold text-aqua-900">pH {{ item.ph }} | Suhu {{ item.temp }}°C</div>
                  <div class="text-gray-600 text-[10px]">Salinitas {{ item.salinity }} ppt | DO {{ item.do_level }} mg/L</div>
                </div>
                <button @click="removeWaterLog(item.id)" class="btn-danger">
                  Hapus
                </button>
              </div>
            </div>
            <div v-else class="text-xs text-gray-400 text-center py-2">Belum ada catatan air tersimpan.</div>
          </div>
        </div>

        <!-- Segment 2: FCR & Biomassa -->
        <div v-else-if="selectedSegment === 'fcr'" class="space-y-4">
          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <h3 class="font-bold text-aqua-800 text-sm">⚖️ Kalkulator Feed Conversion Ratio (FCR)</h3>
            <div class="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label class="font-bold text-gray-800 block mb-1">Total Pakan Diberikan (kg)</label>
                <input v-model.number="totalFeedKg" type="number" placeholder="120" class="input-field" />
              </div>
              <div>
                <label class="font-bold text-gray-800 block mb-1">Biomassa Akhir (kg)</label>
                <input v-model.number="finalBiomassKg" type="number" placeholder="100" class="input-field" />
              </div>
            </div>

            <div class="p-3 rounded-xl border text-xs space-y-1.5" :class="fcrBgClass">
              <div class="flex justify-between font-bold text-sm">
                <span>Nilai FCR:</span>
                <span>{{ fcrResult.fcr }}</span>
              </div>
              <p>{{ fcrResult.description }}</p>
            </div>
          </div>

          <!-- Kalkulator Pakan Harian -->
          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <h3 class="font-bold text-gray-800 text-sm">🍽️ Estimasi Pakan Harian (Feeding Rate)</h3>
            <div class="grid grid-cols-3 gap-2 text-xs">
              <div>
                <label class="font-bold text-gray-800 block mb-1">Populasi (Ekor)</label>
                <input v-model.number="population" type="number" placeholder="10000" class="input-field" />
              </div>
              <div>
                <label class="font-bold text-gray-800 block mb-1">ABW (Gram)</label>
                <input v-model.number="abwGram" type="number" step="0.1" placeholder="10" class="input-field" />
              </div>
              <div>
                <label class="font-bold text-gray-800 block mb-1">FR (%)</label>
                <input v-model.number="feedingRatePercent" type="number" step="0.1" placeholder="3" class="input-field" />
              </div>
            </div>

            <div class="p-3 bg-aqua-50 rounded-xl border border-aqua-200 text-xs space-y-1.5">
              <div class="flex justify-between font-semibold text-aqua-900">
                <span>Biomassa Total Kolam:</span>
                <span class="font-bold text-aqua-700">{{ dailyFeedResult.totalBiomassKg }} kg</span>
              </div>
              <div class="flex justify-between font-bold text-aqua-900 border-t pt-1">
                <span>Kebutuhan Pakan Harian:</span>
                <span class="text-sm text-aqua-700">{{ dailyFeedResult.dailyFeedKg }} kg / Hari</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Porsi 3x Makan:</span>
                <span>{{ dailyFeedResult.feedPerMeal3xKg }} kg / sesi</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Segment 3: Sampling Growth Tracker -->
        <div v-else class="space-y-4">
          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <h3 class="font-bold text-aqua-800 text-sm">📈 Kurva Pertumbuhan ABW (Chart Offline)</h3>
            <GrowthChart :samples="sampleGrowthData" />
          </div>

          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <h3 class="font-bold text-gray-800 text-sm">🧮 Hitung Average Daily Gain (ADG)</h3>
            <div class="grid grid-cols-3 gap-2 text-xs">
              <div>
                <label class="font-bold text-gray-800 block mb-1">ABW Awal (g)</label>
                <input v-model.number="weightStart" type="number" step="0.1" placeholder="5" class="input-field" />
              </div>
              <div>
                <label class="font-bold text-gray-800 block mb-1">ABW Akhir (g)</label>
                <input v-model.number="weightEnd" type="number" step="0.1" placeholder="15" class="input-field" />
              </div>
              <div>
                <label class="font-bold text-gray-800 block mb-1">Jumlah Hari</label>
                <input v-model.number="daysCount" type="number" placeholder="10" class="input-field" />
              </div>
            </div>

            <div class="p-3 bg-aqua-50 rounded-xl border border-aqua-200 text-xs flex justify-between font-bold text-aqua-900">
              <span>Laju ADG (Gram/Hari):</span>
              <span class="text-sm text-aqua-700">{{ adgResult.adgGramPerDay }} g / hari</span>
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

const selectedSegment = ref('water');

// Water log state & Dexie live data
const phVal = ref(7.5);
const tempVal = ref(28.5);
const salinityVal = ref(15);
const doVal = ref(5.0);
const waterLogList = ref([]);

async function loadWaterLogs() {
  const logs = await getAllWaterLogs();
  if (logs.length === 0) {
    waterLogList.value = [
      { id: 1, ph: 7.2, temp: 28.5, salinity: 15, do_level: 5.2 },
      { id: 2, ph: 7.5, temp: 29.0, salinity: 15, do_level: 4.8 },
      { id: 3, ph: 6.8, temp: 28.2, salinity: 14, do_level: 5.5 },
      { id: 4, ph: 7.4, temp: 29.5, salinity: 15, do_level: 5.1 }
    ];
  } else {
    waterLogList.value = logs;
  }
}

async function saveWaterLog() {
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
  if (fcrResult.value.status === 'EXCELLENT') return 'bg-green-50 border-green-200 text-green-800';
  if (fcrResult.value.status === 'WARNING') return 'bg-amber-50 border-amber-200 text-amber-800';
  return 'bg-blue-50 border-blue-200 text-blue-800';
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
