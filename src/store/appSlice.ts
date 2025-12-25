import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AppState = { hasOnboarded: boolean };

const initialState: AppState = { hasOnboarded: false };

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setHasOnboarded(state, action: PayloadAction<boolean>) {
      state.hasOnboarded = action.payload;
    },
  },
});

export const { setHasOnboarded } = appSlice.actions;
export default appSlice.reducer;
