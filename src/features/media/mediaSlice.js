import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  searchQuery: "",
  filterStatus: "ALL",
  filterType: "ALL",
};

const mediaSlice = createSlice({
  name: "media",
  initialState,
  reducers: {
    addMedia: (state, action) => {
      state.items.push(action.payload);
    },
    updateMedia: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    deleteMedia: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    setCurrentEpisode: (state, action) => {
      const { id, episode } = action.payload;
      const media = state.items.find(item => item.id === id);
      if (media) {
        media.currentEpisode = episode;
      }
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setFilterStatus: (state, action) => {
      state.filterStatus = action.payload;
    },
    setFilterType: (state, action) => {
      state.filterType = action.payload;
    },
  },
});

export const {
  addMedia,
  updateMedia,
  deleteMedia,
  setCurrentEpisode,
  setSearchQuery,
  setFilterStatus,
  setFilterType,
} = mediaSlice.actions;

export default mediaSlice.reducer;