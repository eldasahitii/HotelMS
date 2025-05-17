import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";

const RoomReceptionistDashboard = () => {
  const [receptionists, setReceptionists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" | "danger"

  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editShift, setEditShift] = useState("");

  // Adding new receptionist state
  const [newUserID, setNewUserID] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newShift, setNewShift] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Axios config with Bearer token
  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    fetchReceptionists();
  }, []);

  // Fetch all receptionists
  const fetchReceptionists = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://localhost:7117/api/RoomRecepsionist/getAllRoomRecepsionists",
        axiosConfig
      );
      setReceptionists(res.data);
      setLoading(false);
    } catch (err) {
      setMessage("Failed to load receptionists");
      setMessageType("danger");
      setLoading(false);
    }
  };

  // Start editing: set editingId and current shift
  const handleEdit = (rec) => {
    setEditingId(rec.userID);
    setEditShift(rec.shift || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditShift("");
  };

  // Save edited shift - important: send full DTO with all required props
  const saveEdit = async () => {
    try {
      // Your DTO requires UserID, FirstName, LastName, Shift on update?
      // The backend only updates Shift but expects other props not null? 
      // Let's send full DTO from existing receptionist + updated shift
      const receptionist = receptionists.find((r) => r.userID === editingId);
      if (!receptionist) throw new Error("Receptionist not found");

      const dto = {
        userID: receptionist.userID,
        firstName: receptionist.firstName,
        lastName: receptionist.lastName,
        shift: editShift,
      };

      await axios.put(
        `https://localhost:7117/api/RoomRecepsionist/updateRoomRecepsionist/${editingId}`,
        dto,
        axiosConfig
      );
      setMessage("Receptionist shift updated successfully");
      setMessageType("success");
      setEditingId(null);
      fetchReceptionists();
    } catch (err) {
      setMessage("Failed to update shift");
      setMessageType("danger");
    }
  };

  // Delete receptionist
  const deleteReceptionist = async (userID) => {
    if (!window.confirm("Are you sure you want to delete this receptionist?"))
      return;
    try {
      await axios.delete(
        `https://localhost:7117/api/RoomRecepsionist/deleteRoomRecepsionist?id=${userID}`,
        axiosConfig
      );
      setMessage("Receptionist deleted successfully");
      setMessageType("success");
      fetchReceptionists();
    } catch (err) {
      setMessage("Failed to delete receptionist");
      setMessageType("danger");
    }
  };

  // Add new receptionist
  // NOTE: assignedByUserId should come from your logged-in user info (here hardcoded)
  const assignedByUserId = 1;

  const addReceptionist = async () => {
    if (!newUserID || !newFirstName || !newLastName || !newShift) {
      setMessage("Please fill all new receptionist fields");
      setMessageType("danger");
      return;
    }

    const dto = {
      userID: parseInt(newUserID),
      firstName: newFirstName,
      lastName: newLastName,
      shift: newShift,
    };

    try {
      await axios.post(
        `https://localhost:7117/api/RoomRecepsionist/addRoomRecepsionist/${assignedByUserId}`,
        dto,
        axiosConfig
      );
      setMessage("Receptionist added successfully");
      setMessageType("success");
      setNewUserID("");
      setNewFirstName("");
      setNewLastName("");
      setNewShift("");
      fetchReceptionists();
    } catch (err) {
      setMessage("Failed to add receptionist");
      setMessageType("danger");
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );

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
          <li className="nav-item">
            <i className="bi bi-house-door me-2"></i> Room Managing
          </li>
        </ul>

        {/* Receptionist management - current page, so no navigation */}
        <button
          className="btn btn-outline-light w-100 mt-3 mb-3"
          disabled
        >
          <i className="bi bi-people me-2"></i> Receptionist Management
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
      </aside>

      {/* Main content */}
      <main className="flex-grow-1 p-4">
        <h2 className="fw-bold text-primary mb-4">
          <i className="bi bi-person-lines-fill me-2"></i>Room Receptionist
          Dashboard
        </h2>

        {message && (
          <div
            className={`alert alert-${messageType} alert-dismissible fade show`}
            role="alert"
          >
            {message}
            <button
              type="button"
              className="btn-close"
              onClick={() => setMessage("")}
            ></button>
          </div>
        )}

        <div className="card">
          <div className="card-header bg-primary text-white">
            <i className="bi bi-person-lines-fill me-2"></i> Receptionists List
          </div>
          <div className="card-body p-0">
            <table className="table mb-0">
              <thead className="table-light">
                <tr>
                  <th>UserID</th>
                  <th>Full Name</th>
                  <th>Shift</th>
                  <th style={{ width: "180px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {receptionists.map((rec) => (
                  <tr key={rec.userID}>
                    <td>{rec.userID}</td>
                    <td>
                      {rec.firstName} {rec.lastName}
                    </td>
                    <td>
                      {editingId === rec.userID ? (
                        <select
                          className="form-select"
                          value={editShift}
                          onChange={(e) => setEditShift(e.target.value)}
                        >
                          <option value="">Select Shift</option>
                          <option value="Morning">Morning</option>
                          <option value="Afternoon">Afternoon</option>
                          <option value="Night">Night</option>
                        </select>
                      ) : (
                        rec.shift
                      )}
                    </td>
                    <td>
                      {editingId === rec.userID ? (
                        <>
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={saveEdit}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={cancelEdit}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-primary btn-sm me-2"
                            onClick={() => handleEdit(rec)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => deleteReceptionist(rec.userID)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}

                {/* Add new receptionist row */}
                <tr>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="UserID"
                      value={newUserID}
                      onChange={(e) => setNewUserID(e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control mb-1"
                      placeholder="First Name"
                      value={newFirstName}
                      onChange={(e) => setNewFirstName(e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Last Name"
                      value={newLastName}
                      onChange={(e) => setNewLastName(e.target.value)}
                    />
                  </td>
                  <td>
                    <select
                      className="form-select"
                      value={newShift}
                      onChange={(e) => setNewShift(e.target.value)}
                    >
                      <option value="">Select Shift</option>
                      <option value="Morning">Morning</option>
                      <option value="Afternoon">Afternoon</option>
                      <option value="Night">Night</option>
                    </select>
                  </td>
                  <td>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={addReceptionist}
                    >
                      Add
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RoomReceptionistDashboard;
