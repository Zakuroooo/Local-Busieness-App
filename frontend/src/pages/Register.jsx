import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import theme from "../styles/theme";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER", // Default role
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/register",
        formData
      );

      // Redirect based on role
      if (response.data.user.role === "ADMIN") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setError(error.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen ${theme.colors.background} flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12`}
    >
      <div
        className={`max-w-md w-full ${theme.colors.card} ${theme.rounded} ${theme.shadow} p-6 sm:p-8 space-y-8 border border-violet-100`}
      >
        <div>
          <h2 className="text-center text-3xl font-extrabold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join our community and explore local businesses
          </p>
        </div>

        {error && (
          <div
            className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 block w-full px-4 py-3 border border-gray-300 ${theme.rounded} bg-violet-50/30 focus:ring-2 focus:ring-violet-500 focus:border-transparent ${theme.transition}`}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full px-4 py-3 border border-gray-300 ${theme.rounded} bg-violet-50/30 focus:ring-2 focus:ring-violet-500 focus:border-transparent ${theme.transition}`}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 block w-full px-4 py-3 border border-gray-300 ${theme.rounded} bg-violet-50/30 focus:ring-2 focus:ring-violet-500 focus:border-transparent ${theme.transition}`}
                placeholder="Create a password"
              />
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Account Type
              </label>
              <div className="mt-1 grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "USER" })}
                  className={`px-4 py-3 ${theme.rounded} ${
                    formData.role === "USER"
                      ? `${theme.colors.primary.gradient} text-white`
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } ${theme.transition} flex items-center justify-center gap-2`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  User
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "ADMIN" })}
                  className={`px-4 py-3 ${theme.rounded} ${
                    formData.role === "ADMIN"
                      ? `${theme.colors.primary.gradient} text-white`
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } ${theme.transition} flex items-center justify-center gap-2`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  Business Owner
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold ${
                theme.rounded
              } text-white ${theme.colors.primary.gradient} ${
                theme.transition
              } ${theme.hover} ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-violet-600 hover:text-violet-500 transition-colors duration-200"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
