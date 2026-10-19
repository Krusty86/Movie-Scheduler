import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const releasesSlice = createSlice({
  name: "releases",
  initialState,
  reducers: {
    addRelease: (state, action) => {
      state.items.push(action.payload);
    },
    updateRelease: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    deleteRelease: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    // Useful for cascade deletion when a parent Media is deleted
    deleteReleasesByMediaId: (state, action) => {
      state.items = state.items.filter(item => item.mediaId !== action.payload);
    },
    toggleReleaseNotification: (state, action) => {
      const release = state.items.find(item => item.id === action.payload);
      if (release) {
        release.notificationEnabled = !release.notificationEnabled;
      }
    },
    markReleaseNotified: (state, action) => {
      const release = state.items.find(item => item.id === action.payload);
      if (release) {
        release.notifiedAt = new Date().toISOString();
      }
    },
  },
});

export const {
  addRelease,
  updateRelease,
  deleteRelease,
  deleteReleasesByMediaId,
  toggleReleaseNotification,
  markReleaseNotified,
} = releasesSlice.actions;

export default releasesSlice.reducer;