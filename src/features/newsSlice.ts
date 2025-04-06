import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { NewsItem } from '@/types';

interface NewsState {
  items: NewsItem[];
  loading: boolean;
  error: string | null;
}

const initialState: NewsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchNewsData = createAsyncThunk(
  'news/fetchNewsData',
  async () => {
    const apiKey = process.env.NEXT_PUBLIC_NEWSDATA_API_KEY;
    const response = await axios.get(
      `https://newsdata.io/api/1/news?apikey=${apiKey}&q=cryptocurrency&language=en`
    );
    
    return response.data.results.map((article: any) => ({
      id: article.article_id,
      title: article.title,
      description: article.description,
      url: article.link,
      source: article.source_name,
      publishedAt: article.pubDate,
      imageUrl: article.image_url,
    }));
  }
);

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewsData.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchNewsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch news data';
      });
  },
});

export default newsSlice.reducer;