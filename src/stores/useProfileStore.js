import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useProfileStore = defineStore('profile', () => {
  const activeRole = ref('tani'); // 'tani' | 'tambak' | 'ternak'
  const namaLahan = ref('Lahan Utama');
  const unitPreference = ref({
    area: 'm2',
    volume: 'ml',
    concentration: 'ppm'
  });

  function setRole(role) {
    if (['tani', 'tambak', 'ternak'].includes(role)) {
      activeRole.value = role;
    }
  }

  function setNamaLahan(nama) {
    namaLahan.value = nama;
  }

  return {
    activeRole,
    namaLahan,
    unitPreference,
    setRole,
    setNamaLahan
  };
});
