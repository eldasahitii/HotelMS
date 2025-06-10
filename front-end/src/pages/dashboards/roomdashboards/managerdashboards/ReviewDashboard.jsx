import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const ReviewDashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [deletingImageId, setDeletingImageId] = useState(null);


  useEffect(() => {
    fetchReviews();
  }, []);



  const fetchReviews = async () => {
    try {
      const res = await axios.get("/api/Reviews/GetAll", { withCredentials: true });
      setReviews(res.data);
    } catch {
      toast.error("Failed to load reviews.");
    }
  };

  const handleDeleteReview = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the review.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/Reviews/${id}`, { withCredentials: true });
        toast.success("Review deleted.");
        fetchReviews();
      } catch {
        toast.error("Failed to delete review.");
      }
    }
  };

  const handleDeleteImage = async (imageId) => {
    const result = await Swal.fire({
      title: "Delete image?",
      text: "This image will be removed from the review.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        setDeletingImageId(imageId);
        await axios.delete(`/api/reviews/deleteimage/${imageId}`, { withCredentials: true });
        fetchReviews();
        toast.success("Image deleted.");
      } catch {
        toast.error("Failed to delete image.");
      } finally {
        setDeletingImageId(null);
      }
    }
  };

  const submitReply = async () => {
    if (!selectedReviewId || !replyText.trim()) return;
    try {
      await axios.put(
        `/api/reviews/reply/${selectedReviewId}`,
        JSON.stringify({ replyText }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      toast.success("Reply submitted.");
      setReplyText("");
      setSelectedReviewId(null);
      fetchReviews();
    } catch {
      toast.error("Failed to submit reply.");
    }
  };


  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: "#f2f6fc" }}>
      <main className="flex-grow-1 p-4">
        <h2 className="fw-bold text-primary mb-4">
          <i className="bi bi-chat-left-text me-2"></i> Review Management
        </h2>

        <div className="card p-3 shadow-sm">
          <h4>All Reviews</h4>
          <div className="table-responsive">
            <table className="table table-striped table-hover mt-3">
              <thead className="table-primary">
                <tr>
                  <th>User</th>
                  <th>Category</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Images</th>
                  <th>Reply</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
              

                  <tr key={review.reviewID}>
                    <td>{review.user?.firstName} {review.user?.lastName}</td>
                    <td>{review.category?.categoryName}</td>
                    <td>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i
                          key={star}
                          className={`bi ${review.rating >= star ? "bi-star-fill" : "bi-star"} text-warning`}
                        />
                      ))}
                    </td>
                    <td>{review.comment}</td>
                    <td>
                      <div className="d-flex flex-wrap gap-2">
                        {review.images && review.images.map((img) => (
                          <div key={img.reviewImageID} className="position-relative">
                            <img
                              src={img.imageUrl}
                              alt="Review"
                              className="img-thumbnail"
                              style={{
                                width: "70px",
                                height: "70px",
                                objectFit: "cover",
                                borderRadius: "6px",
                              }}
                            />
                            <button
                              className="btn btn-sm btn-danger position-absolute top-0 end-0"
                              onClick={() => handleDeleteImage(img.reviewImageID)}
                              disabled={deletingImageId === img.reviewImageID}
                              style={{ borderRadius: "50%", padding: "0.25rem 0.4rem" }}
                            >
                              <i className="bi bi-x-lg"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td>
                      {review.managerReply ? (
                        <>
                          <p className="mb-1"><strong>{review.managerReply}</strong></p>
                          <small className="text-muted">{new Date(review.replyDate).toLocaleDateString()}</small>
                        </>
                      ) : selectedReviewId === review.reviewID ? (
                        <>
                          <textarea
                            className="form-control mb-2"
                            rows="2"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                          />
                          <div className="d-flex gap-2">
                            <button className="btn btn-success btn-sm" onClick={submitReply}>
                              Submit
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => setSelectedReviewId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <button
                          className="btn btn-outline-success btn-sm"
                          onClick={() => setSelectedReviewId(review.reviewID)}
                        >
                          Reply
                        </button>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDeleteReview(review.reviewID)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {reviews.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center text-muted">No reviews found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReviewDashboard;





