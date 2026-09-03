import Dexie from 'dexie';

export const db = new Dexie('AgriProDB');

db.version(1).stores({
  profiles: 'id, role, nama_lahan, unit_preference',
  water_logs: '++id, timestamp, ph, salinity, temp, do_level, pond_id',
  crop_schedules: '++id, crop_name, plant_date, wth_days, harvest_date',
  breeding_logs: '++id, animal_tag, ib_date, expected_birth_date, vaccine_status',
  offline_knowledge: '++id, category, symptom, solution, *tags'
});

// v2: add avatar (base64 DataURL) and nama_pengguna fields
db.version(2).stores({
  profiles: 'id, role, nama_lahan, nama_pengguna, avatar, unit_preference',
  water_logs: '++id, timestamp, ph, salinity, temp, do_level, pond_id',
  crop_schedules: '++id, crop_name, plant_date, wth_days, harvest_date',
  breeding_logs: '++id, animal_tag, ib_date, expected_birth_date, vaccine_status',
  offline_knowledge: '++id, category, symptom, solution, *tags'
});

/* Helper CRUD operations with error handling */

// Water Logs
export async function addWaterLog(logData) {
  return await db.water_logs.add({
    timestamp: new Date().toISOString(),
    ...logData
  });
}

export async function getAllWaterLogs() {
  return await db.water_logs.orderBy('id').reverse().toArray();
}

export async function deleteWaterLog(id) {
  return await db.water_logs.delete(id);
}

// Crop Schedules
export async function addCropSchedule(scheduleData) {
  return await db.crop_schedules.add({
    createdAt: new Date().toISOString(),
    ...scheduleData
  });
}

export async function getAllCropSchedules() {
  return await db.crop_schedules.orderBy('id').reverse().toArray();
}

export async function deleteCropSchedule(id) {
  return await db.crop_schedules.delete(id);
}

// Breeding Logs
export async function addBreedingLog(breedingData) {
  return await db.breeding_logs.add({
    createdAt: new Date().toISOString(),
    ...breedingData
  });
}

export async function getAllBreedingLogs() {
  return await db.breeding_logs.orderBy('id').reverse().toArray();
}

export async function deleteBreedingLog(id) {
  return await db.breeding_logs.delete(id);
}

// Search Offline Knowledge Fuzzy Query (Task 4.4)
export async function searchKnowledge(query = '', category = 'all') {
  let collection = db.offline_knowledge;
  let items = await collection.toArray();

  if (category && category !== 'all') {
    items = items.filter(item => item.category === category);
  }

  if (!query || !query.trim()) {
    return items;
  }

  const q = query.toLowerCase().trim();
  return items.filter(item =>
    item.title?.toLowerCase().includes(q) ||
    item.name?.toLowerCase().includes(q) ||
    item.parts?.toLowerCase().includes(q) ||
    item.recipe?.name?.toLowerCase().includes(q) ||
    item.recipe?.ingredients?.some(i => i.toLowerCase().includes(q)) ||
    item.recipe?.dose?.toLowerCase().includes(q) ||
    item.recipe?.warning?.toLowerCase().includes(q) ||
    item.symptom?.toLowerCase().includes(q) ||
    item.solution?.toLowerCase().includes(q) ||
    item.tags?.some(t => t.toLowerCase().includes(q))
  );
}
