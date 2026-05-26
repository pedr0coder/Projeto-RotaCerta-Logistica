import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#FFA500" },
    background: { default: "#0a1628", paper: "#0d1b2a" },
  },
  typography: {
    fontFamily: "'Inter', 'Barlow Condensed', sans-serif",
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: "rgba(255,255,255,0.07)" },
      },
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}