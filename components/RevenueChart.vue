<template>
  <div>
    <canvas ref="chartCanvasRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount, defineProps } from 'vue';
import Chart from 'chart.js/auto'; // Importation de Chart.js v3+

const props = defineProps({
  chartData: {
    type: Object, // Doit être de la forme { labels: [], datasets: [{ label: '', data: [], ... }] }
    required: true,
    default: () => ({ labels: [], datasets: [] })
  },
  chartOptions: {
    type: Object,
    default: () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        }
      }
    })
  },
  chartType: {
    type: String,
    default: 'line', // Peut être 'bar', 'line', 'pie', etc.
  }
});

const chartCanvasRef = ref(null);
let chartInstance = null;

const renderChart = () => {
  if (chartInstance) {
    chartInstance.destroy(); // Détruire l'ancienne instance avant d'en créer une nouvelle
  }
  if (chartCanvasRef.value && props.chartData && props.chartData.labels && props.chartData.labels.length > 0) {
    const ctx = chartCanvasRef.value.getContext('2d');
    chartInstance = new Chart(ctx, {
      type: props.chartType,
      data: props.chartData,
      options: props.chartOptions
    });
  } else {
    // console.warn('RevenueChart: Canvas non prêt ou données de graphique invalides/vides.');
    // Afficher un message ou un état vide si nécessaire
    if (chartCanvasRef.value) {
        const ctx = chartCanvasRef.value.getContext('2d');
        ctx.clearRect(0, 0, chartCanvasRef.value.width, chartCanvasRef.value.height); // Nettoyer le canvas
        // Optionnel: dessiner un message "Pas de données"
        // ctx.font = "16px Arial";
        // ctx.fillStyle = "grey";
        // ctx.textAlign = "center";
        // ctx.fillText("Pas de données disponibles pour afficher le graphique.", chartCanvasRef.value.width / 2, chartCanvasRef.value.height / 2);
    }
  }
};

onMounted(() => {
  renderChart();
});

// Surveiller les changements dans chartData pour redessiner le graphique
watch(() => props.chartData, (newData) => {
  if (newData) {
    renderChart();
  }
}, { deep: true });


onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});
</script>

<style scoped>
/* Styles spécifiques si nécessaire. La taille du canvas est généralement contrôlée par son conteneur. */
/* Assurez-vous que le conteneur du canvas a une hauteur définie pour que le graphique s'affiche correctement. */
/* Par exemple, dans AdminDashboard.vue ou Accounting.vue: <div class="h-64"> ou <div style="height: 300px;"> */
div {
  position: relative; /* Nécessaire pour que le canvas soit correctement dimensionné par Chart.js */
  height: 100%; /* S'assurer que le div prend la hauteur de son parent */
  width: 100%;
}
canvas {
    display: block;
    box-sizing: border-box;
    height: 100% !important; /* Forcer la hauteur si maintainAspectRatio est false */
    width: 100% !important;
}
</style>
