import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { WeatherData } from '@/types';
import { CITIES } from '@/utils/constants';

interface WeatherState {
  cities: WeatherData[];
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: WeatherState = {
  cities: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

export const fetchWeatherData = createAsyncThunk(
  'weather/fetchWeatherData',
  async (_, { rejectWithValue }) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      if (!apiKey) {
        throw new Error('OpenWeather API key is not configured');
      }

      const requests = CITIES.map((city) =>
        axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        )
      );

      const responses = await Promise.all(requests);
      const timestamp = Date.now();

      return {
        cities: responses.map((response) => ({
          city: response.data.name,
          temperature: Math.round(response.data.main.temp),
          humidity: response.data.main.humidity,
          windSpeed: response.data.wind.speed,
          description: response.data.weather[0].description,
          icon: response.data.weather[0].icon,
          isFavorite: false,
        })),
        timestamp,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch weather data');
    }
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const city = state.cities.find((c) => c.city === action.payload);
      if (city) {
        city.isFavorite = !city.isFavorite;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.loading = false;
        state.cities = action.payload.cities;
        state.lastUpdated = action.payload.timestamp;
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch weather data';
      });
  },
});

export const { toggleFavorite } = weatherSlice.actions;
export default weatherSlice.reducer; 