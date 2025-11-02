
import React , {useState} from 'react'
import { useDispatch,useSelector } from 'react-redux';
import { createProduct,updateProduct,deleteProduct,fetchProducts } from '../../redux/products/productsSlice';
import Modal from "../common/Modal"
const ProductsTab = () => {
  const dispatch = useDispatch();
  const products = useSelector(state => state.products.items);
  const categories = useSelector(state=> state.categories.items);
  const loading = useSelector(state => state.products.loading);
  
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({});
  
  const filteredProducts = products.filter(p => {
    const matchesSearch = !search || 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = !categoryFilter || p.categoryId === categoryFilter;
    const matchesStatus = !statusFilter || p.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  const handleSubmit = async (e) => {
  e.preventDefault();
  if (editingProduct) {
    await dispatch(updateProduct({ id: editingProduct.id, data: formData }));
  } else {
    await dispatch(createProduct(formData)); // ✅ wait for completion
  }
  await dispatch(fetchProducts()); // ✅ refresh immediately
  setIsModalOpen(false);
  setEditingProduct(null);
  setFormData({});
};

  
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData(product);
    setIsModalOpen(true);
  };
  
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id));
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
        <div className="flex gap-3 flex-1 flex-wrap">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-lg flex-1 min-w-[200px]"
          />
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} 
                  className="px-4 py-2 border rounded-lg">
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border rounded-lg">
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        
        <div className="flex gap-3">
    <button
      onClick={() => dispatch(fetchProducts())}
      className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
    >
      Fetch Products
    </button>
    <button
      onClick={() => {
        setEditingProduct(null);
        setFormData({});
        setIsModalOpen(true);
      }}
      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
    >
      + Add Product
    </button>
  </div>
</div>
      
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Product</th>
                <th className="px-6 py-3 text-left font-semibold">Price</th>
                <th className="px-6 py-3 text-left font-semibold">Stock</th>
                <th className="px-6 py-3 text-left font-semibold">Rating</th>
                <th className="px-6 py-3 text-left font-semibold">Brand</th>
                <th className="px-6 py-3 text-left font-semibold">Category</th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
                <th className="px-6 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => {
                const category = categories.find(c => c.id === product.categoryId);
                const stockPercent = (product.stock / (product.stock + 100)) * 100;
                const isLowStock = product.stock < product.lowStockThreshold;
                
                return (
                  <tr key={product.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={product.images[0]} alt={product.name} className="w-12 h-12 rounded object-cover" />
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-green-600">${product.price.toFixed(2)}</div>
                      {product.costPrice && (
                        <div className="text-xs text-gray-500">Cost: ${product.costPrice}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`font-medium ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
                        {product.stock}
                      </div>
                      {isLowStock && (
                        <div className="text-xs text-red-500">Low Stock</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-yellow-500">
                        {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
                      </div>
                      <div className="text-xs text-gray-500">({product.reviewCount})</div>
                    </td>
                    <td className="px-6 py-4">{product.brand || 'N/A'}</td>
                    <td className="px-6 py-4">{category?.name || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {product.status}
                      </span>
                      {product.featured && (
                        <div className="mt-1">
                          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">⭐ Featured</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(product)}
                                className="px-3 py-1 bg-orange-100 text-orange-600 rounded hover:bg-orange-200">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(product.id)}
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
             title={editingProduct ? 'Edit Product' : 'Add Product'}>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Product Name *</label>
              <input type="text" required value={formData.name || ''}
                     onChange={(e) => setFormData({...formData, name: e.target.value})}
                     className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">SKU *</label>
              <input type="text" required value={formData.sku || ''}
                     onChange={(e) => setFormData({...formData, sku: e.target.value})}
                     className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Price *</label>
              <input type="number" step="0.01" required value={formData.price || ''}
                     onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                     className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Cost Price</label>
              <input type="number" step="0.01" value={formData.costPrice || ''}
                     onChange={(e) => setFormData({...formData, costPrice: parseFloat(e.target.value)})}
                     className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Stock *</label>
              <input type="number" required value={formData.stock || ''}
                     onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                     className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Low Stock Threshold</label>
              <input type="number" value={formData.lowStockThreshold || 20}
                     onChange={(e) => setFormData({...formData, lowStockThreshold: parseInt(e.target.value)})}
                     className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <select required value={formData.categoryId || ''}
                      onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Brand</label>
              <input type="text" value={formData.brand || ''}
                     onChange={(e) => setFormData({...formData, brand: e.target.value})}
                     className="w-full px-3 py-2 border rounded-lg" />
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
            <div>
              <label className="block text-sm font-medium mb-2">Featured</label>
              <select value={formData.featured || false}
                      onChange={(e) => setFormData({...formData, featured: e.target.value === 'true'})}
                      className="w-full px-3 py-2 border rounded-lg">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea value={formData.description || ''}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg" rows="3" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit"
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Save Product
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default ProductsTab