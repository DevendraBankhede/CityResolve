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

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const res = await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role || "user",
      });

      if (res.success) {
        toast.success("Account created successfully!");
        const redirectPath = formData.role === "admin" ? "/admin" : "/dashboard";
        navigate(redirectPath);
      } else {
        toast.error(res.message || "Registration failed.");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans antialiased text-slate-900">
      {/* ================= LEFT: CLEAN & MINIMAL SECTION ================= */}
      <div className="hidden lg:flex lg:w-1/2 min-h-screen bg-slate-900 text-white flex-col justify-between p-12 xl:p-16 relative">
        {/* Top Tag */}
        <div className="text-xs font-medium uppercase tracking-wider text-slate-400">
          Smart City Portal
        </div>

        {/* Center Quote / Concept */}
        <div className="max-w-md space-y-6">
          <blockquote className="text-2xl xl:text-3xl font-medium tracking-tight text-slate-100 leading-snug">
            “Join thousands of citizens taking direct action to report, track, and improve civic infrastructure across our city.”
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

      {/* ================= RIGHT: MINIMAL REGISTRATION FORM ================= */}
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
        <div className="w-full max-w-sm mx-auto my-auto py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Create an account
            </h1>
            <p className="text-sm text-slate-500 mt-1.5">
              Join your neighborhood to report civic issues and follow repairs.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Rahul Sharma"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                required
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
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
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
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

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-xl transition duration-150 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Create account</span>
              )}
            </button>
          </form>

          {/* Sign in Link */}
          <p className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-slate-900 hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="text-xs text-slate-400">
          © 2026 CityResolve
        </div>
      </div>
    </div>
  );
};

export default Register;
