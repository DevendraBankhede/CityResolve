import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      const res = await login(formData.email, formData.password);
      if (res.success) {
        toast.success(`Welcome back, ${res.data?.name || "User"}!`);
        const userRole = res.data?.role || formData.role;
        const redirectPath = userRole === "admin" ? "/admin" : "/dashboard";
        navigate(redirectPath);
      } else {
        toast.error(res.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Check server connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setFormData({
      email: "citizen@example.com",
      password: "userpassword123",
      role: "user",
      rememberMe: true,
    });
    toast.success("Demo credentials filled");
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans antialiased text-slate-900">
      {/* ================= LEFT: MINIMAL LOGIN FORM ================= */}
      <div className="w-full lg:w-1/2 min-h-screen flex flex-col justify-between px-6 sm:px-12 md:px-16 lg:px-16 xl:px-24 py-10">
        {/* Brand */}
        <div>
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-105">
              <Building2 className="w-5 h-5 stroke-[2]" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">
              City<span className="text-blue-600">Resolve</span>
            </span>
          </Link>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-sm mx-auto my-auto py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Sign in to your account
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Welcome back. Enter your credentials to access the portal.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                required
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-slate-500 hover:text-slate-900 transition"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-slate-900 border-slate-300 focus:ring-slate-900"
                />
                <span className="text-xs text-slate-600">Remember this device</span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-xl transition duration-150 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign in</span>
              )}
            </button>
          </form>

          {/* Quick Demo Login */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2 px-3 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition"
            >
              Fill demo credentials
            </button>
          </div>

          {/* Sign up Link */}
          <p className="mt-6 text-center text-xs text-slate-500">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-slate-900 hover:underline">
              Create an account
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="text-xs text-slate-400">
          © 2026 CityResolve
        </div>
      </div>

      {/* ================= RIGHT: CLEAN & MINIMAL SECTION ================= */}
      <div className="hidden lg:flex lg:w-1/2 min-h-screen bg-slate-900 text-white flex-col justify-between p-12 xl:p-16 relative">
        {/* Top Tag */}
        <div className="text-xs font-medium uppercase tracking-wider text-slate-400">
          Smart City Portal
        </div>

        {/* Center Quote / Concept */}
        <div className="max-w-md space-y-6">
          <blockquote className="text-2xl xl:text-3xl font-medium tracking-tight text-slate-100 leading-snug">
            “A transparent, modern platform connecting citizens with municipal services to resolve community issues faster.”
          </blockquote>
          <div className="pt-2">
            <div className="text-sm font-semibold text-white">CityResolve</div>
            <div className="text-xs text-slate-400 mt-0.5">Civic issue reporting & resolution tracking</div>
          </div>
        </div>

        {/* Bottom Status */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Official Municipal Services</span>
          <Link to="/" className="text-slate-400 hover:text-white transition">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
