import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import RootPage from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getSettings } from "./lib/settings";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.min.css";

const queryClient = new QueryClient();

window.addEventListener("load", () => {
  const { theme } = getSettings();
  window.document.body.classList.add(theme);
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
