import auth from './auth';
import route from './route';
import management from './management';
import crud from './crud';

export default [...auth, ...route, ...management, ...crud];
