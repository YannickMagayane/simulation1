<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Comptabilité et Facturation</h1>

    <!-- Filtres Globaux -->
    <div class="mb-8 p-6 bg-white rounded-2xl shadow-lg">
      <h2 class="text-lg font-semibold text-gray-700 mb-3">Filtrer les Données</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label for="dateFrom" class="block text-sm font-medium text-gray-700">Du</label>
          <input type="date" id="dateFrom" v-model="filters.dateFrom" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2">
        </div>
        <div>
          <label for="dateTo" class="block text-sm font-medium text-gray-700">Au</label>
          <input type="date" id="dateTo" v-model="filters.dateTo" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2">
        </div>
        <div>
          <label for="serviceType" class="block text-sm font-medium text-gray-700">Service</label>
          <select id="serviceType" v-model="filters.service" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2">
            <option value="">Tous</option>
            <option value="chambres">Chambres</option>
            <option value="restaurant">Restaurant</option>
            <option value="bar">Bar</option>
          </select>
        </div>
        <div>
          <label for="clientNameFilter" class="block text-sm font-medium text-gray-700">Nom du Client</label>
          <input type="text" id="clientNameFilter" v-model="filters.clientName" placeholder="Rechercher client..." class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2">
        </div>
      </div>
      <button @click="applyFilters" class="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md">
        Appliquer les Filtres
      </button>
    </div>

    <!-- Totaux des Ventes -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold text-gray-700 mb-4">Total des Ventes (Période Sélectionnée)</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-2xl shadow-lg text-center">
          <h3 class="text-lg font-medium text-gray-600">Chambres</h3>
          <p class="text-3xl font-bold text-green-500 mt-2">{{ totals.chambres.toFixed(2) }} €</p>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-lg text-center">
          <h3 class="text-lg font-medium text-gray-600">Restaurant</h3>
          <p class="text-3xl font-bold text-yellow-500 mt-2">{{ totals.restaurant.toFixed(2) }} €</p>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-lg text-center">
          <h3 class="text-lg font-medium text-gray-600">Bar</h3>
          <p class="text-3xl font-bold text-blue-500 mt-2">{{ totals.bar.toFixed(2) }} €</p>
        </div>
      </div>
    </div>

    <!-- Graphique Revenu Hebdo/Mois (Placeholder) -->
    <div class="mb-8 bg-white p-6 rounded-2xl shadow-lg">
      <h2 class="text-xl font-semibold text-gray-700 mb-4">Graphique des Revenus</h2>
      <RevenueChart :chart-data="revenueChartData" v-if="revenueChartData" />
      <div v-else class="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
        <p class="text-gray-500">Données insuffisantes pour le graphique ou chargement...</p>
      </div>
    </div>

    <!-- Liste des Factures -->
    <div class="bg-white p-6 rounded-2xl shadow-lg">
      <h2 class="text-xl font-semibold text-gray-700 mb-4">Liste des Factures</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Facture</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chambre</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total (€)</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Détails</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="invoice in filteredInvoices" :key="invoice.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ invoice.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ formatDate(invoice.date) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ invoice.clientName }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ invoice.roomNumber || 'N/A' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">{{ invoice.total.toFixed(2) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="['px-2 inline-flex text-xs leading-5 font-semibold rounded-full', invoice.status === 'Payée' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
                  {{ invoice.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button @click="viewInvoiceDetails(invoice)" class="text-blue-600 hover:text-blue-800">Voir</button>
              </td>
            </tr>
            <tr v-if="filteredInvoices.length === 0">
              <td colspan="7" class="px-6 py-4 text-center text-sm text-gray-500">Aucune facture ne correspond aux filtres.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Détails Facture (Placeholder) -->
    <InvoiceModal v-if="showInvoiceModal" :invoice="selectedInvoice" @close="showInvoiceModal = false" />

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import RevenueChart from '../../components/RevenueChart.vue'; // Ajuster le chemin
import InvoiceModal from '../../components/InvoiceModal.vue'; // Ajuster le chemin

// Données mockées
const mockInvoices = ref([
  { id: 'INV001', date: '2023-10-26', clientName: 'Jean Dupont', roomNumber: '102', total: 250.75, status: 'Payée', items: [{description: 'Nuitée Chambre 102', amount: 200}, {description: 'Petit déjeuner', amount: 50.75}], type: 'chambres' },
  { id: 'INV002', date: '2023-10-25', clientName: 'Alice Martin', roomNumber: '202', total: 180.00, status: 'Payée', items: [{description: 'Nuitée Chambre 202', amount: 180}], type: 'chambres' },
  { id: 'INV003', date: '2023-10-26', clientName: 'Table 5', roomNumber: null, total: 75.50, status: 'Payée', items: [{description: 'Dîner', amount: 75.50}], type: 'restaurant' },
  { id: 'INV004', date: '2023-10-24', clientName: 'Bar Comptoir', roomNumber: null, total: 32.00, status: 'En attente', items: [{description: 'Boissons', amount: 32.00}], type: 'bar' },
  { id: 'INV005', date: '2023-09-15', clientName: 'Société XYZ', roomNumber: 'Conference', total: 1200.00, status: 'Payée', items: [{description: 'Location salle + repas', amount: 1200}], type: 'autre' },
]);

const filters = reactive({
  dateFrom: '',
  dateTo: '',
  service: '', // 'chambres', 'restaurant', 'bar', '' (tous)
  clientName: '',
});

const filteredInvoices = ref([]);
const showInvoiceModal = ref(false);
const selectedInvoice = ref(null);

const totals = reactive({
  chambres: 0,
  restaurant: 0,
  bar: 0,
});

const revenueChartData = ref(null); // Sera { labels: [...], datasets: [{ data: [...] }] }

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const applyFilters = () => {
  let result = mockInvoices.value;

  if (filters.dateFrom) {
    result = result.filter(inv => new Date(inv.date) >= new Date(filters.dateFrom));
  }
  if (filters.dateTo) {
    result = result.filter(inv => new Date(inv.date) <= new Date(filters.dateTo));
  }
  if (filters.service) {
    result = result.filter(inv => inv.type === filters.service);
  }
  if (filters.clientName) {
    result = result.filter(inv => inv.clientName.toLowerCase().includes(filters.clientName.toLowerCase()));
  }
  filteredInvoices.value = result;
  calculateTotals(result);
  prepareChartData(result);
};

const calculateTotals = (invoicesToSum) => {
  totals.chambres = invoicesToSum.filter(inv => inv.type === 'chambres' && inv.status === 'Payée').reduce((sum, inv) => sum + inv.total, 0);
  totals.restaurant = invoicesToSum.filter(inv => inv.type === 'restaurant' && inv.status === 'Payée').reduce((sum, inv) => sum + inv.total, 0);
  totals.bar = invoicesToSum.filter(inv => inv.type === 'bar' && inv.status === 'Payée').reduce((sum, inv) => sum + inv.total, 0);
};

const prepareChartData = (invoicesForChart) => {
  // Exemple simple: Agréger par mois pour la période filtrée
  const monthlyRevenue = {};
  invoicesForChart.filter(inv => inv.status === 'Payée').forEach(inv => {
    const monthYear = new Date(inv.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
    if (!monthlyRevenue[monthYear]) {
      monthlyRevenue[monthYear] = 0;
    }
    monthlyRevenue[monthYear] += inv.total;
  });

  const sortedMonths = Object.keys(monthlyRevenue).sort((a, b) => new Date(a) - new Date(b));

  if (sortedMonths.length > 0) {
    revenueChartData.value = {
      labels: sortedMonths,
      datasets: [
        {
          label: 'Revenu Total (€)',
          backgroundColor: '#4299e1', // blue-500
          borderColor: '#2b6cb0', // blue-700
          data: sortedMonths.map(month => monthlyRevenue[month]),
          tension: 0.1,
          fill: false,
        }
      ]
    };
  } else {
    revenueChartData.value = null; // Pas de données pour le graphique
  }
};


const viewInvoiceDetails = (invoice) => {
  selectedInvoice.value = invoice;
  showInvoiceModal.value = true;
};

onMounted(() => {
  // Initialiser avec toutes les factures et totaux
  applyFilters();
});

</script>

<style scoped>
/* Styles spécifiques si Tailwind ne suffit pas */
</style>
