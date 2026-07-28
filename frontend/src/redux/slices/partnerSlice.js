import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as partnerApi from '../../api/partnerApi';

export const fetchPartnersAsync = createAsyncThunk('partners/fetchPartners', async (companyId, { rejectWithValue }) => {
  try {
    const res = await partnerApi.fetchCompanyPartners(companyId);
    return res;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch partners.');
  }
});

export const createPartnerAsync = createAsyncThunk('partners/createPartner', async (partnerData, { rejectWithValue }) => {
  try {
    const res = await partnerApi.createPartner(partnerData);
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create partner record.');
  }
});

export const deletePartnerAsync = createAsyncThunk('partners/deletePartner', async (partnerId, { rejectWithValue }) => {
  try {
    await partnerApi.deletePartner(partnerId);
    return partnerId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete partner record.');
  }
});

const partnerSlice = createSlice({
  name: 'partners',
  initialState: {
    list: [],
    totalOwnershipPercentage: 0,
    availablePercentage: 100,
    loading: false,
    error: null
  },
  reducers: {
    clearPartnerError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Partners
      .addCase(fetchPartnersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPartnersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.totalOwnershipPercentage = action.payload.meta?.totalOwnershipPercentage || 0;
        state.availablePercentage = action.payload.meta?.availablePercentage || 100;
      })
      .addCase(fetchPartnersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Partner
      .addCase(createPartnerAsync.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
        state.totalOwnershipPercentage += action.payload.ownershipPercentage;
        state.availablePercentage -= action.payload.ownershipPercentage;
      })
      // Delete Partner
      .addCase(deletePartnerAsync.fulfilled, (state, action) => {
        const deleted = state.list.find((p) => p._id === action.payload);
        if (deleted) {
          state.totalOwnershipPercentage -= deleted.ownershipPercentage;
          state.availablePercentage += deleted.ownershipPercentage;
        }
        state.list = state.list.filter((p) => p._id !== action.payload);
      });
  }
});

export const { clearPartnerError } = partnerSlice.actions;
export default partnerSlice.reducer;
