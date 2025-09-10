import { useState, useEffect } from "react";
import api from "../services/api";

export default function TwoFactorSetup() {
  const [qr, setQr] = useState(null);
  const [totp, setTotp] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  
  useEffect(() => {
    api
      .get("/users/current")
      .then((res) => {
        if (res.data["2faEnable"]) {
          setEnabled(true);
        }
      })
      .catch(() => {});
  }, []);

  const generateQr = async () => {
    try {
      setLoading(true);
      setMessage("");
      const res = await api.get("/auth/2fa/generate", {
        responseType: "arraybuffer",
      });
      const blob = new Blob([res.data], { type: "image/png" });
      setQr(URL.createObjectURL(blob));
    } catch (err) {
      setMessage(err.response?.data?.message || "Error generating QR");
    } finally {
      setLoading(false);
    }
  };

  const validate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage("");
      const res = await api.post("/auth/2fa/validate", { totp });
      setEnabled(true);
      setMessage(res.data.message || "2FA Enabled Successfully");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error validating TOTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Two-Factor Authentication</h2>

      
      <div className="mb-4 flex items-center space-x-2">
        <span className="font-semibold">Status:</span>
        <span
          className={`px-2 py-1 rounded-full text-white ${
            enabled ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {enabled ? "Enabled" : "Disabled"}
        </span>
      </div>

      
      {!enabled && (
        <>
          {!qr && (
            <button
              onClick={generateQr}
              className="bg-blue-600 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate QR Code"}
            </button>
          )}
          {qr && (
            <div className="mt-4">
              <img src={qr} alt="Scan with Authenticator" className="mx-auto" />
              <form onSubmit={validate} className="space-y-3 mt-4">
                <input
                  className="border p-2 w-full"
                  placeholder="Enter TOTP from Authenticator"
                  value={totp}
                  onChange={(e) => setTotp(e.target.value)}
                />
                <button
                  className="bg-green-600 text-white px-4 py-2 w-full rounded"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Validate & Enable 2FA"}
                </button>
              </form>
            </div>
          )}
        </>
      )}

      {message && <p className="mt-3 text-center text-gray-700">{message}</p>}
    </div>
  );
}
