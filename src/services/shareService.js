import { Share } from '@capacitor/share';

/**
 * Service Berbagi Panduan / Resep (@capacitor/share dengan Web Share & Clipboard fallback)
 */
export async function shareKnowledgeItem(item) {
  if (!item) return false;

  const title = `AgriPro: ${item.title}`;
  let text = `${item.title}\n\n`;

  if (item.symptom) {
    text += `⚠️ Gejala Lapangan:\n${item.symptom}\n\n`;
  }

  if (item.solution) {
    text += `✅ Penanganan & Dosis Taktis:\n${item.solution}\n\n`;
  }

  if (item.recipe) {
    text += `🌿 Resep Racikan: ${item.recipe.name}\n`;
    text += `Bahan:\n${item.recipe.ingredients.map(i => `- ${i}`).join('\n')}\n`;
    text += `Langkah:\n${item.recipe.steps.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}\n`;
    text += `Dosis: ${item.recipe.dose}\n`;
    if (item.recipe.warning) {
      text += `Peringatan: ${item.recipe.warning}\n`;
    }
  }

  text += `\nDibagikan melalui Aplikasi AgriPro Mobile - Solusi Pertanian, Tambak & Ternak Offline.`;

  try {
    const canShareResult = await Share.canShare();
    if (canShareResult.value) {
      await Share.share({
        title,
        text,
        dialogTitle: `Bagikan ${item.title}`
      });
      return { status: 'shared', message: 'Berhasil dibagikan' };
    }
  } catch (e) {
    // Fall through to web share
  }

  // Web Share API fallback
  if (navigator.share) {
    try {
      await navigator.share({ title, text });
      return { status: 'shared', message: 'Berhasil dibagikan' };
    } catch (e) {
      // user canceled or not allowed
    }
  }

  // Clipboard fallback
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return { status: 'copied', message: 'Teks panduan disalin ke clipboard!' };
    } catch (e) {
      console.warn('Clipboard write failed:', e);
    }
  }

  return { status: 'failed', message: 'Perangkat tidak mendukung fitur berbagi.' };
}
