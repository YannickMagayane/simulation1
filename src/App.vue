<template>
  <div id="app-layout" class="flex h-screen bg-slate-900"> {/* Fond général sombre */}
    <!-- Sidebar: affichée conditionnellement -->
    <Sidebar v-if="showLayout" class="transition-all duration-300 ease-in-out" />

    <div
      :class="[
        'flex-1 flex flex-col transition-all duration-300 ease-in-out',
        showLayout ? 'ml-64' : 'ml-0'
      ]"
    >
      <!-- Topbar: affichée conditionnellement -->
      <Topbar v-if="showLayout" class="transition-all duration-300 ease-in-out" />

      <!-- Contenu principal de la page -->
      <main
        :class="[
          'flex-1 overflow-x-hidden overflow-y-auto',
          showLayout ? 'bg-slate-900' : 'bg-gradient-to-br from-gray-800 to-gray-900' // Fond différent pour login
        ]"
      >
        <router-view v-slot="{ Component, route }">
          <transition name="fade" mode="out-in">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Sidebar from '../components/Sidebar.vue';
import Topbar from '../components/Topbar.vue';
import { useAuthStore } from '../store/auth'; // Importer pour vérifier l'authentification

const route = useRoute();
const authStore = useAuthStore();

// showLayout est vrai si l'utilisateur est authentifié ET la route ne spécifie pas de cacher le layout
const showLayout = computed(() => {
  // La page de Login est gérée par `authStore.isAuthenticated` et la garde de navigation `requiresGuest`
  // Donc, si on n'est pas sur une route qui a `meta.hideLayout: true`, on affiche le layout.
  // La condition `authStore.isAuthenticated` assure que si le token est supprimé (déconnexion),
  // les gardes redirigeront vers Login, et `showLayout` deviendra faux pour Login.
  return authStore.isAuthenticated && !route.meta.hideLayout;
});

// On pourrait aussi explicitement vérifier le nom de la route 'Login' si les gardes ne suffisent pas
// const showLayout = computed(() => {
//   return route.name !== 'Login' && !route.meta.hideLayout;
// });
</script>

<style>
/* Styles globaux et transitions */
body {
  @apply bg-slate-900; /* S'assurer que le body a aussi un fond sombre */
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Scrollbar styling (optionnel, pour un look plus moderne) */
/* Webkit (Chrome, Safari, Edge) */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: theme('colors.slate.800');
  border-radius: 10px;
}
::-webkit-scrollbar-thumb {
  background: theme('colors.slate.600');
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: theme('colors.slate.500');
}
/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: theme('colors.slate.600') theme('colors.slate.800');
}
</style>
