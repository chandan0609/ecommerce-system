import ApiTester from "./ApiTester"
import React from "react";
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Dashboard from "./components/dashboard/DashboardTab";
import ProductsTab from "./components/products/ProductsTab";
import Layout from "./components/common/Layout";
import CustomersTab from "./components/customers/CustomersTab"
import CategoriesTab from "./components/categories/CategoriesTab";
import OrdersTab from "./components/orders/OrdersTab";
import ReviewsTab from "./components/reviews/ReviewsTab";
function App() {
  return (
   <Router>
    <Layout>
    <Routes>
      <Route path = "/" element={<Dashboard/>} />
      <Route path = "/products" element = {<ProductsTab/>}/>
      <Route path = "/categories" element = {<CategoriesTab/>}/>
      <Route path = "/customers" element = {<CustomersTab/>}/>
      <Route path = "/orders" element = {<OrdersTab/>}/>
      <Route path = "/reviews" element = {<ReviewsTab/>}/>
    </Routes>
    </Layout>
   </Router>
  )
}

export default App
