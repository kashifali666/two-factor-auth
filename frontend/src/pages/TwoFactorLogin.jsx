import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function TwoFactorLogin() {
  const [totp, setTotp] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login/2fa", {
        tempToken: localStorage.getItem("tempToken"),
        totp,
      });
      localStorage.removeItem("tempToken");
      localStorage.setItem("accessToken", res.data.accessToken);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "2FA failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Enter 2FA Code</h2>
      <form onSubmit={submit} className="space-y-3">
        <input
          className="border p-2 w-full"
          placeholder="TOTP"
          onChange={(e) => setTotp(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 w-full rounded">
          Verify
        </button>
      </form>
    </div>
  );
}
