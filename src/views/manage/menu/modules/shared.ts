const LAYOUT_PREFIX = 'layout.';
const VIEW_PREFIX = 'view.';

export function getLayoutAndPage(component?: string | null) {
  const FIRST_LEVEL_ROUTE_COMPONENT_SPLIT = '$';

  let layout = '';
  let page = '';

  const [layoutOrPage, pageItem] = component?.split(FIRST_LEVEL_ROUTE_COMPONENT_SPLIT) || [];

  layout = getLayout(layoutOrPage);
  page = getPage(pageItem || layoutOrPage);

  return { layout, page };
}

function getLayout(layout: string) {
  return layout.startsWith(LAYOUT_PREFIX) ? layout.replace(LAYOUT_PREFIX, '') : '';
}

function getPage(page: string) {
  return page.startsWith(VIEW_PREFIX) ? page.replace(VIEW_PREFIX, '') : '';
}
