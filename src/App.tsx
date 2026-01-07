import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import HomePage from "./pages/easybill/HomePage";
import VersionsPage from "./pages/easybill/VersionsPage";
// Version 1.2 imports
import ShippingPage12 from "./pages/easybill/a/ShippingPage";
import DashboardPage12 from "./pages/easybill/a/DashboardPage";
import SettingsPage12 from "./pages/easybill/a/SettingsPage";
import ToolsPage12 from "./pages/easybill/a/ToolsPage";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <BrowserRouter basename="/easybill">
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="versions" element={<VersionsPage />} />
          {/* Version 1.2 routes */}
          <Route path="a/shipping" element={<ShippingPage12 />} />
          <Route path="a/dashboard" element={<DashboardPage12 />} />
          <Route path="a/settings" element={<SettingsPage12 />} />
          <Route path="a/tools" element={<ToolsPage12 />} />
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
