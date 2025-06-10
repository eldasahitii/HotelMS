import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const BASE_URL = "https://localhost:7117/api/HotelServiceCards";

const AdminServiceCardsDashboard = () => {
  const [cards, setCards] = useState([]);
  const [formData, setFormData] = useState({
    id: 0,
    cardTitle: "",
    cardDescription: "",
    cardImage: "",
    cardLink: "",  // Added cardLink here
  });
  const [imagePreview, setImagePreview] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/all`);
      setCards(res.data);
    } catch (err) {
      toast.error("Failed to load service cards.");
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      setFormData((prev) => ({ ...prev, cardImage: base64 }));
      setImagePreview(base64);
    } catch (error) {
      toast.error("Failed to read image file.");
    }
  };

  const resetForm = () => {
    setFormData({
      id: 0,
      cardTitle: "",
      cardDescription: "",
      cardImage: "",
      cardLink: "",  // Reset cardLink as well
    });
    setImagePreview("");
    setIsEditing(false);
  };

  const handleAddCard = async () => {
    const { cardTitle, cardDescription, cardImage, cardLink } = formData;
    if (!cardTitle || !cardDescription || !cardImage) {
      toast.error("Please fill all fields and select an image.");
      return;
    }
    try {
      console.log("Adding card with data:", formData);
      await axios.post(BASE_URL, {
        cardTitle,
        cardDescription,
        cardImage,
        cardLink: cardLink || "", // Make sure to send cardLink, empty if not set
      });
      toast.success("Service card added successfully!");
      resetForm();
      loadCards();
    } catch (error) {
      toast.error("Failed to add service card.");
      console.error("Add service card error:", error.response || error);
    }
  };

  const handleEditClick = (card) => {
    setFormData({
      id: card.id,
      cardTitle: card.cardTitle || "",
      cardDescription: card.cardDescription || "",
      cardImage: card.cardImage || "",
      cardLink: card.cardLink || "", // Add cardLink here
    });
    setImagePreview(
      card.cardImage?.startsWith("data:image")
        ? card.cardImage
        : card.cardImage?.includes(".")
        ? `https://localhost:7117/Images/Services/${card.cardImage}`
        : `data:image/jpeg;base64,${card.cardImage}`
    );
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdateCard = async () => {
    const { id, cardTitle, cardDescription, cardImage, cardLink } = formData;
    if (!cardTitle || !cardDescription || !cardImage) {
      toast.error("Please fill all fields and select an image.");
      return;
    }
    try {
      await axios.put(`${BASE_URL}/${id}/card-data`, {
        cardTitle,
        cardDescription,
        cardImage,
        cardLink: cardLink || "",
      });
      toast.success("Service card updated successfully!");
      resetForm();
      loadCards();
    } catch (error) {
      toast.error("Failed to update service card.");
      console.error("Update service card error:", error.response || error);
    }
  };

  const handleDeleteCard = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the service card.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${BASE_URL}/${id}`);
        toast.success("Service card deleted successfully.");
        loadCards();
      } catch (error) {
        toast.error("Failed to delete service card.");
        console.error(error);
      }
    }
  };

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: "#f2f6fc" }}>
      <main className="flex-grow-1 p-4">
        <h2 className="fw-bold text-primary mb-4">Admin Service Cards Management</h2>

        <div className="card p-3 mb-4 shadow-sm" style={{ maxWidth: "600px" }}>
          <h4>{isEditing ? "Edit Service Card" : "Add New Service Card"}</h4>

          <div className="mb-3">
            <label className="form-label">Card Title</label>
            <input
              type="text"
              className="form-control"
              name="cardTitle"
              value={formData.cardTitle}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Card Description</label>
            <textarea
              className="form-control"
              name="cardDescription"
              rows={3}
              value={formData.cardDescription}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">{isEditing ? "Change Image" : "Card Image"}</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="mt-2">
                <p>Image Preview:</p>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ maxHeight: 150, borderRadius: 6 }}
                />
              </div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Card Link</label>
            <input
              type="text"
              className="form-control"
              name="cardLink"
              value={formData.cardLink}
              onChange={handleInputChange}
              placeholder="Enter link (optional)"
            />
          </div>

          {!isEditing ? (
            <button className="btn btn-primary" onClick={handleAddCard}>
              Add Service Card
            </button>
          ) : (
            <div>
              <button className="btn btn-success me-2" onClick={handleUpdateCard}>
                Update Service Card
              </button>
              <button className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          )}
        </div>

        <hr />

        <h3>All Service Cards</h3>
        <div className="row row-cols-1 row-cols-md-2 g-3">
          {cards.length === 0 && <p>No service cards found.</p>}
          {cards.map((card) => (
            <div className="col" key={card.id}>
              <div className="card shadow-sm h-100">
                <img
                  src={
                    card.cardImage?.startsWith("data:image")
                      ? card.cardImage
                      : card.cardImage?.includes(".")
                      ? `https://localhost:7117/Images/Services/${card.cardImage}`
                      : `data:image/jpeg;base64,${card.cardImage}`
                  }
                  alt={card.cardTitle}
                  className="card-img-top"
                  style={{ maxHeight: 150, objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{card.cardTitle}</h5>
                  <p className="card-text flex-grow-1">{card.cardDescription}</p>
                  <a href={card.cardLink} target="_blank" rel="noopener noreferrer" className="mb-2">
                    {card.cardLink}
                  </a>
                  <div className="mt-auto d-flex gap-2">
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleEditClick(card)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteCard(card.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminServiceCardsDashboard;
