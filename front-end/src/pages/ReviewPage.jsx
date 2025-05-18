import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ comment: '', rating: 0, reviewCategoryID: '' });
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    fetchReviews();
    fetchCategories();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get("https://localhost:7117/api/Reviews/GetAll");
      setReviews(res.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("https://localhost:7117/api/reviewcategories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("https://localhost:7117/api/Reviews", {
        comment: formData.comment,
        rating: formData.rating,
        reviewCategoryID: parseInt(formData.reviewCategoryID)
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchReviews();
      setFormData({ comment: '', rating: 0, reviewCategoryID: '' });
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://localhost:7117/api/Reviews/${id}`);
      fetchReviews();
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.put("https://localhost:7117/api/reviews/updatereview", {
        reviewID: editingReview.reviewID,
        comment: editingReview.comment,
        rating: editingReview.rating
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEditingReview(null);
      fetchReviews();
    } catch (err) {
      console.error("Error updating review:", err);
    }
  };

  return (
    <div style={{ backgroundColor: '#fff7e6', minHeight: '100vh' }}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container-fluid px-4">
          <a className="navbar-brand fw-bold" href="#">Hotel Name</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/reviews">Reviews</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/signup">Sign Up</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: '100px' }}>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="bg-white p-4 rounded shadow">
              <h2 className="fw-bold mb-4 text-center">Leave a Review</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="category" className="form-label">Category</label>
                  <select
                    className="form-select"
                    id="category"
                    value={formData.reviewCategoryID}
                    onChange={(e) => setFormData({ ...formData, reviewCategoryID: e.target.value })}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.reviewCategoryID} value={cat.reviewCategoryID}>{cat.categoryName}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="comment" className="form-label">Comment</label>
                  <textarea
                    className="form-control"
                    id="comment"
                    rows="3"
                    placeholder="Share your experience..."
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    required
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="form-label d-block">Rating</label>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className={`bi ${formData.rating >= star ? "bi-star-fill" : "bi-star"} text-warning me-1`}
                      style={{ cursor: "pointer" }}
                      onClick={() => setFormData({ ...formData, rating: star })}
                    ></i>
                  ))}
                </div>
                <button type="submit" className="btn btn-dark w-100">Submit Review</button>
              </form>
            </div>

            <h3 className="my-4">All Reviews</h3>
            {reviews.map((review) => (
              <div className="card mb-3" key={review.reviewID}>
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <h5 className="card-title">
                      {review.user?.firstName} {review.user?.lastName} —
                      <span className="text-muted fs-6 ms-2">{review.category?.categoryName}</span>
                    </h5>
                    <div>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <i
                          key={s}
                          className={`bi ${review.rating >= s ? "bi-star-fill" : "bi-star"} text-warning me-1`}
                        ></i>
                      ))}
                    </div>
                  </div>
                  {editingReview?.reviewID === review.reviewID ? (
                    <form onSubmit={handleEditSubmit}>
                      <textarea
                        className="form-control mb-2"
                        value={editingReview.comment}
                        onChange={(e) => setEditingReview({ ...editingReview, comment: e.target.value })}
                      />
                      <div className="mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <i
                            key={star}
                            className={`bi ${editingReview.rating >= star ? "bi-star-fill" : "bi-star"} text-warning me-1`}
                            style={{ cursor: "pointer" }}
                            onClick={() => setEditingReview({ ...editingReview, rating: star })}
                          ></i>
                        ))}
                      </div>
                      <button type="submit" className="btn btn-sm btn-success me-2">Save</button>
                      <button type="button" className="btn btn-sm btn-secondary" onClick={() => setEditingReview(null)}>Cancel</button>
                    </form>
                  ) : (
                    <>
                      <p className="card-text">{review.comment}</p>
                      <p className="text-muted small mb-2">{new Date(review.date).toLocaleDateString()}</p>
                      <button onClick={() => setEditingReview(review)} className="btn btn-sm btn-outline-primary me-2">Edit</button>
                      <button onClick={() => handleDelete(review.reviewID)} className="btn btn-sm btn-outline-danger">Delete</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
