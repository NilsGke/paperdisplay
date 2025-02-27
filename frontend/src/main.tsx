import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import RootPage from "./pages/indexPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getSettings } from "./lib/settings";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import Layout from "./components/Layout";
import AddImagePage from "./pages/addImagePage";
import QuickTextPage from "./pages/quickTextPage";
import { TooltipProvider } from "./components/ui/tooltip";
import ServerLogsPage from "./pages/serverLogsPage";
import SchedulesPage from "./pages/schedulesPage";

const queryClient = new QueryClient();

window.addEventListener("load", () => {
  const { theme } = getSettings();
  window.document.body.classList.add(theme);
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ToastContainer />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index path="/" element={<RootPage />} />
              <Route path="/addImage" element={<AddImagePage />} />
              <Route path="/quickText" element={<QuickTextPage />} />
              <Route path="/schedules" element={<SchedulesPage />} />
              <Route path="/serverLogs" element={<ServerLogsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </StrictMode>
);
