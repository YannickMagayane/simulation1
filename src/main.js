import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Assurez-vous que le chemin est correct
import pinia from '../store'; // Importer l'instance Pinia
import './assets/tailwind.css'; // Assurez-vous que ce fichier existe et est configuré

// Optionnel: Initialiser le store d'authentification au démarrage de l'application
// import { useAuthStore } from '../store/auth';

const app = createApp(App);

app.use(pinia); // Enregistrer Pinia avant le routeur si le routeur dépend du store
app.use(router);

// Optionnel: Si vous voulez vérifier l'auth au démarrage globalement
// const authStore = useAuthStore(); // Doit être appelé après app.use(pinia)
// authStore.checkAuth(); // Ou une action similaire pour initialiser l'état depuis localStorage

app.mount('#app');
