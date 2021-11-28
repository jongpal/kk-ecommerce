const initialState = {
    userId:-1,
    isLoggedIn: false,
  };
  
  export const LOGIN_REQUEST = 'LOGIN_REQUEST';
  export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';

  export const goLogin = Id => ({ type: LOGIN_REQUEST, Id });
  export const goLogout = () => ({ type: LOGOUT_REQUEST });

  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case LOGIN_REQUEST:
        return {
          ...state,
          userId: action.Id,
          isLoggedIn: true,
        };
      case LOGOUT_REQUEST:
        return {
          ...state,
          userId:-1,
          isLoggedIn: false,
        };
      default:
        return state;
    }
  };
  
  export default reducer;
  