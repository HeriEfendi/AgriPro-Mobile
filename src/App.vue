<template>
  <ion-app>
    <ion-router-outlet :animated="false" />
    <AppTabBar />
  </ion-app>
</template>

<script setup>
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import AppTabBar from '@/components/AppTabBar.vue';
</script>
