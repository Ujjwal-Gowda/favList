import { useAtom } from "jotai";
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticatedAtom } from "../store/authStore";

export default function PublicRoute() {
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
