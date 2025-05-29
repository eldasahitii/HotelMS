import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Axios instance
const api = axios.create({
  baseURL: "https://localhost:7117/api",
  withCredentials: true,
});

const RoomManagerDashboard = () => {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [roomStatuses, setRoomStatuses] = useState([]);

  const [editingRoomID, setEditingRoomID] = useState(null);

  const [newRoom, setNewRoom] = useState({
    roomNumber: "",
    roomTypeID: "",
    roomStatusID: "",
  });

  // Bulk create state
  const [bulkRoomData, setBulkRoomData] = useState({
    prefix: "",
    startingRoomNumber: "",
    numberOfRooms: "",
    roomTypeID: "",
    roomStatusID: "",
  });

  // For error messages
  const [error, setError] = useState("");

  // Load rooms, types, statuses
  useEffect(() => {
    loadRooms();
    loadRoomTypes();
    loadRoomStatuses();
  }, []);

  const loadRooms = async () => {
    try {
      const response = await api.get("/Room/GetAllRooms");
      setRooms(response.data);
    } catch (err) {
      setError("Failed to load rooms.");
    }
  };

  const loadRoomTypes = async () => {
    try {
      const response = await api.get("/RoomType/GetAllRoomTypes");
      setRoomTypes(response.data);
    } catch (err) {
      setError("Failed to load room types.");
    }
  };

  const loadRoomStatuses = async () => {
    try {
      const response = await api.get("/RoomStatus/getAllRoomsStatuses", {
        params: { role: "RoomManager" },
      });
      setRoomStatuses(response.data);
    } catch (err) {
      setError("Failed to load room statuses.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoom((prev) => ({ ...prev, [name]: value }));
  };

  const handleBulkInputChange = (e) => {
    const { name, value } = e.target;
    setBulkRoomData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setNewRoom({
      roomNumber: "",
      roomTypeID: "",
      roomStatusID: "",
    });
    setEditingRoomID(null);
    setError("");
  };

  const handleAddRoom = async () => {
    setError("");
    if (
      !newRoom.roomNumber.trim() ||
      !newRoom.roomTypeID ||
      !newRoom.roomStatusID
    ) {
      setError("Please fill all fields.");
      return;
    }

    try {
      const payload = {
        roomID: 0,
        roomNumber: newRoom.roomNumber,
        roomTypeID: Number(newRoom.roomTypeID),
        roomStatusID: Number(newRoom.roomStatusID),
      };
      await api.post("/Room/AddRoom", payload);
      alert("Room added successfully.");
      resetForm();
      loadRooms();
    } catch (err) {
      setError("Failed to add room.");
    }
  };

  const handleEditClick = (room) => {
    setEditingRoomID(room.roomID);
    setNewRoom({
      roomNumber: room.roomNumber,
      roomTypeID: room.roomTypeID.toString(),
      roomStatusID: room.roomStatusID.toString(),
    });
    setError("");
  };

  const handleSaveEdit = async () => {
    setError("");
    if (
      !newRoom.roomNumber.trim() ||
      !newRoom.roomTypeID ||
      !newRoom.roomStatusID
    ) {
      setError("Please fill all fields.");
      return;
    }

    try {
      const payload = {
        roomID: editingRoomID,
        roomNumber: newRoom.roomNumber,
        roomTypeID: Number(newRoom.roomTypeID),
        roomStatusID: Number(newRoom.roomStatusID),
      };
      await api.put(`/Room/UpdateRoom/${editingRoomID}`, payload);
      alert("Room updated successfully.");
      resetForm();
      loadRooms();
    } catch (err) {
      setError("Failed to update room.");
    }
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleDeleteRoom = async (roomID) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    setError("");
    try {
      await api.delete(`/Room/DeleteRoom/${roomID}`);
      alert("Room deleted successfully.");
      if (editingRoomID === roomID) resetForm();
      loadRooms();
    } catch (err) {
      setError("Failed to delete room.");
    }
  };

  // Bulk create handler
  const handleBulkCreate = async () => {
    setError("");
    const { prefix, startingRoomNumber, numberOfRooms, roomTypeID, roomStatusID } =
      bulkRoomData;

    if (
      prefix.trim() === "" ||
      startingRoomNumber === "" ||
      numberOfRooms === "" ||
      roomTypeID === "" ||
      roomStatusID === ""
    ) {
      setError("Please fill all fields in bulk create.");
      return;
    }

    if (isNaN(startingRoomNumber) || isNaN(numberOfRooms)) {
      setError("Starting room number and number of rooms must be numeric.");
      return;
    }

    try {
      await api.post("/Room/BulkCreateRooms", {
        Prefix: prefix.trim(),
        StartingRoomNumber: parseInt(startingRoomNumber, 10),
        NumberOfRooms: parseInt(numberOfRooms, 10),
        RoomTypeID: Number(roomTypeID),
        RoomStatusID: Number(roomStatusID),
      });
      alert("Rooms bulk created successfully.");
      setBulkRoomData({
        prefix: "",
        startingRoomNumber: "",
        numberOfRooms: "",
        roomTypeID: "",
        roomStatusID: "",
      });
      loadRooms();
    } catch (err) {
      setError("Failed to bulk create rooms.");
    }
  };

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: "#f2f6fc" }}>
      {/* Sidebar */}
      <aside
        className="text-white p-4"
        style={{ width: "240px", backgroundColor: "#324b6b" }}
      >
        <h4 className="fw-bold mb-4">
          <i className="bi bi-building"></i> HotelMS
        </h4>
        <ul className="nav flex-column">
          <li className="nav-item text-white mb-3">
            <i className="bi bi-building me-2"></i> Room Manager Dashboard
          </li>

          <button
            className="btn btn-outline-light w-100 mb-3"
            onClick={() => navigate("/room-manager-receptionist-management")}
          >
            <i className="bi bi-person-lines-fill me-2"></i> Receptionist
            Management
          </button>

          <button
            className="btn btn-outline-light w-100 mb-3"
            onClick={() => navigate("/admin/reservation-dashboard")}
          >
            <i className="bi bi-journal-check me-2"></i> Room Reservation List
          </button>
          <button
  className="btn btn-outline-light w-100 mb-3"
  onClick={() => navigate("/room-manager/review-dashboard")}
>
  <i className="bi bi-chat-left-text me-2"></i> Review Dashboard
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
          <i className="bi bi-building me-2"></i> Room Manager Dashboard
        </h2>

        {/* Error alert */}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {/* Add/Edit form */}
        <div className="card p-3 mb-4 shadow-sm">
          <h4>{editingRoomID ? "Edit Room" : "Add New Room"}</h4>
          <div className="mb-3">
            <label htmlFor="roomNumber" className="form-label">
              Room Number
            </label>
            <input
              type="text"
              id="roomNumber"
              name="roomNumber"
              className="form-control"
              value={newRoom.roomNumber}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="roomTypeID" className="form-label">
              Room Type
            </label>
            <select
              id="roomTypeID"
              name="roomTypeID"
              className="form-select"
              value={newRoom.roomTypeID}
              onChange={handleInputChange}
            >
              <option value="">Select Type</option>
              {roomTypes.map((rt) => (
                <option key={rt.roomTypeID} value={rt.roomTypeID}>
                  {rt.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="roomStatusID" className="form-label">
              Room Status
            </label>
            <select
              id="roomStatusID"
              name="roomStatusID"
              className="form-select"
              value={newRoom.roomStatusID}
              onChange={handleInputChange}
            >
              <option value="">Select Status</option>
              {roomStatuses.map((rs) => (
                <option key={rs.roomStatusID} value={rs.roomStatusID}>
                  {rs.roomStatusName}
                </option>
              ))}
            </select>
          </div>

          {editingRoomID ? (
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
              onClick={handleAddRoom}
              type="button"
            >
              Add Room
            </button>
            
          )}
        </div>

        {/* BULK CREATE ROOMS FORM */}
        <div className="card p-3 mb-4 shadow-sm">
          <h4>Bulk Create Rooms</h4>
          <div className="row g-3">
            <div className="col-md-3">
              <label htmlFor="prefix" className="form-label">
                Room Prefix
              </label>
              <input
                type="text"
                id="prefix"
                name="prefix"
                className="form-control"
                value={bulkRoomData.prefix}
                onChange={handleBulkInputChange}
                placeholder="e.g. A, B, C"
              />
            </div>

            <div className="col-md-3">
              <label htmlFor="startingRoomNumber" className="form-label">
                Starting Room Number
              </label>
              <input
                type="number"
                id="startingRoomNumber"
                name="startingRoomNumber"
                className="form-control"
                value={bulkRoomData.startingRoomNumber}
                onChange={handleBulkInputChange}
                min="1"
              />
            </div>

            <div className="col-md-3">
              <label htmlFor="numberOfRooms" className="form-label">
                Number of Rooms
              </label>
              <input
                type="number"
                id="numberOfRooms"
                name="numberOfRooms"
                className="form-control"
                value={bulkRoomData.numberOfRooms}
                onChange={handleBulkInputChange}
                min="1"
              />
            </div>

            <div className="col-md-3">
              <label htmlFor="roomTypeIDBulk" className="form-label">
                Room Type
              </label>
              <select
                id="roomTypeIDBulk"
                name="roomTypeID"
                className="form-select"
                value={bulkRoomData.roomTypeID}
                onChange={handleBulkInputChange}
              >
                <option value="">Select Type</option>
                {roomTypes.map((rt) => (
                  <option key={rt.roomTypeID} value={rt.roomTypeID}>
                    {rt.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label htmlFor="roomStatusIDBulk" className="form-label">
                Room Status
              </label>
              <select
                id="roomStatusIDBulk"
                name="roomStatusID"
                className="form-select"
                value={bulkRoomData.roomStatusID}
                onChange={handleBulkInputChange}
              >
                <option value="">Select Status</option>
                {roomStatuses.map((rs) => (
                  <option key={rs.roomStatusID} value={rs.roomStatusID}>
                    {rs.roomStatusName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            className="btn btn-warning mt-3"
            onClick={handleBulkCreate}
            type="button"
          >
            Bulk Create Rooms
          </button>
        </div>

        {/* Rooms Table */}
        <div className="card p-3 shadow-sm">
          <h4>Existing Rooms</h4>
          <table className="table table-striped table-hover">
            <thead className="table-primary">
              <tr>
                <th>Room Number</th>
                <th>Room Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => {
                const roomType = roomTypes.find(
                  (rt) => rt.roomTypeID === room.roomTypeID
                );
                const roomStatus = roomStatuses.find(
                  (rs) => rs.roomStatusID === room.roomStatusID
                );

                return (
                  <tr key={room.roomID}>
                    <td>{room.roomNumber}</td>
                    <td>{roomType ? roomType.name : "-"}</td>
                    <td>{roomStatus ? roomStatus.roomStatusName : "-"}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEditClick(room)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteRoom(room.roomID)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default RoomManagerDashboard;
