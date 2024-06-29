import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoadingSlice {
  isLoading: boolean;
}

const initialState: LoadingSlice = {
  isLoading: false,
};

const LoadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
        state.isLoading = action.payload;
    }
  },
});

export const { setLoading } = LoadingSlice.actions;
export const loadingReducer = LoadingSlice.reducer;
