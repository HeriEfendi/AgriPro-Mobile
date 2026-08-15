<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>AgriPro Dashboard</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="p-4 bg-white rounded-xl shadow-md border border-gray-100">
        <h2 class="text-xl font-bold text-gray-800">Selamat Datang di AgriPro Mobile</h2>
        <p class="text-sm text-gray-600 mt-1">Super-App Offline-First untuk Sektor Pertanian, Pertambakan, dan Peternakan.</p>
        <div class="mt-4 p-3 bg-agri-50 text-agri-800 rounded-lg text-xs font-semibold">
          Role Aktif: {{ profileStore.activeRole.toUpperCase() }}
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import { useProfileStore } from '@/stores/useProfileStore';

const profileStore = useProfileStore();
</script>
