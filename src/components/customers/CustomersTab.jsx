import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createCustomer,
  updateCustomer,
  deleteCustomer,
  fetchCustomers,
} from "../../redux/customers/customerSlice";

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

const CustomersTab = () => {
  const dispatch = useDispatch();
  const customers = useSelector((state) => state.customers.items);
  const loading = useSelector((state) => state.customers.loading);

  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    shippingAddress: { street: "", city: "", state: "", zipCode: "", country: "USA" },
  });

  // 🔄 Automatically fetch customers on mount
  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      !search ||
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
    setFormData({ shippingAddress: { street: "", city: "", state: "", zipCode: "", country: "USA" } });
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData(customer);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      dispatch(deleteCustomer(id));
    }
  };

  return (
    <Box p={3}>
      {/* 🔍 Filters and Actions */}
      <Box
        display="flex"
        justifyContent="space-between"
        flexWrap="wrap"
        mb={3}
        gap={2}
      >
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            label="Search customers"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
          />
          <Select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            displayEmpty
            size="small"
          >
            <MenuItem value="">All Tiers</MenuItem>
            <MenuItem value="Platinum">Platinum</MenuItem>
            <MenuItem value="Gold">Gold</MenuItem>
            <MenuItem value="Silver">Silver</MenuItem>
            <MenuItem value="Bronze">Bronze</MenuItem>
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
            onClick={() => {
              setEditingCustomer(null);
              setFormData({ shippingAddress: { street: "", city: "", state: "", zipCode: "", country: "USA" } });
              setIsModalOpen(true);
            }}
          >
            + Add Customer
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
                <TableCell>Customer</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Tier</TableCell>
                <TableCell>Orders</TableCell>
                <TableCell>Total Spent</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar src={customer.avatar} alt={customer.firstName} />
                      <Box>
                        <Typography fontWeight="bold">
                          {customer.firstName} {customer.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Joined: {customer.joinDate}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>
                    <Chip
                      label={customer.membershipTier}
                      color={
                        customer.membershipTier === "Platinum"
                          ? "default"
                          : customer.membershipTier === "Gold"
                          ? "warning"
                          : customer.membershipTier === "Silver"
                          ? "info"
                          : "secondary"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{customer.totalOrders}</TableCell>
                  <TableCell>
                    <Typography color="success.main" fontWeight="bold">
                      ${customer.totalSpent?.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Avg: ${customer.averageOrderValue?.toFixed(2) || "0.00"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={customer.status}
                      color={customer.status === "Active" ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      color="warning"
                      onClick={() => handleEdit(customer)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDelete(customer.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCustomers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No customers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* ✨ Modal (Dialog) for Add/Edit */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingCustomer ? "Edit Customer" : "Add Customer"}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} py={2}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="First Name"
                  required
                  fullWidth
                  value={formData.firstName || ""}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Last Name"
                  required
                  fullWidth
                  value={formData.lastName || ""}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Email"
                  required
                  fullWidth
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Phone"
                  fullWidth
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Date of Birth"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={formData.dateOfBirth || ""}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <Select
                  fullWidth
                  value={formData.gender || "Male"}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Save Customer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomersTab;
