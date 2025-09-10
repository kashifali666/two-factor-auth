import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        headers: { Authorization: token },
      });
      localStorage.clear();
      navigate("/login");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <nav className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold">
        <Link to="/">AuthApp</Link>
      </h1>
      <div className="space-x-4">
        {!token ? (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
