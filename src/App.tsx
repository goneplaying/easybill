import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import HomePage from "./pages/easybill/HomePage";
import OrdersPage from "./pages/easybill/v2/OrdersPage";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/orders" element={<OrdersPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

// Set theme to system on mount
if (typeof window !== 'undefined') {
  const root = window.document.documentElement;
  root.classList.remove("light", "dark");
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  root.classList.add(systemTheme);
  localStorage.setItem("vite-ui-theme", "system");
}

export default App;
