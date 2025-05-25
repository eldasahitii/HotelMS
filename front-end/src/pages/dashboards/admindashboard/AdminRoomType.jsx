import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://localhost:7117/";
const api = axios.create({
  baseURL: BASE_URL + "api",
  withCredentials: true,
});

const AdminRoomTypeDashboard = () => {
  const navigate = useNavigate();

  const [roomTypes, setRoomTypes] = useState([]);
  const [newRoomType, setNewRoomType] = useState({
    name: "",
    capacity: "",
    size: "",
    description: "",
    price: "",
    imageFiles: [], // changed to array for multiple files
  });
  const [imagePreviews, setImagePreviews] = useState([]); // to preview multiple images
  const [error, setError] = useState("");
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  useEffect(() => {
    loadRoomTypes();
  }, []);

// Change GET endpoint URL to match swagger if needed:
const loadRoomTypes = async () => {
  try {
    const res = await api.get("/RoomType/GetAllRoomTypes"); // confirm this exists in your API

    const roomTypesWithImages = res.data.map((rt) => {
      const imagesWithFullUrl =
        rt.images?.map((img) => ({
          ...img,
          fullImageUrl: BASE_URL + img.imageUrl,
        })) || [];

      return {
        ...rt,
        images: imagesWithFullUrl,
      };
    });

    setRoomTypes(roomTypesWithImages);
  } catch (err) {
    setError("Failed to load room types.");
  }
};


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoomType((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewRoomType((prev) => ({ ...prev, imageFiles: files }));

    // Preview multiple images
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const resetForm = () => {
    setNewRoomType({
      name: "",
      capacity: "",
      size: "",
      description: "",
      price: "",
      imageFiles: [],
    });
    setImagePreviews([]);
    setError("");
  };

  const handleAddRoomType = async () => {
    setError("");
    const { name, capacity, size, description, price, imageFiles } = newRoomType;

    if (
      !name.trim() ||
      !capacity.trim() ||
      !size.trim() ||
      !description.trim() ||
      price === ""
    ) {
      setError("Please fill all fields.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("roomTypeID", 0);
      formData.append("name", name.trim());
      formData.append("capacity", capacity.trim());
      formData.append("size", size.trim());
      formData.append("description", description.trim());
      formData.append("price", Number(price));

      imageFiles.forEach((file) => {
        formData.append("images", file); // key "images" for multiple files
      });

      await api.post("/RoomType/AddRoomType", formData /* no manual content-type */);

      alert("Room type added successfully.");
      resetForm();
      loadRoomTypes();
    } catch (err) {
      setError("Failed to add room type.");
    }
  };

  const toggleDescription = (id) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: "#f2f6fc" }}>
      {/* Sidebar */}
      <aside
        className="text-white p-4"
        style={{ width: "240px", backgroundColor: "#324b6b" }}
      >
        <h4 className="fw-bold mb-4">
          <i className="bi bi-building"></i> HotelMS Admin
        </h4>
        <ul className="nav flex-column">
          <li className="nav-item text-white mb-3">
            <i className="bi bi-building me-2"></i> Room Type Management
          </li>
          <button
            className="btn btn-outline-light w-100 mb-3"
            onClick={() => navigate("/room-manager-dashboard")}
          >
            <i className="bi bi-building me-2"></i> Room Manager Dashboard
          </button>
          <button
            className="btn btn-outline-light w-100 mb-3"
            onClick={() => navigate("/admin/reservation-dashboard")}
          >
            <i className="bi bi-journal-check me-2"></i> Reservation Dashboard
          </button>
          <button
            className="btn btn-outline-light w-100 mt-2"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            <i className="bi bi-box-arrow-right me-2"></i> Logout
          </button>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-grow-1 p-4">
        <h2 className="fw-bold text-primary mb-4">
          <i className="bi bi-building me-2"></i> Admin Room Type Management
        </h2>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="card p-3 mb-4 shadow-sm" style={{ maxWidth: "600px" }}>
          <h4>Add New Room Type</h4>

          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              name="name"
              type="text"
              className="form-control"
              value={newRoomType.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Capacity</label>
            <input
              name="capacity"
              type="text"
              className="form-control"
              value={newRoomType.capacity}
              onChange={handleInputChange}
              placeholder="e.g. 2 persons"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Size</label>
            <input
              name="size"
              type="text"
              className="form-control"
              value={newRoomType.size}
              onChange={handleInputChange}
              placeholder="e.g. 30 sqm"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-control"
              value={newRoomType.description}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Price</label>
            <input
              name="price"
              type="number"
              className="form-control"
              value={newRoomType.price}
              onChange={handleInputChange}
              min={0}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Room Type Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              className="form-control"
              onChange={handleImageChange}
            />
            {imagePreviews.length > 0 &&
              imagePreviews.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt="Preview"
                  style={{ marginTop: "10px", maxHeight: "150px", marginRight: "10px" }}
                />
              ))}
          </div>

          <button className="btn btn-primary" onClick={handleAddRoomType}>
            Add Room Type
          </button>
        </div>

        <div className="card p-3 shadow-sm">
          <h4 className="mb-3">Room Types List</h4>
          <div style={{ overflowX: "auto" }}>
            <table className="table table-hover table-bordered table-striped align-middle">
              <thead className="table-primary">
                <tr>
                  <th>Name</th>
                  <th>Capacity</th>
                  <th>Size</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Images</th>
                </tr>
              </thead>
              <tbody>
                {roomTypes.length > 0 ? (
                  roomTypes.map((rt) => (
                    <tr key={rt.roomTypeID}>
                      <td>{rt.name}</td>
                      <td>{rt.capacity}</td>
                      <td>{rt.size}</td>
                      <td>
                        {rt.description.length > 50 && !expandedDescriptions[rt.roomTypeID]
                          ? rt.description.slice(0, 50) + "…"
                          : rt.description}
                        {rt.description.length > 50 && (
                          <button
                            className="btn btn-link btn-sm p-0 ms-1"
                            onClick={() => toggleDescription(rt.roomTypeID)}
                            style={{ verticalAlign: "middle" }}
                          >
                            {expandedDescriptions[rt.roomTypeID] ? "Show Less" : "Show More"}
                          </button>
                        )}
                      </td>
                      <td>{rt.price}</td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        {rt.images?.length > 0 ? (
                          rt.images.map((img, index) => (
                            <a
                              key={index}
                              href={img.fullImageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ display: "inline-block", marginRight: "5px" }}
                            >
                              <img
                                src={img.fullImageUrl}
                                alt={rt.name}
                                style={{
                                  height: "50px",
                                  width: "auto",
                                  borderRadius: "4px",
                                  objectFit: "cover",
                                  border: "1px solid #ccc",
                                }}
                              />
                            </a>
                          ))
                        ) : (
                          "No image"
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center">
                      No room types found.
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

export default AdminRoomTypeDashboard;
