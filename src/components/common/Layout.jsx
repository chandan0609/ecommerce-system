// src/components/common/Layout.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from "@mui/material";

const Layout = ({ children }) => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#e3f2fd" }}> {/* Light blue background */}
      {/* Navbar */}
      <AppBar position="static" sx={{ bgcolor: "#1976d2" }}> {/* Blue navbar */}
        <Toolbar sx={{ display: "flex", gap: 2 }}>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: "bold", color: "white" }}
          >
            Admin Panel
          </Typography>

          <Button
            component={Link}
            to="/"
            variant="text"
            sx={{
              textTransform: "none",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.2)",
              },
            }}
          >
            Dashboard
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container sx={{ py: 4 }}>{children}</Container>
    </Box>
  );
};

export default Layout;
