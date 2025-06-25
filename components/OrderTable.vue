<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200 shadow-sm rounded-lg">
      <thead class="bg-gray-100">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Commande</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produits</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50 transition-colors">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ order.id }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ order.target }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
            <ul>
              <li v-for="item in order.items" :key="item.productId">
                {{ item.name }} (x{{ item.quantity }})
              </li>
            </ul>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ order.total.toFixed(2) }} €</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span :class="['px-2 inline-flex text-xs leading-5 font-semibold rounded-full', getStatusClass(order.status)]">
              {{ order.status }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
            <select
              v-if="order.status !== 'Servie'"
              @change="emitUpdateStatus(order.id, $event.target.value)"
              :value="order.status"
              class="text-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-1"
            >
              <option value="En attente">En attente</option>
              <option value="En préparation">En préparation</option>
              <option value="Servie">Servie</option>
            </select>
            <button
              v-if="order.status === 'Servie'"
              class="text-gray-400 cursor-not-allowed text-xs"
              disabled>
              Complétée
            </button>
            <!-- Autres actions possibles: Annuler, Modifier (plus complexe) -->
          </td>
        </tr>
        <tr v-if="orders.length === 0">
          <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
            Aucune commande à afficher.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  orders: {
    type: Array,
    required: true,
    default: () => []
  }
});

const emit = defineEmits(['update-status']);

const getStatusClass = (status) => {
  switch (status) {
    case 'En attente':
      return 'bg-yellow-100 text-yellow-800';
    case 'En préparation':
      return 'bg-blue-100 text-blue-800';
    case 'Servie':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const emitUpdateStatus = (orderId, newStatus) => {
  emit('update-status', { orderId, newStatus });
};
</script>

<style scoped>
/* Styles spécifiques pour OrderTable si Tailwind ne suffit pas */
/* Par exemple, pour s'assurer que le select a une taille appropriée */
select.text-xs {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  padding-left: 0.5rem;
  padding-right: 1.75rem; /* Espace pour la flèche du select */
}
</style>
