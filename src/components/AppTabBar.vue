<template>
  <ion-footer class="border-t border-gray-200 bg-white shadow-md">
    <div class="flex justify-around items-center py-2 px-1">
      <button
        type="button"
        @click="navigateTo('/dashboard')"
        class="flex flex-col items-center flex-1 text-center transition active:scale-95 cursor-pointer outline-none"
        :class="isActive('/dashboard') ? 'text-agri-600 font-bold' : 'text-gray-500 hover:text-gray-700'"
      >
        <ion-icon :icon="homeOutline" class="text-xl" />
        <span class="text-[11px] mt-0.5">Beranda</span>
      </button>

      <button
        type="button"
        @click="navigateTo('/agri')"
        class="flex flex-col items-center flex-1 text-center transition active:scale-95 cursor-pointer outline-none"
        :class="isActive('/agri') ? 'text-agri-600 font-bold' : 'text-gray-500 hover:text-gray-700'"
      >
        <ion-icon :icon="leafOutline" class="text-xl" />
        <span class="text-[11px] mt-0.5">Pertanian</span>
      </button>

      <button
        type="button"
        @click="navigateTo('/aqua')"
        class="flex flex-col items-center flex-1 text-center transition active:scale-95 cursor-pointer outline-none"
        :class="isActive('/aqua') ? 'text-aqua-600 font-bold' : 'text-gray-500 hover:text-gray-700'"
      >
        <ion-icon :icon="waterOutline" class="text-xl" />
        <span class="text-[11px] mt-0.5">Pertambakan</span>
      </button>

      <button
        type="button"
        @click="navigateTo('/livestock')"
        class="flex flex-col items-center flex-1 text-center transition active:scale-95 cursor-pointer outline-none"
        :class="isActive('/livestock') ? 'text-livestock-600 font-bold' : 'text-gray-500 hover:text-gray-700'"
      >
        <ion-icon :icon="pawOutline" class="text-xl" />
        <span class="text-[11px] mt-0.5">Peternakan</span>
      </button>

      <button
        type="button"
        @click="navigateTo('/library')"
        class="flex flex-col items-center flex-1 text-center transition active:scale-95 cursor-pointer outline-none"
        :class="isActive('/library') ? 'text-purple-600 font-bold' : 'text-gray-500 hover:text-gray-700'"
      >
        <ion-icon :icon="bookOutline" class="text-xl" />
        <span class="text-[11px] mt-0.5">Pustaka</span>
      </button>
    </div>
  </ion-footer>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { IonFooter, IonIcon } from '@ionic/vue';
import { homeOutline, leafOutline, waterOutline, pawOutline, bookOutline } from 'ionicons/icons';
import { triggerHapticImpact } from '@/utils/haptics';

const route = useRoute();
const router = useRouter();

function isActive(path) {
  return route.path === path || route.path.startsWith(path);
}

function navigateTo(path) {
  triggerHapticImpact();
  if (route.path !== path) {
    router.push(path);
  }
}
</script>
