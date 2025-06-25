<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Gestion des Chambres</h1>

    <!-- Filtres et Actions (Optionnel) -->
    <div class="mb-6 flex justify-between items-center">
      <div>
        <!-- <select class="form-select rounded-md shadow-sm">
          <option value="">Tous les types</option>
          <option value="single">Single</option>
          <option value="double">Double</option>
          <option value="suite">Suite</option>
        </select>
        <select class="form-select rounded-md shadow-sm ml-2">
          <option value="">Tous les statuts</option>
          <option value="libre">Libre</option>
          <option value="occupee">Occupée</option>
          <option value="nettoyage">En nettoyage</option>
        </select> -->
      </div>
      <button class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150">
        Ajouter une chambre
      </button>
    </div>

    <!-- Affichage des Chambres (Cartes ou Tableau) -->
    <!-- Ici, exemple avec des cartes -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="room in rooms"
        :key="room.id"
        class="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out"
      >
        <div :class="['p-5', getStatusBgColor(room.status)]">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-xl font-bold text-white">Chambre {{ room.number }}</h3>
            <span :class="['px-3 py-1 text-xs font-semibold rounded-full', getStatusTextColor(room.status), getStatusPillBgColor(room.status)]">
              {{ room.status.charAt(0).toUpperCase() + room.status.slice(1) }}
            </span>
          </div>
          <p class="text-sm text-gray-100">Type: {{ room.type }}</p>
        </div>
        <div class="p-5 bg-gray-50">
          <p class="text-gray-600 text-sm mb-4">
            {{ room.description || 'Aucune description disponible.' }}
          </p>
          <div class="flex space-x-2">
            <button
              @click="handleCheckIn(room)"
              :disabled="room.status !== 'libre'"
              class="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
            >
              Check-in
            </button>
            <button
              @click="handleCheckOut(room)"
              :disabled="room.status !== 'occupee'"
              class="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
            >
              Check-out
            </button>
          </div>
           <button
              @click="toggleCleaningStatus(room)"
              :class="[
                'w-full mt-2 text-sm font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150',
                room.status === 'en nettoyage' ? 'bg-yellow-400 hover:bg-yellow-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              ]"
            >
              {{ room.status === 'en nettoyage' ? 'Marquer comme Prête' : 'Marquer pour Nettoyage' }}
            </button>
        </div>
      </div>
    </div>

    <!-- Modal pour Check-in (Exemple simple) -->
    <div v-if="showCheckInModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-20">
      <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h3 class="text-xl font-semibold mb-4">Check-in pour Chambre {{ selectedRoom?.number }}</h3>
        <form @submit.prevent="submitCheckIn">
          <div class="mb-4">
            <label for="clientName" class="block text-sm font-medium text-gray-700">Nom du client</label>
            <input type="text" id="clientName" v-model="checkInForm.clientName" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2">
          </div>
          <div class="mb-4">
            <label for="checkInDate" class="block text-sm font-medium text-gray-700">Date d'arrivée</label>
            <input type="date" id="checkInDate" v-model="checkInForm.checkInDate" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2">
          </div>
          <div class="mb-6">
            <label for="duration" class="block text-sm font-medium text-gray-700">Durée du séjour (nuits)</label>
            <input type="number" id="duration" v-model="checkInForm.duration" min="1" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2">
          </div>
          <div class="flex justify-end space-x-3">
            <button type="button" @click="showCheckInModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg">Annuler</button>
            <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg">Confirmer Check-in</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal pour Check-out (Exemple simple) -->
    <div v-if="showCheckOutModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-20">
      <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h3 class="text-xl font-semibold mb-4">Check-out pour Chambre {{ selectedRoom?.number }}</h3>
        <p class="mb-2">Client: {{ selectedRoom?.occupant?.name || 'N/A' }}</p>
        <p class="mb-2">Montant dû (simulation): {{ (Math.random() * 200 + 50).toFixed(2) }} €</p>
        <p class="text-sm text-gray-600 mb-6">Confirmez-vous le check-out et la génération de la facture ?</p>
        <div class="flex justify-end space-x-3">
          <button type="button" @click="showCheckOutModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg">Annuler</button>
          <button type="button" @click="submitCheckOut" class="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg">Confirmer Check-out</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

// Données mockées pour les chambres
const rooms = ref([
  { id: 1, number: '101', type: 'Single', status: 'libre', description: 'Vue sur jardin, calme.' },
  { id: 2, number: '102', type: 'Double', status: 'occupee', occupant: { name: 'Jean Dupont' }, description: 'Grand lit, TV écran plat.' },
  { id: 3, number: '103', type: 'Suite', status: 'en nettoyage', description: 'Avec salon séparé.' },
  { id: 4, number: '201', type: 'Double', status: 'libre', description: 'Balcon avec vue mer.' },
  { id: 5, number: '202', type: 'Single', status: 'occupee', occupant: { name: 'Alice Martin' }, description: 'Compacte et fonctionnelle.' },
  { id: 6, number: '203', type: 'Suite', status: 'libre', description: 'Jacuzzi privé.' },
]);

const showCheckInModal = ref(false);
const showCheckOutModal = ref(false);
const selectedRoom = ref(null);
const checkInForm = reactive({
  clientName: '',
  checkInDate: new Date().toISOString().split('T')[0], // Date actuelle par défaut
  duration: 1,
});

const getStatusBgColor = (status) => {
  if (status === 'libre') return 'bg-gradient-to-br from-green-400 to-green-600';
  if (status === 'occupee') return 'bg-gradient-to-br from-red-400 to-red-600';
  if (status === 'en nettoyage') return 'bg-gradient-to-br from-yellow-400 to-yellow-600';
  return 'bg-gray-400';
};

const getStatusPillBgColor = (status) => {
  if (status === 'libre') return 'bg-green-100';
  if (status === 'occupee') return 'bg-red-100';
  if (status === 'en nettoyage') return 'bg-yellow-100';
  return 'bg-gray-100';
};

const getStatusTextColor = (status) => {
  if (status === 'libre') return 'text-green-800';
  if (status === 'occupee') return 'text-red-800';
  if (status === 'en nettoyage') return 'text-yellow-800';
  return 'text-gray-800';
};

const handleCheckIn = (room) => {
  if (room.status === 'libre') {
    selectedRoom.value = room;
    // Réinitialiser le formulaire
    checkInForm.clientName = '';
    checkInForm.checkInDate = new Date().toISOString().split('T')[0];
    checkInForm.duration = 1;
    showCheckInModal.value = true;
  }
};

const submitCheckIn = () => {
  if (selectedRoom.value) {
    // Simulation de l'appel API / POST /checkin
    console.log(`Check-in pour chambre ${selectedRoom.value.number}:`, checkInForm);
    const roomToUpdate = rooms.value.find(r => r.id === selectedRoom.value.id);
    if (roomToUpdate) {
      roomToUpdate.status = 'occupee';
      roomToUpdate.occupant = { name: checkInForm.clientName }; // Stocker le nom du client
    }
    showCheckInModal.value = false;
    selectedRoom.value = null;
    // Idéalement, rafraîchir les données depuis l'API ici
  }
};

const handleCheckOut = (room) => {
  if (room.status === 'occupee') {
    selectedRoom.value = room;
    showCheckOutModal.value = true;
  }
};

const submitCheckOut = () => {
  if (selectedRoom.value) {
    // Simulation de l'appel API / POST /checkout
    console.log(`Check-out pour chambre ${selectedRoom.value.number}`);
    const roomToUpdate = rooms.value.find(r => r.id === selectedRoom.value.id);
    if (roomToUpdate) {
      roomToUpdate.status = 'en nettoyage'; // Ou 'libre' directement si pas de phase nettoyage systématique
      delete roomToUpdate.occupant;
    }
    showCheckOutModal.value = false;
    selectedRoom.value = null;
    // Idéalement, rafraîchir les données depuis l'API et générer la facture
  }
};

const toggleCleaningStatus = (room) => {
  // Simulation: Si en nettoyage -> libre. Sinon (libre ou occupée) -> en nettoyage
  // Une logique plus fine pourrait être nécessaire (ex: on ne peut mettre en nettoyage qu'une chambre occupée venant de check-out)
  if (room.status === 'en nettoyage') {
    room.status = 'libre';
    console.log(`Chambre ${room.number} marquée comme prête (libre).`);
  } else {
    // On pourrait vouloir forcer le check-out avant de mettre en nettoyage si elle est occupée
    // Pour cette simu, on permet de la mettre en nettoyage directement.
    room.status = 'en nettoyage';
    console.log(`Chambre ${room.number} marquée pour nettoyage.`);
  }
};

</script>

<style scoped>
/* Styles spécifiques pour Rooms.vue si Tailwind ne suffit pas */
.form-select {
  /* Styles de base pour les selects si non couverts par un plugin Tailwind Forms */
  padding: 0.5rem 2.5rem 0.5rem 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db; /* gray-300 */
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
</style>
