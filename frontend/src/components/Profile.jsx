import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

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
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to load profile");
      setLoading(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>No profile data available</div>;

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium">Name</label>
          <p className="text-gray-900">{profile.name}</p>
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Email</label>
          <p className="text-gray-900">{profile.email}</p>
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Role</label>
          <p className="text-gray-900">{profile.role}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
