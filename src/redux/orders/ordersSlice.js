import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import api from "../../services/api"

export const fetchOrders = createAsyncThunk('orders/fetchOrders',async() => {
    return await api.getOrders();
});

export const createOrder = createAsyncThunk('orders/createOrder', async(data) => {
    const newOrder = {
        id:String(Date.now()),
        orderNumber: `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
        ...data,
        orderDate: new Date().toISOString().split('T')[0],
        items:data.items || [],
        trackingNumber:null,
        estimatedDelivery:null,
        actualDelivery:null,
        notes:data.notes || '',
        couponCode : data.couponCode || null
    };
    return await api.createOrder(newOrder)
})
export const updateOrder = createAsyncThunk('orders/updateOrder',async({id,data}) => {
    return await api.updateOrder(id,data)
})
export const deleteOrder = createAsyncThunk('orders/deleteOrder',async(id)=>{
    await api.deleteOrder(id);
    return id;
})

const ordersSlice = createSlice({
    name:'orders',
    initialState:{items:[],loading:false,error:null},
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchOrders.pending,(state)=>{
            state.loading = true;
        })
        .addCase(fetchOrders.fulfilled,(state,action)=>{
            state.loading = false;
            state.items = action.payload;
        })
        .addCase(fetchOrders.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(createOrder.fulfilled,(state,action)=>{
            state.items.push(action.payload);
        })
        .addCase(updateOrder.fulfilled,(state,action)=>{
            const index = state.items.findIndex(o => o.id === action.payload.id);
            if(index !== -1){
                state.items[index] = action.payload;
            }
        })
        .addCase(deleteOrder.fulfilled,(state,action)=> {
            state.items = state.items.filter(o=>o.id !== action.payload)
        })
    }
})
export default ordersSlice.reducer