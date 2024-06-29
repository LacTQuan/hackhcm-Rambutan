import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ImageCard } from "../types";

const initialState: ImageCard = {
  imageUrl: "",
  objects: {},
  reasoning: "",
};


const selectedImageSlice = createSlice({
  name: "selectedImageSlice",
  initialState,
  reducers: {
    setSelectedImage(state, action: PayloadAction<ImageCard>) {
      console.log("setSelectedImage", action.payload);
      return state = action.payload;
    },
  },
});

export const { setSelectedImage } = selectedImageSlice.actions;

export const selectedImageReducer = selectedImageSlice.reducer;
