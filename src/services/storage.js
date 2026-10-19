const STORAGE_KEY = "anitrack-state-v1";

export function loadState() {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return undefined; // Let reducers use initial state
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Could not load state from localStorage", err);
    return undefined;
  }
}

export function saveState(state) {
  try {
    const serializedState = JSON.stringify({
      media: state.media,
      releases: state.releases,
      settings: state.settings,
    });
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (err) {
    console.error("Could not save state to localStorage", err);
  }
}