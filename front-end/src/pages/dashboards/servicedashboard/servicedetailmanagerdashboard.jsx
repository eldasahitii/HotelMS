import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const api = axios.create({
  baseURL: "https://localhost:7117/api/HotelServiceDetail",
  withCredentials: true,
});

export default function ServiceDetailManagerDashboard() {
  const navigate = useNavigate();

  const [serviceDetails, setServiceDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newDetail, setNewDetail] = useState({
    serviceId: "", // must select service
    title: "",
    description: "",
    price: "",
  });
  const [newImageFile, setNewImageFile] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editDetail, setEditDetail] = useState({
    serviceId: "",
    title: "",
    description: "",
    price: "",
    imageUrl: "",
  });
  const [editImageFile, setEditImageFile] = useState(null);

  // Fetch all service details
  const loadServiceDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get("/GetAllHotelServiceDetails");
      setServiceDetails(res.data);
    } catch (error) {
      toast.error("Failed to load service details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServiceDetails();
  }, []);

  // Handle input changes (add form)
  const handleNewInputChange = (e) => {
    const { name, value } = e.target;
    setNewDetail((prev) => ({ ...prev, [name]: value }));
  };

  // Handle input changes (edit form)
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditDetail((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image file change (add)
  const handleNewImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewImageFile(e.target.files[0]);
    }
  };

  // Handle image file change (edit)
  const handleEditImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setEditImageFile(e.target.files[0]);
    }
  };

  // Reset add form
  const resetAddForm = () => {
    setNewDetail({ serviceId: "", title: "", description: "", price: "" });
    setNewImageFile(null);
  };

  // Reset edit form
  const resetEditForm = () => {
    setEditingId(null);
    setEditDetail({ serviceId: "", title: "", description: "", price: "", imageUrl: "" });
    setEditImageFile(null);
  };

  // Add new service detail
  const handleAddDetail = async () => {
    if (
      !newDetail.serviceId ||
      !newDetail.title.trim() ||
      !newDetail.description.trim() ||
      newDetail.price === ""
    ) {
      toast.warn("Please fill all required fields.");
      return;
    }

    try {
      // Prepare DTO data
      const dto = {
        serviceId: parseInt(newDetail.serviceId, 10),
        title: newDetail.title,
        description: newDetail.description,
        price: parseFloat(newDetail.price),
        imageUrl: "", // image handled separately or URL after upload - backend dependent
      };

      // If your backend expects multipart form data with image upload,
      // You need to send image separately or via a dedicated API for image upload.

      // For simplicity, we send JSON (adjust as per your backend requirements)
      const res = await api.post("/AddHotelServiceDetail", dto);

      toast.success("Service detail added.");
      resetAddForm();
      loadServiceDetails();
    } catch (error) {
      toast.error("Failed to add service detail.");
    }
  };

  // Open edit form for a service detail
  const openEditDetail = (detail) => {
    setEditingId(detail.id);
    setEditDetail({
      serviceId: detail.serviceId.toString(),
      title: detail.title,
      description: detail.description,
      price: detail.price ? detail.price.toString() : "",
      imageUrl: detail.imageUrl || "",
    });
    setEditImageFile(null);
  };

  // Update existing service detail
  const handleUpdateDetail = async () => {
    if (
      !editDetail.serviceId ||
      !editDetail.title.trim() ||
      !editDetail.description.trim() ||
      editDetail.price === ""
    ) {
      toast.warn("Please fill all required fields.");
      return;
    }

    try {
      const dto = {
        serviceId: parseInt(editDetail.serviceId, 10),
        title: editDetail.title,
        description: editDetail.description,
        price: parseFloat(editDetail.price),
        imageUrl: editDetail.imageUrl,
      };

      const res = await api.put(`/UpdateHotelServiceDetail?id=${editingId}`, dto);

      toast.success("Service detail updated.");
      resetEditForm();
      loadServiceDetails();
    } catch (error) {
      toast.error("Failed to update service detail.");
    }
  };

  // Delete a service detail with confirmation
  const handleDeleteDetail = async (id) => {
    if (!id) {
      toast.error("Invalid detail ID.");
      return;
    }

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
        await api.delete("/DeleteHotelServiceDetail", { params: { id } });
        toast.success("Service detail deleted.");
        if (editingId === id) resetEditForm();
        loadServiceDetails();
        Swal.fire("Deleted!", "The service detail has been deleted.", "success");
      } catch (error) {
        toast.error("Failed to delete service detail.");
        Swal.fire("Error", "Failed to delete the service detail.", "error");
      }
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ backgroundColor: "#f2f6fc", minHeight: "100vh", padding: "2rem" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">
          <i className="bi bi-card-list me-2"></i>Service Detail Manager
        </h2>
        <button className="btn btn-outline-primary" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-1"></i> Logout
        </button>
      </div>

      {/* Add New Service Detail */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header d-flex align-items-center bg-white text-primary border-bottom">
          <i className="bi bi-plus-circle me-2"></i>
          <strong>Add New Service Detail</strong>
        </div>
        <div className="card-body">
          <input
            type="number"
            name="serviceId"
            className="form-control mb-2"
            placeholder="Service ID"
            value={newDetail.serviceId}
            onChange={handleNewInputChange}
          />
          <input
            name="title"
            className="form-control mb-2"
            placeholder="Title"
            value={newDetail.title}
            onChange={handleNewInputChange}
          />
          <textarea
            name="description"
            className="form-control mb-2"
            placeholder="Description"
            rows={3}
            value={newDetail.description}
            onChange={handleNewInputChange}
          />
          <input
            type="number"
            step="0.01"
            name="price"
            className="form-control mb-2"
            placeholder="Price"
            value={newDetail.price}
            onChange={handleNewInputChange}
          />
          {/* Image upload (optional) */}
          <input
            type="file"
            accept="image/*"
            className="form-control mb-2"
            onChange={handleNewImageChange}
          />
          {newImageFile && (
            <img
              src={URL.createObjectURL(newImageFile)}
              alt="Preview"
              width="100"
              style={{ objectFit: "cover", marginBottom: "10px" }}
            />
          )}
          <button className="btn btn-primary w-100" onClick={handleAddDetail} disabled={loading}>
            {loading ? "Adding..." : "Add Service Detail"}
          </button>
        </div>
      </div>

      {/* List of Service Details */}
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <i className="bi bi-list-ul me-2"></i>All Service Details
        </div>
        <div className="card-body p-0">
          <table className="table mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Service ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Price</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {serviceDetails.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-3">
                    No service details found.
                  </td>
                </tr>
              )}
              {serviceDetails.map((detail, index) => (
                <tr key={detail.id || index}>
                  <td>{index + 1}</td>
                  <td>{detail.serviceId}</td>
                  <td>{detail.title}</td>
                  <td>{detail.description}</td>
                  <td>{detail.price?.toFixed(2)}</td>
                  <td>
                    {detail.imageUrl && (
                      <img
                        src={detail.imageUrl}
                        alt={detail.title}
                        width="100"
                        style={{ objectFit: "cover" }}
                      />
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-danger me-2"
                      onClick={() => handleDeleteDetail(detail.id)}
                      disabled={loading}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => openEditDetail(detail)}
                      disabled={loading}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Service Detail */}
      {editingId && (
        <div className="card mt-4 shadow-sm">
          <div className="card-header bg-primary text-white d-flex align-items-center">
            <i className="bi bi-pencil-square me-2"></i>Edit Service Detail
          </div>
          <div className="card-body">
            <input
              type="number"
              name="serviceId"
              className="form-control mb-2"
              value={editDetail.serviceId}
              onChange={handleEditInputChange}
              placeholder="Service ID"
            />
            <input
              name="title"
              className="form-control mb-2"
              value={editDetail.title}
              onChange={handleEditInputChange}
              placeholder="Title"
            />
            <textarea
              name="description"
              className="form-control mb-2"
              rows={3}
              value={editDetail.description}
              onChange={handleEditInputChange}
              placeholder="Description"
            />
            <input
              type="number"
              step="0.01"
              name="price"
              className="form-control mb-2"
              value={editDetail.price}
              onChange={handleEditInputChange}
              placeholder="Price"
            />
            <input
              type="file"
              accept="image/*"
              className="form-control mb-2"
              onChange={handleEditImageChange}
            />
            {editImageFile ? (
              <img
                src={URL.createObjectURL(editImageFile)}
                alt="Preview"
                width="100"
                style={{ objectFit: "cover", marginBottom: "10px" }}
              />
            ) : (
              editDetail.imageUrl && (
                <img
                  src={editDetail.imageUrl}
                  alt="Current"
                  width="100"
                  style={{ objectFit: "cover", marginBottom: "10px" }}
                />
              )
            )}
            <button
              className="btn btn-primary me-2"
              onClick={handleUpdateDetail}
              disabled={loading}
            >
              <i className="bi bi-check2"></i> Save
            </button>
            <button className="btn btn-secondary" onClick={resetEditForm} disabled={loading}>
              <i className="bi bi-x"></i> Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
