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
  logs: {
    type: Array,
    default: () => []
  }
});

const chartData = computed(() => {
  // Chronological order: oldest to newest for time-series display
  const orderedLogs = [...props.logs].reverse();

  const labels = orderedLogs.length ? orderedLogs.map((l, idx) => {
    if (l.date) return l.date;
    if (l.timestamp) {
      const d = new Date(l.timestamp);
      if (!isNaN(d.getTime())) {
        const day = d.getDate();
        const mon = d.getMonth() + 1;
        const hr = d.getHours().toString().padStart(2, '0');
        const min = d.getMinutes().toString().padStart(2, '0');
        return `${day}/${mon} ${hr}:${min}`;
      }
    }
    return `Log ${idx + 1}`;
  }) : ['Hari 1', 'Hari 2', 'Hari 3', 'Hari 4', 'Hari 5'];

  const phData = orderedLogs.map(l => l.ph);
  const tempData = orderedLogs.map(l => l.temp);
  const doData = orderedLogs.map(l => l.do_level);

  return {
    labels,
    datasets: [
      {
        label: 'pH Air',
        data: phData.length ? phData : [7.2, 7.5, 6.8, 7.4, 7.6],
        borderColor: '#0284c7',
        backgroundColor: 'rgba(2, 132, 199, 0.1)',
        fill: false,
        tension: 0.3
      },
      {
        label: 'Suhu (°C)',
        data: tempData.length ? tempData : [28.5, 29.0, 28.2, 29.5, 28.8],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: false,
        tension: 0.3
      },
      {
        label: 'DO (mg/L)',
        data: doData.length ? doData : [5.2, 4.8, 5.5, 5.1, 4.9],
        borderColor: '#16a34a',
        backgroundColor: 'rgba(22, 163, 74, 0.1)',
        fill: false,
        tension: 0.3
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
      labels: {
        font: { size: 11 }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: false
    }
  }
};
</script>
