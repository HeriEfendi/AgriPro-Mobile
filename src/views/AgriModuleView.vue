<template>
  <ion-page>
    <AppHeader />
    <ion-content class="ion-padding bg-gray-50">
      <div class="max-w-2xl mx-auto space-y-4">
        
        <!-- Ionic Segment Sub-Navigation -->
        <ion-segment v-model="selectedSegment" color="primary" class="bg-white rounded-xl shadow-sm border p-1">
          <ion-segment-button value="agrimix">
            <ion-label class="text-xs font-bold">AgriMix Tangki</ion-label>
          </ion-segment-button>
          <ion-segment-button value="population">
            <ion-label class="text-xs font-bold">Populasi Bibit</ion-label>
          </ion-segment-button>
          <ion-segment-button value="calendar">
            <ion-label class="text-xs font-bold">Kalender Tanam</ion-label>
          </ion-segment-button>
        </ion-segment>

        <!-- Segment 1: AgriMix Tangki Semprot -->
        <div v-if="selectedSegment === 'agrimix'" class="space-y-4">
          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <h3 class="font-bold text-agri-800 text-sm">🧪 Kalkulator Racik Tangki Semprot</h3>
            
            <div class="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label class="font-semibold text-gray-700">Dosis per Ha (ml/g)</label>
                <input v-model.number="dosePerHa" type="number" placeholder="1000" class="w-full mt-1 p-2 border rounded-lg" />
              </div>
              <div>
                <label class="font-semibold text-gray-700">Luas Lahan (m²)</label>
                <input v-model.number="areaM2" type="number" placeholder="1400" class="w-full mt-1 p-2 border rounded-lg" />
              </div>
              <div>
                <label class="font-semibold text-gray-700">Ukuran Tangki (L)</label>
                <input v-model.number="tankCapacityL" type="number" placeholder="16" class="w-full mt-1 p-2 border rounded-lg" />
              </div>
              <div>
                <label class="font-semibold text-gray-700">Vol Semprot/Ha (L)</label>
                <input v-model.number="sprayVolumePerHaL" type="number" placeholder="400" class="w-full mt-1 p-2 border rounded-lg" />
              </div>
            </div>

            <div class="p-3 bg-agri-50 rounded-xl border border-agri-200 text-xs space-y-1.5">
              <div class="flex justify-between font-semibold text-agri-900">
                <span>Dosis per Tangki Semprot:</span>
                <span class="text-sm font-bold text-agri-700">{{ agrimixResult.dosePerTank }} ml/g</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Estimasi Total Tangki:</span>
                <span>{{ agrimixResult.totalTanks }} Tangki</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Total Obat yang Dibutuhkan:</span>
                <span>{{ agrimixResult.totalDoseNeeded }} ml/g</span>
              </div>
            </div>
          </div>

          <!-- Matriks Kompatibilitas Obat -->
          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <h3 class="font-bold text-gray-800 text-sm">⚠️ Cek Kompatibilitas Campuran 2 Obat</h3>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <input v-model="ingredientA" placeholder="Bahan Aktif A (misal: Mankozeb)" class="p-2 border rounded-lg" />
              <input v-model="ingredientB" placeholder="Bahan Aktif B (misal: Abamektin)" class="p-2 border rounded-lg" />
            </div>

            <div v-if="compatibilityResult" class="p-3 rounded-lg text-xs" :class="compatBgClass">
              <div class="font-bold text-sm mb-1">Status: {{ compatibilityResult.status }}</div>
              <p>{{ compatibilityResult.note }}</p>
            </div>
          </div>
        </div>

        <!-- Segment 2: Populasi & Bibit -->
        <div v-else-if="selectedSegment === 'population'" class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
          <h3 class="font-bold text-agri-800 text-sm">🌱 Kalkulator Populasi & Kebutuhan Bibit</h3>
          <div class="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label class="font-semibold text-gray-700">Luas Lahan (m²)</label>
              <input v-model.number="popAreaM2" type="number" placeholder="1000" class="w-full mt-1 p-2 border rounded-lg" />
            </div>
            <div>
              <label class="font-semibold text-gray-700">Jarak Baris (Meter)</label>
              <input v-model.number="rowSpacing" type="number" step="0.1" placeholder="0.5" class="w-full mt-1 p-2 border rounded-lg" />
            </div>
            <div>
              <label class="font-semibold text-gray-700">Jarak Tanam (Meter)</label>
              <input v-model.number="plantSpacing" type="number" step="0.1" placeholder="0.2" class="w-full mt-1 p-2 border rounded-lg" />
            </div>
            <div>
              <label class="font-semibold text-gray-700">Benih per Lubang</label>
              <input v-model.number="seedsPerHole" type="number" placeholder="1" class="w-full mt-1 p-2 border rounded-lg" />
            </div>
          </div>

          <div class="p-3 bg-agri-50 rounded-xl border border-agri-200 text-xs space-y-1.5">
            <div class="flex justify-between font-semibold text-agri-900">
              <span>Estimasi Populasi Tanaman:</span>
              <span class="text-sm font-bold text-agri-700">{{ popResult.population.toLocaleString('id-ID') }} Batang</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Kebutuhan Benih Utama:</span>
              <span>{{ popResult.rawSeeds.toLocaleString('id-ID') }} Benih</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Cadangan Penyulaman (10%):</span>
              <span>{{ popResult.reserveSeeds.toLocaleString('id-ID') }} Benih</span>
            </div>
            <div class="flex justify-between font-bold text-agri-800 border-t pt-1">
              <span>Total Kebutuhan Benih:</span>
              <span>{{ popResult.totalSeedsNeeded.toLocaleString('id-ID') }} Benih</span>
            </div>
          </div>
        </div>

        <!-- Segment 3: Kalender Tanam & WTH Notifikasi -->
        <div v-else class="space-y-4">
          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <h3 class="font-bold text-agri-800 text-sm">📅 Smart Crop Calendar & WTH</h3>
            <p class="text-xs text-gray-500">Hitung & simpan otomatis Waktu Henti Hama (WTH) penyemprotan obat dengan notifikasi lokal.</p>
            
            <div class="space-y-2 text-xs">
              <div>
                <label class="font-semibold text-gray-700">Nama Tanaman</label>
                <input v-model="cropName" placeholder="Padi Inpari 32 / Cabai Rawit" class="w-full mt-1 p-2 border rounded-lg" />
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="font-semibold text-gray-700">Tanggal Tanam</label>
                  <input v-model="plantDate" type="date" class="w-full mt-1 p-2 border rounded-lg" />
                </div>
                <div>
                  <label class="font-semibold text-gray-700">Hari WTH Obat (Hari)</label>
                  <input v-model.number="wthDays" type="number" placeholder="14" class="w-full mt-1 p-2 border rounded-lg" />
                </div>
              </div>
            </div>

            <button @click="saveSchedule" class="w-full py-2 bg-agri-600 text-white rounded-lg font-bold text-xs shadow-sm hover:bg-agri-700">
              Simpan Jadwal Tanam & Set Notifikasi WTH
            </button>
          </div>

          <!-- List Jadwal Tanam dari IndexedDB -->
          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <h4 class="font-bold text-gray-800 text-xs">📋 Daftar Jadwal Tanam Aktif</h4>
            <div v-if="scheduleList.length > 0" class="space-y-2">
              <div v-for="item in scheduleList" :key="item.id" class="p-2.5 bg-agri-50 rounded-lg border border-agri-200 flex justify-between items-center text-xs">
                <div>
                  <div class="font-bold text-agri-900">{{ item.crop_name }}</div>
                  <div class="text-gray-600">Tanam: {{ item.plant_date }} | WTH: {{ item.wth_days }} Hari</div>
                </div>
                <button @click="removeSchedule(item.id)" class="text-red-600 font-bold px-2 py-1 bg-white rounded border border-red-200 hover:bg-red-50">
                  Hapus
                </button>
              </div>
            </div>
            <div v-else class="text-xs text-gray-400 text-center py-2">Belum ada jadwal tanam tersimpan.</div>
          </div>
        </div>

      </div>
    </ion-content>
    <AppTabBar />
  </ion-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { IonPage, IonContent, IonSegment, IonSegmentButton, IonLabel } from '@ionic/vue';
import AppHeader from '@/components/AppHeader.vue';
import AppTabBar from '@/components/AppTabBar.vue';
import { calculateTankDose, calculatePlantPopulation, checkChemicalCompatibility } from '@/utils/calculators/agriMixCalc';
import { addCropSchedule, getAllCropSchedules, deleteCropSchedule } from '@/services/db';
import { scheduleNotification } from '@/services/notificationService';

const selectedSegment = ref('agrimix');

// AgriMix State
const dosePerHa = ref(1000);
const areaM2 = ref(1400);
const tankCapacityL = ref(16);
const sprayVolumePerHaL = ref(400);

const agrimixResult = computed(() => {
  return calculateTankDose(dosePerHa.value || 0, areaM2.value || 0, tankCapacityL.value || 16, sprayVolumePerHaL.value || 400);
});

// Compatibility State
const ingredientA = ref('Mankozeb');
const ingredientB = ref('Abamektin');

const compatibilityResult = computed(() => {
  return checkChemicalCompatibility(ingredientA.value, ingredientB.value);
});

const compatBgClass = computed(() => {
  if (compatibilityResult.value.status === 'SAFE') return 'bg-green-50 border border-green-200 text-green-800';
  if (compatibilityResult.value.status === 'DANGER') return 'bg-red-50 border border-red-200 text-red-800';
  return 'bg-amber-50 border border-amber-200 text-amber-800';
});

// Population State
const popAreaM2 = ref(1000);
const rowSpacing = ref(0.5);
const plantSpacing = ref(0.2);
const seedsPerHole = ref(1);

const popResult = computed(() => {
  return calculatePlantPopulation(popAreaM2.value || 0, rowSpacing.value || 0, plantSpacing.value || 0, seedsPerHole.value || 1);
});

// Calendar & IndexedDB State
const cropName = ref('Padi Inpari 32');
const plantDate = ref(new Date().toISOString().substring(0, 10));
const wthDays = ref(14);
const scheduleList = ref([]);

async function loadSchedules() {
  scheduleList.value = await getAllCropSchedules();
}

async function saveSchedule() {
  const newId = await addCropSchedule({
    crop_name: cropName.value,
    plant_date: plantDate.value,
    wth_days: wthDays.value
  });

  // Schedule Local Notification for WTH
  await scheduleNotification({
    id: newId,
    title: `⚠️ Pengingat WTH ${cropName.value}`,
    body: `Masa Waktu Henti Hama (WTH) ${wthDays.value} hari telah selesai. Tanaman siap dipanen dengan aman!`,
    scheduleDate: new Date(Date.now() + 10000) // Trigger in 10s for demonstration
  });

  await loadSchedules();
}

async function removeSchedule(id) {
  await deleteCropSchedule(id);
  await loadSchedules();
}

onMounted(() => {
  loadSchedules();
});
</script>
