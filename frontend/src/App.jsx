import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import TwoFactorLogin from "./pages/TwoFactorLogin";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import ModeratorPanel from "./pages/ModeratorPanel";
import TwoFactorSetup from "./pages/TwoFactorSetup";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/2fa" element={<TwoFactorLogin />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/2fa-setup"
          element={
            <ProtectedRoute>
              <TwoFactorSetup />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/moderator"
          element={
            <ProtectedRoute>
              <ModeratorPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
export default App;
