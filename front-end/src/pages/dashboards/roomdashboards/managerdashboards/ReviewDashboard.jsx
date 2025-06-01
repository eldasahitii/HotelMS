import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ReviewDashboard = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [error, setError] = useState("");

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
  
      {/* <aside
        className="text-white p-4"
        style={{ width: "240px", backgroundColor: "#324b6b" }}
      >
        <h4 className="fw-bold mb-4">
          <i className="bi bi-building"></i> HotelMS
        </h4>
        <ul className="nav flex-column">
          <button
            className="btn btn-outline-light w-100 mb-3"
         onClick={() => navigate("/manager/room-dashboard")}


          >
            <i className="bi bi-building me-2"></i> Room Manager Dashboard
          </button>

          <button
            className="btn btn-outline-light w-100"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            <i className="bi bi-box-arrow-right me-2"></i> Logout
          </button>
        </ul>
      </aside> */}

      {/* Main Content */}
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
                        <button className="btn btn-success btn-sm me-2" onClick={submitReply}>Submit</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setSelectedReviewId(null)}>Cancel</button>
                      </>
                    ) : (
                      <button className="btn btn-outline-success btn-sm me-2" onClick={() => setSelectedReviewId(review.reviewID)}>
                        Reply
                      </button>
                    )
                  )}

                  <button
                    className="btn btn-outline-danger btn-sm mt-2"
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
