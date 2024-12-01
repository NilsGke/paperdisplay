import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import RootLayout from "./RootLayout";
import RootPage from "./routes";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<RootPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
