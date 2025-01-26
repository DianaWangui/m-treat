import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    loggedIn: false,
    user: null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
  },
  reducers: {
    checkLoginStatus: (state) => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (token && user) {
        state.loggedIn = true;
        state.token = token;
        state.user = JSON.parse(user);
        state.loading = false;
        state.error = null;
      }
    },

    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    loginSuccess: (state, action) => {
      const { token, user } = action.payload;

      state.loggedIn = true;
      state.token = token;
      state.user = user;
      state.loading = false;
      state.error = null;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    },

    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    logout: (state) => {
      state.loggedIn = false;
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },

    // Action to set user data (fetched from API after login)
    setUserData: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { checkLoginStatus, loginStart, loginSuccess, loginFailure, logout, setUserData } = userSlice.actions;

export const loginUser = (credentials) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const response = await axios.post("http://127.0.0.1:8000/api/v1/accounts/login/", credentials);
    const { access, refresh, user } = response.data;

    if (access && user && refresh) {
      dispatch(loginSuccess({ token: access, user }));
      dispatch(fetchUserData(access)); // Fetch additional user data
      console.log("Login successful!");
    } else {
      throw new Error("Invalid login response - Missing token or user");
    }
  } catch (error) {
    console.error("Login error:", error);
    dispatch(loginFailure(error.response?.data?.message || "Login failed"));
  }
};

// Fetch user data from API using the access token
export const fetchUserData = (token) => async (dispatch) => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/v1/accounts/profile/", {
      headers: {
        Authorization: `Bearer ${token}`, // Send token in header
      },
    });

    const userData = response.data;
    dispatch(setUserData(userData)); // Store the user data in Redux
  } catch (error) {
    console.error("Error fetching user data:", error);
    // Optionally dispatch a failure action here
  }
};

export default userSlice.reducer;
