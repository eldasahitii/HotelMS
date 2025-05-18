import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Carousel from 'react-bootstrap/Carousel';

import imageRoom from '../Assets/images/hotel1.png';
import imageLobby from '../Assets/images/hotel2.png';
import imageSpa from '../Assets/images/hotel3.png';

export default function AboutUs() {
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({ comment: '', rating: 0, reviewCategoryID: '' });
  const [categories, setCategories] = useState([]);
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    fetchReviews();
    fetchCategories();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get("/api/Reviews/GetAll");
      setReviews(res.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("https://localhost:7117/api/ReviewCategories");

      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.post("/api/Reviews", {
        comment: formData.comment,
        rating: formData.rating,
        reviewCategoryID: parseInt(formData.reviewCategoryID)
      }, {
        headers: { Authorization: token }
      });
      fetchReviews();
      setFormData({ comment: '', rating: 0, reviewCategoryID: '' });
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/Reviews/${id}`);
      fetchReviews();
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.put("/api/Reviews/updatereview", {
        reviewID: editingReview.reviewID,
        comment: editingReview.comment,
        rating: editingReview.rating
      }, {
        headers: { Authorization: token }
      });
      setEditingReview(null);
      fetchReviews();
    } catch (err) {
      console.error("Error updating review:", err);
    }
  };

  return (
    <div className="container py-4" style={{ fontFamily: "'Playfair Display', serif" }}>
      <Carousel className="mb-5">
        {[imageRoom, imageLobby, imageSpa].map((img, idx) => (
          <Carousel.Item key={idx}>
            <img className="d-block w-100" src={img} alt={`Slide ${idx + 1}`} style={{ height: '450px', objectFit: 'cover' }} />
            <Carousel.Caption>
              <h3 className="fw-bold bg-dark p-2 rounded">Welcome to Our Hotel</h3>
              <p className="bg-dark p-1 rounded">Luxury, Comfort & Exceptional Service</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="bg-light p-4 rounded shadow">
            <h2 className="fw-bold mb-3">About Us</h2>
            <p>
  Welcome to Hotel ROLVE, where timeless elegance meets modern luxury. Nestled in the heart of the city, our hotel offers an unforgettable experience for travelers seeking both comfort and style. Whether you're here for a relaxing vacation, a romantic escape, or a productive business trip, our attentive team is committed to making your stay exceptional.
</p>

<p>
  From the moment you step through our doors, you'll be greeted with warm hospitality and refined service. Enjoy beautifully designed rooms with plush bedding, unwind in our tranquil spa, or savor exquisite cuisine at our on-site restaurant curated by world-class chefs.
</p>

<p>
  At Hotel ROLVE, we believe that true luxury lies in the details— thoughtful amenities, personalized service, and an environment that feels like home.  </p>

          </div>
        </div>

        <div className="col-md-6">
          <div className="bg-white p-4 rounded shadow border">
            <h3 className="fw-bold mb-3">Leave a Review</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Comment</label>
                <textarea
                  className="form-control"
                  value={formData.comment}
                  onChange={e => setFormData({ ...formData, comment: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Rating</label><br />
                {[1, 2, 3, 4, 5].map(star => (
                  <i
                    key={star}
                    className={`bi ${formData.rating >= star ? "bi-star-fill" : "bi-star"} text-warning me-1`}
                    onClick={() => setFormData({ ...formData, rating: star })}
                    style={{ cursor: "pointer" }}
                  />
                ))}
              </div>
              <div className="mb-3">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={formData.reviewCategoryID}
                  onChange={e => setFormData({ ...formData, reviewCategoryID: e.target.value })}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(c => (
                    <option key={c.reviewCategoryID} value={c.reviewCategoryID}>{c.categoryName}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-dark w-100">Submit Review</button>
            </form>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <h3 className="fw-bold mb-3">All Reviews</h3>
        <div className="row g-4">
          {reviews.map(review => (
            <div className="col-md-6" key={review.reviewID}>
              <div className="card shadow-sm border">
                <div className="card-body">
                  <h5 className="card-title">{review.user?.firstName} {review.user?.lastName}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{review.category?.categoryName}</h6>
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
                      <div className="d-flex align-items-center">
                        {[1, 2, 3, 4, 5].map(star => (
                          <i
                            key={star}
                            className={`bi ${review.rating >= star ? "bi-star-fill" : "bi-star"} text-warning me-1`}
                          />
                        ))}
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => setEditingReview(review)}>Edit</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(review.reviewID)}>Delete</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}