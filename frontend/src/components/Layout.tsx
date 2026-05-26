import {
  AppBar,
  Box,
  CssBaseline,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import MenuIcon from "@mui/icons-material/Menu";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: "linear-gradient(90deg, #0d1b2a 0%, #1b2a3b 100%)",
          borderBottom: "1px solid rgba(255,165,0,0.25)",
        }}
      >
        <Toolbar sx={{ gap: 1.5 }}>
          <IconButton size="small" sx={{ color: "rgba(255,255,255,0.5)" }}>
            <MenuIcon />
          </IconButton>

          <LocalShippingIcon sx={{ color: "#FFA500", fontSize: 28 }} />

          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#fff",
            }}
          >
            RotaCerta
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: "rgba(255,165,0,0.7)",
              fontFamily: "'Barlow Condensed', sans-serif",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              mt: "2px",
            }}
          >
            Logística
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Typography
            variant="caption"
            sx={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}
          >
            PAINEL OPERACIONAL
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Offset para não sobrepor o conteúdo */}
      <Toolbar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          background: "#0a1628",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}