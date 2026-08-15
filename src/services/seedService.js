import { db } from './db';
import knowledgeSeed from '../data/knowledgeSeed.json';

export async function initSeedData() {
  try {
    const count = await db.offline_knowledge.count();
    if (count === 0) {
      console.log('Seeding initial offline knowledge data...');
      await db.offline_knowledge.bulkAdd(knowledgeSeed);
      console.log(`Successfully seeded ${knowledgeSeed.length} knowledge items.`);
    }

    // Default profile check
    const profileCount = await db.profiles.count();
    if (profileCount === 0) {
      await db.profiles.add({
        id: 'default',
        role: 'tani',
        nama_lahan: 'Lahan Utama',
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
