import React, {useState} from "react";
import {useDispatch,useSelector} from 'react-redux';
import {createOrder,updateOrder,deleteOrder, fetchOrders} from "../../redux/orders/ordersSlice"
import Modal from "../common/Modal";

const OrdersTab = () => {
  const dispatch = useDispatch();
  const orders = useSelector(state => state.orders.items);
  const customers = useSelector(state => state.customers.items);
  const loading = useSelector(state => state.orders.loading);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({});
  
  const filteredOrders = orders.filter(o => {
    const matchesSearch = !search || o.orderNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingOrder) {
      dispatch(updateOrder({ id: editingOrder.id, data: formData }));
    } else {
      dispatch(createOrder(formData));
    }
    setIsModalOpen(false);
    setEditingOrder(null);
    setFormData({});
  };
  
  const handleEdit = (order) => {
    setEditingOrder(order);
    setFormData(order);
    setIsModalOpen(true);
  };
  
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      dispatch(deleteOrder(id));
    }
  };
     const handleFetchOrders = () => {
      dispatch(fetchOrders());
    };
  return (
    <div>
      <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
        <div className="flex gap-3 flex-1 flex-wrap">
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-lg flex-1 min-w-[200px]"
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border rounded-lg">
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <button onClick={() => { 
          setEditingOrder(null); 
          setFormData({ 
            orderNumber: `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
            paymentMethod: 'Credit Card', 
            status: 'Pending',
            paymentStatus: 'Pending'
          }); 
          setIsModalOpen(true); 
        }}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          + Create Order
        </button>
      </div>
      <div className="flex gap-3">
          {/* ✅ New Fetch Customers Button */}
          <button
            onClick={handleFetchOrders}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Fetch Orders
          </button>
          </div>
      
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Order Number</th>
                <th className="px-6 py-3 text-left font-semibold">Customer</th>
                <th className="px-6 py-3 text-left font-semibold">Date</th>
                <th className="px-6 py-3 text-left font-semibold">Items</th>
                <th className="px-6 py-3 text-left font-semibold">Total</th>
                <th className="px-6 py-3 text-left font-semibold">Payment</th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
                <th className="px-6 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => {
                const customer = customers.find(c => c.id === order.customerId);
                return (
                  <tr key={order.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-semibold">{order.orderNumber}</div>
                      {order.trackingNumber && (
                        <div className="text-xs text-gray-500">Track: {order.trackingNumber}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown'}
                    </td>
                    <td className="px-6 py-4">{order.orderDate}</td>
                    <td className="px-6 py-4">{order.items?.length || 0} item(s)</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-green-600">${order.total.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">Subtotal: ${order.subtotal.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">{order.paymentMethod}</div>
                      <div className={`text-xs ${
                        order.paymentStatus === 'Paid' ? 'text-green-600' : 
                        order.paymentStatus === 'Refunded' ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        {order.paymentStatus}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'Shipped' ? 'bg-purple-100 text-purple-700' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(order)}
                                className="px-3 py-1 bg-orange-100 text-orange-600 rounded hover:bg-orange-200">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(order.id)}
                                className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
             title={editingOrder ? 'Edit Order' : 'Create Order'}>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Order Number *</label>
              <input type="text" required value={formData.orderNumber || ''}
                     onChange={(e) => setFormData({...formData, orderNumber: e.target.value})}
                     className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Customer *</label>
              <select required value={formData.customerId || ''}
                      onChange={(e) => setFormData({...formData, customerId: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg">
                <option value="">Select Customer</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select value={formData.status || 'Pending'}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg">
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Payment Method</label>
              <select value={formData.paymentMethod || 'Credit Card'}
                      onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg">
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="PayPal">PayPal</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Payment Status</label>
              <select value={formData.paymentStatus || 'Pending'}
                      onChange={(e) => setFormData({...formData, paymentStatus: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg">
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Shipping Method</label>
              <select value={formData.shippingMethod || 'Standard'}
                      onChange={(e) => setFormData({...formData, shippingMethod: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg">
                <option value="Standard">Standard</option>
                <option value="Express">Express</option>
                <option value="Free Shipping">Free Shipping</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Subtotal *</label>
              <input type="number" step="0.01" required value={formData.subtotal || ''}
                     onChange={(e) => setFormData({...formData, subtotal: parseFloat(e.target.value)})}
                     className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tax</label>
              <input type="number" step="0.01" value={formData.tax || 0}
                     onChange={(e) => setFormData({...formData, tax: parseFloat(e.target.value)})}
                     className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Shipping</label>
              <input type="number" step="0.01" value={formData.shipping || 0}
                     onChange={(e) => setFormData({...formData, shipping: parseFloat(e.target.value)})}
                     className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Discount</label>
              <input type="number" step="0.01" value={formData.discount || 0}
                     onChange={(e) => setFormData({...formData, discount: parseFloat(e.target.value)})}
                     className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Total *</label>
              <input type="number" step="0.01" required value={formData.total || ''}
                     onChange={(e) => setFormData({...formData, total: parseFloat(e.target.value)})}
                     className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tracking Number</label>
              <input type="text" value={formData.trackingNumber || ''}
                     onChange={(e) => setFormData({...formData, trackingNumber: e.target.value})}
                     className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Notes</label>
              <textarea value={formData.notes || ''}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg" rows="2" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit"
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Save Order
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default OrdersTab