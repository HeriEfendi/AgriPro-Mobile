/**
 * Kalkulator Pertambakan (Aqua) - FCR, Feed Rate, Biomassa, & ADG
 */

/**
 * Hitung Feed Conversion Ratio (FCR)
 * @param {number} totalFeedKg - Total akumulasi pakan yang sudah diberikan (kg)
 * @param {number} finalBiomassKg - Total estimasi/panen biomassa akhir (kg)
 * @param {number} initialBiomassKg - Total biomassa awal tebar (kg), default 0
 */
export function calculateFCR(totalFeedKg, finalBiomassKg, initialBiomassKg = 0) {
  const safeFeed = Math.max(0, parseFloat(totalFeedKg) || 0);
  const safeFinal = Math.max(0, parseFloat(finalBiomassKg) || 0);
  const safeInitial = Math.max(0, parseFloat(initialBiomassKg) || 0);

  const netWeightGainKg = safeFinal - safeInitial;
  if (netWeightGainKg <= 0 || safeFeed <= 0) {
    return { fcr: 0, status: 'INVALID', description: 'Biomassa akhir harus lebih besar dari biomassa awal dan pakan harus > 0.' };
  }

  const fcr = safeFeed / netWeightGainKg;
  let status = 'GOOD';
  let description = 'Nilai FCR normal dan efisien.';

  if (fcr < 1.1) {
    status = 'EXCELLENT';
    description = 'Sangat efisien! Penggunaan pakan sangat optimal.';
  } else if (fcr > 1.5) {
    status = 'WARNING';
    description = 'Pemborosan pakan! Cek kualitas air, sisa pakan di dasar kolam, atau kesehatan bibit.';
  }

  return {
    netWeightGainKg: Number(netWeightGainKg.toFixed(2)),
    fcr: Number(fcr.toFixed(2)),
    status,
    description
  };
}

/**
 * Hitung pakan harian & estimasi biomassa kolam
 * @param {number} population - Estimasi jumlah populasi ikan/udang hidup
 * @param {number} abwGram - Average Body Weight (Rata-rata berat per ekor dalam gram)
 * @param {number} feedingRatePercent - Persentase feeding rate harian (1.5% - 5% dari biomassa)
 */
export function calculateDailyFeed(population, abwGram, feedingRatePercent = 3) {
  const safePop = Math.max(0, parseFloat(population) || 0);
  const safeAbw = Math.max(0, parseFloat(abwGram) || 0);
  const safeFr = Math.max(0, parseFloat(feedingRatePercent) || 3);

  const totalBiomassKg = (safePop * safeAbw) / 1000;
  const dailyFeedKg = totalBiomassKg * (safeFr / 100);

  return {
    totalBiomassKg: Number(totalBiomassKg.toFixed(2)),
    dailyFeedKg: Number(dailyFeedKg.toFixed(2)),
    feedPerMeal3xKg: Number((dailyFeedKg / 3).toFixed(2)),
    feedPerMeal4xKg: Number((dailyFeedKg / 4).toFixed(2))
  };
}

/**
 * Hitung Laju Pertumbuhan Harian / Average Daily Gain (ADG)
 * @param {number} weightEndGram - Rata-rata berat sampling akhir (gram)
 * @param {number} weightStartGram - Rata-rata berat sampling awal (gram)
 * @param {number} daysCount - Jarak hari antara 2 kali sampling
 */
export function calculateADG(weightEndGram, weightStartGram, daysCount) {
  const safeEnd = parseFloat(weightEndGram) || 0;
  const safeStart = parseFloat(weightStartGram) || 0;
  const safeDays = Math.max(1, parseFloat(daysCount) || 1);

  const weightGain = safeEnd - safeStart;
  const adgGramPerDay = weightGain / safeDays;

  return {
    weightGainGram: Number(weightGain.toFixed(2)),
    adgGramPerDay: Number(adgGramPerDay.toFixed(2))
  };
}
