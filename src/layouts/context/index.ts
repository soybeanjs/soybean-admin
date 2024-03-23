import { useContext } from '@sa/hooks';
import { useMixMenu } from '../hooks';

export const { setupStore: setupMixMenuContext, useStore: useMixMenuContext } = useContext('mix-menu', useMixMenu);
