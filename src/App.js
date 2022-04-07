import * as React from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Outlet,
} from "react-router-dom";
import "./App.css";
import Room from "./pages/Rooms";
import Login from "./pages/Login";
import Booking from "./pages/Booking";
import Profile from "./pages/Profile";
import { AuthProvider, useAuth, RequireAuth } from "./components/AuthProvider";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/room"
            element={
              <RequireAuth>
                <Room />
              </RequireAuth>
            }
          />
          <Route
            path="/room/:id"
            element={
              <RequireAuth>
                <Booking />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

function Layout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

function LoginPage() {
  let navigate = useNavigate();
  let location = useLocation();
  let auth = useAuth();

  let from = location.state?.from?.pathname || "/room";
  const handleLogin = async (body) => {
    const error = await auth.signin(body);
    console.log("789", error);
    if (!error) navigate(from, { replace: true });
    else console.log(error);
  };

  const handleSignup = (body) => {
    auth.signup(body, (err) => {
      if (err) console.log(err, "error from signup");
      else navigate(from);
    });
  };

  return (
    <div>
      <Login onLogin={handleLogin} onSignup={handleSignup}></Login>
    </div>
  );
}
