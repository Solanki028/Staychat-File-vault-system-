import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as invoiceApi from '../../api/invoiceApi';

export const fetchInvoicesAsync = createAsyncThunk('invoices/fetchInvoices', async ({ companyId, params }, { rejectWithValue }) => {
  try {
    const res = await invoiceApi.fetchCompanyInvoices(companyId, params);
    return res;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch invoices.');
  }
});

export const createInvoiceAsync = createAsyncThunk('invoices/createInvoice', async (invoiceData, { rejectWithValue }) => {
  try {
    const res = await invoiceApi.createInvoice(invoiceData);
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create invoice.');
  }
});

export const updateInvoiceStatusAsync = createAsyncThunk('invoices/updateInvoiceStatus', async ({ invoiceId, status }, { rejectWithValue }) => {
  try {
    const res = await invoiceApi.updateInvoiceStatus(invoiceId, status);
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update invoice status.');
  }
});

export const deleteInvoiceAsync = createAsyncThunk('invoices/deleteInvoice', async (invoiceId, { rejectWithValue }) => {
  try {
    await invoiceApi.deleteInvoice(invoiceId);
    return invoiceId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete invoice.');
  }
});

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState: {
    list: [],
    pagination: { page: 1, limit: 10, totalItems: 0, totalPages: 1 },
    loading: false,
    error: null
  },
  reducers: {
    clearInvoiceError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchInvoicesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoicesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchInvoicesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createInvoiceAsync.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
        state.pagination.totalItems += 1;
      })
      // Update Status
      .addCase(updateInvoiceStatusAsync.fulfilled, (state, action) => {
        const index = state.list.findIndex((i) => i._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteInvoiceAsync.fulfilled, (state, action) => {
        state.list = state.list.filter((i) => i._id !== action.payload);
        state.pagination.totalItems -= 1;
      });
  }
});

export const { clearInvoiceError } = invoiceSlice.actions;
export default invoiceSlice.reducer;
