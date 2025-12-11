import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import HomePage from "./pages/easybill/HomePage";
import VersionsPage from "./pages/easybill/VersionsPage";
import ShippingPage from "./pages/easybill/1.1/ShippingPage";
import DashboardPage from "./pages/easybill/1.1/DashboardPage";
import SettingsPage from "./pages/easybill/1.1/SettingsPage";
import ToolsPage from "./pages/easybill/1.1/ToolsPage";
// Version 1.2 imports
import ShippingPage12 from "./pages/easybill/1.2/ShippingPage";
import DashboardPage12 from "./pages/easybill/1.2/DashboardPage";
import SettingsPage12 from "./pages/easybill/1.2/SettingsPage";
import ToolsPage12 from "./pages/easybill/1.2/ToolsPage";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <BrowserRouter basename="/easybill">
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="versions" element={<VersionsPage />} />
          {/* Version 1.1 routes */}
          <Route path="1.1/shipping" element={<ShippingPage />} />
          <Route path="1.1/dashboard" element={<DashboardPage />} />
          <Route path="1.1/settings" element={<SettingsPage />} />
          <Route path="1.1/tools" element={<ToolsPage />} />
          {/* Version 1.2 routes */}
          <Route path="1.2/shipping" element={<ShippingPage12 />} />
          <Route path="1.2/dashboard" element={<DashboardPage12 />} />
          <Route path="1.2/settings" element={<SettingsPage12 />} />
          <Route path="1.2/tools" element={<ToolsPage12 />} />
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
