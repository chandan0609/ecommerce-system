import axios from 'axios';
const API_BASE = 'http://localhost:3000';

const api = {
    //products
    getProducts: async () => {
        const res = await axios.get(`${API_BASE}/products`);
        console.log(res.data)
        return res.data;
    },
    createProduct: async (data) => {
        const res = await axios.post(`${API_BASE}/products`,data);
        return res.data;
    },
    updateProduct : async(id,data) => {
        const res = await axios.patch(`${API_BASE}/products/${id}`,data);
        return res.data
    },
    deleteProduct : async(id) => {
        const res = await axios.delete(`${API_BASE}/products/${id}`)
    },
     getCustomers: async () => {
    const res = await axios.get(`${API_BASE}/customers`);
    return res.data;
  },
  createCustomer: async (data) => {
    const res = await axios.post(`${API_BASE}/customers`, data);
    return res.data;
  },
  updateCustomer: async (id, data) => {
    const res = await axios.patch(`${API_BASE}/customers/${id}`, data);
    return res.data;
  },
  deleteCustomer: async (id) => {
    const res = await axios.delete(`${API_BASE}/customers/${id}`);
    return res.data;
  },
   getOrders: async () => {
    const res = await axios.get(`${API_BASE}/orders`);
    return res.data;
  },
  createOrder: async (data) => {
    const res = await axios.post(`${API_BASE}/orders`, data);
    return res.data;
  },
  updateOrder: async (id, data) => {
    const res = await axios.patch(`${API_BASE}/orders/${id}`, data);
    return res.data;
  },
  deleteOrder: async (id) => {
    const res = await axios.delete(`${API_BASE}/orders/${id}`);
    return res.data;
  },
  getCategories: async () => {
    const res = await axios.get(`${API_BASE}/categories`);
    return res.data;
  },
  createCategory: async (data) => {
    const res = await axios.post(`${API_BASE}/categories`, data);
    return res.data;
  },
  updateCategory: async (id, data) => {
    const res = await axios.patch(`${API_BASE}/categories/${id}`, data);
    return res.data;
  },
  deleteCategory: async (id) => {
    const res = await axios.delete(`${API_BASE}/categories/${id}`);
    return res.data;
  },
getReviews: async () => {
    const res = await axios.get(`${API_BASE}/reviews`);
    return res.data;
  },
  deleteReview: async (id) => {
    const res = await axios.delete(`${API_BASE}/reviews/${id}`);
    return res.data;
  }
}
export default api