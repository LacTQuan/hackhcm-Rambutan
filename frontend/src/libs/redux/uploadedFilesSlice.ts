import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ImageCard } from "../types";

const initialState: ImageCard[] = [
  {
    imageUrl: "", // Ensure this matches the field name in your ImageCard interface
    objects: {},
    reasoning: "",
  }
];

const uploadedFilesSlice = createSlice({
  name: "uploadedFiles",
  initialState,
  reducers: {
    setUploadedFiles(state, action: PayloadAction<ImageCard[]>) {
      console.log("setUploadedFiles", action.payload);
      return action.payload; // Correctly update the state
    },
  },
});

export const { setUploadedFiles } = uploadedFilesSlice.actions;

export const uploadedFilesReducer = uploadedFilesSlice.reducer;
