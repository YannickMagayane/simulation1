<template>
  <aside class="w-64 h-screen bg-slate-900 text-slate-200 flex flex-col shadow-2xl fixed left-0 top-0 z-20 border-r border-slate-700">
    <!-- Logo -->
    <div class="p-6 text-center border-b border-slate-700">
      <router-link to="/admin" class="flex items-center justify-center space-x-2 group">
        <svg class="h-10 w-10 text-blue-400 group-hover:text-blue-300 transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
        </svg>
        <h1 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 group-hover:opacity-90 transition-opacity">
          PMS Hôtel
        </h1>
      </router-link>
      <p class="text-xs text-slate-500 mt-1">Gestion Hôtelière Moderne</p>
    </div>

    <!-- Navigation Links -->
    <nav class="flex-grow p-4 space-y-1.5">
      <router-link
        v-for="item in filteredNavigationItems"
        :key="item.name"
        :to="item.path"
        :class="[
          'flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 ease-in-out group',
          'text-slate-400 hover:text-slate-100 hover:bg-slate-700/50',
          isActive(item.path) ? 'sidebar-link-active text-white shadow-lg scale-105' : ''
        ]"
      >
        <component :is="item.icon" :class="['h-5 w-5 mr-3 transition-colors', isActive(item.path) ? 'text-white' : 'text-slate-500 group-hover:text-slate-300']" />
        <span class="text-sm font-medium">{{ item.name }}</span>
      </router-link>
    </nav>

    <!-- Footer / User Profile -->
    <div class="p-4 border-t border-slate-700">
      <div class="flex items-center" v-if="currentUser">
        <img class="h-10 w-10 rounded-full object-cover" :src="`https://ui-avatars.com/api/?name=${currentUser.name || currentUser.email}&background=1e293b&color=94a3b8&size=128`" :alt="currentUser.name || currentUser.email">
        <div class="ml-3">
          <p class="text-sm font-semibold text-slate-200">{{ currentUser.name || currentUser.email }}</p>
          <p class="text-xs text-slate-500">{{ currentUser.role }}</p>
        </div>
      </div>
      <button @click="logout" class="w-full mt-3 flex items-center justify-center px-4 py-2.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-200 group">
        <IconLogOut class="h-5 w-5 mr-2 text-slate-500 group-hover:text-red-400 transition-colors" />
        <span class="text-sm font-medium">Déconnexion</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../../store/auth'; // Importer le store d'auth

// Icônes (SVG inline ou composants)
const IconDashboard = { template: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>` };
const IconBed = { template: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V3"></path><path d="m2 9 20 0"></path><path d="M12 14h.01"></path></svg>` };
const IconUtensils = { template: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Z"></path></svg>` };
const IconDollarSign = { template: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>` };
const IconSettings = { template: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`};
const IconUser = { template: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`};
const IconLogOut = { template: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>`};


const navigationItems = ref([
  { name: 'Dashboard', path: '/admin', icon: IconDashboard, roles: ['Admin'] },
  { name: 'Chambres', path: '/admin/rooms', icon: IconBed, roles: ['Admin', 'Receptionist'] },
  { name: 'Restaurant & Bar', path: '/admin/restaurant', icon: IconUtensils, roles: ['Admin', 'Server', 'Receptionist'] }, // Receptionist peut aussi avoir besoin
  { name: 'Comptabilité', path: '/admin/accounting', icon: IconDollarSign, roles: ['Admin'] },
  // { name: 'Paramètres', path: '/admin/settings', icon: IconSettings, roles: ['Admin'] },
]);

const route = useRoute();
const authStore = useAuthStore();

const currentUser = computed(() => authStore.user);
const userRole = computed(() => authStore.getUserRole);

// Filtre les éléments de navigation en fonction du rôle de l'utilisateur
const filteredNavigationItems = computed(() => {
  if (!userRole.value) return [];
  return navigationItems.value.filter(item => item.roles.includes(userRole.value));
});

const isActive = (path) => {
  // Gère le cas de /admin (dashboard) pour qu'il ne soit actif que si c'est exactement /admin ou /admin/dashboard
  if (path === '/admin') {
    return route.path === '/admin' || route.path === '/admin/dashboard';
  }
  // Pour les autres chemins, vérifie si le chemin de la route commence par le chemin de l'item
  return route.path.startsWith(path);
};

const logout = () => {
  authStore.logout();
};
</script>

<style scoped>
/* Styles améliorés pour la Sidebar */
.sidebar-link-active {
  background-image: linear-gradient(to right, theme('colors.blue.500'), theme('colors.indigo.500'));
  /* ou des couleurs plus sombres si on reste sur un thème dark: */
  /* background-image: linear-gradient(to right, theme('colors.sky.600'), theme('colors.blue.600')); */
}
</style>
