import axios from 'axios';
import type { CreateAxiosDefaults } from 'axios';

export function createAxios(config?: CreateAxiosDefaults) {
  const instance = axios.create(config);

  return instance;
}

export default createAxios;
