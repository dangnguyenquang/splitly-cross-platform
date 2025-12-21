// src/store/groupSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Group } from '../types';

interface GroupState {
  currentGroup: Group | null;
  isFetching: boolean;
  error: boolean;
}

const initialState: GroupState = {
  currentGroup: null,
  isFetching: false,
  error: false,
};

const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    /* ================= CREATE GROUP ================= */
    createGroupStart(state) {
      state.isFetching = true;
      state.error = false;
    },

    createGroupSuccess(state, action: PayloadAction<Group>) {
      state.isFetching = false;
      state.currentGroup = action.payload; // ✅ Set the created group as current
      state.error = false;
    },

    createGroupFail(state) {
      state.isFetching = false;
      state.error = true;
    },

    /* ================= FETCH GROUPS ================= */
    fetchGroupsStart(state) {
      state.isFetching = true;
      state.error = false;
    },

    fetchGroupsSuccess(state, action: PayloadAction<Group[]>) {
      state.isFetching = false;
      // ✅ REMOVED: No longer storing groups array
      state.error = false;
    },

    fetchGroupsFail(state) {
      state.isFetching = false;
      state.error = true;
    },

    /* ================= CURRENT GROUP ================= */
    setCurrentGroup(state, action: PayloadAction<Group>) {
      state.currentGroup = action.payload;
    },

    clearCurrentGroup(state) {
      state.currentGroup = null;
    },
  },
});

export const {
  createGroupStart,
  createGroupSuccess,
  createGroupFail,
  fetchGroupsStart,
  fetchGroupsSuccess,
  fetchGroupsFail,
  setCurrentGroup,
  clearCurrentGroup,
} = groupSlice.actions;

export default groupSlice.reducer;