import AdminDashboard from '../views/AdminDashboard.vue';
import Rooms from '../views/Rooms.vue';
import Restaurant from '../views/Restaurant.vue';
import Accounting from '../views/Accounting.vue';
import Login from '../views/Login.vue';
// Importer d'autres vues au besoin

// Layout principal pour les vues authentifiées
// import AdminLayout from '../layouts/AdminLayout.vue'; // Optionnel, si on veut un layout wrapper

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true } // Pour rediriger si déjà connecté
  },
  {
    // Redirection de la racine vers le dashboard admin ou login
    path: '/',
    redirect: '/admin', // ou '/login' si pas authentifié par défaut
  },
  {
    path: '/admin',
    // component: AdminLayout, // Si on utilise un layout qui wrappe Sidebar + Topbar + router-view
    // Pour l'instant, on suppose que App.vue gère le layout global
    meta: { requiresAuth: true, role: 'Admin' }, // Exemple de méta pour guard
    children: [
      {
        path: '', // Route par défaut pour /admin -> /admin/dashboard
        name: 'AdminDashboard',
        component: AdminDashboard,
        alias: 'dashboard' // alias pour /admin/dashboard
      },
      {
        path: 'rooms',
        name: 'RoomsManagement',
        component: Rooms,
        meta: { role: ['Admin', 'Receptionist'] } // Accessible par Admin et Réceptionniste
      },
      {
        path: 'restaurant',
        name: 'RestaurantModule',
        component: Restaurant,
        meta: { role: ['Admin', 'Server'] } // Accessible par Admin et Serveur
      },
      {
        path: 'accounting',
        name: 'AccountingModule',
        component: Accounting,
        meta: { role: 'Admin' } // Accessible uniquement par Admin
      },
      // Ajouter d'autres sous-routes de /admin ici
    ]
  },
  // Fallback pour les routes non trouvées (page 404)
  // {
  //   path: '/:catchAll(.*)*',
  //   name: 'NotFound',
  //   component: () => import('../views/NotFound.vue') // Créer une vue NotFound.vue
  // }
];

export default routes;
