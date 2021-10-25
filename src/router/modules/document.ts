import { Document } from '@vicons/carbon';
import type { CustomRoute } from '@/interface';
import { EnumRoutePath, EnumRouteTitle } from '@/enum';
import { BasicLayout } from '@/layouts';
import { ROUTE_NAME_MAP, setRouterCacheName } from '@/utils';
import DocumentVue from '@/views/document/vue/index.vue';
import DocumentVite from '@/views/document/vite/index.vue';
import DocumentNaive from '@/views/document/naive/index.vue';

setRouterCacheName(DocumentVue, ROUTE_NAME_MAP.get('document_vue'));
setRouterCacheName(DocumentVite, ROUTE_NAME_MAP.get('document_vite'));
setRouterCacheName(DocumentNaive, ROUTE_NAME_MAP.get('document_naive'));

const DOCUMENT: CustomRoute = {
  name: ROUTE_NAME_MAP.get('document'),
  path: EnumRoutePath.document,
  component: BasicLayout,
  redirect: { name: ROUTE_NAME_MAP.get('document_vue') },
  meta: {
    requiresAuth: true,
    title: EnumRouteTitle.document,
    icon: Document
  },
  children: [
    {
      name: ROUTE_NAME_MAP.get('document_vue'),
      path: EnumRoutePath.document_vue,
      component: DocumentVue,
      meta: {
        requiresAuth: true,
        title: EnumRouteTitle.document_vue,
        fullPage: true,
        keepAlive: true
      }
    },
    {
      name: ROUTE_NAME_MAP.get('document_vite'),
      path: EnumRoutePath.document_vite,
      component: DocumentVite,
      meta: {
        requiresAuth: true,
        title: EnumRouteTitle.document_vite,
        fullPage: true
      }
    },
    {
      name: ROUTE_NAME_MAP.get('document_naive'),
      path: EnumRoutePath.document_naive,
      component: DocumentNaive,
      meta: {
        requiresAuth: true,
        title: EnumRouteTitle.document_naive,
        fullPage: true
      }
    }
  ]
};

export default DOCUMENT;
