import { createSelector } from "reselect";

const selectUserState = (state) => {
  return state.user;
};

export const selectUser = createSelector(
  [selectUserState],
  (user) => {
    return {
      loading: user?.loading || false,
      error: user?.error || null,
      loggedIn: user?.loggedIn || false,
    };
  }
);
