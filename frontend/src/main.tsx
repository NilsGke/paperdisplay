import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import RootPage from "./pages/indexPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getSettings } from "./lib/settings";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import EditorPage from "./pages/editorPage";
import Layout from "./components/Layout";
import AddImagePage from "./pages/addImagePage";
import QuickTextPage from "./pages/quickTextPage";
import { TooltipProvider } from "./components/ui/tooltip";

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
              <Route path="/editImage" element={<EditorPage />} />
              <Route path="/addImage" element={<AddImagePage />} />
              <Route path="/quickText" element={<QuickTextPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </StrictMode>
);
