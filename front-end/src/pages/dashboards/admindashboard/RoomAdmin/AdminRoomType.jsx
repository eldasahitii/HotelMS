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
    roomTypeID: 0,
    name: "",
    capacity: "",
    size: "",
    description: "",
    price: "",
    images: [],     
    imageFiles: [],  
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState("");
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [isEditing, setIsEditing] = useState(false);


  useEffect(() => {
    loadRoomTypes();
  }, []);

  const loadRoomTypes = async () => {
    try {
      const res = await api.get("/RoomType/GetAllRoomTypes");
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
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoomType((prev) => ({ ...prev, [name]: value }));
  };


  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewRoomType((prev) => ({ ...prev, imageFiles: files }));
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const resetForm = () => {
    setNewRoomType({
      roomTypeID: 0,
      name: "",
      capacity: "",
      size: "",
      description: "",
      price: "",
      images: [],
      imageFiles: [],
    });
    setImagePreviews([]);
    setIsEditing(false);
    setError("");
  };
  

  const handleAddRoomType = async () => {
    setError("");
    const { name, capacity, size, description, price, imageFiles } = newRoomType;

    if (!name.trim() || !capacity.trim() || !size.trim() || !description.trim() || price === "") {
      setError("Please fill all fields.");
      return;
    }

    try {
      const roomTypePayload = {
        roomTypeID: 0,
        name: name.trim(),
        capacity: capacity.trim(),
        size: size.trim(),
        description: description.trim(),
        price: Number(price),
        images: [],
      };

      const response = await api.post("/RoomType/AddRoomType", roomTypePayload);
      const newRoomTypeID = response.data.roomTypeID || response.data.id || response.data;

      if (imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i++) {
          const formData = new FormData();
          formData.append("RoomTypeID", newRoomTypeID);
          formData.append("Image", imageFiles[i]);
          formData.append("IsPreview", i < 2);

          await api.post("/RoomImage/AddRoomImage", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      }

      alert("Room type and images added successfully!");
      resetForm();
      loadRoomTypes();
    } catch (err) {
      console.error("Failed to add room type or upload images:", err);
      setError("Something went wrong. Check your inputs and try again.");
    }
  };

const handleEditClick = (rt) => {
  console.log("Editing room type images:", rt.images);
  setNewRoomType({
    roomTypeID: rt.roomTypeID,
    name: rt.name || "",
    capacity: rt.capacity || "",
    size: rt.size || "",
    description: rt.description || "",
    price: rt.price || "",
    images: rt.images || [],
    imageFiles: [],
  });
  setImagePreviews([]);
  setIsEditing(true);
  setError("");
  window.scrollTo({ top: 0, behavior: "smooth" });
};


  const handleUpdateRoomType = async () => {
    setError("");
    const { roomTypeID, name, capacity, size, description, price, images, imageFiles } = newRoomType;

    if (!name.trim() || !capacity.trim() || !size.trim() || !description.trim() || price === "") {
      setError("Please fill all fields.");
      return;
    }

    const payload = {
      roomTypeID,
      name: name.trim(),
      capacity: capacity.trim(),
      size: size.trim(),
      description: description.trim(),
      price: Number(price),
      images: images || [],
    };

    try {
      await api.put(`/RoomType/UpdateRoomType?id=${roomTypeID}`, payload);


      if (imageFiles && imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i++) {
          const formData = new FormData();
          formData.append("RoomTypeID", roomTypeID);
          formData.append("Image", imageFiles[i]);
          formData.append("IsPreview", i < 2);

          await api.post("/RoomImage/AddRoomImage", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      }

      alert("Room type updated successfully!");
      resetForm();
      loadRoomTypes();
    } catch (err) {
      console.error("Failed to update room type:", err);
      setError("Failed to update room type.");
    }
  };

  const toggleDescription = (id) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDeleteRoomType = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room type?")) return;
    try {
      await api.delete(`/RoomType/DeleteRoomType?id=${id}`);
      loadRoomTypes();
    } catch (err) {
      console.error("Failed to delete room type:", err);
      alert("Failed to delete room type.");
    }
  };
const handleDeleteImage = async (imageId) => {
  try {
    await api.delete(`/RoomImage/DeleteImage?imageId=${imageId}`);
    
    setNewRoomType(prev => ({
      ...prev,
      images: prev.images.filter(img => img.roomImageID !== imageId)
    }));

  } catch (error) {
    console.error("Failed to delete image:", error);
    setError("Failed to delete image.");
  }
};



  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: "#f2f6fc" }}>
      <aside className="text-white p-4" style={{ width: "240px", backgroundColor: "#324b6b" }}>
        <h4 className="fw-bold mb-4"><i className="bi bi-building"></i> HotelMS Admin</h4>
        <ul className="nav flex-column">
          <li className="nav-item text-white mb-3"><i className="bi bi-building me-2"></i> Room Type Management</li>
          <button className="btn btn-outline-light w-100 mb-3" onClick={() => navigate("/admin/add-manager")}>
            <i className="bi bi-building me-2"></i> Add Manager
          </button>
          {/* <button className="btn btn-outline-light w-100 mb-3" onClick={() => navigate("/admin/reservation-dashboard")}>
            <i className="bi bi-journal-check me-2"></i> Reservation Dashboard
          </button> */}
                       <button
            className="btn btn-outline-light w-100 mb-3"
            onClick={() => navigate("/admin/roomstatus")}
          >
            <i className="bi bi-house-door me-2"></i> Add Room Status
          </button>
          <button className="btn btn-outline-light w-100 mt-2" onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}>
            <i className="bi bi-box-arrow-right me-2"></i> Logout
          </button>
        </ul>
      </aside>

      <main className="flex-grow-1 p-4">
        <h2 className="fw-bold text-primary mb-4"><i className="bi bi-building me-2"></i> Admin Room Type Management</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="card p-3 mb-4 shadow-sm" style={{ maxWidth: "600px" }}>
          <h4>{isEditing ? "Edit Room Type" : "Add New Room Type"}</h4>

          {["name", "capacity", "size", "description", "price"].map((field) => (
            <div className="mb-3" key={field}>
              <label className="form-label text-capitalize">{field}</label>
              {field === "description" ? (
                <textarea
                  name={field}
                  className="form-control"
                  rows={3}
                  value={newRoomType[field]}
                  onChange={handleInputChange}
                />
              ) : (
                <input
                  name={field}
                  type={field === "price" ? "number" : "text"}
                  className="form-control"
                  value={newRoomType[field]}
                  onChange={handleInputChange}
                  min={field === "price" ? 0 : undefined}
                />
              )}
            </div>
          ))}

          <div className="mb-3">
            <label className="form-label">{isEditing ? "Add Additional Images" : "Room Type Images"}</label>
            <input
              type="file"
              accept="image/*"
              multiple
              className="form-control"
              onChange={handleImageChange}
            />
            {/* Show existing images on edit */}
            
{isEditing && newRoomType.images && newRoomType.images.length > 0 && (
  <div className="mt-2">
    <p>Existing Images:</p>
    <div className="d-flex flex-wrap">
      {newRoomType.images.map((img, idx) => (
        <div
          key={img.roomImageID || idx}  
          style={{ position: "relative", marginRight: 8, marginBottom: 8 }}
        >

          <a
            href={img.fullImageUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-block" }}
          >
            <img
              src={img.fullImageUrl}
              alt={`RoomType ${newRoomType.name} Img ${idx}`}
              style={{ height: 70, borderRadius: 6 }}
            />
          </a>
          
<button
  type="button"
  onClick={() => {
    console.log("Deleting image with ID:", img.roomImageID);
    handleDeleteImage(img.roomImageID);
  }}
  className="btn btn-danger btn-sm position-absolute top-0 end-0"
  style={{ borderRadius: "0 6px 0 6px", fontWeight: "bold", lineHeight: 1 }}
  title="Delete Image"
>
  &times;
</button>



        </div>
      ))}
    </div>
  </div>
)}


            {/* Show previews for newly selected images */}
            {imagePreviews.length > 0 && (
              <div className="mt-2">
                <p>New Image Previews:</p>
                {imagePreviews.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt="Preview"
                    style={{ marginTop: 10, maxHeight: 150, marginRight: 10, borderRadius: 6 }}
                  />
                ))}
              </div>
            )}
          </div>

          {!isEditing && (
            <button className="btn btn-primary" onClick={handleAddRoomType}>
              Add Room Type
            </button>
          )}

          {isEditing && (
            <div>
              <button className="btn btn-success me-2" onClick={handleUpdateRoomType}>
                Update Room Type
              </button>
              <button className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          )}
        </div>

        <h3 className="mb-3">All Room Types</h3>

        <div className="row">
          {roomTypes.length === 0 && <p>No room types found.</p>}

          {roomTypes.map((rt) => {
            const desc = rt.description || "";
            const isExpanded = expandedDescriptions[rt.roomTypeID] || false;

            return (
              <div key={rt.roomTypeID} className="col-md-4 mb-4">
                <div className="card h-100 shadow-sm">
                  {rt.images && rt.images.length > 0 && (
                    <a href={rt.images[0].fullImageUrl} target="_blank" rel="noopener noreferrer">
                      <img
                        src={rt.images[0].fullImageUrl}
                        alt={`RoomType ${rt.name}`}
                        className="card-img-top"
                        style={{ maxHeight: 250, objectFit: "cover" }}
                      />
                    </a>
                  )}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{rt.name}</h5>
                    <p className="card-text mb-1">
                      <strong>Capacity:</strong> {rt.capacity}
                    </p>
                    <p className="card-text mb-1">
                      <strong>Size:</strong> {rt.size}
                    </p>
                    <p className="card-text mb-1">
                      <strong>Price:</strong> ${rt.price}
                    </p>
                    <p className="card-text mb-3" style={{ whiteSpace: "pre-wrap" }}>
                      <strong>Description:</strong>{" "}
                      {desc.length > 200 && !isExpanded
                        ? desc.slice(0, 200) + "..."
                        : desc}
                      {desc.length > 200 && (
                        <button
                          className="btn btn-link p-0 ms-1"
                          onClick={() => toggleDescription(rt.roomTypeID)}
                        >
                          {isExpanded ? "Show less" : "Show more"}
                        </button>
                      )}
                    </p>

                    <div className="mt-auto d-flex justify-content-between">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEditClick(rt)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteRoomType(rt.roomTypeID)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default AdminRoomTypeDashboard;
