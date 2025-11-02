import { configureStore } from '@reduxjs/toolkit';
import productsReducer from "./products/productsSlice"
import categoriesReducer from './categories/categoriesSlice'
import customersReducer from './customers/customerSlice'
import ordersReducer from './orders/ordersSlice'
import reviewsReducer from './reviews/reviewsSlice'
const store = configureStore({
  reducer: {
    products: productsReducer,
    categories: categoriesReducer,
    customers: customersReducer,
    orders:ordersReducer,
    reviews:reviewsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // useful if you’re storing Date objects or FormData
    }),
});

export default store;
