import { db } from './db';
import knowledgeSeed from '../data/knowledgeSeed.json';
import herbalSeed from '../data/herbalSeed.json';

export async function initSeedData() {
  try {
    const existingCount = await db.offline_knowledge.count();
    const seedData = [...knowledgeSeed, ...herbalSeed];
    if (existingCount < seedData.length) {
      console.log('Syncing offline knowledge seed data...');
      await db.offline_knowledge.bulkPut(seedData);
      console.log(`Successfully synced ${seedData.length} knowledge items.`);
    }

    // Default profile check
    const profileCount = await db.profiles.count();
    if (profileCount === 0) {
      await db.profiles.add({
        id: 'default',
        role: 'tani',
        nama_lahan: 'Lahan Utama',
        nama_pengguna: 'Pengguna AgriPro',
        avatar: null,
        unit_preference: {
          area: 'm2',
          volume: 'ml',
          concentration: 'ppm'
        }
      });
    }
  } catch (error) {
    console.error('Error seeding data to Dexie.js:', error);
  }
}
