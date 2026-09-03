/**
 * Kalkulator Peternakan (Livestock) - Feed Blender Pearson Square Formulation
 */

/**
 * Formulasi 2 bahan pakan menggunakan metode Pearson Square
 * @param {string} name1 - Nama bahan 1 (misal: Jagung Halus)
 * @param {number} cp1 - Kadar Protein Kasar (Crude Protein %) bahan 1
 * @param {string} name2 - Nama bahan 2 (misal: Konsentrat Super)
 * @param {number} cp2 - Kadar Protein Kasar (Crude Protein %) bahan 2
 * @param {number} targetCP - Target Kadar Protein Kasar (%) campuran ransum
 * @param {number} totalBatchKg - Total berat adonan pakan yang ingin dibuat (kg), default 100 kg
 */
export function calculatePearsonSquare(name1, cp1, name2, cp2, targetCP, totalBatchKg = 100) {
  const safeCp1 = parseFloat(cp1) || 0;
  const safeCp2 = parseFloat(cp2) || 0;
  const safeTarget = parseFloat(targetCP) || 0;
  const safeBatch = Math.max(1, parseFloat(totalBatchKg) || 100);

  const minCP = Math.min(safeCp1, safeCp2);
  const maxCP = Math.max(safeCp1, safeCp2);

  if (safeTarget <= minCP || safeTarget >= maxCP || minCP === maxCP) {
    return {
      isValid: false,
      message: `Target Protein Kasar (${safeTarget}%) harus berada di antara kadar CP ${name1} (${safeCp1}%) dan ${name2} (${safeCp2}%).`
    };
  }

  // Hitung selisih silang Pearson Square
  const parts1 = Math.abs(safeCp2 - safeTarget); // Bagian bahan 1
  const parts2 = Math.abs(safeCp1 - safeTarget); // Bagian bahan 2
  const totalParts = parts1 + parts2;

  if (totalParts <= 0) {
    return { isValid: false, message: 'Total bagian racikan pakan tidak valid.' };
  }

  const percent1 = (parts1 / totalParts) * 100;
  const percent2 = (parts2 / totalParts) * 100;

  const kg1 = (percent1 / 100) * safeBatch;
  const kg2 = (percent2 / 100) * safeBatch;

  return {
    isValid: true,
    totalBatchKg: safeBatch,
    targetCP: safeTarget,
    ingredient1: {
      name: name1 || 'Bahan 1',
      cp: safeCp1,
      parts: Number(parts1.toFixed(2)),
      percent: Number(percent1.toFixed(2)),
      kg: Number(kg1.toFixed(2))
    },
    ingredient2: {
      name: name2 || 'Bahan 2',
      cp: safeCp2,
      parts: Number(parts2.toFixed(2)),
      percent: Number(percent2.toFixed(2)),
      kg: Number(kg2.toFixed(2))
    }
  };
}
