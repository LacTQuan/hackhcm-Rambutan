import { combineReducers } from "@reduxjs/toolkit";
import { uploadedFilesReducer } from "@/libs/redux/uploadedFilesSlice";
import { searchReducer } from "@/libs/redux/searchSlice";
import { resultsReducer } from "@/libs/redux/resultsSlice";
import { loadingReducer } from "@/libs/redux/loadingSlice";
import { selectedImageReducer } from "./selectedImageSlice";

export const rootReducer = combineReducers({
    uploadedFiles: uploadedFilesReducer,
    search: searchReducer,
    results: resultsReducer,
    loading: loadingReducer,
    selectedImage: selectedImageReducer
});