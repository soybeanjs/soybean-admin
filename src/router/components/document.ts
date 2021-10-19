import { RouteNameMap, setCacheName } from '../helpers';
import DocumentVue from '@/views/document/vue/index.vue';
import DocumentVite from '@/views/document/vite/index.vue';
import DocumentNaive from '@/views/document/naive/index.vue';

setCacheName(DocumentVue, RouteNameMap.get('document_vue'));
setCacheName(DocumentVite, RouteNameMap.get('document_vite'));
setCacheName(DocumentNaive, RouteNameMap.get('document_naive'));

export { DocumentVue, DocumentVite, DocumentNaive };
