import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./auth/ProtectedRoute";
import PublicOnlyRoute from "./auth/PublicOnlyRoute";
import ManageRestaurantsPage from "./pages/ManageRestaurantsPage";
import SingleRestaurantPage from "./pages/SingleRestaurantPage";
import MenuEditorPage from "./pages/MenuEditorPage";

const App = () => {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected area */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/manage-restaurants" element={<ManageRestaurantsPage />} />
          <Route path="/manage-restaurants/:restaurantId" element={<SingleRestaurantPage />} />
          <Route path="/manage-restaurants/:restaurantId/menus/:menuId" element={<MenuEditorPage />} />
        </Route>
      </Route>

      <Route path="*" element={<div className="p-6">Not found</div>} />
    </Routes>
  );
}

export default App;
