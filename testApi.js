import api from './api.js';

async function testAPI() {
  try {
    console.log('Fetching products...');
    const products = await api.getProducts();
    console.log(products);

    console.log('Creating new product...');
    const newProduct = await api.createProduct({ name: 'Tablet', price: 499 });
    console.log('Created:', newProduct);

    console.log('Updating product...');
    const updated = await api.updateProduct(newProduct.id, { price: 599 });
    console.log('Updated:', updated);

    console.log('Deleting product...');
    await api.deleteProduct(newProduct.id);
    console.log('Deleted successfully!');
  } catch (err) {
    console.error('API Error:', err);
  }
}

testAPI();
