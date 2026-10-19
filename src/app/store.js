import { configureStore } from "@reduxjs/toolkit";
import mediaReducer from "../features/media/mediaSlice";
import releasesReducer from "../features/releases/releasesSlice";
import settingsReducer from "../features/settings/settingsSlice";
import { loadState, saveState } from "../services/storage";

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    media: mediaReducer,
    releases: releasesReducer,
    settings: settingsReducer,
  },
  preloadedState,
});

// Save to localStorage on every state change (debounced or simple direct subscribe)
store.subscribe(() => {
  saveState(store.getState());
});