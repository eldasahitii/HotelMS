import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import imageOwner from '../Assets/images/oi.jpg';
import imageRoom from '../Assets/images/room.png';
import imageSpa from '../Assets/images/spa.png';
import imageRestaurant from '../Assets/images/restaurant.png';
import heroImage from '../Assets/images/bak1.png';

export default function AboutUs() {
  const [userId, setUserId] = useState(null);
  const [roleId, setRoleId] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({ comment: '', rating: 0, reviewCategoryID: '' });
  const [categories, setCategories] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [editBase64Image, setEditBase64Image] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minRating, setMinRating] = useState('');
  const [searchText, setSearchText] = useState('');

  



  useEffect(() => {
    fetchReviews();
    fetchCategories();
    fetchRole();
  }, []);


const fetchRole = async () => {
  try {
    const res = await axios.get("/api/Auth/me", { withCredentials: true });
    const fetchedUserId = res.data.userID || res.data.userId;
    const fetchedRoleId = res.data.roleID || res.data.roleId;

    if (!fetchedUserId) {
      return; 
    }

    setUserId(parseInt(fetchedUserId));
    setRoleId(parseInt(fetchedRoleId));
  } catch (err) {
  if (err.response?.status === 401) {
    setUserId(null);
    setRoleId(null);
   
  } else {
    if (process.env.NODE_ENV === "development") {
      console.error("Unexpected error:", err);
    }
  }
}

};







const fetchReviews = async () => {
  try {
    const res = await axios.get("/api/Reviews/GetAll", {
      withCredentials: true,
    });
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
        reviewCategoryID: parseInt(formData.reviewCategoryID),
        base64Image: base64Image
      }, { withCredentials: true });

      fetchReviews();
      setFormData({ comment: '', rating: 0, reviewCategoryID: '' });
      setBase64Image(null);
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result.split(',')[1]);
      };
      reader.readAsDataURL(file);
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
        rating: editingReview.rating,
        base64Image: editBase64Image
      }, { withCredentials: true });

      setEditingReview(null);
      fetchReviews();
    } catch (err) {
      console.error("Error updating review:", err);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      await axios.delete(`/api/reviews/deleteimage/${imageId}`, { withCredentials: true });
      fetchReviews();
    } catch (err) {
      console.error("Error deleting image:", err);
    }
  };

  const filteredReviews = reviews.filter((review) => {
  const matchesCategory = selectedCategory === '' || review.reviewCategoryID === parseInt(selectedCategory);
  const matchesRating = minRating === '' || review.rating >= parseInt(minRating);
  const matchesSearch = searchText === '' || review.comment.toLowerCase().includes(searchText.toLowerCase());
  return matchesCategory && matchesRating && matchesSearch;
});

  return (
   <div style={{ fontFamily: "'Crimson Text', serif" }}>
      {/* Hero Section */}
  <div style={{
  minHeight: '600px',
  backgroundImage: `url(${heroImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: '140px',   
  paddingBottom: '80px',  
  color: 'black',
  fontFamily: "'Crimson Text', serif"
}}>

  <div className="text-center">
<h1 style={{
  fontSize: '60px',
  fontWeight: '400',
  marginBottom: '1rem',
  color: 'black'
}}>
  Meet the Heart Behind Amé
</h1>

    <p style={{
      fontSize: '1.25rem',
      fontWeight: '300',
      fontStyle: 'italic',
      marginBottom: '1.5rem'
    }}>
      Discover the story of elegance, comfort, and tradition.
    </p>
    <button
      className="btn btn-outline-light"
      onClick={() => document.getElementById("aboutDetails").scrollIntoView({ behavior: "smooth" })}
    >
      Learn More
    </button>
  </div>
</div>

      {/* About & Services Section */}
      <div className="container py-4" style={{ fontFamily: "'Playfair Display', serif" }}>
        {/* Founder Section */}
       <div className="rounded shadow p-3 my-3" id="aboutDetails" style={{ maxWidth: '95%', margin: '2rem auto' }}>

         <div className="row align-items-center bg-white bg-opacity-75 rounded p-2">

            <div className="col-md-5 mb-3 mb-md-0">
              <img src={imageOwner} alt="Hotel Owner" className="img-fluid rounded shadow-sm" />
            </div>
           <div className="col-md-7" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>

          <h2 className="fw-bold mb-3">Meet Our Founder</h2>
<p>
  Mr. Arben Totani, the visionary behind Hotel ROLVE, is a name synonymous with elegance, authenticity, and timeless hospitality. 
  With over two decades of experience in the international luxury hotel industry, Mr. Totani set out to create more than just a place to stay — 
  he envisioned a sanctuary where warmth, art, and architectural finesse converge to redefine comfort.
</p>
<p>
  Inspired by European classics and Mediterranean charm, every detail of Hotel ROLVE reflects his passion for craftsmanship and storytelling. 
  From hand-carved furniture sourced from local artisans to custom fabrics and scent-curated rooms, each space has been thoughtfully designed 
  to evoke a sense of belonging and wonder.
</p>
<p>
  A strong believer in people over profit, Mr. Totani has always placed human connection at the core of hospitality. 
  His leadership philosophy empowers the staff to treat every guest not as a customer, but as an honored guest of the house — 
  and that philosophy radiates through every smile and gesture you’ll encounter at ROLVE.
</p>
<p className="fst-italic">
  “Every guest carries a story, and it’s our privilege to make that story even more beautiful while they’re here.” — Mr. Totani
</p>
<p>
  Today, his legacy lives through the soul of the hotel — not only in its design but in the energy, care, and elevated experience that 
  greets everyone who walks through our doors. Mr. Totani continues to oversee ROLVE with the same dedication and love that started it all, 
  ensuring that excellence remains not just a standard, but a tradition.
</p>

            </div>
          </div>
        </div>

        {/* Room Types */}
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

        {/* Services */}
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

      {/* Description */}
<div className="bg-white shadow rounded p-4 mb-5">
  <h2 className="fw-bold mb-3">About Us</h2>
  <p>
    Welcome to <strong>Hotel ROLVE</strong>, where timeless elegance meets modern comfort. Nestled in the heart of the city, 
    our hotel is a sanctuary for travelers seeking a blend of sophistication, luxury, and personalized service. Whether you're 
    joining us for a relaxing retreat, a romantic getaway, or a productive business trip, we are dedicated to making your stay exceptional.
  </p>
  <p>
    From the moment you walk through our doors, you'll be greeted with warm hospitality, refined surroundings, and attention to detail. 
    Each of our rooms and suites is thoughtfully designed to offer a harmonious balance of comfort and style, featuring plush bedding, 
    elegant furnishings, and modern amenities to ensure a restful experience.
  </p>
  <p>
    Indulge in a rejuvenating session at our full-service spa, enjoy gourmet cuisine at our signature restaurant, or unwind by the poolside lounge. 
    Our dedicated team is available 24/7 to meet your every need—whether it's arranging transportation, customizing your in-room experience, 
    or helping plan memorable city excursions.
  </p>
  <p>
    At Hotel ROLVE, we believe that true luxury lies in the small things—personalized welcomes, hand-crafted décor, and genuine care. 
    Our story is built on passion, tradition, and an unwavering commitment to excellence. Come and experience a stay that feels like home, 
    elevated with elegance.
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

      <div className="mb-3">
        <label className="form-label">Upload Image (optional)</label>
        <input
          type="file"
          accept="image/*"
          className="form-control"
          onChange={handleImageChange}
        />
      </div>

      {base64Image && (
        <div className="mb-3 text-center">
          <p className="text-muted small mb-2">Image preview:</p>
          <img
            src={`data:image/jpeg;base64,${base64Image}`}
            alt="Preview"
            className="img-thumbnail mb-3"
            style={{ width: "100%", maxHeight: "140px", objectFit: "cover", borderRadius: "8px" }}
          />
        </div>
      )}

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

  {/* ✅ Filter UI Section */}
  <div className="bg-light p-3 rounded mb-4">
    <h5 className="fw-bold">Filter Reviews</h5>
    <div className="row g-3 mt-2">
      <div className="col-md-4">
        <label className="form-label">Category</label>
        <select
          className="form-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c.reviewCategoryID} value={c.reviewCategoryID}>
              {c.categoryName}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-4">
        <label className="form-label">Minimum Rating</label>
        <select
          className="form-select"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
        >
          <option value="">Any</option>
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>{r} & up</option>
          ))}
        </select>
      </div>

      <div className="col-md-4">
        <label className="form-label">Search Comment</label>
        <input
          type="text"
          className="form-control"
          placeholder="e.g. excellent"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
    </div>
  </div>

  <p className="text-muted mb-4">
    Showing {filteredReviews.length} of {reviews.length} reviews
  </p>

  {/* ✅ Review Cards */}
  <div className="row g-4">
    {filteredReviews.map((review) => (
      <div className="col-md-6" key={review.reviewID}>
        <div className="card shadow-sm border">
          <div className="card-body d-flex">
            {review.images && review.images.length > 0 && (
              <img
                src={review.images[0].imageUrl}
                alt="Review"
                className="img-thumbnail me-3"
                style={{
                  height: "100px",
                  width: "100px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            )}
            <div className="flex-grow-1">
              <h5 className="card-title">{review.user?.firstName} {review.user?.lastName}</h5>
              <h6 className="card-subtitle mb-2 text-muted">{review.category?.categoryName}</h6>

              {editingReview?.reviewID === review.reviewID ? (
                <form onSubmit={handleEditSubmit}>
                  {review.images && review.images.length > 0 && (
                    <div className="mb-3">
                      <div className="position-relative d-inline-block">
                        <img
                          src={review.images[0].imageUrl}
                          alt="Review"
                          className="img-thumbnail"
                          style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
                        />
                        <button
                          type="button"
                          className="btn btn-sm btn-danger position-absolute top-0 end-0"
                          onClick={() => handleDeleteImage(review.images[0].reviewImageID)}
                          style={{ borderRadius: "50%", padding: "0.3rem 0.5rem" }}
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </div>
                    </div>
                  )}

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
                  <div className="d-flex gap-2 mb-2">
                    <button type="submit" className="btn btn-success btn-sm px-3">Save</button>
                    <button type="button" className="btn btn-secondary btn-sm px-3" onClick={() => setEditingReview(null)}>Cancel</button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm px-3"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this review?")) {
                          handleDelete(editingReview.reviewID);
                          setEditingReview(null);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <p className="card-text">{review.comment}</p>
                  <div className="d-flex align-items-center mb-2">
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

              {review.managerReply && (
                <div className="mt-2 border-start ps-3">
                  <strong>Manager Reply:</strong>
                  <p className="mb-1">{review.managerReply}</p>
                  <small className="text-muted">{new Date(review.replyDate).toLocaleDateString()}</small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
</div>
</div>
  );
}