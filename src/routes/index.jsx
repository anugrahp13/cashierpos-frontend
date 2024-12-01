//import react router dom
import { Routes, Route, Navigate } from "react-router-dom";

//import store
import { useStore } from "../stores/user";

//import view login
import Login from "../views/auth/login.jsx";

//import view dashboard
import Dashboard from "../views/dashboard/index.jsx";

//import view categories
import CategoriesIndex from "../views/categories/index.jsx";

//import view products
import ProductsIndex from "../views/products/index.jsx";

//import view customers
import CustomersIndex from "../views/customers/index.jsx";

//import view users
import UsersIndex from "../views/users/index.jsx";

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

      {/* route "/categories" */}
      <Route
        path="/categories"
        element={token ? <CategoriesIndex /> : <Navigate to="/" replace />}
      />

      {/* route "/products" */}
      <Route
        path="/products"
        element={token ? <ProductsIndex /> : <Navigate to="/" replace />}
      />

      {/* route "/customers" */}
      <Route
        path="/customers"
        element={token ? <CustomersIndex /> : <Navigate to="/" replace />}
      />

      {/* route "/users" */}
      <Route
        path="/users"
        element={token ? <UsersIndex /> : <Navigate to="/" replace />}
      />
    </Routes>
  );
}
