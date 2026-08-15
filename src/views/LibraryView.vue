<template>
  <ion-page>
    <AppHeader />
    <ion-content class="ion-padding bg-gray-50">
      <div class="max-w-2xl mx-auto space-y-4">
        
        <!-- Header & Instant Searchbar -->
        <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
          <h2 class="font-bold text-gray-900 text-lg">📚 Pustaka Taktis Offline</h2>
          <p class="text-xs text-gray-500">Pencarian serba cepat gejala & penyakit tanpa butuh koneksi internet.</p>
          
          <ion-searchbar
            v-model="searchQuery"
            placeholder="Cari penyakit, tanaman, obat, atau gejala..."
            class="p-0 border-none rounded-xl"
            @ionInput="onSearch"
          />

          <!-- Filter Category Tags -->
          <div class="flex gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              @click="setCategory('all')"
              class="px-3 py-1 rounded-full font-semibold whitespace-nowrap transition"
              :class="activeCategory === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'"
            >
              Semua Modul
            </button>
            <button
              @click="setCategory('agri')"
              class="px-3 py-1 rounded-full font-semibold whitespace-nowrap transition"
              :class="activeCategory === 'agri' ? 'bg-agri-600 text-white' : 'bg-agri-50 text-agri-800'"
            >
              🌾 Pertanian
            </button>
            <button
              @click="setCategory('aqua')"
              class="px-3 py-1 rounded-full font-semibold whitespace-nowrap transition"
              :class="activeCategory === 'aqua' ? 'bg-aqua-600 text-white' : 'bg-aqua-50 text-aqua-800'"
            >
              🦐 Pertambakan
            </button>
            <button
              @click="setCategory('livestock')"
              class="px-3 py-1 rounded-full font-semibold whitespace-nowrap transition"
              :class="activeCategory === 'livestock' ? 'bg-livestock-600 text-white' : 'bg-livestock-50 text-livestock-800'"
            >
              🐄 Peternakan
            </button>
          </div>
        </div>

        <!-- Result List Cards -->
        <div v-if="filteredList.length > 0" class="space-y-3">
          <div
            v-for="item in filteredList"
            :key="item.id"
            class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-2 hover:border-agri-300 transition"
          >
            <div class="flex justify-between items-start">
              <h3 class="font-bold text-gray-900 text-sm">{{ item.title }}</h3>
              <span
                class="text-[10px] font-bold uppercase px-2 py-0.5 rounded"
                :class="getCategoryBadgeClass(item.category)"
              >
                {{ item.category }}
              </span>
            </div>

            <div class="text-xs text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
              <span class="font-bold text-red-600">Gejala: </span>
              {{ item.symptom }}
            </div>

            <div class="text-xs text-gray-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100 whitespace-pre-line">
              <span class="font-bold text-emerald-800">Solusi Taktis: </span>
              {{ item.solution }}
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap gap-1 pt-1">
              <span
                v-for="tag in item.tags"
                :key="tag"
                class="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
              >
                #{{ tag }}
              </span>
            </div>
          </div>
        </div>

        <!-- Empty Search Result State -->
        <div v-else class="p-8 text-center bg-white rounded-xl border border-gray-200 text-gray-500">
          <div class="text-3xl mb-2">🔍</div>
          <p class="text-sm font-semibold">Tidak ada panduan yang cocok dengan kata kunci "{{ searchQuery }}"</p>
          <p class="text-xs text-gray-400 mt-1">Coba gunakan kata kunci umum seperti "padi", "udang", "ph", "cacingan".</p>
        </div>

      </div>
    </ion-content>

  </ion-page>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { IonPage, IonContent, IonSearchbar } from '@ionic/vue';
import AppHeader from '@/components/AppHeader.vue';

import knowledgeSeedData from '@/data/knowledgeSeed.json';
import { searchKnowledge, db } from '@/services/db';

const searchQuery = ref('');
const activeCategory = ref('all');
const filteredList = ref(knowledgeSeedData);

async function performSearch() {
  try {
    const results = await searchKnowledge(searchQuery.value, activeCategory.value);
    filteredList.value = results.length > 0 ? results : (searchQuery.value ? [] : knowledgeSeedData);
  } catch (e) {
    console.error('Dexie search error, falling back:', e);
    filteredList.value = knowledgeSeedData;
  }
}

function setCategory(cat) {
  activeCategory.value = cat;
  performSearch();
}

function onSearch() {
  performSearch();
}

watch([searchQuery, activeCategory], () => {
  performSearch();
});

onMounted(() => {
  performSearch();
});

function getCategoryBadgeClass(category) {
  if (category === 'agri') return 'bg-agri-100 text-agri-800';
  if (category === 'aqua') return 'bg-aqua-100 text-aqua-800';
  return 'bg-livestock-100 text-livestock-800';
}
</script>
