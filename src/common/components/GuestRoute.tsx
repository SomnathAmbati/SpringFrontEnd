import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn } from "../utils/mockAuth";

export default function GuestRoute() {
  return isLoggedIn() ? <Outlet /> : <Navigate to="/login" />;
}
