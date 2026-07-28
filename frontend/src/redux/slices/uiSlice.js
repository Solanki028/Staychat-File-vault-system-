import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSidebarOpen: true,
  theme: 'light',
  toast: null
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
    showToast: (state, action) => {
      state.toast = action.payload; // { type: 'success' | 'error' | 'info', message: string }
    },
    clearToast: (state) => {
      state.toast = null;
    }
  }
});

export const { toggleSidebar, setSidebarOpen, showToast, clearToast } = uiSlice.actions;
export default uiSlice.reducer;
