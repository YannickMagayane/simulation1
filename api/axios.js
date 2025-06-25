import axios from 'axios';
import router from '../src/router'; // Ajuster le chemin si votre structure est différente

// URL de base de votre API.
// Pour une API mockée, cela pourrait être une URL locale ou un service comme Mockoon / JSON Server.
// Pour une API réelle, remplacez par l'URL de votre backend Django DRF (ex: http://localhost:8000/api)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/mock'; // Exemple avec Vite .env

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // 'Accept': 'application/json', // Souvent utile
  },
  // withCredentials: true, // Si vous gérez les sessions avec des cookies HttpOnly
});

// Intercepteur de requête pour ajouter le token JWT
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse pour gérer les erreurs globales (ex: 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => {
    // Toute réponse avec un statut dans la plage 2xx tombe ici
    return response;
  },
  (error) => {
    // Toute réponse avec un statut hors de la plage 2xx tombe ici
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        // Token invalide ou expiré
        console.error('Unauthorized access - 401. Redirecting to login.');
        // Supprimer les données utilisateur invalides
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userData');
        // Rediriger vers la page de connexion
        // Assurez-vous que le routeur est accessible ici.
        // Si ce fichier est en dehors de `src`, l'importation directe du routeur peut être problématique.
        // Une meilleure approche serait d'utiliser un store d'état (Pinia/Vuex) pour gérer la déconnexion globale.
        if (router.currentRoute.value.name !== 'Login') {
            router.push('/login').catch(err => {
                if (err.name !== 'NavigationDuplicated') {
                    console.error('Router push error:', err);
                }
            });
        }
      } else if (status === 403) {
        // Accès interdit (rôle insuffisant, etc.)
        console.error('Forbidden access - 403.');
        // Option: rediriger vers une page "Non autorisé" ou afficher une notification
        // router.push('/unauthorized');
      } else if (status === 500) {
        console.error('Server error - 500.');
        // Option: afficher une notification d'erreur serveur
      }
      // Vous pouvez ajouter d'autres gestions d'erreurs ici (404, 422, etc.)
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      console.error('Network error or no response from server:', error.request);
    } else {
      // Quelque chose s'est mal passé lors de la configuration de la requête
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
