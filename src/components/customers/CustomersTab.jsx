import {useDispatch,useSelector} from "react-redux"
import { createCustomer,updateCustomer,deleteCustomer,fetchCustomers } from "../../redux/customers/customerSlice";
import Modal from "../common/Modal"
import React,{useState} from 'react';

const CustomersTab = () => {
  const dispatch = useDispatch();
  const customers = useSelector(state => state.customers.items);
  const loading = useSelector(state => state.customers.loading);
  
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    shippingAddress: { street: '', city: '', state: '', zipCode: '', country: 'USA' }
  });
  
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = !search || 
      c.firstName.toLowerCase().includes(search.toLowerCase()) ||
      c.lastName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchesTier = !tierFilter || c.membershipTier === tierFilter;
    const matchesStatus = !statusFilter || c.status === statusFilter;
    return matchesSearch && matchesTier && matchesStatus;
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCustomer) {
      dispatch(updateCustomer({ id: editingCustomer.id, data: formData }));
    } else {
      dispatch(createCustomer(formData));
    }
    setIsModalOpen(false);
    setEditingCustomer(null);
    setFormData({
      shippingAddress: { street: '', city: '', state: '', zipCode: '', country: 'USA' }
    });
  };
  
  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData(customer);
    setIsModalOpen(true);
  };
  
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      dispatch(deleteCustomer(id));
    }
  };

    const handleFetchCustomers = () => {
    dispatch(fetchCustomers());
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
        <div className="flex gap-3 flex-1 flex-wrap">
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-lg flex-1 min-w-[200px]"
          />
          <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)}
                  className="px-4 py-2 border rounded-lg">
            <option value="">All Tiers</option>
            <option value="Platinum">Platinum</option>
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
            <option value="Bronze">Bronze</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border rounded-lg">
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <button onClick={() => { 
          setEditingCustomer(null); 
          setFormData({ shippingAddress: { street: '', city: '', state: '', zipCode: '', country: 'USA' } }); 
          setIsModalOpen(true); 
        }}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          + Add Customer
        </button>
      </div>
        <div className="flex gap-3">
          {/* ✅ New Fetch Customers Button */}
          <button
            onClick={handleFetchCustomers}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Fetch Customers
          </button>
          </div>
      
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Customer</th>
                <th className="px-6 py-3 text-left font-semibold">Email</th>
                <th className="px-6 py-3 text-left font-semibold">Phone</th>
                <th className="px-6 py-3 text-left font-semibold">Tier</th>
                <th className="px-6 py-3 text-left font-semibold">Orders</th>
                <th className="px-6 py-3 text-left font-semibold">Total Spent</th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
                <th className="px-6 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(customer => (
                <tr key={customer.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={customer.avatar} alt={customer.firstName} 
                           className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <div className="font-medium">{customer.firstName} {customer.lastName}</div>
                        <div className="text-xs text-gray-500">Joined: {customer.joinDate}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{customer.email}</td>
                  <td className="px-6 py-4">{customer.phone}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      customer.membershipTier === 'Platinum' ? 'bg-gray-200 text-gray-800' :
                      customer.membershipTier === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                      customer.membershipTier === 'Silver' ? 'bg-gray-100 text-gray-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {customer.membershipTier}
                    </span>
                  </td>
                  <td className="px-6 py-4">{customer.totalOrders}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-green-600">${customer.totalSpent.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">Avg: ${customer.averageOrderValue?.toFixed(2) || '0.00'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      customer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(customer)}
                              className="px-3 py-1 bg-orange-100 text-orange-600 rounded hover:bg-orange-200">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(customer.id)}
                              className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
             title={editingCustomer ? 'Edit Customer' : 'Add Customer'}>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">First Name *</label>
              <input type="text" required value={formData.firstName || ''}
                     onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                     className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Last Name *</label>
              <input type="text" required value={formData.lastName || ''}
                     onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                     className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input type="email" required value={formData.email || ''}
                     onChange={(e) => setFormData({...formData, email: e.target.value})}
                     className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input type="tel" value={formData.phone || ''}
                     onChange={(e) => setFormData({...formData, phone: e.target.value})}
                     className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date of Birth</label>
              <input type="date" value={formData.dateOfBirth || ''}
                     onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                     className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Gender</label>
              <select value={formData.gender || 'Male'}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Membership Tier</label>
              <select value={formData.membershipTier || 'Bronze'}
                      onChange={(e) => setFormData({...formData, membershipTier: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg">
                <option value="Bronze">Bronze</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Platinum">Platinum</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select value={formData.status || 'Active'}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="col-span-2 border-t pt-4 mt-2">
              <h4 className="font-semibold mb-3">Shipping Address</h4>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Street Address</label>
              <input type="text" value={formData.shippingAddress?.street || ''}
                     onChange={(e) => setFormData({...formData, shippingAddress: {...(formData.shippingAddress || {}), street: e.target.value}})}
                     className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">City</label>
              <input type="text" value={formData.shippingAddress?.city || ''}
                     onChange={(e) => setFormData({...formData, shippingAddress: {...(formData.shippingAddress || {}), city: e.target.value}})}
                     className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">State</label>
              <input type="text" value={formData.shippingAddress?.state || ''}
                     onChange={(e) => setFormData({...formData, shippingAddress: {...(formData.shippingAddress || {}), state: e.target.value}})}
                     className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Zip Code</label>
              <input type="text" value={formData.shippingAddress?.zipCode || ''}
                     onChange={(e) => setFormData({...formData, shippingAddress: {...(formData.shippingAddress || {}), zipCode: e.target.value}})}
                     className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Country</label>
              <input type="text" value={formData.shippingAddress?.country || 'USA'}
                     onChange={(e) => setFormData({...formData, shippingAddress: {...(formData.shippingAddress || {}), country: e.target.value}})}
                     className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit"
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Save Customer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default CustomersTab