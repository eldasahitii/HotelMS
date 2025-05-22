import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";

const RoomManagerDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [roomStatuses, setRoomStatuses] = useState([]);
  const [newRoom, setNewRoom] = useState({
    name: "",
    capacity: "",
    size: "",
    description: "",
    price: "",
    roomStatusID: "",
    roomTypeID: "",
    images: [],
    imageInput: "",
  });
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [editRoomData, setEditRoomData] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchRooms();
    fetchRoomTypes();
    fetchRoomStatuses();
  }, []);

  const getRoleFromToken = () => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    } catch {
      return null;
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await axios.get("https://localhost:7117/api/Room/GetAllRooms", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setMessage("Failed to fetch rooms.");
      setMessageType("danger");
    }
  };

  const fetchRoomTypes = async () => {
    try {
      const response = await axios.get("https://localhost:7117/api/RoomType/GetAllRoomTypes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoomTypes(response.data);
    } catch (error) {
      console.error("Error fetching room types:", error);
      setMessage("Failed to fetch room types.");
      setMessageType("danger");
    }
  };

  const fetchRoomStatuses = async () => {
    try {
      const role = getRoleFromToken();
      const response = await axios.get(`https://localhost:7117/api/RoomStatus/getAllRoomsStatuses?role=${role}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoomStatuses(response.data);
    } catch (error) {
      console.error("Error fetching room statuses:", error);
      setMessage("Failed to fetch room statuses.");
      setMessageType("danger");
    }
  };

  const addImageUrl = () => {
    if (newRoom.imageInput.trim() === "") return;
    setNewRoom((prev) => ({
      ...prev,
      images: [...prev.images, prev.imageInput.trim()],
      imageInput: "",
    }));
  };

  const removeImageUrl = (index) => {
    setNewRoom((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleAddRoom = async () => {
    if (!newRoom.name || !newRoom.capacity || !newRoom.roomStatusID || !newRoom.roomTypeID) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const payload = {
        Name: newRoom.name,
        Capacity: newRoom.capacity,
        Size: newRoom.size,
        Description: newRoom.description,
        Price: parseFloat(newRoom.price),
        RoomStatusID: parseInt(newRoom.roomStatusID, 10),
        RoomTypeID: parseInt(newRoom.roomTypeID, 10),
        Images: newRoom.images,
      };

      await axios.post("https://localhost:7117/api/Room/AddRoom", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("Room added successfully.");
      setMessageType("success");
      setNewRoom({
        name: "",
        capacity: "",
        size: "",
        description: "",
        price: "",
        roomStatusID: "",
        roomTypeID: "",
        images: [],
        imageInput: "",
      });
      fetchRooms();
    } catch (error) {
      console.error("Error adding room:", error);
      alert("Failed to add room.");
    }
  };

  const handleEdit = (room) => {
    setEditingRoomId(room.roomID);
    setEditRoomData({
      name: room.name || "",
      capacity: room.capacity || "",
      size: room.size || "",
      description: room.description || "",
      price: room.price?.toString() || "",
      roomStatusID: room.roomStatus?.roomStatusID || "",
      roomTypeID: room.roomType?.roomTypeID || "",
      images: room.roomImages ? room.roomImages.map((img) => img.imageUrl) : [],
      imageInput: "",
    });
  };

  const handleEditInputChange = (field, value) => {
    setEditRoomData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addEditImageUrl = () => {
    if (!editRoomData.imageInput || editRoomData.imageInput.trim() === "") return;
    setEditRoomData((prev) => ({
      ...prev,
      images: [...(prev.images || []), prev.imageInput.trim()],
      imageInput: "",
    }));
  };

  const removeEditImageUrl = (index) => {
    setEditRoomData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateRoom = async () => {
    if (!token || !editingRoomId) return;

    if (
      !editRoomData.name ||
      !editRoomData.capacity ||
      !editRoomData.roomStatusID ||
      !editRoomData.roomTypeID
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const payload = {
        Name: editRoomData.name,
        Capacity: editRoomData.capacity,
        Size: editRoomData.size,
        Description: editRoomData.description,
        Price: parseFloat(editRoomData.price),
        RoomStatusID: parseInt(editRoomData.roomStatusID, 10),
        RoomTypeID: parseInt(editRoomData.roomTypeID, 10),
        Images: editRoomData.images,
      };

      await axios.put(`https://localhost:7117/api/Room/UpdateRoom?id=${editingRoomId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEditingRoomId(null);
      setEditRoomData({});
      fetchRooms();
      setMessage("Room updated successfully.");
      setMessageType("success");
    } catch (error) {
      console.error("Error updating room:", error);
      alert("Failed to update room.");
    }
  };

  const handleCancelEdit = () => {
    setEditingRoomId(null);
    setEditRoomData({});
  };

  const handleDeleteRoom = async (id) => {
    if (!token) return;

    const isConfirmed = window.confirm("Are you sure you want to delete this room?");
    if (!isConfirmed) return;

    try {
      await axios.delete(`https://localhost:7117/api/Room/DeleteRoom?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRooms();
      setMessage("Room deleted successfully.");
      setMessageType("success");
    } catch (error) {
      console.error("Error deleting room:", error);
      alert("Failed to delete room.");
    }
  };

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: "#f2f6fc" }}>
      <aside className="text-white p-4" style={{ width: "240px", backgroundColor: "#324b6b" }}>
        <h4 className="fw-bold mb-4">
          <i className="bi bi-people"></i> HotelMS
        </h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-3">
            <button
              className="btn btn-outline-light w-100"
              onClick={() => navigate("/room-manager-dashboard")}
            >
              <i className="bi bi-building me-2"></i> Room Manager
            </button>
          </li>

          <li className="nav-item mb-3">
            <button
              className="btn btn-outline-light w-100"
              onClick={() => navigate("/room-manager-receptionist-management")}
            >
              <i className="bi bi-person-lines-fill me-2"></i> Receptionist Management
            </button>
          </li>

          <li className="nav-item">
            <button
              className="btn btn-outline-light w-100"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
            >
              <i className="bi bi-box-arrow-right me-2"></i> Logout
            </button>
          </li>
        </ul>
      </aside>

      <main className="flex-grow-1 p-4">
        <h1 className="mb-4 text-primary">Room Manager Dashboard</h1>

        {message && (
          <div className={`alert alert-${messageType} alert-dismissible fade show`} role="alert">
            {message}
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => setMessage("")}
            ></button>
          </div>
        )}

        {/* Add Room Form */}
        <section className="mb-5 p-4 bg-white rounded shadow-sm">
          <h3>Add New Room</h3>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Name *</label>
              <input
                type="text"
                className="form-control"
                value={newRoom.name}
                onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Capacity *</label>
              <input
                type="text"
                className="form-control"
                value={newRoom.capacity}
                onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Size</label>
              <input
                type="text"
                className="form-control"
                value={newRoom.size}
                onChange={(e) => setNewRoom({ ...newRoom, size: e.target.value })}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Price</label>
              <input
                type="number"
                className="form-control"
                value={newRoom.price}
                onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Room Status *</label>
              <select
                className="form-select"
                value={newRoom.roomStatusID}
                onChange={(e) => setNewRoom({ ...newRoom, roomStatusID: e.target.value })}
              >
                <option value="">Select Status</option>
                {roomStatuses.map((status) => (
                  <option key={status.roomStatusID} value={status.roomStatusID}>
                    {status.statusName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Room Type *</label>
              <select
                className="form-select"
                value={newRoom.roomTypeID}
                onChange={(e) => setNewRoom({ ...newRoom, roomTypeID: e.target.value })}
              >
                <option value="">Select Type</option>
                {roomTypes.map((type) => (
                  <option key={type.roomTypeID} value={type.roomTypeID}>
                    {type.roomTypeName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows="2"
                value={newRoom.description}
                onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
              ></textarea>
            </div>

            <div className="col-12">
              <label className="form-label">Images</label>
              <div className="input-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter image URL"
                  value={newRoom.imageInput}
                  onChange={(e) => setNewRoom({ ...newRoom, imageInput: e.target.value })}
                />
                <button
                  className="btn btn-outline-primary"
                  type="button"
                  onClick={addImageUrl}
                >
                  Add Image
                </button>
              </div>

              <div className="d-flex flex-wrap gap-2">
                {newRoom.images.map((url, index) => (
                  <div
                    key={index}
                    className="position-relative"
                    style={{ width: "100px", height: "70px", border: "1px solid #ccc" }}
                  >
                    <img
                      src={url}
                      alt={`room-${index}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/100x70?text=Image+Not+Found";
                      }}
                    />
                    <button
                      type="button"
                      className="btn-close position-absolute top-0 end-0 m-1"
                      aria-label="Remove image"
                      onClick={() => removeImageUrl(index)}
                    ></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-12">
              <button className="btn btn-success" onClick={handleAddRoom}>
                Add Room
              </button>
            </div>
          </div>
        </section>

        {/* Rooms List */}
        <section>
          <h3>Rooms</h3>
          {rooms.length === 0 && <p>No rooms available.</p>}

          <div className="row row-cols-1 row-cols-md-2 g-4">
            {rooms.map((room) =>
              editingRoomId === room.roomID ? (
                <div key={room.roomID} className="col">
                  <div className="card shadow-sm p-3 bg-white rounded">
                    <h5>Edit Room: {room.name}</h5>

                    <div className="mb-2">
                      <label className="form-label">Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editRoomData.name}
                        onChange={(e) => handleEditInputChange("name", e.target.value)}
                      />
                    </div>

                    <div className="mb-2">
                      <label className="form-label">Capacity *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editRoomData.capacity}
                        onChange={(e) => handleEditInputChange("capacity", e.target.value)}
                      />
                    </div>

                    <div className="mb-2">
                      <label className="form-label">Size</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editRoomData.size}
                        onChange={(e) => handleEditInputChange("size", e.target.value)}
                      />
                    </div>

                    <div className="mb-2">
                      <label className="form-label">Price</label>
                      <input
                        type="number"
                        className="form-control"
                        value={editRoomData.price}
                        onChange={(e) => handleEditInputChange("price", e.target.value)}
                      />
                    </div>

                    <div className="mb-2">
                      <label className="form-label">Room Status *</label>
                      <select
                        className="form-select"
                        value={editRoomData.roomStatusID}
                        onChange={(e) => handleEditInputChange("roomStatusID", e.target.value)}
                      >
                        <option value="">Select Status</option>
                        {roomStatuses.map((status) => (
                          <option key={status.roomStatusID} value={status.roomStatusID}>
                            {status.statusName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-2">
                      <label className="form-label">Room Type *</label>
                      <select
                        className="form-select"
                        value={editRoomData.roomTypeID}
                        onChange={(e) => handleEditInputChange("roomTypeID", e.target.value)}
                      >
                        <option value="">Select Type</option>
                        {roomTypes.map((type) => (
                          <option key={type.roomTypeID} value={type.roomTypeID}>
                            {type.roomTypeName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-2">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={editRoomData.description}
                        onChange={(e) => handleEditInputChange("description", e.target.value)}
                      ></textarea>
                    </div>

                    <div className="mb-2">
                      <label className="form-label">Images</label>
                      <div className="input-group mb-2">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter image URL"
                          value={editRoomData.imageInput || ""}
                          onChange={(e) => handleEditInputChange("imageInput", e.target.value)}
                        />
                        <button
                          className="btn btn-outline-primary"
                          type="button"
                          onClick={addEditImageUrl}
                        >
                          Add Image
                        </button>
                      </div>

                      <div className="d-flex flex-wrap gap-2">
                        {(editRoomData.images || []).map((url, index) => (
                          <div
                            key={index}
                            className="position-relative"
                            style={{ width: "100px", height: "70px", border: "1px solid #ccc" }}
                          >
                            <img
                              src={url}
                              alt={`edit-room-${index}`}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://via.placeholder.com/100x70?text=Image+Not+Found";
                              }}
                            />
                            <button
                              type="button"
                              className="btn-close position-absolute top-0 end-0 m-1"
                              aria-label="Remove image"
                              onClick={() => removeEditImageUrl(index)}
                            ></button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-primary"
                        onClick={handleUpdateRoom}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div key={room.roomID} className="col">
                  <div className="card shadow-sm h-100">
                    {room.roomImages && room.roomImages.length > 0 ? (
                      <img
                        src={room.roomImages[0].imageUrl}
                        className="card-img-top"
                        alt={room.name}
                        style={{ height: "180px", objectFit: "cover" }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/320x180?text=No+Image";
                        }}
                      />
                    ) : (
                      <div
                        className="d-flex align-items-center justify-content-center bg-secondary text-white"
                        style={{ height: "180px" }}
                      >
                        No Image
                      </div>
                    )}

                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{room.name}</h5>
                      <p className="card-text mb-1">
                        <strong>Capacity:</strong> {room.capacity}
                      </p>
                      <p className="card-text mb-1">
                        <strong>Size:</strong> {room.size || "N/A"}
                      </p>
                      <p className="card-text mb-1">
                        <strong>Price:</strong> ${room.price?.toFixed(2) || "N/A"}
                      </p>
                      <p className="card-text mb-1">
                        <strong>Status:</strong> {room.roomStatus?.statusName || "N/A"}
                      </p>
                      <p className="card-text mb-3 flex-grow-1">
                        {room.description || "No description"}
                      </p>

                      <div className="d-flex gap-2 mt-auto">
                        <button
                          className="btn btn-sm btn-primary flex-grow-1"
                          onClick={() => handleEdit(room)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger flex-grow-1"
                          onClick={() => handleDeleteRoom(room.roomID)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default RoomManagerDashboard;
