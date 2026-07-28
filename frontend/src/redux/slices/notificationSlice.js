import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as notificationApi from '../../api/notificationApi';

export const fetchNotificationsAsync = createAsyncThunk('notifications/fetchNotifications', async (_, { rejectWithValue }) => {
  try {
    const res = await notificationApi.fetchNotifications();
    return res;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications.');
  }
});

export const markReadAsync = createAsyncThunk('notifications/markRead', async (id, { rejectWithValue }) => {
  try {
    const res = await notificationApi.markNotificationRead(id);
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to mark notification read.');
  }
});

export const markAllReadAsync = createAsyncThunk('notifications/markAllRead', async (_, { rejectWithValue }) => {
  try {
    await notificationApi.markAllNotificationsRead();
    return true;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to mark all notifications read.');
  }
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    list: [],
    unreadCount: 0,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificationsAsync.fulfilled, (state, action) => {
        state.list = action.payload.data;
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(markReadAsync.fulfilled, (state, action) => {
        const item = state.list.find((n) => n._id === action.payload._id);
        if (item && !item.isRead) {
          item.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllReadAsync.fulfilled, (state) => {
        state.list.forEach((n) => (n.isRead = true));
        state.unreadCount = 0;
      });
  }
});

export default notificationSlice.reducer;
