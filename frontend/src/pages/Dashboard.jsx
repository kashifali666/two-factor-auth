import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api
      .get("/users/current")
      .then((res) => setUser(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      {user && (
        <p className="mt-2">
          Welcome, {user.name} ({user.email})
        </p>
      )}
      <div className="mt-4 space-x-4">
        <Link to="/2fa-setup" className="text-blue-600">
          Setup 2FA
        </Link>
        <Link to="/admin" className="text-blue-600">
          Admin Panel
        </Link>
        <Link to="/moderator" className="text-blue-600">
          Moderator Panel
        </Link>
      </div>
    </div>
  );
}
