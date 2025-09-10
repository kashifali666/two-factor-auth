import { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminPanel() {
  const [data, setData] = useState("");

  useEffect(() => {
    api
      .get("/admin")
      .then((res) => setData(res.data.message))
      .catch((err) => setData(err.response?.data?.message || "Unauthorized"));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Admin Panel</h2>
      <p className="mt-4">{data}</p>
    </div>
  );
}
