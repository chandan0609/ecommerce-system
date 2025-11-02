import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchReviews  = createAsyncThunk('reviews/fetchReviews',async()=> {
    return await api.getReviews();
})

export const deleteReview = createAsyncThunk('reviews/deleteReview',async(id) => {
    await api.deleteReview(id);
    return id;
})

const reviewsSlice = createSlice({
    name:"reviews",
    initialState : {items:[],loading:false,error:null},
    reducers:{},
    extraReducers:(builder) => {
        builder
        .addCase(fetchReviews.pending,(state) => {
            state.loading = true;
        })
        .addCase(fetchReviews.fulfilled,(state,action)=>{
            state.loading = false
            state.items = action.payload;
        })
        .addCase(fetchReviews.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(deleteReview.fulfilled,(state,action)=> {
            state.items = state.items.filter(r=>r.id !== action.payload)
        })
    }
})
export default reviewsSlice.reducer