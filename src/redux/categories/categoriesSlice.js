import api from "../../services/api"
import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";

export const fetchCategories = createAsyncThunk('categories/fetchCategories',async() => {
    return await api.getCategories();
})

export const createCategory = createAsyncThunk('categories/createCategory',
    async(data) => {
        const newCategory = {
            id: String(Date.now()),
            ...data,
            productCount : 0,
            image:data.image || 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
            parentId : data.parentId || null,
            level : data.level || 0,
            displayOrder: data.displayOrder || 999,
            seoTitle: data.seoTitle || data.name,
            seoDescription : data.seoDescription || data.description,
            seoKeywords:data.seoKeywords || ''
        };
        return await api.createCategory(newCategory);
    }
)
export const updateCategory = createAsyncThunk('categories/updateCategory',async({id,data}) => {
    return await api.updateCategory(id,data)
})
export const deleteCategory = createAsyncThunk('categories/deleteCategory', async (id) => {
    await api.deleteCategory(id);
    return id;
})
const categoriesSlice = createSlice({
    name:'categories',
    initialState:{items:[],loading:false,error:null},
    reducers:{},
    extraReducers: (builder) => {
        builder
        .addCase(fetchCategories.pending,(state) =>{state.loading = true})
        .addCase(fetchCategories.fulfilled,(state,action)=> {
            state.loading = false;
            state.items = action.payload;
        })
        .addCase(fetchCategories.rejected,(state,action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(updateCategory.fulfilled,(state,action)=> {
            const index = state.items.findIndex(c=>c.id === action.payload.id);
            if(index !== -1){
                state.items[index] = action.payload;
            }
        })
        .addCase(deleteCategory.fulfilled,(state,action)=> {
            state.items = state.items.filter(c=>c.id !== action.payload);
        })
    }
});
export default categoriesSlice.reducer;