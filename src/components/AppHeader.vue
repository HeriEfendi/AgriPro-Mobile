<template>
  <ion-header>
    <ion-toolbar color="primary">
      <ion-title slot="start" class="font-bold tracking-wide">
        AgriPro <span class="text-xs font-normal opacity-80">Mobile</span>
      </ion-title>

      <ion-buttons slot="end">
        <!-- Button Konverter Satuan -->
        <ion-button @click="showConverterModal = true" class="text-xs">
          <span class="mr-1">🔄</span> Konversi
        </ion-button>

        <!-- Dropdown Profile Switcher -->
        <div class="relative ml-2 mr-2">
          <select
            v-model="profileStore.activeRole"
            class="bg-agri-800 text-white text-xs font-semibold py-1.5 px-2.5 rounded-lg border border-agri-600 outline-none cursor-pointer"
          >
            <option value="tani">🌾 Tani</option>
            <option value="tambak">🦐 Tambak</option>
            <option value="ternak">🐄 Ternak</option>
          </select>
        </div>
      </ion-buttons>
    </ion-toolbar>

    <!-- Global Unit Converter Modal -->
    <UnitConverterModal
      :is-open="showConverterModal"
      @close="showConverterModal = false"
    />
  </ion-header>
</template>

<script setup>
import { ref } from 'vue';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton } from '@ionic/vue';
import { useProfileStore } from '@/stores/useProfileStore';
import UnitConverterModal from './UnitConverterModal.vue';

const profileStore = useProfileStore();
const showConverterModal = ref(false);
</script>
