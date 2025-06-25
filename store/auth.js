import { defineStore } from 'pinia';
import apiClient from '../api/axios'; // Ajustez le chemin si nécessaire
import router from '../src/router'; // Ajustez le chemin si nécessaire

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('userData')) || null,
    // userRole est dérivé de l'objet user ou stocké séparément si nécessaire
    // status: { loggedIn: !!localStorage.getItem('token') } // Autre manière de gérer l'état de connexion
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    getUserRole: (state) => state.user?.role || null,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
  },

  actions: {
    async login(credentials) {
      this.loading = true;
      this.error = null;
      try {
        // Dans un vrai scénario, l'API renverrait le token et les infos utilisateur
        // const response = await apiClient.post('/auth/login', credentials);
        // const { token, user } = response.data;

        // Simulation basée sur la logique de Login.vue
        await new Promise(resolve => setTimeout(resolve, 500)); // Simuler latence
        let token, user;

        if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
          token = 'fake-jwt-token-admin-pinia';
          user = { email: credentials.email, name: 'Admin User', role: 'Admin' };
        } else if (credentials.email === 'reception@example.com' && credentials.password === 'password') {
          token = 'fake-jwt-token-reception-pinia';
          user = { email: credentials.email, name: 'Reception User', role: 'Receptionist' };
        } else if (credentials.email === 'server@example.com' && credentials.password === 'password') {
          token = 'fake-jwt-token-server-pinia';
          user = { email: credentials.email, name: 'Server User', role: 'Server' };
        } else {
          throw new Error('Email ou mot de passe incorrect.');
        }
        // Fin de la simulation

        this.token = token;
        this.user = user;
        localStorage.setItem('token', token);
        localStorage.setItem('userData', JSON.stringify(user));
        // localStorage.setItem('userRole', user.role); // Peut être redondant si user.role existe

        // Mettre à jour les headers par défaut d'Axios si nécessaire (déjà géré par l'intercepteur)
        // apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Redirection après login réussi
        if (user.role === 'Admin') router.push('/admin/dashboard');
        else if (user.role === 'Receptionist') router.push('/admin/rooms');
        else if (user.role === 'Server') router.push('/admin/restaurant');
        else router.push('/'); // Fallback

        return true;
      } catch (err) {
        this.error = err.response?.data?.message || err.message || 'Erreur de connexion';
        // Nettoyer en cas d'erreur
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        // localStorage.removeItem('userRole');
        // delete apiClient.defaults.headers.common['Authorization'];
        console.error('AuthStore login error:', err);
        return false;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.loading = true;
      // Idéalement, appeler une API de déconnexion si elle existe (pour invalider le token côté serveur)
      // await apiClient.post('/auth/logout');

      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      localStorage.removeItem('userRole'); // Assurez-vous de nettoyer tous les items liés
      // delete apiClient.defaults.headers.common['Authorization']; // Géré par l'intercepteur

      this.loading = false;
      router.push('/login');
      console.log('User logged out.');
    },

    // Action pour vérifier l'état d'authentification au démarrage de l'app (optionnel si déjà fait au state init)
    checkAuth() {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('userData');
        if (token && userData) {
            this.token = token;
            this.user = JSON.parse(userData);
            // apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            this.logout(); // Force la déconnexion si les infos sont incomplètes
        }
    },

    // Action pour rafraîchir les données utilisateur (si nécessaire)
    // async fetchUser() {
    //   if (!this.token) return;
    //   this.loading = true;
    //   try {
    //     const response = await apiClient.get('/auth/me'); // Endpoint pour obtenir l'utilisateur actuel
    //     this.user = response.data;
    //     localStorage.setItem('userData', JSON.stringify(response.data));
    //   } catch (error) {
    //     console.error('Failed to fetch user:', error);
    //     if (error.response && error.response.status === 401) {
    //       this.logout(); // Déconnecter si le token est invalide
    //     }
    //   } finally {
    //     this.loading = false;
    //   }
    // }
  },
});
