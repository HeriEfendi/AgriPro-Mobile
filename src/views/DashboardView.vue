<template>
  <ion-page>
    <AppHeader />
    <ion-content class="ion-padding bg-gray-50">
      <div class="max-w-2xl mx-auto space-y-4 page-content">

        <!-- Active Profile Banner -->
        <div class="p-4 rounded-2xl shadow-sm border" :class="bannerBgClass">
          <div class="flex justify-between items-center">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/70 text-gray-800">
                Mode {{ profileStore.activeRole }}
              </span>
              <h2 class="text-xl font-bold mt-1 text-gray-900">{{ profileStore.namaLahan }}</h2>
              <p class="text-xs text-gray-600">Aplikasi Super-App 100% Offline-First (No Internet Needed)</p>
            </div>
            <div class="text-3xl">
              <span v-if="profileStore.activeRole === 'tani'">🌾</span>
              <span v-else-if="profileStore.activeRole === 'tambak'">🦐</span>
              <span v-else>🐄</span>
            </div>
          </div>
        </div>

        <!-- Quick Action Shortcut Cards -->
        <div class="grid grid-cols-2 gap-3">
          <router-link to="/agri" class="p-3 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
            <div class="text-agri-600 text-xl font-bold">🌾 AgriMix</div>
            <p class="text-xs text-gray-500 mt-1">Kalkulator Tangki Semprot & Matriks Obat</p>
          </router-link>

          <router-link to="/aqua" class="p-3 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
            <div class="text-aqua-600 text-xl font-bold">🦐 Log Air & FCR</div>
            <p class="text-xs text-gray-500 mt-1">Pantau pH/Suhu & Kalkulasi FCR Tambak</p>
          </router-link>

          <router-link to="/livestock" class="p-3 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
            <div class="text-livestock-600 text-xl font-bold">🐄 Feed Blender</div>
            <p class="text-xs text-gray-500 mt-1">Pearson Square Formulasi Ransum Pakan</p>
          </router-link>

          <router-link to="/library" class="p-3 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
            <div class="text-purple-600 text-xl font-bold">📚 Pustaka Taktis</div>
            <p class="text-xs text-gray-500 mt-1">Diagnosa Gejala Hama & Penyakit Offline</p>
          </router-link>
        </div>

        <!-- Quick Summary Widget based on role -->
        <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <h3 class="font-bold text-gray-800 text-sm mb-3">📌 Ringkasan Cepat Lapangan</h3>
          
          <div v-if="profileStore.activeRole === 'tani'" class="space-y-2 text-xs text-gray-700">
            <div class="p-2.5 bg-agri-50 rounded-lg flex justify-between">
              <span>Rekomendasi Sprayer:</span>
              <span class="font-bold text-agri-700">16 Liter Tangki (Dosis Standar)</span>
            </div>
            <div class="p-2.5 bg-agri-50 rounded-lg flex justify-between">
              <span>Status Kalender Tanam:</span>
              <span class="font-bold text-agri-700">WTH Padi H-14 Sebelum Panen</span>
            </div>
          </div>

          <div v-else-if="profileStore.activeRole === 'tambak'" class="space-y-2 text-xs text-gray-700">
            <div class="p-2.5 bg-aqua-50 rounded-lg flex justify-between">
              <span>Target pH Optimal:</span>
              <span class="font-bold text-aqua-700">7.5 - 8.2 (Stabil Pagi/Sore)</span>
            </div>
            <div class="p-2.5 bg-aqua-50 rounded-lg flex justify-between">
              <span>Target FCR Udang/Ikan:</span>
              <span class="font-bold text-aqua-700">&lt; 1.3 (Sangat Baik)</span>
            </div>
          </div>

          <div v-else class="space-y-2 text-xs text-gray-700">
            <div class="p-2.5 bg-livestock-50 rounded-lg flex justify-between">
              <span>Standar CP Ransum Sapi:</span>
              <span class="font-bold text-livestock-700">12% - 16% Protein Kasar</span>
            </div>
            <div class="p-2.5 bg-livestock-50 rounded-lg flex justify-between">
              <span>Siklus IB Sapi/Kambing:</span>
              <span class="font-bold text-livestock-700">21 Hari Siklus Birahi</span>
            </div>
          </div>
        </div>

      </div>
    </ion-content>

  </ion-page>
</template>

<script setup>
import { computed } from 'vue';
import { IonPage, IonContent } from '@ionic/vue';
import AppHeader from '@/components/AppHeader.vue';

import { useProfileStore } from '@/stores/useProfileStore';

const profileStore = useProfileStore();

const bannerBgClass = computed(() => {
  if (profileStore.activeRole === 'tani') return 'bg-agri-50 border-agri-200';
  if (profileStore.activeRole === 'tambak') return 'bg-aqua-50 border-aqua-200';
  return 'bg-livestock-50 border-livestock-200';
});
</script>
