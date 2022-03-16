import React, { useReducer, createContext } from "react";
import jwtDecode from "jwt-decode";

const initialState = { user: null };

/* This is for saving the token in case of losing user status by refreshing page. */
if (localStorage.getItem("jwtToken")) {
  // This is for saving the token in case of losing user status by refreshing page
  const decodedToken = jwtDecode(localStorage.getItem("jwtToken"));

  if (decodedToken.exp * 1000 < Date.now()) {
    // exp = expration
    // unit is second, Data.now() is millisecond
    localStorage.removeItem("jwtToken");
  } else {
    initialState.user = decodedToken;
  }
}
/* Creating a context object. */
const AuthContext = createContext({
  user: null,
  login: (userData) => {},
  logout: () => {},
});

/**
 * When the LOGIN action is dispatched, the user is set to the payload. When the LOGOUT action is
 * dispatched, the user is set to null
 * @param state - The current state of the reducer.
 * @param action - The action object that was dispatched.
 * @returns The state of the reducer.
 */
function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
}

/**
 * The AuthProvider component is a React context provider that wraps around our AuthContext.Provider.
 * It takes in props and returns a provider with the user data from localStorage and a dispatch
 * function that allows us to update the user data
 * @param props - The props of the component that is using the AuthProvider.
 * @returns The AuthProvider component is being returned.
 */
function AuthProvider(props) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  // initialState makes its dynamic

  function login(userData) {
    localStorage.setItem("jwtToken", userData.token);
    dispatch({
      type: "LOGIN",
      payload: userData,
    });
  }

  function logout() {
    localStorage.removeItem("jwtToken");
    dispatch({ type: "LOGOUT" });
  }

  return (
    <AuthContext.Provider
      value={{ user: state.user, login, logout }}
      {...props}
    />
  );
}

export { AuthContext, AuthProvider };
