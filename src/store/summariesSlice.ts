import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface Summary {
  id: string;
  url: string;
  title: string;
  summary: string;
  summary_urdu: string;
  created_at: string;
}

export interface PaginationData {
  current_page: number;
  total_pages: number;
  total_count: number;
  per_page: number;
}

interface SummariesState {
  summaries: Summary[];
  pagination: PaginationData | null;
  loading: boolean;
  error: string | null;
  lastFetchedPage: number | null;
}

const initialState: SummariesState = {
  summaries: [],
  pagination: null,
  loading: false,
  error: null,
  lastFetchedPage: null,
};

// Async thunk for fetching summaries
export const fetchSummaries = createAsyncThunk(
  'summaries/fetchSummaries',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/summaries?page=${page}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch summaries');
      }
      
      if (data.success) {
        return {
          summaries: data.data.summaries,
          pagination: data.data.pagination,
          page,
        };
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch summaries');
    }
  }
);

const summariesSlice = createSlice({
  name: 'summaries',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetSummaries: (state) => {
      state.summaries = [];
      state.pagination = null;
      state.lastFetchedPage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSummaries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSummaries.fulfilled, (state, action) => {
        state.loading = false;
        state.summaries = action.payload.summaries;
        state.pagination = action.payload.pagination;
        state.lastFetchedPage = action.payload.page;
        state.error = null;
      })
      .addCase(fetchSummaries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetSummaries } = summariesSlice.actions;
export default summariesSlice.reducer;
