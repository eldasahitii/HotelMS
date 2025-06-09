import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const api = axios.create({
  baseURL: "https://localhost:7117/api",
  withCredentials: true,
});

const ServiceManagerDashboard = () => {
  const [services, setServices] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newService, setNewService] = useState({
    detailImage: "",
    detailTitle: "",
    detailDescription: "",
    price: "€25 per person",
    category: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        "https://localhost:7117/api/HotelServiceDetail/GetAllServiceDetails"
      );
      setServices(response.data);
    } catch {
      toast.error("Failed to load service details.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewService((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewService((prev) => ({ ...prev, detailImage: imageUrl }));
    }
  };

  const resetForm = () => {
    setNewService({
      detailImage: "",
      detailTitle: "",
      detailDescription: "",
      price: "€25 per person",
      category: "",
    });
    setEditingId(null);
    setError("");
  };

  const validateForm = () => {
    if (
      !newService.detailImage.trim() ||
      !newService.detailTitle.trim() ||
      !newService.detailDescription.trim() ||
      !newService.price.trim() ||
      !newService.category.trim()
    ) {
      setError("Please fill all fields.");
      return false;
    }
    setError("");
    return true;
  };

  const handleAddService = async () => {
    if (!validateForm()) {
      toast.warn("Please fill all fields.");
      return;
    }

    try {
      const payload = {
        id: 0,
        detailImage: newService.detailImage,
        detailTitle: `[${newService.category}] ${newService.detailTitle}`,
        detailDescription: newService.detailDescription,
        price: newService.price,
      };
      await api.post(
        "https://localhost:7117/api/HotelServiceDetail/AddServiceDetail",
        payload
      );
      toast.success("Service detail added successfully.");
      resetForm();
      loadServices();
    } catch {
      toast.error("Failed to add service detail.");
    }
  };

  const handleEditClick = (service) => {
    const categoryMatch = service.detailTitle.match(/^\[(.*?)\]/);
    const category = categoryMatch ? categoryMatch[1] : "";
    const title = service.detailTitle.replace(/^\[.*?\]\s*/, "");

    setEditingId(service.id);
    setNewService({
      detailImage: service.detailImage,
      detailTitle: title,
      detailDescription: service.detailDescription,
      price: service.price,
      category: category,
    });
    setError("");
  };

  const handleSaveEdit = async () => {
    if (!validateForm()) {
      toast.warn("Please fill all fields.");
      return;
    }

    try {
      const payload = {
        id: editingId,
        detailImage: newService.detailImage,
        detailTitle: `[${newService.category}] ${newService.detailTitle}`,
        detailDescription: newService.detailDescription,
        price: newService.price,
      };
      await api.put(
        `https://localhost:7117/api/HotelServiceDetail/UpdateServiceDetail/${editingId}`,
        payload
      );
      toast.success("Service detail updated successfully.");
      resetForm();
      loadServices();
    } catch {
      toast.error("Failed to update service detail.");
    }
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleDeleteService = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the service detail.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(
          `https://localhost:7117/api/HotelServiceDetail/DeleteServiceDetail/${id}`
        );
        toast.success("Service detail deleted successfully.");
        if (editingId === id) resetForm();
        loadServices();
        Swal.fire("Deleted!", "The service detail has been deleted.", "success");
      } catch {
        toast.error("Failed to delete service detail.");
        Swal.fire("Error", "Failed to delete the service detail.", "error");
      }
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <main className="flex-grow-1 p-4 container">
        <h2 className="fw-bold text-primary mb-4 d-flex align-items-center">
          <i className="bi bi-tools me-2"></i> Service Manager Dashboard
        </h2>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="card p-3 mb-4 shadow-sm">
          <h4>{editingId ? "Edit Service Detail" : "Add New Service Detail"}</h4>

          {/* Image Upload */}
          <div className="mb-3">
            <label className="form-label">Service Image</label>
            <div
              onClick={() => fileInputRef.current.click()}
              className="border border-secondary rounded p-3 bg-white d-flex justify-content-center align-items-center"
              style={{ cursor: "pointer", maxWidth: 300, minHeight: 150, marginBottom: "1rem" }}
              title="Click to upload image"
            >
              {newService.detailImage ? (
                <img
                  src={newService.detailImage}
                  alt="Service Preview"
                  className="img-fluid rounded shadow-sm"
                  style={{ maxHeight: 140, objectFit: "contain" }}
                />
              ) : (
                <div className="text-secondary text-center w-100">
                  Click here or drag & drop to upload image
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileSelect}
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="detailTitle" className="form-label">
              Title
            </label>
            <input
              type="text"
              id="detailTitle"
              name="detailTitle"
              className="form-control"
              value={newService.detailTitle}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              id="category"
              name="category"
              className="form-select"
              value={newService.category}
              onChange={handleInputChange}
            >
              <option value="">Select category</option>
              <option value="Pool & Spa">Pool & Spa</option>
              <option value="Events">Events</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="detailDescription" className="form-label">
              Description
            </label>
            <textarea
              id="detailDescription"
              name="detailDescription"
              className="form-control"
              rows={3}
              value={newService.detailDescription}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="price" className="form-label">
              Price
            </label>
            <input
              type="text"
              id="price"
              name="price"
              className="form-control"
              value={newService.price}
              onChange={handleInputChange}
              placeholder="e.g. €25 per person"
            />
          </div>

          {editingId ? (
            <>
              <button
                className="btn btn-success me-2"
                onClick={handleSaveEdit}
                type="button"
              >
                Save Changes
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleCancelEdit}
                type="button"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleAddService}
              type="button"
            >
              Add Service Detail
            </button>
          )}
        </div>

        <div className="card p-3 shadow-sm">
          <h4>Existing Service Details</h4>
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-primary">
                <tr>
                  <th style={{ minWidth: 110 }}>Image</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th style={{ minWidth: 110 }}>Price</th>
                  <th style={{ minWidth: 130 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id}>
                    <td>
                      {service.detailImage ? (
                        <img
                          src={service.detailImage}
                          alt={service.detailTitle}
                          className="img-fluid rounded"
                          style={{ maxWidth: 100, maxHeight: 60, objectFit: "contain" }}
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>{service.detailTitle}</td>
                    <td>{service.detailDescription}</td>
                    <td>{service.price}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEditClick(service)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteService(service.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {services.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center">
                      No service details found.
                    </td>
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

export default ServiceManagerDashboard;
