import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as documentApi from '../../api/documentApi';

export const fetchDocumentsAsync = createAsyncThunk('documents/fetchDocuments', async ({ companyId, params }, { rejectWithValue }) => {
  try {
    const res = await documentApi.fetchCompanyDocuments(companyId, params);
    return res;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch documents.');
  }
});

export const uploadDocumentAsync = createAsyncThunk('documents/uploadDocument', async ({ formData, onProgress }, { rejectWithValue }) => {
  try {
    const res = await documentApi.uploadDocument(formData, onProgress);
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to upload document.');
  }
});

export const deleteDocumentAsync = createAsyncThunk('documents/deleteDocument', async (documentId, { rejectWithValue }) => {
  try {
    await documentApi.deleteDocument(documentId);
    return documentId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete document.');
  }
});

export const toggleFavoriteAsync = createAsyncThunk('documents/toggleFavorite', async (documentId, { rejectWithValue }) => {
  try {
    const res = await documentApi.toggleFavoriteDocument(documentId);
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update favorite.');
  }
});

const documentSlice = createSlice({
  name: 'documents',
  initialState: {
    list: [],
    pagination: { page: 1, limit: 10, totalItems: 0, totalPages: 1 },
    loading: false,
    error: null
  },
  reducers: {
    clearDocumentError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Documents
      .addCase(fetchDocumentsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocumentsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchDocumentsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Upload Document
      .addCase(uploadDocumentAsync.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
        state.pagination.totalItems += 1;
      })
      // Delete Document
      .addCase(deleteDocumentAsync.fulfilled, (state, action) => {
        state.list = state.list.filter((d) => d._id !== action.payload);
        state.pagination.totalItems -= 1;
      })
      // Toggle Favorite
      .addCase(toggleFavoriteAsync.fulfilled, (state, action) => {
        const index = state.list.findIndex((d) => d._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });
  }
});

export const { clearDocumentError } = documentSlice.actions;
export default documentSlice.reducer;
