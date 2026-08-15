import compatibilityMatrix from '../../data/chemicalCompatibility.json' with { type: 'json' };

/**
 * Kalkulator Racik Tangki Semprot (AgriMix)
 */

/**
 * Hitung dosis obat per tangki semprot
 * @param {number} dosePerHa - Dosis rekomendasi obat per Hektar (ml/Ha atau g/Ha)
 * @param {number} areaM2 - Luas lahan tanaman dalam meter persegi (m2)
 * @param {number} tankCapacityL - Kapasitas volume tangki semprot (Liter), default 16L
 * @param {number} sprayVolumePerHaL - Estimasi volume semprot total per Ha (Liter/Ha), default 400L/Ha
 */
export function calculateTankDose(dosePerHa, areaM2, tankCapacityL = 16, sprayVolumePerHaL = 400) {
  const areaHa = areaM2 / 10000;
  const totalDoseNeeded = dosePerHa * areaHa; // Total ml/g obat yang dibutuhkan untuk seluruh lahan
  const totalSprayVolumeNeededL = sprayVolumePerHaL * areaHa; // Total liter air semprot
  const totalTanks = totalSprayVolumeNeededL / tankCapacityL; // Estimasi total tangki
  
  const dosePerTank = totalTanks > 0 ? totalDoseNeeded / totalTanks : 0;
  const dosePerLiter = tankCapacityL > 0 ? dosePerTank / tankCapacityL : 0;

  return {
    areaHa: Number(areaHa.toFixed(4)),
    totalDoseNeeded: Number(totalDoseNeeded.toFixed(2)),
    totalSprayVolumeNeededL: Number(totalSprayVolumeNeededL.toFixed(1)),
    totalTanks: Number(totalTanks.toFixed(1)),
    dosePerTank: Number(dosePerTank.toFixed(2)),
    dosePerLiter: Number(dosePerLiter.toFixed(2))
  };
}

/**
 * Hitung estimasi populasi tanaman & kebutuhan bibit
 * @param {number} areaM2 - Luas lahan (m2)
 * @param {number} rowSpacingM - Jarak tanam antar barisan (Meter)
 * @param {number} plantSpacingM - Jarak tanam dalam barisan (Meter)
 * @param {number} seedsPerHole - Jumlah benih/bibit per lubang tanam (default 1)
 * @param {number} safetyMarginPercent - Margin cadangan penyulaman %, default 10%
 */
export function calculatePlantPopulation(areaM2, rowSpacingM, plantSpacingM, seedsPerHole = 1, safetyMarginPercent = 10) {
  if (!rowSpacingM || !plantSpacingM || rowSpacingM <= 0 || plantSpacingM <= 0) {
    return { population: 0, totalSeedsNeeded: 0 };
  }

  const areaPerPlantM2 = rowSpacingM * plantSpacingM;
  const population = Math.floor(areaM2 / areaPerPlantM2);
  const rawSeeds = population * seedsPerHole;
  const reserveSeeds = Math.ceil(rawSeeds * (safetyMarginPercent / 100));
  const totalSeedsNeeded = rawSeeds + reserveSeeds;

  return {
    areaPerPlantM2: Number(areaPerPlantM2.toFixed(4)),
    population,
    rawSeeds,
    reserveSeeds,
    totalSeedsNeeded
  };
}

/**
 * Cek batas bahaya & kompatibilitas pencampuran 2 jenis bahan aktif obat
 * @param {string} activeIngredientA 
 * @param {string} activeIngredientB 
 * @param {Array} customMatrix - Optional custom matrix array
 */
export function checkChemicalCompatibility(activeIngredientA, activeIngredientB, customMatrix = null) {
  if (!activeIngredientA || !activeIngredientB) {
    return { status: 'UNKNOWN', note: 'Pilih dua bahan aktif obat untuk memeriksa kompatibilitas.' };
  }

  const matrix = customMatrix || compatibilityMatrix;
  const found = matrix.find(item =>
    (item.ingredientA.toLowerCase().includes(activeIngredientA.toLowerCase()) && item.ingredientB.toLowerCase().includes(activeIngredientB.toLowerCase())) ||
    (item.ingredientB.toLowerCase().includes(activeIngredientA.toLowerCase()) && item.ingredientA.toLowerCase().includes(activeIngredientB.toLowerCase()))
  );

  if (found) {
    return found;
  }

  return {
    status: 'CAUTION',
    note: 'Kombinasi bahan aktif ini belum terdaftar di matriks bahaya. Lakukan uji jar test (campur sedikit di gelas) terlebih dahulu. Jika berbusa panas, menggumpal, atau memisah, JANGAN dicampur.'
  };
}
