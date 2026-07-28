import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as companyApi from '../../api/companyApi';

export const fetchCompaniesAsync = createAsyncThunk('companies/fetchCompanies', async (params, { rejectWithValue }) => {
  try {
    const res = await companyApi.fetchCompanies(params);
    return res;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch companies.');
  }
});

export const createCompanyAsync = createAsyncThunk('companies/createCompany', async (companyData, { rejectWithValue }) => {
  try {
    const res = await companyApi.createCompany(companyData);
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create company.');
  }
});

export const deleteCompanyAsync = createAsyncThunk('companies/deleteCompany', async (companyId, { rejectWithValue }) => {
  try {
    await companyApi.deleteCompany(companyId);
    return companyId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete company.');
  }
});

const companySlice = createSlice({
  name: 'companies',
  initialState: {
    list: [],
    selectedCompany: null,
    pagination: { page: 1, limit: 10, totalItems: 0, totalPages: 1 },
    loading: false,
    error: null
  },
  reducers: {
    setSelectedCompany: (state, action) => {
      state.selectedCompany = action.payload;
    },
    clearCompanyError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Companies
      .addCase(fetchCompaniesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompaniesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCompaniesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Company
      .addCase(createCompanyAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCompanyAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload);
        state.pagination.totalItems += 1;
      })
      .addCase(createCompanyAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Company
      .addCase(deleteCompanyAsync.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c._id !== action.payload);
        state.pagination.totalItems -= 1;
      });
  }
});

export const { setSelectedCompany, clearCompanyError } = companySlice.actions;
export default companySlice.reducer;
