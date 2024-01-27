import { useContext } from '@sa/hooks';

function useRoleSearch(searchParams: Api.SystemManage.RoleSearchParams) {
  return {
    searchParams
  };
}

export const { setupStore: setupRoleSearchContext, useStore: useRoleSearchContext } = useContext(
  'role-search',
  useRoleSearch
);
