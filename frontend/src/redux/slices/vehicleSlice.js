import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as vehicleApi from '../../api/vehicleApi';

export const fetchVehiclesAsync = createAsyncThunk('vehicles/fetchVehicles', async ({ companyId, params }, { rejectWithValue }) => {
  try {
    const res = await vehicleApi.fetchCompanyVehicles(companyId, params);
    return res;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch vehicles.');
  }
});

export const fetchExpiringVehiclesAsync = createAsyncThunk('vehicles/fetchExpiringVehicles', async (companyId, { rejectWithValue }) => {
  try {
    const res = await vehicleApi.fetchExpiringVehicles(companyId);
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch expiring vehicles.');
  }
});

export const createVehicleAsync = createAsyncThunk('vehicles/createVehicle', async (vehicleData, { rejectWithValue }) => {
  try {
    const res = await vehicleApi.createVehicle(vehicleData);
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create vehicle record.');
  }
});

export const deleteVehicleAsync = createAsyncThunk('vehicles/deleteVehicle', async (vehicleId, { rejectWithValue }) => {
  try {
    await vehicleApi.deleteVehicle(vehicleId);
    return vehicleId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete vehicle record.');
  }
});

const vehicleSlice = createSlice({
  name: 'vehicles',
  initialState: {
    list: [],
    expiringList: [],
    pagination: { page: 1, limit: 10, totalItems: 0, totalPages: 1 },
    loading: false,
    error: null
  },
  reducers: {
    clearVehicleError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Vehicles
      .addCase(fetchVehiclesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehiclesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchVehiclesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Expiring
      .addCase(fetchExpiringVehiclesAsync.fulfilled, (state, action) => {
        state.expiringList = action.payload;
      })
      // Create Vehicle
      .addCase(createVehicleAsync.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
        state.pagination.totalItems += 1;
      })
      // Delete Vehicle
      .addCase(deleteVehicleAsync.fulfilled, (state, action) => {
        state.list = state.list.filter((v) => v._id !== action.payload);
        state.pagination.totalItems -= 1;
      });
  }
});

export const { clearVehicleError } = vehicleSlice.actions;
export default vehicleSlice.reducer;
