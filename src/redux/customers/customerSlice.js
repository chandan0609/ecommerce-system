import {createSlice,createAsyncThunk} from "@reduxjs/toolkit"
import api from "../../services/api"
export const fetchCustomers = createAsyncThunk('customers/fetchAll',async()=>{
    return await api.getCustomers();
})
export const createCustomer = createAsyncThunk('customers/create',async(data)=> {
    const newCustomer = {
        id:String(Date.now()),
        ...data,
        totalOrders:0,
        totalSpent:0,
        averageOrderValue:0,
        joinDate: new Date().toISOString().split('T')[0],
        lastOrderDate:null,
        avatar:`https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        preferences:{
            newsletter:true,
            smsNotification:false,
            emailNotification:true
        },
        tags:[],
        notes:data.notes || '',
        billingAddress:data.shippingAddress
    };
    return await api.createCustomer(newCustomer);
})
export const updateCustomer = createAsyncThunk('customers/update',async({id,data}) => {
    return await api.updateCustomer(id,data)
})
export const deleteCustomer = createAsyncThunk('customers/delete',async(id)=>{
    await api.deleteCustomer(id);
    return id;
})

const customersSlice = createSlice({
    name:'customers',
    initialState:{items:[],loading:false,error:null},
    reducers:{},
    extraReducers:(builder) => {
        builder
        .addCase(fetchCustomers.pending,(state)=> {state.loading = true})
        .addCase(fetchCustomers.fulfilled,(state,action) => {
            state.loading = false;
            state.items = action.payload;
        })
        .addCase(fetchCustomers.rejected,(state,action)=> {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(updateCustomer.fulfilled,(state,action)=> {
            const index=state.items.findIndex(c=>c.id===action.payload.id);
            if(index !== -1){
                state.items[index] = action.payload
            }
        })
        .addCase(deleteCustomer.fulfilled,(state,action) =>{
            state.items = state.items.filter(c=>c.id !== action.payload)
        })
    }
})
export default customersSlice.reducer;

//now add it to the store.