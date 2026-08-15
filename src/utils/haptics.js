import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

/**
 * Helper Utility Haptic Feedback (@capacitor/haptics)
 */

export async function triggerHapticImpact(style = ImpactStyle.Medium) {
  try {
    await Haptics.impact({ style });
  } catch (e) {
    // Fallback for browsers without Capacitor Haptics support
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
  }
}

export async function triggerHapticSuccess() {
  try {
    await Haptics.notification({ type: NotificationType.Success });
  } catch (e) {
    if ('vibrate' in navigator) {
      navigator.vibrate([40, 30, 40]);
    }
  }
}
