import { Navigate, Outlet, useLocation } from "react-router-dom";

function getToken() {
  const raw = localStorage.getItem("authToken");
  if (!raw) return null;
  const cleaned = raw.replace(/^"+|"+$/g, "").trim();
  const isJWT = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(cleaned);
  return isJWT ? cleaned : null;
}

export default function ProtectedRoute() {
  const location = useLocation();
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
