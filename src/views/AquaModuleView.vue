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
            <WaterChart :logs="sampleWaterLogs" />
          </div>

          <!-- Quick Log Input Form -->
          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <h3 class="font-bold text-gray-800 text-sm">➕ Catat Parameter Air Hari Ini</h3>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label class="font-semibold text-gray-700">pH Air (6.5 - 8.5)</label>
                <input v-model.number="phVal" type="number" step="0.1" placeholder="7.5" class="w-full mt-1 p-2 border rounded-lg" />
              </div>
              <div>
                <label class="font-semibold text-gray-700">Suhu (°C)</label>
                <input v-model.number="tempVal" type="number" step="0.1" placeholder="28.5" class="w-full mt-1 p-2 border rounded-lg" />
              </div>
              <div>
                <label class="font-semibold text-gray-700">Salinitas (ppt)</label>
                <input v-model.number="salinityVal" type="number" placeholder="15" class="w-full mt-1 p-2 border rounded-lg" />
              </div>
              <div>
                <label class="font-semibold text-gray-700">DO Terlarut (mg/L)</label>
                <input v-model.number="doVal" type="number" step="0.1" placeholder="5.0" class="w-full mt-1 p-2 border rounded-lg" />
              </div>
            </div>
            <button @click="addWaterLog" class="w-full py-2 bg-aqua-600 text-white rounded-lg font-bold text-xs shadow-sm hover:bg-aqua-700">
              Simpan Log Air ke IndexedDB
            </button>
          </div>
        </div>

        <!-- Segment 2: FCR & Biomassa -->
        <div v-else-if="selectedSegment === 'fcr'" class="space-y-4">
          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <h3 class="font-bold text-aqua-800 text-sm">⚖️ Kalkulator Feed Conversion Ratio (FCR)</h3>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label class="font-semibold text-gray-700">Total Pakan Diberikan (kg)</label>
                <input v-model.number="totalFeedKg" type="number" placeholder="120" class="w-full mt-1 p-2 border rounded-lg" />
              </div>
              <div>
                <label class="font-semibold text-gray-700">Biomassa Akhir (kg)</label>
                <input v-model.number="finalBiomassKg" type="number" placeholder="100" class="w-full mt-1 p-2 border rounded-lg" />
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
                <label class="font-semibold text-gray-700">Populasi (Ekor)</label>
                <input v-model.number="population" type="number" placeholder="10000" class="w-full mt-1 p-2 border rounded-lg" />
              </div>
              <div>
                <label class="font-semibold text-gray-700">ABW (Gram)</label>
                <input v-model.number="abwGram" type="number" step="0.1" placeholder="10" class="w-full mt-1 p-2 border rounded-lg" />
              </div>
              <div>
                <label class="font-semibold text-gray-700">FR (%)</label>
                <input v-model.number="feedingRatePercent" type="number" step="0.1" placeholder="3" class="w-full mt-1 p-2 border rounded-lg" />
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
                <label class="font-semibold text-gray-700">ABW Awal (g)</label>
                <input v-model.number="weightStart" type="number" step="0.1" placeholder="5" class="w-full mt-1 p-2 border rounded-lg" />
              </div>
              <div>
                <label class="font-semibold text-gray-700">ABW Akhir (g)</label>
                <input v-model.number="weightEnd" type="number" step="0.1" placeholder="15" class="w-full mt-1 p-2 border rounded-lg" />
              </div>
              <div>
                <label class="font-semibold text-gray-700">Jumlah Hari</label>
                <input v-model.number="daysCount" type="number" placeholder="10" class="w-full mt-1 p-2 border rounded-lg" />
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
    <AppTabBar />
  </ion-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { IonPage, IonContent, IonSegment, IonSegmentButton, IonLabel } from '@ionic/vue';
import AppHeader from '@/components/AppHeader.vue';
import AppTabBar from '@/components/AppTabBar.vue';
import WaterChart from '@/components/charts/WaterChart.vue';
import GrowthChart from '@/components/charts/GrowthChart.vue';
import { calculateFCR, calculateDailyFeed, calculateADG } from '@/utils/calculators/aquaFcrCalc';
import { db } from '@/services/db';

const selectedSegment = ref('water');

// Water log state & sample chart data
const phVal = ref(7.5);
const tempVal = ref(28.5);
const salinityVal = ref(15);
const doVal = ref(5.0);

const sampleWaterLogs = ref([
  { date: 'Tgl 1', ph: 7.2, temp: 28.5, do_level: 5.2 },
  { date: 'Tgl 2', ph: 7.5, temp: 29.0, do_level: 4.8 },
  { date: 'Tgl 3', ph: 6.8, temp: 28.2, do_level: 5.5 },
  { date: 'Tgl 4', ph: 7.4, temp: 29.5, do_level: 5.1 },
  { date: 'Tgl 5', ph: 7.6, temp: 28.8, do_level: 4.9 }
]);

async function addWaterLog() {
  const newLog = {
    timestamp: new Date().toISOString(),
    ph: phVal.value,
    temp: tempVal.value,
    salinity: salinityVal.value,
    do_level: doVal.value,
    pond_id: 'Kolam-1'
  };
  await db.water_logs.add(newLog);
  sampleWaterLogs.value.push({
    date: `Tgl ${sampleWaterLogs.value.length + 1}`,
    ph: phVal.value,
    temp: tempVal.value,
    do_level: doVal.value
  });
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
</script>
