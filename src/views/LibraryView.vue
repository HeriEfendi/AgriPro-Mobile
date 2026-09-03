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

        <!-- Category Pills (Semua, Pertanian, Tambak, Ternak, Herbal, Favorit) -->
        <div class="flex gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            type="button"
            @click="setCategory('all')"
            :class="activeCategory === 'all' && !onlyFavorites ? 'bg-brand-600 text-white font-bold shadow-soft' : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'"
            class="px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition active:scale-95 cursor-pointer"
          >
            ✨ Semua ({{ allSeedData.length }})
          </button>
          <button
            type="button"
            @click="toggleFavoriteFilter"
            :class="onlyFavorites ? 'bg-rose-500 text-white font-bold shadow-soft' : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'"
            class="px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition active:scale-95 cursor-pointer flex items-center gap-1"
          >
            <span>★</span> Favorit ({{ favoriteIds.size }})
          </button>
          <button
            type="button"
            @click="setCategory('agri')"
            :class="activeCategory === 'agri' && !onlyFavorites ? 'bg-emerald-600 text-white font-bold shadow-soft' : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'"
            class="px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition active:scale-95 cursor-pointer"
          >
            🌾 Pertanian
          </button>
          <button
            type="button"
            @click="setCategory('aqua')"
            :class="activeCategory === 'aqua' && !onlyFavorites ? 'bg-sky-600 text-white font-bold shadow-soft' : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'"
            class="px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition active:scale-95 cursor-pointer"
          >
            🦐 Tambak
          </button>
          <button
            type="button"
            @click="setCategory('livestock')"
            :class="activeCategory === 'livestock' && !onlyFavorites ? 'bg-amber-600 text-white font-bold shadow-soft' : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'"
            class="px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition active:scale-95 cursor-pointer"
          >
            🐄 Peternakan
          </button>
          <button
            type="button"
            @click="setCategory('herbal')"
            :class="activeCategory === 'herbal' && !onlyFavorites ? 'bg-violet-600 text-white font-bold shadow-soft' : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'"
            class="px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition active:scale-95 cursor-pointer"
          >
            🌿 Tanaman Herbal
          </button>
        </div>

        <!-- Toast Feedback Banner -->
        <transition name="fade">
          <div
            v-if="toastMessage"
            class="fixed top-16 left-1/2 -translate-x-1/2 z-[100] bg-slate-900/90 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-elevated flex items-center gap-2 backdrop-blur-md"
          >
            <span>✅</span> {{ toastMessage }}
          </div>
        </transition>

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
            <span class="text-xs text-slate-400 font-medium">{{ displayedList.length }} Panduan</span>
          </div>

          <!-- List of Disease / Diagnostic Cards -->
          <div v-if="displayedList.length > 0" class="space-y-3">
            <div
              v-for="item in displayedList"
              :key="item.id"
              class="bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 shadow-card hover:shadow-elevated transition-all duration-200 space-y-3 cursor-pointer"
              @click="openDetail(item)"
            >
              <!-- Card Header: Avatar + Title + Rating + Actions -->
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

                <!-- Top Right Action Buttons: Share & Favorite -->
                <div class="flex items-center gap-1" @click.stop>
                  <!-- Share button -->
                  <button
                    @click="onShareItem(item)"
                    type="button"
                    class="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center transition active:scale-90"
                    title="Bagikan Panduan"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>

                  <!-- Heart Bookmark Button -->
                  <button
                    @click="toggleFavorite(item.id)"
                    type="button"
                    class="w-8 h-8 rounded-full flex items-center justify-center transition active:scale-90"
                    :class="favoriteIds.has(item.id) ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 text-slate-300 hover:text-slate-400'"
                    title="Simpan Favorit"
                  >
                    <svg class="w-4 h-4" :fill="favoriteIds.has(item.id) ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Symptoms (Gejala) Box in soft Rose/Red -->
              <div class="p-3 bg-rose-50/60 rounded-2xl border border-rose-100/80 text-xs text-rose-900 space-y-0.5">
                <span class="font-bold text-rose-700 block text-[11px]">⚠️ Gejala Lapangan:</span>
                <p class="text-slate-700 leading-relaxed line-clamp-2">{{ item.symptom }}</p>
              </div>

              <!-- Solution (Solusi) Box in soft Emerald/Green -->
              <div class="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100/80 text-xs text-emerald-900 space-y-0.5 whitespace-pre-line">
                <span class="font-bold text-emerald-800 block text-[11px]">✅ Penanganan & Dosis Taktis:</span>
                <p class="text-slate-700 leading-relaxed line-clamp-2">{{ item.solution }}</p>
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

              <div v-if="item.recipe" class="pt-1" @click.stop>
                <button
                  :id="`recipe-toggle-${item.id}`"
                  type="button"
                  class="w-full rounded-2xl bg-violet-50 px-3 py-2 text-left text-xs font-bold text-violet-700 transition hover:bg-violet-100 flex items-center justify-between"
                  :aria-expanded="expandedRecipes.has(item.id)"
                  @click="toggleRecipe(item.id)"
                >
                  <span>🌿 {{ expandedRecipes.has(item.id) ? 'Sembunyikan' : 'Lihat' }} cara meracik jamu</span>
                  <span class="text-xs">{{ expandedRecipes.has(item.id) ? '▲' : '▼' }}</span>
                </button>

                <div v-if="expandedRecipes.has(item.id)" class="rounded-2xl border border-violet-100 bg-violet-50/50 p-3 text-xs text-slate-700 space-y-2 mt-2">
                  <p class="font-bold text-violet-800">{{ item.recipe.name }}</p>
                  <div><strong>Bahan:</strong><ul class="list-disc pl-4 space-y-0.5 mt-0.5"><li v-for="ingredient in item.recipe.ingredients" :key="ingredient">{{ ingredient }}</li></ul></div>
                  <div><strong>Cara membuat:</strong><ol class="list-decimal pl-4 space-y-0.5 mt-0.5"><li v-for="step in item.recipe.steps" :key="step">{{ step }}</li></ol></div>
                  <p><strong>Dosis:</strong> {{ item.recipe.dose }}</p>
                  <p v-if="item.recipe.warning" class="font-semibold text-rose-700"><strong>Peringatan:</strong> {{ item.recipe.warning }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="p-10 text-center bg-white rounded-3xl border border-slate-100 text-slate-400 space-y-2 shadow-soft">
            <div class="text-4xl">🔍</div>
            <p class="text-sm font-bold text-slate-700">Tidak ada panduan yang cocok</p>
            <p class="text-xs text-slate-400 max-w-xs mx-auto">
              {{ onlyFavorites ? 'Belum ada panduan yang ditandai sebagai favorit. Klik ikon hati pada panduan untuk menyimpannya di sini!' : 'Coba kata kunci lain atau pilih salah satu ikon kategori komoditas di atas.' }}
            </p>
            <button
              v-if="onlyFavorites || activeCategory !== 'all' || searchQuery"
              @click="resetFilter"
              class="mt-2 text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1.5 rounded-full hover:bg-brand-100 transition"
            >
              Tampilkan Semua Panduan
            </button>
          </div>
        </div>

      </div>
    </ion-content>

    <!-- Detailed Guide Modal / Bottom Sheet -->
    <Teleport to="body">
      <div
        v-if="selectedDetailItem"
        class="fixed inset-0 z-[200] flex items-end justify-center sm:items-center"
        @click.self="selectedDetailItem = null"
      >
        <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" @click="selectedDetailItem = null" />

        <div class="relative w-full max-w-lg mx-auto bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[85vh] flex flex-col">
          <!-- Header -->
          <div class="px-5 pt-4 pb-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div class="flex items-center gap-2">
              <span class="text-2xl">{{ selectedDetailItem.category === 'agri' ? '🌾' : selectedDetailItem.category === 'aqua' ? '🦐' : selectedDetailItem.category === 'herbal' ? '🌿' : '🐄' }}</span>
              <div>
                <h3 class="font-bold text-slate-900 text-sm leading-tight">{{ selectedDetailItem.title }}</h3>
                <span class="text-[10px] text-slate-400">{{ getCategoryLabel(selectedDetailItem.category) }}</span>
              </div>
            </div>
            <button
              @click="selectedDetailItem = null"
              class="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition text-xs font-bold"
            >
              ✕
            </button>
          </div>

          <!-- Body -->
          <div class="p-5 overflow-y-auto space-y-4 text-xs">
            <!-- Symptoms -->
            <div class="p-3.5 bg-rose-50/70 rounded-2xl border border-rose-100 text-rose-950 space-y-1">
              <div class="font-bold text-rose-700 flex items-center gap-1.5 text-xs">
                <span>⚠️</span> Gejala / Indikasi Lapangan:
              </div>
              <p class="text-slate-700 leading-relaxed">{{ selectedDetailItem.symptom }}</p>
            </div>

            <!-- Solution -->
            <div class="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-100 text-emerald-950 space-y-1">
              <div class="font-bold text-emerald-800 flex items-center gap-1.5 text-xs">
                <span>✅</span> Solusi Penanganan & Dosis Taktis:
              </div>
              <p class="text-slate-700 leading-relaxed whitespace-pre-line">{{ selectedDetailItem.solution }}</p>
            </div>

            <!-- Recipe if Herbal -->
            <div v-if="selectedDetailItem.recipe" class="p-4 bg-violet-50/70 rounded-2xl border border-violet-100 space-y-2.5">
              <div class="font-bold text-violet-800 flex items-center gap-1.5 text-xs">
                <span>🌿</span> Resep Ramuan: {{ selectedDetailItem.recipe.name }}
              </div>
              <div>
                <span class="font-bold text-slate-800 block mb-1">Bahan-Bahan yang Dibutuhkan:</span>
                <ul class="list-disc pl-4 space-y-0.5 text-slate-700">
                  <li v-for="ing in selectedDetailItem.recipe.ingredients" :key="ing">{{ ing }}</li>
                </ul>
              </div>
              <div>
                <span class="font-bold text-slate-800 block mb-1">Langkah-Langkah Pembuatan:</span>
                <ol class="list-decimal pl-4 space-y-0.5 text-slate-700">
                  <li v-for="st in selectedDetailItem.recipe.steps" :key="st">{{ st }}</li>
                </ol>
              </div>
              <div class="p-2.5 bg-white rounded-xl border border-violet-100">
                <span class="font-bold text-violet-800">Dosis Pemberian:</span>
                <p class="text-slate-700 mt-0.5">{{ selectedDetailItem.recipe.dose }}</p>
              </div>
              <div v-if="selectedDetailItem.recipe.warning" class="p-2.5 bg-rose-50/80 rounded-xl border border-rose-100 text-rose-800">
                <span class="font-bold">⚠️ Peringatan Penting:</span>
                <p class="mt-0.5">{{ selectedDetailItem.recipe.warning }}</p>
              </div>
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap gap-1.5 pt-1">
              <span
                v-for="t in selectedDetailItem.tags"
                :key="t"
                class="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-medium"
              >
                #{{ t }}
              </span>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="p-4 border-t border-slate-100 bg-white flex gap-2">
            <button
              @click="toggleFavorite(selectedDetailItem.id)"
              class="py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-bold transition active:scale-95 flex items-center gap-1"
              :class="favoriteIds.has(selectedDetailItem.id) ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'"
            >
              <span>{{ favoriteIds.has(selectedDetailItem.id) ? '★ Tersimpan' : '☆ Simpan Favorit' }}</span>
            </button>
            <button
              @click="onShareItem(selectedDetailItem)"
              class="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-soft transition active:scale-95 flex items-center justify-center gap-1.5"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Bagikan Panduan
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </ion-page>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue';
import { IonPage, IonContent } from '@ionic/vue';
import { useRoute } from 'vue-router';
import AppHeader from '@/components/AppHeader.vue';
import knowledgeSeedData from '@/data/knowledgeSeed.json';
import herbalSeedData from '@/data/herbalSeed.json';
import { searchKnowledge } from '@/services/db';
import { shareKnowledgeItem } from '@/services/shareService';
import { triggerHapticImpact, triggerHapticSuccess } from '@/utils/haptics';

const allSeedData = [...knowledgeSeedData, ...herbalSeedData];

const route = useRoute();
const searchQuery = ref('');
const activeFilterTag = ref('');
const activeCategory = ref('all');
const onlyFavorites = ref(false);
const filteredList = ref(allSeedData);
const favoriteIds = ref(new Set([1, 6]));
const expandedRecipes = ref(new Set());
const selectedDetailItem = ref(null);
const toastMessage = ref('');

const displayedList = computed(() => {
  if (onlyFavorites.value) {
    return filteredList.value.filter(item => favoriteIds.value.has(item.id));
  }
  return filteredList.value;
});

function toggleFavorite(id) {
  triggerHapticImpact();
  if (favoriteIds.value.has(id)) {
    favoriteIds.value.delete(id);
    showToast('Dihapus dari favorit');
  } else {
    favoriteIds.value.add(id);
    triggerHapticSuccess();
    showToast('Ditambahkan ke favorit');
  }
}

function toggleFavoriteFilter() {
  triggerHapticImpact();
  onlyFavorites.value = !onlyFavorites.value;
}

function setFilterTag(tag) {
  triggerHapticImpact();
  onlyFavorites.value = false;
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
  triggerHapticImpact();
  onlyFavorites.value = false;
  activeCategory.value = cat;
  performSearch();
}

function resetFilter() {
  triggerHapticImpact();
  onlyFavorites.value = false;
  activeCategory.value = 'all';
  activeFilterTag.value = '';
  searchQuery.value = '';
  performSearch();
}

function toggleRecipe(id) {
  triggerHapticImpact();
  if (expandedRecipes.value.has(id)) expandedRecipes.value.delete(id);
  else expandedRecipes.value.add(id);
  expandedRecipes.value = new Set(expandedRecipes.value);
}

function openDetail(item) {
  triggerHapticImpact();
  selectedDetailItem.value = item;
}

async function onShareItem(item) {
  triggerHapticImpact();
  const res = await shareKnowledgeItem(item);
  if (res && res.message) {
    showToast(res.message);
  }
}

function showToast(msg) {
  toastMessage.value = msg;
  setTimeout(() => {
    toastMessage.value = '';
  }, 2500);
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
