import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { CryptoData } from '@/types';
import { CRYPTO_COINS } from '@/utils/constants';

interface CryptoState {
  coins: CryptoData[];
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: CryptoState = {
  coins: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

export const fetchCryptoData = createAsyncThunk(
  'crypto/fetchCryptoData',
  async (_, { rejectWithValue }) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
      const ids = CRYPTO_COINS.join(',');
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`,
        {
          headers: apiKey ? { 'x-cg-api-key': apiKey } : undefined,
        }
      );
      
      return {
        coins: Object.entries(response.data).map(([id, data]: [string, any]) => ({
          id,
          name: id.charAt(0).toUpperCase() + id.slice(1),
          price: data.usd,
          change24h: data.usd_24h_change,
          volume24h: data.usd_24h_vol,
          marketCap: data.usd_market_cap,
          isFavorite: false,
        })),
        timestamp: Date.now(),
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch crypto data');
    }
  }
);

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const coin = state.coins.find((c) => c.id === action.payload);
      if (coin) {
        coin.isFavorite = !coin.isFavorite;
      }
    },
    updatePrice: (state, action: PayloadAction<{ id: string; price: number }>) => {
      const coin = state.coins.find((c) => c.id === action.payload.id);
      if (coin) {
        coin.price = action.payload.price;
        state.lastUpdated = Date.now();
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCryptoData.fulfilled, (state, action) => {
        state.loading = false;
        state.coins = action.payload.coins;
        state.lastUpdated = action.payload.timestamp;
      })
      .addCase(fetchCryptoData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch crypto data';
      });
  },
});

export const { toggleFavorite, updatePrice } = cryptoSlice.actions;
export default cryptoSlice.reducer; 