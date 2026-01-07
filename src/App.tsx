import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ThemeProvider } from "./components/theme-provider";
import HomePage from "./pages/easybill/HomePage";
import VersionsPage from "./pages/easybill/VersionsPage";

// Lazy load route components for code splitting
const ShippingPage12 = lazy(() => import("./pages/easybill/a/ShippingPage"));
const DashboardPage12 = lazy(() => import("./pages/easybill/a/DashboardPage"));
const SettingsPage12 = lazy(() => import("./pages/easybill/a/SettingsPage"));
const ToolsPage12 = lazy(() => import("./pages/easybill/a/ToolsPage"));

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <BrowserRouter basename="/easybill">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="versions" element={<VersionsPage />} />
            {/* Version 1.2 routes */}
            <Route path="a/shipping" element={<ShippingPage12 />} />
            <Route path="a/dashboard" element={<DashboardPage12 />} />
            <Route path="a/settings" element={<SettingsPage12 />} />
            <Route path="a/tools" element={<ToolsPage12 />} />
          </Routes>
        </Suspense>
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
