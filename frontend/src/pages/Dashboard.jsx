import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import theme from "../styles/theme";

const Dashboard = () => {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [profile, setProfile] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  // Fetch businesses from the backend
  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "https://local-busieness-app.onrender.com/api/businesses"
      );
      setBusinesses(data);
    } catch (err) {
      console.error("Error fetching businesses:", err);
    }
    setLoading(false);
  };

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://local-busieness-app.onrender.com/api/users/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchBusinesses();
    fetchProfile();
  }, []);

  // Filter and sort businesses
  const filteredBusinesses = businesses
    .filter((business) =>
      business.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "category")
        return (a.category?.name || "").localeCompare(b.category?.name || "");
      return 0;
    });

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
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
              Discover Businesses
            </h1>
            <p className="text-gray-600 mt-2">
              Find and explore local businesses near you
            </p>
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

        {/* Profile Section with Glass Effect */}
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
                    {profile.role.toLowerCase()}
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

        {/* Search and Filter Section */}
        <div
          className={`${theme.colors.card} ${theme.rounded} ${theme.shadow} p-6 mb-8 border border-violet-100`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search businesses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 ${theme.rounded} border border-violet-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent ${theme.transition} bg-violet-50/30`}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                  />
                </svg>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 ${theme.rounded} border border-violet-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent ${theme.transition} bg-violet-50/30`}
              >
                <option value="name">Sort by Name</option>
                <option value="category">Sort by Category</option>
                <option value="rating">Sort by Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Businesses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
            </div>
          ) : filteredBusinesses.length > 0 ? (
            filteredBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                <svg
                  className="w-full h-full"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <p className="text-gray-500">
                No businesses found matching your search.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const BusinessCard = ({ business }) => {
  return (
    <div
      className={`${theme.colors.card} ${theme.rounded} ${theme.shadow} p-6 border border-violet-100`}
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {business.name}
      </h3>
      <p className="text-gray-600 mb-4 line-clamp-2">{business.description}</p>

      {/* Location */}
      <div className="flex items-center text-gray-500 mb-4">
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        {business.location}
      </div>

      <div className="mt-4 flex justify-end">
        <Link
          to={`/business/${business.id}`}
          className={`px-4 py-2 ${theme.rounded} ${theme.colors.primary.gradient} text-white ${theme.transition} hover:scale-[1.02]`}
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
