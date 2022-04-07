import useAuth from "../useAuth";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ children }) {
  const { authed } = useAuth();
  const location = useLocation();

  return authed === true ? (
    children
  ) : (
    <Navigate to="/" replace state={{ path: location.pathname }} />
  );
}
