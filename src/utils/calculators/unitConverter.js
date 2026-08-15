/**
 * Utility Konversi Satuan Tradisional Lapangan ke Standar Internasional (SI)
 */

export const UBIN_IN_M2 = 14.0625;
export const BAHU_IN_M2 = 7096.5;
export const GEMBOR_IN_ML = 10000;
export const SENDOK_IN_ML = 15;

export function ubinToM2(ubin) {
  return (parseFloat(ubin) || 0) * UBIN_IN_M2;
}

export function m2ToUbin(m2) {
  return (parseFloat(m2) || 0) / UBIN_IN_M2;
}

export function bahuToM2(bahu) {
  return (parseFloat(bahu) || 0) * BAHU_IN_M2;
}

export function m2ToBahu(m2) {
  return (parseFloat(m2) || 0) / BAHU_IN_M2;
}

export function haToM2(ha) {
  return (parseFloat(ha) || 0) * 10000;
}

export function gemborToMl(gembor) {
  return (parseFloat(gembor) || 0) * GEMBOR_IN_ML;
}

export function sendokToMl(sendok) {
  return (parseFloat(sendok) || 0) * SENDOK_IN_ML;
}

export function ppmToGramPerM3(ppm) {
  // 1 ppm (part per million) = 1 gram per meter kubik air (1 g/m3)
  return parseFloat(ppm) || 0;
}
