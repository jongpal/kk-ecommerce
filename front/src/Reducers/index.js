import { combineReducers } from 'redux';
import user from './user';

const rootReducer = combineReducers({
    index: () => user
  });
  
  export default rootReducer;