import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as bankApi from '../../api/bankApi';

export const fetchBankAccountsAsync = createAsyncThunk('bank/fetchBankAccounts', async (companyId, { rejectWithValue }) => {
  try {
    const res = await bankApi.fetchCompanyBankAccounts(companyId);
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch bank accounts.');
  }
});

export const createBankAccountAsync = createAsyncThunk('bank/createBankAccount', async (bankData, { rejectWithValue }) => {
  try {
    const res = await bankApi.createBankAccount(bankData);
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create bank account.');
  }
});

export const setPrimaryAccountAsync = createAsyncThunk('bank/setPrimaryAccount', async (bankId, { rejectWithValue }) => {
  try {
    const res = await bankApi.setPrimaryBankAccount(bankId);
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to set primary bank account.');
  }
});

export const deleteBankAccountAsync = createAsyncThunk('bank/deleteBankAccount', async (bankId, { rejectWithValue }) => {
  try {
    await bankApi.deleteBankAccount(bankId);
    return bankId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete bank account.');
  }
});

const bankSlice = createSlice({
  name: 'bank',
  initialState: {
    list: [],
    loading: false,
    error: null
  },
  reducers: {
    clearBankError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchBankAccountsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBankAccountsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchBankAccountsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createBankAccountAsync.fulfilled, (state, action) => {
        if (action.payload.isPrimary) {
          state.list.forEach((b) => (b.isPrimary = false));
        }
        state.list.unshift(action.payload);
      })
      // Set Primary
      .addCase(setPrimaryAccountAsync.fulfilled, (state, action) => {
        state.list.forEach((b) => {
          b.isPrimary = b._id === action.payload._id;
        });
      })
      // Delete
      .addCase(deleteBankAccountAsync.fulfilled, (state, action) => {
        state.list = state.list.filter((b) => b._id !== action.payload);
      });
  }
});

export const { clearBankError } = bankSlice.actions;
export default bankSlice.reducer;
