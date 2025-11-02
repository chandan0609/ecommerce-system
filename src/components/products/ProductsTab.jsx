import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  fetchProducts,
} from "../../redux/products/productsSlice";

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  Avatar,
  Chip,
} from "@mui/material";

const ProductsTab = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const categories = useSelector((state) => state.categories.items);
  const loading = useSelector((state) => state.products.loading);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({});

  // ✅ Auto-fetch products on mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !search ||
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
      await dispatch(createProduct(formData));
    }
    await dispatch(fetchProducts());
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
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <Box p={3}>
      {/* 🔍 Filters and Actions */}
      <Box display="flex" justifyContent="space-between" flexWrap="wrap" mb={3} gap={2}>
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            label="Search products"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
          />
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            displayEmpty
            size="small"
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            displayEmpty
            size="small"
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        </Box>

        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            color="success"
            onClick={() => dispatch(fetchProducts())}
          >
            Refresh Products
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setEditingProduct(null);
              setFormData({});
              setIsModalOpen(true);
            }}
          >
            + Add Product
          </Button>
        </Box>
      </Box>

      {/* 🧾 Table */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={5}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((product) => {
                const category = categories.find((c) => c.id === product.categoryId);
                const isLowStock = product.stock < product.lowStockThreshold;

                return (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar src={product.images?.[0]} alt={product.name} />
                        <Box>
                          <Typography fontWeight="bold">{product.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {product.sku}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography color="success.main" fontWeight="bold">
                        ${product.price.toFixed(2)}
                      </Typography>
                      {product.costPrice && (
                        <Typography variant="body2" color="text.secondary">
                          Cost: ${product.costPrice}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography color={isLowStock ? "error.main" : "text.primary"}>
                        {product.stock}
                      </Typography>
                      {isLowStock && (
                        <Typography variant="body2" color="error.main">
                          Low Stock
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {"★".repeat(Math.floor(product.rating)) +
                        "☆".repeat(5 - Math.floor(product.rating))}
                      <Typography variant="body2" color="text.secondary">
                        ({product.reviewCount})
                      </Typography>
                    </TableCell>
                    <TableCell>{product.brand || "N/A"}</TableCell>
                    <TableCell>{category?.name || "N/A"}</TableCell>
                    <TableCell>
                      <Chip
                        label={product.status}
                        color={product.status === "Active" ? "success" : "error"}
                        size="small"
                      />
                      {product.featured && (
                        <Chip label="⭐ Featured" color="warning" size="small" sx={{ ml: 1 }} />
                      )}
                    </TableCell>
                    <TableCell>
                      <Button size="small" color="warning" onClick={() => handleEdit(product)}>
                        Edit
                      </Button>
                      <Button size="small" color="error" onClick={() => handleDelete(product.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No products found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* ✨ Modal (Dialog) for Add/Edit */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} py={2}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Product Name"
                  required
                  fullWidth
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="SKU"
                  required
                  fullWidth
                  value={formData.sku || ""}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Price"
                  type="number"
                  required
                  fullWidth
                  value={formData.price || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, price: parseFloat(e.target.value) })
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Cost Price"
                  type="number"
                  fullWidth
                  value={formData.costPrice || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, costPrice: parseFloat(e.target.value) })
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Stock"
                  type="number"
                  required
                  fullWidth
                  value={formData.stock || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: parseInt(e.target.value) })
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Low Stock Threshold"
                  type="number"
                  fullWidth
                  value={formData.lowStockThreshold || 20}
                  onChange={(e) =>
                    setFormData({ ...formData, lowStockThreshold: parseInt(e.target.value) })
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <Select
                  fullWidth
                  required
                  value={formData.categoryId || ""}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  displayEmpty
                >
                  <MenuItem value="">Select Category</MenuItem>
                  {categories.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Brand"
                  fullWidth
                  value={formData.brand || ""}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <Select
                  fullWidth
                  value={formData.status || "Active"}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={6}>
                <Select
                  fullWidth
                  value={formData.featured ? "true" : "false"}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.value === "true" })
                  }
                >
                  <MenuItem value="false">Not Featured</MenuItem>
                  <MenuItem value="true">Featured</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  multiline
                  rows={3}
                  fullWidth
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Save Product
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductsTab;
