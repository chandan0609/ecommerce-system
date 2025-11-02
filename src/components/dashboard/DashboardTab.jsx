import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
} from "@mui/material";

const Dashboard = () => {
  const products = useSelector((state) => state.products.items);
  const customers = useSelector((state) => state.customers.items);
  const orders = useSelector((state) => state.orders.items);
  const categories = useSelector((state) => state.categories.items || []);

  // Analytics Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const activeProducts = products.filter((p) => p.status === "Active").length;
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;

  // Sales by Date (for Line Chart)
  const salesByDate = {};
  orders.forEach((order) => {
    const date = order.orderDate;
    salesByDate[date] = (salesByDate[date] || 0) + order.total;
  });

  const salesData = Object.keys(salesByDate)
    .sort()
    .slice(-7)
    .map((date) => ({
      date,
      sales: salesByDate[date],
    }));

  // Products by Category (for Bar Chart)
  const categoryData = categories.map((cat) => ({
    name: cat.name,
    count: cat.productCount || 0,
  }));

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f9fafb", p: 4 }}>
      <Typography variant="h4" fontWeight="bold" align="center" mb={5}>
        Admin Dashboard
      </Typography>

      {/* Navigation Buttons */}
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        flexWrap="wrap"
        mb={6}
      >
        <Button
          component={Link}
          to="/products"
          variant="contained"
          color="primary"
        >
          Manage Products
        </Button>
        <Button
          component={Link}
          to="/categories"
          variant="contained"
          color="success"
        >
          Manage Categories
        </Button>
        <Button
          component={Link}
          to="/customers"
          variant="contained"
          color="warning"
        >
          Manage Customers
        </Button>
        <Button
          component={Link}
          to="/orders"
          variant="contained"
          color="secondary"
        >
          Manage Orders
        </Button>
        <Button
          component={Link}
          to="/reviews"
          variant="contained"
          color="error"
        >
          Manage Reviews
        </Button>
      </Stack>

      {/* Analytics Cards */}
      <Grid container spacing={3} mb={6}>
        {[
          {
            title: "Total Revenue",
            value: `$${totalRevenue.toFixed(2)}`,
            icon: "💰",
            color: "#1976d2",
            subtext: "↑ 12.5% from last month",
          },
          {
            title: "Active Products",
            value: activeProducts,
            icon: "📦",
            color: "#2e7d32",
            subtext: "↑ 5 new this week",
          },
          {
            title: "Total Customers",
            value: customers.length,
            icon: "👥",
            color: "#ed6c02",
            subtext: "↑ 8.2% growth",
          },
          {
            title: "Pending Orders",
            value: pendingOrders,
            icon: "🕐",
            color: "#d32f2f",
            subtext: `${pendingOrders} need attention`,
          },
        ].map((item, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 2,
                transition: "0.3s",
                "&:hover": { boxShadow: 6 },
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography color="textSecondary">{item.title}</Typography>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: `${item.color}22`,
                      color: item.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                    }}
                  >
                    {item.icon}
                  </Box>
                </Box>
                <Typography variant="h4" fontWeight="bold">
                  {item.value}
                </Typography>
                <Typography variant="body2" color="success.main">
                  {item.subtext}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Sales Chart */}
      <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 5 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Sales Overview (Last 7 Days)
          </Typography>
          <Box sx={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `${value.toFixed(2)}`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#1976d2"
                  strokeWidth={2}
                  name="Daily Sales"
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

      {/* Category Chart */}
      <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Products by Category
          </Typography>
          <Box sx={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#1976d2" name="Products" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
