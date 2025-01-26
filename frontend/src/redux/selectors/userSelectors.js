import { createSelector } from "reselect";

const selectUserState = (state) => {
  console.log("Redux State:", state);
  return state.user;
};

export const selectUser = createSelector(
  [selectUserState],
  (user) => {
    console.log("User state:", user);
    return {
      loading: user?.loading || false,
      error: user?.error || null,
      loggedIn: user?.loggedIn || false,
    };
  }
);
