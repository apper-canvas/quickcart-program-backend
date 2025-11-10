import React, { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import { reviewService } from "@/services/api/reviewService";

function ReviewSection({ productId, className }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError("");
      const reviewData = await reviewService.getByProductId(productId);
      setReviews(reviewData);
    } catch (err) {
      setError(err.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating, size = "w-4 h-4") => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <ApperIcon
            key={i}
            name="Star"
            className={cn(size, "fill-yellow-400 text-yellow-400")}
          />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <div key={i} className={cn("relative", size)}>
            <ApperIcon
              name="Star"
              className={cn(size, "text-gray-300 absolute")}
            />
            <ApperIcon
              name="Star"
              className={cn(size, "fill-yellow-400 text-yellow-400 absolute")}
              style={{ clipPath: "inset(0 50% 0 0)" }}
            />
          </div>
        );
      } else {
        stars.push(
          <ApperIcon
            key={i}
            name="Star"
            className={cn(size, "text-gray-300")}
          />
        );
      }
    }

    return stars;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className={cn("bg-white rounded-xl p-6 shadow-soft", className)}>
        <Loading className="h-32" />
      </div>
    );
  }

  if (error || !reviews.length) {
    return (
      <div className={cn("bg-white rounded-xl p-6 shadow-soft", className)}>
        <h3 className="text-xl font-display font-semibold text-primary mb-4">
          Customer Reviews
        </h3>
        <p className="text-gray-500 text-center py-8">
          {error || "No reviews available for this product yet."}
        </p>
      </div>
    );
  }

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const totalReviews = reviews.length;

  return (
    <div className={cn("bg-white rounded-xl p-6 shadow-soft", className)}>
      <div className="mb-6">
        <h3 className="text-xl font-display font-semibold text-primary mb-4">
          Customer Reviews
        </h3>
        
        {/* Review Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3 mb-3 sm:mb-0">
            <div className="flex items-center gap-1">
              {renderStars(averageRating, "w-5 h-5")}
            </div>
            <span className="text-2xl font-bold text-primary">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-gray-600">
              out of 5
            </span>
          </div>
          <div className="text-sm text-gray-600">
            Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="mb-8">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = reviews.filter(r => Math.floor(r.rating) === stars).length;
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            
            return (
              <div key={stars} className="flex items-center gap-3 mb-2">
                <span className="text-sm font-medium text-gray-600 w-12">
                  {stars} star
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.Id} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
              <div className="flex items-center gap-3 mb-2 sm:mb-0">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {review.customerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-medium text-primary">
                    {review.customerName}
                  </h4>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-gray-600">
                      {review.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {formatDate(review.date)}
              </span>
            </div>
            
            {review.title && (
              <h5 className="font-medium text-primary mb-2">
                {review.title}
              </h5>
            )}
            
            <p className="text-gray-700 leading-relaxed">
              {review.comment}
            </p>
            
            {review.helpful > 0 && (
              <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                <ApperIcon name="ThumbsUp" className="w-4 h-4" />
                <span>{review.helpful} people found this helpful</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewSection;