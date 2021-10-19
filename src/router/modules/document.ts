import { Document } from '@vicons/carbon';
import type { CustomRoute } from '@/interface';
import { EnumRoutePath, EnumRouteTitle } from '@/enum';
import { BasicLayout } from '@/layouts';
import { RouteNameMap } from '../helpers';
import { DocumentVue, DocumentVite, DocumentNaive } from '../components';

const DOCUMENT: CustomRoute = {
  name: RouteNameMap.get('document'),
  path: EnumRoutePath.document,
  component: BasicLayout,
  redirect: { name: RouteNameMap.get('document_vue') },
  meta: {
    requiresAuth: true,
    title: EnumRouteTitle.document,
    icon: Document
  },
  children: [
    {
      name: RouteNameMap.get('document_vue'),
      path: EnumRoutePath.document_vue,
      component: DocumentVue,
      meta: {
        requiresAuth: true,
        title: EnumRouteTitle.document_vue,
        fullPage: true
      }
    },
    {
      name: RouteNameMap.get('document_vite'),
      path: EnumRoutePath.document_vite,
      component: DocumentVite,
      meta: {
        requiresAuth: true,
        title: EnumRouteTitle.document_vite,
        fullPage: true
      }
    },
    {
      name: RouteNameMap.get('document_naive'),
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
