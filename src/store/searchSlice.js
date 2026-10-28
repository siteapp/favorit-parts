import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchAnalogues, fetchGoodsByNumber } from '../api/hsprice';
import { extractManufacturers, flattenOffers } from '../utils/normalize';

export const MIN_NUMBER_LENGTH = 3;

export const loadManufacturers = createAsyncThunk('search/loadManufacturers', async (number) =>
  extractManufacturers(await fetchGoodsByNumber(number))
);

export const loadOffers = createAsyncThunk('search/loadOffers', async ({ number, brand }) =>
  flattenOffers(await fetchAnalogues(number, brand))
);

const idleState = () => ({ status: 'idle', items: [], error: null });

const initialState = {
  number: '',
  manufacturers: idleState(),
  selectedBrand: null,
  offers: idleState(),
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    resetSearch: (state, action) => {
      state.number = action.payload;
      state.manufacturers = idleState();
      state.selectedBrand = null;
      state.offers = idleState();
    },
    selectBrand: (state, action) => {
      state.selectedBrand = action.payload;
      state.offers = idleState();
    },
  },
  extraReducers: (builder) => {
    // Ответы на устаревшие запросы игнорируются, чтобы не перетирать актуальные данные
    builder
      .addCase(loadManufacturers.pending, (state, action) => {
        if (action.meta.arg !== state.number) return;
        state.manufacturers = { status: 'loading', items: [], error: null };
      })
      .addCase(loadManufacturers.fulfilled, (state, action) => {
        if (action.meta.arg !== state.number) return;
        state.manufacturers = { status: 'succeeded', items: action.payload, error: null };
      })
      .addCase(loadManufacturers.rejected, (state, action) => {
        if (action.meta.arg !== state.number) return;
        state.manufacturers = { status: 'failed', items: [], error: action.error.message };
      })
      .addCase(loadOffers.pending, (state, action) => {
        const { number, brand } = action.meta.arg;
        if (number !== state.number || brand !== state.selectedBrand) return;
        state.offers = { status: 'loading', items: [], error: null };
      })
      .addCase(loadOffers.fulfilled, (state, action) => {
        const { number, brand } = action.meta.arg;
        if (number !== state.number || brand !== state.selectedBrand) return;
        state.offers = { status: 'succeeded', items: action.payload, error: null };
      })
      .addCase(loadOffers.rejected, (state, action) => {
        const { number, brand } = action.meta.arg;
        if (number !== state.number || brand !== state.selectedBrand) return;
        state.offers = { status: 'failed', items: [], error: action.error.message };
      });
  },
});

export const { resetSearch, selectBrand } = searchSlice.actions;

export const searchByNumber = (number) => (dispatch, getState) => {
  if (number === getState().search.number) return;
  dispatch(resetSearch(number));
  if (number.length >= MIN_NUMBER_LENGTH) {
    dispatch(loadManufacturers(number));
  }
};

export const chooseBrand = (brand) => (dispatch, getState) => {
  const { number } = getState().search;
  dispatch(selectBrand(brand));
  dispatch(loadOffers({ number, brand }));
};

export default searchSlice.reducer;
