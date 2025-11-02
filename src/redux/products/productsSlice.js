import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import { createSlice } from "@reduxjs/toolkit";
//actions
export const fetchProducts = createAsyncThunk('products/fetchProducts',
    async () => {
        const response =  await api.getProducts()
        console.log(response);
        return response
    }
)

export const createProduct = createAsyncThunk('products/createProduct', async (data) => {
  const newProduct = {
    id: String(Date.now()), // Generate string ID
    ...data,
    rating: 0,
    reviewCount: 0,
    tags: data.tags || [],
    images: data.images || ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"],
    specifications: data.specifications || {},
    featured: data.featured || false,
    lowStockThreshold: data.lowStockThreshold || 20,
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0]
  };
  return await api.createProduct(newProduct);
});

export const updateProduct = createAsyncThunk('products/updateProduct', async({id,data}) => {
    const updatedData = {
        ...data,
        updatedAt: new Date().toISOString().split('T')[0]
    };
    return await api.updateProduct(id,updatedData);
})

export const deleteProduct = createAsyncThunk('products/deleteProduct',async(id) => {
    await api.deleteProduct(id);
    return id;
})


//slices
const productsSlice = createSlice({
    name:'products',
    initialState:{items:[],loading:false,error:null},
    reducers:{},
    extraReducers:(builder) => {
        builder
        .addCase(fetchProducts.pending,(state) => {
            state.loading = true;
        })
        .addCase(fetchProducts.fulfilled,(state,action)=> {
            state.loading = false;
            state.items = action.payload;
        })
        .addCase(fetchProducts.rejected,(state,action) => {
            state.loading = false;
            state.error = action .error.message;
        })
        .addCase(createProduct.fulfilled,(state,action) => {
            state.items.push(action.payload);
        })
        .addCase(updateProduct.fulfilled,(state,action) => {
            const index = state.items.findIndex(p=>p.id===action.payload.id);
            if(index !== -1) {
                state.items[index] = action.payload
            }
        })
        .addCase(deleteProduct.fulfilled,(state,action) => {
            state.items = state.items.filter(p=>p.id !== action.payload);
        })
    }
})
export default productsSlice.reducer;