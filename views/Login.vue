<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl">
      <div>
        <svg class="mx-auto h-12 w-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
        </svg>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Connectez-vous à votre compte PMS
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <input type="hidden" name="remember" value="true">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">Adresse Email</label>
            <input id="email-address" name="email" type="email" autocomplete="email" required v-model="credentials.email"
                   class="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                   placeholder="Adresse Email">
          </div>
          <div>
            <label for="password" class="sr-only">Mot de passe</label>
            <input id="password" name="password" type="password" autocomplete="current-password" required v-model="credentials.password"
                   class="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                   placeholder="Mot de passe">
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input id="remember-me" name="remember-me" type="checkbox" v-model="credentials.rememberMe"
                   class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              Se souvenir de moi
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-blue-600 hover:text-blue-500">
              Mot de passe oublié?
            </a>
          </div>
        </div>

        <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong class="font-bold">Erreur:</strong>
          <span class="block sm:inline"> {{ errorMessage }}</span>
        </div>

        <div>
          <button type="submit" :disabled="loading"
                  class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
            <span class="absolute left-0 inset-y-0 flex items-center pl-3" v-if="loading">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ loading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
// import apiClient from '../../api/axios'; // À décommenter lorsque l'API sera prête

const router = useRouter();

const credentials = reactive({
  email: '',
  password: '',
  rememberMe: false,
});

const loading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = '';

  // Simulation d'un appel API avec JWT
  // TODO: Remplacer par un vrai appel API avec apiClient.post('/auth/login', credentials)
  try {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simuler la latence réseau

    // Logique de mock pour la simulation
    if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
      const mockToken = 'fake-jwt-token-admin';
      const mockUser = { email: credentials.email, role: 'Admin' }; // Simuler rôle

      localStorage.setItem('token', mockToken);
      localStorage.setItem('userRole', mockUser.role); // Stocker le rôle
      localStorage.setItem('userData', JSON.stringify(mockUser)); // Stocker les infos utilisateur

      console.log('Login successful, token:', mockToken, 'role:', mockUser.role);
      router.push('/admin/dashboard'); // Redirection vers le dashboard admin
    } else if (credentials.email === 'reception@example.com' && credentials.password === 'password') {
      const mockToken = 'fake-jwt-token-reception';
      const mockUser = { email: credentials.email, role: 'Receptionist' };
      localStorage.setItem('token', mockToken);
      localStorage.setItem('userRole', mockUser.role);
      localStorage.setItem('userData', JSON.stringify(mockUser));
      console.log('Login successful, token:', mockToken, 'role:', mockUser.role);
      router.push('/admin/rooms'); // Redirection vers la gestion des chambres pour réceptionniste
    } else if (credentials.email === 'server@example.com' && credentials.password === 'password') {
      const mockToken = 'fake-jwt-token-server';
      const mockUser = { email: credentials.email, role: 'Server' };
      localStorage.setItem('token', mockToken);
      localStorage.setItem('userRole', mockUser.role);
      localStorage.setItem('userData', JSON.stringify(mockUser));
      console.log('Login successful, token:', mockToken, 'role:', mockUser.role);
      router.push('/admin/restaurant'); // Redirection vers le module restaurant pour serveur
    }
    else {
      throw new Error('Email ou mot de passe incorrect.');
    }
  } catch (error) {
    console.error('Login failed:', error);
    errorMessage.value = error.message || 'Une erreur est survenue lors de la connexion.';
    // Si l'API renvoie des erreurs spécifiques (ex: error.response.data.message), les afficher.
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Styles spécifiques pour la page de login si Tailwind ne suffit pas */
/* Le style est principalement géré par les classes TailwindCSS inline */
</style>
