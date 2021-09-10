import type { Ref } from 'vue';
import { useCreateContext } from '@/hooks';
import { LoginModuleType } from '@/interface';

interface ShareState {
  activeModule: Ref<LoginModuleType>;
  handleLoginModule(module: LoginModuleType): void;
}

const { useContext, useProvider } = useCreateContext<ShareState>();

export function useLoginContext() {
  return {
    useContext,
    useProvider
  };
}
