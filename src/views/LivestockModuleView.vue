<template>
  <ion-page>
    <AppHeader />
    <ion-content class="bg-slate-50/50">
      <div class="max-w-2xl mx-auto px-4 py-4 space-y-5 page-content">

        <!-- Ionic Segment Navigation (Pill Segment) -->
        <ion-segment v-model="selectedSegment" @ionChange="triggerHapticImpact()" class="shadow-soft">
          <ion-segment-button value="blender">
            <ion-label class="text-xs font-bold">Feed Blender</ion-label>
          </ion-segment-button>
          <ion-segment-button value="breeding">
            <ion-label class="text-xs font-bold">Breeding & IB</ion-label>
          </ion-segment-button>
        </ion-segment>

        <!-- Segment 1: Feed Blender (Pearson Square Formulasi Ransum) -->
        <div v-if="selectedSegment === 'blender'" class="space-y-4">
          <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-card space-y-4">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
                🌾
              </div>
              <div>
                <h3 class="font-bold text-slate-900 text-sm">Formulasi Ransum Pakan (Pearson Square)</h3>
                <p class="text-[11px] text-slate-400">Pencampuran 2 bahan pakan dengan target protein kasar</p>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label class="label-field">Bahan 1 (Rendah CP)</label>
                <input v-model="name1" placeholder="Jagung Halus" class="input-field" />
              </div>
              <div>
                <label class="label-field">Protein Kasar CP 1 (%)</label>
                <input v-model.number="cp1" type="number" min="0" step="0.1" placeholder="9" class="input-field" />
              </div>
              <div>
                <label class="label-field">Bahan 2 (Tinggi CP)</label>
                <input v-model="name2" placeholder="Konsentrat Super" class="input-field" />
              </div>
              <div>
                <label class="label-field">Protein Kasar CP 2 (%)</label>
                <input v-model.number="cp2" type="number" min="0" step="0.1" placeholder="35" class="input-field" />
              </div>
            </div>

            <!-- Feed Presets Helper -->
            <div class="space-y-1.5 pt-1">
              <span class="text-[10px] text-slate-400 block font-medium">Bahan pakan populer (klik untuk mengisi):</span>
              <div class="flex flex-wrap gap-1">
                <button
                  v-for="preset in feedPresets"
                  :key="preset.name"
                  type="button"
                  @click="applyPreset(preset)"
                  class="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-medium transition active:scale-95 cursor-pointer"
                >
                  + {{ preset.name }} ({{ preset.cp }}%)
                </button>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3 text-xs border-t border-slate-100 pt-3">
              <div>
                <label class="label-field">Target CP Campuran (%)</label>
                <input v-model.number="targetCP" type="number" min="0" step="0.1" placeholder="16" class="input-field font-bold text-amber-700" />
              </div>
              <div>
                <label class="label-field">Total Adonan (kg)</label>
                <input v-model.number="totalBatchKg" type="number" min="1" placeholder="100" class="input-field font-bold text-amber-700" />
              </div>
            </div>

            <!-- Result Box -->
            <div v-if="blendResult.isValid" class="p-4 bg-amber-50/70 rounded-2xl border border-amber-100/90 text-xs space-y-2.5">
              <div class="font-bold text-xs text-amber-950 border-b border-amber-100 pb-2 flex justify-between items-center">
                <span>Resep Racikan {{ totalBatchKg }} kg:</span>
                <span class="text-amber-700 font-extrabold">Target CP {{ targetCP }}%</span>
              </div>
              
              <div class="flex justify-between items-center bg-white p-3 rounded-xl border border-amber-100/80 shadow-soft">
                <span class="font-bold text-slate-800">{{ blendResult.ingredient1.name }} (CP {{ blendResult.ingredient1.cp }}%)</span>
                <span class="font-extrabold text-amber-700 text-sm">{{ blendResult.ingredient1.kg }} kg ({{ blendResult.ingredient1.percent }}%)</span>
              </div>

              <div class="flex justify-between items-center bg-white p-3 rounded-xl border border-amber-100/80 shadow-soft">
                <span class="font-bold text-slate-800">{{ blendResult.ingredient2.name }} (CP {{ blendResult.ingredient2.cp }}%)</span>
                <span class="font-extrabold text-amber-700 text-sm">{{ blendResult.ingredient2.kg }} kg ({{ blendResult.ingredient2.percent }}%)</span>
              </div>
            </div>

            <div v-else class="p-4 bg-rose-50 text-rose-800 rounded-2xl border border-rose-100 text-xs font-semibold">
              {{ blendResult.message }}
            </div>
          </div>
        </div>

        <!-- Segment 2: Breeding & Vaccine Calendar -->
        <div v-else class="space-y-4">
          <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-card space-y-4">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
                🐄
              </div>
              <div>
                <h3 class="font-bold text-slate-900 text-sm">Kalender Birahi & Inseminasi Buatan (IB)</h3>
                <p class="text-[11px] text-slate-400">Prediksi siklus birahi H+21 dan perkiraan tanggal lahir</p>
              </div>
            </div>

            <!-- Validation Error Alert -->
            <div v-if="formError" class="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-medium flex items-center gap-2">
              <span>⚠️</span> {{ formError }}
            </div>

            <div class="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label class="label-field">Nomor Tag Ternak</label>
                <input v-model="animalTag" placeholder="Sapi-01 / Kambing-A" class="input-field" />
              </div>
              <div>
                <label class="label-field">Jenis Ternak</label>
                <select v-model="animalType" class="select-field">
                  <option value="sapi">Sapi (~283 Hari Kebuntingan)</option>
                  <option value="kambing">Kambing (~150 Hari Kebuntingan)</option>
                  <option value="domba">Domba (~150 Hari Kebuntingan)</option>
                  <option value="kerbau">Kerbau (~310 Hari Kebuntingan)</option>
                  <option value="kelinci">Kelinci (~31 Hari Kebuntingan)</option>
                </select>
              </div>
              <div class="col-span-2">
                <label class="label-field">Tanggal Inseminasi Buatan (IB)</label>
                <input v-model="ibDate" type="date" class="input-field" />
              </div>
            </div>

            <div class="p-4 bg-amber-50/70 rounded-2xl border border-amber-100/90 text-xs space-y-2">
              <div class="flex justify-between items-center font-bold text-amber-950 border-b border-amber-100 pb-2">
                <span>Estimasi Tanggal Melahirkan:</span>
                <span class="text-base text-amber-700 font-extrabold">{{ expectedBirthDate }}</span>
              </div>
              <div class="flex justify-between text-slate-600">
                <span>Siklus Birahi Berikutnya (Jika IB Gagal):</span>
                <span class="font-semibold text-slate-800">H+21 Hari Dari Tanggal IB</span>
              </div>
            </div>

            <button @click="saveBreedingLog" class="btn-tertiary">
              <span>💾</span> Simpan Jadwal IB & Pasang Notifikasi
            </button>
          </div>

          <!-- History Table from Dexie -->
          <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-card space-y-3">
            <div class="flex justify-between items-center">
              <h4 class="font-bold text-slate-900 text-xs">Riwayat Catatan Kebuntingan</h4>
              <span class="text-[10px] text-slate-400">{{ breedingList.length }} Catatan</span>
            </div>

            <div v-if="breedingList.length > 0" class="space-y-2">
              <div
                v-for="item in breedingList"
                :key="item.id"
                class="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-100 flex justify-between items-center text-xs"
              >
                <div>
                  <div class="font-bold text-amber-950 text-sm">Tag: {{ item.animal_tag }} ({{ item.animal_type.toUpperCase() }})</div>
                  <div class="text-slate-500 text-[11px] mt-0.5">Tanggal IB: {{ item.ib_date }} • Est Lahir: {{ item.expected_birth_date }}</div>
                </div>
                <button @click="removeBreedingLog(item.id)" class="btn-danger">
                  Hapus
                </button>
              </div>
            </div>
            <div v-else class="text-xs text-slate-400 text-center py-4">Belum ada catatan kebuntingan tersimpan.</div>
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

import { calculatePearsonSquare } from '@/utils/calculators/feedBlenderCalc';
import { addBreedingLog, getAllBreedingLogs, deleteBreedingLog } from '@/services/db';
import { scheduleNotification } from '@/services/notificationService';
import { triggerHapticImpact, triggerHapticSuccess } from '@/utils/haptics';

const selectedSegment = ref('blender');

// Pearson Square State
const name1 = ref('Jagung Halus');
const cp1 = ref(9);
const name2 = ref('Konsentrat Super');
const cp2 = ref(35);
const targetCP = ref(16);
const totalBatchKg = ref(100);

const feedPresets = [
  { name: 'Jagung Kuning', cp: 8.5 },
  { name: 'Dedak Padi', cp: 12.0 },
  { name: 'Bungkil Kelapa Sawit (BKS)', cp: 15.0 },
  { name: 'Konsentrat Penggemukan', cp: 16.0 },
  { name: 'Konsentrat Sapi Perah', cp: 18.0 },
  { name: 'Bungkil Kedelai (SBM)', cp: 44.0 },
  { name: 'Tepung Ikan', cp: 55.0 }
];

function applyPreset(preset) {
  triggerHapticImpact();
  if (!name1.value || name1.value === preset.name) {
    name1.value = preset.name;
    cp1.value = preset.cp;
  } else {
    name2.value = preset.name;
    cp2.value = preset.cp;
  }
}

const blendResult = computed(() => {
  return calculatePearsonSquare(
    name1.value || 'Bahan 1',
    cp1.value || 0,
    name2.value || 'Bahan 2',
    cp2.value || 0,
    targetCP.value || 0,
    totalBatchKg.value || 100
  );
});

// Breeding State & Dexie CRUD
const animalTag = ref('Sapi-01');
const animalType = ref('sapi');
const ibDate = ref(new Date().toISOString().substring(0, 10));
const breedingList = ref([]);
const formError = ref('');

const gestationMap = {
  sapi: 283,
  kambing: 150,
  domba: 150,
  kerbau: 310,
  kelinci: 31
};

const expectedBirthDate = computed(() => {
  if (!ibDate.value) return '-';
  const parts = ibDate.value.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return '-';
  const [y, m, d] = parts;
  const date = new Date(y, m - 1, d);
  const gestationDays = gestationMap[animalType.value] || 283;
  date.setDate(date.getDate() + gestationDays);
  const resY = date.getFullYear();
  const resM = String(date.getMonth() + 1).padStart(2, '0');
  const resD = String(date.getDate()).padStart(2, '0');
  return `${resY}-${resM}-${resD}`;
});

async function loadBreedingLogs() {
  breedingList.value = await getAllBreedingLogs();
}

async function saveBreedingLog() {
  if (!animalTag.value || !animalTag.value.trim()) {
    formError.value = 'Nomor tag ternak wajib diisi.';
    triggerHapticImpact();
    return;
  }
  if (!ibDate.value) {
    formError.value = 'Tanggal Inseminasi Buatan (IB) wajib dipilih.';
    triggerHapticImpact();
    return;
  }
  formError.value = '';

  await triggerHapticSuccess();
  const newId = await addBreedingLog({
    animal_tag: animalTag.value.trim(),
    animal_type: animalType.value,
    ib_date: ibDate.value,
    expected_birth_date: expectedBirthDate.value,
    vaccine_status: 'Lengkap'
  });

  // Schedule notification for accurate birth date
  const targetDate = new Date(expectedBirthDate.value);
  await scheduleNotification({
    id: newId,
    title: `🐄 Pengingat Perkiraan Lahir ${animalTag.value}`,
    body: `Ternak ${animalTag.value} diperkirakan melahirkan pada ${expectedBirthDate.value}. Siapkan kandang kelahiran!`,
    scheduleDate: targetDate
  });

  await loadBreedingLogs();
}

async function removeBreedingLog(id) {
  await triggerHapticImpact();
  await deleteBreedingLog(id);
  await loadBreedingLogs();
}

onMounted(() => {
  loadBreedingLogs();
});
</script>
