<template>
  <div class="bg-white/95 backdrop-blur-md border-b border-slate-100/80 sticky top-0 z-50 px-4 pt-3 pb-3">
    <div class="max-w-2xl mx-auto flex items-center justify-between">
      <!-- User Profile & Greeting -->
      <div class="flex items-center gap-3">
        <div class="relative">
          <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-600 to-brand-400 p-[2px] shadow-sm">
            <div class="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
              <span v-if="profileStore.activeRole === 'tani'" class="text-xl">👨‍🌾</span>
              <span v-else-if="profileStore.activeRole === 'tambak'" class="text-xl">🧑‍🏭</span>
              <span v-else class="text-xl">🤠</span>
            </div>
          </div>
          <div class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
        </div>

        <div>
          <p class="text-[11px] font-medium text-slate-400 leading-none">Selamat Datang,</p>
          <div class="flex items-center gap-1.5 mt-0.5">
            <h1 class="text-sm font-bold text-slate-800 leading-none tracking-tight">
              {{ profileStore.namaLahan || 'Lahan Tani Unggul' }}
            </h1>
          </div>
        </div>
      </div>

      <!-- Action Buttons & Role Switcher -->
      <div class="flex items-center gap-2">
        <!-- Quick Unit Converter Trigger -->
        <button
          @click="showConverterModal = true"
          title="Konverter Satuan"
          class="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 text-slate-600 hover:text-brand-600 hover:bg-brand-50 hover:border-brand-100 flex items-center justify-center transition active:scale-95 shadow-soft"
        >
          <ion-icon :icon="swapHorizontalOutline" class="text-lg" />
        </button>

        <!-- Role Switcher Dropdown Pill -->
        <div class="relative">
          <select
            v-model="profileStore.activeRole"
            class="appearance-none bg-brand-50 border border-brand-200/80 text-brand-800 text-xs font-bold py-1.5 pl-3 pr-7 rounded-full outline-none cursor-pointer shadow-soft transition hover:bg-brand-100/60"
          >
            <option value="tani">🌾 Tani</option>
            <option value="tambak">🦐 Tambak</option>
            <option value="ternak">🐄 Ternak</option>
          </select>
          <div class="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-brand-600">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Global Unit Converter Modal -->
    <UnitConverterModal
      :is-open="showConverterModal"
      @close="showConverterModal = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { IonIcon } from '@ionic/vue';
import { swapHorizontalOutline } from 'ionicons/icons';
import { useProfileStore } from '@/stores/useProfileStore';
import UnitConverterModal from './UnitConverterModal.vue';

const profileStore = useProfileStore();
const showConverterModal = ref(false);
</script>

