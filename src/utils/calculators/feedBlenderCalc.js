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
  // Validasi target harus berada di antara CP1 dan CP2
  const minCP = Math.min(cp1, cp2);
  const maxCP = Math.max(cp1, cp2);

  if (targetCP <= minCP || targetCP >= maxCP) {
    return {
      isValid: false,
      message: `Target Protein Kasar (${targetCP}%) harus berada di antara kadar CP ${name1} (${cp1}%) dan ${name2} (${cp2}%).`
    };
  }

  // Hitung selisih silang Pearson Square
  const parts1 = Math.abs(cp2 - targetCP); // Bagian bahan 1
  const parts2 = Math.abs(cp1 - targetCP); // Bagian bahan 2
  const totalParts = parts1 + parts2;

  const percent1 = (parts1 / totalParts) * 100;
  const percent2 = (parts2 / totalParts) * 100;

  const kg1 = (percent1 / 100) * totalBatchKg;
  const kg2 = (percent2 / 100) * totalBatchKg;

  return {
    isValid: true,
    totalBatchKg,
    targetCP,
    ingredient1: {
      name: name1,
      cp: cp1,
      parts: Number(parts1.toFixed(2)),
      percent: Number(percent1.toFixed(2)),
      kg: Number(kg1.toFixed(2))
    },
    ingredient2: {
      name: name2,
      cp: cp2,
      parts: Number(parts2.toFixed(2)),
      percent: Number(percent2.toFixed(2)),
      kg: Number(kg2.toFixed(2))
    }
  };
}
