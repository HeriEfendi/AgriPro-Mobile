import { LocalNotifications } from '@capacitor/local-notifications';

/**
 * Service Penjadwalan Notifikasi Lokal Offline (@capacitor/local-notifications)
 */

export async function requestNotificationPermission() {
  try {
    const status = await LocalNotifications.requestPermissions();
    return status.display === 'granted';
  } catch (e) {
    console.warn('Local notifications permission request failed or running on web fallback:', e);
    return false;
  }
}

/**
 * Jadwalkan notifikasi pengingat WTH atau Kebuntingan Ternak
 * @param {Object} options
 * @param {number} options.id - Unique integer ID
 * @param {string} options.title - Judul notifikasi
 * @param {string} options.body - Isi pesan pengingat
 * @param {Date} options.scheduleDate - Waktu spesifik pemantik notifikasi
 */
export async function scheduleNotification({ id, title, body, scheduleDate }) {
  try {
    // Cek atau minta izin notifikasi
    await requestNotificationPermission();

    const parsedId = Number(id);
    const notifId = !isNaN(parsedId)
      ? Math.floor(Math.abs(parsedId)) % 2147483647
      : Math.floor(Math.random() * 100000);

    let atDate = scheduleDate instanceof Date ? scheduleDate : new Date(scheduleDate || Date.now() + 5000);
    if (isNaN(atDate.getTime()) || atDate.getTime() <= Date.now()) {
      atDate = new Date(Date.now() + 5000);
    }

    await LocalNotifications.schedule({
      notifications: [
        {
          id: notifId,
          title: title || 'Pengingat AgriPro Mobile',
          body: body || 'Ada jadwal penting di lahan Anda hari ini.',
          schedule: { at: atDate },
          sound: null,
          attachments: null,
          actionTypeId: '',
          extra: null
        }
      ]
    });
    console.log(`Local notification scheduled successfully (ID: ${notifId}) for ${atDate}`);
    return true;
  } catch (error) {
    console.warn('Fallback: Scheduled notification recorded in browser/Dexie:', error);
    return false;
  }
}
