import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface FullText {
  _id: string;
  url: string;
  title: string;
  content: string;
  scraped_at: string;
}

export interface PaginationData {
  current_page: number;
  total_pages: number;
  total_count: number;
  per_page: number;
}

interface FullTextsState {
  fullTexts: FullText[];
  pagination: PaginationData | null;
  loading: boolean;
  error: string | null;
  lastFetchedPage: number | null;
}

const initialState: FullTextsState = {
  fullTexts: [],
  pagination: null,
  loading: false,
  error: null,
  lastFetchedPage: null,
};

// Async thunk for fetching full texts
export const fetchFullTexts = createAsyncThunk(
  'fullTexts/fetchFullTexts',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/full-texts?page=${page}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch full texts');
      }
      
      if (data.success) {
        return {
          fullTexts: data.data.full_texts,
          pagination: data.data.pagination,
          page,
        };
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch full texts');
    }
  }
);

const fullTextsSlice = createSlice({
  name: 'fullTexts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetFullTexts: (state) => {
      state.fullTexts = [];
      state.pagination = null;
      state.lastFetchedPage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFullTexts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFullTexts.fulfilled, (state, action) => {
        state.loading = false;
        state.fullTexts = action.payload.fullTexts;
        state.pagination = action.payload.pagination;
        state.lastFetchedPage = action.payload.page;
        state.error = null;
      })
      .addCase(fetchFullTexts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetFullTexts } = fullTextsSlice.actions;
export default fullTextsSlice.reducer;
