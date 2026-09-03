<template>
  <div class="fixed bottom-0 left-0 right-0 z-50 pointer-events-none pb-[env(safe-area-inset-bottom,0px)] px-3 mb-2">
    <div class="max-w-md mx-auto pointer-events-auto bg-white/95 backdrop-blur-xl border border-slate-100/90 rounded-3xl shadow-elevated px-1.5 py-1.5 flex items-center justify-around">
      
      <!-- Tab 1: Beranda -->
      <button
        type="button"
        @click="navigateTo('/dashboard')"
        class="flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 active:scale-90 cursor-pointer outline-none group"
      >
        <div
          class="w-10 h-7 rounded-full flex items-center justify-center transition-all duration-200"
          :class="isActive('/dashboard') ? 'bg-brand-50 text-brand-600' : 'text-slate-400 group-hover:text-slate-600'"
        >
          <ion-icon :icon="homeOutline" class="text-xl" />
        </div>
        <span
          class="text-[10px] font-semibold mt-0.5 tracking-tight transition-colors duration-200"
          :class="isActive('/dashboard') ? 'text-brand-700 font-bold' : 'text-slate-400'"
        >
          Beranda
        </span>
      </button>

      <!-- Tab 2: Pertanian -->
      <button
        type="button"
        @click="navigateTo('/agri')"
        class="flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 active:scale-90 cursor-pointer outline-none group"
      >
        <div
          class="w-10 h-7 rounded-full flex items-center justify-center transition-all duration-200"
          :class="isActive('/agri') ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'"
        >
          <ion-icon :icon="leafOutline" class="text-xl" />
        </div>
        <span
          class="text-[10px] font-semibold mt-0.5 tracking-tight transition-colors duration-200"
          :class="isActive('/agri') ? 'text-emerald-700 font-bold' : 'text-slate-400'"
        >
          Tani
        </span>
      </button>

      <!-- Tab 3: Tambak -->
      <button
        type="button"
        @click="navigateTo('/aqua')"
        class="flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 active:scale-90 cursor-pointer outline-none group"
      >
        <div
          class="w-10 h-7 rounded-full flex items-center justify-center transition-all duration-200"
          :class="isActive('/aqua') ? 'bg-sky-50 text-sky-600' : 'text-slate-400 group-hover:text-slate-600'"
        >
          <ion-icon :icon="waterOutline" class="text-xl" />
        </div>
        <span
          class="text-[10px] font-semibold mt-0.5 tracking-tight transition-colors duration-200"
          :class="isActive('/aqua') ? 'text-sky-700 font-bold' : 'text-slate-400'"
        >
          Tambak
        </span>
      </button>

      <!-- Tab 4: Ternak -->
      <button
        type="button"
        @click="navigateTo('/livestock')"
        class="flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 active:scale-90 cursor-pointer outline-none group"
      >
        <div
          class="w-10 h-7 rounded-full flex items-center justify-center transition-all duration-200"
          :class="isActive('/livestock') ? 'bg-amber-50 text-amber-600' : 'text-slate-400 group-hover:text-slate-600'"
        >
          <ion-icon :icon="pawOutline" class="text-xl" />
        </div>
        <span
          class="text-[10px] font-semibold mt-0.5 tracking-tight transition-colors duration-200"
          :class="isActive('/livestock') ? 'text-amber-700 font-bold' : 'text-slate-400'"
        >
          Ternak
        </span>
      </button>

      <!-- Tab 5: Pustaka -->
      <button
        type="button"
        @click="navigateTo('/library')"
        class="flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 active:scale-90 cursor-pointer outline-none group"
      >
        <div
          class="w-10 h-7 rounded-full flex items-center justify-center transition-all duration-200"
          :class="isActive('/library') ? 'bg-brand-50 text-brand-600' : 'text-slate-400 group-hover:text-slate-600'"
        >
          <ion-icon :icon="bookOutline" class="text-xl" />
        </div>
        <span
          class="text-[10px] font-semibold mt-0.5 tracking-tight transition-colors duration-200"
          :class="isActive('/library') ? 'text-brand-700 font-bold' : 'text-slate-400'"
        >
          Pustaka
        </span>
      </button>

    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { IonIcon } from '@ionic/vue';
import { homeOutline, leafOutline, waterOutline, pawOutline, bookOutline } from 'ionicons/icons';
import { triggerHapticImpact } from '@/utils/haptics';

const route = useRoute();
const router = useRouter();

function isActive(path) {
  return route.path === path;
}

function navigateTo(path) {
  triggerHapticImpact();
  if (route.path !== path) {
    router.push(path);
  }
}
</script>
