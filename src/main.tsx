import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";
import "./index.css";
import App from "./App";

const CustomerDemo = lazy(() => import("@/views/RoleDemos").then((module) => ({ default: module.CustomerDemo })));
const ProviderDemo = lazy(() => import("@/views/RoleDemos").then((module) => ({ default: module.ProviderDemo })));
const AdminDemo = lazy(() => import("@/views/RoleDemos").then((module) => ({ default: module.AdminDemo })));
const LoginPage = lazy(() => import("@/views/AuthPages").then((module) => ({ default: module.LoginPage })));
const SignupPage = lazy(() => import("@/views/AuthPages").then((module) => ({ default: module.SignupPage })));
const CustomerPortalPage = lazy(() => import("@/views/AuthPages").then((module) => ({ default: module.CustomerPortalPage })));
const RequirePortalRole = lazy(() => import("@/views/AuthPages").then((module) => ({ default: module.RequirePortalRole })));

registerSW({ immediate: true });

function RouteLoading() {
  return <div className="grid min-h-screen place-items-center bg-paper"><p className="label text-violet">Loading view…</p></div>;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<RouteLoading />}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/customer" element={<CustomerPortalPage />} />
          <Route path="/customer-demo" element={<CustomerDemo />} />
          <Route path="/provider" element={<RequirePortalRole role="provider"><ProviderDemo /></RequirePortalRole>} />
          <Route path="/ceo" element={<RequirePortalRole role="ceo"><AdminDemo /></RequirePortalRole>} />
          <Route path="/provider-demo" element={<RequirePortalRole role="provider"><ProviderDemo /></RequirePortalRole>} />
          <Route path="/admin-demo" element={<RequirePortalRole role="ceo"><AdminDemo /></RequirePortalRole>} />
          <Route path="*" element={<App />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
);
