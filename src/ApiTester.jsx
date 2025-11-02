import React, { useEffect, useState } from 'react';
import api from "./services/api"

export default function ApiTester() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create new product
  const handleCreate = async () => {
    if (!newProduct.name || !newProduct.price) return alert('Enter all fields!');
    try {
      await api.createProduct({
        name: newProduct.name,
        price: Number(newProduct.price)
      });
      setNewProduct({ name: '', price: '' });
      fetchProducts();
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    try {
      await api.deleteProduct(id);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // On mount, fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6 max-w-xl mx-auto text-gray-800">
      <h1 className="text-2xl font-bold mb-4">🧪 API Tester</h1>

      {/* Add product form */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Product name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          className="border p-2 mr-2 rounded"
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          className="border p-2 mr-2 rounded"
        />
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </div>

      {/* Product list */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-3">
          {products.map((p) => (
            <li
              key={p.id}
              className="flex justify-between items-center border p-3 rounded shadow-sm"
            >
              <div>
                <strong>{p.name}</strong> — ${p.price}
              </div>
              <button
                onClick={() => handleDelete(p.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
