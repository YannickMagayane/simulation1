// 🎯 Projet : PMS Web pour Hôtel avec Restaurant & Bar
// Technologies : Vue.js 3 (Composition API) + Vue Router + Axios + TailwindCSS
// Objectif : Créer une interface web ultra-moderne avec un design professionnel pour la gestion de chambres, check-in / check-out, suivi des ventes du bar & restaurant, et un tableau de bord global administrateur.

// 📌 Fonctionnalités à générer :

// 1. 🛏️ Gestion des chambres (Rooms.vue)
// - Affichage de la liste des chambres sous forme de cartes ou tableau avec :
//   - Numéro chambre, type, statut (libre, occupée, en nettoyage)
//   - Bouton "Check-in" → Formulaire client (nom, date, durée)
//   - Bouton "Check-out" → Génération facture + libération chambre
// - Badge coloré : vert (libre), rouge (occupée), orange (nettoyage)

// 2. 🍽️ Module restaurant/bar (Restaurant.vue)
// - Interface pour prise de commandes (produit, quantité, table ou chambre liée)
// - Ajout de commande à une facture (client interne ou externe)
// - Statut commande : En attente, En préparation, Servie
// - Tableau de comptabilité journalière (produit vendu, quantité, total)

// 3. 💰 Comptabilité et Facturation (Accounting.vue)
// - Vue administrateur avec :
//   - Total des ventes du jour par catégorie : chambres, restaurant, bar
//   - Graphique revenu hebdo/mois (Chart.js)
//   - Liste des factures avec lien de détail
//   - Filtrage par date, service, chambre, client

// 4. 📊 Dashboard global (AdminDashboard.vue)
// - Cartes résumées : Chambres occupées / libres, Ventes bar, Ventes resto, Revenus totaux
// - Graphique des ventes de la semaine
// - Notifications récentes (nouvelle réservation, commande urgente)
// - Section "Top produits vendus" (bar/restaurant)

// 5. 👤 Authentification et rôles (Login.vue + Guard)
// - Page de login avec JWT (email, password)
// - Rôles : Admin (toutes les vues), Réceptionniste (check-in/out uniquement), Serveur (commandes uniquement)

// 📦 API (mockée ou réelle Django DRF) attendue :
// - GET /rooms, POST /checkin, POST /checkout
// - GET /orders, POST /orders, GET /sales
// - GET /revenues?date=today

// 🎨 Design UI/UX attendu (exceptionnel) :
// - Dashboard responsive full screen avec Sidebar + Topbar
// - Utilisation de Tailwind : rounded-2xl, bg-gradient, drop-shadow, cards modernes
// - Couleurs cohérentes (bleu nuit, vert, gris clair, rouge d’alerte)
// - Icônes modernes : Lucide / Heroicons
// - Composants élégants : Modal, Table, Alert, Button, Input

// 📂 Arborescence de base à générer :
// - /views: AdminDashboard.vue, Rooms.vue, Restaurant.vue, Accounting.vue, Login.vue
// - /components: RoomCard.vue, OrderTable.vue, RevenueChart.vue, Sidebar.vue, Topbar.vue, InvoiceModal.vue
// - /router: routes.js (avec guards par rôle)
// - /store: Pinia ou Vuex
// - /api: axios.js pour appels API

// 👉 Commence à générer les composants UI à partir du fichier `AdminDashboard.vue` avec 4 cartes résumées (chambres occupées, libres, ventes bar, ventes resto) + graphique hebdomadaire des revenus.
// Design propre, soigné, avec bonne lisibilité et responsive dès le départ.
