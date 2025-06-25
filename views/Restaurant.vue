<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Module Restaurant & Bar</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Section Prise de Commande -->
      <div class="lg:col-span-1 bg-white p-6 rounded-2xl shadow-xl">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Nouvelle Commande</h2>
        <form @submit.prevent="addOrder">
          <div class="mb-4">
            <label for="product" class="block text-sm font-medium text-gray-700">Produit</label>
            <select id="product" v-model="newOrder.productId" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2">
              <option disabled value="">Choisir un produit</option>
              <option v-for="product in menuItems" :key="product.id" :value="product.id">
                {{ product.name }} - {{ product.price.toFixed(2) }} €
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label for="quantity" class="block text-sm font-medium text-gray-700">Quantité</label>
            <input type="number" id="quantity" v-model.number="newOrder.quantity" min="1" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2">
          </div>
          <div class="mb-4">
            <label for="target" class="block text-sm font-medium text-gray-700">Pour (Table / Chambre)</label>
            <input type="text" id="target" v-model="newOrder.target" placeholder="Ex: Table 5 ou Chambre 101" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Type de client</label>
            <div class="mt-1 flex space-x-4">
              <label class="inline-flex items-center">
                <input type="radio" class="form-radio text-blue-600" v-model="newOrder.clientType" value="internal">
                <span class="ml-2 text-sm text-gray-700">Client Interne (Chambre)</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" class="form-radio text-blue-600" v-model="newOrder.clientType" value="external">
                <span class="ml-2 text-sm text-gray-700">Client Externe</span>
              </label>
            </div>
          </div>
          <button type="submit" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150">
            Ajouter la Commande
          </button>
        </form>
      </div>

      <!-- Section Commandes Actives & Comptabilité -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Commandes en Cours -->
        <div class="bg-white p-6 rounded-2xl shadow-xl">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">Commandes en Cours</h2>
          <OrderTable :orders="activeOrders" @update-status="updateOrderStatus" />
          <p v-if="activeOrders.length === 0" class="text-gray-500 text-center py-4">Aucune commande active.</p>
        </div>

        <!-- Comptabilité Journalière (Simplifiée) -->
        <div class="bg-white p-6 rounded-2xl shadow-xl">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">Comptabilité Journalière (Restaurant/Bar)</h2>
          <div v-if="dailySales.length > 0">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité Vendue</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Ventes</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="sale in dailySalesSummary" :key="sale.productId">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ getProductName(sale.productId) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ sale.totalQuantity }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ sale.totalRevenue.toFixed(2) }} €</td>
                </tr>
              </tbody>
              <tfoot class="bg-gray-50">
                <tr>
                  <td colspan="2" class="px-6 py-3 text-right text-sm font-bold text-gray-700">Total Général</td>
                  <td class="px-6 py-3 text-left text-sm font-bold text-gray-700">{{ totalDailyRevenue.toFixed(2) }} €</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p v-else class="text-gray-500 text-center py-4">Aucune vente enregistrée pour aujourd'hui.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import OrderTable from '../../components/OrderTable.vue'; // Ajuster le chemin si nécessaire

// Données mockées
const menuItems = ref([
  { id: 1, name: 'Café Espresso', price: 2.50, category: 'bar' },
  { id: 2, name: 'Jus d\'orange pressé', price: 4.00, category: 'bar' },
  { id: 3, name: 'Croissant', price: 1.80, category: 'restaurant' },
  { id: 4, name: 'Salade César', price: 12.00, category: 'restaurant' },
  { id: 5, name: 'Burger Classique', price: 15.50, category: 'restaurant' },
  { id: 6, name: 'Mojito', price: 8.00, category: 'bar' },
]);

const activeOrders = ref([
  { id: 'ORD001', items: [{ productId: 4, quantity: 1, name: 'Salade César', price: 12.00 }], target: 'Table 3', clientType: 'external', status: 'En attente', total: 12.00, createdAt: new Date() },
  { id: 'ORD002', items: [{ productId: 1, quantity: 2, name: 'Café Espresso', price: 2.50 }, { productId: 6, quantity: 1, name: 'Mojito', price: 8.00 }], target: 'Chambre 201', clientType: 'internal', status: 'En préparation', total: 13.00, createdAt: new Date() },
]);

const dailySales = ref([]); // Sera rempli par les commandes servies

const newOrder = reactive({
  productId: '',
  quantity: 1,
  target: '',
  clientType: 'external', // 'internal' ou 'external'
});

const getProductName = (productId) => {
  const product = menuItems.value.find(p => p.id === productId);
  return product ? product.name : 'Produit inconnu';
};

const getProductPrice = (productId) => {
  const product = menuItems.value.find(p => p.id === productId);
  return product ? product.price : 0;
};

const addOrder = () => {
  if (!newOrder.productId || newOrder.quantity <= 0) {
    alert('Veuillez sélectionner un produit et une quantité valide.');
    return;
  }
  const product = menuItems.value.find(p => p.id === newOrder.productId);
  if (!product) {
    alert('Produit non trouvé.');
    return;
  }

  const order = {
    id: `ORD${String(Date.now()).slice(-4)}`, // ID unique simple
    items: [{
      productId: product.id,
      quantity: newOrder.quantity,
      name: product.name,
      price: product.price
    }],
    target: newOrder.target,
    clientType: newOrder.clientType,
    status: 'En attente', // Statuts: En attente, En préparation, Servie
    total: product.price * newOrder.quantity,
    createdAt: new Date(),
  };
  activeOrders.value.unshift(order); // Ajoute au début de la liste

  // Réinitialiser le formulaire
  newOrder.productId = '';
  newOrder.quantity = 1;
  newOrder.target = '';
  newOrder.clientType = 'external';

  console.log('Nouvelle commande ajoutée:', order);
  // Idéalement, POST /orders ici
};

const updateOrderStatus = ({ orderId, newStatus }) => {
  const order = activeOrders.value.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
    console.log(`Statut de la commande ${orderId} mis à jour à ${newStatus}`);

    if (newStatus === 'Servie') {
      // Ajouter à la comptabilité journalière et retirer des commandes actives (ou marquer comme complétée)
      order.items.forEach(item => {
        dailySales.value.push({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
          date: new Date().toISOString().split('T')[0] // Date de la vente
        });
      });
      // Option: retirer de activeOrders ou juste filtrer l'affichage
      // activeOrders.value = activeOrders.value.filter(o => o.id !== orderId);
    }
    // Idéalement, PUT /orders/{orderId} ici
  }
};

// Calculs pour la comptabilité journalière
const dailySalesSummary = computed(() => {
  const summary = {};
  dailySales.value.forEach(sale => {
    if (!summary[sale.productId]) {
      summary[sale.productId] = { productId: sale.productId, totalQuantity: 0, totalRevenue: 0 };
    }
    summary[sale.productId].totalQuantity += sale.quantity;
    summary[sale.productId].totalRevenue += sale.total;
  });
  return Object.values(summary);
});

const totalDailyRevenue = computed(() => {
  return dailySales.value.reduce((sum, sale) => sum + sale.total, 0);
});

</script>

<style scoped>
/* Styles spécifiques si Tailwind ne suffit pas */
.form-radio {
  /* Tailwind v2+ a des styles par défaut pour form-radio, sinon ajouter des styles custom */
  appearance: none;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  border: 2px solid #d1d5db; /* gray-300 */
  transition: 0.2s all linear;
  margin-right: 0.5rem; /* pour espacer du label */
}
.form-radio:checked {
  border-color: #2563eb; /* blue-600 */
  background-color: #2563eb; /* blue-600 */
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='3'/%3e%3c/svg%3e");
}
</style>
