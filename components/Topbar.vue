<template>
  <header class="bg-slate-800/80 backdrop-blur-md shadow-lg h-20 flex items-center justify-between px-6 fixed top-0 left-64 right-0 z-10 border-b border-slate-700">
    <!-- Section gauche: Titre de la page et Breadcrumbs (optionnel) -->
    <div class="flex items-center">
      <h2 class="text-2xl font-semibold text-slate-200">{{ currentViewName }}</h2>
      <!-- Breadcrumbs (exemple simple) -->
      <!-- <nav class="ml-4 text-sm text-slate-500 hidden md:block">
        <ol class="list-reset flex">
          <li><router-link to="/admin" class="hover:text-slate-300">Admin</router-link></li>
          <li v-if="route.path !== '/admin' && route.path !== '/admin/dashboard'"><span class="mx-2">/</span></li>
          <li v-if="route.path !== '/admin' && route.path !== '/admin/dashboard'">
            <span class="text-slate-400">{{ currentViewName }}</span>
          </li>
        </ol>
      </nav> -->
    </div>

    <!-- Section droite: Recherche (optionnel), Notifications, Profil utilisateur -->
    <div class="flex items-center space-x-5">
      <!-- Barre de recherche (optionnel) -->
      <!-- <div class="relative hidden lg:block">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
        </span>
        <input class="form-input bg-slate-700/50 border-slate-600 text-slate-300 placeholder-slate-500 pl-10 pr-4 rounded-full w-full text-sm focus:ring-blue-500 focus:border-blue-500 focus:bg-slate-700" type="text" placeholder="Rechercher...">
      </div> -->

      <!-- Icône de Notifications -->
      <button class="relative p-2 text-slate-400 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500 rounded-full transition-colors">
        <span class="sr-only">Voir notifications</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        <span class="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-slate-800"></span>
      </button>

      <!-- Menu déroulant Profil Utilisateur -->
      <div class="relative">
        <button @click="toggleProfileDropdown" class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
          <span class="sr-only">Ouvrir le menu utilisateur</span>
          <img class="h-10 w-10 rounded-full object-cover border-2 border-slate-600 hover:border-blue-500 transition-colors"
               :src="`https://ui-avatars.com/api/?name=${currentUser?.name || currentUser?.email || 'User'}&background=2563eb&color=fff&size=128`"
               :alt="currentUser?.name || 'Avatar utilisateur'">
          <div class="hidden md:flex flex-col items-start ml-3">
            <span class="text-sm font-medium text-slate-200">{{ currentUser?.name || currentUser?.email || 'Utilisateur' }}</span>
            <span class="text-xs text-slate-500">{{ currentUser?.role || 'Rôle' }}</span>
          </div>
           <svg class="hidden md:inline ml-2 h-5 w-5 text-slate-500 group-hover:text-slate-300 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
        <!-- Menu déroulant -->
        <transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <div v-if="profileDropdownOpen" class="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-2xl py-1 bg-slate-800 border border-slate-700 ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1">
            <div class="px-4 py-3 border-b border-slate-700">
              <p class="text-sm text-slate-200">Connecté en tant que</p>
              <p class="text-sm font-medium text-slate-300 truncate">{{ currentUser?.email }}</p>
            </div>
            <a href="#" class="block px-4 py-2 text-sm text-slate-400 hover:bg-slate-700/50 hover:text-slate-100" role="menuitem" tabindex="-1" id="user-menu-item-0">Votre Profil</a>
            <a href="#" class="block px-4 py-2 text-sm text-slate-400 hover:bg-slate-700/50 hover:text-slate-100" role="menuitem" tabindex="-1" id="user-menu-item-1">Paramètres</a>
            <a href="#" @click.prevent="logout" class="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300" role="menuitem" tabindex="-1" id="user-menu-item-2">Déconnexion</a>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../../store/auth';

const route = useRoute();
const authStore = useAuthStore();

const profileDropdownOpen = ref(false);

const toggleProfileDropdown = () => {
  profileDropdownOpen.value = !profileDropdownOpen.value;
};

const closeDropdown = (event) => {
  if (!event.target.closest('#user-menu-button') && !event.target.closest('.origin-top-right')) {
    profileDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', closeDropdown);
});
onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
});


const logout = () => {
  authStore.logout();
  profileDropdownOpen.value = false;
};

const currentUser = computed(() => authStore.user);

const currentViewName = computed(() => {
  if (route.meta && route.meta.title) {
    return route.meta.title;
  }
  if (route.name) {
    let name = route.name.toString();
    if (name.startsWith('Admin') && name !== 'Admin') name = name.substring(5);
    if (name.endsWith('Module')) name = name.substring(0, name.length - 6);
    if (name.endsWith('Management')) name = name.substring(0, name.length - 10);
    // Capitalize first letter of each word for multi-word names
    return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
  }

  const pathSegments = route.path.split('/').filter(Boolean);
  if (pathSegments.length > 1) {
    let name = pathSegments[pathSegments.length -1];
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
  if (pathSegments.length === 1 && (pathSegments[0] === 'admin' || pathSegments[0] === 'dashboard')) return 'Dashboard';
  return 'PMS Hôtel'; // Fallback
});

</script>

<style scoped>
/* Styles spécifiques pour la Topbar */
/* `left-64` doit correspondre à la largeur de la Sidebar. */
.form-input {
  border-width: 1px;
}
</style>
