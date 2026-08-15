import { defineStore } from 'pinia';
import { ref } from 'vue';
import { db } from '@/services/db';

export const useProfileStore = defineStore('profile', () => {
  const activeRole = ref('tani'); // 'tani' | 'tambak' | 'ternak'
  const namaLahan = ref('Lahan Utama');
  const unitPreference = ref({
    area: 'm2',
    volume: 'ml',
    concentration: 'ppm'
  });

  async function loadProfile() {
    try {
      const savedProfile = await db.profiles.get('default');
      if (savedProfile) {
        activeRole.value = savedProfile.role || 'tani';
        namaLahan.value = savedProfile.nama_lahan || 'Lahan Utama';
        if (savedProfile.unit_preference) {
          unitPreference.value = savedProfile.unit_preference;
        }
      }
    } catch (e) {
      console.warn('Profile load error from Dexie:', e);
    }
  }

  async function setRole(role) {
    if (['tani', 'tambak', 'ternak'].includes(role)) {
      activeRole.value = role;
      await saveProfile();
    }
  }

  async function setNamaLahan(nama) {
    namaLahan.value = nama;
    await saveProfile();
  }

  async function saveProfile() {
    try {
      await db.profiles.put({
        id: 'default',
        role: activeRole.value,
        nama_lahan: namaLahan.value,
        unit_preference: unitPreference.value
      });
    } catch (e) {
      console.error('Profile save error to Dexie:', e);
    }
  }

  // Load profile from Dexie IndexedDB on store creation
  loadProfile();

  return {
    activeRole,
    namaLahan,
    unitPreference,
    setRole,
    setNamaLahan,
    loadProfile
  };
});
