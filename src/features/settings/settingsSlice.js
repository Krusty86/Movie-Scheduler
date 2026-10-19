import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notificationsEnabled: false,
  defaultReminderMinutes: 0,
  timezone: "Asia/Yangon",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    updateSettings: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateSettings } = settingsSlice.actions;
export default settingsSlice.reducer;