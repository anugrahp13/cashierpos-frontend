//import react router dom
import { Routes, Route, Navigate } from "react-router-dom";

//import store
import { useStore } from "../stores/user";

//import view login
import Login from "../views/auth/login.jsx";

//import view dashboard
import Dashboard from "../views/dashboard/index.jsx";

export default function AppRoutes() {
  //destruct state "token" from store
  const { token } = useStore();

  return (
    <Routes>
      {/* route "/" */}
      <Route
        path="/"
        element={token ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      {/* route "/dashboard" */}
      <Route
        path="/dashboard"
        element={token ? <Dashboard /> : <Navigate to="/" replace />}
      />
    </Routes>
  );
}
