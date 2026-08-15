<template>
  <ion-page>
    <AppHeader />
    <ion-content class="ion-padding bg-gray-50">
      <div class="max-w-2xl mx-auto space-y-4">

        <!-- Ionic Segment Navigation -->
        <ion-segment v-model="selectedSegment" color="tertiary" class="bg-white rounded-xl shadow-sm border p-1">
          <ion-segment-button value="blender">
            <ion-label class="text-xs font-bold">Feed Blender</ion-label>
          </ion-segment-button>
          <ion-segment-button value="breeding">
            <ion-label class="text-xs font-bold">Breeding & Vaksin</ion-label>
          </ion-segment-button>
        </ion-segment>

        <!-- Segment 1: Feed Blender (Pearson Square Formulasi Ransum) -->
        <div v-if="selectedSegment === 'blender'" class="space-y-4">
          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <h3 class="font-bold text-livestock-800 text-sm">🌾 Formulasi Ransum Pakan (Pearson Square)</h3>
            
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label class="font-semibold text-gray-700">Bahan 1 (Rendah CP)</label>
                <input v-model="name1" placeholder="Jagung Halus" class="w-full mt-1 p-2 border rounded-lg" />
              </div>
              <div>
                <label class="font-semibold text-gray-700">Protein Kasar CP 1 (%)</label>
                <input v-model.number="cp1" type="number" step="0.1" placeholder="9" class="w-full mt-1 p-2 border rounded-lg" />
              </div>
              <div>
                <label class="font-semibold text-gray-700">Bahan 2 (Tinggi CP)</label>
                <input v-model="name2" placeholder="Konsentrat Super" class="w-full mt-1 p-2 border rounded-lg" />
              </div>
              <div>
                <label class="font-semibold text-gray-700">Protein Kasar CP 2 (%)</label>
                <input v-model.number="cp2" type="number" step="0.1" placeholder="35" class="w-full mt-1 p-2 border rounded-lg" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2 text-xs border-t pt-2">
              <div>
                <label class="font-semibold text-gray-700">Target CP Campuran (%)</label>
                <input v-model.number="targetCP" type="number" step="0.1" placeholder="16" class="w-full mt-1 p-2 border rounded-lg font-bold text-livestock-700" />
              </div>
              <div>
                <label class="font-semibold text-gray-700">Total Adonan (kg)</label>
                <input v-model.number="totalBatchKg" type="number" placeholder="100" class="w-full mt-1 p-2 border rounded-lg font-bold text-livestock-700" />
              </div>
            </div>

            <div v-if="blendResult.isValid" class="p-3 bg-livestock-50 rounded-xl border border-livestock-200 text-xs space-y-2">
              <div class="font-bold text-sm text-livestock-900 border-b border-livestock-200 pb-1">
                Resep Racikan {{ totalBatchKg }} kg (Target CP {{ targetCP }}%):
              </div>
              
              <div class="flex justify-between items-center bg-white p-2 rounded-lg border border-livestock-100">
                <span class="font-bold text-gray-800">{{ blendResult.ingredient1.name }} (CP {{ blendResult.ingredient1.cp }}%)</span>
                <span class="font-bold text-livestock-700 text-sm">{{ blendResult.ingredient1.kg }} kg ({{ blendResult.ingredient1.percent }}%)</span>
              </div>

              <div class="flex justify-between items-center bg-white p-2 rounded-lg border border-livestock-100">
                <span class="font-bold text-gray-800">{{ blendResult.ingredient2.name }} (CP {{ blendResult.ingredient2.cp }}%)</span>
                <span class="font-bold text-livestock-700 text-sm">{{ blendResult.ingredient2.kg }} kg ({{ blendResult.ingredient2.percent }}%)</span>
              </div>
            </div>

            <div v-else class="p-3 bg-red-50 text-red-800 rounded-xl border border-red-200 text-xs font-semibold">
              {{ blendResult.message }}
            </div>
          </div>
        </div>

        <!-- Segment 2: Breeding & Vaccine Calendar -->
        <div v-else class="space-y-4">
          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <h3 class="font-bold text-livestock-800 text-sm">🐄 Kalender Birahi & Inseminasi Buatan (IB)</h3>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label class="font-semibold text-gray-700">Nomor Tag Ternak</label>
                <input v-model="animalTag" placeholder="Sapi-01 / Kambing-A" class="w-full mt-1 p-2 border rounded-lg" />
              </div>
              <div>
                <label class="font-semibold text-gray-700">Jenis Ternak</label>
                <select v-model="animalType" class="w-full mt-1 p-2 border rounded-lg bg-white">
                  <option value="sapi">Sapi (Kebuntingan ~283 Hari)</option>
                  <option value="kambing">Kambing (Kebuntingan ~150 Hari)</option>
                </select>
              </div>
              <div class="col-span-2">
                <label class="font-semibold text-gray-700">Tanggal Inseminasi (IB)</label>
                <input v-model="ibDate" type="date" class="w-full mt-1 p-2 border rounded-lg" />
              </div>
            </div>

            <div class="p-3 bg-livestock-50 rounded-xl border border-livestock-200 text-xs space-y-1.5">
              <div class="flex justify-between font-bold text-livestock-900">
                <span>Estimasi Tanggal Melahirkan:</span>
                <span class="text-sm text-livestock-700">{{ expectedBirthDate }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Siklus Birahi Berikutnya (Jika IB Gagal):</span>
                <span>H+21 Hari Dari Tanggal IB</span>
              </div>
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
import { calculatePearsonSquare } from '@/utils/calculators/feedBlenderCalc';

const selectedSegment = ref('blender');

// Pearson Square State
const name1 = ref('Jagung Halus');
const cp1 = ref(9);
const name2 = ref('Konsentrat Super');
const cp2 = ref(35);
const targetCP = ref(16);
const totalBatchKg = ref(100);

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

// Breeding State
const animalTag = ref('Sapi-01');
const animalType = ref('sapi');
const ibDate = ref(new Date().toISOString().substring(0, 10));

const expectedBirthDate = computed(() => {
  if (!ibDate.value) return '-';
  const date = new Date(ibDate.value);
  const gestationDays = animalType.value === 'sapi' ? 283 : 150;
  date.setDate(date.getDate() + gestationDays);
  return date.toISOString().substring(0, 10);
});
</script>
