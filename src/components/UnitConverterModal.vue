<template>
  <ion-modal :is-open="isOpen" @didDismiss="closeModal" class="converter-modal">
    <div class="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg mx-auto flex flex-col max-h-[90vh] shadow-elevated border border-slate-100 overflow-hidden">
      <!-- Modal Header -->
      <div class="px-5 pt-5 pb-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h2 class="font-bold text-slate-800 text-base flex items-center gap-2">
            <span class="text-xl">⚖️</span> Konverter Satuan Lapangan
          </h2>
          <p class="text-[11px] text-slate-500 mt-0.5">Konversi cepat satuan tradisi & dosis standar offline</p>
        </div>
        <button
          @click="closeModal"
          class="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition active:scale-95 text-xs font-bold"
        >
          ✕
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-5 overflow-y-auto space-y-4 text-xs">
        
        <!-- 1. Konversi Luas Lahan -->
        <div class="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100/80 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-emerald-900 flex items-center gap-1.5">
              <span>🌾</span> Luas Lahan Tradisi (Ubin / Bahu)
            </h3>
            <span class="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Agronomi</span>
          </div>

          <div class="grid grid-cols-2 gap-2.5">
            <div>
              <label class="label-field text-emerald-800">Ubin (~14 m²)</label>
              <input
                type="number"
                v-model="ubinInput"
                @input="onUbinChange"
                placeholder="0"
                class="input-field border-emerald-200 focus:border-emerald-500"
              />
            </div>
            <div>
              <label class="label-field text-emerald-800">Bahu (~7.000 m²)</label>
              <input
                type="number"
                v-model="bahuInput"
                @input="onBahuChange"
                placeholder="0"
                class="input-field border-emerald-200 focus:border-emerald-500"
              />
            </div>
          </div>

          <div class="p-3 bg-white rounded-xl border border-emerald-100 flex items-center justify-between shadow-soft">
            <span class="text-slate-500 font-medium">Hasil Konversi:</span>
            <div class="text-right">
              <span class="font-bold text-emerald-700 text-sm block">{{ m2Result }} m²</span>
              <span class="text-[10px] text-slate-400">setara {{ haResult }} Hektar</span>
            </div>
          </div>
        </div>

        <!-- 2. Konversi Takaran Obat / Gembor -->
        <div class="p-4 bg-sky-50/60 rounded-2xl border border-sky-100/80 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-sky-900 flex items-center gap-1.5">
              <span>💧</span> Takaran Cairan (Gembor & Sendok)
            </h3>
            <span class="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full">Akuakultur/Tani</span>
          </div>

          <div class="grid grid-cols-2 gap-2.5">
            <div>
              <label class="label-field text-sky-800">Gembor (~10 L)</label>
              <input
                type="number"
                v-model="gemborInput"
                @input="onGemborChange"
                placeholder="0"
                class="input-field border-sky-200 focus:border-sky-500"
              />
            </div>
            <div>
              <label class="label-field text-sky-800">Sendok Makan (~15 ml)</label>
              <input
                type="number"
                v-model="sendokInput"
                @input="onSendokChange"
                placeholder="0"
                class="input-field border-sky-200 focus:border-sky-500"
              />
            </div>
          </div>

          <div class="p-3 bg-white rounded-xl border border-sky-100 flex items-center justify-between shadow-soft">
            <span class="text-slate-500 font-medium">Hasil Volume:</span>
            <div class="text-right">
              <span class="font-bold text-sky-700 text-sm block">{{ mlResult }} ml</span>
              <span class="text-[10px] text-slate-400">setara {{ literResult }} Liter</span>
            </div>
          </div>
        </div>

        <!-- 3. Konversi Konsentrasi ppm -->
        <div class="p-4 bg-amber-50/60 rounded-2xl border border-amber-100/80 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-amber-900 flex items-center gap-1.5">
              <span>🧪</span> Konsentrasi Dosis (ppm)
            </h3>
            <span class="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Kolam & Ransum</span>
          </div>

          <div>
            <label class="label-field text-amber-800">Kadar ppm (mg/L atau g/m³)</label>
            <input
              type="number"
              v-model="ppmInput"
              placeholder="Masukkan angka ppm"
              class="input-field border-amber-200 focus:border-amber-500"
            />
          </div>

          <div class="p-3 bg-white rounded-xl border border-amber-100 flex items-center justify-between shadow-soft">
            <span class="text-slate-500 font-medium">Dosis Kolam (per m³):</span>
            <span class="font-bold text-amber-700 text-sm">{{ ppmResult }} gram / m³</span>
          </div>
        </div>

      </div>

      <!-- Modal Footer Action -->
      <div class="p-4 border-t border-slate-100 bg-white">
        <button @click="closeModal" class="btn-brand">
          Tutup Konverter
        </button>
      </div>
    </div>
  </ion-modal>
</template>

<script setup>
import { ref, computed } from 'vue';
import { IonModal } from '@ionic/vue';
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
