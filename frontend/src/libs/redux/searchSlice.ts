import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Item } from "../types";

interface SearchSliceState {
    query: string;
    searchItems: Item[];
}

const initialState: SearchSliceState = {
    query: "",
    searchItems: [],
};

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        setQuery(state, action: PayloadAction<string>) {
            state.query = action.payload;
        },
        setItems(state, action: PayloadAction<Item[]>) {
            state.searchItems = action.payload;
        }
    },
});

export const { setQuery } = searchSlice.actions;
export const searchReducer = searchSlice.reducer;
