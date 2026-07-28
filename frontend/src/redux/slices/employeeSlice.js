import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as employeeApi from '../../api/employeeApi';

export const fetchEmployeesAsync = createAsyncThunk('employees/fetchEmployees', async ({ companyId, params }, { rejectWithValue }) => {
  try {
    const res = await employeeApi.fetchCompanyEmployees(companyId, params);
    return res;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch employees.');
  }
});

export const fetchExpiringAsync = createAsyncThunk('employees/fetchExpiring', async (companyId, { rejectWithValue }) => {
  try {
    const res = await employeeApi.fetchExpiringDocuments(companyId);
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch expiring employee documents.');
  }
});

export const createEmployeeAsync = createAsyncThunk('employees/createEmployee', async (employeeData, { rejectWithValue }) => {
  try {
    const res = await employeeApi.createEmployee(employeeData);
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create employee record.');
  }
});

export const deleteEmployeeAsync = createAsyncThunk('employees/deleteEmployee', async (employeeId, { rejectWithValue }) => {
  try {
    await employeeApi.deleteEmployee(employeeId);
    return employeeId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete employee record.');
  }
});

const employeeSlice = createSlice({
  name: 'employees',
  initialState: {
    list: [],
    expiringList: [],
    pagination: { page: 1, limit: 10, totalItems: 0, totalPages: 1 },
    loading: false,
    error: null
  },
  reducers: {
    clearEmployeeError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Employees
      .addCase(fetchEmployeesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchEmployeesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Expiring
      .addCase(fetchExpiringAsync.fulfilled, (state, action) => {
        state.expiringList = action.payload;
      })
      // Create Employee
      .addCase(createEmployeeAsync.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
        state.pagination.totalItems += 1;
      })
      // Delete Employee
      .addCase(deleteEmployeeAsync.fulfilled, (state, action) => {
        state.list = state.list.filter((e) => e._id !== action.payload);
        state.pagination.totalItems -= 1;
      });
  }
});

export const { clearEmployeeError } = employeeSlice.actions;
export default employeeSlice.reducer;
