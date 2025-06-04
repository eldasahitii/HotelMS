import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ReviewDashboard = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [error, setError] = useState("");
  const [deletingImageId, setDeletingImageId] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get("/api/Reviews/GetAll", { withCredentials: true });
      setReviews(res.data);
    } catch (err) {
      setError("Failed to load reviews.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await axios.delete(`/api/Reviews/${id}`, { withCredentials: true });
      fetchReviews();
    } catch (err) {
      setError("Failed to delete review.");
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      setDeletingImageId(imageId);
      await axios.delete(`/api/reviews/deleteimage/${imageId}`, { withCredentials: true });
      fetchReviews();
    } catch (err) {
      setError("Failed to delete image.");
    } finally {
      setDeletingImageId(null);
    }
  };

  const submitReply = async () => {
    if (!selectedReviewId || !replyText.trim()) return;
    try {
      await axios.put(`/api/reviews/reply/${selectedReviewId}`,
        JSON.stringify({ replyText }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        });
      setReplyText('');
      setSelectedReviewId(null);
      fetchReviews();
    } catch (err) {
      setError("Failed to submit reply.");
    }
  };

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: "#f2f6fc" }}>
      <main className="flex-grow-1 p-4">
        <h2 className="fw-bold text-primary mb-4">
          <i className="bi bi-chat-left-text me-2"></i> Review Management
        </h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row g-4">
          {reviews.map((review) => (
            <div className="col-md-6" key={review.reviewID}>
              <div className="card shadow-sm border">
                <div className="card-body">

                  {/* Review Images with Delete Option */}
                  {review.images && review.images.length > 0 && (
                    <div className="mb-3 d-flex align-items-start gap-2 flex-wrap">
                      {review.images.map((img) => (
                        <div key={img.reviewImageID} className="position-relative">
                          <img
                            src={img.imageUrl}
                            alt="Review"
                            className="img-thumbnail"
                            style={{
                              height: "100px",
                              width: "100px",
                              objectFit: "cover",
                              borderRadius: "10px"
                            }}
                          />
                          <button
                            className="btn btn-sm btn-danger position-absolute top-0 end-0"
                            onClick={() => handleDeleteImage(img.reviewImageID)}
                            disabled={deletingImageId === img.reviewImageID}
                            style={{ borderRadius: "50%", padding: "0.3rem 0.5rem" }}
                          >
                            <i className="bi bi-x-lg"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <h5>{review.user?.firstName} {review.user?.lastName}</h5>
                  <h6 className="text-muted">{review.category?.categoryName}</h6>
                  <p>{review.comment}</p>

                  <div className="mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i
                        key={star}
                        className={`bi ${review.rating >= star ? "bi-star-fill" : "bi-star"} text-warning me-1`}
                      />
                    ))}
                  </div>

                  {/* Reply Section */}
                  {review.managerReply ? (
                    <div className="border-start ps-3 mt-3">
                      <strong>Manager Reply:</strong>
                      <p className="mb-1">{review.managerReply}</p>
                      <small className="text-muted">{new Date(review.replyDate).toLocaleDateString()}</small>
                    </div>
                  ) : (
                    selectedReviewId === review.reviewID ? (
                      <>
                        <textarea
                          className="form-control my-2"
                          rows="2"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />
                        <div className="d-flex gap-2 mb-2">
                          <button className="btn btn-success px-4 py-2 rounded" onClick={submitReply}>Submit</button>
                          <button className="btn btn-secondary px-4 py-2 rounded" onClick={() => setSelectedReviewId(null)}>Cancel</button>
                        </div>
                      </>
                    ) : (
                      <button className="btn btn-outline-success px-4 py-2 rounded me-2" onClick={() => setSelectedReviewId(review.reviewID)}>
                        Reply
                      </button>
                    )
                  )}

                  {/* Delete Review Button */}
                  <button
                    className="btn btn-outline-danger px-4 py-2 rounded"
                    onClick={() => handleDelete(review.reviewID)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ReviewDashboard;

