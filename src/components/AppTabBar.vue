<template>
  <ion-tab-bar slot="bottom" color="light" class="border-t border-gray-200 py-1">
    <ion-tab-button
      tab="dashboard"
      @click="navigateTo('/dashboard')"
      :class="{ 'tab-selected text-agri-600': isActive('/dashboard') }"
    >
      <ion-icon :icon="homeOutline" />
      <ion-label class="text-[11px] font-medium">Beranda</ion-label>
    </ion-tab-button>

    <ion-tab-button
      tab="agri"
      @click="navigateTo('/agri')"
      :class="{ 'tab-selected text-agri-600': isActive('/agri') }"
    >
      <ion-icon :icon="leafOutline" />
      <ion-label class="text-[11px] font-medium">Pertanian</ion-label>
    </ion-tab-button>

    <ion-tab-button
      tab="aqua"
      @click="navigateTo('/aqua')"
      :class="{ 'tab-selected text-aqua-600': isActive('/aqua') }"
    >
      <ion-icon :icon="waterOutline" />
      <ion-label class="text-[11px] font-medium">Pertambakan</ion-label>
    </ion-tab-button>

    <ion-tab-button
      tab="livestock"
      @click="navigateTo('/livestock')"
      :class="{ 'tab-selected text-livestock-600': isActive('/livestock') }"
    >
      <ion-icon :icon="pawOutline" />
      <ion-label class="text-[11px] font-medium">Peternakan</ion-label>
    </ion-tab-button>

    <ion-tab-button
      tab="library"
      @click="navigateTo('/library')"
      :class="{ 'tab-selected text-purple-600': isActive('/library') }"
    >
      <ion-icon :icon="bookOutline" />
      <ion-label class="text-[11px] font-medium">Pustaka</ion-label>
    </ion-tab-button>
  </ion-tab-bar>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/vue';
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
