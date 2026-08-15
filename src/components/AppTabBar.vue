<template>
  <ion-tab-bar slot="bottom" color="light" class="border-t border-gray-200">
    <ion-tab-button tab="dashboard" href="/dashboard">
      <ion-icon :icon="homeOutline" />
      <ion-label class="text-xs">Beranda</ion-label>
    </ion-tab-button>

    <ion-tab-button tab="agri" href="/agri">
      <ion-icon :icon="leafOutline" />
      <ion-label class="text-xs">Pertanian</ion-label>
    </ion-tab-button>

    <ion-tab-button tab="aqua" href="/aqua">
      <ion-icon :icon="waterOutline" />
      <ion-label class="text-xs">Pertambakan</ion-label>
    </ion-tab-button>

    <ion-tab-button tab="livestock" href="/livestock">
      <ion-icon :icon="pawOutline" />
      <ion-label class="text-xs">Peternakan</ion-label>
    </ion-tab-button>

    <ion-tab-button tab="library" href="/library">
      <ion-icon :icon="bookOutline" />
      <ion-label class="text-xs">Pustaka</ion-label>
    </ion-tab-button>
  </ion-tab-bar>
</template>

<script setup>
import { IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/vue';
import { homeOutline, leafOutline, waterOutline, pawOutline, bookOutline } from 'ionicons/icons';
</script>
