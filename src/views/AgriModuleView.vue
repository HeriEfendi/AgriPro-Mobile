<template>
  <ion-page>
    <AppHeader />
    <ion-content class="bg-slate-50/50">
      <div class="max-w-2xl mx-auto px-4 py-4 space-y-5 page-content">
        
        <!-- Ionic Segment Sub-Navigation (Modern Pill) -->
        <ion-segment v-model="selectedSegment" @ionChange="triggerHapticImpact()" class="shadow-soft">
          <ion-segment-button value="agrimix">
            <ion-label class="text-xs font-bold">AgriMix Tangki</ion-label>
          </ion-segment-button>
          <ion-segment-button value="population">
            <ion-label class="text-xs font-bold">Populasi Bibit</ion-label>
          </ion-segment-button>
          <ion-segment-button value="calendar">
            <ion-label class="text-xs font-bold">Jadwal Tanam</ion-label>
          </ion-segment-button>
        </ion-segment>

        <!-- Segment 1: AgriMix Tangki Semprot -->
        <div v-if="selectedSegment === 'agrimix'" class="space-y-4">
          <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-card space-y-4">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
                🧪
              </div>
              <div>
                <h3 class="font-bold text-slate-900 text-sm">Kalkulator Racik Tangki Semprot</h3>
                <p class="text-[11px] text-slate-400">Hitung dosis obat per tangki dan total kebutuhan</p>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label class="label-field">Dosis per Ha (ml/g)</label>
                <input v-model.number="dosePerHa" type="number" placeholder="1000" class="input-field" />
              </div>
              <div>
                <label class="label-field">Luas Lahan (m²)</label>
                <input v-model.number="areaM2" type="number" placeholder="1400" class="input-field" />
              </div>
              <div>
                <label class="label-field">Kapasitas Tangki (L)</label>
                <input v-model.number="tankCapacityL" type="number" placeholder="16" class="input-field" />
              </div>
              <div>
                <label class="label-field">Vol Semprot/Ha (L)</label>
                <input v-model.number="sprayVolumePerHaL" type="number" placeholder="400" class="input-field" />
              </div>
            </div>

            <!-- Result Box -->
            <div class="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-100/90 text-xs space-y-2">
              <div class="flex justify-between items-center text-emerald-950 font-bold border-b border-emerald-100 pb-2">
                <span>Dosis per Tangki Semprot:</span>
                <span class="text-base font-extrabold text-emerald-700">{{ agrimixResult.dosePerTank }} ml/g</span>
              </div>
              <div class="flex justify-between text-slate-600">
                <span>Estimasi Total Tangki:</span>
                <span class="font-bold text-slate-800">{{ agrimixResult.totalTanks }} Tangki</span>
              </div>
              <div class="flex justify-between text-slate-600">
                <span>Total Obat yang Dibutuhkan:</span>
                <span class="font-bold text-slate-800">{{ agrimixResult.totalDoseNeeded }} ml/g</span>
              </div>
            </div>
          </div>

          <!-- Matriks Kompatibilitas Obat -->
          <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-card space-y-4">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
                ⚠️
              </div>
              <div>
                <h3 class="font-bold text-slate-900 text-sm">Cek Kompatibilitas Campuran 2 Obat</h3>
                <p class="text-[11px] text-slate-400">Pastikan campuran fungisida & insektisida aman</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2.5 text-xs">
              <div>
                <label class="label-field">Bahan Aktif A</label>
                <input v-model="ingredientA" placeholder="misal: Mankozeb" class="input-field" />
              </div>
              <div>
                <label class="label-field">Bahan Aktif B</label>
                <input v-model="ingredientB" placeholder="misal: Abamektin" class="input-field" />
              </div>
            </div>

            <div v-if="compatibilityResult" class="p-3.5 rounded-2xl text-xs" :class="compatBgClass">
              <div class="font-bold text-xs mb-0.5">Status Campuran: {{ compatibilityResult.status }}</div>
              <p class="text-[11px] leading-relaxed">{{ compatibilityResult.note }}</p>
            </div>
          </div>
        </div>

        <!-- Segment 2: Populasi & Bibit -->
        <div v-else-if="selectedSegment === 'population'" class="bg-white p-5 rounded-3xl border border-slate-100 shadow-card space-y-4">
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
              🌱
            </div>
            <div>
              <h3 class="font-bold text-slate-900 text-sm">Kalkulator Populasi & Kebutuhan Bibit</h3>
              <p class="text-[11px] text-slate-400">Kalkulasi jarak tanam dan cadangan penyulaman 10%</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label class="label-field">Luas Lahan (m²)</label>
              <input v-model.number="popAreaM2" type="number" placeholder="1000" class="input-field" />
            </div>
            <div>
              <label class="label-field">Jarak Baris (Meter)</label>
              <input v-model.number="rowSpacing" type="number" step="0.1" placeholder="0.5" class="input-field" />
            </div>
            <div>
              <label class="label-field">Jarak Tanam (Meter)</label>
              <input v-model.number="plantSpacing" type="number" step="0.1" placeholder="0.2" class="input-field" />
            </div>
            <div>
              <label class="label-field">Benih per Lubang</label>
              <input v-model.number="seedsPerHole" type="number" placeholder="1" class="input-field" />
            </div>
          </div>

          <div class="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-100/90 text-xs space-y-2">
            <div class="flex justify-between items-center text-emerald-950 font-bold border-b border-emerald-100 pb-2">
              <span>Estimasi Populasi Tanaman:</span>
              <span class="text-base font-extrabold text-emerald-700">{{ popResult.population.toLocaleString('id-ID') }} Batang</span>
            </div>
            <div class="flex justify-between text-slate-600">
              <span>Kebutuhan Benih Utama:</span>
              <span class="font-bold text-slate-800">{{ popResult.rawSeeds.toLocaleString('id-ID') }} Benih</span>
            </div>
            <div class="flex justify-between text-slate-600">
              <span>Cadangan Penyulaman (10%):</span>
              <span class="font-bold text-slate-800">{{ popResult.reserveSeeds.toLocaleString('id-ID') }} Benih</span>
            </div>
            <div class="flex justify-between font-bold text-emerald-900 border-t border-emerald-100 pt-2 text-xs">
              <span>Total Kebutuhan Benih:</span>
              <span class="text-emerald-700 font-extrabold">{{ popResult.totalSeedsNeeded.toLocaleString('id-ID') }} Benih</span>
            </div>
          </div>
        </div>

        <!-- Segment 3: Kalender Tanam & WTH Notifikasi -->
        <div v-else class="space-y-4">
          <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-card space-y-4">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center text-xl">
                📅
              </div>
              <div>
                <h3 class="font-bold text-slate-900 text-sm">Smart Crop Calendar & WTH</h3>
                <p class="text-[11px] text-slate-400">Pengingat Waktu Henti Hama (WTH) dengan notifikasi lokal</p>
              </div>
            </div>
            
            <div class="space-y-2.5 text-xs">
              <div>
                <label class="label-field">Nama Komoditas Tanaman</label>
                <input v-model="cropName" placeholder="Padi Inpari 32 / Cabai Rawit" class="input-field" />
              </div>
              <div class="grid grid-cols-2 gap-2.5">
                <div>
                  <label class="label-field">Tanggal Tanam</label>
                  <input v-model="plantDate" type="date" class="input-field" />
                </div>
                <div>
                  <label class="label-field">Hari WTH Obat (Hari)</label>
                  <input v-model.number="wthDays" type="number" placeholder="14" class="input-field" />
                </div>
              </div>
            </div>

            <button @click="saveSchedule" class="btn-brand">
              <span>💾</span> Simpan Jadwal & Pasang Notifikasi WTH
            </button>
          </div>

          <!-- List Jadwal Tanam dari Dexie -->
          <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-card space-y-3">
            <div class="flex justify-between items-center">
              <h4 class="font-bold text-slate-900 text-xs">Daftar Jadwal Tanam Aktif</h4>
              <span class="text-[10px] text-slate-400">{{ scheduleList.length }} Jadwal</span>
            </div>

            <div v-if="scheduleList.length > 0" class="space-y-2">
              <div
                v-for="item in scheduleList"
                :key="item.id"
                class="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex justify-between items-center text-xs"
              >
                <div>
                  <div class="font-bold text-emerald-950 text-sm">{{ item.crop_name }}</div>
                  <div class="text-slate-500 text-[11px] mt-0.5">Tanam: {{ item.plant_date }} • Masa WTH: {{ item.wth_days }} Hari</div>
                </div>
                <button @click="removeSchedule(item.id)" class="btn-danger">
                  Hapus
                </button>
              </div>
            </div>
            <div v-else class="text-xs text-slate-400 text-center py-4">Belum ada jadwal tanam tersimpan.</div>
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

import { calculateTankDose, calculatePlantPopulation, checkChemicalCompatibility } from '@/utils/calculators/agriMixCalc';
import { addCropSchedule, getAllCropSchedules, deleteCropSchedule } from '@/services/db';
import { scheduleNotification } from '@/services/notificationService';
import { triggerHapticImpact, triggerHapticSuccess } from '@/utils/haptics';

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
  if (compatibilityResult.value.status === 'SAFE') return 'bg-emerald-50 border border-emerald-200 text-emerald-900';
  if (compatibilityResult.value.status === 'DANGER') return 'bg-rose-50 border border-rose-200 text-rose-900';
  return 'bg-amber-50 border border-amber-200 text-amber-900';
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
  await triggerHapticSuccess();
  const newId = await addCropSchedule({
    crop_name: cropName.value,
    plant_date: plantDate.value,
    wth_days: wthDays.value
  });

  await scheduleNotification({
    id: newId,
    title: `⚠️ Pengingat WTH ${cropName.value}`,
    body: `Masa Waktu Henti Hama (WTH) ${wthDays.value} hari telah selesai. Tanaman siap dipanen dengan aman!`,
    scheduleDate: new Date(Date.now() + 10000)
  });

  await loadSchedules();
}

async function removeSchedule(id) {
  await triggerHapticImpact();
  await deleteCropSchedule(id);
  await loadSchedules();
}

onMounted(() => {
  loadSchedules();
});
</script>
