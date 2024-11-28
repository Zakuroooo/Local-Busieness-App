import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import theme from "../styles/theme";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    location: "",
    category: "",
  });
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);

  // Fetch businesses, categories, and profile on component mount
  useEffect(() => {
    fetchBusinesses();
    fetchCategories();
    fetchProfile();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3000/api/businesses/admin/my-businesses",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBusinesses(response.data);
    } catch (error) {
      console.error("Error fetching businesses:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/categories");
      console.log("Categories response:", response.data);
      setCategoryOptions(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3000/api/users/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again");
        navigate("/login");
        return;
      }

      const businessData = {
        name: formData.name,
        description: formData.description,
        address: formData.address,
        location: formData.location,
        category: formData.category,
      };

      console.log("Submitting business data:", businessData);

      let response;
      if (isEditing && editId) {
        // Update existing business
        response = await axios.put(
          `http://localhost:3000/api/businesses/${editId}`,
          businessData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Business updated:", response.data);
      } else {
        // Create new business
        response = await axios.post(
          "http://localhost:3000/api/businesses",
          businessData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Business created:", response.data);
      }

      // Reset form and state
      setFormData({
        name: "",
        description: "",
        address: "",
        location: "",
        category: "",
      });
      setIsEditing(false);
      setEditId(null);

      await fetchBusinesses();
      alert(
        isEditing
          ? "Business updated successfully!"
          : "Business added successfully!"
      );
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      alert(
        error.response?.data?.message ||
          `Error ${isEditing ? "updating" : "creating"} business`
      );
    }
  };

  const handleEdit = (business) => {
    setIsEditing(true);
    setEditId(business.id);
    setFormData({
      name: business.name,
      description: business.description,
      address: business.address,
      location: business.location,
      category: business.category.name,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this business?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:3000/api/businesses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchBusinesses();
      } catch (error) {
        console.error("Error deleting business:", error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({
      name: "",
      description: "",
      address: "",
      location: "",
      category: "",
    });
  };

  return (
    <div
      className={`min-h-screen ${theme.colors.background} px-4 sm:px-6 py-6`}
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Header with Glass Effect */}
        <div
          className={`${theme.colors.card} ${theme.rounded} ${theme.shadow} p-4 sm:p-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4`}
        >
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Manage your business listings</p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <button
              onClick={toggleProfile}
              className={`px-4 py-2 ${theme.rounded} ${theme.colors.primary.gradient} text-white ${theme.transition} ${theme.hover} flex items-center gap-2`}
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
              {showProfile ? "Hide Profile" : "View Profile"}
            </button>
            <button
              onClick={handleLogout}
              className={`px-4 py-2 ${theme.rounded} ${theme.colors.secondary.gradient} text-white ${theme.transition} ${theme.hover} flex items-center gap-2`}
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* Profile Section (conditionally rendered) */}
        {showProfile && (
          <div
            className={`${theme.colors.card} ${theme.rounded} ${theme.shadow} p-6 mb-8 border border-violet-100`}
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-violet-600"
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
              </span>
              Your Profile
            </h2>
            {profile ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                  className={`p-4 ${theme.rounded} bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100`}
                >
                  <label className="text-sm font-medium text-gray-500">
                    Name
                  </label>
                  <p className="text-lg font-medium text-gray-900 mt-1">
                    {profile.name}
                  </p>
                </div>
                <div
                  className={`p-4 ${theme.rounded} bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100`}
                >
                  <label className="text-sm font-medium text-gray-500">
                    Email
                  </label>
                  <p className="text-lg font-medium text-gray-900 mt-1">
                    {profile.email}
                  </p>
                </div>
                <div
                  className={`p-4 ${theme.rounded} bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100`}
                >
                  <label className="text-sm font-medium text-gray-500">
                    Role
                  </label>
                  <p className="text-lg font-medium text-gray-900 mt-1 capitalize">
                    {profile.role?.toLowerCase()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
              </div>
            )}
          </div>
        )}

        {/* Business Form - Updated for better responsiveness */}
        <div
          className={`${theme.colors.card} ${theme.rounded} ${theme.shadow} p-6 mb-8 border border-violet-100`}
        >
          <h2 className="text-xl sm:text-2xl font-semibold mb-6">
            {isEditing ? "Edit Business" : "Add New Business"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 ${theme.rounded} border border-violet-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent ${theme.transition} bg-violet-50/30`}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <div className="relative group">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 ${theme.rounded} 
                      border-2 border-violet-100 
                      focus:border-violet-500 focus:ring-2 focus:ring-violet-200 
                      ${theme.transition} 
                      bg-gradient-to-r from-violet-50/50 to-indigo-50/50
                      hover:from-violet-100/50 hover:to-indigo-100/50
                      appearance-none cursor-pointer
                      text-gray-700 font-medium
                      shadow-sm hover:shadow-md
                      backdrop-blur-sm`}
                    required
                  >
                    <option value="">Select a category</option>
                    {categoryOptions.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>

                  {/* Fancy dropdown arrow with gradient background */}
                  <div
                    className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none
                    bg-gradient-to-r from-violet-500 to-indigo-500 
                    group-hover:from-violet-600 group-hover:to-indigo-600
                    text-white rounded-r-xl transition-all duration-300"
                  >
                    <svg
                      className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>

                  {/* Decorative elements */}
                  <div
                    className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/20 to-indigo-500/20 
                    rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                  ></div>
                </div>

                {/* Helper text with icon */}
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                  <svg
                    className="w-4 h-4 text-violet-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    Choose the category that best describes your business
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className={`w-full px-4 py-3 ${theme.rounded} border border-violet-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent ${theme.transition} bg-violet-50/30`}
                required
              />
            </div>

            {/* Location Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 ${theme.rounded} border border-violet-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent ${theme.transition} bg-violet-50/30`}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location/City
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 ${theme.rounded} border border-violet-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent ${theme.transition} bg-violet-50/30`}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className={`px-6 py-3 ${theme.rounded} border border-gray-300 text-gray-700 hover:bg-gray-50 ${theme.transition}`}
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className={`px-6 py-3 ${theme.rounded} ${theme.colors.primary.gradient} text-white ${theme.transition} ${theme.hover}`}
              >
                {isEditing ? "Update Business" : "Add Business"}
              </button>
            </div>
          </form>
        </div>

        {/* Businesses List - Updated for better responsiveness */}
        <div
          className={`${theme.colors.card} ${theme.rounded} ${theme.shadow} p-4 sm:p-6 overflow-x-hidden`}
        >
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
            Your Businesses
          </h2>
          {loading ? (
            <div className="text-center py-8 sm:py-12">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-indigo-600 mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {businesses.map((business) => (
                <div
                  key={business.id}
                  className={`border border-gray-200 ${theme.rounded} p-4 sm:p-6 hover:border-indigo-500 ${theme.transition}`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="w-full sm:w-auto">
                      <h3 className="text-lg sm:text-xl font-semibold mb-2">
                        {business.name}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-2">
                        {business.description}
                      </p>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Address:</span>{" "}
                          {business.address}
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Location:</span>{" "}
                          {business.location}
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Category:</span>{" "}
                          {business.category?.name || "Uncategorized"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                      <button
                        onClick={() => handleEdit(business)}
                        className={`flex-1 sm:flex-none px-3 py-1.5 sm:px-4 sm:py-2 text-sm ${theme.rounded} bg-yellow-500 hover:bg-yellow-600 text-white ${theme.transition}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(business.id)}
                        className={`flex-1 sm:flex-none px-3 py-1.5 sm:px-4 sm:py-2 text-sm ${theme.rounded} bg-red-500 hover:bg-red-600 text-white ${theme.transition}`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {businesses.length === 0 && (
                <p className="text-center text-gray-500 py-6 sm:py-8">
                  No businesses added yet. Create your first business above!
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
