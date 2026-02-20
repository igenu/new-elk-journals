import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../services/api";
import "../styles/Login.css";
import { setRole, setPermissions } from "../utils/secureStorage";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        const emailTrigger =
          response.data.email_trigger ?? response.data.user?.email_trigger;
        const userWithTrigger = {
          ...(response.data.user || {}),
          email_trigger: emailTrigger,
        };

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(userWithTrigger));
        if (emailTrigger !== undefined) {
          localStorage.setItem("email_trigger", JSON.stringify(!!emailTrigger));
        }
        setRole(response.data.role);
        // Save permissions for subadmin users
        if (response.data.user?.permissions) {
          setPermissions(response.data.user.permissions);
        }

        Swal.fire({
          title: "Login Successful",
          text: "Redirecting to dashboard...",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        }).then(() => {
          navigate("/dashboard");
        });
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      const msg =
        err.response?.data?.message ||
        (err.response?.data?.errors
          ? err.response.data.errors[0].msg
          : "Invalid email or password");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="da-login-container">
      <div className="da-login-card">
        <div className="da-header">
          <h2 className="da-header text-2xl font-bold text-[#204066]">Login</h2>
          {/* <p className="text-sm text-gray-500 mt-2">Welcome back! Please access your account.</p> */}
        </div>

        <form onSubmit={handleSubmit} className="da-login-form mt-6">
          <div className="da-input-group">
            <label className="font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="da-input-group">
            <label className="font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded text-sm mb-4">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`da-login-btn w-full bg-[#12b48b] hover:bg-[#0e9470] text-white font-bold py-2 rounded transition-colors ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <div className="mt-4 text-center">
            <a href="/" className="text-sm text-gray-500 hover:text-[#204066]">
              Back to Home
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
