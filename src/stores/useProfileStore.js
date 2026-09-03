import { defineStore } from 'pinia';
import { ref, toRaw } from 'vue';
import { db } from '@/services/db';

export const useProfileStore = defineStore('profile', () => {
  const activeRole = ref('tani'); // 'tani' | 'tambak' | 'ternak'
  const namaLahan = ref('Lahan Utama');
  const namaPengguna = ref('Pengguna AgriPro');
  const avatarUrl = ref(null); // base64 DataURL string or null

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
        namaPengguna.value = savedProfile.nama_pengguna || 'Pengguna AgriPro';
        avatarUrl.value = savedProfile.avatar || null;
        if (savedProfile.unit_preference) {
          unitPreference.value = savedProfile.unit_preference;
        }
      }
    } catch (e) {
      console.warn('Profile load error from Dexie:', e);
    }
  }

  async function saveProfile() {
    try {
      await db.profiles.put({
        id: 'default',
        role: activeRole.value,
        nama_lahan: namaLahan.value,
        nama_pengguna: namaPengguna.value,
        avatar: avatarUrl.value,
        unit_preference: { ...toRaw(unitPreference.value) }
      });
    } catch (e) {
      console.error('Profile save error to Dexie:', e);
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

  async function setNamaPengguna(nama) {
    namaPengguna.value = nama;
    await saveProfile();
  }

  async function setAvatarUrl(url) {
    avatarUrl.value = url;
    await saveProfile();
  }

  // Load profile from Dexie IndexedDB on store creation
  loadProfile();

  return {
    activeRole,
    namaLahan,
    namaPengguna,
    avatarUrl,
    unitPreference,
    setRole,
    setNamaLahan,
    setNamaPengguna,
    setAvatarUrl,
    loadProfile
  };
});
