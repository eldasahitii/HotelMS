import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const ReviewDashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [deletingImageId, setDeletingImageId] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [minRating, setMinRating] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [categories, setCategories] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchReviews();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("https://localhost:7117/api/ReviewCategories");
      setCategories(res.data);
    } catch {
      toast.error("Failed to load categories");
    }
  };

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

  const filteredReviews = reviews.filter((r) => {
    const matchesCategory = selectedCategory === '' || r.reviewCategoryID === parseInt(selectedCategory);
    const matchesRating = minRating === '' || r.rating >= parseInt(minRating);
    return matchesCategory && matchesRating;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    return sortOrder === 'asc'
      ? new Date(a.date) - new Date(b.date)
      : new Date(b.date) - new Date(a.date);
  });

  const pendingReviews = sortedReviews.filter((r) => !r.managerReply);
  const topReviews = sortedReviews.filter((r) => r.rating >= 4);

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: "#f2f6fc" }}>
      <main className="flex-grow-1 p-4">
        <h2 className="fw-bold text-primary mb-4">
          <i className="bi bi-chat-left-text me-2"></i> Review Management
        </h2>

        <div className="card p-3 shadow-sm">
          <h4>All Reviews</h4>

          {/* Filters */}
          <div className="mb-3 d-flex flex-wrap gap-3 justify-content-start">
            <div>
              <label className="form-label fw-semibold">Filter by Category</label>
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.reviewCategoryID} value={cat.reviewCategoryID}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label fw-semibold">Min Rating</label>
              <select
                className="form-select"
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
              >
                <option value="">All</option>
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>{r} Stars & up</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label fw-semibold">Sort by Date</label>
              <select
                className="form-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>

          {/* All Reviews Table */}
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
                {sortedReviews.map((review) => (
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
                        {review.images?.map((img) => (
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
  <div className="d-flex flex-wrap gap-2">
    <button
      className="btn btn-sm btn-outline-primary px-3"
      onClick={() => {
        setSelectedReview(review);
        setShowModal(true);
      }}
    >
      <i className="bi bi-eye me-1"></i> View
    </button>
    <button
      className="btn btn-sm btn-outline-danger px-3"
      onClick={() => handleDeleteReview(review.reviewID)}
    >
      <i className="bi bi-trash me-1"></i> Delete
    </button>
  </div>
</td>


                  </tr>
                ))}
                {sortedReviews.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center text-muted">No reviews found.</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pending Replies Table */}
            <h5 className="mt-5 fw-bold text-danger">Pending Replies</h5>
            <table className="table table-bordered table-hover mt-3">
              <thead className="table-danger">
                <tr>
                  <th>User</th>
                  <th>Category</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Reply</th>
                </tr>
              </thead>
              <tbody>
                {pendingReviews.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">No pending replies.</td>
                  </tr>
                ) : (
                  pendingReviews.map((review) => (
                    <tr key={review.reviewID}>
                      <td>{review.user?.firstName} {review.user?.lastName}</td>
                      <td>{review.category?.categoryName}</td>
                      <td>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <i key={star} className={`bi ${review.rating >= star ? "bi-star-fill" : "bi-star"} text-warning`} />
                        ))}
                      </td>
                      <td>{review.comment}</td>
                      <td>
                        <button
                          className="btn btn-outline-success btn-sm"
                          onClick={() => setSelectedReviewId(review.reviewID)}
                        >
                          Reply
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Top Reviews Table */}
            <h5 className="mt-5 fw-bold text-success">Top Reviews (4★ and 5★)</h5>
            <table className="table table-bordered table-hover mt-3">
              <thead className="table-success">
                <tr>
                  <th>User</th>
                  <th>Category</th>
                  <th>Rating</th>
                  <th>Comment</th>
                </tr>
              </thead>
              <tbody>
                {topReviews.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">No top reviews.</td>
                  </tr>
                ) : (
                  topReviews.map((r) => (
                    <tr key={r.reviewID}>
                      <td>{r.user?.firstName} {r.user?.lastName}</td>
                      <td>{r.category?.categoryName}</td>
                      <td>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <i key={star} className={`bi ${r.rating >= star ? "bi-star-fill" : "bi-star"} text-warning`} />
                        ))}
                      </td>
                      <td>{r.comment}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
       {/* Modal for viewing details */}
{selectedReview && (
  <div className={`modal fade ${showModal ? "show d-block" : ""}`} tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Review Details</h5>
          <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
        </div>
        <div className="modal-body">
          <p><strong>User:</strong> {selectedReview.user?.firstName} {selectedReview.user?.lastName}</p>
          <p><strong>Category:</strong> {selectedReview.category?.categoryName}</p>
          <p><strong>Rating:</strong>
            {[1, 2, 3, 4, 5].map((star) => (
              <i key={star} className={`bi ${selectedReview.rating >= star ? "bi-star-fill" : "bi-star"} text-warning me-1`} />
            ))}
          </p>
          <p><strong>Comment:</strong> {selectedReview.comment}</p>

          {selectedReview.images && selectedReview.images.length > 0 && (
            <>
              <strong>Images:</strong>
              <div className="d-flex flex-wrap gap-2 mt-2">
                {selectedReview.images.map((img) => (
                  <img key={img.reviewImageID} src={img.imageUrl} alt="Review" className="img-thumbnail" style={{ width: "100px", height: "100px", objectFit: "cover" }} />
                ))}
              </div>
            </>
          )}

          {selectedReview.managerReply && (
            <div className="mt-3">
              <strong>Manager Reply:</strong>
              <p>{selectedReview.managerReply}</p>
              <small className="text-muted">{new Date(selectedReview.replyDate).toLocaleDateString()}</small>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
        </div>
      </div>
    </div>
  </div>
)}

      </main>
    </div>
  );
};

export default ReviewDashboard;





