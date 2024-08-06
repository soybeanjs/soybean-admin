import { addAPIProvider, disableCache , addCollection } from '@iconify/vue';

/** Setup the iconify offline */
export function setupIconifyOffline() {
  const { VITE_ICONIFY_URL } = import.meta.env;
  addCollection({
    prefix: 'soybean',
    icons:{
      star:{
        body: '<path d="M10 14.2L5 17l1-5.6-4-4 5.5-.7 2.5-5 2.5 5 5.6.8-4 4 .9 5.5z" stroke="currentColor" fill="none" fill-rule="evenodd" stroke-linejoin="round"></path>',
        width: 20,
        height: 20
      }
    }
  })
  if (VITE_ICONIFY_URL) {
    addAPIProvider('', { resources: [VITE_ICONIFY_URL] });

    disableCache('all');
  }
}
