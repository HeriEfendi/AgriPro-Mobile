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
  const safeDosePerHa = Math.max(0, parseFloat(dosePerHa) || 0);
  const safeAreaM2 = Math.max(0, parseFloat(areaM2) || 0);
  const safeTankCapacityL = Math.max(1, parseFloat(tankCapacityL) || 16);
  const safeSprayVolumePerHaL = Math.max(1, parseFloat(sprayVolumePerHaL) || 400);

  const areaHa = safeAreaM2 / 10000;
  const totalDoseNeeded = safeDosePerHa * areaHa; // Total ml/g obat yang dibutuhkan untuk seluruh lahan
  const totalSprayVolumeNeededL = safeSprayVolumePerHaL * areaHa; // Total liter air semprot
  const totalTanks = totalSprayVolumeNeededL / safeTankCapacityL; // Estimasi total tangki
  
  const dosePerTank = totalTanks > 0 ? totalDoseNeeded / totalTanks : 0;
  const dosePerLiter = safeTankCapacityL > 0 ? dosePerTank / safeTankCapacityL : 0;

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
  const safeAreaM2 = Math.max(0, parseFloat(areaM2) || 0);
  const safeRow = parseFloat(rowSpacingM) || 0;
  const safePlant = parseFloat(plantSpacingM) || 0;
  const safeSeeds = Math.max(1, parseInt(seedsPerHole) || 1);
  const safeMargin = Math.max(0, parseFloat(safetyMarginPercent) || 10);

  if (safeRow <= 0 || safePlant <= 0 || safeAreaM2 <= 0) {
    return { population: 0, rawSeeds: 0, reserveSeeds: 0, totalSeedsNeeded: 0, areaPerPlantM2: 0 };
  }

  const areaPerPlantM2 = safeRow * safePlant;
  const population = Math.floor(safeAreaM2 / areaPerPlantM2);
  const rawSeeds = population * safeSeeds;
  const reserveSeeds = Math.ceil(rawSeeds * (safeMargin / 100));
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
  const a = (activeIngredientA || '').trim().toLowerCase();
  const b = (activeIngredientB || '').trim().toLowerCase();

  if (!a || !b || a.length < 2 || b.length < 2) {
    return { status: 'UNKNOWN', note: 'Pilih atau masukkan dua bahan aktif obat untuk memeriksa kompatibilitas campuran.' };
  }

  if (a === b) {
    return { status: 'SAFE', note: 'Bahan aktif sama. Boleh dicampur asalkan total dosis tidak melebihi rekomendasi anjuran.' };
  }

  const matrix = customMatrix || compatibilityMatrix;
  const found = matrix.find(item => {
    const itemA = item.ingredientA.toLowerCase();
    const itemB = item.ingredientB.toLowerCase();
    return (itemA.includes(a) && itemB.includes(b)) || (itemB.includes(a) && itemA.includes(b));
  });

  if (found) {
    return found;
  }

  return {
    status: 'CAUTION',
    note: 'Kombinasi bahan aktif ini belum terdaftar di matriks bahaya umum. Lakukan uji toples (jar test) terlebih dahulu: campurkan sedikit di wadah terpisah. Jika terjadi panas, buih berlebih, atau endapan menggumpal, JANGAN dicampur.'
  };
}
