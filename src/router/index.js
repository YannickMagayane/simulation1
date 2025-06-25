import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes'; // Le fichier que nous avons configuré précédemment
import { useAuthStore } from '../../store/auth'; // Importer le store d'auth

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'), // BASE_URL pour Vite, ou '/'
  routes,
});

// Navigation Guards
router.beforeEach(async (to, from, next) => {
  // S'assurer que Pinia est initialisé avant d'utiliser le store ici
  // Cela est généralement le cas si Pinia est enregistré dans main.js avant le routeur
  const authStore = useAuthStore();

  // Si l'état du store n'est pas encore initialisé depuis localStorage (ex: rechargement de page)
  // On peut appeler une action pour le faire, ou s'assurer que l'état initial du store le fait déjà.
  // Pour cet exemple, on suppose que l'état initial de useAuthStore charge depuis localStorage.
  // if (!authStore.token && localStorage.getItem('token')) {
  //   authStore.checkAuth(); // ou une action qui initialise token et user depuis localStorage
  // }

  const isAuthenticated = authStore.isAuthenticated;
  const userRole = authStore.getUserRole;

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest);
  const requiredRoles = to.meta.role; // Peut être une chaîne ou un tableau de rôles

  if (requiresAuth && !isAuthenticated) {
    console.log('Navigation guard: requires auth, user not authenticated. Redirecting to login.');
    next({ name: 'Login', query: { redirect: to.fullPath } }); // Rediriger vers login, garder la page cible en query
  } else if (requiresGuest && isAuthenticated) {
    console.log('Navigation guard: requires guest, user authenticated. Redirecting to dashboard.');
    next('/admin/dashboard'); // Ou la page d'accueil par défaut pour les utilisateurs connectés
  } else if (requiresAuth && isAuthenticated && requiredRoles) {
    // Vérification des rôles
    let hasRequiredRole = false;
    if (Array.isArray(requiredRoles)) {
      hasRequiredRole = requiredRoles.includes(userRole);
    } else {
      hasRequiredRole = requiredRoles === userRole;
    }

    if (hasRequiredRole) {
      next(); // L'utilisateur a le rôle requis
    } else {
      console.log(`Navigation guard: user role (${userRole}) does not match required roles (${requiredRoles}). Redirecting.`);
      // Rediriger vers une page "non autorisé" ou la page d'accueil par défaut
      next({ name: 'AdminDashboard' }); // Ou une page '/unauthorized'
    }
  }
  else {
    next(); // Pas de conditions spéciales, continuer la navigation
  }
});

export default router;
