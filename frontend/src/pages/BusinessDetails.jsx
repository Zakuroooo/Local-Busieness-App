import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import theme from "../styles/theme";

const BusinessDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchBusinessDetails(), fetchReviews()]);
    };
    loadData();
  }, [id]);

  const fetchBusinessDetails = async () => {
    try {
      const response = await axios.get(
        `https://local-busieness-app.onrender.com/api/businesses/${id}`
      );
      setBusiness(response.data);
    } catch (error) {
      console.error("Error fetching business details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `https://local-busieness-app.onrender.com/api/reviews/${id}`
      );
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://local-busieness-app.onrender.com/api/reviews/${id}`,
        newReview,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNewReview({ rating: 5, comment: "" });
      fetchReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: business.name,
          text: business.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You might want to add a toast notification here
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen ${theme.colors.background} flex items-center justify-center`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!business) {
    return (
      <div
        className={`min-h-screen ${theme.colors.background} flex items-center justify-center`}
      >
        <div
          className={`${theme.colors.card} ${theme.rounded} ${theme.shadow} p-8 text-center`}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Business Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The business you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate(-1)}
            className={`px-6 py-3 ${theme.rounded} ${theme.colors.primary.gradient} ${theme.colors.primary.hover} text-white ${theme.transition} hover:scale-[1.02]`}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${theme.colors.background} px-4 sm:px-6 py-6`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back Button */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className={`group flex items-center gap-2 px-4 py-2 ${theme.rounded} border border-violet-200 hover:border-violet-300 ${theme.transition} bg-white/80 hover:bg-white`}
          >
            <svg
              className="w-5 h-5 text-violet-600 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="text-gray-700">Back to Directory</span>
          </button>
        </div>

        {/* Business Information */}
        <div
          className={`${theme.colors.card} ${theme.rounded} ${theme.shadow} p-6 border border-violet-100`}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {business.name}
          </h1>
          <p className="text-gray-600 mb-6">{business.description}</p>

          {/* Location Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg
                className="w-6 h-6 text-violet-600"
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
              Location Details
            </h2>
            <div
              className={`p-4 ${theme.rounded} bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 space-y-3`}
            >
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Address
                </label>
                <p className="text-gray-900 mt-1">{business.address}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  City/Area
                </label>
                <p className="text-gray-900 mt-1">{business.location}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Category
                </label>
                <p className="text-gray-900 mt-1">
                  {business.category?.name || "Uncategorized"}
                </p>
              </div>
              {business.website && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Website
                  </label>
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-gray-900 mt-1 hover:text-violet-600 transition-colors"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div
          className={`${theme.colors.card} ${theme.rounded} ${theme.shadow} p-6 border border-violet-100`}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Reviews</h2>

          {/* Review Form */}
          <form onSubmit={handleReviewSubmit} className="mb-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setNewReview({ ...newReview, rating: star })
                      }
                      className={`text-2xl ${
                        star <= newReview.rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Review
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  className={`w-full px-4 py-3 ${theme.rounded} border border-violet-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent ${theme.transition} bg-violet-50/30`}
                  rows="3"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitLoading}
                className={`px-6 py-2 ${theme.rounded} ${
                  theme.colors.primary.gradient
                } text-white ${theme.transition} ${theme.hover} ${
                  submitLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {submitLoading ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="border-b border-gray-200 last:border-0 pb-6 last:pb-0"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex text-yellow-400 mb-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">
                      {review.user?.name || "Anonymous"}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}

            {reviews.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                No reviews yet. Be the first to review this business!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetails;
