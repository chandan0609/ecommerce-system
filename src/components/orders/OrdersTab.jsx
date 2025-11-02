import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createOrder,
  updateOrder,
  deleteOrder,
  fetchOrders,
} from "../../redux/orders/ordersSlice";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Modal,
  Grid,
} from "@mui/material";

const OrdersTab = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.items);
  const customers = useSelector((state) => state.customers.items);
  const loading = useSelector((state) => state.orders.loading);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({});

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      !search || o.orderNumber.toLowerCase().includes(search.toLowerCase());
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
    if (window.confirm("Are you sure you want to delete this order?")) {
      dispatch(deleteOrder(id));
    }
  };

  const handleFetchOrders = () => {
    dispatch(fetchOrders());
  };

  return (
    <Box>
      {/* Filters and Buttons */}
      <Box display="flex" justifyContent="space-between" flexWrap="wrap" mb={3} gap={2}>
        <Box display="flex" flexWrap="wrap" gap={2}>
          <TextField
            label="Search orders"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
          />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Processing">Processing</MenuItem>
              <MenuItem value="Shipped">Shipped</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            color="success"
            onClick={handleFetchOrders}
          >
            Fetch Orders
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setEditingOrder(null);
              setFormData({
                orderNumber: `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
                paymentMethod: "Credit Card",
                status: "Pending",
                paymentStatus: "Pending",
              });
              setIsModalOpen(true);
            }}
          >
            + Create Order
          </Button>
        </Box>
      </Box>

      {/* Orders Table */}
      {loading ? (
        <Typography align="center" sx={{ py: 5 }}>
          Loading...
        </Typography>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order Number</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const customer = customers.find((c) => c.id === order.customerId);
                  return (
                    <TableRow key={order.id} hover>
                      <TableCell>
                        <Typography fontWeight="bold">{order.orderNumber}</Typography>
                        {order.trackingNumber && (
                          <Typography variant="caption" color="text.secondary">
                            Track: {order.trackingNumber}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {customer
                          ? `${customer.firstName} ${customer.lastName}`
                          : "Unknown"}
                      </TableCell>
                      <TableCell>{order.orderDate}</TableCell>
                      <TableCell>{order.items?.length || 0} item(s)</TableCell>
                      <TableCell>
                        <Typography color="success.main" fontWeight="bold">
                          ${order.total?.toFixed(2)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Subtotal: ${order.subtotal?.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{order.paymentMethod}</Typography>
                        <Typography
                          variant="caption"
                          color={
                            order.paymentStatus === "Paid"
                              ? "success.main"
                              : order.paymentStatus === "Refunded"
                              ? "error.main"
                              : "warning.main"
                          }
                        >
                          {order.paymentStatus}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            bgcolor:
                              order.status === "Delivered"
                                ? "success.light"
                                : order.status === "Shipped"
                                ? "secondary.light"
                                : order.status === "Processing"
                                ? "info.light"
                                : order.status === "Pending"
                                ? "warning.light"
                                : "error.light",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2,
                            display: "inline-block",
                          }}
                        >
                          {order.status}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="warning"
                          size="small"
                          onClick={() => handleEdit(order)}
                          sx={{ mr: 1 }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleDelete(order.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Order Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 700,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" mb={2}>
            {editingOrder ? "Edit Order" : "Create Order"}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Order Number"
                fullWidth
                required
                value={formData.orderNumber || ""}
                onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Customer</InputLabel>
                <Select
                  required
                  value={formData.customerId || ""}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                >
                  {customers.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.firstName} {c.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Additional Form Fields */}
            {[
              { label: "Status", key: "status", options: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"] },
              { label: "Payment Method", key: "paymentMethod", options: ["Credit Card", "Debit Card", "PayPal", "Cash"] },
              { label: "Payment Status", key: "paymentStatus", options: ["Pending", "Paid", "Refunded"] },
              { label: "Shipping Method", key: "shippingMethod", options: ["Standard", "Express", "Free Shipping"] },
            ].map((field, idx) => (
              <Grid item xs={6} key={idx}>
                <FormControl fullWidth>
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                    value={formData[field.key] || field.options[0]}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.key]: e.target.value })
                    }
                  >
                    {field.options.map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ))}

            {[
              { label: "Subtotal", key: "subtotal", type: "number", required: true },
              { label: "Tax", key: "tax", type: "number" },
              { label: "Shipping", key: "shipping", type: "number" },
              { label: "Discount", key: "discount", type: "number" },
              { label: "Total", key: "total", type: "number", required: true },
              { label: "Tracking Number", key: "trackingNumber" },
            ].map((field, idx) => (
              <Grid item xs={6} key={idx}>
                <TextField
                  label={field.label}
                  fullWidth
                  type={field.type || "text"}
                  required={field.required || false}
                  value={formData[field.key] || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [field.key]:
                        field.type === "number"
                          ? parseFloat(e.target.value)
                          : e.target.value,
                    })
                  }
                />
              </Grid>
            ))}

            <Grid item xs={12}>
              <TextField
                label="Notes"
                fullWidth
                multiline
                rows={2}
                value={formData.notes || ""}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </Grid>
          </Grid>

          <Box display="flex" justifyContent="flex-end" mt={3} gap={2}>
            <Button onClick={() => setIsModalOpen(false)} variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Save Order
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default OrdersTab;
