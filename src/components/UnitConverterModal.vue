<template>
  <ion-modal :is-open="isOpen" @didDismiss="closeModal">
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Konverter Satuan Lapangan</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeModal">Tutup</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="space-y-6 max-w-lg mx-auto">
        <!-- Konversi Luas Lahan -->
        <div class="p-4 bg-agri-50 rounded-xl border border-agri-100 shadow-sm">
          <h3 class="font-bold text-agri-900 text-sm flex items-center gap-2">
            🌱 Luas Lahan (Ubin / Bahu $\rightarrow$ m²)
          </h3>
          <div class="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label class="text-xs text-gray-600 font-medium">Ubin</label>
              <input
                type="number"
                v-model="ubinInput"
                @input="onUbinChange"
                placeholder="Jumlah Ubin"
                class="w-full mt-1 p-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-agri-500 outline-none"
              />
            </div>
            <div>
              <label class="text-xs text-gray-600 font-medium">Bahu</label>
              <input
                type="number"
                v-model="bahuInput"
                @input="onBahuChange"
                placeholder="Jumlah Bahu"
                class="w-full mt-1 p-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-agri-500 outline-none"
              />
            </div>
          </div>
          <div class="mt-3 p-2 bg-white rounded-lg border border-agri-200 text-xs text-agri-800 font-semibold flex justify-between">
            <span>Hasil (m²):</span>
            <span class="text-sm font-bold text-agri-700">{{ m2Result }} m² ({{ haResult }} Ha)</span>
          </div>
        </div>

        <!-- Konversi Takaran Obat / Cairan -->
        <div class="p-4 bg-aqua-50 rounded-xl border border-aqua-100 shadow-sm">
          <h3 class="font-bold text-aqua-900 text-sm flex items-center gap-2">
            💧 Cairan & Takaran (Gembor / Sendok $\rightarrow$ ml)
          </h3>
          <div class="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label class="text-xs text-gray-600 font-medium">Gembor (~10 Liter)</label>
              <input
                type="number"
                v-model="gemborInput"
                @input="onGemborChange"
                placeholder="Jumlah Gembor"
                class="w-full mt-1 p-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-aqua-500 outline-none"
              />
            </div>
            <div>
              <label class="text-xs text-gray-600 font-medium">Sendok Makan (~15 ml)</label>
              <input
                type="number"
                v-model="sendokInput"
                @input="onSendokChange"
                placeholder="Jumlah Sendok"
                class="w-full mt-1 p-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-aqua-500 outline-none"
              />
            </div>
          </div>
          <div class="mt-3 p-2 bg-white rounded-lg border border-aqua-200 text-xs text-aqua-800 font-semibold flex justify-between">
            <span>Hasil (ml / Liter):</span>
            <span class="text-sm font-bold text-aqua-700">{{ mlResult }} ml ({{ literResult }} Liter)</span>
          </div>
        </div>

        <!-- Konversi Konsentrasi Air (ppm) -->
        <div class="p-4 bg-livestock-50 rounded-xl border border-livestock-100 shadow-sm">
          <h3 class="font-bold text-livestock-900 text-sm flex items-center gap-2">
            🧪 Konsentrasi Air (ppm $\rightarrow$ g/m³)
          </h3>
          <div class="mt-3">
            <label class="text-xs text-gray-600 font-medium">Kadar ppm (part per million)</label>
            <input
              type="number"
              v-model="ppmInput"
              placeholder="Masukkan ppm"
              class="w-full mt-1 p-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-livestock-500 outline-none"
            />
          </div>
          <div class="mt-3 p-2 bg-white rounded-lg border border-livestock-200 text-xs text-livestock-800 font-semibold flex justify-between">
            <span>Hasil Dosis (g/m³ air kolam):</span>
            <span class="text-sm font-bold text-livestock-700">{{ ppmResult }} g/m³</span>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup>
import { ref, computed } from 'vue';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent } from '@ionic/vue';
import { ubinToM2, bahuToM2, gemborToMl, sendokToMl, ppmToGramPerM3 } from '@/utils/calculators/unitConverter';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const ubinInput = ref('');
const bahuInput = ref('');
const m2Val = ref(0);

const gemborInput = ref('');
const sendokInput = ref('');
const mlVal = ref(0);

const ppmInput = ref('');

function closeModal() {
  emit('close');
}

function onUbinChange() {
  bahuInput.value = '';
  m2Val.value = ubinToM2(ubinInput.value);
}

function onBahuChange() {
  ubinInput.value = '';
  m2Val.value = bahuToM2(bahuInput.value);
}

function onGemborChange() {
  sendokInput.value = '';
  mlVal.value = gemborToMl(gemborInput.value);
}

function onSendokChange() {
  gemborInput.value = '';
  mlVal.value = sendokToMl(sendokInput.value);
}

const m2Result = computed(() => Number(m2Val.value.toFixed(2)));
const haResult = computed(() => Number((m2Val.value / 10000).toFixed(4)));

const mlResult = computed(() => Number(mlVal.value.toFixed(0)));
const literResult = computed(() => Number((mlVal.value / 1000).toFixed(2)));

const ppmResult = computed(() => ppmToGramPerM3(ppmInput.value));
</script>
