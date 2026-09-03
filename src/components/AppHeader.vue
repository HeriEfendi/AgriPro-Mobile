<template>
  <div class="bg-white/95 backdrop-blur-md border-b border-slate-100/80 sticky top-0 z-50 px-4 pt-3 pb-3">
    <div class="max-w-2xl mx-auto flex items-center justify-between">

      <!-- User Profile & Greeting (clickable) -->
      <button
        @click="showProfileModal = true"
        class="flex items-center gap-3 group text-left outline-none"
        title="Edit Profil"
      >
        <!-- Avatar ring -->
        <div class="relative shrink-0">
          <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-600 to-brand-400 p-[2px] shadow-sm group-active:scale-90 transition">
            <div class="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
              <img
                v-if="profileStore.avatarUrl"
                :src="profileStore.avatarUrl"
                alt="Avatar"
                class="w-full h-full object-cover"
              />
              <span v-else-if="profileStore.activeRole === 'tani'" class="text-xl">👨‍🌾</span>
              <span v-else-if="profileStore.activeRole === 'tambak'" class="text-xl">🧑‍🏭</span>
              <span v-else class="text-xl">🤠</span>
            </div>
          </div>
          <!-- Online indicator -->
          <div class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
          <!-- Edit pencil badge on hover -->
          <div class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-brand-600 border-2 border-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <svg class="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </div>
        </div>

        <!-- Greeting text -->
        <div class="min-w-0">
          <p class="text-[11px] font-medium text-slate-400 leading-none">Selamat Datang,</p>
          <div class="flex items-center gap-1 mt-0.5">
            <h1 class="text-sm font-bold text-slate-800 leading-none tracking-tight truncate max-w-[130px]">
              {{ profileStore.namaPengguna || profileStore.namaLahan || 'Lahan Tani Unggul' }}
            </h1>
            <!-- Subtle edit caret -->
            <svg class="w-3 h-3 text-slate-300 group-hover:text-brand-400 transition shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
        </div>
      </button>

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
            @change="profileStore.setRole(profileStore.activeRole)"
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

    <!-- Profile Edit Modal -->
    <ProfileEditModal
      :is-open="showProfileModal"
      @close="showProfileModal = false"
      @saved="onProfileSaved"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { IonIcon } from '@ionic/vue';
import { swapHorizontalOutline } from 'ionicons/icons';
import { useProfileStore } from '@/stores/useProfileStore';
import UnitConverterModal from './UnitConverterModal.vue';
import ProfileEditModal from './ProfileEditModal.vue';

const profileStore = useProfileStore();
const showConverterModal = ref(false);
const showProfileModal = ref(false);

function onProfileSaved() {
  // Profile store sudah terupdate reaktif, tidak perlu reload manual
}
</script>
