import { createPinia } from 'pinia';

const pinia = createPinia();

// Vous pouvez ajouter des plugins Pinia ici si nécessaire
// Exemple:
// pinia.use(({ store }) => {
//   store.$subscribe((mutation, state) => {
//     // Réagir aux changements d'état, par exemple, sauvegarder dans localStorage
//     console.log(`[Pinia Sub] Mutation in ${mutation.storeId}:`, mutation);
//     // Exemple: if (mutation.storeId === 'auth') { localStorage.setItem('authState', JSON.stringify(state)); }
//   });
//   store.$onAction(({ name, store, args, after, onError }) => {
//     console.log(`[Pinia Action] Start "${name}" with params [${args.join(', ')}].`);
//     after((result) => {
//       console.log(`[Pinia Action] Finished "${name}" with result:`, result);
//     });
//     onError((error) => {
//       console.error(`[Pinia Action] Failed "${name}" with error:`, error);
//     });
//   });
// });

export default pinia;
