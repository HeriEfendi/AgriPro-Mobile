import { ubinToM2, bahuToM2, sendokToMl, gemborToMl, ppmToGramPerM3 } from '../unitConverter.js';
import { calculateTankDose, calculatePlantPopulation, checkChemicalCompatibility } from '../agriMixCalc.js';
import { calculateFCR, calculateDailyFeed, calculateADG } from '../aquaFcrCalc.js';
import { calculatePearsonSquare } from '../feedBlenderCalc.js';

console.log('--- TESTING UNIT CONVERTER ---');
console.assert(ubinToM2(10) === 140.625, '10 ubin should be 140.625 m2');
console.assert(bahuToM2(1) === 7096.5, '1 bahu should be 7096.5 m2');
console.assert(sendokToMl(2) === 30, '2 sendok should be 30 ml');
console.assert(gemborToMl(1) === 10000, '1 gembor should be 10000 ml');
console.assert(ppmToGramPerM3(5) === 5, '5 ppm should be 5 g/m3');

console.log('--- TESTING AGRI MIX CALCULATOR ---');
const doseResult = calculateTankDose(1000, 10000, 16, 400); // 1Ha, 1000ml/Ha, 16L tank, 400L/Ha spray volume
console.assert(doseResult.totalTanks === 25, 'Total tanks should be 25');
console.assert(doseResult.dosePerTank === 40, 'Dose per tank should be 40 ml');

const popResult = calculatePlantPopulation(1000, 0.5, 0.2); // 1000m2, 0.5m x 0.2m
console.assert(popResult.population === 10000, 'Population should be 10000');

const compResult = checkChemicalCompatibility('Mankozeb', 'Abamektin');
console.assert(compResult.status === 'SAFE', 'Mankozeb + Abamektin should be SAFE');

console.log('--- TESTING AQUA FCR CALCULATOR ---');
const fcrResult = calculateFCR(120, 100, 0);
console.assert(fcrResult.fcr === 1.2, 'FCR should be 1.2');

const feedResult = calculateDailyFeed(10000, 10, 3); // 10k fish, 10g each = 100kg biomass, 3% feed rate = 3kg feed
console.assert(feedResult.totalBiomassKg === 100, 'Biomass should be 100 kg');
console.assert(feedResult.dailyFeedKg === 3, 'Daily feed should be 3 kg');

const adgResult = calculateADG(15, 5, 10); // 5g to 15g over 10 days = 1g/day
console.assert(adgResult.adgGramPerDay === 1, 'ADG should be 1 g/day');

console.log('--- TESTING FEED BLENDER (PEARSON SQUARE) ---');
const blendResult = calculatePearsonSquare('Jagung', 9, 'Konsentrat', 35, 16, 100);
console.assert(blendResult.isValid === true, 'Pearson square blend should be valid');
console.assert(blendResult.ingredient1.kg === 73.08, 'Jagung kg should be ~73.08 kg');
console.assert(blendResult.ingredient2.kg === 26.92, 'Konsentrat kg should be ~26.92 kg');

console.log('✅ ALL CALCULATOR UNIT TESTS PASSED SUCCESSFULLY!');
