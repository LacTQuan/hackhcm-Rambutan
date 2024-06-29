import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Item } from "../types";

interface ResultsSlice {
  items: Item[];
}

const initialState: ResultsSlice = {
  items: [],
};

const ResultsSlice = createSlice({
  name: "results",
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<Item[]>) {
      console.log("setting items");
      state.items = action.payload;
    },
    addItems(state, action: PayloadAction<Item[]>) {
      state.items = state.items.concat(action.payload);
    },
  },
});

export const { setItems, addItems } = ResultsSlice.actions;
export const resultsReducer = ResultsSlice.reducer;
