import type { RouteRecordRaw } from 'vue-router';
import { BasicLayout } from '@/layouts';
import { DocumentVue, DocumentVite, DocumentNaive } from '@/views';
import { routeName, routePath, routeTitle } from '../constant';

const document: RouteRecordRaw = {
  name: routeName('document'),
  path: routePath('document'),
  component: BasicLayout,
  redirect: { name: routeName('document_vue') },
  meta: {
    requiresAuth: true,
    title: routeTitle('document'),
    icon: 'carbon:document',
    order: 2
  },
  children: [
    {
      name: routeName('document_vue'),
      path: routePath('document_vue'),
      component: DocumentVue,
      meta: {
        requiresAuth: true,
        title: routeTitle('document_vue'),
        fullPage: true,
        keepAlive: true
      }
    },
    {
      name: routeName('document_vite'),
      path: routePath('document_vite'),
      component: DocumentVite,
      meta: {
        requiresAuth: true,
        title: routeTitle('document_vite'),
        fullPage: true
      }
    },
    {
      name: routeName('document_naive'),
      path: routePath('document_naive'),
      component: DocumentNaive,
      meta: {
        requiresAuth: true,
        title: routeTitle('document_naive'),
        fullPage: true
      }
    }
  ]
};

export default document;
