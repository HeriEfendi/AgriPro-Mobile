<template>
  <ion-page>
    <AppHeader />
    <ion-content class="bg-slate-50/50">
      <div class="max-w-2xl mx-auto px-4 py-4 space-y-5 page-content">
        
        <!-- Searchbar Pill -->
        <div class="searchbar-pill">
          <svg class="w-5 h-5 text-slate-400 mr-2.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari penyakit, komoditas, gejala, atau obat..."
            class="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none border-none p-0 focus:ring-0"
            @input="onSearch"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''; onSearch()"
            class="text-xs text-slate-400 hover:text-slate-600 px-1"
          >
            ✕
          </button>
        </div>

        <!-- Category Pills (Semua, Pertanian, Tambak, Ternak, Herbal) -->
        <div class="flex gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            type="button"
            @click="setCategory('all')"
            :class="activeCategory === 'all' ? 'bg-brand-600 text-white font-bold shadow-soft' : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'"
            class="px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition active:scale-95 cursor-pointer"
          >
            ✨ Semua ({{ allSeedData.length }})
          </button>
          <button
            type="button"
            @click="setCategory('agri')"
            :class="activeCategory === 'agri' ? 'bg-emerald-600 text-white font-bold shadow-soft' : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'"
            class="px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition active:scale-95 cursor-pointer"
          >
            🌾 Pertanian
          </button>
          <button
            type="button"
            @click="setCategory('aqua')"
            :class="activeCategory === 'aqua' ? 'bg-sky-600 text-white font-bold shadow-soft' : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'"
            class="px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition active:scale-95 cursor-pointer"
          >
            🦐 Tambak
          </button>
          <button
            type="button"
            @click="setCategory('livestock')"
            :class="activeCategory === 'livestock' ? 'bg-amber-600 text-white font-bold shadow-soft' : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'"
            class="px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition active:scale-95 cursor-pointer"
          >
            🐄 Peternakan
          </button>
          <button
            type="button"
            @click="setCategory('herbal')"
            :class="activeCategory === 'herbal' ? 'bg-violet-600 text-white font-bold shadow-soft' : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'"
            class="px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition active:scale-95 cursor-pointer"
          >
            🌿 Tanaman Herbal
          </button>
        </div>

        <!-- Categories Section (Grid matching Screen 2) -->
        <div class="bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 shadow-card space-y-3">
          <div class="flex justify-between items-center">
            <h2 class="text-sm font-bold text-slate-900">Kategori Komoditas</h2>
            <button
              @click="resetFilter"
              class="text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              Reset Filter
            </button>
          </div>

          <div class="grid grid-cols-3 sm:grid-cols-5 gap-2.5 text-center">
            <!-- 1. Padi -->
            <button
              @click="setFilterTag('padi')"
              type="button"
              class="flex flex-col items-center group active:scale-95 transition"
            >
              <div
                class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all duration-200"
                :class="activeFilterTag === 'padi' ? 'bg-emerald-600 text-white shadow-soft ring-2 ring-emerald-400' : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100'"
              >
                🌾
              </div>
              <span class="text-[11px] font-semibold mt-1 text-slate-700">Padi</span>
            </button>

            <!-- 2. Jagung -->
            <button
              @click="setFilterTag('jagung')"
              type="button"
              class="flex flex-col items-center group active:scale-95 transition"
            >
              <div
                class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all duration-200"
                :class="activeFilterTag === 'jagung' ? 'bg-amber-500 text-white shadow-soft ring-2 ring-amber-400' : 'bg-amber-50 text-amber-600 group-hover:bg-amber-100'"
              >
                🌽
              </div>
              <span class="text-[11px] font-semibold mt-1 text-slate-700">Jagung</span>
            </button>

            <!-- 3. Cabai -->
            <button
              @click="setFilterTag('cabai')"
              type="button"
              class="flex flex-col items-center group active:scale-95 transition"
            >
              <div
                class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all duration-200"
                :class="activeFilterTag === 'cabai' ? 'bg-rose-500 text-white shadow-soft ring-2 ring-rose-400' : 'bg-rose-50 text-rose-600 group-hover:bg-rose-100'"
              >
                🌶️
              </div>
              <span class="text-[11px] font-semibold mt-1 text-slate-700">Cabai</span>
            </button>

            <!-- 4. Udang -->
            <button
              @click="setFilterTag('udang')"
              type="button"
              class="flex flex-col items-center group active:scale-95 transition"
            >
              <div
                class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all duration-200"
                :class="activeFilterTag === 'udang' ? 'bg-sky-600 text-white shadow-soft ring-2 ring-sky-400' : 'bg-sky-50 text-sky-600 group-hover:bg-sky-100'"
              >
                🦐
              </div>
              <span class="text-[11px] font-semibold mt-1 text-slate-700">Udang</span>
            </button>

            <!-- 5. Ikan -->
            <button
              @click="setFilterTag('ikan')"
              type="button"
              class="flex flex-col items-center group active:scale-95 transition"
            >
              <div
                class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all duration-200"
                :class="activeFilterTag === 'ikan' ? 'bg-blue-600 text-white shadow-soft ring-2 ring-blue-400' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'"
              >
                🐟
              </div>
              <span class="text-[11px] font-semibold mt-1 text-slate-700">Ikan</span>
            </button>

            <!-- 6. Sapi -->
            <button
              @click="setFilterTag('sapi')"
              type="button"
              class="flex flex-col items-center group active:scale-95 transition"
            >
              <div
                class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all duration-200"
                :class="activeFilterTag === 'sapi' ? 'bg-amber-600 text-white shadow-soft ring-2 ring-amber-500' : 'bg-amber-100/70 text-amber-700 group-hover:bg-amber-200/70'"
              >
                🐄
              </div>
              <span class="text-[11px] font-semibold mt-1 text-slate-700">Sapi</span>
            </button>

            <!-- 7. Kambing -->
            <button
              @click="setFilterTag('kambing')"
              type="button"
              class="flex flex-col items-center group active:scale-95 transition"
            >
              <div
                class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all duration-200"
                :class="activeFilterTag === 'kambing' ? 'bg-emerald-700 text-white shadow-soft ring-2 ring-emerald-500' : 'bg-emerald-100/70 text-emerald-800 group-hover:bg-emerald-200/70'"
              >
                🐐
              </div>
              <span class="text-[11px] font-semibold mt-1 text-slate-700">Kambing</span>
            </button>

            <!-- 8. Herbal -->
            <button
              @click="setFilterTag('herbal')"
              type="button"
              class="flex flex-col items-center group active:scale-95 transition"
            >
              <div
                class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all duration-200"
                :class="activeFilterTag === 'herbal' ? 'bg-violet-600 text-white shadow-soft ring-2 ring-violet-400' : 'bg-violet-50 text-violet-600 group-hover:bg-violet-100'"
              >
                🌿
              </div>
              <span class="text-[11px] font-semibold mt-1 text-slate-700">Herbal</span>
            </button>

            <!-- 9. Obat & Kimia -->
            <button
              @click="setFilterTag('obat')"
              type="button"
              class="flex flex-col items-center group active:scale-95 transition"
            >
              <div
                class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all duration-200"
                :class="activeFilterTag === 'obat' ? 'bg-purple-600 text-white shadow-soft ring-2 ring-purple-400' : 'bg-purple-50 text-purple-600 group-hover:bg-purple-100'"
              >
                💊
              </div>
              <span class="text-[11px] font-semibold mt-1 text-slate-700">Obat Tani</span>
            </button>
          </div>
        </div>

        <!-- All Doctor / All Guides List (Matching Screen 2 in Reference) -->
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <h2 class="text-sm font-bold text-slate-900">
              Daftar Diagnosa & Panduan Taktis
            </h2>
            <span class="text-xs text-slate-400 font-medium">{{ filteredList.length }} Panduan</span>
          </div>

          <!-- List of Disease / Diagnostic Cards -->
          <div v-if="filteredList.length > 0" class="space-y-3">
            <div
              v-for="item in filteredList"
              :key="item.id"
              class="bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 shadow-card hover:shadow-elevated transition-all duration-200 space-y-3"
            >
              <!-- Card Header: Avatar + Title + Rating + Bookmark Heart -->
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-center gap-3">
                  <div
                    class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                    :class="getCategoryIconBg(item.category)"
                  >
                    <span v-if="item.category === 'agri'">🌾</span>
                    <span v-else-if="item.category === 'aqua'">🦐</span>
                    <span v-else-if="item.category === 'herbal'">🌿</span>
                    <span v-else>🐄</span>
                  </div>

                  <div>
                    <h3 class="text-sm font-bold text-slate-900 leading-snug">{{ item.title }}</h3>
                    <div class="flex items-center gap-2 mt-1">
                      <span class="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                        ★ 4.9 <span class="text-slate-400 font-normal">(Rekomendasi Agronom)</span>
                      </span>
                      <span
                        class="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        :class="getCategoryBadgeClass(item.category)"
                      >
                        {{ getCategoryLabel(item.category) }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Heart Bookmark Button -->
                <button
                  @click="toggleFavorite(item.id)"
                  type="button"
                  class="w-8 h-8 rounded-full flex items-center justify-center transition active:scale-90"
                  :class="favoriteIds.has(item.id) ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 text-slate-300 hover:text-slate-400'"
                >
                  <svg class="w-4 h-4" :fill="favoriteIds.has(item.id) ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                </button>
              </div>

              <!-- Symptoms (Gejala) Box in soft Rose/Red -->
              <div class="p-3 bg-rose-50/60 rounded-2xl border border-rose-100/80 text-xs text-rose-900 space-y-0.5">
                <span class="font-bold text-rose-700 block text-[11px]">⚠️ Gejala Lapangan:</span>
                <p class="text-slate-700 leading-relaxed">{{ item.symptom }}</p>
              </div>

              <!-- Solution (Solusi) Box in soft Emerald/Green -->
              <div class="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100/80 text-xs text-emerald-900 space-y-0.5 whitespace-pre-line">
                <span class="font-bold text-emerald-800 block text-[11px]">✅ Penanganan & Dosis Taktis:</span>
                <p class="text-slate-700 leading-relaxed">{{ item.solution }}</p>
              </div>

              <!-- Tags Chips -->
              <div class="flex flex-wrap gap-1.5 pt-1">
                <span
                  v-for="tag in item.tags"
                  :key="tag"
                  class="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-medium"
                >
                  #{{ tag }}
                </span>
              </div>

              <button
                v-if="item.recipe"
                :id="`recipe-toggle-${item.id}`"
                type="button"
                class="w-full rounded-2xl bg-violet-50 px-3 py-2 text-left text-xs font-bold text-violet-700 transition hover:bg-violet-100"
                :aria-expanded="expandedRecipes.has(item.id)"
                @click="toggleRecipe(item.id)"
              >
                🌿 {{ expandedRecipes.has(item.id) ? 'Sembunyikan' : 'Lihat' }} cara meracik
              </button>

              <div v-if="item.recipe && expandedRecipes.has(item.id)" class="rounded-2xl border border-violet-100 bg-violet-50/50 p-3 text-xs text-slate-700 space-y-2">
                <p class="font-bold text-violet-800">{{ item.recipe.name }}</p>
                <div><strong>Bahan:</strong><ul class="list-disc pl-4"><li v-for="ingredient in item.recipe.ingredients" :key="ingredient">{{ ingredient }}</li></ul></div>
                <div><strong>Cara membuat:</strong><ol class="list-decimal pl-4"><li v-for="step in item.recipe.steps" :key="step">{{ step }}</li></ol></div>
                <p><strong>Dosis:</strong> {{ item.recipe.dose }}</p>
                <p class="font-semibold text-rose-700"><strong>Peringatan:</strong> {{ item.recipe.warning }}</p>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="p-10 text-center bg-white rounded-3xl border border-slate-100 text-slate-400 space-y-2 shadow-soft">
            <div class="text-4xl">🔍</div>
            <p class="text-sm font-bold text-slate-700">Tidak ada panduan yang cocok</p>
            <p class="text-xs text-slate-400 max-w-xs mx-auto">
              Coba kata kunci lain atau pilih salah satu ikon kategori komoditas di atas.
            </p>
          </div>
        </div>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { IonPage, IonContent } from '@ionic/vue';
import { useRoute } from 'vue-router';
import AppHeader from '@/components/AppHeader.vue';
import knowledgeSeedData from '@/data/knowledgeSeed.json';
import herbalSeedData from '@/data/herbalSeed.json';
import { searchKnowledge } from '@/services/db';

const allSeedData = [...knowledgeSeedData, ...herbalSeedData];

const route = useRoute();
const searchQuery = ref('');
const activeFilterTag = ref('');
const activeCategory = ref('all');
const filteredList = ref(allSeedData);
const favoriteIds = ref(new Set([1, 6]));
const expandedRecipes = ref(new Set());

function toggleFavorite(id) {
  if (favoriteIds.value.has(id)) {
    favoriteIds.value.delete(id);
  } else {
    favoriteIds.value.add(id);
  }
}

function setFilterTag(tag) {
  if (activeFilterTag.value === tag) {
    activeFilterTag.value = '';
    searchQuery.value = '';
  } else {
    activeFilterTag.value = tag;
    searchQuery.value = tag;
  }
  performSearch();
}

function setCategory(cat) {
  activeCategory.value = cat;
  performSearch();
}

function resetFilter() {
  activeCategory.value = 'all';
  activeFilterTag.value = '';
  searchQuery.value = '';
  performSearch();
}

function toggleRecipe(id) {
  if (expandedRecipes.value.has(id)) expandedRecipes.value.delete(id);
  else expandedRecipes.value.add(id);
  expandedRecipes.value = new Set(expandedRecipes.value);
}

async function performSearch() {
  const query = (searchQuery.value || activeFilterTag.value || '').trim();
  try {
    const results = await searchKnowledge(query, activeCategory.value);
    filteredList.value = results;
  } catch (e) {
    console.error('Search error, fallbacking:', e);
    filteredList.value = allSeedData.filter(item => {
      const matchCat = activeCategory.value === 'all' || item.category === activeCategory.value;
      const matchQ = !query || matchesItem(item, query);
      return matchCat && matchQ;
    });
  }
}

function matchesItem(item, query) {
  const q = query.toLowerCase();
  return (
    item.title?.toLowerCase().includes(q) ||
    item.name?.toLowerCase().includes(q) ||
    item.parts?.toLowerCase().includes(q) ||
    item.recipe?.name?.toLowerCase().includes(q) ||
    item.recipe?.ingredients?.some(i => i.toLowerCase().includes(q)) ||
    item.recipe?.dose?.toLowerCase().includes(q) ||
    item.recipe?.warning?.toLowerCase().includes(q) ||
    item.symptom?.toLowerCase().includes(q) ||
    item.solution?.toLowerCase().includes(q) ||
    item.tags?.some(t => t.toLowerCase().includes(q))
  );
}

function onSearch() {
  performSearch();
}

watch([searchQuery, activeCategory], () => {
  performSearch();
});

onMounted(() => {
  if (route.query.q) {
    searchQuery.value = route.query.q;
  }
  performSearch();
});

function getCategoryIconBg(category) {
  if (category === 'agri') return 'bg-emerald-50 text-emerald-600';
  if (category === 'aqua') return 'bg-sky-50 text-sky-600';
  if (category === 'herbal') return 'bg-violet-50 text-violet-600';
  return 'bg-amber-50 text-amber-600';
}

function getCategoryBadgeClass(category) {
  if (category === 'agri') return 'bg-emerald-50 text-emerald-700 border border-emerald-200/60';
  if (category === 'aqua') return 'bg-sky-50 text-sky-700 border border-sky-200/60';
  if (category === 'herbal') return 'bg-violet-50 text-violet-700 border border-violet-200/60';
  return 'bg-amber-50 text-amber-700 border border-amber-200/60';
}

function getCategoryLabel(category) {
  if (category === 'agri') return 'Pertanian';
  if (category === 'aqua') return 'Tambak';
  if (category === 'herbal') return 'Tanaman Herbal';
  return 'Obat & Ternak';
}
</script>
