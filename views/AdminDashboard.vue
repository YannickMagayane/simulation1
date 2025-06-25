<template>
  <div class="p-6 bg-gradient-to-br from-slate-900 to-slate-800 min-h-screen text-white">
    <h1 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-10">
      Tableau de Bord Administrateur
    </h1>

    <!-- Cartes Résumées Améliorées -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
      <!-- Carte Chambres Occupées -->
      <div class="bg-slate-800/70 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-slate-700 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-semibold text-slate-300">Chambres Occupées</h3>
          <div class="bg-red-500/20 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-400 h-6 w-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M12 12H8m8 0h-4m0 0V8m0 8v-4"></path></svg> <!-- Bed icon variant -->
          </div>
        </div>
        <p class="text-5xl font-bold text-red-400 mt-2">{{ occupiedRooms }}</p>
        <p class="text-sm text-slate-500 mt-1">+2 par rapport à hier</p>
      </div>

      <!-- Carte Chambres Libres -->
      <div class="bg-slate-800/70 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-slate-700 hover:border-green-500 transition-all duration-300 transform hover:-translate-y-1">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-semibold text-slate-300">Chambres Libres</h3>
          <div class="bg-green-500/20 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-400 h-6 w-6"><path d="M2 3v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V3"></path><path d="m2 9 20 0"></path><path d="M12 14h.01"></path></svg> <!-- Bed icon -->
          </div>
        </div>
        <p class="text-5xl font-bold text-green-400 mt-2">{{ freeRooms }}</p>
        <p class="text-sm text-slate-500 mt-1">Taux d'occupation: {{ occupancyRate }}%</p>
      </div>

      <!-- Carte Ventes Bar -->
      <div class="bg-slate-800/70 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-slate-700 hover:border-sky-500 transition-all duration-300 transform hover:-translate-y-1">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-semibold text-slate-300">Ventes Bar (Jour)</h3>
           <div class="bg-sky-500/20 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-sky-400 h-6 w-6"><path d="M21 5H3L2 12h19l-1-7Z"></path><path d="M7 12v5a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-5"></path><path d="M12 12v10"></path><path d="m12 8 1.5-3-3.5-1L8.5 8"></path></svg> <!-- Martini Glass icon -->
          </div>
        </div>
        <p class="text-5xl font-bold text-sky-400 mt-2">{{ formatCurrency(barSales) }}</p>
        <p class="text-sm text-slate-500 mt-1">15 commandes</p>
      </div>

      <!-- Carte Ventes Restaurant -->
      <div class="bg-slate-800/70 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-slate-700 hover:border-amber-500 transition-all duration-300 transform hover:-translate-y-1">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-semibold text-slate-300">Ventes Resto (Jour)</h3>
          <div class="bg-amber-500/20 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-400 h-6 w-6"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Z"></path></svg> <!-- Utensils icon -->
          </div>
        </div>
        <p class="text-5xl font-bold text-amber-400 mt-2">{{ formatCurrency(restaurantSales) }}</p>
        <p class="text-sm text-slate-500 mt-1">32 couverts</p>
      </div>
    </div>

    <!-- Graphique des Ventes Hebdomadaires -->
    <div class="bg-slate-800/70 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-slate-700 mb-10">
      <h3 class="text-xl font-semibold text-slate-300 mb-4">Revenus Hebdomadaires</h3>
      <div class="h-80"> {/* Hauteur définie pour le graphique */}
        <RevenueChart :chart-data="weeklyRevenueData" :chart-options="chartOptions" v-if="weeklyRevenueData" />
         <div v-else class="flex items-center justify-center h-full">
            <p class="text-slate-500">Chargement des données du graphique...</p>
        </div>
      </div>
    </div>

     <!-- Notifications Récentes & Top Produits -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="bg-slate-800/70 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-slate-700">
        <h3 class="text-xl font-semibold text-slate-300 mb-4">Notifications Récentes</h3>
        <ul class="space-y-3">
          <li class="flex items-start p-3 bg-slate-700/50 rounded-lg hover:bg-slate-600/50 transition-colors">
            <div class="bg-blue-500/30 p-2 rounded-full mr-3 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-300"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            <div>
                <p class="text-slate-200 text-sm">Nouvelle réservation pour la chambre <span class="font-semibold text-blue-400">101</span> par M. Dubois.</p>
                <p class="text-xs text-slate-500">Il y a 5 minutes</p>
            </div>
          </li>
          <li class="flex items-start p-3 bg-slate-700/50 rounded-lg hover:bg-slate-600/50 transition-colors">
            <div class="bg-yellow-500/30 p-2 rounded-full mr-3 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-yellow-300"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M12 8v4"></path><path d="M12 16h.01"></path></svg>
            </div>
            <div>
                <p class="text-slate-200 text-sm">Commande urgente pour la <span class="font-semibold text-yellow-400">Table 5</span> (Cuisine).</p>
                <p class="text-xs text-slate-500">Il y a 12 minutes</p>
            </div>
          </li>
           <li class="flex items-start p-3 bg-slate-700/50 rounded-lg hover:bg-slate-600/50 transition-colors">
            <div class="bg-red-500/30 p-2 rounded-full mr-3 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-300"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </div>
            <div>
                <p class="text-slate-200 text-sm">Nettoyage requis pour la chambre <span class="font-semibold text-red-400">203</span> après check-out.</p>
                <p class="text-xs text-slate-500">Il y a 30 minutes</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="bg-slate-800/70 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-slate-700">
        <h3 class="text-xl font-semibold text-slate-300 mb-4">Top Produits Vendus (Semaine)</h3>
        <ul class="space-y-3">
          <li class="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg hover:bg-slate-600/50 transition-colors">
            <span class="text-slate-300 text-sm">Bar: Mojito</span>
            <span class="font-semibold text-sky-400">125 unités</span>
          </li>
          <li class="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg hover:bg-slate-600/50 transition-colors">
            <span class="text-slate-300 text-sm">Restaurant: Burger Classique</span>
            <span class="font-semibold text-amber-400">98 unités</span>
          </li>
          <li class="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg hover:bg-slate-600/50 transition-colors">
            <span class="text-slate-300 text-sm">Bar: Vin Rouge (Verre)</span>
            <span class="font-semibold text-sky-400">76 unités</span>
          </li>
          <li class="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg hover:bg-slate-600/50 transition-colors">
            <span class="text-slate-300 text-sm">Restaurant: Salade César</span>
            <span class="font-semibold text-amber-400">65 unités</span>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import RevenueChart from '../../components/RevenueChart.vue'; // Ajuster le chemin

// Données mockées améliorées
const totalRooms = ref(25);
const occupiedRooms = ref(18);
const freeRooms = computed(() => totalRooms.value - occupiedRooms.value);
const barSales = ref(1380.50);
const restaurantSales = ref(3575.90);

const occupancyRate = computed(() => {
  return totalRooms.value > 0 ? ((occupiedRooms.value / totalRooms.value) * 100).toFixed(0) : 0;
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
};

// Données pour le graphique des revenus hebdomadaires
const weeklyRevenueData = ref(null);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: '#94a3b8', // slate-400
        callback: function(value) {
          return value + ' €';
        }
      },
      grid: { color: 'rgba(100, 116, 139, 0.2)' } // slate-500 avec opacité
    },
    x: {
      ticks: { color: '#94a3b8' }, // slate-400
      grid: { color: 'rgba(100, 116, 139, 0.2)' }
    }
  },
  plugins: {
    legend: {
        display: true,
        labels: { color: '#cbd5e1' } // slate-300
    },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.8)', // slate-900 avec opacité
      titleColor: '#e2e8f0', // slate-200
      bodyColor: '#94a3b8', // slate-400
      borderColor: '#334155', // slate-700
      borderWidth: 1,
      callbacks: {
        label: function(context) {
          return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
        }
      }
    }
  }
};


// Simuler le chargement des données du graphique
onMounted(() => {
  setTimeout(() => {
    weeklyRevenueData.value = {
      labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      datasets: [
        {
          label: 'Revenus Chambres',
          data: [1200, 1300, 1100, 1500, 1800, 2200, 1900],
          borderColor: '#2dd4bf', // teal-400
          backgroundColor: 'rgba(45, 212, 191, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Revenus Restauration',
          data: [800, 950, 700, 1100, 1300, 1600, 1400],
          borderColor: '#f59e0b', // amber-500
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          tension: 0.4,
          fill: true,
        }
      ]
    };
  }, 1000); // Simuler un délai de chargement
});

// Icônes Lucide/Heroicons (comme composants SVG ou via une bibliothèque)
// Pour l'instant, les SVG sont inline.
</script>

<style scoped>
/* Styles spécifiques si Tailwind ne suffit pas */
/* Le style général est maintenant plus sombre et utilise des couleurs slate/blue/purple */
</style>
