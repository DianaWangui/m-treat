/*
This is a file that defines a Redux slice for managing user authentication and session state.
It handles login, logout, token storage, user data updates, and token expiration checks.
The state includes user information, authentication tokens, and loading/error statuses.
It has the APIs for login, update user profile and retrieve user data from backed
*/

import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from './axiosInterceptor';
import { jwtDecode } from 'jwt-decode';

export const userSlice = createSlice({
  name: "user",
  initialState: {
    loggedIn: false,
    user: null,
    accessToken: localStorage.getItem("access_token") || null,
    refreshToken: localStorage.getItem("refresh_token") || null,
    loading: false,
    error: null,
    tokenExpiration: localStorage.getItem("token_expiration") || null,
    decodedToken: null,
  },

  reducers: {
    // Checks if the user is logged in by validating stored tokens
    checkLoginStatus: (state) => {
      const accessToken = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");
      const user = localStorage.getItem("user");

      if (accessToken && refreshToken && user) {
        try {
          const decodedToken = jwtDecode(accessToken);
          const expirationTime = decodedToken.exp * 1000;
          const currentTime = Date.now();

          if (expirationTime < currentTime) {
            state.loggedIn = false;
            state.accessToken = null;
            state.refreshToken = null;
            state.user = null;
            state.tokenExpiration = null;
            localStorage.clear();
          } else {
            state.loggedIn = true;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
            state.user = JSON.parse(user);
            state.tokenExpiration = expirationTime;
            state.decodedToken = decodedToken;
          }
        } catch (error) {
          state.loggedIn = false;
          localStorage.clear();
        }
      } else {
        state.loggedIn = false;
      }
      state.loading = false;
      state.error = null;
    },

    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    // Handling successful login by storing tokens and user data
    loginSuccess: (state, action) => {
      const { access, refresh, user } = action.payload;
      const decodedToken = jwtDecode(access);
      const expirationTime = decodedToken.exp * 1000;

      state.loggedIn = true;
      state.accessToken = access;
      state.refreshToken = refresh;
      state.user = user;
      state.loading = false;
      state.error = null;
      state.tokenExpiration = expirationTime;
      state.decodedToken = decodedToken;

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem('token_expiration', expirationTime.toString());
    },

    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Logs the user out by clearing tokens and resetting state
    logout: (state) => {
      state.loggedIn = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.tokenExpiration = null;
      state.decodedToken = null;
      state.loading = false;
      state.error = null;
      localStorage.clear();
    },

    setUserData: (state, action) => {
      state.user = action.payload;
    },

    updateUserDetailsSuccess: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },

    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },

    setDecodedToken: (state, action) => {
      state.decodedToken = action.payload;
    }
  },
});

export const { 
  checkLoginStatus, 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  setUserData, 
  updateUserDetailsSuccess, 
  setAccessToken, 
  setDecodedToken 
} = userSlice.actions;

// Handles user login by sending credentials to the server
export const loginUser = (credentials) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const response = await axiosInstance.post("accounts/login/", credentials);
    await dispatch(loginSuccess(response.data));
    return response.data;
  } catch (error) {
    dispatch(loginFailure(error.response?.data?.detail || "Login failed"));
    throw error; 
  }
};
// Fetches user data from the server
export const fetchUserData = () => async (dispatch, getState) => {
  const token = getState().user.accessToken;
  if (token) {
    try {
      const response = await axiosInstance.get("accounts/profile/");
      dispatch(setUserData(response.data));
    } catch (error) {
      dispatch(loginFailure(error.response?.data?.detail || "Error fetching user data"));
    }
  }
};

// Updates user profile information on the server
export const updateUserDetails = (updatedDetails) => async (dispatch) => {
  try {
    const response = await axiosInstance.put("accounts/update-profile/", updatedDetails);
    dispatch(updateUserDetailsSuccess(response.data));
  } catch (error) {
    dispatch(loginFailure(error.response?.data?.detail || "Error updating user details"));
  }
};

// Refreshes the access token using the refresh token
export const refreshToken = () => async (dispatch, getState) => {
  const refreshToken = getState().user.refreshToken;
  if (!refreshToken) return;

  try {
    const response = await axiosInstance.post("accounts/refresh-token/", { refresh: refreshToken });
    dispatch(setAccessToken(response.data.access));
  } catch (error) {
    dispatch(loginFailure("Session expired. Please log in again."));
    dispatch(logout());
  }
};

export default userSlice.reducer;