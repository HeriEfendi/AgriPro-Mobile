import Dexie from 'dexie';

export const db = new Dexie('AgriProDB');

db.version(1).stores({
  profiles: 'id, role, nama_lahan, unit_preference',
  water_logs: '++id, timestamp, ph, salinity, temp, do_level, pond_id',
  crop_schedules: '++id, crop_name, plant_date, wth_days, harvest_date',
  breeding_logs: '++id, animal_tag, ib_date, expected_birth_date, vaccine_status',
  offline_knowledge: '++id, category, symptom, solution, *tags'
});
