<template>
  <div class="w-full bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
    <div class="h-56">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Filler
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, Filler);

const props = defineProps({
  samples: {
    type: Array,
    default: () => []
  }
});

const chartData = computed(() => {
  const labels = props.samples.map(s => `Minggu ${s.week || 1}`);
  const abwData = props.samples.map(s => s.abwGram);

  return {
    labels: labels.length ? labels : ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4', 'Minggu 5'],
    datasets: [
      {
        label: 'Berat Rata-Rata ABW (gram)',
        data: abwData.length ? abwData : [2.5, 5.0, 8.5, 12.0, 16.5],
        borderColor: '#16a34a',
        backgroundColor: 'rgba(22, 163, 74, 0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: { font: { size: 11 } }
    }
  }
};
</script>
