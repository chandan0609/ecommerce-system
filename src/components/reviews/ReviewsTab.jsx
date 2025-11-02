import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchReviews,
  deleteReview,
} from "../../redux/reviews/reviewsSlice";

import {
  Box,
  Button,
  CircularProgress,
  Chip,
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
} from "@mui/material";

const ReviewsTab = () => {
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.reviews.items);
  const products = useSelector((state) => state.products.items);
  const customers = useSelector((state) => state.customers.items);
  const loading = useSelector((state) => state.reviews.loading);

  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // ✅ Automatically fetch reviews on component mount
  useEffect(() => {
    dispatch(fetchReviews());
  }, [dispatch]);

  const filteredReviews = reviews.filter((r) => {
    const product = products.find((p) => p.id === r.productId);
    const customer = customers.find((c) => c.id === r.customerId);

    const matchesSearch =
      !search ||
      r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.comment?.toLowerCase().includes(search.toLowerCase()) ||
      product?.name?.toLowerCase().includes(search.toLowerCase()) ||
      `${customer?.firstName} ${customer?.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesRating = !ratingFilter || r.rating === Number(ratingFilter);
    const matchesStatus = !statusFilter || r.status === statusFilter;

    return matchesSearch && matchesRating && matchesStatus;
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      dispatch(deleteReview(id));
    }
  };

  return (
    <Box p={3}>
      {/* 🔍 Filters & Actions */}
      <Box display="flex" justifyContent="space-between" flexWrap="wrap" mb={3} gap={2}>
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            label="Search reviews"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            displayEmpty
            size="small"
          >
            <MenuItem value="">All Ratings</MenuItem>
            <MenuItem value="5">5 Stars</MenuItem>
            <MenuItem value="4">4 Stars</MenuItem>
            <MenuItem value="3">3 Stars</MenuItem>
            <MenuItem value="2">2 Stars</MenuItem>
            <MenuItem value="1">1 Star</MenuItem>
          </Select>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            displayEmpty
            size="small"
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </Select>
        </Box>

        <Button
          variant="contained"
          color="success"
          onClick={() => dispatch(fetchReviews())}
        >
          Refresh Reviews
        </Button>
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
                <TableCell>Customer</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Review</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Helpful</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReviews.map((review) => {
                const product = products.find((p) => p.id === review.productId);
                const customer = customers.find((c) => c.id === review.customerId);

                return (
                  <TableRow key={review.id} hover>
                    {/* Product Info */}
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                          src={product?.image}
                          alt={product?.name}
                        />
                        <Box>
                          <Typography fontWeight="bold">
                            {product?.name || "Unknown Product"}
                          </Typography>
                          {review.verified && (
                            <Chip
                              label="Verified"
                              size="small"
                              color="success"
                              variant="outlined"
                              sx={{ mt: 0.5 }}
                            />
                          )}
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Customer */}
                    <TableCell>
                      {customer
                        ? `${customer.firstName} ${customer.lastName}`
                        : "Unknown"}
                    </TableCell>

                    {/* Rating */}
                    <TableCell>
                      <Typography color="warning.main">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </Typography>
                    </TableCell>

                    {/* Review Text */}
                    <TableCell>
                      <Typography fontWeight="bold">{review.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {review.comment.length > 80
                          ? review.comment.substring(0, 80) + "..."
                          : review.comment}
                      </Typography>
                    </TableCell>

                    {/* Date */}
                    <TableCell>{review.reviewDate}</TableCell>

                    {/* Helpful Votes */}
                    <TableCell>
                      <Typography variant="body2">
                        <span style={{ color: "green" }}>👍 {review.helpful}</span> /
                        <span style={{ color: "red", marginLeft: 4 }}>
                          👎 {review.notHelpful}
                        </span>
                      </Typography>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Chip
                        label={review.status}
                        color={
                          review.status === "Approved"
                            ? "success"
                            : review.status === "Pending"
                            ? "warning"
                            : "error"
                        }
                        size="small"
                      />
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDelete(review.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredReviews.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No reviews found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ReviewsTab;
