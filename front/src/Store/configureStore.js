import { createStore } from 'redux';
import reducer from '../Reducers/user';

export default () => {
  const store = createStore(reducer);
  return store;
};
