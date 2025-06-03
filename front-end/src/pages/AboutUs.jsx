import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import imageOwner from '../Assets/images/owner.png';
import imageRoom from '../Assets/images/room.png';
import imageSpa from '../Assets/images/spa.png';
import imageRestaurant from '../Assets/images/restaurant.png';

export default function AboutUs() {
  const [userId, setUserId] = useState(null);
  const [roleId, setRoleId] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({ comment: '', rating: 0, reviewCategoryID: '' });
  const [categories, setCategories] = useState([]);
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    fetchReviews();
    fetchCategories();
    fetchRole();
  }, []);

  const fetchRole = async () => {
    try {
      const res = await axios.get("/api/Auth/me", { withCredentials: true });
      const fetchedRoleId = parseInt(res.data.roleID || res.data.roleId);
      const fetchedUserId = parseInt(res.data.userID || res.data.userId);
      setRoleId(fetchedRoleId);
      setUserId(fetchedUserId);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setRoleId(null);
        setUserId(null);
      }
    }
  };

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
    try {
      await axios.post("/api/Reviews", {
        comment: formData.comment,
        rating: formData.rating,
        reviewCategoryID: parseInt(formData.reviewCategoryID)
      }, { withCredentials: true });
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
    try {
      await axios.put("/api/Reviews/updatereview", {
        reviewID: editingReview.reviewID,
        comment: editingReview.comment,
        rating: editingReview.rating
      }, { withCredentials: true });
      setEditingReview(null);
      fetchReviews();
    } catch (err) {
      console.error("Error updating review:", err);
    }
  };

  return (
    <div className="container py-4" style={{ fontFamily: "'Playfair Display', serif" }}>
      <div className="rounded shadow p-4 my-5">
        <div className="row align-items-center bg-white bg-opacity-75 rounded p-3">
          <div className="col-md-5 mb-3 mb-md-0">
            <img src={imageOwner} alt="Hotel Owner" className="img-fluid rounded shadow-sm" />
          </div>
          <div className="col-md-7">
            <h2 className="fw-bold mb-3">Meet Our Founder</h2>
            <p>Mr. Totani, the visionary behind Hotel ROLVE...</p>
            <p>From handcrafted interiors...</p>
            <p className="fst-italic">“Every guest deserves...”</p>
            <p>Today, his commitment continues...</p>
          </div>
        </div>
      </div>

      <hr className="my-5" />
      <div className="text-center mb-4">
        <h2 className="fw-bold">Room Types</h2>
      </div>
      <div className="row text-center g-4 mb-5">
        <div className="col-md-4">
          <i className="bi bi-door-closed display-4 text-dark mb-3"></i>
          <h5>Deluxe Rooms</h5>
          <p>Spacious rooms with elegant decor and modern comforts.</p>
        </div>
        <div className="col-md-4">
          <i className="bi bi-house-check display-4 text-dark mb-3"></i>
          <h5>Suites</h5>
          <p>Our suites offer premium space, privacy, and city views.</p>
        </div>
        <div className="col-md-4">
          <i className="bi bi-people-fill display-4 text-dark mb-3"></i>
          <h5>Family Rooms</h5>
          <p>Ideal for families, with extra beds and ample space.</p>
        </div>
      </div>

      <div className="my-5">
        <h2 className="fw-bold text-center mb-4">Our Services</h2>
        <div className="row text-center g-4">
          <div className="col-md-4">
            <img src={imageSpa} alt="Spa & Wellness" className="img-fluid rounded shadow mb-3" />
            <h5>Spa & Wellness</h5>
            <p>Relax in our spa with massages, sauna, and treatments.</p>
          </div>
          <div className="col-md-4">
            <img src={imageRoom} alt="Luxurious Rooms" className="img-fluid rounded shadow mb-3" />
            <h5>Luxurious Rooms</h5>
            <p>Modern rooms with top-class amenities and comfort.</p>
          </div>
          <div className="col-md-4">
            <img src={imageRestaurant} alt="Restaurant & Pool" className="img-fluid rounded shadow mb-3" />
            <h5>Restaurant & Pool</h5>
            <p>Dine by the pool or enjoy fine cuisine in our restaurant.</p>
          </div>
        </div>

        <div className="row mt-5 text-center g-4">
          <div className="col-md-6">
            <i className="bi bi-person-check display-4 text-success mb-3"></i>
            <h5>Professional Cleaning Staff</h5>
            <p>Our team guarantees top hygiene and freshness daily.</p>
          </div>
          <div className="col-md-6">
            <i className="bi bi-gem display-4 text-primary mb-3"></i>
            <h5>Premium Guest Services</h5>
            <p>24/7 concierge, fast room service, and tailored attention.</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded p-4 mb-5">
        <h2 className="fw-bold mb-3">About Us</h2>
        <p>
      Welcome to Hotel ROLVE, where timeless elegance meets modern luxury. Nestled in the heart of the city, 
      our hotel offers an unforgettable experience for travelers seeking both comfort and style. Whether you're here 
      for a relaxing vacation, a romantic escape, or a productive business trip, our attentive team is committed 
      to making your stay exceptional.
    </p>
    <p>
      From the moment you step through our doors, you'll be greeted with warm hospitality and refined service. 
      Enjoy beautifully designed rooms with plush bedding, unwind in our tranquil spa, or savor exquisite cuisine 
      at our on-site restaurant curated by world-class chefs.
    </p>
    <p>
      At Hotel ROLVE, we believe that true luxury lies in the details—thoughtful amenities, personalized service, 
      and an environment that feels like home.
    </p>
      </div>

      {userId ? (
        <div className="bg-white shadow rounded p-4">
          <h2 className="fw-bold mb-3">Leave a Review</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Comment</label>
              <textarea
                className="form-control"
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">Rating</label><br />
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={`bi ${formData.rating >= star ? "bi-star-fill" : "bi-star"} text-warning me-1`}
                  onClick={() => setFormData({ ...formData, rating: star })}
                  style={{ cursor: "pointer" }}
                ></i>
              ))}
            </div>
            <div className="mb-3">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={formData.reviewCategoryID}
                onChange={(e) => setFormData({ ...formData, reviewCategoryID: e.target.value })}
                required
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.reviewCategoryID} value={c.reviewCategoryID}>{c.categoryName}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-dark w-100">Submit Review</button>
          </form>
        </div>
      ) : (
        <div className="alert alert-primary d-flex align-items-center p-3 rounded shadow-sm mt-4" role="alert">
          <i className="bi bi-info-circle-fill me-2 fs-4 text-primary"></i>
          <div className="fs-5">
            Please <a href="/login" className="text-decoration-underline fw-semibold">log in</a> to leave a review.
          </div>
        </div>
      )}

      <div className="mt-5">
        <h3 className="fw-bold mb-3">All Reviews</h3>
        <div className="row g-4">
          {reviews.map((review) => (
            <div className="col-md-6" key={review.reviewID}>
              <div className="card shadow-sm border">
                <div className="card-body">
                  {review.managerReply && (
                    <div className="mt-3 border-start ps-3">
                      <strong>Manager Reply:</strong>
                      <p className="mb-1">{review.managerReply}</p>
                      <small className="text-muted">{new Date(review.replyDate).toLocaleDateString()}</small>
                    </div>
                  )}

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
                        {[1, 2, 3, 4, 5].map((star) => (
                          <i key={star} className={`bi ${review.rating >= star ? "bi-star-fill" : "bi-star"} text-warning me-1`} />
                        ))}
                        {review.userID === userId && (
                          <>
                            <button className="btn btn-sm btn-outline-primary me-2" onClick={() => setEditingReview(review)}>Edit</button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(review.reviewID)}>Delete</button>
                          </>
                        )}
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
